#!/bin/sh

echo "Start running application"
current=$(cd $(dirname $0); pwd)
echo "current directory: $current"

cd ./www_dev/
echo "change directory: $(cd $(dirname $0); pwd)"

echo "run grunt tasks."
grunt

cd $current
echo "change directory: $current"

cordova run android

