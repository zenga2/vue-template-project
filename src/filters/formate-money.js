export default function (value, num = 2) {
  let myValue = Number(value)
  if (isNaN(myValue)) return value

  let arr = myValue.toFixed(num).split('.')
  let integer = arr[0]
  let charArr = []
  let result

  // deal integer part
  for (let i = 0, len = integer.length; i < len; i++) {
    charArr.push(integer[i])

    let c = len - 1 - i
    if (c > 0 && c % 3 === 0) {
      charArr.push(', ')
    }
  }

  integer = charArr.join('')
  result = num > 0 ? integer + '.' + arr[1] : integer

  return '￥' + result
}
