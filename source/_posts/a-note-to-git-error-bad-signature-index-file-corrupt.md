title: "git报错bad signature和index file corrupt的处理方法"
date: 2017-10-23
tags:
  - git
  - error
categories: 
  - git
---

今天打开工程，习惯性地`git status`下，却发现以下报错：

```
λ git status
error: bad signature
fatal: index file corrupt
```

这该怎么办呢？

<!-- more -->

`index file`在 git 里面一般指的是 `.git/index` 这个文件。这个文件保存的是暂存区的信息（索引信息）。可以通过 `git ls-files --stage` 来查看暂存区的内容。这个文件很重要！但是现在报 `index file corrupt`，说明这个文件已经损坏了。还好，我们有办法重新来生成这个文件：`git read-tree` 或者直接 `git reset`.

解决办法：

1. 进入到工程目录下: `cd /path/to/dir`
2. 删除或重命名 `.git/index` 文件： `rm -f .git/index` 或 `mv .git/index{,.bak}`
3. 重建 `.git/index` : `git read-tree` 或者直接 `git reset`

这样3步后再运行`git status`即可正常显示git状态了：

```
λ git status
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working directory clean
```
