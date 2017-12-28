import {fireEvent} from '../common/utils/eventUtils'

const storeMap = new Map()

export default {
  bind(el, binding) {
    const eventType = binding.arg
    const handler = (e) => {
      fireEvent(e, true, binding.value, el)
    }

    el.addEventListener(eventType, handler)

    storeMap.set(el, {eventType, handler})
  },

  unbind(el) {
    const data = storeMap.get(el)

    if (data && data.handler) {
      el.removeEventListener(data.eventType, data.handler)
      storeMap.delete(el)
    }
  }
}
