// import axios from 'axios';
// { AxiosRequestConfig }
import axios from 'axios'
// const axios = require('axios')

// const instance = axios.create({
//   baseURL: 'http://localhost/api/',
//   timeout: 1000,
//   headers: { 'X-Custom-Header': 'foobar' },
// })

axios.defaults.baseURL = '/api'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
// axios.defaults.headers.post['Content-Type'] =
//   'application/x-www-form-urlencoded'
// axios.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     return config
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error)
//   },
// )

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    console.error('调用错误', response)
    return Promise.reject('调用错误')
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default axios
