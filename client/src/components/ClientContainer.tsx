import "../App.css";
import { Outlet, useLoaderData } from "react-router-dom";
import { IncomeProvider } from "../useData";
import Layout from "./Layout";
import Spinner from "./Spinner";

function ClientContainer() {
  // const { id } = useParams();

  // const fetchData = () => {
  //   console.log("fetchData");
  //   return getClient(id)
  //     .then((data) => data.json())
  //     .then((data) => {
  //       setData(data);
  //       data = { ...data.data, scenarios: data.scenarios };
  //     });
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  const data = useLoaderData() as any;

  // const [data, setData] = useState<Client | null>(null);

  if (!data)
    return (
      <Layout page="">
        <Spinner />
      </Layout>
    );

  return (
    <IncomeProvider initialData={data}>
      <Outlet />
    </IncomeProvider>
  );
}

export default ClientContainer;
