<template>
  <transition name="picker-slide" :duration="300">
    <div v-show="isShow" class="time-picker-wrapper">
      <div @click.stop="hide" class="mask"></div>
      <div class="time-picker">
        <div class="time-picker-header border-1px">
          <span @click.stop="cancelFn" class="cancel">取消</span>
          <h2 class="title">选择时间</h2>
          <span @click.stop="okFn" class="ok">确定</span>
        </div>
        <div class="time-picker-content">
          <picker class="hour picker-item"
                  ref="hourPicker"
                  :dataList="hourList"
                  @change="refreshDate"
                  v-model="hourIndex"
          ></picker>
          <picker class="minute picker-item"
                  ref="minutePicker"
                  :dataList="minuteList"
                  @change="refreshDate"
                  v-model="minuteIndex"
          ></picker>
          <picker class="second picker-item"
                  ref="secondPicker"
                  :dataList="secondList"
                  @change="refreshDate"
                  v-model="secondIndex"
          ></picker>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import picker from '../picker/picker.vue'
  import {padLeft} from '../../common/utils/stringUtils'
  import {debounce} from '../../common/utils/utils'

  function createArr(num) {
    return Array.from({length: num}).map((item, i) => ({
      label: padLeft(String(i), '0', 2),
      value: i
    }))
  }

  export default {
    props: {
      value: {
        type: Object,
        default() { return {} }
      },
      onCancel: {type: Function},
      onOk: {type: Function},
      isDelay: {type: Boolean, default: false}
    },
    data() {
      return {
        hourIndex: undefined,
        minuteIndex: undefined,
        secondIndex: undefined,

        hourList: createArr(24),
        minuteList: createArr(60),
        secondList: createArr(60),

        isShow: false
      }
    },
    methods: {
      cancelFn() {
        this.hide()

        this.onCancel && this.onCancel()
      },

      okFn() {
        let selectedDate = this.getCurrDate()
        let isChange = !this.isSameDate(selectedDate, this.value)
        let isDelay = this.isDelay

        if (!isDelay || (isDelay && isChange)) {
          this.$emit('input', selectedDate)
          this.$emit('change', selectedDate)
        }

        this.hide()

        this.onOk && this.onOk()
      },

      hide() {
        this.isShow = false
      },

      show() {
        this.isShow = true
      },

      toggle() {
        this.isShow = !this.isShow
      },

      refreshAllPicker() {
        // 当可滑动区域改变后，需要刷新BScroll
        setTimeout(() => {
          let props = ['hourPicker', 'minutePicker', 'secondPicker']

          props.forEach(prop => {
            this.$refs[prop].refresh()
          })
        }, 500)
      },

      getCurrTime() {
        return {
          hour: this.hourIndex,
          minute: this.minuteIndex,
          second: this.secondIndex
        }
      },

      initData() {
        let {hour, minute, second} = this.value

        // init hour
        hour = Number(hour)
        this.hourIndex = isNaN(hour) || hour < 0 || hour > 23 ? 0 : hour

        // init minute
        minute = Number(minute)
        this.minuteIndex = isNaN(minute) || minute < 0 || minute > 59 ? 0 : minute

        // init second
        second = Number(second)
        this.secondIndex = isNaN(second) || second < 0 || second > 59 ? 0 : second
      },

      isSameTime(t1, t2) {
        return t1.hour === t2.hour && t1.minute === t2.minute && t1.second === t2.second
      },

      // 恢复状态
      recoveryState() {
        let {hour, minute, second} = this.value

        this.hourIndex = Number(hour) || 0
        this.minuteIndex = Number(minute) || 0
        this.secondIndex = Number(second) || 0
      },

      refreshDate: debounce(function () {
        let selectedTime = this.getCurrTime()

        if (this.isDelay) return

        this.$emit('input', selectedTime)
        this.$emit('change', selectedTime)
      }, 150)
    },
    created() {
      this.initData()
    },
    watch: {
      value: {
        handler(newObj) {
          let {hour, minute, second} = this.getCurrTime()
          let {hour: newHour, minute: newMinute, second: newSecond} = newObj

          newHour = Number(newHour) || 0
          newMinute = Number(newMinute) || 0
          newSecond = Number(newSecond) || 0

          if (newHour !== hour) {
            this.hourIndex = newHour
          }

          if (newMinute !== minute) {
            this.minuteIndex = newMinute
          }

          if (newSecond !== second) {
            this.secondIndex = newSecond
          }
        },
        deep: true
      },

      isShow(newValue) {
        // time-picker创建时，一般是隐藏状态, 导致BScroll计算的size信息是错误的
        // 所以切换为显示状态时，需要刷新BScroll
        if (newValue === true) {
          this.refreshAllPicker()
        } else if (this.isDelay) {
          // 当组件隐藏时，如果数据不一致，就回滚状态
          setTimeout(() => {
            let currTime = this.getCurrTime()
            if (!this.isSameTime(currTime, this.value)) {
              this.recoveryState()
            }
          }, 200)
        }
      }

    },
    components: {picker}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .time-picker-wrapper
    z-index: 10000
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%

  .mask
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background: rgba(0, 0, 0, 0.35)

  .time-picker
    z-index: 1
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    .time-picker-header
      display: flex
      overflow: hidden
      border-1px(#d3d3d3)
      background: #fff
      .title
        flex: 1
        text-align: center
        color: #333
      .title, .cancel, .ok
        line-height: 44px
        font-size: 16px
      .cancel, .ok
        padding: 0 16px
      .ok
        color: blue-color-value
      .cancel
        color: #666
    .time-picker-content
      display: flex
      .picker-item
        flex: 1
        font-size: 14px

  .time-picker
    transform-origin: bottom center

  .picker-slide-enter-active, .picker-slide-leave-active
    .mask, .time-picker
      transform: translateZ(0)
      transition: 300ms

  .picker-slide-enter, .picker-slide-leave-to
    .mask
      opacity: 0
    .time-picker
      transform: scaleY(0)

  .picker-slide-enter-to, .picker-slide-leave
    .time-picker
      transform: scaleY(1)
</style>
