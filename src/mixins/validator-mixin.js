import validator from '../plugins/validator'
import {getType} from '../common/utils/typeUtils'
import {injectProp} from '../common/utils/vueUtils'

export default {
  beforeCreate() {
    let validators = this.$options.validators
    let injectObj = {}

    // init injectObj
    Object.keys(validators)
      .forEach(prop => injectObj[prop] = {})

    // inject 'validators' prop in data
    injectProp('validators', injectObj, this)
  },

  created() {
    // add watch listener
    initWatchListener.call(this)
  }
}

function initWatchListener() {
  let validatorConfig = this.$options.validators
  let props = Object.keys(validatorConfig)

  for (let prop of props) {
    let configItem = validatorConfig[prop]
    let rule, tip

    if (getType(configItem) === 'object') {
      rule = configItem.rule
      tip = configItem.tip
    } else {
      rule = configItem
      tip = ''
    }

    // add listener
    this.$watch(
      prop,
      function (newValue) {
        this.validators[prop] = runValidator(newValue, rule, tip)
      },
      {immediate: true}
    )
  }
}

function runValidator(value, rule, tip) {
  let [isOk, step] = validator(value, rule)

  return {
    isOk, step,
    tip: getType(tip) === 'array' ? (tip[step] || '') : tip
  }
}
