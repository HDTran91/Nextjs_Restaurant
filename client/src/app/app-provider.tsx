/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { clientSessionToken } from '@/lib/http';
import { AccountResType } from '@/schemaValidations/account.schema';
import { create } from 'domain';
import { createContext, useContext, useState} from 'react';

export type User = AccountResType['payload']['data']

const AppContext = createContext<{
    user: User | null
    setUser: (user: User | null) => void
}>({
    user: null,
    setUser: () => {}
})

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context
}
export default function AppProvider({
    children,
    initialSessionToken = '',
    user: useProp

}: {
    children: React.ReactNode,
    initialSessionToken: string
    user: User | null
}) {
    const [user,setUser] = useState<User | null>(useProp);
    useState(() => {

        if(!(typeof window === 'undefined')) {
        clientSessionToken.value = initialSessionToken
        }
    })
    return <AppContext.Provider value= {{
        user,
        setUser
    }} >{children}</AppContext.Provider>
}