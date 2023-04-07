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
4. setup会在beforeCreate之前执行一次,this的值是undefind,也就是说你在setup里面使用了this你就输了
5. setup参数
 - props: 值为对象,从组件外部传递过来,并且组件内部接受了的属性(就是vue2中的props,不过vue3接收props也需要像vue2那样接受一下)
 - context: 上下文对象(不用慌,咱们需要的东西都在里面)
    - attrs: 相当于vue2的`this.$atter`(我个人认为不重要)
    - slots: 收到的插槽内容,相当于vue2中的`this.$slots`,插槽相关操作找他.
    - emit: 分发自定义事件的函数,相当于vue2的`this.$emit`
## ref函数
- 使用方法
```js
let a = ref(0)
```
1. 可定义响应式数据
    > 注: vue3中响应式数据需要使用ref,reactive定义,直接定义 如 let a = 0 此时a并不是响应式数据,也就不会更新视图
2. 读值,更改值需要取其value.具体原因
    - ref生成的响应式数据是一个引用实现对象,简称ref引用对象,而我们定义的值就存在该对象的value属性下
## reactive函数
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
## ref与reactive区别
1. 从定义角度对比
    - ref通常用来定义基本数据类型
    - reactive通常用来定义对象或者数组类型
    > 备注 ref也可以定义对象数组类型数据,他的内部会自动调用reactive转为代理对象
2. 从原理角度比
    - ref还是通过Object.defineproperty的`get`和`set`来实现响应式
    - reactive通过es6新特性proxy来实现响应式的
3. 从使用角度对比
    - ref定义的数据需要`.value`(但是模板里不需要)
    - reactive定义的数据均不需要`.vaue`
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
4. Reflect对象
    >了解即可,只需要知道vue3响应式底层是通过Reflect操作对象的
    - 是window上的一个对象,可以操作对象.vue3响应式就是通过此方法操作的源对象.如下
    ```js
        let person = {
          name: 'zw',
          age: 18
        }
        let p = new Proxy(person, {
          get (target, propsName) {
            console.log('有人读取了p身上的${propsName}属性')
            return Reflect.get(target,propsName)
          },
          set (target, propsName, value) {
            console.log('有人修改了瓶身上的${propsName}属性,我要去更新页面啦~')
            return Reflect.set(target,propsName, value)
          }
          deleteProerpty (target, propsName) {
            console.log('有人删除了p身上的${propsName}属性,我要去更新页面啦~')
            return Reflect.delete(target,propsName)
          }
        })
    ```
    - 为何一定要使用Reflect对象,直接操作不好吗?
        - 直接操作对于封装框架并不友好,但是reflect对象可以通过返回值来判断成功失败,并不会直接抛出错误,省去了大量trycatch代码
        - Reflect正在尝试将Object上的方法移植过来(了解)
## computed函数
1. 用法与vue2中的computed配置功能一致
2. 写法
    ```js
    import {reactive, computed} from 'vue'
    export default {
      setup () {
        let person = reactive({
          fristName: '张',
          lastName: '三'
        }) // 这个person是响应式的了
        // 计算属性简写,没有考虑修改的情况
        let fullName = computed(() = > {
          return person.firstName + '-' + person.lastName
        })
        // 计算属性-完整写法(考虑读和写)
        let fullName = computed({
          get () {
            return person.firstName + '-' + person.lastName
          },
          set (val) {
            const nameArr = val.split('-')
            person.firstName = nameArr[0]
            person.lastName = nameArr[1]
          }
        })
        return {
          person,
          fullName
        }
      }
    }
    ```
    >其实和vue2的computed属性没什么变化
## watch函数
1. 第一种情况: 监听ref定义的一个基本类型数据
    ```js
    ...
    let num = ref(0)
    watch(num, (n, o) => {
      console.log(n,o)
    }, {
      immediately: true
    })
    ```
2. 第二种情况,监听过个ref定义的基本类型数据
    ```js
    let num = ref(0)
    let msg = ref('你好呀')
    watch([num, msg], (n, o) => {
      console.log(n,o) // [numNewVal, msgNewVal] [numOldVal, msgOldVal]
    })
    ```
