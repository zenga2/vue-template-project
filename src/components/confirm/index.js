import Vue from 'vue'
import { createAndAppendEl } from '../../common/utils/domUtils'
import confirmComponent from './confirm.vue'

const defaultOpts = {
    title: undefined,
    titleColor: undefined,
    content: undefined,
    contentColor: undefined,
    okBtnText: undefined,
    okBtnColor: undefined,
    cancelBtnText: undefined,
    cancelBtnColor: undefined
}

export default class Confirm {
    constructor (opts) {
        let data = Object.assign({}, defaultOpts, opts)
        let onOK = () => {}
        let onCancel = () => {}

        if (data.onOK) {
            onOK = data.onOK
            delete data.onOK
        }

        if (data.onCancel) {
            onCancel = data.onCancel
            delete data.onCancel
        }

        new Vue({
            el: createAndAppendEl('div', document.body),
            data,
            methods: {onOK, onCancel},
            template: `<confirm
                        :title="title"
                        :titleColor="titleColor"
                        :content="content"
                        :contentColor="contentColor"
                        :okBtnText="okBtnText"
                        :okBtnColor="okBtnColor"
                        :cancelBtnText="cancelBtnText"
                        :cancelBtnColor="cancelBtnColor"
                        :onOK="onOK"
                        :onCancel="onCancel"></confirm>`,
            components: {confirm: confirmComponent}
        })
    }
}
