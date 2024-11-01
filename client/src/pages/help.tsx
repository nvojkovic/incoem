import Layout from "../components/Layout";
import { helpUrl } from "../services/client";

const HelpCenter = () => {
  return (
    <Layout page="settings">
      <h1 className="font-bold text-3xl ml-10">Help Center</h1>
      <div className="w-full">
        <iframe
          src={helpUrl}
          className="w-full"
          style={{ height: "calc(100vh - 100px)" }}
        ></iframe>
      </div>
    </Layout>
  );
};

export default HelpCenter;
