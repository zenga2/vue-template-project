<template>
  <div v-if="!isRemove" class="ld-confirm ld-common-box" :class="classObj">
    <div class="mask"></div>
    <div class="confirm-box ld-box">
      <p class="title" :style="{color: titleColor}">{{title}}</p>
      <p :style="{color: contentColor}" class="content">{{content}}</p>
      <div class="btn">
        <span @click="clickCancelFn" :style="{color: cancelBtnColor}" class="left text">{{cancelBtnText}}</span>
        <span @click="clickOnOk" :style="{color: okBtnColor}" class="right text">{{okBtnText}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {type: String, default: '提示'},
      titleColor: {type: String},
      content: {type: String},
      contentColor: {type: String},
      okBtnText: {type: String, default: '确定'},
      okBtnColor: {type: String},
      cancelBtnText: {type: String, default: '取消'},
      cancelBtnColor: {type: String},
      onOk: {type: Function},
      onCancel: {type: Function}
    },
    data() {
      return {
        toggleState: true,
        isRemove: false
      }
    },
    computed: {
      classObj() {
        return {
          'ld-dialog-enter': this.toggleState,
          'ld-dialog-leave': !this.toggleState
        }
      }
    },
    methods: {
      clickFn(callback) {
        this.$nextTick(() => {
          this.toggleState = false
          setTimeout(() => {
            this.isRemove = true
            callback && callback()
          }, 150)
        })
      },
      clickCancelFn() {
        this.clickFn(this.onCancel)
      },
      clickOnOk() {
        this.clickFn(this.onOk)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .ld-confirm
    .confirm-box
      .title
        padding: 22px 0 13px
        line-height: 20px
        font-size: title-text-font-size
        color: title-text-color-value
      .content
        padding: 0 20px 12px
        min-height: 52px
        line-height: 1.6
        font-size: content-text-font-size
        color: content-text-color-value
        border-1px(#ddd)
      .btn
        display: flex
        .text
          flex: 1
          line-height: 46px
          font-size: title-text-font-size
          color: blue-color-value
        .left
          border-right: 1px solid #ddd
          color: #333
</style>

