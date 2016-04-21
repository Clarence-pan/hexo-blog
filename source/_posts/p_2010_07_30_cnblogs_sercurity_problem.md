title: 博客园这登录的安全性
date: 2010-07-30
tags:
  - cnblogs
  - Security
categories:
  - Security
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2010/07/30/cnblogs_sercurity_problem.html) Post date: 2010-07-30 08:20

事情是这样的：

前天看到有人说QQ Mail未使用HTTPS，然后我就到mail.qq.com上看一下，结果发现QQ Mail登录是必须使用HTTPS的，还可以全程使用HTTPS……

再然后想到博客园登录是否是使用HTTPS呢？

 到博客园登录界面一看，没有HTTPS的标志。

![](http://pic002.cnblogs.com/img/pcy/201007/2010073008142365.png)

 抓个包试试呢？

 抓包结果：（使用Wireshark）

 

~~~~
POST /login.aspx HTTP/1.1

User-Agent: Opera/9.80 (Windows NT 5.1; U; Edition IBIS; zh-cn) Presto/2.6.30 Version/10.60

Host: passport.cnblogs.com

Accept: text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1

Accept-Language: zh-CN,zh;q=0.9,en;q=0.8

Accept-Charset: iso-8859-1, utf-8, utf-16, *;q=0.1

Accept-Encoding: deflate, gzip, x-gzip, identity, *;q=0

Referer: http://passport.cnblogs.com/login.aspx

Cookie: __gads=ID=0b8e2ba58fbea034:T=1279341585:S=ALNI_MbQjYDttpopP4ovrG6jjC2yz7UBXQ; SyntaxHighlighter=html; __utmz=226521935.1280297628.3.4.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=reflactor; __utma=226521935.112080506.1280280411.1280363182.1280371448.5

Cookie2: $Version=1

Connection: Keep-Alive, TE

TE: deflate, gzip, chunked, identity, trailers

Content-Length: 327

Content-Type: application/x-www-form-urlencoded



__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUJLTI5NjAzODk2ZBgBBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WAQULY2hrUmVtZW1iZXKHW0DW4nQrSrBHBomKrt3%2FMjtBLA%3D%3D&__EVENTVALIDATION=%2FwEWBQKE2u7lCQLyj%2FOQAgK3jsrkBALR55GJDgKC3IeGDO8x1Jd0k%2FhBY1a%2F6Yl9fTpP16ti&tbUserName=abc&tbPassword=123&btnLogin=%E7%99%BB++%E5%BD%95
~~~~

看到最后一行： tbUserName=abc&tbPassword=123

用户名和密码全是明文发送到服务器的。这安全性……

 
