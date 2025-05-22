import authApiRequest from "@/apiRequest/auth"
import { cookies } from "next/headers"
import { HttpError } from "@/lib/http"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
    const cookieStore = await cookies()
    const sessionToken =  cookieStore.get("sessionToken")
    if (!sessionToken) {
        return Response.json({message: "No session token found"}, {status: 401})}

    try{
       const result = await authApiRequest.logoutFromNextServerToServer(sessionToken.value)
        return Response.json(result, {
            status: 200,
            headers: {
                //delete the cookie sessionToken
                'set-cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
            }
        })
    }catch(error) {
        if(error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            })
        } else {
            return Response.json({message: "Unknown error"}, {
                status: 500,
        })
    }
}
}