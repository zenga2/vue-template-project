<template>
  <div class="search-page page full-screen">
    <div class="search-page-header">
      <search ref="searchBox" :search="search" :placeholder="placeholder" class="device-filter-search"></search>
      <div @click="back" class="cancel">取消</div>
    </div>
    <div class="search-page-content">
      <ul @click.stop="backCurrentPage" v-if="methodName==='searchPos'" class="search-result-list">
        <li class="search-result-item border-1px active"
            :data-index="index"
            v-for="(item, index) in searchResults">
          <i class="position-icon icon-font-coordinates-fill"></i>
          <div class="desc"><span class="name">{{item.name}}</span><span
              class="address">{{item.district}}</span></div>
        </li>
      </ul>
      <ul @click.stop="toDeviceDetailPage" v-if="methodName==='serachDevice'" class="search-result-list">
        <li class="search-result-item border-1px active"
            :data-index="index"
            v-for="(item, index) in searchResults">
          <i class="position-icon icon-font-coordinates-fill"></i>
          <div class="desc">
            <span class="name">{{item.shopName}} ( {{item.terminal}} )</span>
            <span class="address">{{item.shopAddress}}</span></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import search from '../components/search/search.vue'

  const dataMap = {
    current: {
      methodName: 'searchPos',
      placeholder: '到哪里找我'
    },
    device: {
      methodName: 'serachDevice',
      placeholder: '商家名 / 设备号'
    }
  }

  export default {
    name: 'searchPage',
    data() {
      return {
        methodName: '',
        placeholder: '',
        adcode: undefined,
        searchResults: []
      }
    },
    methods: {
      back() {
        this.$router.back()
      },

      /* eslint-disable no-undef*/
      // 从首页过来搜索位置坐标
      searchPos(searchStr) {
        this.searchUtil.search(searchStr, (status, result) => {
          if (status === 'complete' && result.count > 0) {
            this.searchResults = result.tips
                .filter(({location}) => !!location)
                .map(({name, district, location}) => ({name, district, location}))
          } else {
            this.clearSearchResults()
          }
        })
      },

      // 从设备页过来搜索设备编号
      serachDevice(searchStr) {
        this.$ldService.searchDevice({
          condition: encodeURIComponent(searchStr)
        }).then(({data}) => {
          this.searchResults = data.map(device => {
            let {shopAddress, shopName, terminal} = device

            return {
              shopAddress,
              shopName,
              terminal
            }
          })
        })
      },

      search(searchStr) {
        if (searchStr) {
          this[this.methodName](searchStr)
        } else {
          this.clearSearchResults()
        }
      },

      clearSearchResults() {
        this.searchResults = []
      },

      backCurrentPage(e) {
        let target = e.target

        if (this.$ldUtils.isInElement(target, 'search-result-item')) {
          let el = this.$ldUtils.findAncestor(target, 'search-result-item')
          let index = el.dataset.index
          let position = this.searchResults[index].location

          this.$ldUtils.setPageParam('current', position)
          this.$router.back()
        }
      },

      toDeviceDetailPage(e) {
        let target = e.target

        if (this.$ldUtils.isInElement(target, 'search-result-item')) {
          let el = this.$ldUtils.findAncestor(target, 'search-result-item')
          let index = el.dataset.index
          let device = this.searchResults[index]

          // 获取设备地址对应的经纬度
          this.$ldUtils.getPosByAddress(device.shopAddress, pos => {
            let query = {
              terminal: device.terminal,
              distance: ''
            }

            if (pos) {
              let {lng, lat} = pos
              query.lng = lng
              query.lat = lat

              // 获取当前的经纬度
              this.$ldUtils.getCurrPos(data => {
                if (data) {
                  let {lng: currLng, lat: currLat} = data.position
                  let currPos = [currLng, currLat]

                  query.distance = this.$ldUtils.calculateDistance([lng, lat], currPos, true)
                }

                this.$router.replace({name: 'deviceDetail', query})
              })
            } else {
              this.$router.replace({name: 'deviceDetail', query})
            }
          })
        }
      }
    },
    created() {
      this.$ldUtils.positioning((provinceId, cityId, adcode) => {
        this.adcode = adcode

        this.searchUtil = new AMap.Autocomplete({
          city: adcode,
          datatype: 'all'
        })
      })
    },
    mounted() {
      this.$refs.searchBox.focus()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$ldUtils.switchPage(from.name, {
          'current|device'() {
            let obj = dataMap[from.name]

            this.methodName = obj.methodName
            this.placeholder = obj.placeholder
          }
        }, vm)
      })
    },
    components: {search}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"

  .search-page
    .search-page-header
      position: relative
      .device-filter-search
        margin-left: 16px
        width: 75%
        vertical-center()
      .cancel
        position: absolute
        right: 20px
        line-height: header-height-value
        font-size: one-level-font-size-value
        color: #fff
    .search-page-content
      .search-result-item
        position: relative
        border-1px(#999)
        background: #fff
        .position-icon
          position: absolute
          left: 10px
          line-height: 66px
          font-size: 26px
          color: #999
        .desc
          margin-left: 46px
          padding: 12px 0
          .name
            display: block
            margin-bottom: 10px
            font-size: two-level-font-size-value
            color: #333
          .address
            color: #999
            font-size: four-level-font-size-value
        &:last-child
          border-none()
</style>
