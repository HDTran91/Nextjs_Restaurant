'use client'
import authApiRequest from '@/apiRequest/auth';
import { Button } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';


import React from 'react'

export default function ButtonLogout() {
    const router = useRouter()
    const pathname = usePathname()
    const handleLogout = async () => {
       try {
        await authApiRequest.logoutFromNextClientToServer()
        router.push('/login')
       } catch (error) {
        handleErrorApi({
            error
        })
        authApiRequest.logoutFromNextClientToServer(true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((res) => {
          router.push(`/login?redirectFrom=${pathname}`)
            })
       }
    };
  return (
    <Button size={'sm'} onClick={handleLogout}>
        Log Out
    </Button>
  )
}
