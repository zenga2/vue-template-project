<template>
  <div class="test-date-picker">
    <date-picker ref="datePicker"></date-picker>
  </div>
</template>

<script>
  import datePicker from '../components/date-picker/date-picker.vue'

  export default {
    data() {
      return {}
    },
    methods: {},
    mounted() {
      this.$nextTick(() => {
        this.$refs.datePicker.show()
      })
    },
    components: {datePicker}
  }
</script>

<style lang="stylus">

</style>
