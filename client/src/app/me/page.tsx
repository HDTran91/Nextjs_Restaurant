import React from 'react'
import envConfig from '@/config'
import { cookies } from 'next/headers'
import Profile from './profile'

export default async function MeProfile() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('sessionToken')
    // console.log(sessionToken)
    const result = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${sessionToken?.value
          }`
        },
        }).then(async(res) => {
          const payload = await res.json()
          const data = {
            status: res.status,
            payload
          }
          if (!res.ok) {
            throw data
          }
          return data
        })
        console.log(result)
  return (
    <div>
        <h1>Profile</h1>
        <div>
            Hello {result.payload.data.name}
        </div>
        <Profile />
    </div>
  )
}
