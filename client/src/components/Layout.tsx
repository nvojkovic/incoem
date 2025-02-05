import { useInfo } from "src/hooks/useData";
import Navbar from "./Navbar";
import { useFullscreen } from "src/hooks/useFullScreen";
import config from "src/services/config";

const Layout = ({
  page,
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
  page: string;
}) => {
  const { data } = useInfo();
  const { isFullscreen } = useFullscreen();

  return (
    <div>
      <div className="sticky top-0 bg-white mb-6 z-[500] shadow-md">
        {!isFullscreen && <Navbar active={page} client={data} />}
      </div>
      <div className={`pt-6 ${!wide && "max-w-[1480px]"} m-auto mb-16 px-10`}>
        {children}
      </div>
      {config.ENV === "staging" && (
        <div className="fixed bottom-0 w-screen bg-red-500 h-10 text-white text-center flex items-center justify-center font-bold z-[10000]">
          DEVELOPMENT SERVER
        </div>
      )}
    </div>
  );
};

export default Layout;
