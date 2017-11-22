<template>
  <div class="switch">
    <input type="checkbox" class="switch-content"
           ref="checkbox"
           :checked="pValue"
           @change="inputHandle"
    />
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      value: {type: Boolean, default: false}
    },
    data() {
      return {
        pValue: this.value
      }
    },
    methods: {
      inputHandle() {
        this.pValue = !this.pValue

        this.$emit('input', this.pValue)
        this.$emit('change', this.pValue)
      }
    },
    watch: {
      value(newValue) {
        if (newValue !== this.pValue) {
          this.pValue = newValue
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .switch
    display: inline-block
    font-size: 0
    .switch-content
      position: relative
      border: 1px solid #d3d3d3
      width: 56px
      height: 32px
      border-radius: 16px
      appearance: none
      outline: none
      background: #ccc
      transition: 350ms
      &:checked
        background: blue-color-value
        &:after
          transform: translateX(26px)
      &:after
        position: absolute
        width: 30px
        height: 30px
        border-radius: 16px
        background: #fff
        content: ''
        transition: 350ms
</style>
