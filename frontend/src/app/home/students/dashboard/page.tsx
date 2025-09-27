import { Navigation } from "@/components/Navigation";

export default function Dashboard(){
    return (

    <div className="flex flex-row w-screen h-screen bg-background ">
      {/** stopped here, next: make side full height, in some way parent component is not heigh enough */}
        <Navigation />
        <div className="w-full h-100vh bg-foreground m-20 p-4 rounded-2xl rounded-r-none mr-0"></div>
    </div>
    
  );
}