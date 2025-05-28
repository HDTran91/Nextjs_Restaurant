import { NextResponse } from "next/server"
import authApiRequest from "@/apiRequest/auth"
import { HttpError } from "@/lib/http"
import { cookies } from "next/headers"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("sessionToken")

    if (!sessionToken) {
        return NextResponse.json({ message: "No session token found" }, { status: 401 })
    }

    try {
        const res = await authApiRequest.slideSessionFromNextServerToServer(sessionToken.value)

        const newExpiresAt = new Date(res.payload.data.expiresAt).toUTCString()

        const response = NextResponse.json(res.payload)
        response.headers.set(
            "Set-Cookie",
            `sessionToken=${sessionToken.value}; Path=/; HttpOnly; Expires=${newExpiresAt}; SameSite=Strict; Secure`
        )

        return response
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json(error.payload, { status: error.status })
        } else {
            return NextResponse.json({ message: "Unknown error" }, { status: 500 })
        }
    }
}
