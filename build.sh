#!/bin/sh

cd `dirname $0`

git add -A .
git commit -m "auto commit"

git pull origin master
if [ "$?" != "0" ]; then 
	echo "Pull from origin failed!"
	exit 1;
fi

hexo generate
cp -f source/test/* public/test/
cp -f source/lib/* public/lib/
