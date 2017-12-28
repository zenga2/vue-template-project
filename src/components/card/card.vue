<template>
  <div class="card">
    <div class="card-header border-1px" :class="{'no-border':dataList.length === 0, headClass}">
      <span class="title">{{title}}</span>
      <span class="state">{{state}}</span>
    </div>
    <div class="card-content" :style="styleObj">
      <div class="card-content-item"
           v-for="item in dataList"
           :class="item.itemClass"
      ><span class="lable">{{item.label}}</span>
        <span class="value">{{item.value}}</span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {type: String, default: ''},
      state: {type: String, default: ''},
      dataList: {type: Array, default() { return [] }},
      headClass: {type: String, default: ''}
    },
    computed: {
      styleObj() {
        if (this.dataList.length === 0) {
          return {
            padding: '0'
          }
        }

        return {}
      }
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .card
    margin-bottom: 10px
    font-size: three-level-font-size-value
    background: #fff
    .card-header
      display: flex
      padding: 0 20px
      line-height: 44px
      color: #333
      border-1px(#d3d3d3)
      .state
        flex: 1
        text-align: right
      &.no-border
        border-none()
    .card-content
      padding: 10px 20px
      color: #999
      .card-content-item
        display: flex
        line-height: 25px
        .value
          flex: 1
          text-align: right
</style>
