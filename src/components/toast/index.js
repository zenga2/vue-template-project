import {createAndAppendEl} from '../../common/utils/domUtils'
import Vue from 'vue'
import toast from './toast.vue'

export default class Toast {
  constructor(message, duration, onFinish) {
    onFinish = onFinish || function () {}

    new Vue({
      el: createAndAppendEl('div', document.body),
      data: Object.assign({
        message: undefined,
        duration: undefined
      }, {
        message,
        duration
      }),
      methods: {onFinish},
      template: `<toast
                        :message="message"
                        :duration="duration"
                        :onFinish="onFinish"></toast>`,
      components: {toast}
    })
  }
}
