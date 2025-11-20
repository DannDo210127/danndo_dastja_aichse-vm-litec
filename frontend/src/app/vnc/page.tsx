export default function VncPage() {
  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      <iframe className="w-full h-dvh"
        src="/novnc/vnc.html?host=127.0.0.1&port=6080&autoconnect=true"
        title="VNC Viewer"
      />
    </div>
  );
}
