import "../App.css";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { getClient } from "../services/client";
import { IncomeProvider } from "../useData";
import Layout from "./Layout";
import { Spinner } from "flowbite-react";

function ClientContainer() {
  const { id } = useParams();

  const fetchData = () => {
    console.log("fetchData");
    return getClient(id)
      .then((data) => data.json())
      .then((data) => {
        setData(data);
        data = { ...data.data, scenarios: data.scenarios };
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [data, setData] = useState<Client | null>(null);

  // const [allInOneData, setAllInOneData] = useState([
  //   {
  //     futureValue: 0,
  //     presentValue: 0,
  //     interestRate: 0,
  //     annualPayment: 0,
  //     timePeriod: 0,
  //     calculatorType: "Future Value",
  //     timing: "End of Year",
  //     compounding: "Annual",
  //   },
  // ]);
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
