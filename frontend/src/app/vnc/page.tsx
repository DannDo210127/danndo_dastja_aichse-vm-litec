export default function VncPage() {
  return (
    <div className="flex flex-col bg-black w-full min-h-screen">
      <iframe className="w-full h-dvh"
        src="/novnc/vnc.html?host=localhost&port=3001&path=websockify&autoconnect=true"
        title="VNC Viewer"
      />
    </div>
  );
}
