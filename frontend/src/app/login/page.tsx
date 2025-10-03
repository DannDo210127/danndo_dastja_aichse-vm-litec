'use client'
import Image from "next/image";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";


export default function LoginPage() {

  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background ">
        <div className="bg-foreground flex-col justify-center items-center w-1/2 rounded-md">
          
          <Button onClick={() => router.push('../home/teachers')}>LogIn Teacher</Button>
        </div>
        <div className="bg-foreground flex-col justify-center items-center w-1/2 rounded-md mt-10">

          <Button  onClick={() => router.push('../home/students')}>LogIn Student</Button>
        </div>


    </div>
  );
}
