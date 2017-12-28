<template>
  <div class="swipe-search">
    <div ref="dataWrapper" class="wrapper">
      <ul class="p-list">
        <li :index="index" v-for="(pItem, index) in dataList" class="p-item">
          <p class="text">{{pItem.name}}</p>
          <ul class="c-list">
            <li v-for="cItem in pItem.cities" class="c-item">
              <span class="c-name">{{cItem.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div ref="wrapper" :class="{on:isTouching}" class="letter-wrapper">
      <ul ref="scroller" class="letter-list">
        <li v-for="letter in letterList" class="letter-item">
          <span class="letter">{{letter}}</span>
        </li>
      </ul>
    </div>
    <div v-show="isShowLetterBox" ref="letterBox" class="letter-display-box">{{currLetter}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import dataList from './data'
  import {Touch} from '../../common/utils/eventUtils'

  export default {
    data() {
      return {
        dataList: dataList,
        letterList: dataList.map(
          (item, index) => index === 0 ? item.name[0] : item.name
        ),

        // 当前滑到的字母
        currLetter: '',
        // 当前滑到的字母的index
        currIndex: -1,
        // 上次滑到的字母的index
        lastIndex: -1,
        // 字母表是否处于按住状态
        isTouching: false,
        // 是否显示字母框
        isShowLetterBox: false,
        // 每个字母所在元素的高度
        letterItemHeight: undefined,
        // 第一个字母的文档坐标
        firstLetterTop: undefined,
        // 第一个元素(数据区)的相对于包含块的垂直偏移量
        firstElTop: undefined
      }
    },
    methods: {
      start() {
        let {scroller, dataWrapper} = this.$refs
        // 字母列表的第一个字母
        let firstLetter = scroller.children[0]

        // 每个字母所在元素的高度
        this.letterItemHeight = firstLetter.clientHeight
        // 第一个字母的文档坐标
        this.firstLetterTop = firstLetter.getBoundingClientRect().top + window.pageYOffset
        // 第一个元素(数据区)的相对于包含块的垂直偏移量
        this.firstElTop = dataWrapper.children[0].children[0].offsetTop

        this.currLetter = ''
        this.lastIndex = this.currIndex = -1
        // 计算当前touch到的字母
        this.getCurrentLetter()
        // 将数据列表滑到当前字母对应的数据块
        this.scrollToEl()

        // 给字母列表增加半透明的背景色
        this.isTouching = true
        // 显示字母显示框
        this.isShowLetterBox = true
      },

      move() {
        // 计算当前的字母
        this.getCurrentLetter()

        // 只在字母改变时滚动
        if (this.lastIndex !== this.currIndex) {
          // 将当前字母对应的列表区域滚动到屏幕最顶端
          this.scrollToEl()
        }
      },

      end() {
        // 去掉字母列表的半透明背景色
        this.isTouching = false
        // 隐藏字母显示框
        this.isShowLetterBox = false
      },

      // 获取当前手指滑到的字母
      getCurrentLetter() {
        this.lastIndex = this.currIndex

        let touch = this.myTouch
        var dis = touch.currY - this.firstLetterTop
        var len = this.letterList.length
        var currIndex = Math.floor(dis / this.letterItemHeight)
        // 防止越界
        this.currIndex = currIndex >= len
          ? len - 1
          : (currIndex < 0 ? 0 : currIndex)

        this.currLetter = this.letterList[this.currIndex]
      },

      // 将当前字母对应的列表区域滚动到屏幕最顶端(尽最大可能)
      scrollToEl() {
        let dataWrapper = this.$refs.dataWrapper
        let anchorEl = dataWrapper.querySelector(`.p-item[index='${this.currIndex}']`)

        if (anchorEl) {
          var currAnchorElTop = anchorEl.offsetTop
          dataWrapper.scrollTop = currAnchorElTop - this.firstElTop
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        let vm = this
        this.myTouch = new Touch(this.$refs.wrapper, {
          isPrevent: true,
          start() { vm.start() },
          move() { vm.move() },
          end() { vm.end() }
        })
      })
    },
    beforeDestroy() {
      // clear Touch
      if (this.myTouch) {
        this.myTouch.destroy()
        delete this.myTouch
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .swipe-search
    position: relative
    width: 100%
    height: 100%
    background: #fff
    .wrapper
      overflow: auto
      -webkit-overflow-scrolling: touch
      width: 100%
      height: 100%
      .text
        padding-left: 16px
        line-height: 28px
        font-size: 12px
        color: #333
        background: #f0f3f5
      .c-list
        padding: 0 16px
        .c-item
          border-bottom: 1px solid #e5e5e5
          &:last-child
            border-bottom: none
          .c-name
            width: 100%
            line-height: 44px
            font-size: 16px
    .letter-wrapper
      position: absolute
      top: 0
      right: 0
      bottom: 0
      width: 16px
      &.on
        background: rgba(0, 0, 0, 0.2)
      .letter-list
        display: flex
        flex-direction: column
        width: 100%
        height: 100%
        .letter-item
          flex: 1
          text-align: center
          .letter
            font-size: 12px
    .letter-display-box
      position: absolute
      top: 40%
      left: 45%
      width: 58px
      height: 58px
      line-height: 58px
      font-size: 36px
      border-radius: 10px
      text-align: center
      color: #333
      background: rgba(0, 0, 0, 0.25)
</style>
