'use client';
import { useEffect, useRef, useState } from 'react';
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
        preferredEncoding: 'tight' // force Tight encoding
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
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
        }}
      />
      {!connected && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: '1.2rem',
          }}
        >
          Connecting to VNC...
        </div>
      )}
    </div>
  );
}
