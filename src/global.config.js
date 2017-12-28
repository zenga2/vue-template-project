// 公共配置项
const commonConfig = {}

// 生产环境配置项
const proConfig = {
  uriStr: 'http://cnt.imlaidian.com:8099/cntcdt/'
}

// 测试环境配置项
const devConfig = {
  uriStr: 'http://cnt.imlaidian.com:8099/cntcdt/'
  // uriStr: 'http://192.168.10.64:8088/cntcdt/'
  // uriStr: 'http://192.168.10.162:8088/cntcdt/'
}

export default Object.assign(
  {},
  commonConfig,
  process.env.NODE_ENV === 'production'
    ? proConfig
    : devConfig
)
