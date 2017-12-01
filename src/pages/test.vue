<template>
  <div class="full-screen">
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
    beforeCreate() {
      let validatorMap = this.$options.validators
      let keys = Object.keys(validatorMap)

      if (keys.length === 0) return

      for ([index, key] of keys) {
        let validator = validatorMap[key]
      }
    },
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
