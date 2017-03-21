title: 我的VS插件——保存即编译
date: 2009-11-09
tags:
  - C#
  - Visual Studio Extension
  - Visual Studio
categories:
  - Visual Studio
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2009/11/09/vsAddin-SaveToBuild.html) Post date: 2009-11-09 14:44

今天使用Eclipse时突发奇想：给VS2008做个插件，实现保存文件就编译。

<!-- more -->

这个想法的缘自一个很烦人的问题：我的VS2008中的快捷键老是会变，如“编译”这个命令有时是F7,有时是F6，有些诡异。我也懒得去记这些快捷键，所以想找一个简单的方法来解决，想到CTL+S这个是一个从来不变的快捷键，又由于我们保存文件时通常是一些工作已经做好了，这时无疑很适合编译。

选择什么工具来解决呢？ Eclipse提醒我，可以在VS2008中也可以弄个插件。

想到就去做，VS2008中提供了“Visual Studio外接程序”的模板。

使用该模板创建一个工程后，该想一想怎么加入什么样的代码。

分析一下“保存即编译”的目标，程序必须要实现：

1.   能捕获“文档保存”这样的事件；

2.   能“编译”整个工程/解决方案。

文档保存和编译都是VS的活动，一个插件怎么获取VS的活动呢？ 需要慢慢分析模板代码啦……

从VS自动生成的代码可以看到程序的主体是一个类：
```
public class Connect : IDTExtensibility2, IDTCommandTarget;
```

它有两个字段：
```
  private DTE2 _applicationObject;
  private AddIn _addInInstance;
```
分析代码可以看到这两个将在 `OnConnection(object application, ext_ConnectMode connectMode, object addInInst, ref Array custom)`中获得赋值，而`OnConnection()`是在VS初始化加载插件时调用，而 `_applicationObject=application` 代表宿主应用程序的根对象，`_addInInstance=addInInst` 代表表示此外接程序的对象。


找到关键点了 “宿主应用程序” 在此自然代表VS啦，接下来看看能不能从_applicationObject得到些有用信息。 _applicationObject的类型是DTE2,查看其成员，我当然希望能直接找到个DocumentSave或DocumentSaving事件，再有一个Build方法就能直接解决问题了。可惜找了半天没找到，不过有替代方案:发现有Documents属性和ExecuteCommand方法。

 从Documents中可以得到每一个Document，而Document中有个属性Saved能指示其是否被保存了，于是捕获文档保存事件的代码可以这样写：

```
Timer monitorDocSaveTimer = new Timer(1000); //每1秒检测一遍

monitorDocSaveTimer.Elapsed += delegate(object sender, System.Timers.ElapsedEventArgs arg)
{
         static bool _lastSaved=true;

         bool curSaved=true;

         //文件保存 是指 所有文件都保存 所以用到遍历

         foreach (Document doc in _applicationObject.Documents) { 
                if (!doc.Saved)
					curSaved = false;
         }

         if(!_lastSaved && curSaved)  {  //此时刻前文件保存了
              Build();//可以编译了，该方法见下文
         }

         _lastSaved=curSaved;

};
```

为了方便阅读这里用匿名方法来写，实际中可以另外定义个函数来创建委托。

文件保存事件现在能被检测到了，可是怎么编译项目呢？

这就用到了ExecuteCommand()了，它有两个参数分别代表要执行的命令和其命令参数，这里的命令是指可以在VS“命令窗口”中执行的命令，刚好其中有一个命令是Build.BuildSolution可以编译整个解决方案，当然编译单个工程的命令也有，这里就直接使用编译整个解决方案的了。如此，Build方法可以如下：

```
void Build()
{
      _applicationObject.ExecuteCommand("Build.BuildSolution", "");
}
```

这样以来整个插件的功能点已经都有了。

再随便加点用户配置和异常处理的模块就能用了。

 

 

 
