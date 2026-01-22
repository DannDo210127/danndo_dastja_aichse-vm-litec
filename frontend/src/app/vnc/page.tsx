export default function VncPage() {
  return (
    <div className="flex flex-col bg-black w-full min-h-screen">
      <iframe className="w-full h-dvh"
        src="/novnc/vnc.html?host=192.168.61.129&port=6080&path=websockify&autoconnect=true"
        title="VNC Viewer"
      />
    </div>
  );
}
