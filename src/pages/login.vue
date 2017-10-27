<template>
  <div class="login full-screen">
    <div class="content">
      <div class="login-wrapper">
        <ul class="login-box">
          <li class="item">
            <span class="label">用户名</span>
            <input v-model="username" class="input-box" type="text" maxlength="12"
                   placeholder="请输入用户名">
          </li>
          <li class="item">
            <span class="label">密&nbsp&nbsp&nbsp码</span>
            <input v-show="!isShowPassword" v-model="password" class="input-box"
                   maxlength="12"
                   placeholder="请输入密码" type="password">
            <input v-show="isShowPassword" v-model="password" class="input-box"
                   maxlength="12"
                   placeholder="请输入密码" type="text">
            <a @click.prevent.stop="togglePwdIuput" href="javascript:void(0)"
               :class="['icon', toggleBtnClass]"></a>
          </li>
        </ul>
      </div>
      <div v-show="false" class="forger-pwd"><span class="text">忘记密码</span></div>
      <div @click.stop="toLogin" class="login-btn" :class="{disabled: !isPassBaseCheck}"><span
          class="text">登录</span></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        username: '',
        password: '',
        isShowPassword: false
      }
    },
    computed: {
      toggleBtnClass () {
        return this.isShowPassword ? 'visible' : 'hide'
      },
      isPassBaseCheck () {
        return this.username.length > 0 && this.password.length > 0
      }
    },
    methods: {
      togglePwdIuput () {
        this.isShowPassword = !this.isShowPassword
      },
      toLogin() {
        // 通过基础校验才去登录
        if (!this.isPassBaseCheck) return

        this.$ldService.login({
          username: this.username,
          password: this.password
        }, {
          needAccessToken: false
        }).then((response) => {
          this.$ldUtils.saveLoginInfo(response)
          this.$ldBus.$emit('login', response)

          this.$router.push({name: 'current'})
        })
      }
    },
    mounted () {}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"

  .login
    .content
      height: 100%
      background: #fff
      .login-wrapper
        padding: 57px 15px 0 15px
        .login-box
          .item
            display: flex
            position: relative
            border-bottom: 1px solid #ddd
            .label
              width: 60px
              line-height: 50px
              font-size: 15px
              color: #333
            .input-box
              flex: 1
              border: none
              outline: none
              padding: 15px 5px
              line-height: 20px
              font-size: 15px
              color: #333
            .icon
              position: absolute
              top: 50%
              right: 0
              margin-top: -15px
              width: 30px
              height: 30px
              background: no-repeat center center
              background-size: 30px
            .hide
              background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIlSURBVGhD7ZY/axtBEMVFChfWSQRDjLv0rt24TJE6nyC9WzUBVzaCVClc+Cu48K6SRqULtykErtSpMNatJEL6gHBhz5udE2ccIWL27pLwfnBImj3d/Nt9cy1CCCGEEEIIIYQQQgj5t+m4MMBlP5vn5OFV5sIoc/mVWdKS+XzY8eEhG8w+mKlROi7/qPG4cGGmtGRuvi9O7qXLi/a3xa6ZGwH+Oz7/KbEsX3+dvzVzeqTLx6iqJH6DLWXmehG/8K/dlXjMWg1dN3uPqla6lTYAv7HoYYl4zJwYVNXnfevuvW6nWOEvtXUaIiX+NAbdzohDv/eTxwAltIdPpbKHODdS6YkmLRV/439kdmsl4PlFZ+EX/hGHxqO2xEqtZ0ZGUtdNd8ykwpH58F0L4cK4O7g7sKWkILFVccVfWTARD+JSTakFP96S6p5r0rH6o1SqGadCGJeefQZ/ttwsUuFeEZgEuUTVVVD+MEAdN3G+Xq+eF5M9sluaZ9vf7kmCiygiImylrsj3Xzhf6E7mZ5/w0tK+zN+J/TAqvib3WdYvsC1X/4vXtY5Bm/3wYy6bpRC08kzEeVZFfZ7E+qsojhSmfCw0aVlPLkwvBUopQQ3XjQZT2IkkJFs971nXTrXjslWjPYzXjpY4juS1Np+a5e8GCWuHRGHN9IRC6asebbWhZ1UTlpeU3wA71qt7a6oZE6klPs30hE3rhBBCCCGEEEIIIYQQ8j/Saj0CjgmzTqyY8lcAAAAASUVORK5CYII=")
            .visible
              background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAO9SURBVGhD7ZivjxNBFMebYCBtc0EhMDgMCoVBkGAQCAzuxGkcvu4kjj8AzEF3T5w5gSRBIM5UnbuQdOYCqUCQE00Qx/f75s10+2O2vabdlOR9ksntzsxu58177ztvr2UYhmEYhmEYhmEYhmGszIcft7vH7kWncO86hT9Fu+iU/ne39NfSCvcXbYTrQbfwJcZ77b571iqvb+kb/g/aff+cBqCNk3FoMPxPt3TnMOwM91/VUD83r3RXmHMkxu8yXCA8+D0tnB4t3Ht6+U4xvK/T5oFHYfTDduFfw9iPsgmTDRh0+/6lztwN7pYXe/RIMrT0X+jltUOTGyCp4E/TO3Fdu2lNsde/fExPhoUhXI8vn+rQNMhnePANcvYbQ1YNOdDRLN2+exKjRvIfG6FDzSNe0MUzdGmUDk3BUJ8J09iWGiyEkH8rIofnuHE60hxBmERl2fa1ew7mX1woIuGMecoUkMEFIZ/GFsDoiSrfqNESxvQsDakRlL3PPx9MRYAayFzk4qeMwxg2pCdKDgHT3jna/eEj/C6PMrxz+Eq7t4cKVMjZGs8SUVzOK90J7/ksr0NfJaQ1FWhweK8vpT8D8xpzxtwcbqp2b4dohHisDhYdGsqyqOBBnr/RWDE45Kb37U+/7vGZGDk5PYiIAPIdEMFFqbERRHxkoe582YJoJOfSAN4zGtTI1GI+yjWqMZmHd0tfTVhHePyFufWRtjbRQ6tUQJJrYTEj3k/CO9sGnEePyT3Clvd1cFM4lymmXZsl7j5FS7uyzBlcKUwy7cYGcx3VZzeOHDH4AXp6Wd6kkIaw8B7XB7q4hS1qAq4H0rcspKkJsYzdZumZVLZwh9q1mIpoRUFK+TnTmMsTYeOxtFy0ROz4LEpO7doOXDxVNfxY/TmYFB1/eS9ejyGrjfkXw7dixBHvc8SihxvVSH3NogGLG7PVCRgNlGMmGNHTbsk9VlxSd2tqcPOCEe5KvJ1Bamv5zKR44gOlKWSB9JIUAHlPT5WWOEZmPy4obknBaXDduyq1O9pqdfgmoZfE02Gxhzkhq/l4mDQWHzmPSW7HKkw2r3ljIxre0Rh8rGeOE4iQVEeVz0P5y5xG7uZESt6flNuNVqkBto4I2VSN7E5mQ/dGwKNMhVRJibG+FLXfJZhjWFzwBhoVmCUj+2sXCwP1K2hf8lm/huQdOGsbFad1CIbD4ypWlcWjdl70T7z5eWL4CtXWTiGfgwxN/puWCh08LkeKNBoa8n+AsSMKU/WoMgzDMAzDMAzDMAzDMFaj1foHEXv335jBK2EAAAAASUVORK5CYII=")
      .forger-pwd
        padding: 15px 16px 25px 0
        .text
          float: right
          font-size: 15px
          color: blue-color-value
      .login-btn
        margin: 18px 15px 0 15px
        border-radius: 5px
        text-align: center
        background: blue-color-value
        &.disabled
          opacity: 0.8
          background: #ddd
        .text
          border-radius: 5px
          line-height: 50px
          font-size: 15px
          color: #fff
</style>
