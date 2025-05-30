import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme.provider";
import { Inter} from "next/font/google";
import Header from "@/components/header";
import { Toaster } from 'sonner'
import AppProvider from "@/app/app-provider";
import { cookies } from "next/headers";
import SlideSession from "@/components/slide-session";


const inter = Inter({ subsets: ["vietnamese"]});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  // console.log('RootLayout:', cookieStore.get('sessionToken'))
  const sessionToken = cookieStore.get('sessionToken')?.value || ''
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

            <Header />
            <AppProvider initialSessionToken= {sessionToken}>
                {children}
                <SlideSession />
            </AppProvider>


          </ThemeProvider>
      </body>
    </html>
  );
}
