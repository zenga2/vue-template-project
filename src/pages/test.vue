<template>
  <div class="full-screen">
    <cell-swiper>hdakd</cell-swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  import cellSwiper from '../components/cell-swiper/cell-swiper.vue'

  export default {
    name: 'n_test',
    data() {
      return {}
    },
    methods: {},
    created() {
      window.vm = this
    },
    mounted() {
      this.$nextTick(() => {})
    },
    components: {cellSwiper}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"
</style>
