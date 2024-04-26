import axios from 'axios';
import { refreshToken } from './auth'
import url from 'url'

const log = process.env.NODE_ENV == 'development' ? console.log : () => void 0

// 创建一个Axios实例
const axiosInstance = axios.create();

// 定义状态变量
let isRefreshing = false; // 标记是否正在刷新token
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = []; // 存放因401错误而失败的请求

// 处理等待队列中的请求
const processQueue = (error: null, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = []; // 处理完后清空队列
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Do something before request is sent, e.g., add auth token to header
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    log(`%c[${new Date().toLocaleString()}]: axios request ${config.url}`, 'color:red;', config)
    return config;
  },
  error => {
    return Promise.reject({reason: error});
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    log(`%c[${new Date().toLocaleString()}]: axios response ${response.config.url}`, 'color: green;', response)
    return response
  },
  error => {
    const originalRequest = error.config;

    console.log('originalRequest error:: ', error)

    if (error.response.status === 401 && !originalRequest._retry) {
      console.log('401 error:: ', {error, _retry: originalRequest._retry, isRefreshing, failedQueue})
      if (isRefreshing) {
        // 正在刷新token，将新的请求放入等待队列
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        const refresh_token = localStorage.getItem('refreshToken') || '';
        refreshToken(refresh_token).then(({data}) => {
          const access_token = data.data
          console.log('refresh access_token:: ', access_token)
          localStorage.setItem('accessToken', access_token);
          axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
          originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
          processQueue(null, access_token);
          resolve(axiosInstance(originalRequest));
        }).catch((err) => {
          processQueue(err, null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          console.log("Redirect to login page");
          reject(err);
        }).finally(() => {
          isRefreshing = false;
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;