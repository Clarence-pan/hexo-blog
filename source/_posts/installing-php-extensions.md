title: 安装PHP扩展
date: 2015-12-12 16:08:49
updated:
tags:
	- PHP
	- extension
categories:
    - PHP
---


## 前言

PHP 的扩展相当丰富，可是有些扩展安装起来并不是那么地顺利，谨以此文汇总下我曾经遇到过的问题。

<!-- more -->

由于PHP版本也是在不断地更新，某些问题的解决方案以后可能会失效，所以此文仅作参考。

若有发现某个解决方案失效了，还请见谅，并欢迎指出以便更正。

## pecl/pear的安装
使用pecl/pear可以很方便地安装一些PHP扩展。
下载go-pear: http://pear.php.net/go-pear.phar
然后执行这个phar文件：
```sh
sudo php go-pear.phar
```
至于提示的目录设置，一般而言默认的就够用了。如需定制请自便。

安装好了后，建议将pear和pecl的目录加入到PATH中，或者可以加个软连接到path的某个目录中，以便以后使用，如：
```sh
ln -s /usr/local/Cellar/php56/5.6.16/bin/pecl /usr/local/bin/
ln -s /usr/local/Cellar/php56/5.6.16/bin/pear /usr/local/bin/
```

## 安装intl扩展
### 使用包管理进行安装
在debian/ubuntu/centos上都有对应的包：php5-intl, 直接使用apt或yum来安装即可:
```sh
sudo apt-get install -y php5-intl
```

可惜在 mac OS X 上并不能这样安装，只能通过pecl或源码安装

### 使用pecl进行安装
```sh
sudo pecl update-channels
sudo pecl install intl
```

如遇到询问icu的路径，则请寻找其路径并提供给安装程序，如：/usr/local/Cellar/icu4c/56.1

### 从源码安装
下载地址： http://pecl.php.net/package/intl
下载最新版本，然后解压缩后：
```sh
phpize
./configure
make
sudo make install
```

成功的安装将创建 intl.so 并放置于 PHP 的扩展库目录中。需要调整 php.ini，加入 extension=intl.so 这一行之后才能使用此扩展库。


### 问题：icu-config找不到？
现象：
```
checking for icu-config... no
checking for location of ICU headers and libraries... not found
configure: error: Unable to detect ICU prefix or no failed. Please verify ICU install prefix and make sure icu-config works.
```
解决方案：
对于debian/ubuntu/centos则可以安装下`icu libicu libicu-devel`：
```sh
sudo apt-get install -y icu libicu libicu-devel
```
对于mac OS X则需要安装`icu4c`:
```sh
brew install icu4c
```

然后再编译intl的时候提供这个icu的路径，如：
```sh
cd path/to/intl-v3.0.0
./configure --with-icu-dir=/usr/local/Cellar/icu4c/56.1
```
注意：替换下版本号。

## 安装mcrypt扩展
mcrypt是一个功能很强大的加密算法扩展库，一般直接有这个的包
### 使用包管理功能安装
```sh
# for ubuntu/debian
sudo apt-get install php5-mcrypt

# for centos
sudo yum install libmcrypt libmcrypt-devel
sudo yum install php-mcrypt

# for OS X
brew install php56-mcrypt
```

### 从源码安装
// TODO: 待续 -- 目前在安装其依赖的mhash的时候一直有问题还没解决


## 一个常用的PHP编译配置参数
```sh
./configure --prefix=/usr/local/php\
 --with-libdir=lib64\
 --enable-fpm\
 --with-fpm-user=php-fpm\
 --with-fpm-group=www\
 --enable-mysqlnd\
 --with-mysql=mysqlnd\
 --with-mysqli=mysqlnd\
 --with-pdo-mysql=mysqlnd\
 --enable-opcache\
 --enable-pcntl\
 --enable-mbstring\
 --enable-soap\
 --enable-zip\
 --enable-calendar\
 --enable-bcmath\
 --enable-exif\
 --enable-ftp\
 --enable-intl\
 --with-openssl\
 --with-zlib\
 --with-curl\
 --with-gd\
 --with-zlib-dir=/usr/lib\
 --with-png-dir=/usr/lib\
 --with-jpeg-dir=/usr/lib\
 --with-gettext\
 --with-mhash\
 --with-ldap
```
