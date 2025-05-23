'use client'
import authApiRequest from '@/apiRequest/auth'
import { clientSessionToken } from '@/lib/http'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Logout() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const sessionToken = searchParams.get('sessionToken')
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        if(sessionToken === clientSessionToken.value) {
            authApiRequest.logoutFromNextClientToServer(true, signal).then(() => {
                router.push(`/login?redirectFrom=${pathname}`)
            })
        }
        return () => {
            controller.abort()
        }
    },[sessionToken,router, pathname])
    return (
    <div>page</div>
  )
}
