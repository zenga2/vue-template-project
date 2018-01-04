import Http from '../http'

export default function uploadFile(file) {
  let http = new Http()
  return http.post('https://upload.qiniup.com/', {
    requestType: 'formData',
    body: {
      token: 'A8SIAnj_MoLaBFRnPlmdCi78eLSUdY57VbMgFJZy:rRiDZbbvugLfAwyJm7DLT-5kGjc=:eyJzY29wZSI6ImNkdC1pbWFnZXMiLCJkZWFkbGluZSI6MTU5NTQ4NTcxMX0=',
      file: file
    }
  })
}