3. 第三种情况,监听reactive定义的响应式对象类型数据
    >注: 1. 这种情况下无法正确的获取oldValue,这个问题还没修复 2. 此情况下强制开启了深度监听模式 
    ```js
    let person = reactive({
      name: '张三',
      age: 18
    })
    watch(person, (n,o) => {
      console.log(n,o)
    } {deep: false}) // 此时已经强制开启深度监听了,所以deep属性无效
    ```
4. 第四种情况,监听reactive定义的响应式对象类型数据的某个属性
    > 注: 此情况下监听reactive定义的数据的某个属性时,深度监听不再强制开启
    ```js
    let person = reactive({
      name: '张三',
      age: 18
    })
    // 只监听person里面的age属性,需要使用箭头函数
    watch(() => person.age, (n,o) => {
      consoele.log(n,o)
    }, {deep: true}) // deep属性生效了
    ```
5. 第五种情况,监听多个reactive定义的响应式对象类型数据的属性(与2,4同理,需要使用数组)
    ```js
    let person = reactive({
      name: '张三',
      age: 18
    })
    watch([() => person.name,() => person.age], (n,o) => {
      consoele.log(n,o)
    }, {deep: true}) // deep属性生效了
    ```
6. 第六种情况,监听层级较深的情况
    ```js
    let person = reactive({
      name: '张三',
      age: 18,
      job: {
        job1: {
          salary: '20k'
        }
      }
    })
    person.job.job1.salary = '100k'
    watch(() => person.job, (n,o) => {
      console.log(n,o)
    },{ deep: true }) // 这里必须手动开启深度监听模式化,不然监听不到,挺坑的
    ```
7. 总结watch的坑
    - 监听reactive定义的响应式数据时: oldValue无法正确获取
    - 监听reactive定义的响应式数据时: 强制开启了深度监听(deep: false无效)
    - 而监听reactive定义的响应式数据的某个属性时,深度监听没有强制开启,deep配置有效
8. 鱿鱼溪根本不懂vue!!!!!我教教他吧
## watchEffect函数
1. 定义:watchEffect里面依赖的数据变化即执行(和computed有点相似)
2. 写法
  ```js
  let sum = ref(0)
  let person = reactive({
    name: 'zw',
    age: 18
  })
  watchEffect(() => {
    let x1 = sum.value
    let x2 = person.age
    console.log('watchEffect函数执行了') // 不需要传监听那个数据,也不需要获取newVal和oldVal
  })
  ```
3. 特点
    - 不需要传监听哪个属性,监视的回调用到了哪个属性,就监听哪个属性
    - 不需要获取newval,oldVal的值
4. 与`computed`对比
    - `computed`更注重结果,所以需要返回值
    - `watchEffect`更注重过程,所以不需要写返回值
    - 两者都是依赖的数据发生了变化就会执行
## vue3中的声明周期钩子
1. 和vue2中声明周期钩子所做的事情,所执行的时机基本一致
2. 特点(区别)
    - 分两种写法
        - 第一种是配置项写法.要写在setup函数外边,和vue2写法基本一致(除了beforeDestory, destoryed)
        - 第二种是组合式api写法,要写在setup中,并且需要import引入(其实就是在前边加个on,没啥复杂地方)
    - beforeDestory,destory这两个生命周期在vue3中更名为: beforeUnmount,unmounted(配置项写法)/onBeforeUnmount,onUnmounted(组合式api写法)
    - 组合式api写法中,不再有beforeCreate,created钩子了,因为默认setup执行时机是beforeCreate之前
    - 两种写法可以混用,虽然不推荐,但是组合式api的写法执行时机比配置项写法的执行时机要早一点
3. 对照表
    - `beforeCreate` ===> `setup`
    - `created` ===> `setup`
    - `beforeMount` ===> `onBeforeMount`
    - `mounted` ===> `onMounted`
    - `beforeUpdate` ===> `onBeforeUpdate`
    - `updated` ===> `onUpdated`
    - `beforeDestory` ===> `onBeforeUnmount`
    - `destoryed` ===> `onUnmounted`
4. 写法
    - 组合式api写法
        ```js
          import {setup, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted}
          setup() {
            onBeforeMount(() => {
              conso.log('onBeforeMount')
            })
            onMounted(() => {
              conso.log('onMounted')
            })
            onBeforeUpdate(() => {
              conso.log('onBeforeUpdate')
            })
            onUpdated(() => {
              conso.log('onUpdated')
            })
            onBeforeUnmount(() => {
              conso.log('onBeforeUnmount')
            })
            onUnmounted(() => {
              conso.log('onUnmounted')
            })
          }
        ```
    - 配置项写法与vue2一致,写在setup外即可
