<template>
  <div class="select-address">
    <cell @click.native="toggleBox('province')"
          class="cell-item"
          label="省份" :value="provinceItem.label" isLink></cell>
    <cell @click.native="toggleBox('city')"
          class="cell-item"
          label="城市" :value="cityItem.label" isLink></cell>
    <cell @click.native="toggleBox('county')"
          class="cell-item"
          label="县/区" :value="countyItem.label" isLink
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
  import {debounce} from '../../common/utils/utils'

  // provinceData: label value
  // cityData: provinceId label value
  // countyData: provinceId, cityId label value
  // label是名称 value是编号
  // 要确保本组件的父组件中不要使用过渡和动画效果，否则fixed的效果会变成absolute
  // 或者让该父组件为全屏

  const thisPropArr = ['provinceItem', 'cityItem', 'countyItem']
  const valuePropArr = ['provinceId', 'cityId', 'countyId']
  const labelPropArr = ['provinceName', 'cityName', 'countyName']

  export default {
    props: {
      provinceData: {type: Array, default() { return [] }},
      cityData: {type: Array, default() { return [] }},
      countyData: {type: Array, default() { return [] }},
      value: {type: Object, default() { return {} }}
    },
    data() {
      return {
        provinceItem: {},
        cityItem: {},
        countyItem: {}
      }
    },
    computed: {
      provinceList() {
        return this.provinceData
      },

      cityList() {
        // 因为下面这行赋值语句只会调用setter，不会调用getter
        // 所以该计算属性不会把cityItem加入依赖列表
        // 所以下面这行代码的意思是当provinceId变化时，清空cityId
        // Vue检测依赖项的逻辑放在getter中
        this.cityItem = {}

        if (this.provinceItem && this.provinceItem.value) {
          return this.cityData
            .filter(({provinceId}) => this.provinceItem.value === provinceId)
        } else {
          return []
        }
      },

      countyList() {
        // 因为下面这行赋值语句只会调用setter，不会调用getter
        // 所以该计算属性不会把countyItem加入依赖列表
        // 所以下面这行代码的意思是当provinceId或者cityId变化时，清空countyId
        // Vue检测依赖项的逻辑放在getter中
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
      toggleBox(boxKey) {
        this.$refs[boxKey].toggle()
      },

      // 当多次触发时，只调用一次
      changeAddress: debounce(function () {
        // 延时确保数据已更新
        this.$nextTick(() => {
          let data = {}

          valuePropArr.forEach((dProp, index) => {
            let thisProp = thisPropArr[index]
            let lProp = labelPropArr[index]
            let currItem = this[thisProp]

            if (currItem && currItem.value !== undefined) {
              data[dProp] = currItem.value
              data[lProp] = currItem.label
            }
          })

          this.$emit('input', data)
          this.$emit('change', data)
        })
      }),

      refreshAddress(currAddress, fn) {
        let promise = this.$nextTick()

        valuePropArr.forEach((dProp, index) => {
          promise = promise.then(() => {
            let thisProp = thisPropArr[index]
            let thisValue = this[thisProp].value

            fn && fn(currAddress[dProp], thisProp, thisValue)

            return this.$nextTick()
          })
        })
      }
    },
    watch: {
      value: {
        handler(newAddress) {
          if (!newAddress) {
            this.provinceItem = this.cityItem = this.countyItem = {}
            return
          }

          this.refreshAddress(newAddress, (dataValue, thisProp, thisValue) => {
            if (dataValue !== thisValue) {
              this[thisProp] = {value: dataValue}
            }
          })
        },
        deep: true
      }
    },
    mounted() {
      let currAddress = this.value

      // 初始化时填充地址
      if (typeof currAddress === 'object' && Object.keys(currAddress).length > 0) {
        this.refreshAddress(currAddress, (dataValue, thisProp) => {
          if (dataValue !== undefined) {
            this[thisProp] = {value: dataValue}
          }
        })
      }
    },
    components: {cell, selectbox}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .select-address > .cell-item.cell > .value-text
    color: blue-color-value
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped></style>
