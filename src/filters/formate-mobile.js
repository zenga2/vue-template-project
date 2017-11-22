export default function (value) {
  value = String(value)
  if (!value && value.length < 11) return value

  return value.replace(/^(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
}
