<template>
  <div class="selectbox" ref="selectBox" style="display: none">
    <div @click.stop="hide" class="mask"></div>
    <div class="layer">
      <div class="title border-1px">
        <span v-if="needDeleteBtn" @click.stop="deleteFn" class="delete">删除</span>
        <span class="text">{{title}}</span>
        <span v-if="needCancelBtn" @click.stop="cancelFn" class="cancel">取消</span>
      </div>
      <ul @click.stop="selectItem" class="list">
        <li class="item border-1px"
            v-for="(item, index) in dataList"
            :data-index="index"
            :value="item.value"
            :key="item.value"
            :class="{on:item.value===pValue}">
          {{item.label}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // v-model必须传一个对象
  // 没有v-model,使用change也能运行

  export default {
    props: {
      needDeleteBtn: {type: Boolean, default: true},
      needCancelBtn: {type: Boolean, default: true},
      dataList: {type: Array, default () { return [] }},
      value: {type: [Object]},
      title: {type: String, default: ''}
    },
    data () {
      return {
        // 私有属性，保存当前选中状态
        pValue: undefined,
        isShow: false
      }
    },
    methods: {
      changeState (currItem) {
        this.$emit('input', currItem)

        this.pValue = currItem.value
      },

      deleteFn () {
        this.changeState({})

        this.hide()
      },

      toggle () { this.isShow = !this.isShow },

      show () { this.isShow = true },

      hide () { this.isShow = false },

      cancelFn () {
        this.$emit('cancel')

        this.hide()
      },

      // 处理点击选择项的操作
      selectItem (e) {
        let target = e.target
        let index

        if (target.classList.contains('item')) {
          index = target.dataset.index
          this.changeState(this.dataList[index])
        }

        this.hide()
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

      value (newObj) {
        if (!newObj && this.pValue !== undefined) {
          this.pValue = undefined
          return
        }

        if (newObj && newObj.value !== this.pValue) {
          this.pValue = newObj.value
        }
      },

      pValue (newValue) {
        let currItem = {}

        for (let item of this.dataList) {
          if (item.value === newValue) {
            currItem = item
            break
          }
        }

        this.$emit('change', currItem)
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (typeof this.value === 'object') {
          this.pValue = this.value.value
        }
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
