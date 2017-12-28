<template>
  <div class="tap border-1px">
    <div v-for="item in dataList"
         @click.stop="clickHandler(item.value)"
         :class="{on:pValue===item.value}"
         class="tap-item">
      <span>{{item.label}}</span>
      <div class="flag"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      dataList: {type: Array, default() { return [] }},
      value: {type: [String, Number]}
    },
    data() {
      return {
        pValue: this.value
      }
    },
    methods: {
      clickHandler(currValue) {
        this.pValue = currValue
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

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .tap
    display: flex
    border-1px(#d3d3d3)
    font-size: three-level-font-size-value
    background: #fff
    .tap-item
      position: relative
      flex: 1
      padding: 15px 0
      text-align: center
      &.on
        color: blue-color-value
        .flag
          display: block
      .flag
        display: none
        position: absolute
        left: 20%
        right: 15%
        bottom: 0
        height: 5px
        background: blue-color-value
</style>
