<template>
  <div class="page" :class="{'no-footer': !needFooter}">
    <div class="ld-header">
      <i v-if="needBack" @click.stop="backFn" class="back icon-font-left"></i>
      <h1 class="title show-ellipsis">{{title}}</h1>
      <slot name="header-other"></slot>
    </div>
    <div v-if="!this.loadMore" class="ld-content">
      <slot></slot>
    </div>
    <div v-else v-infinite="loadMore" class="ld-content">
      <slot></slot>
    </div>
    <div @click="onOk" v-if="needFooter" class="ld-footer">{{footerText}}</div>
    <slot name="page-other"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {type: String, default: ''},
      back: {type: Function},
      onOk: {type: Function},
      needBack: {type: Boolean, default: true},
      footerText: {type: String, default: '确定'},
      needHeader: {type: Boolean, default: true},
      needFooter: {type: Boolean, default: false},
      loadMore: {type: Function}
    },
    data() {
      return {}
    },
    methods: {
      backFn() {
        this.$router.back()
        this.back && this.back()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .page
    position: relative
    height: 100%
    & > div
      width: 100%
    .ld-header, .ld-footer
      z-index: 2
      box-shadow: 0 0 8px #afafaf
    .ld-header
      position: absolute
      top: 0
      background: #fff
      .back
        position: absolute
        left: 8px
        line-height: header-height-value
        font-size: 30px
        color: blue-color-value
      .title
        padding: 0 15%
        height: header-height-value
        text-align: center
        line-height: header-height-value
        font-size: two-level-font-size-value
        color: #333
    .ld-content
      scroll(1)
      position: absolute
      top: header-height-value
      bottom: footer-height-value
    .ld-footer
      position: absolute
      bottom: 0
      text-align: center
      line-height: footer-height-value
      font-size: two-level-font-size-value
      color: blue-color-value
      background: #fff
      &:active
        background: rgba(0, 0, 0, .1)
      &.disabled
        color: rgba(255, 255, 255, .75)
        opacity: 0.8
        background: #d0d0d0
    &.no-footer
      .ld-content
        bottom: 0
</style>
