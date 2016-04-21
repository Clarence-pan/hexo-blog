title: C#动态地调用Win32 DLL中导出的函数
date: 2010-05-25
tags:
  - C#
  - .Net
  - Win32
  - DLL
categories:
  - C#
---

[cnblogs](http://www.cnblogs.com/pcy0/archive/2010/05/25/CSharp_dynamic_invoke_native_dll_function_exported.html) Post date: 2010-05-25 20:17

关于这种C#中调用Win32 DLL中导出的函数的方法有很多种了，本文做个小结。

大致有两种情况：

1.  编译时已知DLL文件名和函数名
2.  运行时才能获知DLL文件名（函数名）

### 编译时已知DLL文件名

这种情况下可以简单的使用Pinvoke机制，使用DllImport如：

[System.Runtime.InteropServices.DllImport("kernel32.dll")]

public static extern bool Beep(uint freq,uint time);

### 运行时才能获知DLL文件名

有两种解决方案：

-   首先，可以想到使用Win32 API中LoadLibrary和GetProcAddress，象在C/C++中一样来动态调用DLL中函数，这里就不细说了；
-   其次，考虑如何才能动态使用DllImport, 很容易想到使用.Net中的反射（Reflection&Emit）来动态生成一个Pinvoke函数，如下例：

　　　　

![](http://images.cnblogs.com/OutliningIndicators/ContractedBlock.gif)![](http://images.cnblogs.com/OutliningIndicators/ExpandedBlockStart.gif)代码

		     /// <summary> 
	         /// 获取DLL中函数 
	         /// </summary> 
	         /// <param name="dllName">DLL文件的名字（路径），如果在PATH环境变量下或当期目录中则可以直接指定DLL的名字，否则应包括其路径信息</param> 
	         /// <param name="methodName">函数名字</param> 
	         /// <param name="returnType">返回类型</param> 
	         /// <param name="paramTypes">参数类型，如果无参数则为null</param> 
	         /// <param name="declareCallingConvertions">生成的函数的调用约定</param> 
	         /// <param name="nativeCallingConvertions">DLL函数的调用约定</param>
	          /// <param name="nativeCharSet">字符集</param>
	          /// <returns>代表指定DLL中指定函数的MethodInfo,是一个静态方法</returns>
	           public static MethodInfo GetMethodInfoInDll(string dllName, string methodName, 
	              Type returnType, Type[] paramTypes,
	              CallingConventions declareCallingConvertions,
	              System.Runtime.InteropServices.CallingConvention nativeCallingConvertions,
	              System.Runtime.InteropServices.CharSet nativeCharSet)
	          {
	              AssemblyName assemblyName=new AssemblyName("Assembly"+Environment.TickCount);
	              AssemblyBuilder assemblyBuilder = AppDomain.CurrentDomain.DefineDynamicAssembly( assemblyName, AssemblyBuilderAccess.Run);
	              ModuleBuilder moduleBuilder = assemblyBuilder.DefineDynamicModule(assemblyName.Name);
	              
	              MethodInfo method = moduleBuilder.DefinePInvokeMethod(methodName, dllName,
	                  MethodAttributes.PinvokeImpl | MethodAttributes.Static | MethodAttributes.Public,
	                  declareCallingConvertions, returnType, paramTypes,
	                  nativeCallingConvertions, nativeCharSet);
	              moduleBuilder.CreateGlobalFunctions();
	  
	              MethodInfo methodInfo = moduleBuilder.GetMethod(methodName,paramTypes);
	  
	              return methodInfo;
	  
	          }

 

 

 

当然，适应于第二中情况的解决方案也适应于第一中情况。
