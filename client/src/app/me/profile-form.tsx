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
import { toast } from 'sonner'

import { handleErrorApi } from "@/lib/utils"

import { useState } from "react"
import { AccountResType, UpdateMeBody, UpdateMeBodyType } from "@/schemaValidations/account.schema"
import accountApiRequest from "@/apiRequest/account"
import { useRouter } from "next/navigation"

type Profile = AccountResType['payload']['data']

export default function ProfileForm({
    profile
}:{profile: Profile}) {
  const [loading, setLoading] = useState(false)
  const route = useRouter()
    const form = useForm<UpdateMeBodyType>({
      resolver: zodResolver(UpdateMeBody),
      defaultValues: {
       name: profile.name,
      },
    })

    // 2. Define a submit handler.
  async  function onSubmit(values: UpdateMeBodyType) {
    if (loading) return
    setLoading(true)
    try {
        const result = await accountApiRequest.updateMe(values)
        toast.success(result.payload.message)
        route.refresh() // Refresh the page to reflect changes
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


        <FormLabel>Email</FormLabel>
        <FormControl>
        <Input placeholder="email" type="email" value={profile.email} readOnly/>
        </FormControl>

        <FormMessage />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='mt-8 w-full'>Update</Button>
      </form>
      </Form>
    </div>

}
