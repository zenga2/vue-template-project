<template>
  <div id="wrapper">
    <selectAddress
        :provinceData="provinceData"
        :cityData="cityData"
        :countyData="countyData"
        v-model="addressItem"
    ></selectAddress>
  </div>
</template>

<script type="text/ecmascript-6">
  import selectAddress from '../components/select-address/select-address.vue'

  export default {
    data() {
      return {
        isShow: true,
        provinceData: [],
        cityData: [],
        countyData: [],
        addressItem: {}
      }
    },
    methods: {},
    created() {
      window.vm = this
      this.$ldService.getAddressData()
        .then(({provinceList, cityList, countyList}) => {
          this.provinceData = provinceList
            .map(({province: label, provinceID: value}) => ({label, value}))

          this.cityData = cityList
            .map(({city: label, cityID: value, father: provinceId}) =>
              ({label, value, provinceId}))

          this.countyData = countyList.map(
            ({area: label, areaID: value, cityId, provinceId}) =>
              ({label, value, cityId, provinceId}))
        })
    },
    components: {selectAddress}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
