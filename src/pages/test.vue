<template>
  <div class="full-screen">
    <div><span></span><span></span><span></span></div>
    <div><span></span><span></span><span></span></div>
    <div><span></span><span></span><span></span></div>
    <div><span></span><span></span><span></span></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'n_test',
    data() {
      return {
        step: 2
      }
    },
    validators: {
      step: 'requred'
    },
    methods: {},
    beforeCreate() {},
    created() {
      window.vm = this
    },
    mounted() {
      this.$nextTick(() => {})
    },
    components: {}
  }
</script>

<style lang="stylus">
  @import "../common/stylus/mixin.styl"
</style>
