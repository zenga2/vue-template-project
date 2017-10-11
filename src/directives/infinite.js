const storeMap = new Map()

// 循环加载指令
export default {
  bind(el, binding) {
    let fn = binding.value

    if (typeof fn !== 'function') {
      throw new Error('v-infinite 只接受函数作为值')
    }

    let scrollHandle = () => {
      let {clientHeight, scrollHeight, scrollTop} = el

      if (scrollHeight - clientHeight === scrollTop) {
        fn(el)
      }
    }

    el.addEventListener('scroll', scrollHandle)
    // 保存到共享区
    storeMap.set(el, scrollHandle)
  },

  unbind(el) {
    let scrollHandle = storeMap.get(el)

    if (scrollHandle) {
      el.removeEventListener('scroll', scrollHandle)
      // 从共享区删除scrollHandle
      storeMap.delete(el)
    }
  }
}
