"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginBodyType, LoginBody, LoginResType} from "@/schemaValidations/auth.schema"
// import envConfig from "@/config"
import { toast } from 'sonner'

import authApiRequest from "@/apiRequest/auth"
import { handleErrorApi } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function LoginForm() {
  const [loading, setLoading] = useState(false)
    const router = useRouter()
    const form = useForm<LoginBodyType>({
      resolver: zodResolver(LoginBody),
      defaultValues: {
        email: "",
        password: "",
      },
    })

    // 2. Define a submit handler.
  async  function onSubmit(values: LoginBodyType) {
    if (loading) return
    setLoading(true)
    try {
        const result = await authApiRequest.login(values) as LoginResType
        toast.success(result.payload.message)

        await authApiRequest.auth({sessionToken: result.payload.data.token, expiresAt: result.payload.data.expiresAt})
        router.push('/me')


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      handleErrorApi ({
        error,
        setError: form.setError,
      })
    }finally {
      setLoading(false)
    }
  }
    return <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-2 max-w-[600px] flex-shrink-0 w-full'>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='mt-8 w-full'>Login</Button>
      </form>
      </Form>
    </div>

}
