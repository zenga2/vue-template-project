<template>
  <div class="single-select-page full-screen">
    <div class="single-select-page-content" ref="contentBox">
      <select-page
          :dataList="currObj.dataList"
          v-model="selectedValue"
      ></select-page>
      <textarea ref="otherTextBox" class="other-desc" :placeholder="currObj.placeholder"
                v-show="selectedValue === currObj.otherValue"
                v-model="otherText"
      ></textarea>
    </div>
    <ld-footer
        :isPassCheck="isPassCheck"
        :clickFn="okFn"
    ></ld-footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import selectPage from '../components/select-page/select-page.vue'
  import ldFooter from '../components/ld-footer/ld-footer.vue'

  // value的值禁止为undefined, 这个用来判断初始值
  const dataMap = {
    selectFaultReason: {
      title: '选择原因',
      otherValue: '其他故障',
      placeholder: '请填写原因',
      dataList: [
        {label: '给手机充电无反应', value: '给手机充电无反应'},
        {label: '给手机充电速度慢', value: '给手机充电速度慢'},
        {label: '给手机充一会没电了', value: '给手机充一会没电了'},
        {label: '充电线损坏', value: '充电线损坏'},
        {label: '摇晃时电量灯不亮', value: '摇晃时电量灯不亮'},
        {label: '归还时机器不识别', value: '归还时机器不识别'},
        {label: '外壳破损', value: '外壳破损'},
        {label: '卡住通道或打滑', value: '卡住通道或打滑'},
        {label: '后台显示充电电流值异常或为0', value: '后台显示充电电流值异常或为0'},
        {label: '后台显示温度异常', value: '后台显示温度异常'},
        {label: '其他故障', value: '其他故障'}
      ]
    }
  }

  export default {
    name: 'single-select-page',
    data() {
      return {
        currObj: {},

        toPageName: '',

        selectedValue: undefined,
        otherText: ''
      }
    },
    computed: {
      isPassCheck() {
        return this.selectedValue === this.currObj.otherValue
          ? !!this.otherText
          : this.selectedValue !== undefined
      }
    },
    methods: {
      okFn() {
        let value = this.selectedValue === this.currObj.otherValue
          ? this.otherText
          : this.selectedValue

        this.$ldUtils.setPageParam(this.toPageName, value)
        this.$router.back()
      }
    },
    watch: {
      selectedValue(newValue) {
        if (this.otherValue === newValue) {
          setTimeout(() => {
            this.$refs.otherTextBox.focus()

            setTimeout(() => {
              this.$refs.contentBox.scrollTop = 500
            }, 500)
          }, 100)
        }
      }
    },
    created() {
      let type = this.$route.query.type

      this.currObj = dataMap[type]
      this.$ldUtils.modifyTitle(this.currObj.title)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.toPageName = from.name
      })
    },
    components: {selectPage, ldFooter}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"

  .single-select-page
    display: flex
    flex-direction: column
    background: #f0f1f5
    .single-select-page-content
      scroll()
      flex: 1
      margin-bottom: 10px
      width: 100%
    .other-desc
      border: none
      margin-top: 10px
      padding: 8px 16px
      width: 100%
      height: 100px
      outline: none
      resize: none
      font-size: three-level-font-size-value
      color: #666
      background: #fff
</style>
