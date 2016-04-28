title: 如何解决Selenium中"Cannot find function addEventListener in object [object HTMLDocument]"的错误
date: 2016-04-28
update: 2016-04-28
tags: 
  - Selenium
  - Java
  - JavaScript
  - HTMLUnit
categories: 
  - Selenium
----

今天遇到一个很坑爹的问题，某Selenium自动化用例老是失败，报错如下：

```
1) App\Tests\***********
Facebook\WebDriver\Exception\UnknownServerException: TypeError: Cannot find function addEventListener in object [object HTMLDocument]. (http://**********/*)
Failed to take screen-shot: org.openqa.selenium.htmlunit.HtmlUnitDriver cannot be cast to org.openqa.selenium.TakesScreenshot
```

Google了下这个错误，发现暂时没有适合我的解决方案：

1. 有的方案建议换firefox来测试 -- 可是我们的这个自动化用例是要跑在一台linux服务器上，装firefox不现实
2. 有点方案建议禁用js     -- 可是现在这个页面越来越复杂，js禁用的话就侧不起来了，没意义
3. 有点方案建议换PhantomJs -- 这个PhantomJs确实不会报这个错误，以前也用过，但是PhantomJs速度太慢，也是坑


怎么办呢？本来想到[HtmlUnit的官方网站](https://sourceforge.net/projects/htmlunit/)上反馈这个bug，结果一搜，已经有人反馈过这个bug了： <https://sourceforge.net/p/htmlunit/bugs/1536/>. 这个状态为`closed`，说明已经解决了！

那为啥还报这个错误呢？怀疑是`Selenium`引用的`HtmlUnit`版本太低导致的。我使用的`Selenium`是`selenium-server-standalone-2.52.0.jar`， 目前最新版本的`Selenium`是`2.53.0`，然而不能升级到`2.53.0`，因为`2.53.0`中没有自带`HtmlUnit`.

咋办呢？幸好懂那么一丢丢`Java` —— 下载个`HtmlUnit`的最新版本，然后重新打包`selenium-server-standalone-2.52.0.jar`我是不会啦，不过可以指定下`classloader`的加载路径:

```
java -Djava.ext.dirs=./lib -jar selenium-server-standalone-2.52.0.jar
```

`./lib`就是放`HtmlUnit`的一堆`jar`文件的目录。这样子`classloader`加载`HtmlUnit`的类的时候就会使用`./lib`里面的了，就不会使用`selenium-server-standalone-2.52.0.jar`中的老版本中的了。

以此配置重新启动下`Selenium`的服务，然后再运行对应的测试用例，果然一切OK了。

完事，收工~

