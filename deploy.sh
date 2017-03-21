#!/bin/sh -e

sh ./build.sh
if [ "$?" != '0' ]; then
	exit "$?";
fi;

hexo deploy


## deploy to http://clarence-pan.gitcafe.io/
## -- deprecated -- gitcafe is gone
#cd ../blog-git
#if [ "$?" != '0' ]; then
#	echo "Error: no blog-git found!";
#	exit 1;
#fi;
#
#echo '> pulling pages from github'
#git fetch origin master && git merge origin/master --no-edit
#
#echo '> pushing pages to gitcafe'
#git push -uf gitcafe master:gitcafe-pages

