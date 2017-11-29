<template>
  <div class="full-screen">
    <flow :step="step">
      <div class="on">已付款</div>
      <div class="on">已发货</div>
      <div class="on curr">待收货</div>
      <div>完成</div>
    </flow>
  </div>
</template>

<script type="text/ecmascript-6">
  import flow from '../components/flow/flow.vue'

  export default {
    name: 'n_test',
    data() {
      return {
        step: 2
      }
    },
    methods: {},
    created() {
      window.vm = this
    },
    mounted() {
      this.$nextTick(() => {})
    },
    components: {flow}
  }
</script>

<style lang="stylus">
  @import "../common/stylus/mixin.styl"
</style>
