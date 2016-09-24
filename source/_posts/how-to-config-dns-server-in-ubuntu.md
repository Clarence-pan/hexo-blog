title: Ubuntu下配置DNS服务器
date: 2015-07-30
updated: 2015-09-10
tags:
    - linux
    - DNS
categories:
    - linux
    - DNS
---

# 一、安装DNS服务器-bind9
bind9可以直接用apt-get安装：
```
sudo apt-get install bind9
```

<!-- more -->

#二、配置服务器
bind9的配置文件在`/etc/bind/`目录下，入口文件是`named.conf`，这个文件包含了`named.conf.options`, `named.conf.local`和`named.conf.default-zones`。
其中`named.conf.options`中包含了以下内容：

```
options {
	// 缓存目录
    directory "/var/cache/bind";

	// 本机解析不了的DNS该转发到哪里
    forwarders {
        8.8.8.8;
    };  

    dnssec-validation auto;

    auth-nxdomain no;    # conform to RFC1035
    listen-on-v6 { any; };
};
```

`named.conf.local`一般是空的，不用管它。
`named.conf.default-zones`中包含了解析的域名的配置，节选如下：

```
// 正向解析配置，即从域名localhost解析到127.0.0.1
zone "localhost" {
        type master;
        file "/etc/bind/db.local";
};

// 反向解析配置，即从IP 127.0.0.1解析到localhost
zone "127.in-addr.arpa" {
        type master;
        file "/etc/bind/db.127";
};
```
具体的配置都在文件`db.xxxx`中，比如`db.local`中如下：
```
;
; BIND data file for local loopback interface
;
$TTL    604800

; 下面的root.localhost.是管理员邮箱，其中的'@'被替换为了'.'
@       IN      SOA     localhost. root.localhost. (
                              2         ; Serial 即序列号，或者说版本号，每次改动后应修改下这里
                         604800         ; Refresh 刷新时间(单位秒，下同)
                          86400         ; Retry 重试时间
                        2419200         ; Expire 过期时间
                         604800 )       ; Negative Cache TTL 缓存TTL
;
@       IN      NS      localhost.      ; 指定域名
@       IN      A       127.0.0.1		; A记录，即指向IPv4地址的记录
@       IN      AAAA    ::1             ; 指向IPv6地址的记录
```

# 三、 如何增加一条DNS记录
最简单的办法，copy+paste，然后改吧改吧试试，比如增加`example.com`的记录:
1. 从`db.local`拷贝成`db.example`, 然后把里面的`localhost`都改成`example.com`:
```
$TTL    604800
@       IN      SOA     example. root.example. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      example.
@       IN      A       127.0.0.1
@       IN      AAAA    ::1
```
2. 将`named.conf.default-zones`中的`localhost`的zone拷贝一份，将`localhost`都改成`example.com`:
```
zone "example.com" {
        type master;
        file "/etc/bind/db.example";
};
```
3. 重启bind9服务
```
$ sudo /etc/init.d/bind9 restart
 * Stopping domain name service... bind9                                                                                waiting for pid 2759 to die
                                                                                           [ OK ]
 * Starting domain name service... bind9                                                   [ OK ]
```
4. 好了，试试解析`example.com`，此处就使用简单方便的`dig`:
```
$  dig @localhost example.com

; <<>> DiG 9.9.5-4.3ubuntu0.3-Ubuntu <<>> @localhost example.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 59594
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;example.com.			IN	A

;; ANSWER SECTION:
example.com.		604800	IN	A	127.0.0.1

;; AUTHORITY SECTION:
example.com.		604800	IN	NS	example.

;; Query time: 4 msec
;; SERVER: 127.0.0.1#53(127.0.0.1)
;; WHEN: Tue Aug 04 10:14:15 CST 2015
;; MSG SIZE  rcvd: 77
```
看到了`ANSWER SECTION: example.com.        604800  IN  A   127.0.0.1`，就说明OK了。

# 附 - 什么是A记录?
A记录，即主机记录，根据RFC 1035的定义，A记录用于将特定主机名映射到对应主机的IP地址上。
常见的DNS资源记录还有：
- CNAME - 别名记录，将某个主机名映射到另外一个主机名
- AAAA - IPv6记录，类似A记录，是映射到IPv6地址
- NAPTR - 正则表达式匹配域名然后映射

