<template>
  <transition name="fade">
    <div v-show="isShow" class="input-box ld-common-box">
      <div @click="hide" class="mask"></div>
      <div class="box-content">
        <div class="title">{{title}}</div>
        <div class="input-wrapper border-1px">
          <input class="input" type="text"
                 ref="myInput"
                 v-model="inputStr"
                 :placeholder="placeholder"
                 :maxlength="maxLength">
          <span class="char-num">{{charNum}}/{{maxLength}}</span>
        </div>
        <div class="btn-box">
          <span @click="cancelFn" class="cancel">{{cancelText}}</span>
          <span @click="okFn" class="submit">{{okText}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {type: String, default: ''},
      placeholder: {type: String, default: ''},
      maxLength: {type: Number, default: 20},
      cancelText: {type: String, default: '取消'},
      okText: {type: String, default: '确定'},
      onCancel: {type: Function},
      onOk: {type: Function}
    },
    data() {
      return {
        isShow: false,
        inputStr: ''
      }
    },
    computed: {
      charNum() {
        return this.inputStr.length
      }
    },
    methods: {
      show() {
        this.isShow = true
      },

      hide() {
        this.isShow = false
        this.inputStr = ''
      },

      focus() {
        setTimeout(() => {
          this.$refs.myInput.focus()
        }, 100)
      },

      cancelFn() {
        this.onCancel && this.onCancel(this.inputStr)
        this.hide()
      },

      okFn() {
        this.onOk && this.onOk(this.inputStr)
        this.hide()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .input-box
    .box-content
      z-index: 101
      all-center()
      padding: 20px 16px
      width: 70%
      border-radius: 5px
      background: #fff
      .title
        font-size: two-level-font-size-value
        color: #000
        margin-bottom: 20px
      .input-wrapper
        width: 75%
        border-1px(#d3d3d3)
        padding-bottom: 3px
        .input
          outline: none
          border: none
          width: 100%
          font-size: three-level-font-size-value
          color: #000
        .input::-webkit-input-placeholder, .char-num {
          font-size: three-level-font-size-value
          color: #999
        }
        .char-num
          position: absolute
          top: 0
          right: -55px
      .btn-box
        margin-top: 40px
        text-align: right
        font-size: three-level-font-size-value
        .cancel
          color: red
          margin-right: 12%
        .submit
          margin-right: 15px
          color: #999
</style>
