title: 在MAC OS X上如何启用crontab？
date: 2015-12-16
update: 
tags: 
  - OS X
  - MAC
  - crontab
  - 定时任务
categories: 
  - OS X
  - crontab
----

## 背景
本本上又一些东东是比较重要的，我使用了git进行管理，从而可以将其备份到某个git仓库上。可是鄙人喜欢偷懒，不喜欢老是手动执行备份的一系列命令，于是乎我就想到了写个备份脚本，想通过 crontab 来定期备份。
脚本写好了，也加了一条crontab：

```sh
# m h  dom mon dow   command
30 11,17 * * * /Users/clarence/bin/daily-backup
```

可是，为啥到点没有执行呢？
问了下度娘和谷哥，结果很多文章都是关于如何用OS X现在自带的 launchctl 来执行定时任务的。可是呢，鄙人这个脚本是像每天上午和下午都要执行的，用 launchctl 来搞的话有点嫌麻烦。故今天非要探究下如何启用crontab。结果不一会儿就找到了原因，现分享如下：

## 如何启用crontab
首先，既然OS X的定时任务统统都由 launchctl 来管理了，就看看 cron 任务有没有在里面：

```sh
$  LaunchAgents  sudo launchctl list | grep cron
83968	0	com.vix.cron
```

果然在里面。那就检查下这个启动项的配置：

```sh
$  LaunchAgents  locate com.vix.cron
/System/Library/LaunchDaemons/com.vix.cron.plist
$  LaunchAgents  cat /System/Library/LaunchDaemons/com.vix.cron.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN"
	"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>com.vix.cron</string>
	<key>ProgramArguments</key>
	<array>
		<string>/usr/sbin/cron</string>
	</array>
	<key>KeepAlive</key>
	<dict>
		<key>PathState</key>
		<dict>
			<key>/etc/crontab</key>
			<true/>
		</dict>
	</dict>
	<key>QueueDirectories</key>
	<array>
		<string>/usr/lib/cron/tabs</string>
	</array>
	<key>EnableTransactions</key>
	<true/>
</dict>
</plist>
```

注意里面有个KeepAlive的条件是 `/etc/crontab` 是否存在：

```xml
	<key>KeepAlive</key>
	<dict>
		<key>PathState</key>
		<dict>
			<key>/etc/crontab</key>
			<true/>
		</dict>
	</dict>
```

所以呢，那就看看是否是因为这个 `/etc/crontab` 不存在导致 cron 里面的任务无法正常运行：

```sh
$  LaunchAgents  ll /etc/crontab
ls: /etc/crontab: No such file or directory
```
果然，这个文件不存在。
那就创建吧！

```sh
$  sudo touch /etc/crontab
```

再试试 cron 任务是否成功启动... 果然能成功启动了！

收工~


