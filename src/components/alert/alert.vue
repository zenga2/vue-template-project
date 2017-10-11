<template>
    <div v-if="!isRemove" class="ld-alert ld-common-box" :class="classObj">
        <div class="mask"></div>
        <div class="alert-box ld-box">
            <p class="title" :style="{color: titleColor}">{{title}}</p>
            <p :style="{color: contentColor}" class="content">{{content}}</p>
            <div @click="clickBtnFn" class="btn">
                <span :style="{color: btnColor}" class="text">{{btnText}}</span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            title: {type: String, default: '提示'},
            titleColor: {type: String},
            content: {type: String},
            contentColor: {type: String},
            btnText: {type: String, default: '确定'},
            btnColor: {type: String},
            onOK: {type: Function}
        },
        data () {
            return {
                toggleState: true,
                isRemove: false
            }
        },
        computed: {
            classObj () {
                return {
                    'ld-dialog-enter': this.toggleState,
                    'ld-dialog-leave': !this.toggleState
                }
            }
        },
        methods: {
            clickBtnFn () {
                this.$nextTick(() => {
                    this.toggleState = false
                    setTimeout(() => {
                        this.isRemove = true
                        this.onOK && this.onOK()
                    }, 150)
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"

    .ld-alert
        .alert-box
            .title
                padding: 22px 0 15px
                line-height: 20px
                font-size: title-text-font-size
                color: title-text-color-value
            .content
                padding: 0 20px 12px
                min-height: 52px
                font-size: content-text-font-size
                color: content-text-color-value
                border-1px(#ddd)
            .btn
                padding: 10px 0
                .text
                    line-height: 26px
                    font-size: title-text-font-size
                    color: blue-color-value
</style>
