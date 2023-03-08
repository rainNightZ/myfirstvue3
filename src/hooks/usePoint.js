import { reactive, onMounted, onBeforeUnmount, onBeforeMount, onBeforeUpdate, onUnmounted, onUpdated } from "vue";
export default function () {
  let point = reactive({
    x: 0,
    y: 0
  })
  let callback = (e) => {
    point.x = e.pageX
    point.y = e.pageY
  }
  onBeforeMount(() => {
    console.log('hookbmt')
  })
  onBeforeUpdate(() => {
    console.log('hookbut')
  })
  onUpdated(() => {
    console.log('hookutd')
  })
  onMounted(() => {
    console.log('hookmed')
    window.addEventListener('click', callback)
  })
  onBeforeUnmount(() => {
    console.log('hookbumt')
    window.removeEventListener('click', callback)
  })
  onUnmounted(() => {
    console.log('hookunmted')
  })
  return point
}