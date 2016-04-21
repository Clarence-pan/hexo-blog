title: 又是一个渐变色生成算法
date: 2015-05-07
tags:
  - algorithm
  - image
categories:
  - algorithm
---

背景
====

简化了下背景，给定一个指标X，比较小的时候是正常的，比较大的时候比较危险。为了更直观地地显示，前端显示的时候希望使用颜色来高亮这个值——比较小的时候颜色是绿色，较大的时候显示红色，并且用一些黄色进行过渡。

使用google搜了搜，没有找到合适的代码。于是乎，露珠自己打算搞个\~贻笑大方了···

分析
====

颜色在HTML中可以用RGB值来表示——绿色是rgb(0,255,0), 红色是rgb(255,0,0),黄色是rgb(255,255,0). 为了达到渐变效果，需要设计一个函数F:

    F(0) = rgb(0,255,0);

    F(比较大的值) = rgb(255,0,0);

    F(中间的值) = rgb(255,255,0);

 

结果
====

函数貌似很复杂，但是调了一会就出来了，效果来不错。

晒晒代码：

```
    /**
     * 生成渐变色，从绿色到红色的渐变
     * @param int   $x          指标值
     * @param int   $threshold  渐变阈值，$x等于这个值的时候刚好是黄色
     * @param float $brightness 亮度，从0到1
     * @return string RGB格式的颜色值
     */
    function generateGradientColor($x, $threshold, $brightness = 1){
        return sprintf('rgb(%d, %d, 0)',
                        intval(min(255, ($x * 1.0 / $threshold * 255)) * $brightness),
                        intval(max(0, min(255, (2 - $x * 1.0 / $threshold) * 255)) * $brightness));
    }
```

效果
====

生成的渐变色的效果如下（threshold = 25）：

　　![](http://images.cnitblog.com/blog2015/97202/201505/071852095957895.png)

附生成上述效果的PHP代码：

```
    <style>
        div{
            display: block;
            font-size: 10px;
            height: 1em;
        }
    </style>

    <?php
    for ($i = 1; $i < 50; $i++){
        echo strtr("<div style='width: {width}em; background-color: {color}'>$i</div>", array(
            '{width}' => $i,
            '{color}' => generateGradientColor($i, 25)
        ));
    }

    ?>
```

 

[![](http://pic.cnblogs.com/face/u97202.gif)](http://home.cnblogs.com/u/pcy0/)
