import {each} from '../../common/utils/utils'
import {getType} from '../../common/utils/typeUtils'
import {escapeStringRegexp} from '../../common/utils/stringUtils'

// Validate string
// required  number  float integer  date|yyyy-MM-dd hh:mm:ss
// mobile    email   max   min idCard
export default function (data, opts) {
  let validateResult = {}

  each(opts, (validator, prop) => {
    let value = String(data[prop])

    switch (getType(validator)) {
      case 'string':
      case 'regexp':
      case 'function':
        validateResult[prop] = runValidator(validator, value)
        break
      case 'array':
        validateResult[prop] = runValidatorByArr(validator, value)
        break
    }
  })

  return validateResult
}

const numberRegExp = /^-?\d+(\.\d+)?$/
const integerRegExp = /^-?\d+$/
const floatRegExp = /^-?\d+\.\d+$/
const mobileRegExp = /^1(3[0-9]|4[579]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/
const emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const idCardRegExp = /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/

const rules = {
  required(value) {
    return value.length > 0
  },

  max(value, len) {
    return value.length <= len
  },

  min(value, len) {
    return value.length >= len
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

function runValidatorByArr(validator, value) {
  // the index of validator that validate failure
  let step = -1
  let result

  for (let [index, vd] of validator.entries()) {
    result = runValidator(vd, value)

    if (!result) {
      step = index
      return result
    }
  }

  return [result, step]
}

function runValidator(validator, value) {
  switch (getType(validator)) {
    case 'string':
      return [dealStringValidator(validator, value), -1]
    case 'regexp':
      return [validator.test(value), -1]
    case 'function':
      return [validator(value), -1]
  }
}


function dealStringValidator(validator, value) {
  let arr = validator.split('|')
  let validatorKey = arr[0]
  let condition = arr[1]

  validator = rules[validatorKey] ? rules[validatorKey] : validateByString

  return validator(value, condition)
}

function validateByString(value) {
  return value.indexOf(value) > -1
}
