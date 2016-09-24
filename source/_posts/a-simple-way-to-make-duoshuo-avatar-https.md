title: 一个将多说的头像变成https的简单方法
date: 2016-09-24
tags:
  - https
  - 多说
  - blog
categories: 
  - 多说
---

最近启用全站https之后，却发现地址栏里面却还没有小绿锁 -- 检查了下网络请求，发现原来是多说搞的鬼：

> 多说的头像有一些不是https的，如：`http://wx.qlogo.cn/mmopen/5YxiaxTAIu0nOId2JW67SDEgJqPNjx33IeUNG5QJLuddhd45icL0R905icmdXbSib4H9FLib1IUsjA67ePswvZ9PxVA/0`

其实呢，就上面这个这个头像而言，将http协议改成https协议后其实也是能够访问的。所以呢，就有了一个很简单的解决方案：

<!-- more -->

首先，把多说的嵌入脚本下载保存到本地。

```
wget https://static.duoshuo.com/embed.js
```

其次，打开这个文件，格式化一下，找到`avatarUrl`这个函数，将其修改为这样：

```
avatarUrl: function (e) {
    return ((e.avatar_url || rt.data.default_avatar_url) + '').replace(/^http:/, location.protocol);
}
```

最后，压缩下这个js，并替换原本的js：

```
<script type="text/javascript">
    var duoshuoQuery = {short_name:"<%= config.duoshuo_shortname %>"};
    setTimeout(function() {
        var ds = document.createElement('script');
        ds.type = 'text/javascript';
        ds.async = true; 
        ds.src = '/lib/duoshuo-embed.min.js';
        ds.charset = 'UTF-8';
        (document.getElementsByTagName('head')[0]
                || document.getElementsByTagName('body')[0]).appendChild(ds);
    }, 10);
</script>
```

构建并发布网站，OK了。

