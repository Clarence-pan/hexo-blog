title: 一个关于systemd私有目录的奇怪问题
date: 2016-08-12
tags:
  - httpd
  - systemd
  - php
categories: 
  - php
---

今天遇到一个奇怪的问题 -- PHP里面访问不了`/tmp/xhprof-data`目录，可是这个目录明明是存在的！

<!-- more -->

今天要使用xhprof进行性能分析，但是打开性能分析开关然后访问页面后却发现没有任何性能数据，很奇怪。

检查了下httpd的日志，发现有个fatal error： `PHP Fatal error:  Uncaught exception 'ErrorException' with message 'fopen(/tmp/xhprof-data/57ad36118dcf0.default.xhprof): failed to open stream: No such file or directory' `

而对应的PHP代码是类似这样：`$file = fopen($filePath, 'w');`

一般来说这个错误应该是目录不存在或权限不足导致的。那么就检查下对应的目录：

```
➜  /tmp$ ll -d xhprof-data
drwxrwxrwx. 2 apache apache 41 Aug 12 10:34 xhprof-data
```

目录是存在的呀，而且为了让PHP能访问，特意设置了全部可以读写，并且所属的用户和组都是apache。

然后在代码里面测试下这个目录是否可以访问：

```php
// 简单粗暴点，直接加一行打印看看
var_dump(is_dir(dirname($filePath)));die;
```

结果令人吃惊 -- 居然打印出来是`false`。

难道路径错了吗？把路径也重新打印出来核对下：

```php
// 简单粗暴点，直接加一行打印看看
var_dump(dirname($filePath));die;
```

路径打印出来就是`/tmp/xhprof-data`，没有错！

奇葩问题呀！

最后尝试删除掉这个目录，然后在PHP里面加一行自动创建目录：

```
is_dir(dirname($filePath)) or mkdir(dirname($filePath), 0777, true);
```

结果，居然通了！到tmp目录下看看跟之前创建的有啥区别：

```
➜  /tmp$ ll xhprof-data
ls: cannot access xhprof-data: No such file or directory
```

奇怪了，目录呢？ 使用find找下试试：

```
➜  /tmp$ find . -type d -name xhprof-data 
find: ‘./systemd-private-bd5ddddffb9240cdad836fe13ccb096d-httpd.service-kCEghE’: Permission denied
➜  /tmp$ sudo !!
➜  /tmp$ sudo find . -type d -name xhprof-data
./systemd-private-bd5ddddffb9240cdad836fe13ccb096d-httpd.service-kCEghE/tmp/xhprof-data
```

原来是放到了`systemd-private-bd5ddddffb9240cdad836fe13ccb096d-httpd.service-kCEghE`下面。

这个是个什么鬼？ 据google一下的结果，原来是systemd可以配置`/tmp`目录为私有目录，以防冲突而创建的。检查下配置：

```
➜  /tmp$ cat /usr/lib/systemd/system/httpd.service | grep PrivateTmp
PrivateTmp=true
```

果然是有对应的这个配置。


涨姿势了。特此记录。
