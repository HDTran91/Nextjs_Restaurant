'use client'
import authApiRequest from '@/apiRequest/auth';
import { Button } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import React from 'react'

export default function ButtonLogout() {
    const router = useRouter()
    const handleLogout = async () => {
       try {
        await authApiRequest.logoutFromNextClientToServer()
        router.push('/login')
       } catch (error) {
        handleErrorApi({
            error
        })
       }
    };
  return (
    <Button size={'sm'} onClick={handleLogout}>
        Log Out
    </Button>
  )
}
