import StandardModal from "@/shared/StandardModal";
import { useState, useEffect } from "react";
import { StandardButton } from "@/shared/StandardButton";
import { useQuery } from "@tanstack/react-query";
import { getAllImages } from "@/api/machines";
import { DialogBackdrop } from "@headlessui/react";

interface DeveloperModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabDescriptor = {
    id: number;
    title: string;
    content: React.ReactNode;
};

function Tabs({ children }: { children: React.ReactNode }) {
    const initial = [] as TabDescriptor[];
    const parsed = [] as TabDescriptor[];
    const childArray = Array.isArray(children) ? children : [children];
    let nextId = 1;
    for (const ch of childArray) {
        // try to read props.title and children from a React element
        const el = ch as any;
        const title = el?.props?.title ?? `Tab ${nextId}`;
        const content = el?.props?.children ?? null;
        parsed.push({ id: nextId, title, content });
        nextId++;
    }

    // tabs are provided statically via children (developer-defined)
    const [tabs] = useState<TabDescriptor[]>(() =>
        parsed.length ? parsed : initial,
    );
    const [active, setActive] = useState<number>(tabs.length ? tabs[0].id : -1);

    useEffect(() => {
        if (tabs.length && !tabs.find((t) => t.id === active)) {
            setActive(tabs[0].id);
        }
    }, [tabs, active]);

    return (
        <div className="w-full mt-4">
            <div className="flex items-center gap-2 ">
                <div className="flex-1 flex flex-wrap gap-1">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`flex items-center ${tab.id === active ? "border-1 border-foreground rounded-br-0 rounded-bl-0 rounded-tl-md rounded-tr-md bg-foreground" : "cursor-pointer"}`}
                        >
                            <p className="m-2">{tab.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full h-0.5 bg-foreground"></div>

            <div className="w-full rounded bg-white p-3 min-h-[120px] mt-2">
                {tabs.map((t) => (
                    <div
                        key={t.id}
                        style={{ display: t.id === active ? "block" : "none" }}
                    >
                        {t.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Tab({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return <>{children}</>;
}

const IncusAPITab = () => {
    const images = useQuery({
        queryKey: ["images"],
        queryFn: () => getAllImages(),
    });
    return (
        <div>
            <h2>All Images available</h2>
            <div>
                {images.data?.map((image: String) => (
                    <p>{image}</p>
                ))}
            </div>
            <br />
        </div>
    );
};

const LoginDebugTab = () => {
    return <div>Login Debug</div>;
};

export function DeveloperModal({ isOpen, onClose }: DeveloperModalProps) {
    return (
        <StandardModal
            className="flex flex-col w-1/2 md:1/3"
            title={"Developer Settings"}
            description={"Used for Debugging purposes"}
            isOpen={isOpen}
        >
            <Tabs>
                <Tab title="Incus API">
                    <IncusAPITab />
                </Tab>
                <Tab title="Login State">
                    <LoginDebugTab />
                </Tab>
            </Tabs>
            <div className="border-t-1 border-foreground flex justify-end">
                <StandardButton
                    label="Close"
                    onClick={onClose}
                    className="bg-lightforeground mt-4 px-6 py-3"
                />
            </div>
        </StandardModal>
    );
}
