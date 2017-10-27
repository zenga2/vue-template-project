<template>
  <div class="test">
    <div class="test-header">
      <i @click="back" class="back icon-font-return"></i>
      <span @click="upload" class="use">上传</span>
    </div>
    <croppa class="my-croppa"
            ref="myCroppa"
            v-model="myCroppa"
            accept="image/*"
            :placeholder="placeholder"
            placeholder-color="#666"
            :placeholder-font-size="14"
            :show-remove-button="true"
            :width="width"
            :height="height"
            :quality="1"
            :prevent-white-space="false"
            :file-size-limit="1024 * 1024 * 20"
            :show-loading="true"
            :loading-size="48"
            loading-color="#39f"
            @new-image="onNewImage"
            @image-remove="onImageRemove"
            @loading-start="onLoadingStart"
            @loading-end="onLoadingEnd"
            @file-size-exceed="onFileSizeExceed"
            canvas-color="transparent"
    ></croppa>
    <div v-show="false" class="control-wrapper">
      <div @click="zoomIn" class="zoom-in">放大</div>
      <div @click="zoomOut" class="zoom-out">缩小</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import 'vue-croppa/dist/vue-croppa.css'
  import Http from '../plugins/http'
  import Vue from 'vue'
  import Croppa from 'vue-croppa'

  Vue.use(Croppa)

  export default {
    name: 'n_test',
    data () {
      return {
        width: 272,
        height: 480,
        myCroppa: {},
        placeholder: '请选择图片'
      }
    },
    methods: {
      back () {
        this.$router.back()
      },

      zoomIn () {
        this.$refs.myCroppa.zoomIn()
      },
      zoomOut () {
        this.$refs.myCroppa.zoomOut()
      },

      onNewImage () {
        console.log('onNewImage')
      },

      onImageRemove () {
        console.log('onImageRemove')
      },

      onLoadingStart () {
        this.placeholder = ''
        console.log('onLoadingStart')
      },

      onLoadingEnd () {
        this.placeholder = '请选择图片'
        console.log('onLoadingEnd')
      },

      onFileSizeExceed () {
        this.$ldUtils.toast('请选择小于20M的图片')
      },

      upload () {
        if (!this.$refs.myCroppa.hasImage()) {
          this.$refs.myCroppa.chooseFile()
          return
        }

        this.$nextTick(() => {
          setTimeout(() => {
            this.myCroppa.generateBlob(blob => {
              console.log(blob)
              let http = new Http({
                transformResponse (response) {
                  return response
                }
              })

              let formData = new FormData()
              formData.append('filename', blob)

              http.request('http://192.168.10.113:8088/crm-api/desktopad/imageUploadResource', {
                // Content-Type清空，让浏览器自动指定
                requestType: 'none',
                body: formData
              }).then(
                (response) => {
                  console.log(response)
                  this.$ldUtils.toast('上传成功')
                },
                (error) => {
                  console.log(error)
                  this.$ldUtils.toast('上传失败')
                }
              )
            }, 'image/jpeg', 0.8)
          }, 100)
        })
      }
    },
    created () {
      window.vm = this
      let http = new Http()
      let fb = new FormData()
      fb.append('userAgen', window.navigator.userAgent)
      http.request('http://192.168.10.125:5555/upload', {
        requestType: 'none',
        body: fb
      })
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.myCroppa.chooseFile()
      })
    },
    components: {}
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
