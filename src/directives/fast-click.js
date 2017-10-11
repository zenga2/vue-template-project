import {Touch} from '../common/js/utils/eventUtils'

const storeMap = new Map()
const MAX_DIS = 10
const MAX_INTERVAL = 350

export default {
  bind(el, binding) {
    let fn = binding.value

    let touch = new Touch(el, {
      end(e) {
        let disX = this.currX - this.startX
        let disY = this.currY - this.startY
        let dis = Math.sqrt(disX * disX + disY * disY)
        let interval = this.endTime - this.startTime

        if (interval < MAX_INTERVAL && dis < MAX_DIS && !this.isCancel) {
          fn && fn(e)
        }
      }
    })

    storeMap.set(el, touch)
  },

  unbind(el) {
    let touch = storeMap.get(el)

    if (touch) {
      touch.destroy()
      storeMap.delete(el)
    }
  }
}
