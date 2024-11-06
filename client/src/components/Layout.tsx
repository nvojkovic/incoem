import { useEffect, useState } from "react";
import { useInfo } from "../useData";
import Navbar from "./Navbar";

const Layout = ({
  page,
  children,
}: {
  children: React.ReactNode;
  page: string;
}) => {
  const { data } = useInfo();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Function to update fullscreen state
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    // Add event listeners for all browser variants
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Cleanup function
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);
  return (
    <div>
      <div className="sticky top-0 bg-white mb-6 z-[500] shadow-md">
        {!isFullscreen && <Navbar active={page} client={data} />}
      </div>
      <div className="max-w-[1480px] m-auto mb-32">
        <div className="mt-6 max-w-[1480px] m-auto mb-32 px-10">{children}</div>
      </div>
      {import.meta.env.VITE_ENV === "staging" && (
        <div className="fixed bottom-0 w-screen bg-red-500 h-10 text-white text-center flex items-center justify-center font-bold z-[10000]">
          DEVELOPMENT SERVER
        </div>
      )}
    </div>
  );
};

export default Layout;
