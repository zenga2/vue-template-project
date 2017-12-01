import validator from '../plugins/validator'
import {getType} from '../common/utils/typeUtils'

export default {
  beforeCreate() {
    // inject 'validators' prop in data
    injectProp.call(this)
  },

  created() {
    // add watch listener
    initWatchListener.call(this)
  }
}

function injectProp() {
  let data = this.$options.data
  let injectObj = {}

  // init injectObj
  Object.keys(validators)
      .forEach(prop => injectObj[prop] = undefined)

  // inject 'validators' prop in data
  if (typeof data === 'function') {
    this.$options.data = function () {
      let obj = data.call(this)
      obj.validators = injectObj
      return obj
    }
  } else {
    data.validators = injectObj
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

    // init data
    this.validators[prop] = runValidator(this[prop], rule, tip)

    // add listener
    this.$watch(prop, function (newValue) {
      this.validators[prop] = runValidator(newValue, rule, tip)
    })
  }
}

function runValidator(value, rule, tip) {
  let [isOk, step] = validator(value, rule)

  return {
    isOk, step,
    tip: getType(tip) === 'array' ? (tip[step] || '') : tip
  }
}
