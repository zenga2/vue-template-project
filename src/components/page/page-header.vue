<template>
  <div class="page-header">
    <slot name="header">
      <i v-if="needBack" @click.stop="backFn" class="back icon-font-left"></i>
      <h1 class="title show-ellipsis">{{title}}</h1>
      <slot></slot>
    </slot>
  </div>
</template>

<script>
  export default {
    props: {
      title: {type: String, default: ''},
      back: {type: Function},
      needBack: {type: Boolean, default: true}
    },
    data() {
      return {}
    },
    methods: {
      backFn() {
        if (this.back) {
          this.back()
        } else {
          this.$router.back()
        }
      }
    }
  }
</script>
