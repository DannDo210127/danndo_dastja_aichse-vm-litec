import { Navigation } from "@/components/Navigation";

export default function HomePage() {
  return (

    <div className="flex flex-row w-full h-screen bg-background ">
      {/** stopped here, next: make side full height, in some way parent component is not heigh enough */}
        <Navigation />
        <div className="w-full h-100vh  m-10 p-4 rounded-2xl"></div>
    </div>
    
  );
}