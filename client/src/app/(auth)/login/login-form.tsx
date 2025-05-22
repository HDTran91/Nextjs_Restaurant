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
import { LoginBodyType, LoginBody } from "@/schemaValidations/auth.schema"
// import envConfig from "@/config"
import { toast } from 'sonner'

import authApiRequest from "@/apiRequest/auth"



export type LoginResponse = {
  status: number;
  payload: {
    message: string;
    data: {
      token: string;
      id: number;
      name: string;
      email: string;
    };
  };
};

export default function LoginForm() {
    const form = useForm<LoginBodyType>({
      resolver: zodResolver(LoginBody),
      defaultValues: {
        email: "",
        password: "",
      },
    })

    // 2. Define a submit handler.
  async  function onSubmit(values: LoginBodyType) {
    try {
        const result = await authApiRequest.login(values) as unknown as LoginResponse
        toast.success(result.payload.message)
        console.log("result Gacon:", result)
        await authApiRequest.auth({sessionToken: result.payload.data.token})

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      const errors = error.payload.errors as {field:string, message: string}[]
      const status = error.status as number
      if(status ===422) {
        errors.forEach((error) => {
          form.setError(error.field as 'email' | 'password', {
            type: "server",
            message: error.message,
          })
        })
      }
      else
      toast.error(error.payload.message)
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
