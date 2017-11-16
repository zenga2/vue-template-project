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
      value: {type: Number, default: 0}
    },
    data() {
      return {
        bScroll: undefined,
        dataList: [
          {label: 1, value: 1},
          {label: 2, value: 2},
          {label: 3, value: 3},
          {label: 4, value: 4},
          {label: 5, value: 5},
          {label: 6, value: 6},
          {label: 7, value: 7},
          {label: 8, value: 8},
          {label: 9, value: 9},
          {label: 10, value: 10},
          {label: 11, value: 11},
          {label: 12, value: 12},
          {label: 13, value: 13},
          {label: 14, value: 14},
          {label: 15, value: 15},
          {label: 16, value: 16},
          {label: 17, value: 18},
          {label: 19, value: 19},
          {label: 20, value: 20},
          {label: 21, value: 21},
          {label: 22, value: 22},
          {label: 23, value: 23},
          {label: 24, value: 24},
          {label: 25, value: 25},
          {label: 26, value: 26},
          {label: 27, value: 27},
          {label: 28, value: 28},
          {label: 29, value: 29}
        ],
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
        }
      },

      scrollTo(x, y, time = 300) {
        let bScroll = this.bScroll

        bScroll._transitionTime(time)
        bScroll._translate(x, y)
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
          console.log('scrollEnd')
          let itemNum = Math.abs(y) / itemHeight + 0.6 * bScroll.movingDirectionY

          if (bScroll.movingDirectionY > 0) {
            itemNum = Math.floor(itemNum)
          } else {
            itemNum = Math.ceil(itemNum)
          }

          this.scrollTo(0, -itemNum * itemHeight)

          this.setItemIndex(itemNum + 1)
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
