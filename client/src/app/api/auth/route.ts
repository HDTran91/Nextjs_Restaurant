import { decodeJWT } from "@/lib/utils"

type PayloadJWT = {
  iat: number,
  exp: number,
  sessionToken: string,
  userId: string
}

export async function POST(request: Request) {
    const res = await request.json()
    const sessionToken = res.sessionToken as string
    if (!sessionToken) {
        return Response.json({message: "No session token found"}, {status: 401})}
    const payload = decodeJWT<PayloadJWT>(sessionToken)
    const expiresDate = new Date(payload.exp * 1000).toUTCString
    return Response.json( res,{
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken =${sessionToken};Path=/; HttpOnly; Exopires=${expiresDate}; SameSite=Strict; Secure`,
    }
   })
}