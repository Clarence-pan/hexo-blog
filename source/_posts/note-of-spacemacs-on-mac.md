title: mac上spacemacs体验小记
date: 2016-01-04
update: 
tags: 
  - emacs
  - spacemacs
  - mac
categories: 
  - emacs
----

# 安装
## 第一步，安装emacs-mac
emacs-mac是对GNU的emacs为mac环境进行了一定的定制，可能体验会更好一点。
那就卸载掉以前的emacs，装下吧：
<!-- more -->

```sh
$ brew remove emacs
$ brew tap railwaycat/emacsmacport
$ brew install emacs-mac --with-spacemacs-icon
```
其中最后一步会花费比较长的时间，我当时在make阶段足足花费了近10分钟...

## 第二步，克隆下spacemacs的配置
如果以前曾经有`.emacs.d`的配置，要备份下，再克隆：

```sh
$ mv ~/.emacs.d ~/.emacs.d.bak
$ git clone --recursive https://github.com/syl20bnr/spacemacs ~/.emacs.d
```

## 第三步，启动emacs
注意：最好启动GUI版的emacs，而不是到控制台上去敲`emacs`:
![](/media/14516227038772/14516227631953.jpg)

第一次启动emacs，相当于安装spacemacs，会有一些选项，我是一路按默认的来。
很快就装好了（我一边敲上面的第x步，一边装，敲完了也就装完了）：
![](/media/14516227038772/14516235396950.jpg)

看这界面，我滴个神呐，这还是我熟悉的emacs吗？

# 开始使用
## 打开文件
打开个文件试试，还是`C-x C-f`:
![](/media/14516227038772/14516238187335.jpg)
只是这个minibuffer有点小绚丽，居然是竖排的，支持方向键上下移动，左右前进后退；如果输入文件名也能即时筛选文件。

## 执行命令
执行命令还是`M-x`:
![](/media/14516227038772/14516246506381.jpg)
minibuffer都变成竖排的了
## 查看帮助
`SPC f e h` 是内置的spacemacs的帮助文档 (貌似很多命令都用`SPC`打头)

---
更多内容见spacemacs下的其他文章...

