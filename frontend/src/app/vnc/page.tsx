'use client';
import { useEffect, useRef, useState } from 'react';
//@ts-ignore allowing import of a non-TS module
import RFB from 'novnc-next';

export default function VncPage() {
  const containerRef = useRef(null);
  const rfb = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const websocketUrl = 'ws://127.0.0.1:6080/'; // adjust if needed

    try {
      rfb.current = new RFB(containerRef.current, websocketUrl, {
        credentials: { username: 'user', password: 'userpassword' },
        enableWebRTC: false,
        viewOnly: false,
      });

      // Automatically scale to fit container
      rfb.current.scaleViewport = true;
      rfb.current.resizeSession = true;

      // Connection event listeners
      rfb.current.addEventListener('connect', () => {
        console.log('VNC connected');
        setConnected(true);
      });

      rfb.current.addEventListener('disconnect', (detail) => {
        console.log('VNC disconnected:', detail);
        setConnected(false);
      });

      rfb.current.addEventListener('credentialsrequired', () => {
        const password = prompt('Password Required:');
        const username = prompt('Username Required:');
        rfb.current.sendCredentials({ username, password });
      });

      // Handle window resize to keep canvas scaled
      const handleResize = () => {
        if (rfb.current) rfb.current.scaleViewport = true;
      };
      window.addEventListener('resize', handleResize);

      // Cleanup on unmount
      return () => {
        if (rfb.current) {
          rfb.current.disconnect();
          rfb.current = null;
        }
        window.removeEventListener('resize', handleResize);
      };
    } catch (err) {
      console.error('Unable to create RFB client', err);
    }
  }, []);

  return (
    <div className='w-full h-full overflow-hidden'>
      <div
        ref={containerRef}
        className='w-full h-full bg-foreground'
      />
      {!connected && (
        <div
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-[1.2rem]'
        >
          Connecting to VNC...
        </div>
      )}
    </div>
  );
}
