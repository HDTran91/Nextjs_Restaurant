/* eslint-disable @typescript-eslint/ban-ts-comment */
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
// import envConfig from "@/config"
import { toast } from 'sonner'

import { handleErrorApi } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import Image from "next/image"
import { CreateProductBody, CreateProductBodyType, ProductResType, UpdateProductBodyType } from "@/schemaValidations/product.schema"
import productApiRequest from "@/apiRequest/product"
type Product = ProductResType['data']


export default function ProductAddForm({
  product
}: {product?: Product}) {
    const [file, setFile] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const form = useForm<CreateProductBodyType>({
      resolver: zodResolver(CreateProductBody),
      defaultValues: {
        name: product?.name?? '',
        price: product?.price?? 0,
        description: product?.description?? '',
        image: product?.image ?? '',
      },
    })

    const image = form.watch('image')
    const createProduct = async (values: CreateProductBodyType) => {
    setLoading(true)
    try {
        const formData = new FormData()
        formData.append('file', file as Blob)
        const uploadImageResult = await productApiRequest.uploadImage(formData)
        // @ts-expect-error
        const imageUrl = uploadImageResult.payload.data

        const result = await productApiRequest.create({
            ...values,
            image: imageUrl
        })
        // @ts-expect-error
        toast.success(result.payload.message)
        router.push('/products')


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

    const updateProduct = async (_values : UpdateProductBodyType) => {
      if(!product) return
      setLoading(true)
      let values = _values
      try {
        if(file) {
          const formData = new FormData()
          formData.append('file', file as Blob)
          const uploadImageResult = await productApiRequest.uploadImage(formData)
          // @ts-expect-error
          const imageUrl = uploadImageResult.payload.data
          values = {...values,
            image: imageUrl
        }
        }

          const result = await productApiRequest.update(product.id, values)
          // @ts-expect-error
          toast.success(result.payload.message)
          router.push('/products')


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



    // 2. Define a submit handler.
  async  function onSubmit(values: CreateProductBodyType) {
    if (loading) return
    if (product) {
      await updateProduct(values)
      console.log('update product', values)
    } else {
      await createProduct(values)
    }
  }
    return <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-2 max-w-[600px] flex-shrink-0 w-full'>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="price" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" type="textarea" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
          />

          <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <input
                  placeholder="Image URL"
                  onClick={() => {
                    if(inputRef.current) {
                      inputRef.current.value = ''
                    }
                  }}
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                      field.onChange('http://localhost:3000/' + file.name);
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
          />
          {(file || image) && (
            <div>
                <Image
                src={file ? URL.createObjectURL(file): image}
                width={128}
                height={128}
                alt='preview'
                className="mt-4 w-32 h-32 object-cover"
                />

                <Button type='button' variant={'destructive'} size="sm"
                onClick={()=>{
                    setFile(null)
                    form.setValue('image', '')
                }}>Delete Image</Button>
            </div>

          )}


        <Button type="submit" className='mt-8 w-full'>
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
      </Form>
    </div>

}
