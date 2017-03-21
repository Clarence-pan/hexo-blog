title: SharpSniffer--C#版Sniffer
date: 2010-05-03
tags:
  - C#
  - sniffer
categories:
  - C#
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2010/05/03/SharpSniffer.html) Post date: 2010-05-03 12:46

虽然网上已经有了SharpSniffer
这一个SharpSniffer还是原创的
无他，唯为学习

<!-- more -->

工程文件下载：[SharpSniffer.rar](http://files.cnblogs.com/pcy0/SharpSniffer.rar)

### 主要过程

1、创建套接字
2、绑定到本机
3、设置IOControl
4、接收数据
5、处理（显示）数据

### 关键代码

创建socket ，据MSDN，IOControlCode.ReceiveAll（后面要使用到）使用时有以下限制：

`ReceiveAll` - 启用对网络上的所有 IPv4 数据包的接收。套接字必须有 InterNetwork地址族，套接字类型必须是 Raw，并且协议类型必须为 IP。当前用户必须属于本地计算机上的 Administrators 组，并且套接字必须绑定到特定端口。Windows 2000 及更高版本的操作系统支持此控制代码。此值等于 Winsock 2 SIO\_RCVALL 常数。

 
```
    Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Raw, ProtocolType.IP); //直接new一个
```

绑架到本机，只有绑定到本机才可以监听数据包：

```
    socket.Bind(new IPEndPoint(GetHostAdress(), 0));
```

获取本机IP地址，从一个主机名可能解析到好几个地址，这要看你电脑的网络适配器的状态了，这里只取第一个：

```
private static IPAddress GetHostAdress(){
    string hostName=Dns.GetHostName();
    var hostAddreses=Dns.GetHostAddresses(hostName);
    return hostAddreses[0];
}
```

很关键的一步，对IOControl进行设置。这里输入参数为1表示RCVALL\_ON（启用接收所有包），当输入参数为0时表示RCVALL\_OFF，具体定义在MSDN中WSAIoctl函数的Remark中说的很清楚：

```
byte[] outValue = BitConverter.GetBytes(0);
byte[] inValue = BitConverter.GetBytes(1);
socket.IOControl(IOControlCode.ReceiveAll,inValue, outValue); //对IO设置为可以接受所有包
```

很关键的，接收数据：

```
int recvedSize = socket.ReceiveFrom(buf, ref ep); //用ReceiveFrom接受数据
// socket.Receive(buf); //用Receive也能接受到数据，不过使用ReceiveFrom可以直接获取发送方IP地址
```

接下来要显示数据了，这里只是简单的把数据打印出来，如果想获取该数据包的更多信息则就需要按IP数据包的格式来解析包的内容了：

```
    string s = GetByteArrayHexString(buf, 0, recvedSize);   //此函数把字节数组格式化，详细参考源代码PrintLine(s); 
```

详细过程参考[源代码](http://files.cnblogs.com/pcy0/SharpSniffer.rar)
本程序在WinXP sp3, VS2010, .Net Framework 4.0 Client & .Net Framework 2.0下编译运行通过
能成功抓包，如ping发出和收到的数据包能抓到，打开网页的数据包也能抓到。

### 不足之处

暂时没有分析包的内容
