<template>
  <div class="date-picker">
    <div class="date-picker-header border-1px">
      <span class="cancel">取消</span>
      <span class="ok">确定</span>
    </div>
    <div class="date-picker-content">
      <picker class="year picker-item"
              :dataList="yearList"
              @change="refreshDate"
              v-model="yearIndex"
      ></picker>
      <picker class="month picker-item"
              :dataList="monthList"
              @change="refreshDate"
              v-model="monthIndex"
      ></picker>
      <picker class="day picker-item"
              :dataList="dayList"
              @change="refreshDate"
              v-model="dayIndex"
      ></picker>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import picker from '../picker/picker.vue'
  import { padLeft } from '../../common/utils/stringUtils'
  import { isLeapYear } from '../../common/utils/dateUtils'
  import { runDelay } from '../../common/utils/utils'

  function getCurrYear() {
    return new Date().getFullYear()
  }

  const daysMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  export default {
    props: {
      startYear: {
        type: [Number, String],
        default() { return getCurrYear() - 20 }
      },
      endYear: {
        type: [Number, String],
        default() { return getCurrYear() + 20 }
      },
      // year, month, day都必须为字符串
      value: {
        type: Object,
        default() { return {} }
      }
    },
    data() {
      return {
        yearList: undefined,
        monthList: undefined,
        yearIndex: undefined,
        monthIndex: undefined,
        dayIndex: undefined
      }
    },
    computed: {
      dayList() {
        let year = Number(this.yearList[this.yearIndex].value)
        let month = Number(this.monthList[this.monthIndex].value)
        let daysOfMonth = daysMap[month - 1]

        // 闰年
        if (month === 2 && isLeapYear(year)) {
          daysOfMonth = 29
        }

        return this.createItemArr(1, daysOfMonth)
      }
    },
    methods: {
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
        for (let i = 0, len = dataList.length; i < len; i++) {
          let item = dataList[i]

          if (String(item.value) === String(currValue)) return i
        }

        return 0
      },

      initData() {
        let {startYear, endYear, value} = this
        let currDate = new Date()

        this.yearList = this.createItemArr(startYear, endYear, false)
        this.monthList = this.createItemArr(1, 12)

        // init year
        let year = isNaN(Number(value.year))
          ? currDate.getFullYear()
          : value.year
        this.yearIndex = this.findIndex(this.yearList, year)

        // init month
        let month = Number(value.month)
        this.monthIndex = isNaN(month)
          ? currDate.getMonth()
          : month - 1

        // init day
        let day = Number(value.day)
        this.dayIndex = isNaN(day)
          ? currDate.getDate() - 1
          : day - 1
      },

      refreshDate: runDelay(function () {
        let selectedDate = {
          year: this.yearList[this.yearIndex].value,
          month: this.monthList[this.monthIndex].value,
          day: this.dayList[this.dayIndex].value
        }

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
          let year = this.yearList[this.yearIndex].value
          let month = this.monthList[this.monthIndex].value
          let day = this.dayList[this.dayIndex].value
          let currDate = new Date()

          if (newObj.year !== year) {
            this.yearIndex = this.findIndex(this.yearList, newObj.year)
          }

          if (newObj.month !== month) {
            let monthIndex = Number(newObj.month) - 1
            this.monthIndex = isNaN(monthIndex) ? currDate.getMonth() : monthIndex
          }

          if (newObj.day !== day) {
            let dayIndex = Number(newObj.day) - 1
            this.dayIndex = isNaN(dayIndex) ? currDate.getDate() - 1 : dayIndex
          }
        },
        deep: true
      }
    },
    components: {picker}
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .date-picker
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
      font-size: 0
      .picker-item
        display: inline-block
        width: 33.33333333333%
        font-size: 14px
</style>
