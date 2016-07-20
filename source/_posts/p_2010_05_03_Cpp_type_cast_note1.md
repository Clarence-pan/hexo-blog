title: C++类型转换小记（一）——C++转换操作符
date: 2010-05-03
tags:
  - C++
  - Type Convertion
categories:
  - C++
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2010/05/03/Cpp_type_cast_note1.html) Post date: 2010-05-03 14:31


### C++转换操作符

#### ISO-C++中有四种转换操作符

<!-- more -->

dynamic\_cast: 在多态类型转换时使用，实现在运行时，并进行运行时检测，如果转换失败，返回值是NULL
static\_cast：与dynamic\_cast相反，static\_cast是在编译时转换类型的，故称为static\_cast，它可以用在值类型转换中
const\_cast：一般用于去除const, volatile等修饰属性上.
reinterpret\_cast：这个很厉害，几乎可以在任意类型间转换，reinterpret的中文意思是重新解释

#### 在Visual C++ 2005及以后版本中C++/clr又添加了一个新的转换

safe\_cast：用于在托管类型间进行转换，如果不成功会抛出InvalidCastException.

### 关于C风格的类型转换

型如(type-name)value的转换是C风格的类型转换，这种转换对任意类型的都能使用。
一般而言C风格的类型转换可以替代static\_cast,const\_cast,reinterpret\_cast,safe\_cast, 但是一般不能替代dynamic\_cast。
原因在于，C风格的类型转换是编译时的，对于C语言中各个不同的类型，编译成汇编代码时，这些类型信息会丢失掉，所剩下的是其长度和符号信息，而C风格的转换就是把这些长度和符号信息统一起来。 如对于两个指针间转换而言A\* pa=(A\*)pb，所生成的中间代码则会是 mov eax, [pb]; mov [pa],eax。
而dynamic\_cast则是会进行运行时检查，对于下行转换（从基类到子类）而言所生成的中间代码一定会调用一个函数名类似 \_\_\_RTDynamicCast的转换函数。
static\_cast,const\_cast,reinterpret\_cast所起的作用同C风格的类型转换，只是编译时对其类型约束不同而已。
safe\_cast是C++/Clr中新增的关键词（Microsoft Specific），对托管类型进行C风格类型转换时， 编译器会自动使用safe\_cast进行转换，这一点估计是为了和C\#风格一致。
