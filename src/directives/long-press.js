import {Touch} from '../common/js/utils/eventUtils'

const storeMap = new Map()
const MIN_DURATION = 350

// 当在父子元素上都有该指令时(即嵌套使用)，
// 事件函数中不能调用alert等终止js引擎的原生方法
// 因为事件是冒泡的，当里层元素调用alert,
// 那么外层元素的touchend需要等待弹框关闭后才会触发
// 这样end方法计算的时间间隔就不正确了( = 正确值+弹框显示的时间间隔)
export default {
  bind(el, binding) {
    let fn = binding.value
    let currElData = {
      touch: new Touch(el, {
        start(e) {
          currElData.timeoutId = window.setTimeout(() => {
            fn && fn(e)
          }, MIN_DURATION)
        },

        end() {
          let data = storeMap.get(el)
          let timeoutId = data && data.timeoutId
          let interval = this.endTime - this.startTime
          console.log(interval, 'interval', el)

          if (interval < MIN_DURATION || this.isCancel) {
            window.clearTimeout(timeoutId)
          }
        }
      })
    }

    storeMap.set(el, currElData)
    console.log('bind', storeMap)
  },

  unbind(el) {
    let data = storeMap.get(el)

    if (data && data.touch) {
      data.touch.destroy()
      storeMap.delete(el)
    }
    console.log('unbind', storeMap)
  }
}
