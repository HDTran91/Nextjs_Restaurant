/* eslint-disable react/jsx-no-comment-textnodes */
'use client'

import { Button } from "@/components/ui/button"
import { ProductResType } from "@/schemaValidations/product.schema"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import productApiRequest from "@/apiRequest/product"
import { handleErrorApi } from "@/lib/utils"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"


export default function DeleteProduct({product}: {product: ProductResType}) {
    const alertDelete = () => {
        console.log(product)
    }
    const route = useRouter()
    const deleteProduct = async () => {
        try {
            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const result = await productApiRequest.delete(product.id)
            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.success(result.payload.message)
            route.refresh()
        }
        catch (error) {
            handleErrorApi({error})
        }

    }

    return (
        <>
         <AlertDialog>
            <AlertDialogTrigger asChild>
                 <Button variant="destructive" onClick = {alertDelete}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Do you want to delete item?</AlertDialogTitle>
                <AlertDialogDescription>

                    this product will be deleted. This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteProduct}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        </>

    )
}