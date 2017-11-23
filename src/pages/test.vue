<template>
  <div class="test">
    <p>{{'15671628325' | formateMobile}}</p>
    <p>{{123425436737.345324 | formateMoney}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'n_test',
    data() {
      return {
        inputStr: ''
      }
    },
    methods: {},
    created() {
      window.vm = this
    },
    mounted() {},
    components: {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"
</style>
