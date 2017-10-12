<template>
  <div class="input-page full-screen">
    <div class="input-page-content">
      <cell class="cell-item"
            v-for="item in currObj.dataList"
            :label="item.label"
            :placeholder="item.placeholder"
            :key="item.key"
            @input="changeValue(item.key, $event)"
            :value="item.default"
            isInputBox
      ></cell>
    </div>
    <ldFooter
        text="提交"
        :isPassCheck="isPassCheck"
        :clickFn="submit"
    ></ldFooter>
  </div>
</template>

<script type="text/ecmascript-6">
  import {each, deepClone} from '../common/utils/utils'
  import cell from '../components/cell/cell.vue'
  import ldFooter from '../components/ld-footer/ld-footer.vue'

  const dataMap = {
    // 增量补线
    addLine: {
      title: '增量补线',
      seviceName: 'changeLineNum',
      dataList: [
        {label: '桶1', key: 'lineNum1', placeholder: '输入补充的数量'},
        {label: '桶2', key: 'lineNum2', placeholder: '输入补充的数量'},
        {label: '桶3', key: 'lineNum3', placeholder: '输入补充的数量'},
        {label: '桶4', key: 'lineNum4', placeholder: '输入补充的数量'}
      ],
      successMsg: '补线成功'
    },
    // 重置数量
    resetNum: {
      title: '重置数量',
      seviceName: 'changeLineNum',
      dataList: [
        {label: '桶1', key: 'lineNum1', placeholder: '输入重置到的值'},
        {label: '桶2', key: 'lineNum2', placeholder: '输入重置到的值'},
        {label: '桶3', key: 'lineNum3', placeholder: '输入重置到的值'},
        {label: '桶4', key: 'lineNum4', placeholder: '输入重置到的值'}
      ],
      successMsg: '重置成功'
    },
    // 紧急补线提示阈值
    emergencyTip: {
      title: '紧急补线提示阈值',
      seviceName: 'updateAddLineThreshold',
      dataList: [
        {label: '桶1', key: 'lineBuket1', placeholder: '输入阈值'},
        {label: '桶2+桶4', key: 'lineBuket24', placeholder: '输入阈值'},
        {label: '桶3', key: 'lineBuket3', placeholder: '输入阈值'}
      ]
    },
    // 预补线提示阈值
    preTip: {
      title: '预补线提示阈值',
      seviceName: 'updateAddLineThreshold',
      dataList: [
        {label: '桶1', key: 'lineBuket1', placeholder: '输入阈值'},
        {label: '桶2+桶4', key: 'lineBuket24', placeholder: '输入阈值'},
        {label: '桶3', key: 'lineBuket3', placeholder: '输入阈值'}
      ]
    }
  }

  // todo 给每一项增加校验条件
  export default {
    name: 'inputPage',
    data() {
      return {
        type: '',
        currObj: {},
        inputData: {},
        isPassCheck: false
      }
    },
    methods: {
      // 监听input事件,并做相应的修改
      changeValue(key, value) {
        this.inputData[key] = value

        // 校验用户是否有输入值
        let isPass = false
        each(this.inputData, (value) => {
          if (value) {
            isPass = true
          }
        })
        this.isPassCheck = isPass
      },

      submit() {
        let {currObj, inputData} = this
        let seviceName = currObj.seviceName
        let queryParam = Object.assign({}, currObj.otherParam)

        each(inputData, (value, key) => {
          if (value) {
            queryParam[key] = value
          }
        })

        this.$ldService[seviceName](queryParam).then(({msg}) => {
          this.$router.back()

          this.$ldUtils.toast(currObj.successMsg || msg, 2000)
        })
      },

      // 处理只有两个线桶的情形
      filterLineBarrel() {
        let dataList = this.currObj.dataList

        // 删除桶1和桶4
        switch (this.type) {
          case 'addLine':
          case 'resetNum':
            dataList.pop()
            dataList.shift()
            break
          case 'emergencyTip':
          case 'preTip':
            dataList.shift()
            dataList[0].label = '桶2'
            break
        }
      }
    },
    created() {
      let {type, otherParam, defaultArr} = this.$route.query
      this.type = type
      // 因为会修改配置，所以这里只能用副本
      this.currObj = deepClone(dataMap[type])

      // 额外的请求参数
      if (otherParam) {
        this.currObj.otherParam = otherParam
      }

      // 填充默认值
      if (defaultArr) {
        defaultArr.forEach((val, index) => {
          this.currObj.dataList[index].default = val
          if (val) {
            this.isPassCheck = true
          }
        })
      }

      // 处理只有两个线桶的情形
      // 这一步必须放在填充默认值后面
      let typeArr = ['addLine', 'resetNum', 'emergencyTip', 'preTip']
      if (typeArr.indexOf(type) > -1
          && this.$ldUtils.isMiddleMachine(otherParam.terminal)) {
        this.filterLineBarrel()
      }

      this.$ldUtils.modifyTitle(this.currObj.title)
    },
    components: {cell, ldFooter}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/mixin.styl"

  .input-page
    display: flex
    flex-direction: column
    font-size: three-level-font-size-value
    .input-page-content
      flex: 1
      .cell-item
        color: #333
        .value
          color: #444
</style>
