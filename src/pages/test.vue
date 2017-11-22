<template>
  <div class="test">
    <p>{{inputStr}}</p>
    <keyboard v-model="inputStr" ref="keyboard"></keyboard>
  </div>
</template>

<script type="text/ecmascript-6">
  import keyboard from '../components/keyboard/keyboard.vue'

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
    mounted() {
      window.kkk = this.$refs.keyboard
    },
    components: {keyboard}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"
</style>
