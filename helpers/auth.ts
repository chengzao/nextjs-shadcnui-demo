import axiosInstance from "./http"


export const refreshToken = (token: string) => {
  return axiosInstance.post('/api/refresh', {
    refresh_token: token
  })
} 

export const getList = () => {
  return axiosInstance.get('/api/list')
}


export const getToken = () => {
  return axiosInstance.get('/api/token')
}

export const getOther = () => {
  return axiosInstance.get(`/api/other`)
}