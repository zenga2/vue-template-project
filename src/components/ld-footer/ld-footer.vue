<template>
    <div @click="clickHandle" :class="{disabled: !isPassCheck}" class="ld-footer">{{text}}</div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            text: {type: String, default: '确定'},
            clickFn: {type: Function},
            isPassCheck: {type: Boolean, default: false}
        },
        methods: {
            clickHandle (e) {
                this.isPassCheck && this.clickFn && this.clickFn(e)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"

    .ld-footer
        margin-top: 1px
        text-align: center
        line-height: footer-height-value
        font-size: 18px
        color: blue-color-value
        background: #fff
        &:active
            background: rgba(0, 0, 0, .1)
        &.disabled
            color: rgba(255, 255, 255, .75)
            opacity: 0.8
            background: #d0d0d0
</style>
