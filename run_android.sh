#!/bin/sh

echo "Start running application"
current=$(cd $(dirname $0); pwd)
echo "current directory: $current"

cd ./www_dev/
echo "change directory: $(cd $(dirname $0); pwd)"

echo "run grunt tasks."
grunt

mode=`cat mode.json`
if [[ "$mode" =~ ^{\"mode\":\ \"(.+)\"} ]] ; then
	mode=${BASH_REMATCH[1]}
	echo "application mode: $mode"
	echo "start cordova run for namie-tablet-$mode"
	cd $current
  	cd ../namie-tablet-$mode
  	cordova run android
fi



