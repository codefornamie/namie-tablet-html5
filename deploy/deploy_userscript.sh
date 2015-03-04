#!/bin/sh

endpoints=(
    "radiation_log.js" \
    "radiation_cluster.js"
    )
requirejs=(
    "common.js"
)

RETRY_COUNT=3

deploy_api() {
    _url=$1
    _expect="$2"
    requestUrl=${_url}
    printf "${requestUrl}"

    _result=`curl "${requestUrl}" -X PUT -H "Authorization:Bearer \"${TOKEN}\"" --data-binary @${SRC_DIR}/${scriptFile} -i -s -H "Content-Type: text/javascript" -k --retry ${RETRY_COUNT}`

    if [[ "$_result" =~ $_expect ]]; then
        echo " ..OK"
        return 0
    else
        echo " ..NG"
        echo "$_result"
        return 1
    fi
}

#====================================================#
# メイン
#====================================================#
if [ $# -ne 3 ]; then
    if [ -z "${bamboo_UNIT_USER_NAME}" ]; then
        echo usage: $0 env_name src_dir
        exit 1
    fi
fi

PGHOME="`dirname $0`"
CONF_FILE=$PGHOME/deploy.conf

# confファイルの存在チェック
if [ \! -r "$CONF_FILE" ]; then
    echo "no such conf file: $CONF_FILE"
    exit 1
fi

BUILD=0
while getopts :be:d:t: OPT
do
    case $OPT in
        b)  BUILD=1
            ;;
        e)  ENV=$OPTARG
            ;;
        d)  SRC_DIR=$OPTARG
            ;;
        t)  TOKEN=$OPTARG
            ;;
    esac
done

if [ $BUILD -eq 1 ]; then
    current=$(cd $(dirname $0); pwd)
    cd ../www_dev/
    grunt us
    cd $current
fi

#ENV=$1
#SRC_DIR=$2
#TOKEN=$3

TMPMAP=/tmp/.$$.map
cat $CONF_FILE | grep -e "^$ENV\.[^.]*=" | sed -e "s/^$ENV\.//" > $TMPMAP
. $TMPMAP
rm $TMPMAP
if [ -z "${TOKEN}" ]; then
    if [ -n "${bamboo_UNIT_USER_NAME}" ]; then
        echo "start authenticate unituser."
        echo "grant_type=password&username=${bamboo_UNIT_USER_NAME}&password=****&dc_target=${base_url}"
        RESP=`curl -X POST "${base_url}/servicemanager/__auth" -d "grant_type=password&username=${bamboo_UNIT_USER_NAME}&password=${bamboo_UNIT_USER_PASSWORD}&dc_target=${base_url}" -i -k -s`
        TOKEN=`echo $RESP | sed -e 's/^.*access_token":"\(.*\)","refresh.*$/\1/'`
        echo "get unit user token."
    fi
fi

echo "start deploy userscript."

for scriptFile in ${endpoints[@]}
do
    deploy_api "${service_url}/__src/${scriptFile}" "(HTTP/1.1 201|HTTP/1.1 204)"

    if [ $? -eq 1 ]; then
        echo "failed deploy userscript."
        exit 1
    fi
done

for scriptFile in ${requirejs[@]}
do
    deploy_api "${service_url}/__src/${scriptFile}" "(HTTP/1.1 201|HTTP/1.1 204)"

    if [ $? -eq 1 ]; then
        echo "failed deploy userscript."
        exit 1
    fi
done

printf "start creating service xml definition. ${service_url}"

dcPathXml=''
for endpoint in ${endpoints[@]}
do
    dcPathXml=${dcPathXml}'<dc:path name="'${endpoint%.js}'" src="'${endpoint}'"/>'
done

pioXml='<?xml version="1.0" encoding="utf-8" ?><D:propertyupdate xmlns:D="DAV:" xmlns:dc="urn:x-dc1:xmlns"><D:set><D:prop><dc:service language="JavaScript" subject="ukedon">'${dcPathXml}'</dc:service></D:prop></D:set></D:propertyupdate>'

_result=`curl ${service_url} -X PROPPATCH -i -s \
-H "Authorization: Bearer ${TOKEN}" \
-d "${pioXml}"`

if [[ ${_result} =~ (HTTP/1.1 207) ]]; then
    echo " ...OK"
else
    echo " ...NG"
    echo "pioXML: ${pioXml}"
    echo "result: ${_result}"
    echo "failed deploy userscript."
    exit 1
fi

echo "finished deploy userscript."