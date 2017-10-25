export default function createError (errorType, desc, opts) {
  let xhr = opts.xhr

  return {
    errorType, desc,
    status: xhr.status,
    statusText: xhr.statusText,
    opts
  }
}
