#!/bin/sh -x

cd `dirname $0`

git add -A .
git commit -m "auto commit"

git fetch origin master
git merge origin/master --no-edit
if [ "$?" != "0" ]; then 
	echo "Pull from origin failed!"
	exit 1;
fi

node build.js

#./node_modules/.bin/hexo generate
#cp -f source/test/* public/test/
#cp -f source/lib/* public/lib/
#cp -f source/fe-lab/* public/fe-lab/
