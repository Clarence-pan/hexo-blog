

#安装
sudo apt-get install apache2-utils

sudo dpkg -L apache2-utils | grep bin/
/usr/sbin/httxt2dbm
/usr/sbin/check_forensic
/usr/sbin/split-logfile
/usr/bin/htdigest
/usr/bin/logresolve
/usr/bin/htpasswd
/usr/bin/rotatelogs
/usr/bin/ab
/usr/bin/fcgistarter
/usr/bin/checkgid
/usr/bin/htcacheclean
/usr/bin/htdbm



# 使用
ab -c 10 -n 10 http://www.baidu.com

- `-c` 指定并发数，即一次发送多少请求
- `-n` 指定总共多少个请求
