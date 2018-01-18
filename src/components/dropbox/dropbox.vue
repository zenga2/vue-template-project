<template>
  <div class="dropbox" :class="{unfold: isUnfold}">
    <div @click="switchState" class="dropbox-header">
      <span class="label">{{label}}</span>
      <i class="cell-icon icon-font-unfold"></i>
    </div>
    <transition name="dropbox">
      <div v-show="isUnfold" class="dropbox-content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      label: {default: ''},
      value: {default: ''},
      needUnfold: {type: Boolean, default: false},
      needScrollToTop: {type: Boolean, default: false}
    },
    data() {
      return {
        isUnfold: this.needUnfold
      }
    },
    methods: {
      switchState() {
        this.isUnfold = !this.isUnfold
        this.needScrollToTop && this.isUnfold && setTimeout(() => {
          this.$el.scrollIntoView()
        }, 500)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .dropbox
    margin-bottom: 15px
    color: #999
    .dropbox-header
      position: relative
      padding: 0 16px
      height: normal-height-value
      line-height: normal-height-value
      background: #fff
      .label
        font-size: three-level-font-size-value
      .cell-icon
        position: absolute
        right: 16px
        line-height: normal-height-value
        font-size: 24px
    .cell-icon
      transition: 300ms
      transform: translateZ(0)
    .dropbox-content
      overflow: hidden
      padding: 0 16px
      background: #f6f6f6
      transform-origin: top center
    &.unfold
      .cell-icon
        transform: rotate(180deg)

    .dropbox-enter-active, .dropbox-leave-active
      transform: translateZ(0)
      transition: 300ms

    .dropbox-enter, .dropbox-leave-to
      transform: scaleY(0)

    .dropbox-enter-to, .dropbox-leave
      transform: scaleY(1)
</style>
