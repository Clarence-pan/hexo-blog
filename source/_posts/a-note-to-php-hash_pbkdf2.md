title: A Note To hash_pbkdf2 in PHP
date: 2016-09-06
tags:
  - php
categories: 
  - php
---

Please pay great attention to the **$length** parameter! It is exactly the **return string length**, NOT the length of raw binary hash result.

I had a big problem about this -- 
I thought that `hash_pbkdf2(...false)` should equals to `bin2hex(hash_pbkdf2(...true))` just like `md5($x)` equals `bin2hex(md5($x, true))`. However I was wrong:

<!-- more -->

```php
hash_pbkdf2('sha256', '123456', 'abc', 10000, 50, false); // returns string(50) "584bc5b41005169f1fa15177edb78d75f9846afc466a4bae05"
hash_pbkdf2('sha256', '123456', 'abc', 10000, 50, true); // returns string(50) "XKŴ��Qw�u��j�FjK���BFW�YpG	�mp.g2�`;N�"
bin2hex(hash_pbkdf2('sha256', '123456', 'abc', 10000, 50, true)); // returns string(100) "584bc5b41005169f1fa15177edb78d75f9846afc466a4bae05119c82424657c81b5970471f098a6d702e6732b7603b194efe"
```

So I add such a note. Hope it will help someone else like me.
