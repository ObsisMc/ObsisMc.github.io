---
title: Java测试笔记：Junit4+PowerMockito
path_name: java-test-junit4-powerMockito
date: 2026-02-27 23:53:22
categories:
  - Java
draft: false
---

## 测试的 AAA 步骤


分为三步：Arrange, Act, Assert

- **Arrange（准备）**
  - mock / stub 依赖
  - `System.setProperty(...)`、准备测试数据
  - 反射 `getDeclaredMethod/Field/Constructor`
  - `setAccessible(true)`
- **Act（执行）**
  - 调用被测 public 方法
  - 或（确实要测 private 时）`method.invoke(...)`
- **Assert（断言）**
  - `assertEquals/assertTrue/...`
  - `verify(...) / verifyStatic(...) / verifyPrivate(...)`


> `setAccessible(true)` 通常算 Arrange；`invoke(...)` 算 Act。


## 反射：private 构造器 / private 方法的测试


### private 构造器：反射创建实例


```java
Constructor<MyClass> c = MyClass.class.getDeclaredConstructor();
c.setAccessible(true);
MyClass obj = c.newInstance();
```


### private 方法：反射调用并断言返回值


```java
Method m = MyClass.class.getDeclaredMethod("func2");
m.setAccessible(true);
ReturnClass ret = (ReturnClass) m.invoke(obj);
```

## 验证 public 非 static 函数

Mockito 先 mock 出一个对象，然后 verify 就行了。

```java
MyService mockSvc = Mockito.mock(MyService.class);

// ... Act: 被测代码调用了 mockSvc.doWork()

Mockito.verify(mockSvc, Mockito.times(1)).yourMethod1();
Mockito.verify(mockSvc, Mockito.never()).yourMethod2();
```

## 验证 public static 函数

包含四个部分：
1. 注解测试类 `@RunWith(PowerMockRunner.class)`
2. 准备被测试类 `@PrepareForTest(MyClass.class)`
3. 开启模拟 `PowerMockito.mockStatic(MyClass.class)`
4. 验证 `PowerMockito.verifyStatic`


假设你有一个工具类 `StaticUtils`，里面有一个静态方法 `sendNotification(String msg)`。

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest({StaticUtils.class}) // 必须包含静态方法所在的类
public class MyTest {

    @Test
    public void testStaticMethodCall() {
        // 1. 开启静态模拟
        PowerMockito.mockStatic(StaticUtils.class);

        // 2. 执行你的业务代码（假设业务逻辑里调用了 StaticUtils.sendNotification）
        yourBusinessService.doSomething();

        // 3. 验证静态方法是否被调用（注意：verifyStatic 需要分两步写）
        // 第一步：通知 PowerMockito 我要开始验证静态类了
        PowerMockito.verifyStatic(StaticUtils.class, Mockito.times(1)); 
        // 第二步：紧跟着写出具体的调用轨迹
        StaticUtils.sendNotification(Mockito.anyString()); 
    }
}
```

> 1. PowerMockito.mockStatic(MyClass.class) 会把该类所有 static 方法置于 mock 状态，即默认doNothing
> 2. verifyStatic后面必须紧跟一次被测试的方法调用，否则验证会失败。
> 3. static函数可能修改static属性，可能对其他tests有影响

## spy 打桩

spy 的典型场景是：
- 想保留真实对象的大部分行为，但只替换/拦截其中一小部分（部分 mock）
- 相比 mock()（全是假），spy()（大部分是真的）

### public方法

**屏蔽内部函数**

```java
MyService spy = Mockito.spy(new MyService());
Mockito.doNothing().when(spy).startPeriodicTask();  // 屏蔽副作用
spy.func3();                                // 其它逻辑照跑
verify(spy).startPeriodicTask(); // verify默认是times(1)，这里验证了func3里调用了startPeriodicTask，但实际并没有执行startPeriodicTask的逻辑
```

**stub返回值**

```java
MyClass spy = Mockito.spy(new MyClass());
Mockito.doReturn(123).when(spy).func2();
assertEquals(..., spy.func1());
```

### private 方法

测试类加上
- `@RunWith(PowerMockRunner.class)`
- `@PrepareForTest(MyClass.class)`

使用 `PowerMockito` 代替 `Mockito` 来 spy 和 verify，并且 `when` 需要改变

```java
// Mockito写法
Mockito.doReturn(123).when(spy).func2(); // public int func2()
// PowerMockito写法
PowerMockito.doReturn(123).when(spy, "func2"); // private int func2()
```

## `suppress` 不执行方法


```java
Method m = MyClass.class.getDeclaredMethod("func2");
PowerMockito.suppress(m);
```
- func2不会被执行
- 无法再用 verifyPrivate 来统计调用次数


## 拦截构造过程 `whenNew`

三个前置条件：
1. 注解测试类 `@RunWith(PowerMockRunner.class)`
2. 准备被测试类 `@PrepareForTest(MyClass.class)`
   - 必须在注解里放入**调用 new 关键字的那个类**，而不是被 new 的类
3. 抛出异常：`whenNew` 会抛出 Exception，所以测试方法必须加上 `throws Exception`

```java
// 测试代码
@RunWith(PowerMockRunner.class)
@PrepareForTest({BusinessService.class}) // 关键点：这里写调用 new 的那个类，而不是被 new 的类！
public class MyTest {
    @Test
    public void testProcess() throws Exception {
        Thread mockThread = Mockito.mock(Thread.class);
        
        PowerMockito.whenNew(Thread.class)
          .withParameterTypes(Runnable.class) // 可选：指定构造函数参数类型，当有多个构造函数时需要指定
          .withArguments(Mockito.any(Runnable.class))
          .thenReturn(mockThread);
        
        // Act: 调用会创建并 start 线程的函数
        // ...
        
        Mockito.verify(mockThread, times(1)).start();
    }
}
```

**TooManyConstructorsFoundException**

当被测试类有多个构造函数时，PowerMockito 无法确定要 mock 哪个构造函数，就会抛出 TooManyConstructorsFoundException。
解决方法：
- 在 `whenNew` 里指定构造函数参数类型：`.withParameterTypes(...)`



## Mockito 参数匹配小抄

- `any()`：匹配任何对象（包括 null）
- 内置类型的匹配器：
  - `anyInt()`, `anyLong()`, `anyDouble()`, `anyBoolean()`, `anyString()` ... 
- `any(Class<T> type)`：匹配任何指定类型的对象（包括 null）
  - 比如 `any(TimeUnit.class)`, `any(String.class)`


## `import` 不会触发类的 static 初始化

`import MyClass;` 只是编译期语法糖，不会执行 `static { ... }`。

触发类初始化（从而执行 `static {}`）的常见操作：
- 访问 static 字段：`MyClass.SOME_FIELD`
- 调用 static 方法：`MyClass.someMethod()`
- 反射 `Class.forName(...)`
- 其他类的 static 初始化间接引用
