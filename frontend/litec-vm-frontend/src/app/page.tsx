'use client'
import Image from "next/image";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 color-background">
        <div className="color-foreground flex-col justify-center items-center w-1/2">
          
          <Button onClick={() => router.push('/connection')}>LogIn</Button>
        </div>
    </div>
  );
}
