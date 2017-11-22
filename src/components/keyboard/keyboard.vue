<template>
  <transition name="keyboard-slide" :duration="300">
    <div v-show="isShow" class="keyboard">
      <div @click.stop="hide" class="mask"></div>
      <div @click.stop="handle" class="keyboard-content">
        <div data-value="1" class="item">1</div>
        <div data-value="2" class="item">2</div>
        <div data-value="3" class="item">3</div>
        <div data-value="4" class="item">4</div>
        <div data-value="5" class="item">5</div>
        <div data-value="6" class="item">6</div>
        <div data-value="7" class="item">7</div>
        <div data-value="8" class="item">8</div>
        <div data-value="9" class="item">9</div>
        <div data-value="." class="item dot">·</div>
        <div data-value="0" class="item">0</div>
        <div data-value="delete" class="item delete">删除</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      value: {type: String, default: ''}
    },
    data() {
      return {
        pValue: this.value,
        isShow: false
      }
    },
    methods: {
      show() {
        this.isShow = true
      },

      hide() {
        this.isShow = false
      },

      handle(e) {
        let target = e.target
        let classList = target.classList

        if (classList && classList.contains('item')) {
          let char = target.dataset.value
          let pValue = this.pValue

          if (char === 'delete') {
            pValue = pValue ? pValue.slice(0, -1) : ''
          } else {
            pValue += char
          }

          if (pValue !== this.pValue) {
            this.pValue = pValue
            this.$emit('input', pValue)
            this.$emit('change', pValue)
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .keyboard
    z-index: 10000
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    .mask
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      background: transparent
    .keyboard-content
      display: flex
      flex-wrap: wrap
      z-index: 1
      position: absolute
      width: 100%
      bottom: 0
      font-size: 0
      .item
        display: inline-block
        border-top: 1px solid #d3d3d3
        border-right: 1px solid #d3d3d3
        width: 33.33333333333333%
        text-align: center
        height: 56px
        line-height: 56px
        font-size: 20px
        background: #fff
        &:nth-child(3n)
          border-right: none
        &.dot
          font-weight: bolder
        &.delete
          font-size: 16px
        &:active
          background: rgba(0, 0, 0, 0.1)

  .keyboard-content
    transform-origin: bottom center

  .keyboard-slide-enter-active, .keyboard-slide-leave-active
    .mask, .keyboard-content
      transform: translateZ(0)
      transition: 300ms

  .keyboard-slide-enter, .keyboard-slide-leave-to
    .mask
      opacity: 0
    .keyboard-content
      transform: scaleY(0)

  .keyboard-slide-enter-to, .keyboard-slide-leave
    .keyboard-content
      transform: scaleY(1)
</style>
