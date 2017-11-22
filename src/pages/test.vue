<template>
  <div class="test">
    <ld-switch :value="value"></ld-switch>
  </div>
</template>

<script type="text/ecmascript-6">
  import ldSwitch from '../components/switch/switch.vue'

  export default {
    name: 'n_test',
    data() {
      return {
        value: false
      }
    },
    methods: {},
    created() {
      window.vm = this
    },
    mounted() {},
    components: {ldSwitch}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"
</style>
