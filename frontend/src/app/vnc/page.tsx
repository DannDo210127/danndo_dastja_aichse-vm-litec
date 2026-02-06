'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingScreen } from '@/shared/LoadingScreen';

function VncContent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const searchParams = useSearchParams();
  const ip = searchParams.get('ip');
  const port = searchParams.get('port') ?? '6080';

  if (!ip) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
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
    <Suspense fallback={<LoadingScreen className="bg-black w-full h-dvh" />}>
      <VncContent />
    </Suspense>
  );
}
