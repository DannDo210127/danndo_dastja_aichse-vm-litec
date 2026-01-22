'use client';

import { useRef } from 'react';

export default function VncPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  return (
    <div className="flex flex-col bg-black w-full min-h-screen">
      <iframe 
        ref={iframeRef}
        className="w-full h-dvh"
        src="/novnc/vnc.html?host=192.168.61.129&port=6080&resize=scale&reconnect=true&autoconnect=true"
        title="VNC Viewer"
      />
    </div>
  );
}
