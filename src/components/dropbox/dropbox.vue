<template>
  <div class="dropbox" :class="{unfold: isUnfold}">
    <div @click="switchState" class="dropbox-header">
      <span class="label">{{label}}</span>
      <i class="cell-icon icon-font-unfold"></i>
    </div>
    <div class="dropbox-content" :style="styleObj">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      label: {default: ''},
      value: {default: ''},
      contentHeight: {type: Number, default: 180}
    },
    data() {
      return {
        isUnfold: false
      }
    },
    computed: {
      styleObj() {
        return this.isUnfold ? {height: this.contentHeight + 'px'} : {height: '0'}
      }
    },
    methods: {
      switchState() {
        this.isUnfold = !this.isUnfold
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
    .cell-icon, .dropbox-content
      transition: 300ms
      transform: translateZ(0)
    .dropbox-content
      overflow: hidden
      padding: 0 16px
      background: #f6f6f6
    &.unfold
      .cell-icon
        transform: rotate(180deg)
</style>
