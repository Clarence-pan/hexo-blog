title: 如何优雅地使用 VSCode 来编辑 vue 文件？
date: 2017-03-18
tags:
  - vscode
  - Visual Stdio Code
  - vue
  - Vue.js
  - js
categories: 
  - vscode
---

最近有个项目使用了 [Vue.js](http://cn.vuejs.org) ，本来一直使用的是 PHPStorm 来进行开发，可是遇到了很多问题。

后来，果断放弃收费的 PHPStorm ，改用 [vscode (Visual Stdio Code)](https://code.visualstudio.com). 
当然 vscode 对 vue 也不是原生支持的，今天来扒一扒如何配置 vscode 以便优雅地编辑 vue 文件

<!-- more -->

## 先来扒一扒使用 PHPStorm 遇到的问题：

1. vue文件虽然可以通过插件来解决高亮问题，但是 `<script>` 标签中的 ES6 代码的识别老是出问题，箭头函数有的时候能正确识别，有的时候会报错
2. 无法正确识别 vue 文件中的 jsx 语法
3. 无法正确识别和高亮 vue 文件 `<style>` 标签中使用的 less 语法
4. vue文件中 `<template>` 部分使用了大量的自定义标签（自定义组件）和自定义属性，会报一堆 warning
5. 经常性卡死
6. webpack实时编译的错误不能直接展示在代码编辑器内，还得自己到控制台中查看

## 如何安装 vscode 

很简单，传送门：[官网下载安装](https://code.visualstudio.com/Download)

## 第一步，要支持 vue 文件的基本语法高亮

这里，我试过好3个插件： `vue`, `VueHelper` 和 `vetur` ，最终选择使用 `vetur` 。 

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqyjqcm8ej20af026mx2.jpg)

安装插件： `Ctrl + P` 然后输入 `ext install vetur` 然后回车点安装即可。

p.s: vscode 的插件安装比 PHPStorm 的插件安装更快捷方便，安装完成后还不用重启整个程序，只要重新加载下工作区窗口就可以了。

安装完 `vetur` 后还需要加上这样一段配置下：

```
"emmet.syntaxProfiles": {
  "vue-html": "html",
  "vue": "html"
}
```

这时可以打开一个vue文件试试，注意下右下角状态栏是否正确识别为 `vue` 类型：

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqyc1kw6aj203g00zjr5.jpg)

如果被识别为 `text` 或 `html` ，则记得要点击切换下。

## 第二步，要支持 vue 文件的 ESLint

可能还有人会问为什么要 ESLint ？没有 lint 的代码虽然也可能可以正确运行，但是 lint 作为编译前的一道检测成本更小，而且更快。此外， ESLint 还有很多规范是帮助我们写出更加优雅而不容易出错的代码的。

jshint 本来也是个不错的选择，但是 ESLint 对 jsx 的支持让我还是选择了 ESLint.

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqykn8cbzj20ah01v747.jpg)

安装插件： `Ctrl + P` 然后输入 `ext install eslint` 然后回车点安装即可。

ESLint 不是安装后就可以用的，还需要一些环境和配置：

首先，需要全局的 ESLint , 如果没有安装可以使用 `npm install -g eslint ` 来安装。

其次，vue文件是类 HTML 的文件，为了支持对 vue 文件的 ESLint ，需要 `eslint-plugin-html` 这个插件。可以使用 `npm install -g eslint-plugin-html` 来安装

接着，安装了 HTML 插件后，还需要在 vscode 中配置下 ESLint：

```
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "html",
        "vue"
    ],
    "eslint.options": {
        "plugins": ["html"]
    },
```

最后，别忘了在项目根目录下创建 `.eslintrc.json` , 如果还没创建，还可以使用下面快捷命令来创建：

![](http://ww1.sinaimg.cn/large/bf5f3c73ly1fdqyw5fnm6j20bv031q2v.jpg)

这样一来 vue 中写的 js 代码也能正确地被 lint 了。

要是不小心少个括号之类的都可以有对应的报错:

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqyrypdw5j20hl080aao.jpg)

多余 import 也都能报错:

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqytvpo7yj20hg0ckdhd.jpg)

还是蛮智能的。

## 第三步，配置构建任务

vue 项目的构建我选择用 webpack ，不过，并不是直接使用命令行下的 webpack 而是使用了 webpack 的 API 写的 node 脚本。 脚本主要有两个，一个是 `build/bin/build.js` 另一个是 `build/bin/watch.js` 分别是单次构建和实时构建。

于是乎，对应 vscode 中的 tasks 也是有两个： `build` 和 `watch` ，简单配置如下：

