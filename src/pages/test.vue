<template>
  <div class="test">
    <picker></picker>
  </div>
</template>

<script type="text/ecmascript-6">
  import picker from '../components/picker/picker.vue'

  export default {
    name: 'n_test',
    data() {
      return {}
    },
    methods: {},
    created() {},
    mounted() {},
    components: {picker}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"

  .test
    .test-header
      position: relative
      padding: 0 10px
      background: #fff
      .back
        line-height: 48px
        font-size: 28px
        color: #39f
      .use
        vertical-center()
        right: 10px
        padding: 0 13px
        border-radius: 3px
        line-height: 30px
        font-size: three-level-font-size-value
        color: #fff
        background: #39f

    .my-croppa
      display: block
      margin: 15px auto
      width: 272px

    .control-wrapper
      margin: 0 auto
      width: 150px
      font-size: 0
      .zoom-in
        margin-right: 20%
      .zoom-in, .zoom-out
        display: inline-block
        padding-top: 2px
        width: 40%
        text-align: center
        border-radius: 20px
        line-height: 2
        font-size: 14px
        color: #fff
        background: #39f

  .sk-fading-circle
    all-center()
</style>
