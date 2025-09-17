import Sidebar from "@/components/sidebar/index";

export default function Connection() {
  return (

    <div className="flex flex-col w-full max-h-screen color-background ">
        <Sidebar /> // stopped here, next: make side full height, in some way parent component is not heigh enough
    </div>
    
  );
}