<template>
  <span>num: {{ num }}</span>
  <button @click="num += 1">num+1</button>
  <br />
  <span>name: {{ person.name }}</span>
  <span>age: {{ person.age }}</span>
  <button @click="person.name += '~'">更改名字</button>
  <button @click="person.age += 1">年龄加1</button>
</template>

<script>
import { ref, reactive, watch } from 'vue';
export default {
  setup () {
    // 第一种情况,监听ref定义的一个属性
    // let num = ref(0)
    // watch(num, (newVal, oldVal) => {
    //   console.log(newVal, oldVal)
    // })
    // 第二种情况, 监听ref定义的多个属性
    let num = ref(0)
    let mes = ref('你好啊')
    watch([num, mes], (newVal, oldVal) => {
      console.log(newVal, oldVal) // []  [0, 你好呀]
    })
    let person = reactive({
      name: '张三',
      age: 18
    })
    watch(person, (newVal, odlVal) => {
      console.log(newVal, odlVal)
    })
    return {
      num,
      person
    }
  }
}
</script>

<style>
</style>