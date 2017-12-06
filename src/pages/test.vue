<template>
  <div class="test full-screen">
    <child>
      <span slot="tip"> world</span>
    </child>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'n_test',
    data() {
      return {}
    },
    methods: {},
    beforeCreate() {},
    created() {
      window.vm = this
    },
    mounted() {
      this.$nextTick(() => {})
    },
    components: {
      child: {
        template: '<div><slot name="tip" text="child-class">default<slot></slot></slot></div>'
      }
    }
  }
</script>

<style lang="stylus">
  @import "../common/stylus/mixin.styl"

  .test
    .item
      line-height: 52px
      & > span
        padding-right: 20px
</style>
