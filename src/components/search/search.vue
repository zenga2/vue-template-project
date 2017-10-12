<template>
    <div class="search">
        <span class="icon icon-font-search"></span>
        <input ref="inputBox" v-model="searchStr" class="search-input" :placeholder="placeholder">
        <span v-show="searchStr.length > 0" @click="clearSearchInput" class="clear icon-font-clear"></span>
    </div>
</template>

<script type="text/ecmascript-6">
    import { runDelay } from '../../common/utils/utils'

    export default {
        props: {
            search: {type: Function},
            clear: {type: Function},
            placeholder: {type: String, default: ''}
        },
        data () {
            return {searchStr: ''}
        },
        methods: {
            // 清空搜索框
            clearSearchInput () {
                this.searchStr = ''
                this.clear && this.clear()
            },

            focus () {
                this.$refs.inputBox.focus()
            }
        },
        watch: {
            searchStr: runDelay(function (newValue) {
                this.search && this.search(newValue)
            }, 300)
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"

    .search
        display: flex
        position: relative
        min-width: 200px
        height: 28px
        border-radius: 6px
        background: #fff
        .icon
            display: inline-block
            padding-left: 5px
            width: 28px
            text-align: center
            line-height: 28px
            font-size: 16px
            color: #a3a3a3
        .search-input
            overflow: hidden
            flex: 1
            padding-right: 26px
            border: none
            height: 100%
            outline: none
            color: #666
            background: transparent
        .clear
            vertical-center()
            right: 6px
            font-size: 16px
            color: #a3a3a3
        &.big
            height: 32px
            .icon
                line-height: 32px
        &.small
            height: 24px
            .icon
                line-height: 24px

</style>
