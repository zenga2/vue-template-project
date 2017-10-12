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
        let onOK = () => {}

        if (data.onOK) {
            onOK = data.onOK
            delete data.onOK
        }

        new Vue({
            el: createAndAppendEl('div', document.body),
            data,
            methods: {onOK},
            template: `<alert
                        :title="title" 
                        :titleColor="titleColor"
                        :content="content"
                        :contentColor="contentColor" 
                        :btnText="btnText" 
                        :btnColor="btnColor" 
                        :onOK="onOK"
                       ></alert>`,
            components: {alert: alertComponent}
        })
    }
}
