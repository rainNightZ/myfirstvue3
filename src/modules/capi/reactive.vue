<template></template>

<script>
import { reactive, ref } from "vue";
export default {
  // reactive 函数是定义一个对象类型的响应式数据(基本类型不要用它,用ref)
  setup () {
    let obj = reactive({ // 此时obj为响应式的,可监听到改动,增加,删除等操作
      name: 'zw',
      age: 25
    })
    let refobj = ref({ // 也可以使用ref定义对象
      name: 'qq',
      age: 12
    })
    obj.age = 18
    console.log(obj.name) // reactive定义的对象可以直接读取,不需要.value
    refobj.value.age = 100
    console.log(refobj.value.name) // ref定义的对象需要通过.value取值, 所以定义对象最好用reactive
    return { // 不要忘记在这里吧obj交出去
      obj
    }
  }
}
</script>

<style>
</style>