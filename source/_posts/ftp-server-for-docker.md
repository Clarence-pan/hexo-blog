---
title: 无需安装 vsftpd , 直接使用 FTP 来管理 docker 容器中的文件
date: 2017-04-15 10:46:59
tags: 
    - ftp
    - docker
    - container
    - node.js
    - TypeScript
category:
    - docker
---

无图无真相，先放个效果图：

![](http://ww1.sinaimg.cn/large/bf5f3c73gy1fen656jywdg20tq0j1u0x.gif)

## 背景

使用 docker 来跑一些服务很方便，但是有的时候想管理容器里面的文件却很麻烦 -- 一般常规做法有3种：

1. 通过数据卷或数据卷容器的方式
2. 启动容器的时候时候启动 vsftpd 或者 sshd 等服务，并开启端口映射，然后通过 ftp/sftp 连上去管理
3. 进入容器的终端，通过命令行管理

但是这些做法都有一定的缺陷和不便：

1和2都是需要在启动容器的时候做一些配置，如果容器已经启动了就歇菜了。而且2需要额外的端口映射，占用主机的端口。3的做法比较 geek ，而容器中通常只有基础的 shell 工具，没有一个熟悉的工具套件环境，操作比较费时费力，不够直观。


## 解决方案： [ftp-server-for-docker](https://www.npmjs.com/package/ftp-server-for-docker)

我所能想到比较好的解决方案是综合2和3的方案，构建一个不需要额外的启动配置的 `FTP` 服务器：[ftp-server-for-docker](https://www.npmjs.com/package/ftp-server-for-docker)

> 这是一个 docker 专用的 FTP 服务器 - 允许通过 FTP 协议来访问 docker 容器中的文件（即使 docker 容器已经启动了也可以的哟）。基于 linux shell `sh` 和 docker 的 `docker cp`.

### 如何安装

推荐使用 [npm](https://www.npmjs.com/) 安装:

```
npm install -g ftp-server-for-docker
```

### 如何运行

#### 示例1

比如说在 `localhost:21` 上启动 FTP 服务器，并运行 `test` 用户通过密码 `123456` 来访问：


```
$ ftp-server-for-docker -H localhost -p 21 --users test:123456
FtpServer start listening at localhost:21
```

#### 示例2

使用 `ftp-server-for-docker` 来浏览容器 `wordpress` 中的文件: 

![](https://raw.githubusercontent.com/Clarence-pan/node-ftp-server-for-docker/master/screenshots/explore-wordpress.gif)

### 查看命令行帮助

想要知道更多使用方法，可以查看命令行帮助：

```
$ ftp-server-for-docker --help
Usage: ftp-server-for-docker [options]

Options:
  --port, -p       Specify which port to listen on(default is 21)       [number]
  --host, -H       Specify which host to bind(default is 0.0.0.0)       [string]
  --annoymous, -a  Whether enable annoymous user                       [boolean]
  --users, -u      Specify users (in form like username:password, can be
                   multiple)                                             [array]
  --config, -c     Specify which configuration file to use
  --debug          Whether enable debug mode                           [boolean]
  -h, --help       Show help                                           [boolean]
  -?, --help       Show help                                           [boolean]

Examples:
  ftp-server-for-docker -h localhost -p 21  Start the FTP Server on
  -u test:123                               localhost:21, allow user `test` to
                                            access.

```

## 实现原理

这个 FTP 服务器网络方面采用了比较成熟的 [ftpd](https://www.npmjs.com/package/ftpd) ，而文件系统模块替换成了新写的 [Docker FS](https://github.com/Clarence-pan/node-ftp-server-for-docker/blob/master/src/docker-fs.ts). 

文件系统的基本操作（`stat`/`readdir`/`open`/`unlink`...）都是通过 `docker exec`、`docker cp` 和临时文件来完成，比如：

- `stat` 是通过 `docker exec <container> stat xxx` 来查看文件状态
- `readdir` 是通过 `docker exec <container> ls -1 --color=none` 来列出目录下的文件
- `open` 是通过 `docker cp <container>:<path> <temp-path>` 把容器中的文件拷贝到临时文件中，然后再读取的

具体实现流程参见[源代码](https://github.com/Clarence-pan/node-ftp-server-for-docker/blob/master/src/docker-fs.ts)


## 关于 TypeScript

这个项目中的主要源代码都使用 [TypeScript](https://www.typescriptlang.org/) -- 都是在 `src/*.ts` 中，通过 `tsc` 编译后生成成 `lib/*.js`，最终npm打包的只有 `lib/*.js` 没有 `src/*.ts`. 

这是我第一次使用 [TypeScript](https://www.typescriptlang.org/). TypeScript 的强类型带来很多方便，也带来很多不便。综合而言，TypeScript 让我想起了曾经使用过的 C#，结合 Visual Studio Code 来用还是利大于弊。TypeScript 能在编辑和编译的时候就检查出很多类型问题，而且智能提示确实很棒。

## 常见问题

1. FileZilla 无法列出目录结构 -- 可以尝试配置传输模式为 `主动模式`，被动模式还有问题，正在解决ing...
2. 中文目录显示乱码 -- 已知问题，正在解决ing...

如有其他问题，欢迎来[提 issue ](https://github.com/Clarence-pan/node-ftp-server-for-docker/issues/new), 当然更欢迎 [fork](https://github.com/Clarence-pan/node-ftp-server-for-docker) 并解决后来提 PR.

