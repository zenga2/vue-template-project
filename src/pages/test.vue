<template>
  <page class="test full-screen" :needFooter="true">
    <page-header></page-header>
    <page-main></page-main>
    <page-footer></page-footer>
  </page>
</template>

<script type="text/ecmascript-6">
  import page from '../components/page/page'
  import Vue from 'vue'

  export default {
    name: 'n_test',
    data() {
      return {}
    },
    methods: {},
    beforeCreate() {},
    created() {
      window.vm = this
      console.log(this.$children.length)
    },
    mounted() {
      this.$nextTick(() => {
        console.log(this.$children.length)
      })
    },
    components: {page}
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
