import {each} from '../../common/utils/utils'
import {getType, isNull, isUndefined} from '../../common/utils/typeUtils'
import {escapeStringRegexp} from '../../common/utils/stringUtils'

// Validate string
// required  number  float integer  date|yyyy-MM-dd hh:mm:ss
// mobile    email   max   min maxLength minLength  idCard
export default function (data, opts) {
  let validateResult = {}

  if (typeof data === 'object') {
    each(opts, (rule, prop) => {
      validateResult[prop] = validator(rule, toString(data[prop]))
    })
  } else {
    validateResult = validator(opts, toString(data))
  }

  return validateResult
}

function toString(value) {
  return isNull(value) || isUndefined(value) ? '' : String(value)
}

function validator(rule, value) {
  switch (getType(rule)) {
    case 'string':
    case 'regexp':
    case 'function':
      return validateRule(rule, value)
    case 'array':
      return validateRuleList(rule, value)
  }
}

const numberRegExp = /^-?\d+(\.\d+)?$/
const integerRegExp = /^-?\d+$/
const floatRegExp = /^-?\d+\.\d+$/
const mobileRegExp = /^1(3[0-9]|4[579]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/
const emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const idCardRegExp = /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/

const ruleList = {
  required(value) {
    return !!value
  },

  max(value, maxNum) {
    return Number(value) <= Number(maxNum)
  },

  min(value, minNum) {
    return Number(value) >= Number(minNum)
  },

  maxLength(val, len) {
    return val.length <= Number(len)
  },

  minLength(val, len) {
    return val.length >= Number(len)
  },

  number(value) {
    return numberRegExp.test(value)
  },

  integer(value) {
    return integerRegExp.test(value)
  },

  float(value) {
    return floatRegExp.test(value)
  },

  // fmt eg: 'yyyy-MM-dd hh:mm:ss'
  date(value, fmt) {
    let arr = ['y+', 'M+', 'd+', 'h+', 'm+', 's+']
    fmt = escapeStringRegexp(fmt)

    for (let patt of arr) {
      fmt = fmt.replace(new RegExp(patt), (matchStr) => {
        // 先用w占位,避免\d与d+冲突
        return `\\w{${matchStr.length}}`
      })
    }

    fmt.replace(/w/g, 'd')

    return new RegExp(fmt).test(value)
  },

  mobile(value) {
    return mobileRegExp.test(value)
  },

  email(value) {
    return emailRegExp.test(value)
  },

  // 可以参考id-validator(可以从省份证中获取其他信息)
  idCard(value) {
    return idCardRegExp.test(value)
  }
}

function validateRuleList(rules, value) {
  // the index of rule that validate failure
  let step = -1
  let result

  for (let [index, rule] of rules.entries()) {
    result = validateRule(rule, value)

    if (!result) {
      step = index
      return result
    }
  }

  return [result, step]
}

function validateRule(rule, value) {
  switch (getType(rule)) {
    case 'string':
      return [dealStringRule(rule, value), -1]
    case 'regexp':
      return [rule.test(value), -1]
    case 'function':
      return [rule(value), -1]
  }
}


function dealStringRule(rule, value) {
  let arr = rule.split('|')
  let validatorKey = arr[0]
  let condition = arr[1]

  rule = ruleList[validatorKey] ? ruleList[validatorKey] : validateByString

  return rule(value, condition)
}

function validateByString(value) {
  return value.indexOf(value) > -1
}
