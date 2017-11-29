<template>
  <div class="full-screen">
    <swiper>
      <img :width="width" src="../common/images/one.png"/>
      <img :width="width" src="../common/images/two.png"/>
      <img :width="width" src="../common/images/three.png"/>
      <img :width="width" src="../common/images/four.png"/>
      <img :width="width" src="../common/images/five.png"/>
      <img :width="width" src="../common/images/six.png"/>
    </swiper>
  </div>
</template>

<script type="text/ecmascript-6">
  import swiper from '../components/swiper/swiper.vue'

  export default {
    name: 'n_test',
    data() {
      return {
        inputStr: '',
        width: undefined
      }
    },
    methods: {},
    created() {
      window.vm = this
    },
    mounted() {
      this.$nextTick(() => {
        this.width = document.body.clientWidth
      })
    },
    components: {swiper}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"
</style>
