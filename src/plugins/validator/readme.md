###example

```javascript
validator(12, 'min|0')
validator(12, ['required', 'min|0'])

let data = {
  name: 'zengjun',
  age: 12,
  birthday:'1990-03-23'
}

// item
let result = validator(data, {
  name: 'required',           // not empty
  age: 'min|0',               // >=0 
  birthday: 'data|yyyy-MM-dd' // is date
})

// arr 按顺序依次执行
let result1 = validator(data, {
  name: ['required', 'minLength|3' ,'maxLength|30'],           // not empty
  age: ['required', 'min|0'],              
  birthday: ['data|yyyy-MM-dd'] // is date
})
```
