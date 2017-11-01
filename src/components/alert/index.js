import alertComponent from './alert.vue'
import Vue from 'vue'
import { createAndAppendEl } from '../../common/utils/domUtils'

const defaultOpts = {
    title: undefined,
    titleColor: undefined,
    content: undefined,
    contentColor: undefined,
    btnText: undefined,
    btnColor: undefined
}

export default class Alert {
    constructor (opts) {
        let data = Object.assign({}, defaultOpts, opts)
        let onOk = () => {}

        if (data.onOk) {
            onOk = data.onOk
            delete data.onOk
        }

        new Vue({
            el: createAndAppendEl('div', document.body),
            data,
            methods: {onOk},
            template: `<alert
                        :title="title" 
                        :titleColor="titleColor"
                        :content="content"
                        :contentColor="contentColor" 
                        :btnText="btnText" 
                        :btnColor="btnColor" 
                        :onOk="onOk"
                       ></alert>`,
            components: {alert: alertComponent}
        })
    }
}
