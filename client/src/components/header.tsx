import { ModeToggle } from '@/components/toggle.theme'
import ButtonLogout from '@/components/ui/button-logout'
import Link from 'next/link'
import React from 'react'
import { AccountResType } from '@/schemaValidations/account.schema'

export default async function header({
   user
}:{
   user: AccountResType['payload']['data'] | null
}) {
  return (
    <div>
        <ul>
            {user ? (
            <>
               <li>
                  <Link href={'/me'}>Welcome, <strong> {user.name}</strong></Link>
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