```
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    // use `Ctrl+P` and type `task` + SPACE + <taskName> to run a task
    "version": "0.1.0",
    "tasks": [
        {
            "taskName": "build",
            "echoCommand": true,
            "command": "node",
            "args": [
                "build/bin/build.js"
            ],
            "suppressTaskName": true,
            "isBuildCommand": true
        },
        {
            "taskName": "watch",
            "echoCommand": true,
            "command": "node",
            "args": [
                "build/bin/watch.js"
            ],
            "suppressTaskName": true,
            "isBackground": true
        }
    ]
}
```

这样配置好后，按 `Ctrl + Shift + B` 即可开始单次构建。 不过单次构建比较慢（要10秒+），一般我都用实时构建：`Ctrl + P` 然后输入 `task watch <回车>` 即可开始实时构建。实时构建除了第一次比较慢，其他时候还是非常快的，一般1秒内就可以构建好。

## 最后，webpack 构建错误提示

webpack 构建失败后一般都会有错误提示，会显示在输出窗口中：

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqzn10qqtj20lw05djrt.jpg)

为啥是彩色的？ 因为装了 `Output Colorizer` 这个插件。 
![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqzom5o75j20aq022wee.jpg)

当然，这样还是不够方便 -- 实时构建是后台运行的，“输出”窗口一般也都是在后台，每次保存完文件还得点开岂不麻烦。

要是能做到像 ESLint 一样直接把错误标到编辑器上面就好了。真的可以吗？翻了下 vscode 的文档，发现有神奇的 `problemMatcher` -- 可以对任务输出进行解析，解析出的问题会显示在“问题”窗口中，如果还有文件名行号和列号，则会在源代码编辑窗口中对应的位置标出来。

先放个最终效果：

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqzwld2vcj20h105wwf7.jpg)

在这个文件的第32行，import 了一个不存在的模块，这样的错误在 ESLint 中当然是检查不出来的，然而在 webpack 的实时构建中会报错：

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdqzye7y27j20ux02bt90.jpg)

这个事情的困难在于两点：

1. 如何通过 `problemMatcher` 把这个错误给抓出来？
2. 如何找到错误对应的行号？（如果可能的话，还有列号）

webpack的错误输出格式并不是完全统一的，而且有些还没有行号 -- 一方面可能是 webpack 的 bug ，另一方面 vue 文件在构建的时候会拆成 template, script 和 style 三个方面进行构建，报错的行号可能对不上。

最终我的解决方案是对 webpack 的错误重新格式化输出，然后匹配：

首先，重新格式化输出需要 `format-webpack-stats-errors-warnings` 这个包（偶新写的）

```
npm install --save-dev format-webpack-stats-errors-warnings
```

然后，到 `build/bin/build.js` 和 `build/bin/watch.js` 中在 webpack 构建完成的回调函数中增加这个格式化后的输出：

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fdr08zrcr6j20mg0awq48.jpg)

更多使用介绍见 [github](https://github.com/Clarence-pan/format-webpack-stats-errors-warnings)

最后，在 `.vscode/tasks.json` 中，每个任务下添加 `problemWatcher`:

```
// ...
{
    "taskName": "build",
    // ...
    // build 任务的: 
    "problemMatcher": {
        "owner": "webpack",
        "fileLocation": [
            "relative",
            "${workspaceRoot}"
        ],
        "pattern": {
			"regexp": "^!>(\\w+): (\\S+)?:(\\d+),(\\d+)(?:~(?:(\\d+),)?(\\d+))?: (.*)$",
			"severity": 1,
			"file": 2,
			"line": 3,
			"column": 4,
			"endLine": 5,
			"endColumn": 6,
			"message": 7
        }
    }
}

{
    "taskName": "watch",
    // ...
    // watch 任务的：
    "problemMatcher": {
        "owner": "webpack",
        "fileLocation": [
            "relative",
            "${workspaceRoot}"
        ],
        "pattern": {
			"regexp": "^!>(\\w+): (\\S+)?:(\\d+),(\\d+)(?:~(?:(\\d+),)?(\\d+))?: (.*)$",
			"severity": 1,
			"file": 2,
			"line": 3,
			"column": 4,
			"endLine": 5,
			"endColumn": 6,
			"message": 7
        },
        "watching": {
            "activeOnStart": true,
            "beginsPattern": "^\\s*Webpack begin run",
            "endsPattern": "^\\s*Build complete at"
        }
    }
    // ...
}
// ...
```

注：在 watch 任务中，为了匹配何时开始和何时结束，我在 webpack 构建的 run 和 watch 时增加了一个 `console.log('Webpack begin run')` 的打印，而在构建完成后增加了一个 `console.log("Build complete at ..")` 的打印。

OK，终于基本搞定了 vscode ，可以愉快地开发 vue 应用了。



