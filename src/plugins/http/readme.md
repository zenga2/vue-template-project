http.request()的执行流程:
```
1. 执行request的拦截器(先注册先执行)
2. 执行transformRequest
3. 执行ajax(即发起http请求)
4. 执行transformResponse
5. 执行response的拦截器(先注册先执行)
6. 用户的处理逻辑
```