/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config"
import { normalizePath } from "@/lib/utils"
import { LoginResType } from "@/schemaValidations/auth.schema"
import { redirect } from "next/navigation"

type CustomOptions = RequestInit & {
    baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
    message: string
    errors: {
        field:string
        message: string
    }[]
}
export class HttpError extends Error {
    status: number
    payload: {
        message: string
        [key:string]: any

    }
  constructor({status,payload}: {status: number, payload: any}) {
    super('HTTP Error')
    this.status = status;
    this.payload = payload
  }
}

export class EntityError extends HttpError {
    status: 422
    payload: EntityErrorPayload
    constructor({status,payload}: {status: number, payload: EntityErrorPayload}) {
        super({status,payload})

        this.status = ENTITY_ERROR_STATUS
        this.payload = payload
    }
}

class SessionToken {
    private token = ''
    get value() {
        return this.token
    }
    set value(token: string) {
        if(typeof window === 'undefined') {
            throw new Error('sessionToken can only be set in the browser')
        }
        this.token = token
    }
}

export const clientSessionToken = new SessionToken()
let clientLogoutRequest: null | Promise<any> = null
const request = async <Response> (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?:CustomOptions|undefined) => {
    const body = options?.body ? JSON.stringify(options.body) : undefined
    const baseHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : '',
    }
    // if base url is undefined, use envConfig.NEXT_PUBLIC_API_ENDPOINT
    const baseUrl = options?.baseUrl === undefined
        ? envConfig.NEXT_PUBLIC_API_ENDPOINT
        : options?.baseUrl

    const fullUrl = url.startsWith('/')?`${baseUrl}${url}`:`${baseUrl}/${url}`
    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        },
        body,
        method,
    })
    const payload:Response = await res.json()
    const data = {
        status: res.status,
        payload
    }
    if(!res.ok) {
        if(res.status === ENTITY_ERROR_STATUS) {
            throw new EntityError (data as{
                status: 422,
                payload: EntityErrorPayload
            })
        } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
        if(typeof window !== 'undefined') {
            if (!clientLogoutRequest) {
                clientLogoutRequest =  fetch('/api/auth/logout', {
                method: 'POST',
                body: JSON.stringify({force: true}),
                headers: {
                    ...baseHeaders
                }
            });
            await clientLogoutRequest
            clientSessionToken.value = ''
            clientLogoutRequest = null
            window.location.href = '/login'
            }
        } else {
            const sessionToken = (options?.headers as any)?.Authorization?.split('Bearer ')[1]
            redirect(`/logout?sessionToken=${sessionToken}`)
            }
    } else {
        throw new HttpError(data);
    }
}
    if (typeof window !== 'undefined') {
        if (['auth/login', '/auth/register'].some((item)=> item === normalizePath(url))) {
            clientSessionToken.value = (payload as LoginResType).data.token
        }
        else if ('auth/logout' === normalizePath(url)) {
            clientSessionToken.value = ''
        }
    }
    return data
}

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions,'body'> |undefined) {
        return request('GET', url, options) as Promise<Response>
    },
    post<Response>(url: string, body: any, options?: Omit<CustomOptions,'body'> |undefined) {
        return request('POST', url, { ...options, body }) as Promise<Response>
    },
    put<Response>(url: string, body: any, options?: Omit<CustomOptions,'body'> |undefined) {
        return request('PUT', url, { ...options, body }) as Promise<Response>
    },
    delete<Response>(url: string,body: any, options?: Omit<CustomOptions,'body'> |undefined) {
        return request('DELETE', url, { ...options, body }) as Promise<Response>
    }
}

export default http