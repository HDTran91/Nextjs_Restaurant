// import Card from "@/app/card/card";
// import Header from "@/app/header";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Image from "next/image";

import ButtonRedirect from "@/app/components/ButtonRedirect";
import Link from "next/link";
import {redirect} from "next/navigation";

const isAuth = false
export default function Home() {
  if(!isAuth) {
    redirect('/login')
  }
  return (
   <main>
    <ul>
      <li>
        <Link href={'/login'}> Login</Link>
      </li>
      <li>
        <Link href={'/register'}> Register</Link>
      </li>
    </ul>
    <ButtonRedirect />
   </main>
  );
}
