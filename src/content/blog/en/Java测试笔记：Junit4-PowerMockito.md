---
categories:
- Java
date: 2026-02-27 23:53:22
draft: false
excerpt: This article systematically covers the core techniques for unit testing with JUnit4 + PowerMockito, including the AAA test steps, reflection-based access to private members, static method verification, spy stubbing, constructor interception, and practical argument matcher usage — a quick reference for Java testing.
path_name: java-test-junit4-powerMockito
title: "Java Testing Notes: JUnit4 + PowerMockito"
---

## The AAA Steps of Testing


Three steps: Arrange, Act, Assert

- **Arrange**
  - Mock / stub dependencies
  - `System.setProperty(...)`, prepare test data
  - Reflection: `getDeclaredMethod/Field/Constructor`
  - `setAccessible(true)`
- **Act**
  - Call the public method under test
  - Or (when you truly need to test a private method) `method.invoke(...)`
- **Assert**
  - `assertEquals/assertTrue/...`
  - `verify(...) / verifyStatic(...) / verifyPrivate(...)`


> `setAccessible(true)` is typically part of Arrange; `invoke(...)` is part of Act.


## Reflection: Testing Private Constructors / Private Methods


### Private constructor: create an instance via reflection


```java
Constructor<MyClass> c = MyClass.class.getDeclaredConstructor();
c.setAccessible(true);
MyClass obj = c.newInstance();
```


### Private method: invoke via reflection and assert the return value


```java
Method m = MyClass.class.getDeclaredMethod("func2");
m.setAccessible(true);
ReturnClass ret = (ReturnClass) m.invoke(obj);
```

## Verifying a Public Non-Static Method

Mock the object with Mockito, then call `verify` on it.

```java
MyService mockSvc = Mockito.mock(MyService.class);

// ... Act: the code under test calls mockSvc.doWork()

Mockito.verify(mockSvc, Mockito.times(1)).yourMethod1();
Mockito.verify(mockSvc, Mockito.never()).yourMethod2();
```

## Verifying a Public Static Method

Four parts are required:
1. Annotate the test class with `@RunWith(PowerMockRunner.class)`
2. Declare the class under test with `@PrepareForTest(MyClass.class)`
3. Enable mocking with `PowerMockito.mockStatic(MyClass.class)`
4. Verify with `PowerMockito.verifyStatic`


Suppose you have a utility class `StaticUtils` with a static method `sendNotification(String msg)`.

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest({StaticUtils.class}) // Must include the class that contains the static method
public class MyTest {

    @Test
    public void testStaticMethodCall() {
        // 1. Enable static mocking
        PowerMockito.mockStatic(StaticUtils.class);

        // 2. Execute your business code (assume it calls StaticUtils.sendNotification internally)
        yourBusinessService.doSomething();

        // 3. Verify whether the static method was called (note: verifyStatic requires two separate steps)
        // Step 1: Tell PowerMockito you are about to verify the static class
        PowerMockito.verifyStatic(StaticUtils.class, Mockito.times(1)); 
        // Step 2: Immediately follow with the exact method call to verify
        StaticUtils.sendNotification(Mockito.anyString()); 
    }
}
```

> 1. `PowerMockito.mockStatic(MyClass.class)` puts all static methods of that class into mock state, meaning they do nothing by default.
> 2. A call to the method being verified must immediately follow `verifyStatic`; otherwise the verification will fail.
> 3. Static methods may modify static fields, which could affect other tests.

## Spy Stubbing

Typical use cases for spy:
- You want to keep most of the real object's behavior but replace/intercept only a small part (partial mock).
- Unlike `mock()` (entirely fake), `spy()` keeps most behavior real.

### Public methods

**Suppressing an internal method call**

```java
MyService spy = Mockito.spy(new MyService());
Mockito.doNothing().when(spy).startPeriodicTask();  // suppress the side effect
spy.func3();                                // the rest of the logic runs normally
verify(spy).startPeriodicTask(); // verify defaults to times(1); this confirms func3 called startPeriodicTask, but the actual logic of startPeriodicTask was not executed
```

**Stubbing a return value**

```java
MyClass spy = Mockito.spy(new MyClass());
Mockito.doReturn(123).when(spy).func2();
assertEquals(..., spy.func1());
```

### Private methods

Add the following to the test class:
- `@RunWith(PowerMockRunner.class)`
- `@PrepareForTest(MyClass.class)`

Use `PowerMockito` instead of `Mockito` for spying and verifying. The `when` syntax also changes:

```java
// Mockito style
Mockito.doReturn(123).when(spy).func2(); // public int func2()
// PowerMockito style
PowerMockito.doReturn(123).when(spy, "func2"); // private int func2()
```

## `suppress`: Preventing a Method from Executing


```java
Method m = MyClass.class.getDeclaredMethod("func2");
PowerMockito.suppress(m);
```
- `func2` will not be executed.
- You can no longer use `verifyPrivate` to count invocations.


## Intercepting Object Construction with `whenNew`

Three prerequisites:
1. Annotate the test class with `@RunWith(PowerMockRunner.class)`
2. Declare the class under test with `@PrepareForTest(MyClass.class)`
   - The annotation must list **the class that calls the `new` keyword**, not the class being instantiated.
3. Exception handling: `whenNew` throws a checked `Exception`, so the test method must declare `throws Exception`.

```java
// Test code
@RunWith(PowerMockRunner.class)
@PrepareForTest({BusinessService.class}) // Key point: list the class that calls new, NOT the class being instantiated!
public class MyTest {
    @Test
    public void testProcess() throws Exception {
        Thread mockThread = Mockito.mock(Thread.class);
        
        PowerMockito.whenNew(Thread.class)
          .withParameterTypes(Runnable.class) // Optional: specify constructor parameter types when multiple constructors exist
          .withArguments(Mockito.any(Runnable.class))
          .thenReturn(mockThread);
        
        // Act: call the method that creates and starts the thread
        // ...
        
        Mockito.verify(mockThread, times(1)).start();
    }
}
```

**TooManyConstructorsFoundException**

When the class being instantiated has multiple constructors, PowerMockito cannot determine which constructor to mock and throws a `TooManyConstructorsFoundException`.
Solution:
- Specify the constructor parameter types in `whenNew` using `.withParameterTypes(...)`



## Mockito Argument Matchers Cheat Sheet

- `any()`: matches any object (including null)
- Built-in primitive matchers:
  - `anyInt()`, `anyLong()`, `anyDouble()`, `anyBoolean()`, `anyString()` ...
- `any(Class<T> type)`: matches any object of the specified type (including null)
  - e.g. `any(TimeUnit.class)`, `any(String.class)`


## `import` Does Not Trigger Static Initialization

`import MyClass;` is purely compile-time syntax sugar and does not execute `static { ... }` blocks.

Common operations that trigger class initialization (and thus execute `static {}`):
- Accessing a static field: `MyClass.SOME_FIELD`
- Calling a static method: `MyClass.someMethod()`
- Reflection: `Class.forName(...)`
- Indirect references from the static initialization of another class