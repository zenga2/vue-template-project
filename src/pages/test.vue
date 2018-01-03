<template>
  <page @click.native="chooseImage" class="test" :needFooter="true">
    <page-header></page-header>
    <page-main>
      <img :src="src" alt="">
    </page-main>
    <page-footer></page-footer>
  </page>
</template>

<script type="text/ecmascript-6">
  import page from '../components/page/page'
  import chooseImage from '../plugins/choose-image'

  export default {
    name: 'n_test',
    data() {
      return {
        src: ''
      }
    },
    methods: {
      chooseImage() {
        chooseImage({
          maxWidth: 300,
          quality: 0.8,
          mimeType: 'image/jpeg',
          resultType: 'blob'
        }).then(currBlob => {
          function blobToBase64(blob, cb) {
            let reader = new FileReader()
            reader.onload = function () {
              cb && cb(reader.result)
            }
            reader.readAsDataURL(blob)
          }

          blobToBase64(currBlob, (base64) => {
            this.src = base64
          })
          console.log(currBlob)
        })
      }
    },
    beforeCreate() {},
    created() {
      window.vm = this
      console.log(this.$children.length)
    },
    mounted() {
      this.$nextTick(() => {})
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
