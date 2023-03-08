<template>
  <button @click="handle1">+</button>
  <span>{{ a }}</span>
  <!-- 这里不需要.value, 模板会自动解析 -->
  <span>{{ b }}</span>
  <!--  b自增不会引起页面变化 -->
  <Hooks v-if="block" />
  <button @click="block = !block">qqqq</button>
</template>

<script>
import { ref } from 'vue'; // 引入ref  api
import Hooks from '../modules/capi/hooks.vue';
export default {
  components: {
    Hooks
  },
  setup () { // setup函数的所有组合式api的舞台,所有组合式api要写在setup里面
    let a = ref(0) // 创建了一个响应式变量 a
    let block = ref(true)
    let obj = ref({
      name: 'zw',
      age: 18
    })
    console.log(obj)
    let b = 0 // 创建了一个普通变量 b
    let handle1 = () => { // 创建了一个方法
      // a++ // 这样会有问题, 因为取a的值需要a.value a的值是一个引用实现对象,简称引用对象 可以输出一下
      console.log(a)
      a.value++
      b++ // b的值会自增,但是不会响应到页面上
    }
    return { // 最后要把定义的这些数据,方法等返回出去,不然模板拿不到
      a,
      b,
      handle1,
      block
    }
  }
}
</script>

<style>
</style>