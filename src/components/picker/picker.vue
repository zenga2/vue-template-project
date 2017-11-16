<template>
  <div @touchstart="preventDefault" ref="wrapper" class="picker">
    <div class="scroller">
      <div class="padding-top"></div>
      <div v-for="item in dataList" class="data-item">{{item.label}}</div>
      <div class="padding-bottom"></div>
    </div>
    <div class="picker-mask" data-role="mask"></div>
    <div class="picker-indicator" data-role="indicator"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  const swipeTime = 800
  const itemHeight = 36

  export default {
    props: {
      value: {type: Number, default: 0},
      dataList: {type: Array, default() { return [] }}
    },
    data() {
      return {
        currIndex: 0
      }
    },
    methods: {
      preventDefault(e) {
        e.preventDefault()
      },

      setItemIndex(currIndex) {
        if (this.currIndex !== currIndex) {
          this.currIndex = currIndex
          this.$emit('input', currIndex)
          this.$emit('change', currIndex)
        }
      },

      scrollTo(x, y, time = 300) {
        let bScroll = this.bScroll

        bScroll._transitionTime(time)
        bScroll._translate(x, y)
      },

      calculateItemIndex(y) {
        let bScroll = this.bScroll
        let itemIndex = Math.abs(y) / itemHeight + 0.6 * bScroll.movingDirectionY

        if (bScroll.movingDirectionY > 0) {
          itemIndex = Math.floor(itemIndex)
        } else {
          itemIndex = Math.ceil(itemIndex)
        }

        return itemIndex
      },

      initEvent() {
        let bScroll = this.bScroll

        bScroll.on('touchEnd', () => {
          bScroll.disable()
          setTimeout(() => {
            bScroll.enable()
          }, swipeTime)
        })

        bScroll.on('scrollEnd', ({y}) => {
          let itemIndex = this.calculateItemIndex(y)

          this.scrollTo(0, -itemIndex * itemHeight)

          this.setItemIndex(itemIndex)
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.bScroll = new BScroll(this.$refs.wrapper, {
          swipeTime,
          startY: -itemHeight * this.value
        })

        this.initEvent()
      })
    },
    updated () {
      this.$nextTick(function () {
        console.log('updated')
        if (this.bScroll) {
          this.bScroll.refresh()

          // 刷新后，重新计算当前选中项的index
          let itemIndex = Math.round(Math.abs(this.bScroll.y) / itemHeight)
          this.setItemIndex(itemIndex)
        }
      })
    },
    beforeDestroy() {
      if (this.bScroll) {
        this.bScroll.destroy()
        delete this.bScroll
      }
    },
    watch: {
      value(newValue) {
        if (newValue !== this.currIndex) {
          this.currIndex = newValue
          this.scrollTo(0, -newValue * itemHeight)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  containerHeight = 260px
  itemHeight = 36px
  paddingTop = (containerHeight - itemHeight) * 0.5
  indicatorColor = #d0d0d0

  .picker
    overflow: hidden
    position: relative
    height: containerHeight
    color: #000
    background: #fff
    .padding-top, .padding-bottom
      height: paddingTop
    .scroller
      .data-item
        line-height: itemHeight
        text-align: center
    .picker-mask
      z-index: 3
      position: absolute
      left: 0
      top: 0
      height: 100%
      width: 100%
      background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6)),
          linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6))
      background-position: top, bottom
      background-size: 100% paddingTop
      background-repeat: no-repeat
    .picker-indicator
      z-index: 3
      position: absolute
      left: 0
      top: paddingTop
      width: 100%
      height: itemHeight
      /*border-top: 1px solid #ccc*/
      /*border-bottom: 1px solid #ccc*/
      background-image: linear-gradient(to bottom, indicatorColor, indicatorColor, transparent, transparent),
          linear-gradient(to top, indicatorColor, indicatorColor, transparent, transparent);
      background-position: top, bottom
      background-size: 100% 1px
      background-repeat: no-repeat
</style>
