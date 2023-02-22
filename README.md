# 个人理解
## vue3有些不一样的东西~
1. 不再需要根标签包裹了,也就是说template标签下可以使用多个标签了
## 组合式api
1. 什么是组合式api?
   - 组合式api是vue3中特有的功能,可以方便的书写代码,不再局限于vue的特有格式.常见的有setup,ref,reactive等
2. 组合式api不要和原来的vue2写法混用,虽然会生效,但是会导致预料不到的错误,具体可以查一下
## setup函数
1. setup函数是vue3中所有组合式api的舞台,也就是说所有的组合式api都需要写在setup中
2. setup函数中最后要写return,将所有需要使用的数据(变量,方法等)return出去,如
```js
setup () {
    let obj = reactive({ 
      name: 'zw',
      age: 25
    })
    let a = ref('sss')
    let handle = () => {
      console.log(111)
    }
    ...
    return {
      obj,
      a,
      handle
      ...
    }
  }
```
3. setup函数不可以使用async修饰!!!
## ref函数
- 使用方法
```js
let a = ref(0)
```
1. 可定义响应式数据
    > 注: vue3中响应式数据需要使用ref,reactive定义,直接定义 如 let a = 0 此时a并不是响应式数据,也就不会更新视图
2. 读值,更改值需要取其value.具体原因
    - ref生成的响应式数据是一个引用实现对象,简称ref引用对象,而我们定义的值就存在该对象的value属性下
## reactive方法
- 使用方法
```js
let obj = reactive({
  a: 1,
  b: 'c'
})
```
1. 只可以定义对象类型响应式数据(对象,数组),可以直接监听到对象属性的更改,增加,删除,也可以直接监听到数组适用下标修改的值
2. ref也可以创建响应式对象数据,但是ref定义的数据需要多取一层.value,而reactive则不用,所以创建对象类型的响应式数据使用reactive更方便一些
    > 注: 其实本质上,使用ref创建响应式对象,其ref内部也"求助"了reactive方法
## vue3响应式原理
1. 原理
vue3通过使用es6新特性proxy构造函数.该构造函数返回一个源对象的代理对象,修改代理对象可实时更改源对象里面对应数据.该构造函数的第一个参数为源对象(也就是需要代理的对象),第二个参数为具体操作对象.具体操作对象里面拥有多种数据拦截方式.如
    - get get方法接收两个参数,第一个为源对象,第二个为读取的key值
    - set set方法接收三个参数,第一个为源对象,第二个为修改的key值,第三个为修改后的值
    - deleteproperty 第一个参数为源对象,第二个参数为删除的key值
2. 简单实现方法
```js
let person = {
  name: 'zw',
  age: 18
}
let p = new Proxy(person, {
  get (target, propsName) {
    console.log('有人读取了p身上的${propsName}属性')
    return target[propsName]
  },
  set (target, propsName, value) {
    console.log('有人修改了瓶身上的${propsName}属性,我要去更新页面啦~')
    target[propsName] = value
  }
  deleteProerpty (target, propsName) {
    console.log('有人删除了p身上的${propsName}属性,我要去更新页面啦~')
    return delete target[propsName]
  }
})
```
> 注意: 此demo仅为简单实现,并非vue3底层真实实现.就是太low了

> 可以看到,与vue2中的Object.defineProperty里面的get和set使用方法十分相似.不同的是vue3里面的proxy里面的get,set等可接收到读取/更改的key值,无需去遍历对象key值.
---
3. 与vue2的不同
    - vue2是通过Object.defineproperty方法监听属性的get,set进行数据劫持,捕获到更改后对应更新页面.
    - vue3使用的是es6新语法的proxy.该方法可创建出一个源对象的代理对象.并且可以通过proxy方法的第二个参数里面的get,set,deleteproperty,进行数据劫持,对应更新页面.
    - vue3底层实现响应式的优势在于,proxy里面的get,set等拦截方法可接收到读取/修改的属性名,就无需再像vue2中循环遍历对象key值多次拦截.vue3可以做到一步到位,代码更简洁,实现更简单