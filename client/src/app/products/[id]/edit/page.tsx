/* eslint-disable @typescript-eslint/no-unused-vars */
import productApiRequest from '@/apiRequest/product'
import ProductAddForm from '@/app/products/_components/product-add-form'
import React, { cache } from 'react'
import type { Metadata, ResolvingMetadata } from 'next'

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

  return {
    title: 'Edit ' + product.name,
    description: 'Edit product details for ' + product.name,
  }
}

export default async function ProductEdit(props: Props) {
  const params = await props.params;
  let product = null
  try {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { payload } = await getDetail(Number(params.id))
    product = payload.data
  } catch (error) {
    console.log(error)
  }

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && <ProductAddForm product={product} />}
    </div>
  )
}