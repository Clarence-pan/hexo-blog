title: 微信小程序开发踩坑记
date: 2017-02-15 19:09:50
tags:
  - 微信
  - 小程序
  - 微信小程序
  - 开发
  - 坑
categories: 
  - 微信小程序
---

## 前言
微信小程序自去年公测以来，我司也申请了一个帐号开发，春节前后开始开发，现在终于告一个段落了。谨以此文记录下踩过的坑。
<!-- more -->

## 坑1：scroll-view与onPullDownRefresh冲突
由于有几个页面需要将导航tab栏自动置顶，所以使用了scroll-view。然而又想要下拉刷新，本来想直接使用onPullDownRefresh，结果却发现下拉的时候onPullDownRefresh根本没有！囧！

研究了半天，最终监听touchXXX自己模拟了个下拉刷新。（具体实现方案改日再分享。）为了尽量接近微信原生的下拉刷新，还特意抄了半天微信原生的下拉刷新动画...

```html
<div class="loading"><div class="dot"></div></div>
```
```css
.loading{
    display: block;
    width: 100%;
    height: 20px;
    padding: 20px 0;
    text-align: center;
    background: #eee;
}
.loading::before,
.loading .dot,
.loading::after
{
  content: '';
  display: inline-block;
  color: transparent;
  width: 14px;
  height: 14px;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  margin: 0 8px;
}

.loading::before,
.loading .dot,
.loading::after{
  -webkit-animation: pulldown-refresh-loader 1.4s infinite ease-in-out;
  animation: pulldown-refresh-loader 1.4s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.loading::before{
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loading .dot{
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes pulldown-refresh-loader {
  0%, 80%, 100% { background-color: #f0f0f0; }
  40% { background-color: #fff; }
}

@keyframes pulldown-refresh-loader {
  0%, 80%, 100% { background-color: #f0f0f0; }
  40% { background-color: #fff; }
}

```

<div><style>.loading{display:block;width:100%;height:20px;padding:20px 0;text-align:center;background:#eee}.loading .dot,.loading::after,.loading::before{content:"";display:inline-block;color:transparent;width:14px;height:14px;border-radius:14px;background:#fff;overflow:hidden;margin:0 8px;-webkit-animation:pulldown-refresh-loader 1.4s infinite ease-in-out;animation:pulldown-refresh-loader 1.4s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.loading::before{-webkit-animation-delay:-.32s;animation-delay:-.32s}.loading .dot{-webkit-animation-delay:-.16s;animation-delay:-.16s}@-webkit-keyframes pulldown-refresh-loader{0%,100%,80%{background-color:#f0f0f0}40%{background-color:#fff}}@keyframes pulldown-refresh-loader{0%,100%,80%{background-color:#f0f0f0}40%{background-color:#fff}}</style><div class="loading"><div class="dot"></div></div></div>

## 坑2：无法获取元素的高度

本来有个页面是要做成监听滚动，然后自动切换顶部tab的，类似 [ bootstrap的滚动监听](http://www.runoob.com/try/try.PHP?filename=bootstrap3-plugin-scrollspy&basepath=0) 的效果。 然而里面有大段的文本，而文本的高度根本算不来，囧。还是放弃这个效果吧。


## 坑3：无法在bindXXX的事件处理的时候阻止冒泡

有人说，你可以使用catchXXX呀！然而，我在某些时候才需要阻止事件冒泡，另外一些时候是不需要阻止冒泡的，是需要默认行为...

最终采用了一个很挫的方案来“解决” -- 复制那个`<view>`根据是否组织冒泡分别渲染成`bindXXX`或`catchXXX`...：

```
<view class="{{preventDefault && 'hide'}}" catchXXX="yyy" >zzz</view>
<view class="{{!preventDefault && 'hide'}}" bindXXX="yyy" >zzz</view>
```

这个还不能简单地使用`wx:if`，否则切换的成本太高了点。


## 坑4： 预览前构建时间比较长

貌似没有好办法，预览的构建貌似不是增量的，希望微信官方啥时候能改成增量的就好了。点击预览按钮后去倒杯水喝吧。


## 坑5： 组件复用好蛋疼

小程序里面虽然提供了`<template>`可以复用一部分模版，但是我们要是想复用一个具有完整功能组件（比如一个对话框 ）就会非常蛋疼 -- 数据怎么传呢？业务逻辑代码写在哪里？样式如何加载？

目前解决方法是将组件封装成 `xxx.js`， `xxx.wxml` 和 `xxx.wxss`，用的时候都要引用下... 好麻烦！很怀念React里面的组件。

回头考虑通过在微信小程序前面加一道构建，以便自动引用组件相关东东。


## 坑6：不支持webview直接嵌入html代码

像后台通过富文本编辑器录入的文章页面没法直接显示了... 还好有`wxParse`。尽管样式调起来很蛋疼，起码能看了。

## 坑7：测试与发布

微信开发者工具的预览版本只能谁登录谁来扫，其他人扫根本开不了 --- 同是一个小程序的开发者也不行，囧。为了让测试人员方便测试，还得教会测试人员如何登录微信开发者工具，如何更新代码，如何构建并预览小程序。。。 

啥，你说有“预览版本”，预览版本更麻烦，上传的时候只能管理员才能上传，上传完还必须选择为预览版本，预览版本还不是每个人能看的，而是加到预览者里面的才能看（开发者居然默认没有加到预览者里面！） -- 每一个操作都是要管理员扫码...


## 后记

微信小程序坑还有很多，未完待续...


