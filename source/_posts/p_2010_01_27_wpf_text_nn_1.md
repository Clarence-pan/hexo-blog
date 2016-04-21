title: WPF中花文字小感
date: 2010-01-27
tags:
  - WPF
  - C#
categories:
  - C#
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2010/01/27/wpf_text_nn_1.html) Post date: 2010-01-27 17:28

　　WPF是一个好东东

用它来设计界面很方便，只要是能想得到的界面，都能很轻松使用WPF设计出来（相比WIN FORM和MFC）

但是WPF缺点也很多，首先是运行库太大来，一个WPF程序没有个几十兆的内存是运行不起来的

其次就是本文的主题“花文字”了

“花文字”这里指的是WPF程序中文字显示时不清楚的状况

经研究发现 “花文字” 居然是WPF中ClearType搞的鬼，关闭ClearType就不会有花文字了

当然“花文字”也只是在特定显示器下的情况，笔者的显示器就不幸会产生花文字
