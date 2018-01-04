import Loading from '../../components/loading'
import APath from '../../components/apath'
import StorageUtil from '../../common/utils/storageUtils'
import {includes} from '../../common/utils/utils'
import Http from '../http'

const sessionStorageUtil = new StorageUtil('sessionStorage')
const posLoading = new Loading(false, '')

let aPath
let geolocation

// 地址格式: <经度>,<纬度>,<地址名称>
function goToThisPlace(to, from, closeFn) {
  if (!aPath) {
    aPath = new APath()
  }

  if (!from) {
    getCurrPos((result) => {
      if (result) {
        let {lng, lat} = result.position
        from = `${lng},${lat},`
      } else {
        from = ''
      }

      aPath.toThisPage(to, from, closeFn)
    })
  } else {
    aPath.toThisPage(to, from, closeFn)
    // 每次路径规划后更新当前位置
    gdPositioning(null, null)
  }
}

function getAmapKey() {
  return {
    webServiceKey: 'bde32dc242d084024d1704f9ba9a3262'
  }
}

// ip定位
function ipPositioning(callback) {
  let http = new Http()

  http.get('http://restapi.amap.com/v3/ip', {
    key: getAmapKey().webServiceKey
  }).then(response => {
    if (response.status === '1') {
      let adcode = response.adcode
      let provinceId, cityId

      // 直辖市
      if (response.province === response.city) {
        provinceId = Number(adcode)
      } else {
        provinceId = Number(adcode.slice(0, 2) + '0000')
        cityId = Number(adcode)
      }

      callback(provinceId, cityId, adcode)
    }
  })
}

// 高德定位
function gdPositioning(success, error, isShowLoading = true) {
  /* eslint-disable no-undef*/
  if (isShowLoading) {
    posLoading.setText('定位中')
    posLoading.show()
  }

  if (!geolocation) {
    initGeolocation()
  }

  // 定位到当前位置
  geolocation.getCurrentPosition((status, data) => {
    posLoading.hide()

    if (status === 'complete') {
      success && success(data)

      sessionStorageUtil.setItem('currPosData', {
        position: data.position,
        adcode: data.addressComponent.adcode,
        timestamp: Number(new Date())
      })
    } else {
      error && error(data)

      sessionStorageUtil.removeItem('currPosData')
    }
  })

  function initGeolocation() {
    geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认:true
      enableHighAccuracy: true,
      // 超过5秒后停止定位，默认：无穷大
      timeout: 5000,
      // 定位结果缓存0毫秒，默认：0
      maximumAge: 0,
      // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      convert: true,
      // 显示定位按钮，默认：true
      showButton: false,
      // 定位成功后在定位到的位置显示点标记，默认：true
      showMarker: false,
      // 定位成功后用圆圈表示定位精度范围，默认：true
      showCircle: false,
      // 定位成功后将定位到的位置作为地图中心点，默认：true
      panToLocation: true,
      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      zoomToAccuracy: true
    })
  }
}

function positioning(callback) {
  let currPosData = sessionStorageUtil.getItem('currPosData')

  if (currPosData) {
    parseAdcode(currPosData.adcode, callback)
  } else {
    gdPositioning(
      sucuessRes => {
        parseAdcode(sucuessRes.addressComponent.adcode, callback)
      },
      errorRes => {
        ipPositioning(callback)
      }
    )
  }

  function parseAdcode(adcode, callback) {
    let provinceId = Number(adcode.slice(0, 2) + '0000')
    let cityId = Number(adcode.slice(0, 4) + '00')
    // 直辖市(依次： 北京、天津、上海、重庆)
    let specialCitys = [110000, 120000, 310000, 500000]

    // 判断是否是直辖市,同时adcode精确到城市一级
    if (includes(specialCitys, provinceId)) {
      cityId = undefined
      adcode = provinceId
    } else {
      adcode = cityId
    }

    callback(provinceId, cityId, adcode)
  }
}

// 获取当前位置的经纬度
function getCurrPos(callback) {
  let data = sessionStorageUtil.getItem('currPosData')

  if (data) {
    callback && callback(data)
  } else {
    gdPositioning(
      posData => {
        callback && callback({
          position: posData.position,
          adcode: posData.addressComponent.adcode,
          timestamp: Number(new Date())
        })
      },
      () => {
        callback && callback(undefined)
      }
    )
  }
}

// 获取指定地址的经纬度
function getPosByAddress(address, callback) {
  /* eslint-disable no-undef*/
  posLoading.setText('解析地址')
  posLoading.show()

  let geocoder = new AMap.Geocoder({})

  geocoder.getLocation(address, function (status, result) {
    posLoading.hide()

    let pos, geocodes

    if (status === 'complete' && result.info === 'OK') {
      geocodes = result.geocodes

      if (geocodes.length >= 1) {
        pos = geocodes[0].location
      }
    }

    callback(pos)
  })
}

// 计算设备到当前位置的距离
// pos: [lng, lat]
function calculateDistance(toPos, currPos, isToStr) {
  let distance, currLngLat, deviceLngLat

  try {
    currLngLat = new AMap.LngLat(currPos[0], currPos[1])
    deviceLngLat = new AMap.LngLat(toPos[0], toPos[1])
    distance = currLngLat.distance(deviceLngLat)
  } catch (e) {
    distance = -1
  }

  if (isToStr) {
    distance = distance >= 0
      ? (distance / 1000).toFixed(1) + '公里'
      : ''
  }

  return distance
}

export {
  goToThisPlace,
  ipPositioning,
  gdPositioning,
  positioning,
  getPosByAddress,
  calculateDistance,
  getCurrPos
}
