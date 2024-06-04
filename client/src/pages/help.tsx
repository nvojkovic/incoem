import Layout from "../components/Layout";

const HelpCenter = () => {
  return (
    <Layout page="settings" onTabChange={() => { }}>
      <h1 className="font-bold text-3xl ml-10">Help Center</h1>
      <div className="w-full">
        <iframe
          src="https://docs.google.com/document/d/e/2PACX-1vTFKe6zajevHL1gSpflZDJ1aYSwbYSVUbgYRXVErnzRvf3z2-2XoVpISBAT2EHiTOHyGDOI99DI8gPB/pub?embedded=true"
          className="w-full"
          style={{ height: "calc(100vh - 100px)" }}
        ></iframe>
      </div>
    </Layout>
  );
};

export default HelpCenter;
