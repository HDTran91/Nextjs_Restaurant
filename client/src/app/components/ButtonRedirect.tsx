'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ButtonRedirect() {
    const router = useRouter()
    const handleNavigate = () => {
    router.push('/login')}
  return (
    <button onClick={handleNavigate} className="bg-blue-500 text-white p-2 rounded">
      chuyen sang trang Login
    </button>
  )
}
