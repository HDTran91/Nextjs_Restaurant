import React from 'react'
// import envConfig from '@/config'
import { cookies } from 'next/headers'
import Profile from './profile'
import accountApiRequest from '@/apiRequest/account'
import { LoginResponse } from '@/app/(auth)/login/login-form'


export default async function MeProfile() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('sessionToken')
    // console.log(sessionToken)
    const result = await accountApiRequest.me(sessionToken?.value as string) as unknown as LoginResponse
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
