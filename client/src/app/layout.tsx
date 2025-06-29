import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme.provider";
import { Inter} from "next/font/google";
import Header from "@/components/header";
import { Toaster } from 'sonner'
import { cookies } from "next/headers";
import SlideSession from "@/components/slide-session";
import accountApiRequest from "@/apiRequest/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import AppProvider from "@/app/app-provider";
import { baseOpenGraph } from "@/app/share-metadata";



const inter = Inter({ subsets: ["vietnamese"]});

export const metadata: Metadata = {
  title: {
    default: "Gacondev Shopping Website",
    template: "%s | Productic",
  },
  description: "Generated by Gacondev",
  openGraph: baseOpenGraph
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''
  let user: AccountResType['payload']['data'] = { name: '', id: 0, email: '' }
     if(sessionToken) {
        const data = await accountApiRequest.me(sessionToken)
        console.log('data', data)
        user = data.payload.data

     }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Toaster />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >


            <AppProvider initialSessionToken= {sessionToken} user={user}>
                <Header user = {user}/>
                {children}
                <SlideSession />
            </AppProvider>


          </ThemeProvider>
      </body>
    </html>
  );
}
