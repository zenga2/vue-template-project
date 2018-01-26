export default function (value, num = 2) {
  let myValue = Number(value)
  if (isNaN(myValue)) return value

  myValue *= 100
  myValue = myValue.toFixed(num)

  return myValue + '%'
}