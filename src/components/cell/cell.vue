<template>
  <div class="cell border-1px" :class="{'single-cell': isSingle}">
    <span class="label">{{label}}</span>
    <span v-if="!isInputBox" class="value-text">{{value}}</span>
    <input v-if="isInputBox" class="value"
           @input="inputHandle"
           :placeholder="placeholder"
           :type="inputType"
           :readonly="!isInputBox"
           :maxlength="maxLength"
           :data-focus-prop="focusProp"
           :value="value">
    <i v-if="isLink" class="cell-icon icon-font-return"></i>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      label: {default: ''},
      value: {default: ''},
      isInputBox: {type: Boolean, default: false},
      isLink: {type: Boolean, default: false},
      isSingle: {type: Boolean, default: false},
      inputType: {type: String, default: 'text'},
      placeholder: {default: ''},
      maxLength: {type: [String, Number], default: ''},
      focusProp: {type: String}
    },
    methods: {
      inputHandle(e) {
        this.$emit('input', e.target.value)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .cell
    display: flex
    position: relative
    padding: 0 16px
    font-size: three-level-font-size-value
    color: #666
    background: #fff
    border-1px(#d3d3d3)
    &:after
      left: 16px
      right: 16px
      width: auto
    .label, .value, .value-text
      line-height: normal-height-value
    .value, .value-text
      overflow: hidden
      flex: 1
      text-align: right
      color: #666
    .value
      border: none
      outline: none
      background: transparent
      &::-webkit-input-placeholder
        font-size: three-level-font-size-value
    .cell-icon
      margin-left: 5px
      transform: rotate(180deg)
      line-height: normal-height-value
      font-size: 20px

  .cell.single-cell
    border-none()
</style>
