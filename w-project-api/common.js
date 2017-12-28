let apiObj = {
  publicParam: {
    desc: '公共部分(每个接口都有的)',
    request: {
      access_token: '<String> 登录的凭证',
      platform: '<String> 默认为：laidian_bbg'
    },
    response: {
      result: '<Number> 1: 表示调用成功；其他: 表示调用失败',
      msg: '<String> 对本次接口调用的描述(如成功、失败、没权限之类)',
      isLogOut: '<Number> loginToken错误时才会 1: 需要登录 0: 不需要登录',
      isPower: '<Number> 1有权限 0无权限'
    }
  }
}