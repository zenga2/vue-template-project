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
  import Http from '../plugins/http'

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
        }).then(file => {
          this.uploadFile(file).then(data => {
            console.log('data', data)
          })
        })
      },

      uploadFile(file) {
        let http = new Http()
        return http.post('https://upload.qiniup.com/', {
          requestType: 'formData',
          body: {
            token: 'A8SIAnj_MoLaBFRnPlmdCi78eLSUdY57VbMgFJZy:rRiDZbbvugLfAwyJm7DLT-5kGjc=:eyJzY29wZSI6ImNkdC1pbWFnZXMiLCJkZWFkbGluZSI6MTU5NTQ4NTcxMX0=',
            file: file
          }
        })
      },

      blobToBase64(blob, cb) {
        let reader = new FileReader()
        reader.onload = function () {
          cb && cb(reader.result)
        }
        reader.readAsDataURL(blob)
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
