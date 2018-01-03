###插件choose-image用法

```javascript
function blobToBase64(blob, cb) {
  let reader = new FileReader()
  reader.onload = function () {
    cb && cb(reader.result)
  }
  reader.readAsDataURL(blob)
}

chooseImage({
  maxWidth: 300,
  quality: 0.8,
  // 返回的图片的类型
  mimeType: 'image/jpeg',
  // 返回的数据类型: blob/base64  default: blob
  resultType: 'blob'
}).then(blob => {
  console.log(blob)
})
```