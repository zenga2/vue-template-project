<template>
  <div id="app">
    <router-view :exclude="exclude"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'app',
    data () {
      return {
        exclude: /^n_/
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  body
    background: #f0f1f5
</style>
