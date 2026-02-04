"use client";

export const dynamic = "force-dynamic";

import { Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";

function VncContent() {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const ip = searchParams.get("ip");
  const port = searchParams.get("port") ?? "6080";

  if (!ip) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Missing IP parameter
      </div>
    );
  }

  const src = `/novnc/vnc.html?host=${ip}&port=${port}&resize=scale&reconnect=true&autoconnect=true&password=Jako2503`;

  return (
    <div className="flex flex-col bg-black w-full min-h-screen">
      <iframe
        ref={iframeRef}
        className="w-full h-dvh"
        src={src}
        title="VNC Viewer"
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-white">
          Loading VNC…
        </div>
      }
    >
      <VncContent />
    </Suspense>
  );
}