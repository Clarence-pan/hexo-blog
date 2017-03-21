title: HTTP2试用小记
date: 2016-11-17
tags:
  - nginx
categories: 
  - nginx
---

这两天把公司的网站升级到了全站https. 顺便瞄到了[HTTP2的浏览器支持情况](http://caniuse.com/#search=http2)：

![](//ww1.sinaimg.cn/large/bf5f3c73gw1f9v3qb02raj20z90epwij.jpg)

支持得还都蛮好的嘛。忍不住试用了一把HTTP2 -- 就直接拿[本博客](https://www.clarencep.com)来做示例了。

<!-- more -->

## 升级nginx

主流浏览器基本上都支持了HTTP2，但是nginx只有升级到1.10以上版本才行 -- 鄙站之前用的还是nginx 1.6的某个版本。

更新了下apt-get，发现仓库中没有1.10版本 -- 囧 -- 只好自己编译吧：

首先，下载nginx和openssl：

```sh
cd /usr/local/src

wget https://nginx.org/download/nginx-1.11.6.tar.gz
tar xzf nginx-1.11.6.tar.gz

wget https://www.openssl.org/source/openssl-1.1.0c.tar.gz
tar xzvf openssl-1.1.0c.tar.gz

```

然后，编译nginx：

```sh

cd nginx-1.11.6
./configure --prefix=/usr/local/nginx \
  --conf-path=/etc/nginx/nginx.conf \
  --with-openssl=../openssl-1.1.0c \
  --with-http_v2_module \
  --with-http_ssl_module \
  --with-http_gzip_static_module
  
make && sudo make install

# 为了方便全局执行，则创建个符号链接：
sudo ln -s /usr/local/nginx/sbin/nginx /usr/sbin/nginx

```

接着，就是移植老的配置了，老的配置都可以直接使用，直接拷贝过来即可。
最后，启用HTTP2 -- 目前HTTP2只能和ssl(https)一起使用，只要修改下listen语句即可：

```
# 老的配置：
# listen 443;
# 新的配置（启用http2）:
  listen 443 ssl http2;
```

别忘了重启nginx (`sudo nginx -s reload`).


## 尝试通过HTTP2访问

搞定nginx后，随手拿个chrome就可以使用HTTP2了 -- chrome 49及以上版本都支持HTTP2，还好chrome会自动升级，基本不用担心chrome太老。

打开F12查看下HTTP头部，果然Request Headers都不一样了：

![](//ww2.sinaimg.cn/large/bf5f3c73gw1f9v473ftnoj20a40f7myj.jpg)

这些`:authority`, `:method` 和 `:path` 等冒号打头的就是HTTP2的特征之一 -- 手边没有抓包工具，只能这样粗浅的判断了。

看看HTTP2的流水：

![](//ww1.sinaimg.cn/large/bf5f3c73gw1f9v4aad7zsj216x02faag.jpg)

再比比HTTP1.1的流水：

![](//ww4.sinaimg.cn/large/bf5f3c73gw1f9v4ajjs6bj216w02i0te.jpg)

HTTP2的流水简洁多了，有没有！

## 性能PK

HTTP2的性能一般应该比HTTP1.1的高一些，但是，可不一定哟：

![](//ww2.sinaimg.cn/large/bf5f3c73gw1f9v3l9va5nj20mc081acu.jpg)

上图是[本博客首页](https://www.clarencep.com)在相同nginx、相同PC、相同网络条件下对HTTP2和HTTP1.1分别测试的PK结果。 可见虽然HTTP2的网络加载时间（Load）比HTTP1.1要短，但是DOM渲染时间（DOMContentLoaded）却比HTTP1.1要长。。。

可能是由于本博没有专门为HTTP2优化所至。也可能是浏览器渲染没有为HTTP2优化的缘故。

最后总结一句：HTTP2入坑要谨慎。

