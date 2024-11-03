import axios from 'axios'

axios.defaults.baseURL = '/api'
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
// axios.defaults.headers.post['Content-Type'] =
//   'application/x-www-form-urlencoded'
// declare module 'axios' {
//   export interface AxiosResponse<T = any> {
//     data: T
//   }
// }

// const instance: AxiosInstance = axios.create({
//   baseURL: '/api',
// })

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

axios.interceptors.response.use(
  response => {
    // if (response.status >= 200 && response.status < 300) {
    return response //.data
    // return Promise.reject('调用错误')
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default axios
