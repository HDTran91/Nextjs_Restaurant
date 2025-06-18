
import productApiRequest from '@/apiRequest/product'
import DeleteProduct from '@/app/products/_components/delete-product';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
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

export const metadata = {
  title: 'Product List',
  description: 'List of products available in the store',
}

export default async function ProductListPage() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')
  const isAuthenticated = !!sessionToken
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const {payload} = await productApiRequest.getList()
  const productList: Product[] = payload.data
  return (
    <div className= 'space-y-3'>
        <h1>Product List</h1>
        {isAuthenticated &&
         <Link href={'/products/add'}>
        <Button variant ='secondary'>
           Add Product
        </Button>

        </Link>
        }

        <div className='space-y-5'>
            {productList.map((product: Product) => (
            <div key={product.id} className='flex space-x-4'>
              <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt ={product.name}
                width={200}
                height={200}
                className='w-32 h-32 object-cover'
                />
              </Link>

                <h3>{product.name}</h3>
                <h3>{product.price}</h3>
                {isAuthenticated &&
                <div className="flex space-x-2 items-start">
                  <Link href= {`/products/${product.id}/edit`}>
                  <Button variant='outline'>Edit</Button>
                  </Link>

                  <DeleteProduct product={product as unknown as WrappedProduct } />

                </div>}

            </div>

            ))}

        </div>
    </div>
  )
}
