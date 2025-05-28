import React from 'react'
// import envConfig from '@/config'
import { cookies } from 'next/headers'
// import Profile from './profile'
import accountApiRequest from '@/apiRequest/account'

import { AccountResType } from '@/schemaValidations/account.schema'


export default async function MeProfile() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('sessionToken')
    const result = await accountApiRequest.me(sessionToken?.value as string ?? "") as AccountResType
  return (
    <div>
        <h1>Profile</h1>
        <div>
            Hello {result.payload.data.name}
        </div>
        {/* <Profile /> */}
    </div>
  )
}
