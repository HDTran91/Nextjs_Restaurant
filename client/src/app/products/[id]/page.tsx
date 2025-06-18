/* eslint-disable @typescript-eslint/no-unused-vars */
import productApiRequest from '@/apiRequest/product'
import React from 'react'
import Image from 'next/image'
import type { Metadata, ResolvingMetadata } from 'next'
import { cache } from 'react'
import envConfig from '@/config'
import { baseOpenGraph } from '@/app/share-metadata'

const getDetail = cache(productApiRequest.getDetail)

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {payload} = await getDetail(Number(params.id))
    const product = payload.data
    const url = envConfig.NEXT_PUBLIC_URL + '/products/' + product.id

  return {
    title: product.name,
    description: product.description,
    openGraph: {
        title: product.name,
        description: product.description,
        url,
        siteName: 'Productic Company',
        images: [
        {
            url: product.image

        }
        ],
        ...baseOpenGraph,
    },
    alternates: {
        canonical: url,
    }
  }
}


export default async function ProductDetail({ params, searchParams }: Props) {
   let product = null
   try {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {payload} = await getDetail(Number(params.id))
    product = payload.data
    // console.log('product', product)
   }
   catch (error) {
    console.log(error)
   }
  return (

     <div>
          {!product && <div>Không tìm thấy sản phẩm</div>}
          {product && <div>

            <Image
                src={product.image}
                alt ={product.name}
                width={200}
                height={200}
                className='w-32 h-32 object-cover'
                />
                <h3>{product.name}</h3>
                <h3>{product.price}</h3>
            </div>}
    </div>
  )
}
