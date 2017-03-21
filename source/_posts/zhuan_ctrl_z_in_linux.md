title: 【转】linux中巧用ctrl-z后台运行程序
date: 2014-12-21 23:10
tags:
  - Linux
  - Background Jobs
categories:
  - Linux
---

[cnblogs](http://www.cnblogs.com/pcy0/p/4177274.html) Post date: 2014-12-21 23:10

背景：

最近在执行一些长时间程序的时候，老是一不小心忘了输入‘&’ ， 结果终端就卡在那里了，很是郁闷

以前总是再新开一个终端。

<!-- more -->

今天翻看《鸟哥的linux私房菜》的时候，发现介绍vim的时候介绍了一个ctrl-z命令可以将当前的程序切到后台，很好用！可是怎么再切回去呢？搜了下，见下文：

 

-----------转载自：http://blog.chinaunix.net/uid-10219166-id-2968756.html

----------- 以下是原文
>假设你发现前台运行的一个程序需要很长的时间,但是需要干其他的事情,你就可以用 Ctrl-Z ,终止这个程序,然后可以看到系统提示:
>
>[1]+ Stopped /root/bin/rsync.sh
>
>然后我们可以把程序调度到后台执行:(bg 后面的数字为作业号)
>
>\#bg 1
>
>[1]+ /root/bin/rsync.sh &
>
>用 jobs 命令查看正在运行的任务:
>
>\#jobs
>
>[1]+ Running /root/bin/rsync.sh &
>
>如果想把它调回到前台运行,可以用
>
>\#fg 1
>
>/root/bin/rsync.sh
>
>这样,你在控制台上就只能等待这个任务完成了.
>
>& 将指令丢到后台中去执行
>
>[ctrl]+z 将前台任务丢到后台中暂停
>
>jobs 查看后台的工作状态
>
>fg %jobnumber 将后台的任务拿到前台来处理
>
>bg %jobnumber 将任务放到后台中去处理
>
>kill 管理后台的任务
>
>命令运行时使用CTRL+Z，强制当前进程转为后台，并使之停止。
>
>**1. 使进程恢复运行（后台）**
>
>（1）使用命令bg
>
>Example：
>
>[zuii@zuii-desktop](mailto:zuii@zuii-desktop)：\~/unp/tcpcliserv\$ ./tcpserv01
>
>\*这里使用CTRL+Z，此时serv01是停止状态\*
>
>[1]+ Stopped ./tcpserv01
>
>[zuii@zuii-desktop](mailto:zuii@zuii-desktop)：\~/unp/tcpcliserv\$ bg
>
>[1]+ ./tcpserv01 & \*此时serv01运行在后台\*
>
>[zuii@zuii-desktop](mailto:zuii@zuii-desktop)：\~/unp/tcpcliserv\$
>
>（2）如果用CTRL+Z停止了几个程序呢？
>
>Example：
>
>[zuii@zuii-desktop](mailto:zuii@zuii-desktop)：\~/unp/tcpcliserv\$ jobs
>
>[1]- Running ./tcpserv01 &
>
>[2]+ Stopped ./tcpcli01 127.0.0.1
>
>[zuii@zuii-desktop](mailto:zuii@zuii-desktop)：\~/unp/tcpcliserv\$ bg %1
>
>bash： bg：任务 1 已转入后台 \*后台运行\*
>
>* 2. 使进程恢复至前台运行**
>
>Example：
>
>[zuii@zuii-desktop](mailto:zuii@zuii-desktop)：\~/unp/tcpcliserv\$ ./tcpserv04
>
>[1]+ Stopped ./tcpserv04
>
>[zuii@zuii-desktop](mailto:zuii@zuii-desktop)：\~/unp/tcpcliserv\$ fg
>
>。/tcpserv04
>
>* 总结：**
>
>（1） CTRL+Z停止进程并放入后台
>
>（2） jobs 显示当前暂停的进程
>
>（3） bg %N 使第N个任务在后台运行（%前有空格）
>
>（4） fg %N 使第N个任务在前台运行
>
>默认bg，fg不带%N时表示对最后一个进程操作！
>
>
>

--------- 以上是原文

后记： 《鸟哥的linux私房菜》后面也有章节介绍fg和bg，只是当时还没看到

 
