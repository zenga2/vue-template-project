<template>
    <div class="select-page">
        <div class="select-page-content">
            <div @click="selectItem(index)" v-for="(item, index) in itemList" class="select-item border-1px">
                <span class="label">{{item.label}}</span>
                <i v-show="item.selected" class="selected-icon icon-font-right"></i>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { isArray } from '../../common/js/utils/typeUtils'

    export default {
        props: {
            value: {type: [String, Number, Array]},
            dataList: {type: Array, default () { return [] }}
        },
        data () {
            return {
                itemList: this.dataList.map(
                    ({label, value}) => ({label, value, selected: false})
                ),
                // single multiple
                type: 'single'
            }
        },
        methods: {
            selectItem (index) {
                let result
                let selecteVal = this.itemList[index].value

                if (this.type === 'single') {
                    result = selecteVal
                }
                // 以下为type === 'multiple's的情形
                else if (this.value.indexOf(selecteVal) > -1) {
                    result = this.value.filter(item => item !== selecteVal)
                } else {
                    result = this.value.slice(0)
                    result.push(selecteVal)
                }

                this.$emit('input', result)
            },

            getItemState (value) {
                if (this.type === 'single') {
                    return value === this.value
                } else {
                    return this.value.indexOf(value) > -1
                }
            }
        },
        watch: {
            // 因为父组件会改变value的值，所以必须把改变元素状态的逻辑放在watch里
            value () {
                this.itemList.forEach(item => {
                    item.selected = this.getItemState(item.value)
                })
            }
        },
        created () {
            this.type = isArray(this.value) ? 'multiple' : 'single'

            this.itemList = this.dataList.map(({label, value}) => {
                let selected = this.getItemState(value)

                return {label, value, selected}
            })
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"

    .select-page
        font-size: three-level-font-size-value
        color: #666
        background: #fff
        .select-page-content
            padding-left: 16px
            .select-item
                position: relative
                border-1px(#d3d3d3)
                &:last-child
                    &:after
                        left: -16px
                        width: auto
                .label
                    line-height: normal-height-value
                .selected-icon
                    position: absolute
                    right: 16px
                    line-height: normal-height-value
                    font-size: 26px
                    color: blue-color-value

</style>