5. 个人总结
    - 其实生命周期没啥,就是注意destory那两个钩子更名了,组合式写法加个on就没啥了.不过不要混用,虽然可以但是开发中不合理也没必要.还是觉得使用组合式api会好一点
## 自定义hook
1. 定义
    - 本质上是一个函数,对setup里面的组合式api进行了封装,使setup里面的代码简洁,与vue2中的mixins相似
2. 个人理解
    - 就相当于提出了一个通用方法,比如处理数组.只不过方法里面可以包含组合式api,就是复用的逻辑.没啥特别的
3. 特点
    - 与vue2mixins不同的是,hooks的钩子执行顺序是谁先调用谁先执行,且都会执行
    - 需要暴露出去才可以引用

## toRef与toRefs
1. 定义
    - 创建一个ref对象,其value值指向领一个对象中的某个属性
    - 个人理解
        - 其实就是当一个对象里面有很多属性需要在模板中使用的时候,假如person,每次使用都要person.name,person.age...很麻烦.可以在return的时候使用,节省代码.
        - 语法 `let name = toRef(person, 'name')`
2. 应用: 要将响应式对象中的某个属性单独提供给外部使用时
3. 扩展: toRefs与toRef功能一直,可以批量创建多个ref对象,语法 `toRefs(person)`
4. 这个光看定义不太好懂,详情见代码
    ```js
    import { reactive, toRef, toRefs } from 'vue'
    export default {
      setup() {
        let person = reactive({
          name: '张三',
          age: 18,
          job: {
            job1: {
              salary: '20k'
            }
          }
        })
        return {
          person // 此时,模板中想要是用需要person.name,person.age... 很麻烦.所以我们可以这样.见下
        }
        let name1 = toRef(person, 'name')
        return {
          name1
        }
        // 此时你是否想过,为什么不可以这样
        return {
          name: person.name, // 因为这样会丢失响应式,因为具有响应式的数据是整个对象,这样写就相当于 retur{name: '张三', age: 18},是死数据
          age: person.age,
          ...
        }
        // 到此为止,你又该想了,用什么toRef呀,直接用ref(person.name)多好,如下
        return {
          name: ref(person.name), // 这样确实可以实现响应式,可当你修改时就会发现,他并不会修改源对象person里面的数据,这样就相当于新定义了一个ref响应式数据
          ...
        }
        // 最后再看toRefs,如果有多个属性的话可以这样
        return {
          ...toRefs(person)
        }
      }
    }
    ```
## shallowReactive和shallowRef
1. 定义
    - shallowReactive只会实现对象第一层的响应式(浅层响应式).
        - 用处: 性能优化的时候,虽然有一个嵌套很深的对象,但是只有第一层需要响应式的时候就可以用
    - shallowRef: 只处理基本数据类型的响应式,不处理对象类型的响应式,用处同
2. 写法
    ```js
    let person = shallowReactive({
      name: '张三',
      age: 18,
      job: {
        job1: {
          salary: '20k' // 深层的变化前听不到 只会监听到第一层
        }
      }
    })
    let x = shallowRef({
      y: 1 // 此时x.y不是响应式的,但是整个x是响应式的
    })
    ```
3. 个人总结: 没啥用感觉,除了做一下性能优化,没有东西
## readonly与shallowReadonly
1. 定义
    - readonly: 让一个响应式数据变成只读,并且是深层次的只读.
    - shallowReadonly: 让一个响应式数据变成只读,浅层次的.也就是说对象里面嵌套对象里面的值依然可以修改
2. 用法
    ```js
    let person = {
      name: '张三',
      age: 18,
      job: {
        job1: {
          salary: '29k'
        }
      }
    }
    person = readonly(person) // 此时person里面的所有的值都不可修改了,修改控制台会报警告
    person = shallowReadonly(person) // salary依旧可以修改,因为是深层次的
    ```
