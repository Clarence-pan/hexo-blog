title: PHP中的null合并运算符
date: 2015-12-30
update: 
tags: 
  - Null Coalesce
  - PHP
categories: 
  - PHP
----

null合并运算符是一个好东西，有了它我们就能很方便的获取一个参数，并能在其为空的情况下提供一个默认值。比如在js中可以用`||`来搞：

```js
function setSomething(a){
	a = a || 'some-default-value';
	// ...
}
```

而在PHP中，可惜PHP的`||`总是返回`true`或`false`，无法这样来搞。
[PHP7](http://php.net/manual/en/migration70.new-features.php)才正式加入了`??`这个运算符：

```php
// 获取user参数的值(如果为空，则用'nobody')
$username = $_GET['user'] ?? 'nobody';
// 等价于:
$username = isset($_GET['user']) ? $_GET['user'] : 'nobody';
```

PHP7 估计还有很长时间才能用到生产环境中，那在目前的PHP5中有没有替代方案呢？
据研究，完全有个非常便捷的替代方案：

```php
// 获取user参数的值(如果为空，则用'nobody')
$username = @$_GET['user'] ?: 'nobody';
// 等价于:
$username = isset($_GET['user']) ? $_GET['user'] : 'nobody';
```

-- 运行此代码: <https://3v4l.org/aDUW8>

瞪大了眼睛看，跟前面的PHP7的例子差不多，主要是把 `??` 替换为了 `?:` 。 这个是个什么鬼呢？其实这就是 `(expr1) ? (expr2) : (expr3)` 表达式的省略模式：

> 表达式 (expr1) ? (expr2) : (expr3) 在 expr1 求值为 TRUE 时的值为 expr2，在 expr1 求值为 FALSE 时的值为 expr3。
> 自 PHP 5.3 起，可以省略三元运算符中间那部分。表达式 expr1 ?: expr3 在 expr1 求值为 TRUE 时返回 expr1，否则返回 expr3。
> -- <http://php.net/manual/zh/language.operators.comparison.php>

当然，这个替代方案也不是完美的 —— 如果 `$_GET` 中没有 `'user'`，会有一条 `Notice: Undefined index: user` 的错误，所以需要用`@`来抑制这个错误，或者关闭 `E_NOTICE` 的错误。



