<template>
  <div class="page-footer">
    <slot name="footer">
      <span>{{footerText}}</span>
      <slot></slot>
    </slot>
  </div>
</template>

<script>
  export default {
    props: {
      footerText: {type: String, default: '确定'}
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>
