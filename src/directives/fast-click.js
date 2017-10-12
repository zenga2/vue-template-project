import { Touch, fireEvent } from '../common/utils/eventUtils'

const storeMap = new Map()
const MAX_DIS = 10
const MAX_INTERVAL = 350

// .pre: 预绑定 同时value要传一个数组[childClass, handle]
export default {
  bind (el, binding) {
    const touch = new Touch(el, {
      end (e) {
        // 是否是预绑定
        let isPreBind = binding.modifiers && binding.modifiers.pre

        let disX = this.currX - this.startX
        let disY = this.currY - this.startY
        let dis = Math.sqrt(disX * disX + disY * disY)

        let interval = this.endTime - this.startTime

        if (interval < MAX_INTERVAL && dis < MAX_DIS && !this.isCancel) {
          fireEvent(e, isPreBind, binding.value, el)
        }
      }
    })

    storeMap.set(el, touch)
  },

  unbind (el) {
    let touch = storeMap.get(el)

    if (touch) {
      touch.destroy()
      storeMap.delete(el)
    }
  }
}
