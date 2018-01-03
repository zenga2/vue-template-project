import ImageCompressor from '@xkeshi/image-compressor'

export default function (options) {
  let inputEl = insertInputEl()
  let resultType = options.resultType || 'blob'
  delete options.resultType

  let promise = new Promise((resolve, reject) => {
    inputEl.addEventListener('change', (e) => {
      setTimeout(() => {
        document.body.removeChild(inputEl)
      }, 1000)

      const file = e.target.files[0]
      if (!file) {
        reject({type: 'noFile'})
      }

      new ImageCompressor(file, {
        ...options,
        success(result) {
          console.log(result)
          if (resultType === 'base64') {
            blobToBase64(result, resolve)
          } else {
            resolve(result)
          }
        },
        error(err) {
          console.log(err)
          reject({type: 'compressError'})
        }
      })
    })
  })

  inputEl.click()

  return promise
}

function insertInputEl() {
  let inputEl = document.createElement('input')

  inputEl.type = 'file'
  inputEl.accept = 'image/*'
  inputEl.style.position = 'fixed'
  inputEl.style.left = '30000px'
  document.body.appendChild(inputEl)

  return inputEl
}

export function blobToBase64(blob, cb) {
  let reader = new FileReader()
  reader.onload = function () {
    cb && cb(reader.result)
  }
  reader.readAsDataURL(blob)
}
