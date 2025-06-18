import React from 'react'
// import envConfig from '@/config'
import { cookies } from 'next/headers'
// import Profile from './profile'
import accountApiRequest from '@/apiRequest/account'

import { AccountResType } from '@/schemaValidations/account.schema'
import ProfileForm from '@/app/me/profile-form'

export const metadata = {
  title: 'Profile'
}

export default async function MeProfile() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('sessionToken')
    const result = await accountApiRequest.me(sessionToken?.value as string ?? "") as AccountResType
  return (
    <div>
        <h1>Profile</h1>
        <ProfileForm profile={result.payload.data} />
    </div>
  )
}
