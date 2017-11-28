<template>
  <div ref="wrapper" class="swiper">
    <div ref="scroller" class="scroller" :style="{width: totalWidth+'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      pageNum: {type: Number},
      pageWidth: {type: Number}
    },
    data() {
      return {
        bScroll: undefined,
        totalWidth: undefined,
        pPageNum: this.pageNum,
        pPageWidth: this.pageWidth
      }
    },
    methods: {
      initEvent() {
        let bScroll = this.bScroll

        bScroll.on('touchEnd', ({x}) => {
          // stop 只有在过渡正在进行时才能起作用，所以延迟一下
          setTimeout(() => {
            if (x < 0 && x > bScroll.maxScrollX) {
              bScroll.stop()

              // 计算滚动到的页号
              let pIndex = Math.abs(x / this.pPageWidth) + 0.85 * bScroll.movingDirectionX
              if (bScroll.movingDirectionX > 0) {
                pIndex = Math.floor(pIndex)
              } else {
                pIndex = Math.ceil(pIndex)
              }

              bScroll.scrollTo(-pIndex * this.pPageWidth, 0, 350)
            }
          }, 0)
        })
      },

      initData() {
        this.refresh()
      },

      refresh() {
        let {wrapper, scroller} = this.$refs

        if (this.pageNum === undefined) {
          this.pPageNum = scroller.children.length
        }

        if (this.pageWidth === undefined) {
          this.pPageWidth = wrapper.clientWidth
        }

        this.totalWidth = this.pPageWidth * this.pPageNum
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initData()

        setTimeout(() => {
          this.bScroll = new BScroll(this.$refs.wrapper, {
            scrollX: true,
            scrollY: false
          })

          this.initEvent()
        }, 100)
      })
    },
    beforeDestroy() {
      if (this.bScroll) {
        this.bScroll.destroy()
        delete this.bScroll
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .swiper
    overflow: hidden
    width: 100%
    .scroller
      white-space: nowrap
      font-size: 0
</style>
