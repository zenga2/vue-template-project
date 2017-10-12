import Vue from 'vue'
import { createAndAppendEl } from '../../common/utils/domUtils'
import loading from './loading.vue'

export default class Loading {
    constructor (isShow, text) {
        this.data = {
            isShow: isShow,
            text: text
        }

        new Vue({
            el: createAndAppendEl('div', document.body),
            data: this.data,
            template: `<loading
                        :isShow="isShow"
                        :text="text"></loading>`,
            components: {loading}
        })
    }

    show () {
        this.data.isShow = true
    }

    hide () {
        this.data.isShow = false
    }

    setText (text) {
        this.data.text = text
    }
}
