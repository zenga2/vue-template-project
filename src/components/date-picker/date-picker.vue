<template>
  <transition name="picker-slide" :duration="300">
    <div v-show="isShow" class="date-picker-wrapper">
      <div @click.stop="hide" class="mask"></div>
      <div class="date-picker">
        <div class="date-picker-header border-1px">
          <span @click.stop="cancelFn" class="cancel">取消</span>
          <span @click.stop="okFn" class="ok">确定</span>
        </div>
        <div class="date-picker-content">
          <picker class="year picker-item"
                  ref="yearPicker"
                  :dataList="yearList"
                  @change="refreshDate"
                  v-model="yearIndex"
          ></picker>
          <picker class="month picker-item"
                  ref="monthPicker"
                  :dataList="monthList"
                  @change="refreshDate"
                  v-model="monthIndex"
          ></picker>
          <picker class="day picker-item"
                  ref="dayPicker"
                  :dataList="dayList"
                  @change="refreshDate"
                  v-model="dayIndex"
          ></picker>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import picker from '../picker/picker.vue'
  import {padLeft} from '../../common/utils/stringUtils'
  import {isLeapYear, parse, modifyDate} from '../../common/utils/dateUtils'
  import {debounce} from '../../common/utils/utils'

  const daysMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  export default {
    props: {
      startDate: {type: String},
      endDate: {type: String},
      // year, month, day都必须为字符串
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
        yearList: undefined,
        yearIndex: undefined,
        monthIndex: undefined,
        dayIndex: undefined,
        isShow: false,
        dateRange: {
          startDate: this.startDate,
          endDate: this.endDate
        }
      }
    },
    computed: {
      monthList() {
        let year = this.findValue(this.yearList, this.yearIndex)
        let {startYear, startMonth, endYear, endMonth} = this.parseDateRange()
        let maxMonth = 12
        let minMonth = 1

        if (year === startYear) {
          minMonth = startMonth
        } else if (year === endYear) {
          maxMonth = endMonth
        }

        return this.createItemArr(minMonth, maxMonth)
      },

      dayList() {
        let year = this.findValue(this.yearList, this.yearIndex)
        let month = this.findValue(this.monthList, this.monthIndex)
        let {
          startYear, startMonth, startDay,
          endYear, endMonth, endDay
        } = this.parseDateRange()
        let maxDay = daysMap[month - 1]
        let minDay = 1

        // 闰年
        if (month === 2 && isLeapYear(year)) {
          maxDay = 29
        }

        if (year === startYear && month === startMonth) {
          minDay = startDay
        } else if (year === endYear && month === endMonth) {
          maxDay = endDay
        }

        return this.createItemArr(minDay, maxDay)
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
          let props = ['yearPicker', 'monthPicker', 'dayPicker']

          props.forEach(prop => {
            this.$refs[prop].refresh()
          })
        }, 500)
      },

      createItemArr(start, end, isPadZero = true) {
        start = Number(start)
        end = Number(end)
        if (isNaN(start + end) || start > end) return []

        let arr = []
        for (let i = start; i <= end; i++) {
          if (isPadZero) {
            i = padLeft(String(i), '0', 2)
          }

          arr.push({label: i, value: i})
        }

        return arr
      },

      findIndex(dataList, currValue) {
        currValue = String(currValue)

        for (let i = 0, len = dataList.length; i < len; i++) {
          let item = dataList[i]

          if (String(item.value) === currValue) return i
        }

        return 0
      },

      parseDate(date) {
        if (typeof date === 'string') {
          date = parse(date, 'yyyy-MM-dd')
        }

        return {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      },

      parseDateRange() {
        let {startDate, endDate} = this.dateRange
        let currDate = new Date()

        if (!startDate && !endDate) {
          startDate = modifyDate(currDate, '-10y')
          endDate = modifyDate(currDate, '10y')
        } else if (!startDate) {
          startDate = currDate
        } else if (!endDate) {
          endDate = currDate
        }

        startDate = this.parseDate(startDate)
        endDate = this.parseDate(endDate)

        return {
          startYear: startDate.year,
          startMonth: startDate.month,
          startDay: startDate.day,
          endYear: endDate.year,
          endMonth: endDate.month,
          endDay: endDate.day
        }
      },

      // 设置时间范围
      setDateRange(dateRange = {}) {
        this.dateRange = dateRange
        this.initData()
      },

      findValue(arr, index) {
        let item = arr[index]
        let val = item && item.value

        return val === undefined
          ? arr.length - 1
          : parseInt(val, 10)
      },

      getCurrDate() {
        return {
          year: this.findValue(this.yearList, this.yearIndex),
          month: this.findValue(this.monthList, this.monthIndex),
          day: this.findValue(this.dayList, this.dayIndex)
        }
      },

      initData() {
        let value = this.value
        let currDate = new Date()

        let {startYear, endYear} = this.parseDateRange()
        this.yearList = this.createItemArr(startYear, endYear, false)

        // init year
        let year = isNaN(Number(value.year))
          ? currDate.getFullYear()
          : value.year
        this.yearIndex = this.findIndex(this.yearList, year)

        // init month
        let month = isNaN(Number(value.month))
          ? currDate.getMonth() + 1
          : value.month
        this.monthIndex = this.findIndex(this.monthList, month)

        // init day
        let day = isNaN(Number(value.day))
          ? currDate.getDate()
          : value.day
        this.dayIndex = this.findIndex(this.dayList, day)
      },

      isSameDate(d1, d2) {
        return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day
      },

      // 恢复状态
      recoveryState() {
        let {year, month, day} = this.value

        this.yearIndex = this.findIndex(this.yearList, year)
        this.monthIndex = this.findIndex(this.monthList, month)
        this.dayIndex = this.findIndex(this.dayList, day)
      },

      refreshDate: debounce(function () {
        let selectedDate = this.getCurrDate()

        if (this.isDelay) return

        this.$emit('input', selectedDate)
        this.$emit('change', selectedDate)
      }, 150)
    },
    created() {
      this.initData()
    },
    watch: {
      value: {
        handler(newObj) {
          let {year, month, day} = this.getCurrDate()

          if (newObj.year !== year) {
            this.yearIndex = this.findIndex(this.yearList, newObj.year)
          }

          if (newObj.month !== month) {
            this.monthIndex = this.findIndex(this.monthList, newObj.month)
          }

          if (newObj.day !== day) {
            this.dayIndex = this.findIndex(this.dayList, newObj.day)
          }
        },
        deep: true
      },

      isShow(newValue) {
        // date-picker创建时，一般是隐藏状态, 导致BScroll计算的size信息是错误的
        // 所以切换为显示状态时，需要刷新BScroll
        if (newValue === true) {
          this.refreshAllPicker()
        } else if (this.isDelay) {
          // 当组件隐藏时，如果数据不一致，就回滚状态
          setTimeout(() => {
            let currDate = this.getCurrDate()
            if (!this.isSameDate(currDate, this.value)) {
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

  .date-picker-wrapper
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

  .date-picker
    z-index: 1
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    .date-picker-header
      overflow: hidden
      border-1px(#d3d3d3)
      background: #fff
      .cancel, .ok
        padding: 0 16px
        line-height: 44px
        font-size: 16px
      .ok
        float: right
        color: blue-color-value
    .date-picker-content
      display: flex
      .picker-item
        flex: 1
        font-size: 14px

  .date-picker
    transform-origin: bottom center

  .picker-slide-enter-active, .picker-slide-leave-active
    .mask, .date-picker
      transform: translateZ(0)
      transition: 300ms

  .picker-slide-enter, .picker-slide-leave-to
    .mask
      opacity: 0
    .date-picker
      transform: scaleY(0)

  .picker-slide-enter-to, .picker-slide-leave
    .date-picker
      transform: scaleY(1)
</style>
