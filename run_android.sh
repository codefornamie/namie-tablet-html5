#!/bin/sh

echo "Check attached Devices"
adb devices
echo "----------------"
devices=`adb devices | grep device | wc -l`
devices=`expr ${devices} - 1`
if [ ${devices} -lt 1 ]
then
    echo "attached device not found."
    echo "exit run android process."
    exit 1
fi

echo "Start running application"
current=$(cd $(dirname $0); pwd)
echo "current directory: $current"

cd ./www_dev/
echo "change directory: $(cd $(dirname $0); pwd)"

echo "run grunt tasks."
grunt $1

mode=`cat mode.json`
if [[ "$mode" =~ ^{\"mode\":\ \"(.+)\"} ]] ; then
	mode=${BASH_REMATCH[1]}
	echo "application mode: $mode"
	echo "start cordova run for namie-tablet-$mode"
	cd $current
  	cd cordova/$mode
  	platforms/android/cordova/clean
  	cordova run android
fi



