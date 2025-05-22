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
import { RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema"
import { toast } from "sonner"
import authApiRequest from "@/apiRequest/auth"
import { LoginResponse } from "@/app/(auth)/login/login-form"
import { useRouter } from "next/navigation"
import { handleErrorApi } from "@/lib/utils"
import { useState } from "react"


export default function RegisterForm() {
  const [loading, setLoading] = useState(false)
    const router = useRouter()
    const form = useForm<RegisterBodyType>({
      resolver: zodResolver(RegisterBody),
      defaultValues: {
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
      },
    })

    // 2. Define a submit handler.
  async  function onSubmit(values: RegisterBodyType) {
    if (loading) return
    setLoading(true)
      try {
        const result = await authApiRequest.register(values) as unknown as LoginResponse
        toast.success(result.payload.message)
        await authApiRequest.auth({sessionToken: result.payload.data.token})
        router.push('/me')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      handleErrorApi ({
              error,
              setError: form.setError,
      })
    } finally {
      setLoading(false)
    }
  }
    return <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-2 max-w-[600px] flex-shrink-0 w-full'>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ConfirmPassword</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='mt-8 w-full'>Register</Button>
      </form>
      </Form>
    </div>

}
