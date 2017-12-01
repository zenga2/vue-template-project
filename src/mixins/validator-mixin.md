###example
```vue
<template>
  <div class="full-screen">
  <div v-for="item in validators">
    <span>item.isOk</span>
    <span>item.step</span>
    <span>item.tip</span>
  </div>
</template>

<script type="text/ecmascript-6">
// 校验结果还会保存在this.validators中
export default {
    data() {
      return {
        step: 2,
        name:'',
        age:0,
        birthday:''
      }
    },
    validators: {
      step: 'requred',
      name: ['requred', 'minLength|3', 'maxLength|20'],
      age:{ 
        rule:['requred', 'min|0'], tip:['请输入年龄', '请输入正确的年龄']
      },
      birthday: {
        rule: 'data|yyyy-MM-dd', tip:'请输入出生日期'
      }
    }
  }
</script>
```