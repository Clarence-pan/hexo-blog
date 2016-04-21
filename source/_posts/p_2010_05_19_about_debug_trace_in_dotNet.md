title: Debug和Trace使用小记
date: 2010-05-19
tags:
  - debug
  - trace
  - C#
  - .Net
categories:
  - C#
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2010/05/19/about_debug_trace_in_dotNet.html) Post date: 2010-05-19 14:49

### Debug和Trace?

Debug和Trace这里指.Net中System.Diagnostics（System程序集）中的Debug和Trace工具类。

### 如何使用？

Debug和Trace两个类都有很多静态方法和属性可以使用，并且Debug和Trace大部分方法都不仅名称一样，用法也很相似。

如：

1.  Write系列和WriteLine系列方法，同TextWriter中一样，是用作输出的。要注意的是Debug中有个Print方法，它和WriteLine的功能是一样的，而不是和Write一样。WriteIf系列函数只是加了个 判断。
2.  Indent/Unindent这样个方法和IndentLevel, IndentSize这两个属性，它们是控制缩进的。
3.  AutoFlush属性是控制刷新的，为true是每次调用Write都会刷新。
4.  Listeners属性，类型是TracerListenersCollection, 可以通过这个属性来添加Debug/Trace输出的监听者。
5.  Fail方法，指示出错信息。一般会弹出一个错误对话框：

    ![](http://images.cnblogs.com/cnblogs_com/pcy0/051910_0646_DebugTrace1.png)

### 关于Trace

Trace翻译为跟踪，Trace类一般是用于跟踪应用程序的相关信息。Trace类中也有TraceInformation/TraceWarning/TraceError这样的方法，分别用于输出不同程度的跟踪信息。

Debug算是Trace的一种特殊应用吧——专用于DEBUG版的Trace.

### 关于TraceListener

TraceListener是一个抽象类，用于监听输出的跟踪信息，一般可以用它的子类，如:

1.  DefaultTracerListener, 一般会使用kernel32.dll中的OutputDebugString来输出；
2.  TextWriterTracerListener, 输出到给定的Stream或TextWriter或文件；
3.  EventLogTracerListener, 输出到日志（EventLog）；

还有其他如WebPageTraceListener等，当然也可以自己实现一个TraceListener.

### 关于Trace.Listeners/Debug.Listeners

操作这Debug类的Listeners属性和Trace类的Listeners属性，实际上效果是一样的。就实现而言，它们都是简单的对TraceInternal.Listeners封装了一下，实现代码用reflector查看为：

 
```
    public static TraceListenerCollection Listeners 
    {
          get 
         {
               return TraceInternal.Listeners; 
         } 
    } 
```
 

 

### 关于Debug/Trace的效率

Debug和Trace所有的公有方法都有[Conditional("DEBUG")]或[Conditional("TRACE")]属性（Attribute），所以只要编译时不定义DEBUG/TRACE宏，Debug/Trace的相应方法都不会被调用。

VS中默认配置中Debug配置下定义了DEBUG和TRACE，Release配置下定义了TRACE。

在调试时VS会自动添加一个TraceListener，输出到输出窗口（Output）:

![](http://images.cnblogs.com/cnblogs_com/pcy0/051910_0646_DebugTrace2.png)

[测试代码下载(TestDebugTrace.rar)](http://files.cnblogs.com/pcy0/TestDebugAndTrace.rar)
