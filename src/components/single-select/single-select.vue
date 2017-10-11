<template>
    <div ref="selectBox" @click="switchCurrValue" class="single-select">
        <span class="single-select-item"
              :data-index="index"
              v-for="(item, index) in dataList"
              :key="item.value"
        >{{item.label}}</span>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            value: {type: [String, Number], default: undefined},
            dataList: {type: Array, default () { return [] }}
        },
        data () {
            return {}
        },
        methods: {
            switchCurrValue (e) {
                let target = e.target

                if (target.classList.contains('single-select-item')) {
                    let index = target.dataset.index
                    let value = this.dataList[index].value

                    if (value === this.value) {
                        value = undefined
                    }

                    this.$emit('input', value)
                }
            },

            addSelectedState () {
                let lastSelectedEl = this.$refs.selectBox.querySelector(`.single-select-item.on`)
                if (lastSelectedEl) {
                    lastSelectedEl.classList.remove('on')
                }

                let index = this.dataList.findIndex(item => item.value === this.value)
                let selectedEl = this.$refs.selectBox.querySelector(`.single-select-item[data-index='${index}']`)
                if (selectedEl) {
                    selectedEl.classList.add('on')
                }
            }
        },
        watch: {
            // 因为父组件会改变value的值，所以必须把改变元素状态的逻辑放在watch里
            value () {
                this.addSelectedState()
            }
        },
        mounted () {
            // 初始化时，不会触发watch，因为之前并没有值，所以不存在改变
            this.addSelectedState()
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../common/stylus/mixin.styl"

    .single-select
        display: flex
        justify-content: space-between
        text-align: center
        font-size: 0
        .single-select-item
            display: inline-block
            width: 30px
            height: 30px
            border-radius: 5px
            line-height: 30px
            font-size: four-level-font-size-value
            background: #ccc
            cursor: pointer
            &.on
                color: #fff
                background: #39f
</style>
