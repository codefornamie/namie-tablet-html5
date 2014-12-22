#!/bin/sh
#====================================================#
# mime typeの判定
#====================================================#
get_mime () {
filename=$1

ext=`echo $filename | sed -e 's/^.*\.\(.*\)$/\1/'`
res=`grep -ie "^$ext=" $MIME_FILE | sed -e 's/^.*=\(.*\)$/\1/'`
if [ -z "$res" -a -f "$filename" ]; then
	res=`file -b --mime "$filename"`
fi
echo "$res"
}
#====================================================#
# 環境固有文字列の置き換え
#====================================================#
rep () {
file=$1
TMP=/tmp/.$$.sed
IFS='='
cat $CONF_FILE | grep -e "^$ENV\.replace\." | sed -e "s/^$ENV\.replace\.//" | while read key val
do
	echo "s|${key}|$val|g"
done > $TMP
sed -f $TMP $file
rm $TMP
}

#====================================================#
# コレクションの作成
# 既に存在する場合、405が返る。
#====================================================#
mkcol () {
if [ -z $1 ]; then
    path=$1
else
    path=/$1
fi

RES=`curl -X MKCOL "${COL_URL}${path}" -O -d "<?xml version=\"1.0\" encoding=\"utf-8\"?><D:mkcol xmlns:D=\"DAV:\" xmlns:dc=\"urn:x-dc1:xmlns\"><D:set><D:prop><D:resourcetype><D:collection/></D:resourcetype></D:prop></D:set></D:mkcol>" -H "Authorization:Bearer ${TOKEN}" -i -k -s -w "__status_code=%{http_code}\n" | grep -e '__status_code=[12345]' | sed -e 's/__status_code=//'`
echo $RES
}

#====================================================#
# ファイルの登録
#====================================================#
putfile () {
path=$1
file=$2
mode=$3
mimetype="`get_mime \"$file\"`"
echo $file $mimetype >> kuro.log
if [ $mode = "a" ]; then
	CONVFILE=/tmp/.$$.conv
	rep "$file" > $CONVFILE
	file=$CONVFILE
fi
RES=`curl -X PUT "${COL_URL}/${path}" -T "$file" -H "Content-Type: $mimetype" -H "Authorization:Bearer ${TOKEN}" -i -k -s -w "__status_code=%{http_code}\n" | grep __status_code | sed -e 's/__status_code=//'`

if [ -n "$CONVFILE" ]; then
	rm $CONVFILE
fi

echo $RES
}

#====================================================#
# メイン
#====================================================#
if [ $# -ne 3 ]; then
    if [ -z "${BAMBOO_UNIT_USER_NAME}" ]; then
	    echo usage: $0 env_name src_dir token
	    exit 1
	fi
fi
PGHOME="`dirname $0`"
CONF_FILE=$PGHOME/deploy.conf
MIME_FILE=$PGHOME/mime.conf

# confファイルの存在チェック
if [ \! -r "$CONF_FILE" ]; then
	echo "no such conf file: $CONF_FILE"
	exit 1
fi

# mimeファイルの存在チェック
if [ \! -r "$MIME_FILE" ]; then
	echo "no such 'mime type map' file: $MIME_FILE"
	exit 1
fi

ENV=$1
SRC_DIR=$2
TOKEN=$3

# advパスへ配備するかどうか。デフォルトはfalse
adv=false

TMPMAP=/tmp/.$$.map
cat $CONF_FILE | grep -e "^$ENV\.[^.]*=" | sed -e "s/^$ENV\.//" > $TMPMAP
. $TMPMAP
rm $TMPMAP

if [ -n "${BAMBOO_UNIT_USER_NAME}" ]; then
    echo "start authenticate unituser."
    echo "grant_type=password&username=${BAMBOO_UNIT_USER_NAME}&password=****&dc_target=${base_url}"
    RESP=`curl -X POST "${base_url}/servicemanager/__auth" -d "grant_type=password&username=${BAMBOO_UNIT_USER_NAME}&password=${BAMBOO_UNIT_USER_PASSWORD}&dc_target=${base_url}" -i -k -s`
    TOKEN=`echo $RESP | sed -e 's/^.*access_token":"\(.*\)","refresh.*$/\1/'`
    echo "get unit user token."
fi

COL_URL="`echo $dav_url | sed -e 's|/$||'`"
echo $COL_URL

#--------------------
# adv用のDAVコレクション作成
#--------------------
if [ ${adv} = "true" ]; then
    RES=`mkcol`
    if [ "$RES" = "405" ]; then
        RES="_$RES"
    fi
    printf "%4s %s %s\n" $RES d adv
    if echo $RES | grep -e '^[45]'; then
        echo "Abnormal end."
        exit 1
    fi
fi


#--------------------
# アップロード
#--------------------
find $SRC_DIR -mindepth 1 | while read file
do
	davpath=`echo $file | sed -e "s|^$SRC_DIR/*||"`
	if [ -d "$file" ]; then
		RES=`mkcol $davpath`
		if [ "$RES" = "405" ]; then
			RES="_$RES"
		fi
		mode=d
	else
		if file "$file" | grep text > /dev/null; then
			mode=a
		else
			mode=b
		fi
		RES=`putfile $davpath "$file" $mode`
	fi
	printf "%4s %s %s\n" $RES $mode $davpath
	if echo $RES | grep -e '^[45]'; then
		echo "Abnormal end."
		exit 1
	fi
done

