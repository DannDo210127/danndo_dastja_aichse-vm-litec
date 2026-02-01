'use client';

import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export default function VncPage() {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const ip = searchParams.get('ip');
  const port = searchParams.get('port') ?? '6080';

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
