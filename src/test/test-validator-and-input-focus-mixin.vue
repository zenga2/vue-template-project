<template>
  <div class="test full-screen">
    <cell label="step1" v-model="step1" focus-prop="step1" isInputBox></cell>
    <cell label="step2" v-model="step2" focus-prop="step2" isInputBox></cell>
    <cell label="step3" v-model="step3" focus-prop="step3" isInputBox></cell>
    <cell label="step4" v-model="step4" focus-prop="step4" isInputBox></cell>
    <cell label="step5" v-model="step5" focus-prop="step5" isInputBox></cell>
    <div v-if="false" v-for="(item, prop) in validators" class="item">
      <span>{{prop}}</span>
      <span>{{item.isOk}}</span>
      <span>{{item.step}}</span>
      <span>{{item.tip}}</span>
    </div>
    <div v-for="(item, prop) in inputState" class="item">
      <span>{{prop}}</span><span>{{item}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import validatorMixin from '../mixins/validator-mixin'
  import inputFocus from '../mixins/input-focus-mixin'
  import cell from '../components/cell/cell.vue'

  export default {
    name: 'n_test',
    mixins: [validatorMixin, inputFocus],
    data() {
      return {
        step1: 1,
        step2: 1,
        step3: 1,
        step4: 1,
        step5: 1
      }
    },
    validators: {
      step1: ['required', 'date|yyyy/M/d'],
      step2: ['required', 'integer'],
      step3: {
        rule: ['required', 'email'],
        tip: ['请输入email', '请输入正确的email']
      },
      step4: ['required', 'minLength|3', 'maxLength|20'],
      step5: ['required', 'number']
    },
    methods: {},
    beforeCreate() {},
    created() {
      window.vm = this
    },
    mounted() {
      this.$nextTick(() => {})
    },
    components: {cell}
  }
</script>

<style lang="stylus">
  @import "../common/stylus/mixin.styl"

  .test
    .item
      line-height: 52px
      & > span
        padding-right: 20px
</style>
