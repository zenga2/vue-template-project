<template>
  <div class="test full-screen">
    <div class="item"><label>姓名</label><input type="text" v-model="name"/></div>
    <div class="item"><label>年龄</label><input type="text" v-model="age"/></div>
    <div class="item"><label>日期</label><input type="text" v-model="date"/></div>
    <div class="item"><label>邮箱</label><input type="text" v-model="email"/></div>
    <div class="item"><label>身份证</label><input type="text" v-model="idCard"/></div>
    <div class="item"><label>自定义正则</label><input type="text" v-model="regStr"/></div>
    <div class="item"><label>自定义函数</label><input type="text" v-model="funcStr"/></div>
    <div v-for="(item, prop) in validators" class="desc-item">
      <span>{{prop}}</span>
      <span>{{item.isOk}}</span>
      <span>{{item.step}}</span>
      <span>{{item.tip}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import validatorMixin from 'a2-validator'

  export default {
    mixins: [validatorMixin],
    data() {
      return {
        name: '',
        age: '',
        date: '',
        email: '',
        idCard: '',
        regStr: '',
        funcStr: ''
      }
    },
    // 在此配置验证规则
    // 内置校验规则：
    // required  number  float  integer
    // mobile    email   idCard
    //
    // date 日期验证
    // 默认格式是yyyy-MM-dd hh:mm:ss，可以自定义如： date|yyyy-MM-dd
    //
    // max  min  验证数值的范围
    // max等效于<=  min等效于>=  eg： max|10(等效于<=10)   min|5(等效于<=5)
    //
    // maxLength  minLength 验证字符串的长度范围
    // eg: maxLength|10 (字符串的长度不超过10)  minLength|2 (字符串的长度不小于2)
    //
    // 校验的所有结果，可以通过this.validators获取到
    // isOk: rules数组中的所有验证规则都通过了才为true，否则为false
    // step: 没通过的验证规则在rules数组中的序号, 规则全部通过时为-1
    // tip:  某项规则没通过时，对应的提示信息
    validators: {
      name: {
        rules: ['required'],
        tips: ['姓名不能为空']
      },
      age: {
        rules: ['required', 'min|0', 'max|160'],
        tips: ['年龄不能为空', '请输入正确的年龄值', '请输入正确的年龄值']
      },
      date: {
        rules: ['required', 'yyyy-MM-dd'],
        tips: ['日期不能为空', '请输入正确的日期，格式如2018-02-09']
      },
      email: {
        rules: ['required', 'email'],
        tips: ['邮箱不能为空', '请输入正确的邮箱']
      },
      // 自定义的正则验证器
      regStr: {
        rules: ['required', /^a\w+z$/],
        tips: ['内容不能为空', '字符串必须以a开头，同时以z结尾']
      },
      // 自定义的函数验证器
      funcStr: {
        rules: ['required', value => /^a\w+z$/.test(value)],
        tips: ['内容不能为空', '字符串必须以a开头，同时以z结尾']
      }
    },
    methods: {
      submit() {
        // 校验部分信息
        this.validators
          .check(['name', 'age'])
          .success(() => {
            // submit data to server
          })
          // 校验未通过时的回调
          .error((errorItem) => {
            alert(errorItem.tip)
          })

        // 校验全部信息
        this.validators
          .checkAll()
          .success(() => {
            // submit data to server
          })
          // 校验未通过时的回调
          .error((errorItem) => {
            alert(errorItem.tip)
          })
      }
    }
  }
</script>

<style lang="stylus">
  @import "../common/stylus/mixin.styl"

  .test
    .item
      display: flex
      input
        flex: 1
        margin-left: 16px
    .item, .desc-item
      padding: 0 16px
      border-bottom: 1px solid #d3d3d3
      background: #fff
      > *
        line-height: 40px
      & > span
        padding-right: 20px
    .item:nth-child(7)
      margin-bottom: 30px
</style>
