title: 【转载】/proc目录中的重要信息
date: 2012-11-01
tags:
  - Linux
  - /proc
categories:
  - Linux
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2012/11/01/proc_has_what.html) Post date: 2012-11-01 23:46

**/proc目录中的重要信息**

<!-- more -->

原文链接： [http://blog.chinaunix.net/space.PHP?uid=12290680&do=blog&id=26894](http://blog.chinaunix.net/space.PHP?uid=12290680&do=blog&id=26894)
/proc/cpuinfo - CPU信息 (i.e. vendor, Mhz, flags like mmx) 
/proc/interrupts - 中断 
/proc/ioports - 设备IO端口 
/proc/meminfo - 内存信息(i.e. mem used, free, swap size) 
/proc/partitions - 所有设备的所有分区 
/proc/pci - PCI设备的信息 
/proc/swaps - 所有Swap分区的信息 
/proc/version - Linux的版本号 
/proc/sys/fs/file-max该文件指定了可以分配的文件句柄的最大数目
/proc/sys/fs/file-nr有三个值: 已分配文件句柄的数目/已使用文件句柄的数目/文件句柄的最大数目
/proc/sys/fs/inode-\*任何以名称“inode”开头的文件所执行的操作与上面那些以名称“file”开头的文件所执行的操作一样
/proc/sys/fs/super-max指定超级块处理程序的最大数目,缺省设置：256
/proc/sys/fs/super-nr该文件显示当前已分配超级块的数目
/proc/sys/kernel/acct有三个可配置值，根据包含日志的文件系统上可用空间的数量（以百分比表示）
/proc/sys/kernel/ctrl-alt-del该值控制系统在接收到 ctrl+alt+delete 按键组合时如何反应。这两个值表示： 
零（0）值表示捕获 ctrl+alt+delete，并将其送至 init 程序。这将允许系统可以完美地关闭和重启，就好象您输入 shutdown 命令一样。
壹（1）值表示不捕获 ctrl+alt+delete，将执行非干净的关闭，就好象直接关闭电源一样。
/proc/sys/kernel/domainname该文件允许您配置网络域名
/proc/sys/kernel/hostname该文件允许您配置网络主机名
/proc/sys/kernel/msgmax该文件指定了从一个进程发送到另一个进程的消息的最大长度,一般8192
/proc/sys/kernel/msgmnb该文件指定在一个消息队列中最大的字节数，缺省设置：16384
/proc/sys/kernel/msgmni该文件指定消息队列标识的最大数目，缺省设置：16
/proc/sys/kernel/panic发生“内核严重错误（kernel panic）”，则内核在重新引导之前等待的时间（以秒为单位）。缺省0为禁止重新引导
/proc/sys/kernel/printk该文件有四个数字值，它们根据日志记录消息的重要性，定义将其发送到何处。关于不同日志级别的更多信息，请阅读 syslog(2) 联机帮助页。该文件的四个值为： 
  - 控制台日志级别：优先级高于该值的消息将被打印至控制台
  - 缺省的消息日志级别：将用该优先级来打印没有优先级的消息
  - 最低的控制台日志级别：控制台日志级别可被设置的最小值（最高优先级）
  - 缺省的控制台日志级别：控制台日志级别的缺省值
缺省设置：6 4 1 7

/proc/sys/kernel/shmall在任何给定时刻系统上可以使用的共享内存的总量（以字节为单位），缺省设置：2097152
/proc/sys/kernel/shmmni该文件表示用于整个系统共享内存段的最大数目，缺省设置：4096
/proc/sys/kernel/sysrq如果该文件指定的值为非零，则激活 System Request Key，缺省设置：0
/proc/sys/kernel/threads-max该文件指定内核所能使用的线程的最大数目，缺省设置：14436
/proc/sys/net/core/message\_burst-写新的警告消息所需的时间（以 1/10 秒为单位）；在这个时间内所接收到的其它警告消息会被丢弃。这用于防止某些企图用消息“淹没”您系统的人所使用的拒绝服务（Denial of Service）攻击。缺省设置：50（5 秒）
/proc/sys/net/core/message\_cost该文件存有与每个警告消息相关的成本值。该值越大，越有可能忽略警告消息。缺省设置：5
/proc/sys/net/core/netdev\_max\_backlog该文件指定了，在接口接收数据包的速率比内核处理这些包的速率快时，允许送到队列的数据包的最大数目。缺省设置：300
/proc/sys/net/core/optmem\_max该文件指定了每个套接字所允许的最大缓冲区的大小。缺省10240
/proc/sys/net/core/rmem\_default该文件指定了接收套接字缓冲区大小的缺省值（以字节为单位）。为65535
/proc/sys/net/core/rmem\_max该文件指定了接收套接字缓冲区大小的最大值（以字节为单位）。为131071
/proc/sys/net/core/wmem\_default该文件指定了发送套接字缓冲区大小的缺省值（以字节为单位）。为65535
/proc/sys/net/core/wmem\_max该文件指定了发送套接字缓冲区大小的最大值（以字节为单位）。为131071
/proc/sys/net/ipv4所有 IPv4 和 IPv6 的参数都被记录在内核源代码文档中。请参阅文件/usr/src/linux/Documentation/networking/ip-sysctl.txt。
/proc/sys/vm/buffermem该文件控制用于缓冲区内存的整个系统内存的数量（以百分比表示）。它有三个值，通过把用空格相隔的一串数字 写入该文件来设置这三个值。用于缓冲区的内存的最低百分比；如果发生所剩系统内存不多，而且系统内存正在减少这种情况，系统将试图维护缓冲区内存的数量； 用于缓冲区的内存的最高百分比。缺省设置：2 10 60
/proc/sys/vm/freepages
该文件控制系统如何应对各种级别的可用内存。它有三个值，通过把用空格相隔的一串数字写入该文件来设置这三个值。 
如果系统中可用页面的数目达到了最低限制，则只允许内核分配一些内存。
如果系统中可用页面的数目低于这一限制，则内核将以较积极的方式启动交换，以释放内存，从而维持系统性能。
内核将试图保持这个数量的系统内存可用。低于这个值将启动内核交换。
缺省设置：512 768 1024

/proc/sys/vm/kswapd
该文件控制允许内核如何交换内存。它有三个值，通过把用空格相隔的一串数字写入该文件来设置这三个值：
内核试图一次释放的最大页面数目。如果想增加内存交换过程中的带宽，则需要增加该值。
内核在每次交换中试图释放页面的最少次数。
内核在一次交换中所写页面的数目。这对系统性能影响最大。这个值越大，交换的数据越多，花在磁盘寻道上的时间越少。然而，这个值太大会因“淹没”请求队列而反过来影响系统性能。
缺省设置：512 32 8
/proc/sys/vm/pagecache
该文件与 /proc/sys/vm/buffermem 的工作内容一样，但它是针对文件的内存映射和一般高速缓存。
