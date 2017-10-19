<template>
  <div id="wrapper">
    <cell label="初始模块"
          :value="currItem.label"
          :clickFn="toggle"
          isLink isSingle
    ></cell>
    <selectbox
        ref="selectbox"
        :dataList="dataList"
        :value="initItem"
        @change="changeInitModule"
    ></selectbox>
  </div>
</template>

<script type="text/ecmascript-6">
  import selectbox from '../components/selectbox/selectbox.vue'
  import cell from '../components/cell/cell.vue'

  export default {
    data () {
      return {
        isShow: true,
        initItem: {value: 10},
        currItem: {label: '选项11'},
        dataList: [
          {label: '选项1', value: 0},
          {label: '选项2', value: 1},
          {label: '选项3', value: 2},
          {label: '选项4', value: 3},
          {label: '选项5', value: 4},
          {label: '选项6', value: 5},
          {label: '选项7', value: 6},
          {label: '选项8', value: 7},
          {label: '选项9', value: 8},
          {label: '选项10', value: 9},
          {label: '选项11', value: 10},
          {label: '选项12', value: 11},
          {label: '选项13', value: 12},
          {label: '选项14', value: 13},
          {label: '选项15', value: 14}
        ]
      }
    },
    methods: {
      toggle () {
        this.$refs.selectbox.toggle()
      },

      changeInitModule (data) {
        this.currItem = data
      }
    },
    created () {
      window.vm = this
    },
    components: {selectbox, cell}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
