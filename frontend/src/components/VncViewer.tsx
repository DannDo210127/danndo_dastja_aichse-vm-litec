"use client";
import { useEffect, useRef } from "react";

export default function VncViewer({ url = "wss://localhost:6080/websockify", password = "debian" }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rfb: any;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/novnc/noVNC@v1.5.0/app/vnc.js"; 
    script.onload = () => {
      const RFB = (window as any).RFB; // global RFB constructor

    // stopped here, problem with div size and rendering of the vnc screen

      if (containerRef.current) {
        rfb = new RFB(containerRef.current, url, {
          credentials: { password },
        });
        rfb.scaleViewport = true;
        rfb.resizeSession = true;
      }
    };
    document.body.appendChild(script);

    return () => {
      if (rfb) rfb.disconnect();
      document.body.removeChild(script);
    };
  }, [url, password]);

  return <div ref={containerRef} className="w-full h-screen bg-white" />;
}
