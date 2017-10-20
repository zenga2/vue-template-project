<template>
  <div class="select-address">
    <cell @click.native="toggleBox('province')" label="省份" :value="provinceItem.label" isLink></cell>
    <cell @click.native="toggleBox('city')" label="城市" :value="cityItem.label" isLink></cell>
    <cell @click.native="toggleBox('county')" label="县/区" :value="countyItem.label" isLink
          isSingle></cell>
    <selectbox
        title="请选择省份"
        ref="province"
        @change="changeAddress"
        v-model="provinceItem"
        :dataList="provinceList"
    ></selectbox>
    <selectbox
        title="请选择城市"
        ref="city"
        @change="changeAddress"
        v-model="cityItem"
        :dataList="cityList"
    ></selectbox>
    <selectbox
        title="请选择县/区"
        ref="county"
        @change="changeAddress"
        v-model="countyItem"
        :dataList="countyList"
    ></selectbox>
  </div>
</template>

<script type="text/ecmascript-6">
  import cell from '../cell/cell.vue'
  import selectbox from '../selectbox/selectbox.vue'

  // provinceData: label value
  // cityData: provinceId label value
  // countyData: provinceId, cityId label value
  // label是名称 value是编号
  // 要确保本组件的父组件中不要使用过渡和动画效果，否则fixed的效果会变成absolute
  // 或者让该父组件为全屏

  export default {
    props: {
      provinceData: {type: Array, default () { return [] }},
      cityData: {type: Array, default () { return [] }},
      countyData: {type: Array, default () { return [] }},
      value: {type: Object, default () { return {} }}
    },
    data () {
      return {
        provinceItem: this.value.provinceItem,
        cityItem: this.value.cityItem,
        countyItem: this.value.countyItem
      }
    },
    computed: {
      provinceList () {
        return this.provinceData
      },

      cityList () {
        // 因为下面两行赋值语句只会调用setter，不会调用getter
        // 所以该计算属性不会把cityItem和countyItem加入依赖列表
        // 所以下面两行代码的意思是当provinceId变化时，清空cityId和countyId
        // Vue检测依赖项的逻辑放在getter中
        this.cityItem = {}
        this.countyItem = {}

        if (this.provinceItem && this.provinceItem.value) {
          return this.cityData
            .filter(({provinceId}) => this.provinceItem.value === provinceId)
        } else {
          return []
        }
      },

      countyList () {
        this.countyItem = {}

        if (this.provinceItem && this.provinceItem.value
          && this.cityItem && this.cityItem.value) {
          return this.countyData
            .filter(({provinceId, cityId}) => {
              return this.provinceItem.value === provinceId && this.cityItem.value === cityId
            })
        } else {
          return []
        }
      }
    },
    methods: {
      toggleBox (boxKey) {
        this.$refs[boxKey].toggle()
      },

      changeAddress () {
        // 延时确保数据已更新
        this.$nextTick(() => {
          let data = {
            provinceItem: this.provinceItem,
            cityItem: this.cityItem,
            countyItem: this.countyItem
          }

          this.$emit('input', data)
          this.$emit('change', data)
        })
      }
    },
    watch: {
      value (newItem) {
        if (!newItem) {
          this.provinceItem = this.cityItem = this.countyItem
          return
        }

        // 过滤到v-model导致的调用
        const props = ['provinceItem', 'cityItem', 'countyItem']
        props.forEach(prop => {
          if (newItem[prop] !== this[prop]) {
            this[prop] = newItem[prop]
          }
        })
      }
    },
    components: {cell, selectbox}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
