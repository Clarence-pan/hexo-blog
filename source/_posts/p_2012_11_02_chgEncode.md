title: 文件名乱码转换器
date: 2012-11-02
tags:
  - Encoding
  - C#
categories:
  - Encoding
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2012/11/02/chgEncode.html) Post date: 2012-11-02 23:35

今天上网下点歌曲，结果发现是乱码！！ 这可怎么办呢？

<!-- more -->

打开文件，自然可以听出是什么歌，但是问题关键在于我不止下载了一首，而且一首歌一首歌听过来也未免太浪费时间了.

作为一个程序猿，自然想到了编程解决这个问题:

我选择的是用.net的文本编码类来做这个编码转换，因为对.Net比较熟悉

来晒晒代码：[http://files.cnblogs.com/pcy0/chgEncode.zip](http://files.cnblogs.com/pcy0/chgEncode.zip)  (话说园子居然不让上传.tgz的文件，害得我又重新学了下zip的命令）

核心转换算法（汗）：

将字符串先按A编码解成码流，再按B编码组织为字符串，这样完成从A到B的转换

~~~~CSharp
    // Convert @s from encoding @A to @B
    public static string ConvertEncoding (String s, Encoding A, Encoding B)
    {
        try {
            var bytes = A.GetBytes (s);
            return B.GetString (bytes);
        } catch(Exception ex) {
            debug (ex.ToString());
            return ">>>FAILED:" + ex.Message + "<<<";
        }
    }
~~~~

　处理入参等逻辑（C语言写惯了，都把C\#写成过程式的了）：

主要实现了一下功能：

1. 查看当前可选的N种编码类型（命令行 -l / --list-all-encoding参数）

2. 尝试N -\> N的编码转换，并打印出转换后的文件名（命令行-t / --try-all-encoding参数）

  -- 最终发现一般中文编码是GBK/GB2312/GB18030等GB开头的，而linux下目录的编码都是ISO-8859-X，不过N\*N个编码转换也很容易通过CTRL+F来找到合适的编码类型

3. 确认编码类型后，转换并重命名文件（交互式的哦～）

 

~~~~CSharp
    // Complie: mono-csc chgEncode.cs
    // Example: chgEncode.exe ~/Music iso-8859-9  GB18030
    public static int Main (String[]args)
    {
        if (args.Count () < 1) {
        } else if (args.Length == 1 
            && (args [0] == "--list-all-encoding"
            || args [0] == "-l")) {
            
            var encodings = Encoding.GetEncodings ();
            debug ("Found " + encodings.Count () + " encoding(s)");
            println ("name\tcode-page\tdisplay-name");
            foreach (var e in encodings) {
                println (e.Name + "\t" + e.CodePage + "\t" + e.DisplayName);
            }
            return 0;
        } else if (args.Length == 2 && (args [0] == "--try-all-encoding" || args [0] == "-t")) {
            var dir = args [1];
            debug ("Input dir is " + dir);
            var files = Directory.EnumerateFiles (dir);
            debug ("Found " + files.Count () + " file(s)");
            var filename = files.First();
            var encodings = Encoding.GetEncodings ();
            debug ("Found " + encodings.Length + " encoding(s)");
            foreach (var e in encodings) {
                foreach (var f in encodings) {
                    try{ // I don't know the cause but it always failed hear! So I add the try... catch.
                        println ("file " + filename  + "  " + e.Name + " -> " + f.Name + " : "
                             + ConvertEncoding (filename, e.GetEncoding (), f.GetEncoding ()));
                    }
                    catch{}
                }
            }
        } else if (args.Length == 3) {
            var dir = args [0];
            debug ("Input dir is " + dir);
            var files = Directory.EnumerateFiles (dir);
            debug ("Found " + files.Count () + " file(s)");
            var encodings = Encoding.GetEncodings ();
            debug ("Found " + encodings.Count () + " encoding(s)");
            var A = encodings.FirstOrDefault (e => e.Name == args[1]);
            var B = encodings.FirstOrDefault (e => e.Name == args[2]);
            if (null == A || null == B)
            {
                println ("Error: failed to find the encodings!");
                return 1;
            }
            foreach (var file in files) {
                var newFile = ConvertEncoding (file, A.GetEncoding (), B.GetEncoding ());
                Console.Write(file + "  ->  \"" + newFile + "\" [Y/N]?");
                Console.Out.Flush();
                try
                {
                    if ("y" == Console.ReadLine().ToLower())
                    {
                        File.Move(file, newFile);
                    }
                }
                catch(Exception ex)
                {
                    debug (ex.ToString());
                    println("Failed: "+ex.Message);
                }
            }
        }
        else {
            println ("Usage1: chgEncode <dir> <encode-A> <encode-B>");
            println ("        change the encoding of files in @dir");
            println ("Usage2: chgEncode --list-all-encoding");
            println ("        chgEncode -l");
            println ("        list all encodings");
            println ("Usage3: chgEncode --try-all-encoding <dir>");
            println ("        chgEncode -t <dir>");
            println ("        try all encoding to convert the first file of @dir");
        }
        return 0;
    }
~~~~

居然花费了一个小时才搞定，真的水平退步了

不过效果还挺好，至少达成咱的目的了

使用效果：

~~~~CSharp
# 将~/tmp目录下的文件从iso-8859-1编码转换为gb2312编码peter@peter-K43SJ:~/Code/chgEncode$ ./chgEncode.exe ~/tmp iso-8859-1  gb2312
Input dir is /home/peter/tmp
Found 2 file(s)
Found 95 encoding(s)
/home/peter/tmp/Å£×ÐºÜÃ¦.mp3  ->  "/home/peter/tmp/牛仔很忙.mp3" [Y/N]?y
/home/peter/tmp/ÌýÂèÂèµÄ»°.mp3  ->  "/home/peter/tmp/听妈妈的话.mp3" [Y/N]?y
~~~~

~~~~CSharp
# 显示帮助
peter@peter-K43SJ:~/Code/chgEncode$ ./chgEncode.exe --help
Usage1: chgEncode <dir> <encode-A> <encode-B>
        change the encoding of files in @dir
Usage2: chgEncode --list-all-encoding
        chgEncode -l
        list all encodings
Usage3: chgEncode --try-all-encoding <dir>
        chgEncode -t <dir>
        try all encoding to convert the first file of @dir
~~~~

　　

　　
