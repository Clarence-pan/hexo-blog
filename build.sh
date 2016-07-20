#!/bin/sh

cd `dirname $0`

git add -A .
git commit -m "auto commit"

git fetch origin master
git merge origin/master --no-edit
if [ "$?" != "0" ]; then 
	echo "Pull from origin failed!"
	exit 1;
fi

hexo generate
cp -f source/test/* public/test/
cp -f source/lib/* public/lib/
