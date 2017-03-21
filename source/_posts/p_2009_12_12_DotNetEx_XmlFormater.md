title: 用于XML格式存储的工具类
date: 2009-12-12
tags:
  - XML
  - C#
categories:
  - C#
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2009/12/12/DotNetEx_XmlFormater.html) Post date: 2009-12-12 23:37

最近很喜欢使用XML(C\#的Linq to XML)。写个类后总想把它能用XML文件保存起来，一般我都是写个ToXElement函数然后在里面……

<!-- more -->

今天写烦了，想写一个通用的工具类，以便很方便地把一个类保存化为XML。

看看写出来的结果：

```
/************************************************************************\
 * 把一个对象格式化为XML（元素），即：
 *     1、该XML元素的名字为该对象的类型
 *     2、对该对象中每一个公共属性（Property）转换为字符串（String）
 *         保存到XML元素的属性中
 * 把一个XML粘贴到一个对象中，即为上一过程的逆过程。
 *     
 * 对象信息保存到XML中（然后再保存到文件）很显然将具有很高的可读性
\************************************************************************/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
namespace DotNetEx.FormatAsXml
{
    /// <summary>
    /// 标识能格式化为XML，可以被用在类和结构上，不可以继承，不支持多重标记
    /// </summary>
    [AttributeUsage(AttributeTargets.Class|AttributeTargets.Struct, Inherited = false, 
        AllowMultiple = false)]
    public sealed class CanFormatToXmlAttribute : Attribute
    {
       public CanFormatToXmlAttribute () {   }
    }
    /// <summary>
    /// 标识该属性不用被格式化
    /// </summary>
    [AttributeUsage(AttributeTargets.Property,Inherited=false,
        AllowMultiple=false)]
    public sealed class DonotFormatToXmlAttribute:Attribute
    {
        public DonotFormatToXmlAttribute(){}
    }
    /// <summary>
    /// 格式化为XML的格式器
    /// </summary>
    public static class XmlFormater
    {
        /// <summary>
        /// 把一个对象格式化为XML，这个对象必须有CanFormatToXml属性（Attribute）
        /// </summary>
        /// <param name="o">要格式的对象</param>
        /// <returns>格式化的XML元素</returns>
        /// <exception type="UnsurportedTypeException">输入的对象的类型必须是支持格式化为XML的类型（有CanFormatToXml属性）</exception>
        /// <exception type="ArgumentNullException">输入的对象不能为NULL</exception>
        public static XElement ToXElement(object o){
            if(o==null){
                throw new ArgumentNullException("o");
            }
            Type t=o.GetType();
            var atts= t.GetCustomAttributes(typeof(CanFormatToXmlAttribute),false);
            
            if(atts.Length==0){
                throw new UnsurportedTypeException(t);
            }
            XElement xml=new XElement(t.Name);
            var propertyInfos=t.GetProperties();
            foreach (var proi in propertyInfos) {
                if(proi.CanRead){
                    if(proi.GetCustomAttributes(typeof(DonotFormatToXmlAttribute),false)
                        .Length==0){
                        var pg = proi.GetGetMethod();
                        object ret = pg.Invoke(o, null);
                        xml.Add(new XAttribute(proi.Name, Convert.ChangeType(ret, typeof(string))));
                    }
                }
            }
            return xml;
        }
        /// <summary>
        /// 从一个格式化好的XML中粘贴相关格式化信息到对象
        /// </summary>
        /// <param name="xml">输入的格式化好的XML</param>
        /// <param name="obj">一个目标对象，其必须支持格式化为XML（有CanFormatToXml属性）</param>
        public static void Pase(XElement xml, object obj){
            if (xml == null) {
                throw new ArgumentNullException("xml");
            }
            
            if(obj==null){
                throw new ArgumentNullException("obj");
            }

            Type type = obj.GetType();
            if (( type.GetCustomAttributes(typeof(CanFormatToXmlAttribute), false)
                    .Length == 0 ) ||
                xml.Name!=type.Name
                ) {
                throw new UnsurportedTypeException(type);
            }
            
            var pis = type.GetProperties();
            foreach (var pi in pis) {
                if(pi.CanWrite){
                    if(pi.GetCustomAttributes(typeof(DonotFormatToXmlAttribute),false)
                        .Length==0){
                        var psm = pi.GetSetMethod(true);
                        psm.Invoke(obj,
                            new object[]{ Convert.ChangeType(
                                xml.Attribute(pi.Name).Value,
                                pi.PropertyType)}
                                );
                    }
                }
            }
        }
        /// <summary>
        /// 不是支持格式化为XML（有CanFormatToXml属性）的类型
        /// </summary>
        public sealed class UnsurportedTypeException:Exception
        {
            public UnsurportedTypeException(Type t){
                Type=t;
            }
            public Type Type{
                private set;
                get;
            }
            public override string  Message
            {
             get 
             { 
               return "类型\""+Type+"\"不支持格式化为XML";
             }
            }
        }
    }
  //* 
    static class Test
    {
        [CanFormatToXml()]
        class Person{
            public Person(String name ){
                Name = name;
            }
            public string Name{
                get;
                private set;
            }
            public int Age{
                get;
                set;
            }
            public DateTime BirthDay {
                get;
                set;
            }
            [DonotFormatToXml()]
            public Person Test{
                get;
                set;
            }
        }
        static void Main(){
            Person p=new Person("Hack"){
                BirthDay=new DateTime(1990,1,1),
                Age=19,
                Test=new Person("Test"){
                    Age=20
                }
            };
            var x=XmlFormater.ToXElement(p);
            Console.WriteLine(x.ToString());
            x.Attribute("Name").Value = "Changed";
            XmlFormater.Pase(x, p);
            Console.WriteLine(XmlFormater.ToXElement(p).ToString());
        }
    }
   //*/
}
```

那个静态类Test是用于测试的，测试结果：

```
<Person Name="Hack" Age="19" BirthDay="1990/1/1 0:00:00" /\>
<Person Name="Changed" Age="19" BirthDay="1990/1/1 0:00:00" /\>
```

还不错，能把一个对象的公有属性都写到XML元素中，反过来也能粘贴回对象。

原理分析：(代码很短很清晰，这里就不多说了)

>       从对象格式化到XML时，使用反射从Type得到属性信息，再得到属性的Getter，然后调用就行了；反过来也差不多。

注意那个Person.Name属性，它的Setter是私有的，不过粘贴时也能正常工作。

 
