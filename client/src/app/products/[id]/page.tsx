import productApiRequest from '@/apiRequest/product'
import React from 'react'

export default async function ProductEdit( {params} : {params: {id: string}}) {

    let product = null
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const {payload} = await productApiRequest.getDetail(Number(params.id))
    product = payload.data
    }
    catch (error) {}
    return (
    <div>
        {!product && <div> Product is unfound</div>}
        {product && <div> {product.name}</div>}
    </div>
  )
}
