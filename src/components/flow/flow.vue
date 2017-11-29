<template>
  <div ref="flow" class="flow">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      // 从1开始
      step: {type: Number, default: 0}
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

  /*df*/
</style>