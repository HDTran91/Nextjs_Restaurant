/* eslint-disable react/jsx-no-comment-textnodes */
import productApiRequest from '@/apiRequest/product'
import DeleteProduct from '@/app/products/_components/delete-product';
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import Link from 'next/link';


type Product = {
        name: string;
        price: number;
        description: string;
        image: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
};

type WrappedProduct = {
  message: string;
    data: {
        name: string;
        price: number;
        description: string;
        image: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    };
};

export default async function ProductListPage() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const {payload} = await productApiRequest.getList()
  const productList: Product[] = payload.data
  console.log('productList', productList)

  return (
    <div className= 'space-y-3'>
        <h1>Product List</h1>
        <Link href={'/products/add'}>
        <Button variant ='secondary'>
           Add Product
        </Button>

        </Link>
        <div className='space-y-5'>
            {productList.map((product: Product) => (
            <div key={product.id} className='flex space-x-4'>
                <Image
                src={product.image}
                alt ={product.name}
                width={200}
                height={200}
                className='w-32 h-32 object-cover'
                />
                <h3>{product.name}</h3>
                <h3>{product.price}</h3>
                <div className="flex space-x-2 items-start">
                  <Link href= {`/products/${product.id}`}>
                  <Button variant='outline'>Edit</Button>
                  </Link>

                  <DeleteProduct product={product as unknown as WrappedProduct } />

                </div>
            </div>

            ))}

        </div>
    </div>
  )
}
