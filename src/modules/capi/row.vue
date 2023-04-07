<template>
  <span>姓名: </span><span>{{ name }}</span>
  <br />
  <span>年龄: </span><span>{{ age }}</span>
  <br />
  <span>薪资: </span><span>{{ job.job1.salary }}K</span>
  <br />
  <span>车辆名称: </span><span>{{ car.name }}</span>
  <br />
  <span>价格: </span><span>{{ car.price }}W</span>
  <br />
  <span>车辆名称2: </span><span>{{ person2.car.name }}</span>
  <br />
  <span>价格2: </span><span>{{ person2.car.price }}W</span>
  <br />
  <button @click="name += '~'">更改姓名</button>
  <button @click="age += 1">增加年龄</button>
  <button @click="job.job1.salary += 1">增加薪资</button>
  <button @click="toRawTest">测试</button>
  <button @click="addCar">添加车辆信息</button>
  <button @click="car.name += '!'">更改车辆名称</button>
  <button @click="car.price += 1">增加价格</button>
  <button @click="person2.car.name += '!'">更改车辆名称2</button>
  <button @click="person2.car.price += 1">增加价格2</button>
</template>

<script>
import { reactive, toRefs, markRaw, toRaw } from 'vue'; // 引入ref  api
export default {
  setup () {
    let person = reactive({
      name: '张三',
      age: 18,
      job: {
        job1: {
          salary: 20
        }
      },
      car: {}
    })
    let person2 = reactive({
      name: '张三',
      age: 18,
      job: {
        job1: {
          salary: 20
        }
      },
      car: {}
    })
    let car = {
      name: '奔驰',
      price: 100
    }
    let addCar = () => {
      // markRaw(car)
      console.log(markRaw(car))
      person.car = car
      person2.car = car
    }
    let toRawTest = () => {
      let p = toRaw(person)
      p.name = 123123123
      console.log(p, person)
    }
    return {
      person,
      person2,
      addCar,
      ...toRefs(person),
      toRawTest
    }
  }
}
</script>

<style>
</style>