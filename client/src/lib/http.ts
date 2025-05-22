/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config"
import { LoginResType } from "@/schemaValidations/auth.schema"

type CustomOptions = RequestInit & {
    baseUrl?: string | undefined
}

class HttpError extends Error {
    status: number
    payload: any
  constructor({status,payload}: {status: number, payload: any}) {
    super('HTTP Error')
    this.status = status;
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
        throw new HttpError(data)
    }
    if (['/auth/login', '/auth/register'].includes(url)) {
        clientSessionToken.value = (payload as LoginResType).data.token}
    else if ('/auth/logout'.includes(url)) {
            clientSessionToken.value = ''
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