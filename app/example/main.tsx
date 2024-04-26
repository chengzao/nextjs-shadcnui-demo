'use client'
import React from 'react'
import { getList, getToken, refreshToken, getOther } from '@/helpers/auth'

import { Button } from "@/components/ui/button"


const Main = () => {

  const list = async () => {
    try {
      const {data: listResult} = await getList()
      console.log('listResult:: ', listResult.data)
    } catch (error) {
      console.log(error)
    }
  }

  const other = async () => {
    try {
      const {data: otherResult} = await getOther()
      console.log('otherResult:: ', otherResult.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAll = () => {
    list()
    other()
  }

  const token = async () => {
    try {
      const { data } = await getToken()
      if(data.code == 0) {
        const { access_token, refresh_token } = data.data
        localStorage.setItem('accessToken', access_token)
        localStorage.setItem('refreshToken', refresh_token)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const refresh = async () => {
    try {
      const refresh_token = localStorage.getItem('refreshToken') || ''
      if(!refresh_token) return
      const { data } = await refreshToken(refresh_token)
      if(data.code == 0) {
        const access_token = data.data
        localStorage.setItem('accessToken', access_token)
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="flex items-center justify-center pt-20 gap-4">
      <Button variant="outline" onClick={list}>List</Button>
      <Button variant="secondary" onClick={other}>Other</Button>
      <Button variant="ghost" onClick={fetchAll}>All</Button>
      <Button variant="secondary" onClick={token}>Token</Button>
      <Button variant="outline" onClick={refresh}>Refresh</Button>
    </div>
  )
}

export default Main