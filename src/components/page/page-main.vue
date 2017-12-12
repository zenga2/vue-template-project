<template>
  <div v-if="!this.loadMore" class="page-main">
    <slot></slot>
  </div>
  <div v-else v-infinite="loadMore" class="page-main">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      loadMore: {type: Function}
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>
