import { ModeToggle } from '@/components/toggle.theme'
import ButtonLogout from '@/components/ui/button-logout'
import Link from 'next/link'
import React from 'react'
import {cookies} from 'next/headers'
import accountApiRequest from '@/apiRequest/account'

export default async function header() {
   const cookieStore = cookies()
   const sessionToken = (await cookieStore).get('sessionToken')?.value ??''
   let user= null
   if(sessionToken) {
      const data = await accountApiRequest.me(sessionToken)
      console.log('data', data)
      user = data.payload.data

   }
   console.log('user', user)
  return (
    <div>
        <ul>
            {user ? (
            <>
               <li>
                  <div>Welcome, <strong> {user.name}</strong></div>
               </li>
               <li>
                  <ButtonLogout />
               </li>
            </>
            ):(
               <>
               <li>
                  <Link href={'/login'}> Login</Link>
               </li>
               <li>
                  <Link href={'/register'}> Register</Link>
               </li>
               </>
            )}

            <li>
               <Link href={'/products'}>Product</Link>
            </li>
        </ul>
        <ModeToggle />
    </div>
  )
}
