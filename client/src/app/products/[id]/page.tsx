import productApiRequest from '@/apiRequest/product'
import React from 'react'
import Image from 'next/image'

export default async function ProductDetail({
    params
}:{
    params: {id:string}
}) {
   let product = null
   try {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {payload} = await productApiRequest.getDetail(Number(params.id))
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
