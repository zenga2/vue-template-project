<template>
  <div id="wrapper" v-pre-bind:mousedown="['text', onClick]">
    <div v-if="isShow" id="scroller" v-pre-bind:mousedown="['text', onLongPress]">
      <div class="content-wrapper">
        <ul class="content-list" style="height: 1200px; background: #000;">
          <li class="item">
            <div class="info">
              <h6 class="info-top">
                <span class="pull-left">张化名</span>
                <span class="pull-right">15977884455</span>
              </h6>
              <div class="info-bottom">
                <p class="pull-left"><span>APP开户</span><span>中国银行网点</span></p>
                <p class="pull-right">11/27 13:45:01 <span style="margin-left: 30px">sdkfhksdfhks</span></p>
              </div>
            </div>
            <div class="status-wrapper">
              <span class="text">已完成</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        isShow: true
      }
    },
    methods: {
      onClick (currEl, e) {
        console.log(currEl, e, 'on click')
      },

      onLongPress (currEl, e) {
        console.log(currEl, e.target, 'on long press')
      }
    },
    created () {
      window.vm = this
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
