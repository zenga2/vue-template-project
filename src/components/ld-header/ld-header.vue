<template>
    <div class="ld-header border-1px">
        <i v-if="needBack" @click.stop="back" class="back icon-font-return"></i>
        <h1 class="title">{{title}}</h1>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            title: {type: String, default: ''},
            back: {type: Function},
            needBack: {type: Boolean, default: true}
        },
        data () {
            return {}
        },
        methods: {}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"

    .ld-header
        position: relative
        background: header-bg-color-value
        border-1px(#000, top)
        &:after
            top: 0
        .back
            position: absolute
            left: 8px
            line-height: header-height-value
            font-size: 30px
            color: #fff
        .title
            text-align: center
            height: header-height-value
            line-height: header-height-value
            font-size: one-level-font-size-value
            color: #fff
</style>
