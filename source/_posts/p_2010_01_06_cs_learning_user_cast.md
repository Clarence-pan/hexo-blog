title: C#中的自定义类型转换
date: 2010-01-06
tags:
  - C#
  - Type Convertion
categories:
  - C#
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2010/01/06/cs_learning_user_cast.html) Post date: 2010-01-06 20:56

C#中一个继承自C++的优良特性是可以自定义类型转换。

以前在C++中这样写：
<!-- more -->

```
class CBrush{ //摘自MFC中CBrush类的部分代码。
	public:   
		operator HBRUSH() const;
};
```

 

在C#中也有类似的写法，不过要注意的是C#中这种类型转换函数必须是静态的，相比较与C++，C++中的类型转换则就没有这样的限制。

此外，自定义类型转换可以设置修饰符explicit或implicit。explicit表示显式，也就是在使用这个转换时必须显式写在代码中。implicit修饰符表示隐式，隐式使用即使用时不必要显式写出来，如下例：

```
class A{
	public static explicit operator A(B b){省略内容} //这是一个显式转换
	public static implicit operator B(A a){省略内容} //这是一个隐式转换
}

B b=new B();
A a=(A)b;   //显式使用显式转换
b=a;    //隐式使用隐式转换
```
 

自定义转换还需要注意的一点与as这个运算符有关。as一般情况下相当于 `expression is type ? (type)expression : (type)null`但只计算一次 expression。as 运算符只执行引用转换和装箱转换。as 运算符无法执行其他转换，如用户定义的转换，这类转换应使用强制转换表达式来执行。

然后就是发现在值类型和引用类型之间的自定义转换比较麻烦,装箱和不装箱的值类型在转换时的行为是有区别的。

下面的MyInt是一个引用类型，用作测试和值类型int之间的转换。
   
```

	class MyInt
    {
        int data;
        public MyInt():this(10){}
        public MyInt(int val)
        {
            data = val;
        }

        public static explicit operator int(MyInt x)
        {
            return x.data;
        }

        public static explicit operator MyInt(int x)
        {
            MyInt a = new MyInt();
            a.data = x;
            return a;
        }

        public override string ToString()
        {
            return data.ToString();
        }
    }

    static void Main(string[] args)
    {
        try
        {
            MyInt myInt = new MyInt();
            int t = 100;
            myInt = (MyInt)t;       //执行自定义转换 operator MyInt(int)
            Console.WriteLine("myInt={0}", (myInt == null ? "null" : myInt.ToString()));  //myInt=100
            int x = (int)myInt;     //执行自定义转换 operator int(MyInt)
            Console.WriteLine("x={0}", x);  //x=100
 //         myInt = x as MyInt;     //错误CS0039: 无法通过引用转换、装箱转换、取消装箱转换、包装转换或 Null 类型转换将类型“int”转换为“MyInt” 
            object xobj = x;        //把x装箱
            myInt = xobj as MyInt;  //as不会调用自定义转换
            Console.WriteLine("myInt={0}", (myInt == null ? "null" : myInt.ToString())); //myInt=null
            myInt = (MyInt)xobj;    //装箱后这样转换会出异常
            //必须要显式拆箱再转换，如:myInt=(MyInt)(int)xobj;
            Console.WriteLine("myInt={0}", (myInt == null ? "null" : myInt.ToString())); //这一句不会执行
        }
        catch(Exception e)
        {
            Console.Error.WriteLine(e);  //System.InvalidCastException ...
        }
    }
```

 
