import { imageUrlToBase64, printNumber } from "src/utils";
import { useEffect, useState } from "react";
import { PrintClient } from "src/types";
import { calculateAge } from "../Info/PersonInfo";

interface Props {
  client: PrintClient;
}

const Header = ({ color, text }: any) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className="py-2 w-full flex justify-center uppercase text-white font-semibold my-3 text-xl"
    >
      {text}
    </div>
  );
};

const Subtitle = ({ children }: any) => {
  return <div className="font-semibold text-lg my-2 uppercase">{children}</div>;
};

const AssetSummary = ({ client }: Props) => {
  const logoUrl = client?.userdata?.logo
    ? `${import.meta.env.VITE_API_URL}logo?logo=${client?.userdata?.logo}`
    : `${import.meta.env.VITE_APP_URL}/logo.png`;
  const [logoData, setLogoData] = useState(null as any);

  const getPerson = (person: number) => {
    return client.people.find((p) => p.id === person)?.name;
  };
  useEffect(() => {
    imageUrlToBase64(logoUrl).then((data) => {
      setLogoData(data);
    });
  }, [logoUrl]);
  return (
    <div className="p-10 text-sm">
      <div className="flex justify-end">
        <img
          src={`${logoData}`}
          alt="logo"
          style={{
            height: "50px",
            width: "auto",
            maxHeight: "50px",
            objectFit: "contain",
          }}
        />
      </div>
      <Header text="Asset Summary" color="#1c3664" />
      <div className="flex mt-2">
        <table className="w-full">
          <tr>
            <td className="font-bold">Date Prepared</td>
            <td>{new Date().toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="font-bold">Household Name</td>
            <td>{client.title}</td>
          </tr>
        </table>
        <table className="w-full">
          <tr>
            <td className="font-bold">First name</td>
            {client.people.map((person) => (
              <td className="text-center">{person.name}</td>
            ))}
          </tr>
          <tr>
            <td className="font-bold">Birthdate</td>
            {client.people.map((person) => (
              <td className="text-center">
                {new Date(person.birthday).toLocaleDateString()}
              </td>
            ))}
          </tr>
          <tr>
            <td className="font-bold">Current Age</td>
            {client.people.map((person) => (
              <td className="text-center">
                {calculateAge(new Date(person.birthday))}
              </td>
            ))}
          </tr>
        </table>
      </div>

      <Header text="Income/Cash" color="#1c3664" />
      <Subtitle>Income</Subtitle>
      <table className="text-center w-[600px] border-collapse">
        <thead>
          <th className="border border-slate-600">Employer</th>
          <th className="border border-slate-600">Owner</th>
          <th className="border border-slate-600">Position</th>
          <th className="border border-slate-600">Annual Income</th>
        </thead>
        {client.assetSummary.income.map((income) => (
          <tr>
            <td className="border border-slate-600">{income.employer}</td>
            <td className="border border-slate-600">
              {getPerson(income.owner)}
            </td>
            <td className="border border-slate-600">{income.position}</td>
            <td className="border border-slate-600">
              {printNumber(income.annualAmount)}
            </td>
          </tr>
        ))}
        <tr>
          <td className="">{}</td>
          <td className="">{}</td>
          <td className="border border-slate-600 font-bold">Total</td>

          <td className="border border-slate-600 font-bold">
            {printNumber(
              client.assetSummary.income
                .map((i) => i.annualAmount)
                .reduce((a, b) => a + b, 0),
            )}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default AssetSummary;