3. 个人理解
    - 此时会感觉到很奇怪,既然我已经定义了响应式数据,那么我就是需要更改它以更新页面,毕竟响应式数据第一步就是要更改.若是如此为何我不在一开始就定义一个死数据呢.
    有两点: 
      1. 禁止修改是从根处解决问题,定义普通数据再去更改只不过不会反映到页面上而已,实际数据已经更改了. 
      2. 我们假设一种场景,我需要使用另一个人的组件.那人说你用可以,但是不可以改组件里面的数据,不然会影响其他页面.那么我们可以在拿到数据后,直接让其只读,避免出错
## toRaw与markRaw
1. 定义
    - toRaw: 获取一个响应式对象的普通对象,对此对象的所有操作不会引起页面更新(不可对ref定义的普通数据使用)
    - markRaw: 标记一个对象,使其永远不会成为一个响应式对象.可以在获取到较大数据切只有展示需求时使用.节省性能
2. 用法
    ```js
    let person = reactive({
      name: '张三',
      age: 18,
      job: {
        job1: {
          salary: 20
        }
      }
    })
    let p = toRaw(person) // 此时对p的任何操作均不会引起页面更新
    p.name = '李四'
    console.log(person,p) // 此时两个对象里面的name都被修改为李四了,亲测.

    ////////////////////////////////////

    let car = {
      name: '大众',
      price: 20
    }
    markRaw(car) // 此时car不会成为一个响应式对象了
    person.car = car  // 修改person.car.name  不会引起页面更新
    ```
3. vue3做了很多类似自相矛盾的事情,其实通过安全性,性能考虑,有些方法还是比较有必要的
## customRef
1. 定义: 
    - 自定义的ref,通俗的说,与ref的区别是: ref是精装房,customRef是毛坯房,但是customRef可以做很多自定义逻辑
2. 直接看用法,我要实现一个在输入框输入信息,在输入框底下对应展示并且延迟一秒才展示的功能.类似防抖
    ```html
    <template>
      <input type="text" v-model="keyword">
      <h3>{{ keyword }}</h3>
    </template>
    ```
    ```js
    import {ref, customRef} from 'vue'
    export default {
      setup () {
        // 思路: 根据  let keyword = myRef('hello')可以得首先myRef一定是一个函数,并且需要接受参数,最后需要一个返回值
        let myRef = (info) => {
          return customRef((track, trigger) => {
            return {
              get () {
                console.log('有人读取了我的属性')
                track() // 追踪,告诉get需要追踪这个属性,否则不管你怎么改,get都不会从新执行一遍
                return info
              },
              set (newValue) {
                console.log('有人修改了我的属性')
                info = newValue
                trigger() // 告诉vue去重新解析模板
              }
            }
          }) // 既然是自定义,那么一定会写逻辑,逻辑一般也只能写在函数里面,所以他需要接受一个函数(当然也可以直接看文档,因为文档里面就是这么要求的)主要是思路
        }
        let keyword = myRef('hello')
        return {
          keyword
        }
      }
    }
    ```
3. 总结: 有点类似computed属性.他的作用是如果我需要在实现响应式的同时我还有其他的一些功能逻辑,可以用此方法.但是我觉得以后就在遇到了这种场景可能我也不会想起来用
## provide与inject
1. 定义: 适用于祖组件给孙组件传值,父组件给后代组件传值
2. 用法
    ```js
    //父组件
    let car = reactive({
      name: 'bbb',
      price: '20w'
    })
    provide('car', car) // 两个参数,第一个给这个数据起一个名字,第二个就是这个数据
    ////////////////////////////////////////////

    // 子组件
     let car = inject('car') // 父组件提供了,后代组件就可以呼唤它的名字获取到这个数据
    ```

## fragment
1. 定义: 在vue3中,可以没有跟标签,vue3会把多个标签最后包装到一个fragment虚拟元素中
2. 好处: 减少层级,减小内存占用

## teleport组件
1. 定义: 是一个传送组件,可以把嵌套层级很深的组件html结构传送到我们想要的位置
2. 用法: 
```html
<!-- to代表传送的位置,可以写body -->
<teleport to="html">
  <button>我在某个孙组件当中</button>
</teleport>
<!-- 此时button就会从某个孙组件当中移动到html里面去. -->
```
3. 用处: 整体用处不知,但是胶乳我们需要在一个嵌套很深的组件里面写一个dialog,并且dialog有遮罩层,希望全局生效,那我们就可以把这个dialog传送到body,再去写样式