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