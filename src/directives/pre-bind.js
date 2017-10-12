import { fireEvent } from '../common/js/utils/eventUtils'

const storeMap = new Map()

export default {
  bind (el, binding) {
    const eventType = binding.arg
    const clickHandle = (e) => {
      fireEvent(e, true, binding.value, el)
    }

    el.addEventListener(eventType, clickHandle)

    storeMap.set(el, {eventType, clickHandle})
  },

  unbind (el) {
    const data = storeMap.get(el)

    if (data && data.clickHandle) {
      el.removeEventListener(data.eventType, data.clickHandle)
      storeMap.delete(el)
    }
  }
}
