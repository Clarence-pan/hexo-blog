title: 如何在静态博客中嵌入评论
date: 2015-09-10
tags:
    - hexo
    - 多说
    - comments
    - blog
categories:
    - blog
    - comments
---

背景
====

静态博客（如本博客使用的是hexo来生成的），有很多优点，比如能抗很大的流量，而且有<http://github.io>这样的免费的托管可以使用。但是，毕竟只是html，于是一般只能浏览，没法与访问者进行互动，访问者没法评论。这那能行呢？

<!-- more -->

这两天在访问[mindhacks上的一篇文章](http://mindhacks.cn/2012/08/27/modern-cpp-practices/)的时候，发现这位博主使用的多说挺有意思的，能提供对这种静态博客的评论。于是乎，闲暇之际在偶自己的静态博客试用下，看看如何...


偶的[多说](http://duoshuo.com)试用小记
====

首先，登录多说
-------------

进入[多说](http://duoshuo.com)的官网，然后有一个【我要安装】，点击后会提示登录。这时可以有好多种open API登录方式可以选择，偶就随便选个QQ登录，然后登录上去了。



接着，获取评论框代码
------------

[多说](http://duoshuo.com)的API还是很简洁的，除了公共js代码外，评论框就一行：

```
	<div class="ds-thread" data-thread-key="请将此处替换成文章在你的站点中的ID" data-title="请替换成文章的标题" data-url="请替换成文章的网址"></div>
```


然后，嵌入到博客中
-----------

本博客是hexo生成的，当然不能直接每篇文章都直接插入这段代码，肯定得用模版来插入。翻了下源代码，根据渲染出来的html结构去搜索（感谢grep，感谢xargs，感谢find...），再连猜带蒙，终于找到了渲染博客页面的模版文件：`themes/landscape/layout/_partial/article.ejs`。
定眼一看，原来hexo的这个模版已经包含了 *disqus* 的评论功能！晕，早知道就直接注册个 *disqus* 的帐号就好了。

```
    <footer class="article-footer">
      <%- partial('post/tag') %>
      <a data-url="<%- post.permalink %>" data-id="<%= post.path %>" class="article-share-link">Share</a>
      <% if (post.comments){ %>
          <% if (config.disqus_shortname){ %>
            <a href="<%- post.permalink %>#disqus_thread" class="article-comment-link">Comments</a>
          <% } %>
      <% } %>
    </footer>
```

不过事已至此，先把多说的评论功能加上去再说。

 多说的评论需要三个参数，经过研究hexo的模版和文档，总结如下：

| 参数 | 含义 | hexo模版的值 |
| --- | ---- | ---------- |
|thread-key | 文章ID | post.path |
|title | 文章标题 | post.title |
|url | 文章链接 | 域名+make_url(post.path)|

填充到模版中，就是：

```
    <footer class="article-footer">
      <%- partial('post/tag') %>
      <a data-url="<%- post.permalink %>" data-id="<%= post._id %>" class="article-share-link">Share</a>
      <% if (post.comments){ %>
        <div id="post-comments">
            <div class="ds-thread" data-thread-key="<%= post._id %>" data-title="<%= post.title %>" data-url="http://clarence-pan.github.io<%- url_for(post.path) %>"></div>
        </div>
      <% } %>
    </footer>
```

其次，多说公共JS的添加
--------------

经过上述步骤，还是不能跑起来的 —— 因为所有的前台交互都是在js里面，即多说公共JS。既然是公共的JS，那么其他页面也可能都会用到的，比如以后要在首页添加最新点评、添加热门文章之类的功能，也都需要这JS。
而且既然是JS，那最好应放到页面尾部，以防止阻塞页面（以防万一）。
找了下hexo的模版，发现有`footer.ejs`还有`after-footer.ejs`，显然`after-footer.ejs`位置更靠后，加进去试试：
```
// ...
<script src="/lib/jquery.min.js"></script>

<% if (theme.fancybox){ %>
  <%- css('fancybox/jquery.fancybox') %>
  <%- js('fancybox/jquery.fancybox.pack') %>
<% } %>

<%- js('js/script') %>

<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
<script type="text/javascript">
    var duoshuoQuery = {short_name:"clarence-pan"};
    (function() {
        var ds = document.createElement('script');
        ds.type = 'text/javascript';ds.async = true;
        ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
        ds.charset = 'UTF-8';
        (document.getElementsByTagName('head')[0]
                || document.getElementsByTagName('body')[0]).appendChild(ds);
    })();
</script>
<!-- 多说公共JS代码 end -->
```

最后，构建hexo并发布
------------------

`hexo generate --deploy` 搞定~

最后的问题 -- 样式
------------------
额，这个评论框左上角【喜欢】和右上角【分享】时候不太搭啊~~　调一调吧：
```css

#post-comments #ds-thread #ds-reset a.ds-like-thread-button
  float: left
  margin-top: -3em

.article-tag-list
  margin-left: 7em
```
在`article.styl`中加入以上代码，重新构建并发布，果然好看了点...


使用disqus
==============
相对于多说，disqus的嵌入就颇为简单了 —— hexo的模版已经嵌入好了，只要：
1. 打开[disqus](https://disqus.com)
2. 登录/注册，可以直接用google/facebook/twitter帐号快速登录~
3. 点击右上角人物头像右边的齿轮，然后选择[Add Disqus To Site](https://publishers.disqus.com/engage?utm_source=Home-Nav)
4. 填写网站，并选个合适的短名称
5. 把短名称填入`_config.yml`中，如偶的是：

```yaml
disqus_shortname: clarence-pan
```

6. 构建，发布即可

over~


附：评论插件比较
=======================

|          | 登录方式                           | 评论格式 | 其他           |
|----------|------------------------------------|----------|----------------|
| 多说     | QQ、新浪、网易、搜狐、豆瓣、人人等 | 纯文本   |                |
| disqus   | Disqus, Facebook, Twitter, Google  | 文本 + 图片   | 需要翻墙！！！ |
| 待续.. |                                    |          |                |

可见多说是以国内用户为主的，disqus是以国外和可翻墙用户为主的。不过对于偶们开发人员，翻个墙还不是小意思吗。

附：参考文档
============
1. [mindhacks上的一篇文章](http://mindhacks.cn/2012/08/27/modern-cpp-practices/)
2. [hexo中文文档](https://hexo.io/zh-cn/docs/index.html)
3. [多说评论框调用代码参数说明](http://dev.duoshuo.com/docs/5003ecd94cab3e7250000008/)
4. [告别多说，拥抱 Disqus](http://blog.jamespan.me/2015/04/18/goodbye-duoshuo/)
