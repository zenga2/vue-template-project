<template>
  <div class="page" :class="{'no-footer': !needFooter}">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      needFooter: {type: Boolean, default: false}
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang="stylus">
  @import "../../common/stylus/mixin.styl"

  .page
    & > div
      width: 100%
    .page-header, .page-footer
      z-index: 2
      box-shadow: 0 0 8px #afafaf
    .page-header
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
    .page-content
      scroll(1)
      position: absolute
      top: header-height-value
      bottom: footer-height-value
    .page-footer
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
      .page-content
        bottom: 0
</style>
