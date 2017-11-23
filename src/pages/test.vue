<template>
  <div class="full-screen">
    <swipe-search class="test"></swipe-search>
  </div>
</template>

<script type="text/ecmascript-6">
  import swipeSearch from '../components/swipe-search/swipe-search.vue'

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
    components: {swipeSearch}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"
</style>
