import { Navigation } from "@/components/Navigation";

export default function DashboardPage(){

  const vms= [
    { id: 1, name: "Linux VM", assigned: ["Max", "Anna"] },
    { id: 2, name: "Windows VM", assigned: [] },
  ];

    return (

    <div className="flex flex-row w-screen h-screen bg-background ">
        <Navigation />
        <div className="w-full h-100vh bg-foreground m-20 p-4 rounded-2xl rounded-r-none mr-0">

            <div className="p-8">
              <button className="mb-4 px-4 py-2 bg-secondary text-white rounded">Create new VM</button>
              <ul>
                {vms.map(vm => (
                  <li key={vm.id} className="mb-4 p-4 bg-gray-100 rounded flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{vm.name}</div>
                      <div className="text-sm">Zugewiesen: {vm.assigned.join(", ") || "Niemand"}</div>
                    </div>
                    <div className="flex gap-2">
                        {/** stopped here, onclick events for buttons on dashboard to create and delete*/}
                      <button className="px-3 py-1 bg-background text-white rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

        </div>
    </div>
    
  );
}