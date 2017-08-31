title: "HTML中嵌入SVG图片的N种方式"
date: 2017-08-31
tags:
  - HTML
  - SVG
categories: 
  - SVG
---

最近用到了个SVG图片，里面还是带`<image>`标签的，想要把它嵌入到HTML中还是有些工作要做的。

<!-- more -->

## 经历

最初的图片是这样写的：

```svg
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1"
     preserveAspectRatio="xMinYMin meet"
     width="660" height="342"
     xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">

    <image xlink:href="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png" width="660" height="342"/>

    <rect x="2" y="284" width="656" height="58" fill="rgba(0,0,0,0.6)" stroke-width="1" ></rect>

    <text text-anchor="start"
          font-family="Microsoft Yahei, sans-serif" font-size="28"
          x="20" y="322" fill="#fff">这是百度</text>
    <text text-anchor="end"
          font-family="Microsoft Yahei, sans-serif" font-size="28"
          x="640" y="322" fill="#fff">😄</text>
</svg>
```
p.s. 先拿百度的图片来凑个数

显示效果应该是：

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2nvw72qlj30i809ljs0.jpg)

但是通过`<img>`标签插入到HTML中后却变成了这样：

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2nxkg180j309806wwf7.jpg)

W.T.F!

查了半天[MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image)，也没有什么收获。

最后在 [StackOverflow](https://stackoverflow.com/questions/41195669/images-in-svg-image-tags-not-showing-up-in-chrome-but-displays-locally) 上找到了一个解决方案：即使用`<embed>`标签。

修改成`<embed src="./test.svg" style="display:block;width:330px;height:240px" />`后却显示成了：

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2oqz27nej309r07j3yi.jpg)

只显示了图片左上角那部分有木有！这张图片是按2倍图做的，应该要缩小一半，虽然给`<embed>`的元素加了宽高，但是却没能把svg内容给缩放！

怎办？又找了半天解决方案，发现这种情况应该设置svg图片的viewBox -- 在`<svg>`元素上增加`viewBox="0 0 660 342"`即可解决这个问题：

> viewBox属性允许指定一个给定的一组图形伸展以适应特定的容器元素。
> -- [viewBox - MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/viewBox)

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2oudb4bjj309504wq31.jpg)

完美！

## 总结HTML中嵌入SVG图片的N种方式

在解决这个问题的过程中，顺便查了下，发现除了`<img>`和`<embed>`外还有几种嵌入SVG图片的方法。在此总结下：

### 0. 使用`svg`标签

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2pw6rk46j309o05l74e.jpg)

即直接把svg整个标签内容（除了开头的xml和doctype声明外的svg文件内容）都丢到 HTML 中即可。
可惜不适合本例 -- 我们这次的svg是外部的，不好放入HTML中。

### 1. 使用`img`标签

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2pwi60wcj309e05edgb.jpg)

```html
<img src="./test.svg" style="display:block;width:330px;height:240px" />
```

这个是最容易想到的 -- 因为svg图片也是图片嘛。
需要注意的是，svg里面带的`<image>`标签将无法正常显示。`<img>`标签适合显示纯矢量+文本的SVG图片。

### 2. 使用`iframe`标签

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2pww813uj309j07bt8n.jpg)

```html
<iframe src="./test.svg" style="display:block;width:330px;height:240px;border:none;" ></iframe>
```

万能的iframe当然什么都能显示，但是无法控制内容大小 -- viewBox也搞不定，估计只能用百分比来定位了，太麻烦了，不建议使用。

### 3. 使用`embed`标签

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2px7d87xj309o05e0su.jpg)

```html
<embed src="./test.svg" style="display:block;width:330px;height:240px" />
```
注意使用viewBox，`<embed>`标签的兼容性也很不错的，是个不错的选择。

### 4. 使用`object`标签

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2pxh0j7gj309g054wel.jpg)

```html
<object type="image/svg+xml" data="./test.svg" style="display:block;width:330px;height:240px" >
    <param name="src" value="./test.svg" >
</object>
```

`<object>`与`<embed>`类似，也要注意配置viewBox.

### 5. 使用`div`的背景图片

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2pxsxvt2j309h05gjrv.jpg)

```html
<div style="display:block;width:330px;height:240px;background: url(./test.svg) no-repeat;background-size: 100%;" ></div>
```

svg图片是可以作为背景图片的。不过和`<img>`标签一样，无法显示SVG内嵌的`<image>`.

### 6. 使用`picture`标签

![](https://ww1.sinaimg.cn/large/006Vei6ogy1fj2py3gul6j309l05bdgb.jpg)

```html
<picture >
    <source srcset="./test.svg"  type="image/svg+xml">
    <img src="./test.png" style="display:block;width:330px;height:240px">
</picture>
```

`<picture>`标签是HTML5新增的一个专门显示图片的标签。

注意设置`<source>`标签的属性`srcset`而非`src`. 此外必需要添加一个`<img>`标签，不过可以在`<img>`标签中指定另外一张图片，以便在浏览器无法显示`<source>`指定的图片的时候显示`<img>`标签中的图片。

`<picture>`和`<img>`一样，无法显示SVG内嵌的`<image>`.

### 附完整带测试代码:
<script src="https://gist.github.com/Clarence-pan/be0a2c14df52a39095b93054a77123c9.js"></script>

