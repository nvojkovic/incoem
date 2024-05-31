import Layout from "../components/Layout";

const HelpCenter = () => {
  return (
    <Layout page="settings" onTabChange={() => {}}>
      <h1 className="font-bold text-3xl ml-10">Help Center</h1>
      <div className="w-full">
        <iframe
          src="https://docs.google.com/document/d/e/2PACX-1vQKx3NLcbxCbgR3gfUpuMxNQDIc_KEJJ8ramQ358KvOIUMh0BXlpWzWkq8RVhSjPL0X_5dVOrWsZ0oh/pub?embedded=true"
          className="w-full"
          style={{ height: "calc(100vh - 100px)" }}
        ></iframe>
      </div>
    </Layout>
  );
};

export default HelpCenter;
