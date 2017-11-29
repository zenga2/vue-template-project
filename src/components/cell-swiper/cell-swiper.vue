<template>
  <div ref="wrapper" class="cell-swiper border-1px">
    <div class="scroller" :style="styleObj">
      <div class="cell-content">
        <slot></slot>
      </div>
      <div class="btn-item top">置顶</div>
      <div class="btn-item delete">删除</div>
    </div>
  </div>
</template>

<script>
  import {Touch} from '../../common/utils/eventUtils'

  // the number of button
  const btnNum = 2
  const btnWidth = 100

  export default {
    data() {
      return {
        tlx: 0,
        styleObj: {}
      }
    },
    methods: {
      move() {
        let touch = this.touch
        let tlx = this.tlx + touch.deltaX
        // 左边界
        let maxTlx = 0
        // 右边界
        let minTlx = -btnWidth * btnNum

        // 限制滑动的边界
        if (tlx > maxTlx) {
          tlx = maxTlx
        } else if (tlx < minTlx) {
          tlx = minTlx
        }

        this.tlx = tlx
        this.styleObj = {
          transform: `translateX(${tlx}px)`
        }
      },

      end() {
        let touch = this.touch
        let disX = touch.currX - touch.startX
        if (disX === 0) return

        // 左边界
        let maxTlx = 0
        // 右边界
        let minTlx = -btnWidth * btnNum
        let flag = Math.abs(disX) > btnWidth * 0.5

        if (disX > 0) {
          this.tlx = flag ? maxTlx : minTlx
        } else {
          this.tlx = flag ? minTlx : maxTlx
        }

        this.styleObj = {
          transition: '300ms',
          transform: `translateX(${this.tlx}px)`
        }

        this.touch.disable()
        setTimeout(() => {
          this.touch.enable()
        }, 300)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.touch = new Touch(this.$refs.wrapper, {
          isPrevent: true,
          start: this.start,
          move: this.move,
          end: this.end
        })
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .cell-swiper
    overflow: hidden
    width: 100%
    white-space: nowrap
    border-1px(#d3d3d3)
    background: #fff
    .scroller
      font-size: 0
    .cell-content, .btn-item
      display: inline-block
      font-size: two-level-font-size-value
    .cell-content
      width: 100%
    .btn-item
      width: 100px
      line-height: 52px
      text-align: center
    .top
      color: #fff
      background: #ccc
    .delete
      color: #fff
      background: red
</style>
