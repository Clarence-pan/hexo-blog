title: C#中解析并运行一个本地命令行
date: 2009-11-20
tags:
  - C#
  - commandline
categories:
  - C#
---
[cnblogs](http://www.cnblogs.com/pcy0/archive/2009/11/20/cs_execute_cmdline.html) Post date: 2009-11-20 17:28
前几天我想在一个程序中运行类似这样一个命令行“javac test.java”，环境变量我都设定得好好的，但使用Process.Start时依旧会有找不到文件的异常。后来发现Process.Start函数不支持自动搜索PATH环境变量。很是郁闷。闲着没事，写了个能搜索PATH的运行命令行函数Execute()，详见下面代码。
```
        /// <summary>
        /// 运行一个命令
        /// </summary>
        /// <param name="cmdLine">要运行的命令行</param>
        /// <param name="workDirectory">命令的工作目录</param>
        /// <returns>该命令对应的进程</returns>
        public static Process Execute(string cmdLine, string workDirectory)
        {
            string fileName;
            string args;
            SplitCmdLineIntoFileAndArg(cmdLine, out fileName, out args);
            Process pro = null;
          
            pro = Process.Start(new ProcessStartInfo()
            {
                FileName = fileName,
                Arguments = args,
                WorkingDirectory = workDirectory,
            });
     
            return pro;
        }
```
 
其中最重要的莫过于如何寻找可执行文件所在路径了。我们知道windows和Linux中都有个环境变量PATH，其中包含了可执行文件的搜索路径，于是寻找可执行文件路径的问题就很容易解决了。这时我又想到：在windows中命令行中的可执行文件的扩展名经常可以被省略。如何才能给文件填上扩展名呢？这要牵扯到另外一个环境变量了——PATHEXT，它包含可执行文件的扩展名，其顺序就是命令行可执行文件的搜索顺序。如此一来整个问题就解决了。其代码如下：
```
        /// <summary>
        /// 把命令行分割为文件名和参数
        /// </summary>
        /// <param name="cmdLine">输入的命令行，不能为null</param>
        /// <param name="fileName">输出的文件名</param>
        /// <param name="args">参数</param>
        /// <exception name="FileNotFoundException">找不到相应的可执行文件，命令行无法解析</exception>
        static void SplitCmdLineIntoFileAndArg(string cmdLine, out string fileName, out string args)
        {
            if (cmdLine == null)
                throw new ArgumentNullException("cmdLine", "cmdLine必须是有效的命令行");
            fileName = string.Empty;
            args = string.Empty;
            bool hasFound = false;
            //环境变量path，可执行文件的路径
            string path = Environment.GetEnvironmentVariable("path")+";.";
            var splitedPath = path.Split(';');
            //环境变量pathext，可执行文件的扩展名
            string pathext = Environment.GetEnvironmentVariable("pathext");
            string[] splitedPathext = pathext.Split(';');
            //有些系统中可能没有这个变量，那么就忽略扩展名
            if (splitedPathext == null || splitedPathext.Length == 0)
            {
                splitedPathext = new string[] { string.Empty };
            }
 
            for (int i = 0; i <= cmdLine.Length; ++i)
            {
                //命令行由空白字符分割，而可执行文件名就是第一个参数。有可能其路径中包含空白字符，故搜索时还要向后搜索
                if (i == cmdLine.Length || char.IsWhiteSpace(cmdLine, i))
                {
                    hasFound = false;
                    string partFileName=cmdLine.Substring(0,i);
 
                    foreach (string pathx in splitedPath)
                    {
                        fileName = pathx + "\\\\" + partFileName;
                        if (File.Exists(fileName))
                        {
                            hasFound = true;
                            break;
                        }
                        else
                        {
                            foreach (string pathextx in splitedPathext)
                            {
                                fileName = pathx + "\\\\" + partFileName + pathextx;
                                if (File.Exists(fileName))
                                {
                                    hasFound = true;
                                    break;
                                }
                            }                           
                        }
                        if (hasFound)
                            break;
                    }
                    if (hasFound)
                    {
                        i++;
                        if (i >= cmdLine.Length)
                            args = string.Empty;
                        else
                            args = cmdLine.Substring(i);
                        break;
                    }
                }
            }
            if (!hasFound)
            {
                throw new FileNotFoundException("无法找到文件\\""+cmdLine+'"', cmdLine);
            }
        }
```

 测试一下：

```
     static void Main(string[] args)
        {
            Stopwatch sw = new Stopwatch();
            try
            {
                sw.Start();
                Process pro = Execute("winver", ".");
                sw.Stop();
                Console.WriteLine(pro.StartInfo.FileName + " " + pro.StartInfo.Arguments);
                Console.WriteLine("elapsed:{0}", sw.ElapsedMilliseconds);
                pro.WaitForExit(10000);
              
            }
            catch(Exception e)
            {
                Console.Error.WriteLine(e.ToString());
            }
           
        }
```
运行结果：
```
**C:\\windows\\system32\\winver.EXE**
**elapsed:77**
**** 
```
 
