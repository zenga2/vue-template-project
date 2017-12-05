// 在input中加data-prop="xxx"
// xxx初始为undefined(即没有触发focus事件),
// focus状态时为true, blur状态(非初始状态)为false

import {injectProp} from '../common/utils/vueUtils'

export default {
  beforeCreate() {
    // inject 'inputState' prop in data
    injectProp('inputState', {}, this)
  },
  mounted() {
    this.$nextTick(() => {
      this.inputElList = this.$el.querySelectorAll('input[data-focus-prop]')
      this.inputElList = Array.from(this.inputElList)

      this.focusHandle = (e) => {
        let prop = e.target.dataset.focusProp
        this.$set(this.inputState, prop, true)
      }
      this.blurHandle = (e) => {
        let prop = e.target.dataset.focusProp
        this.$set(this.inputState, prop, false)
      }

      this.inputElList.forEach(el => {
        el.addEventListener('focus', this.focusHandle)
        el.addEventListener('blur', this.blurHandle)
      })
    })
  },
  beforeDestroy() {
    this.inputElList.forEach(el => {
      el.removeEventListener('focus', this.focusHandle)
      el.removeEventListener('blur', this.blurHandle)
    })
  }
}
