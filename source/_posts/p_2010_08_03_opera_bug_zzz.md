title: Opera的一个小BUG
date: 2010-08-03
tags:
  - Opera
  - Browser
categories:
  - Browser
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2010/08/03/opera_bug_zzz.html) Post date: 2010-08-03 09:32

简介
====

这个BUG是关于\<!DOCTYPE\>标签的。

这个标签一般可以简单的写作：

~~~~ {.brush:csharp}
<!DOCTYPE HTML>
~~~~

表示这是一个HTML文档

对于HTML 4.01的三个标准分别还有三种写法 详见[http://www.w3school.com.cn/tags/tag\_doctype.asp](http://www.w3school.com.cn/tags/tag_doctype.asp)

发现
====

最近使用eclipse做jsp网页，其中自动生成的\<!DOCTYPE\>标签为：

~~~~ {.brush:csharp}
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" >
~~~~

乍一看也没什么问题，平时也没注意到有什么问题

当用jQuery时就出现问题了：

正常显示：

![](http://pic002.cnblogs.com/img/pcy/201008/2010080309175851.png)

不正常显示：

![](http://pic002.cnblogs.com/img/pcy/201008/2010080309184090.png)

不正常的地方： 对话框的标题变高了，Cancel和ok按键也是位置变高了

一开始我还以为是Opera内置的默认样式的问题（IE,chrome，firefox下正常显示），把默认样式覆盖掉，依旧还有这样的问题

然后，采用原始的办法，把页面中其他元素去掉，只留这个对话框所必须的，再把jsp生成的源代码和正常显示的代码一行行相比较……

最终发现是\<!DOCTYPE\>这个元素的问题：估计是Opera找不到那个DTD。

解决
====

把jsp中\<!DOCTYPE\>改成一下两种即可正常显示：

~~~~ {.brush:html}
<!DOCTYPE html> <!-- 使用默认DTD也行 -->
~~~~

 或

~~~~ {.brush:html}
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
~~~~

无论用HTML或XHTML最后这个URL都要指定，防止找不到DTD。如果找不到，浏览器将使用公共标识符后面的 URL 作为寻找 DTD 的位置。
