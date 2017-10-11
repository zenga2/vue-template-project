<template>
    <div class="selectbox" ref="selectBox" style="display: none">
        <div @click.stop="hide" class="mask"></div>
        <div class="layer">
            <div class="title border-1px">
                <span v-if="needDeleteBtn" @click.stop="deleteFn" class="delete">删除</span>
                <span class="text">{{title}}</span>
                <span v-if="needCancelBtn" @click.stop="cancelFn" class="cancel">取消</span>
            </div>
            <ul @click.stop="selectItem" class="list" ref="listBox">
                <li v-for="(item, index) in dataList"
                    :data-index="index"
                    :value="item.value"
                    :key="item.value"
                    class="item border-1px">{{item.label}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            needDeleteBtn: {type: Boolean, default: true},
            needCancelBtn: {type: Boolean, default: true},
            dataList: {type: Array, default () { return [] }},
            bindEl: {type: String},
            value: {type: [String, Number]},
            title: {type: String, default: ''}
        },
        data () {
            return {
                isShow: false
            }
        },
        methods: {
            deleteFn () {
                this.$emit('input', undefined)

                this.hide()
            },

            hide () { this.isShow = false },

            cancelFn () {
                this.$emit('cancel')

                this.hide()
            },

            // 处理点击选择项的操作
            selectItem (e) {
                let target = e.target
                let index, item

                if (target.classList.contains('item')) {
                    index = target.dataset.index
                    item = this.dataList[index]
                    this.$emit('input', item.value)
                }

                this.hide()
            },

            // 取消上一个选中项的选中状态
            deselectLastSelectedItem () {
                let listBox = this.$refs.listBox
                let selectedEl = listBox.querySelector('.item.on')

                if (selectedEl) {
                    selectedEl.classList.remove('on')

                    this.modifyValueEl('')
                }
            },

            // 修改显示元素的显示值
            modifyValueEl (text) {
                let valueEl = document.querySelector(this.bindEl + ' .value')
                if (valueEl) {
                    valueEl.textContent = text
                }
            },

            // 当前值变化时，改变选择框的状态
            changeSelectBoxState (value) {
                this.deselectLastSelectedItem()

                let listBox = this.$refs.listBox
                let el = listBox.querySelector(`.item[value='${value}']`)
                let index

                if (el) {
                    el.classList.add('on')

                    index = el.dataset.index
                    this.modifyValueEl(this.dataList[index].label)
                }
            }
        },
        watch: {
            isShow (newValue) {
                let selectBox = this.$refs.selectBox

                if (newValue === true) {
                    selectBox.style.display = ''
                    // 强制重绘
                    let scrollTop = selectBox.scrollTop
                    selectBox.classList.add('select-slide')
                } else {
                    selectBox.classList.remove('select-slide')
                    setTimeout(() => {
                        selectBox.style.display = 'none'
                    }, 400)
                }
            },

            value (newValue) {
                this.changeSelectBoxState(newValue)
            }
        },
        mounted () {
            this.$nextTick(() => {
                let bindEl = document.querySelector(this.bindEl)
                bindEl.addEventListener('click', () => {
                    this.isShow = !this.isShow
                })

                this.changeSelectBoxState(this.value)
            })
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"

    .selectbox
        .mask, .layer
            transform: translateZ(0)
            transition: all 300ms
        .mask
            z-index: 100
            position: fixed
            left: 0
            top: 0
            right: 0
            bottom: 0
            opacity: 0
            background: rgba(0, 0, 0, .75)
        .layer
            z-index: 101
            position: fixed
            left: 0
            right: 0
            bottom: 0
            height: 65%
            transform: translateY(100%)
            background: #fff
            .title
                overflow: hidden
                position: relative
                border-1px(#d9d9d9)
                height: 45px
                background: #fff
                .text
                    position: absolute
                    left: 50%
                    transform: translateX(-50%)
                    line-height: 45px
                    font-size: 16px
                .cancel, .delete
                    position: absolute
                    line-height: 45px
                .cancel
                    right: 15px
                .delete
                    left: 15px
                    color: #39f
            .list
                scroll(1)
                position: absolute
                top: 45px
                left: 0
                right: 0
                bottom: 0
                margin: 0
                padding: 0
                .item
                    position: relative
                    text-align: center
                    list-style: none
                    line-height: 38px
                    border-1px(#d9d9d9)
                    color: #666
                    &.on
                        color: #fff
                        background: #39f
                        opacity: .5

        &.select-slide
            .mask
                opacity: 1
            .layer
                transform: translateY(0)
</style>
