import axios from "axios";
import { Toast } from "zarm";

// 环境变量在项目中，可以通过 import.meta.env.MODE 获取    
const MODE = import.meta.env.MODE;  //环境变量  

// baseURL 是 axios 的配置项，作用：设置请求的基础路径
// 配置基础路径好处：当请求地址修改时，可在此统一配置
// axios.defaults.baseURL = MODE == 'development' ? '/api' : 'http://api.chennick.wang';
axios.defaults.baseURL = MODE == 'development' ? ' http://api.chennick.wang' : 'http://api.chennick.wang';
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = true;

// 自定义请求头
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// 服务端鉴权，在前端设置token，服务端通过获取请求头中的 token 去验证每一次请求是否合法
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
// post 请求时，使用的请求体，这里默认设置成 application/json 的形式
axios.defaults.headers.post['Content-Type'] = 'application/json';

// interceptors 为拦截器，拦截器作用：拦截每一次请求，可在回调函数中做一些“手脚”，再将数据 return 回去
// 以下代码拦截了响应内容，统一判断请求内容，如果非 200，则提示错误信息，401 的话，就是没有登录的用户，默认跳到 /login 页面。如果是正常的响应，则 retrun res.data
axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg)
    if (res.data.code == 401) {
      window.location.href = '/login'
    }
    return Promise.reject(res.data)
  }

  return res.data
})

// 将 axios 抛出，供页面组件请求使用
export default axios