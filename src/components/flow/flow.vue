<template>
  <div ref="flow" class="flow" :class="'flow-'+type">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      // 从1开始
      step: {type: Number, default: 0},
      type: {type: String, default: 'vertical'}
    },
    data() {
      return {}
    },
    methods: {
      updateState() {
        let children = this.$refs.flow.children
        let len = children.length
        let step = this.step

        for (let i = 0; i < len; i++) {
          let classList = children[i].classList

          if (i < step) {
            classList.add('on')
          } else {
            classList.remove('on')
          }

          classList.remove('curr')
        }

        if (step > 0) {
          children[step - 1].classList.add('curr')
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.updateState()
      })
    },
    watch: {
      step: 'updateState'
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .flow
    background: #fff

  .flow-vertical
    & > div
      position: relative
      padding-left: 30px
      height: 50px
      &:after
        z-index: 1
        position: absolute
        left: 0
        width: 14px
        height: 14px
        border-radius: 50%
        background: #ccc
        content: ''
      &:before
        position: absolute
        left: 5px
        width: 4px
        height: 100%
        background: #ccc
        content: ''
      &:last-child
        &:before
          display: none
      &.on
        color: blue-color-value
        &:after, &:before
          background: blue-color-value
        &.curr
          &:before
            background: #ccc

  .flow-horizontal
    display: flex
    & > div
      position: relative
      padding-top: 30px
      width: 80px
      text-align: center
      &:after
        z-index: 1
        position: absolute
        top: 0
        left: 50%
        margin-left: -7px
        width: 14px
        height: 14px
        border-radius: 50%
        background: #ccc
        content: ''
      &:before
        position: absolute
        top: 5px
        left: 0
        width: 100%
        height: 4px
        background: #ccc
        content: ''
      &:first-child:before
        left: 50%
      &:last-child:before
        width: 50%
      &.on
        color: blue-color-value
        &:after, &:before
          background: blue-color-value
</style>