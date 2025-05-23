/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import Jwt from "jsonwebtoken"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({error, setError}: {
  error: any
  setError?: UseFormSetError<any>
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(item => {
      setError(item.field, {
        type: "server",
        message: item.message,
      })
    })
  }
  else {
    toast.error(error?.payload?.message ?? 'unidentified error')
  }
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeJWT = <Payload = any>(token: string)=> {
  return Jwt.decode(token) as Payload
}