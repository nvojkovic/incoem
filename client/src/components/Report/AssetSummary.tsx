import { imageUrlToBase64, printNumber, splitDate } from "src/utils";
import { NRA } from "src/calculator/utils";
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

  const assetSummary = client.assetSummary;
  return (
    <div className="text-sm px-24">
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
        <table className="w-full h-[40px]">
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

      {(assetSummary.income.length > 0 ||
        assetSummary.cashAssets.length > 0) && (
          <Header text="Income/Cash" color="#1c3664" />
        )}
      {assetSummary.income.length > 0 && (
        <>
          <div>
            <Subtitle>Income</Subtitle>
            <table className="text-center w-[520px] border-collapse">
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
        </>
      )}
      {client.assetSummary.cashAssets.length > 0 && (
        <div>
          <Subtitle>Cash Assets</Subtitle>
          <table className="text-center w-[750px] border-collapse">
            <thead>
              <th className="border border-slate-600">Bank</th>
              <th className="border border-slate-600">Account #</th>
              <th className="border border-slate-600">Owner</th>
              <th className="border border-slate-600">Type</th>
              <th className="border border-slate-600">Interest Rate</th>
              <th className="border border-slate-600">Balance</th>
            </thead>
            {client.assetSummary.cashAssets.map((asset) => (
              <tr>
                <td className="border border-slate-600">{asset.bank}</td>
                <td className="border border-slate-600">
                  {asset.accountNumber}
                </td>
                <td className="border border-slate-600">
                  {getPerson(asset.owner)}
                </td>
                <td className="border border-slate-600">{asset.type}</td>
                <td className="border border-slate-600">
                  {asset.interestRate !== undefined && `${asset.interestRate}%`}
                </td>
                <td className="border border-slate-600">
                  {printNumber(asset.balance)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="">{}</td>
              <td className="">{}</td>
              <td className="">{}</td>
              <td className="">{}</td>
              <td className="border border-slate-600 font-bold">Total</td>
              <td className="border border-slate-600 font-bold">
                {printNumber(
                  client.assetSummary.cashAssets
                    .map((a) => a.balance || 0)
                    .reduce((a, b) => a + b, 0),
                )}
              </td>
            </tr>
          </table>
        </div>
      )}

      {assetSummary.lifeInsurance.length > 0 ||
        assetSummary.longTermCare.length > 0 ||
        assetSummary.accumulationAnnuity.length > 0 ||
        assetSummary.personalPensionAnnuity.length > 0 ||
        assetSummary.pension.length > 0 ? (
        <Header text="Contractual Wealth" color="#00b050" />
      ) : null}
      <div className="">
        <div>
          {assetSummary.lifeInsurance.length > 0 && (
            <>
              <Subtitle>Life Insurance</Subtitle>
              <table className="text-center w-[600px] border-collapse">
                <thead>
                  <th className="border border-slate-600">Company</th>
                  <th className="border border-slate-600">Policy #</th>
                  <th className="border border-slate-600">Insured</th>
                  <th className="border border-slate-600">Type</th>
                  <th className="border border-slate-600">Annual Premium</th>
                  <th className="border border-slate-600">Cash Value</th>
                  <th className="border border-slate-600">Death Benefit</th>
                </thead>
                {client.assetSummary.lifeInsurance.map((insurance) => (
                  <tr>
                    <td className="border border-slate-600">
                      {insurance.company}
                    </td>
                    <td className="border border-slate-600">
                      {insurance.policyNumber}
                    </td>
                    <td className="border border-slate-600">
                      {getPerson(insurance.insured)}
                    </td>
                    <td className="border border-slate-600">
                      {insurance.type}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(insurance.annualPremium)}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(insurance.cashValue)}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(insurance.deathBenefit)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className=""></td>
                  <td className=""></td>
                  <td className=""></td>
                  <td className="border border-slate-600 font-bold">Total</td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.lifeInsurance.reduce(
                        (sum, i) => sum + (i.annualPremium || 0),
                        0,
                      ),
                    )}
                  </td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.lifeInsurance.reduce(
                        (sum, i) => sum + (i.cashValue || 0),
                        0,
                      ),
                    )}
                  </td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.lifeInsurance.reduce(
                        (sum, i) => sum + (i.deathBenefit || 0),
                        0,
                      ),
                    )}
                  </td>
                </tr>
              </table>
            </>
          )}

          {assetSummary.longTermCare.length > 0 && (
            <>
              <Subtitle>Long Term Care</Subtitle>
              <table className="text-center w-[800px] border-collapse">
                <thead>
                  <th className="border border-slate-600">Company</th>
                  <th className="border border-slate-600">Policy #</th>
                  <th className="border border-slate-600">Insured</th>
                  <th className="border border-slate-600">
                    Elimination Period
                  </th>
                  <th className="border border-slate-600">COLA</th>
                  <th className="border border-slate-600">Annual Premium</th>
                  <th className="border border-slate-600">Monthly Benefit</th>
                </thead>
                {client.assetSummary.longTermCare.map((care) => (
                  <tr>
                    <td className="border border-slate-600">{care.company}</td>
                    <td className="border border-slate-600">
                      {care.policyNumber}
                    </td>
                    <td className="border border-slate-600">
                      {getPerson(care.insured)}
                    </td>
                    <td className="border border-slate-600">
                      {care.eliminationPeriod}
                    </td>
                    <td className="border border-slate-600">{care.COLA}%</td>
                    <td className="border border-slate-600">
                      {printNumber(care.annualPremium)}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(care.monthlyBenefit)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className=""></td>
                  <td className=""></td>
                  <td className=""></td>
                  <td className=""></td>
                  <td className="border border-slate-600 font-bold">Total</td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.longTermCare.reduce(
                        (sum, i) => sum + (i.annualPremium || 0),
                        0,
                      ),
                    )}
                  </td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.longTermCare.reduce(
                        (sum, i) => sum + (i.monthlyBenefit || 0),
                        0,
                      ),
                    )}
                  </td>
                </tr>
              </table>
            </>
          )}

          {assetSummary.accumulationAnnuity.length > 0 && (
            <>
              <Subtitle>Accumulation Annuity</Subtitle>
              <table className="text-center w-[800px] border-collapse">
                <thead>
                  <th className="border border-slate-600">Company</th>
                  <th className="border border-slate-600">Policy #</th>
                  <th className="border border-slate-600">Owner</th>
                  <th className="border border-slate-600">Tax Status</th>
                  <th className="border border-slate-600">Type</th>
                  <th className="border border-slate-600">Account Value</th>
                </thead>
                {client.assetSummary.accumulationAnnuity.map((annuity) => (
                  <tr>
                    <td className="border border-slate-600">
                      {annuity.company}
                    </td>
                    <td className="border border-slate-600">
                      {annuity.policyNumber}
                    </td>
                    <td className="border border-slate-600">
                      {getPerson(annuity.owner)}
                    </td>
                    <td className="border border-slate-600">
                      {annuity.taxStatus}
                    </td>
                    <td className="border border-slate-600">{annuity.type}</td>
                    <td className="border border-slate-600">
                      {printNumber(annuity.accountValue)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className=""></td>
                  <td className=""></td>
                  <td className=""></td>
                  <td className=""></td>
                  <td className="border border-slate-600 font-bold">Total</td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.accumulationAnnuity.reduce(
                        (sum, i) => sum + (i.accountValue || 0),
                        0,
                      ),
                    )}
                  </td>
                </tr>
              </table>
            </>
          )}
        </div>
        <div>
          {assetSummary.personalPensionAnnuity.length > 0 && (
            <>
              <Subtitle>Personal Pension Annuity</Subtitle>

              <table className="text-center w-[800px] border-collapse">
                <thead>
                  <th className="border border-slate-600">Company</th>
                  <th className="border border-slate-600">Policy #</th>
                  <th className="border border-slate-600">Owner</th>
                  <th className="border border-slate-600">Tax Status</th>
                  <th className="border border-slate-600">Effective Date</th>
                  <th className="border border-slate-600">Annual Income</th>
                  <th className="border border-slate-600">Account Value</th>
                </thead>
                {client.assetSummary.personalPensionAnnuity.map((annuity) => (
                  <tr>
                    <td className="border border-slate-600">
                      {annuity.company}
                    </td>
                    <td className="border border-slate-600">
                      {annuity.policyNumber}
                    </td>
                    <td className="border border-slate-600">
                      {getPerson(annuity.owner)}
                    </td>
                    <td className="border border-slate-600">
                      {annuity.taxStatus}
                    </td>
                    <td className="border border-slate-600">
                      {new Date(annuity.effectiveDate).toLocaleDateString()}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(annuity.annualIncome)}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(annuity.accountValue)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className=""></td>
                  <td className=""></td>
                  <td className=""></td>
                  <td className=""></td>
                  <td className="border border-slate-600 font-bold">Total</td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.personalPensionAnnuity.reduce(
                        (sum, i) => sum + (i.annualIncome || 0),
                        0,
                      ),
                    )}
                  </td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.personalPensionAnnuity.reduce(
                        (sum, i) => sum + (i.accountValue || 0),
                        0,
                      ),
                    )}
                  </td>
                </tr>
              </table>
            </>
          )}

          {assetSummary.pension.length > 0 && (
            <>
              <Subtitle>Pension</Subtitle>
              <table className="text-center w-[800px] border-collapse">
                <thead>
                  <th className="border border-slate-600">Company</th>
                  <th className="border border-slate-600">Account #</th>
                  <th className="border border-slate-600">Owner</th>
                  <th className="border border-slate-600">Monthly Income</th>
                  <th className="border border-slate-600">Annual Income</th>
                </thead>
                {client.assetSummary.pension.map((pension) => (
                  <tr>
                    <td className="border border-slate-600">
                      {pension.company}
                    </td>
                    <td className="border border-slate-600">
                      {pension.accountNumber}
                    </td>
                    <td className="border border-slate-600">
                      {getPerson(pension.owner)}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(pension.monthlyIncome)}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber((pension.monthlyIncome || 0) * 12)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className=""></td>
                  <td className=""></td>
                  <td className="border border-slate-600 font-bold">Total</td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.pension.reduce(
                        (sum, i) => sum + (i.monthlyIncome || 0),
                        0,
                      ),
                    )}
                  </td>
                  <td className="border border-slate-600 font-bold">
                    {printNumber(
                      client.assetSummary.pension.reduce(
                        (sum, i) => sum + (i.monthlyIncome || 0) * 12,
                        0,
                      ),
                    )}
                  </td>
                </tr>
              </table>
            </>
          )}
        </div>
      </div>
      <div className="break-inside-avoid-page">
        <Header text="Social Insurance" color="#4471c4" />
        <Subtitle>Social Security</Subtitle>
        <table className="text-center w-[800px] border-collapse">
          <thead>
            <th className="border border-slate-600">Name</th>
            <th className="border border-slate-600">Full Retirement Age</th>
            <th className="border border-slate-600">Full Retirement Date</th>
            <th className="border border-slate-600">Monthly Income</th>
            <th className="border border-slate-600">Annual Income</th>
          </thead>
          {client.assetSummary.socialInsurance.map((insurance) => {
            const person = client.people.find((p) => p.id === insurance.owner);
            if (!person) return null;
            const { year: birthYear } = splitDate(person?.birthday || "");
            const [retirementYear, retirementMonth] = NRA(birthYear);
            const birthday = new Date(person?.birthday || "");
            birthday.setMonth(birthday.getMonth() + retirementMonth);
            birthday.setFullYear(birthday.getFullYear() + retirementYear);

            return (
              <tr>
                <td className="border border-slate-600">
                  {getPerson(insurance.owner)}
                </td>
                <td className="border border-slate-600">{`${retirementYear} years ${retirementMonth} months`}</td>
                <td className="border border-slate-600">
                  {birthday.toLocaleDateString()}
                </td>
                <td className="border border-slate-600">
                  {printNumber(insurance.monthlyAmount)}
                </td>
                <td className="border border-slate-600">
                  {printNumber(insurance.monthlyAmount * 12)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="">{}</td>
            <td className="">{}</td>
            <td className="border border-slate-600 font-bold">Total</td>
            <td className="border border-slate-600 font-bold">
              {printNumber(
                client.assetSummary.socialInsurance
                  .map((i) => i.monthlyAmount)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
            <td className="border border-slate-600 font-bold">
              {printNumber(
                client.assetSummary.socialInsurance
                  .map((i) => i.monthlyAmount * 12)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
          </tr>
        </table>
      </div>

      <div className="break-inside-avoid-page">
        {assetSummary.statementWealth.length > 0 && (
          <Header text="Statement Wealth" color="#c00000" />
        )}
        {assetSummary.statementWealth.filter((w) => w.qualified).length > 0 && (
          <div className="break-inside-avoid-page">
            <Subtitle>Qualified </Subtitle>
            <table className="text-center w-[800px] border-collapse">
              <thead>
                <th className="border border-slate-600">Company</th>
                <th className="border border-slate-600">Account #</th>
                <th className="border border-slate-600">Owner</th>
                <th className="border border-slate-600">Type</th>
                <th className="border border-slate-600">Managed</th>
                <th className="border border-slate-600">Annual Contribution</th>
                <th className="border border-slate-600">Market Value</th>
              </thead>
              {client.assetSummary.statementWealth
                .filter((wealth) => wealth.qualified)
                .map((wealth) => (
                  <tr>
                    <td className="border border-slate-600">
                      {wealth.company}
                    </td>
                    <td className="border border-slate-600">
                      {wealth.accountNumber}
                    </td>
                    <td className="border border-slate-600">
                      {getPerson(wealth.owner)}
                    </td>
                    <td className="border border-slate-600">{wealth.type}</td>
                    <td className="border border-slate-600">
                      {wealth.managed ? "Yes" : "No"}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(wealth.annualContribution)}
                    </td>
                    <td className="border border-slate-600">
                      {printNumber(wealth.marketValue)}
                    </td>
                  </tr>
                ))}
              <tr>
                <td className=""></td>
                <td className=""></td>
                <td className=""></td>
                <td className=""></td>
                <td className="border border-slate-600 font-bold">Total</td>
                <td className="border border-slate-600 font-bold">
                  {printNumber(
                    client.assetSummary.statementWealth
                      .filter((w) => w.qualified)
                      .reduce((sum, w) => sum + (w.annualContribution || 0), 0),
                  )}
                </td>
                <td className="border border-slate-600 font-bold">
                  {printNumber(
                    client.assetSummary.statementWealth
                      .filter((w) => w.qualified)
                      .reduce((sum, w) => sum + (w.marketValue || 0), 0),
                  )}
                </td>
              </tr>
            </table>
          </div>
        )}
      </div>
      {assetSummary.statementWealth.filter((w) => !w.qualified).length > 0 && (
        <div className="break-inside-avoid-page">
          <Subtitle>Non-Qualified </Subtitle>
          <table className="text-center w-[800px] border-collapse">
            <thead>
              <th className="border border-slate-600">Company</th>
              <th className="border border-slate-600">Account #</th>
              <th className="border border-slate-600">Owner</th>
              <th className="border border-slate-600">Type</th>
              <th className="border border-slate-600">Managed</th>
              <th className="border border-slate-600">Annual Contribution</th>
              <th className="border border-slate-600">Market Value</th>
            </thead>
            {client.assetSummary.statementWealth
              .filter((wealth) => !wealth.qualified)
              .map((wealth) => (
                <tr>
                  <td className="border border-slate-600">{wealth.company}</td>
                  <td className="border border-slate-600">
                    {wealth.accountNumber}
                  </td>
                  <td className="border border-slate-600">
                    {getPerson(wealth.owner)}
                  </td>
                  <td className="border border-slate-600">{wealth.type}</td>
                  <td className="border border-slate-600">
                    {wealth.managed ? "Yes" : "No"}
                  </td>
                  <td className="border border-slate-600">
                    {printNumber(wealth.annualContribution)}
                  </td>
                  <td className="border border-slate-600">
                    {printNumber(wealth.marketValue)}
                  </td>
                </tr>
              ))}
            <tr>
              <td className=""></td>
              <td className=""></td>
              <td className=""></td>
              <td className=""></td>
              <td className="border border-slate-600 font-bold">Total</td>
              <td className="border border-slate-600 font-bold">
                {printNumber(
                  client.assetSummary.statementWealth
                    .filter((w) => !w.qualified)
                    .reduce((sum, w) => sum + (w.annualContribution || 0), 0),
                )}
              </td>
              <td className="border border-slate-600 font-bold">
                {printNumber(
                  client.assetSummary.statementWealth
                    .filter((w) => !w.qualified)
                    .reduce((sum, w) => sum + (w.marketValue || 0), 0),
                )}
              </td>
            </tr>
          </table>
        </div>
      )}

      {(assetSummary.hardAssets.length > 0 ||
        assetSummary.debts.length > 0) && (
          <Header text="Hard Assets" color="#4471c4" />
        )}

      {assetSummary.hardAssets.length > 0 && (
        <div className="break-inside-avoid-page">
          <Subtitle>Hard Assets</Subtitle>
          <table className="text-center w-[800px] border-collapse">
            <thead>
              <th className="border border-slate-600">Name</th>
              <th className="border border-slate-600">Type</th>
              <th className="border border-slate-600">Owner</th>
              <th className="border border-slate-600">Cost Basis</th>
              <th className="border border-slate-600">Net Income</th>
              <th className="border border-slate-600">Debt</th>
              <th className="border border-slate-600">Market Value</th>
            </thead>
            {client.assetSummary.hardAssets.map((asset) => (
              <tr>
                <td className="border border-slate-600">{asset.name}</td>
                <td className="border border-slate-600">{asset.type}</td>
                <td className="border border-slate-600">
                  {getPerson(asset.owner)}
                </td>
                <td className="border border-slate-600">
                  {printNumber(asset.costBasis)}
                </td>
                <td className="border border-slate-600">
                  {printNumber(asset.netIncome)}
                </td>

                <td className="border border-slate-600">
                  {printNumber(
                    assetSummary.debts
                      .filter((i) => i.asset == asset.id)
                      .map((i) => i.balance)
                      .reduce((a, b) => a + b, 0),
                  )}
                </td>
                <td className="border border-slate-600">
                  {printNumber(asset.marketValue)}
                </td>
              </tr>
            ))}
            <tr>
              <td className=""></td>
              <td className=""></td>
              <td className=""></td>
              <td className="border border-slate-600 font-bold">Total</td>

              <td className="border border-slate-600 font-bold">
                {printNumber(
                  client.assetSummary.hardAssets.reduce(
                    (sum, a) => sum + (a.netIncome || 0),
                    0,
                  ),
                )}
              </td>
              <td className="border border-slate-600 font-bold">
                {printNumber(
                  client.assetSummary.hardAssets.reduce(
                    (sum, a) => sum + (a.marketValue || 0),
                    0,
                  ),
                )}
              </td>
              <td className="border border-slate-600 font-bold">
                {printNumber(
                  assetSummary.debts
                    .filter((i) => i.asset)
                    .map((i) => i.balance)
                    .reduce((a, b) => a + b, 0),
                )}
              </td>
            </tr>
          </table>
        </div>
      )}
      {assetSummary.debts.length > 0 && (
        <div className="break-inside-avoid-page">
          <Subtitle>Debts</Subtitle>
          <table className="text-center w-[800px] border-collapse">
            <thead>
              <th className="border border-slate-600">Lender</th>
              <th className="border border-slate-600">Asset</th>
              <th className="border border-slate-600">Type</th>
              <th className="border border-slate-600">Account #</th>
              <th className="border border-slate-600">Interest Rate</th>
              <th className="border border-slate-600">Monthly Payment</th>
              <th className="border border-slate-600">Balance</th>
            </thead>
            {assetSummary.debts.map((asset) => (
              <tr>
                <td className="border border-slate-600">{asset.lender}</td>
                <td className="border border-slate-600">
                  {
                    assetSummary.hardAssets.find((i) => i.id == asset.asset)
                      ?.name
                  }
                </td>
                <td className="border border-slate-600">{asset.type}</td>
                <td className="border border-slate-600">
                  {asset.accountNumber}
                </td>
                <td className="border border-slate-600">
                  {asset.interestRate}%
                </td>
                <td className="border border-slate-600">
                  {printNumber(asset.monthlyPayment)}
                </td>
                <td className="border border-slate-600">
                  {printNumber(asset.balance)}
                </td>
              </tr>
            ))}
            <tr>
              <td className=""></td>
              <td className=""></td>
              <td className=""></td>
              <td className=""></td>
              <td className="border border-slate-600 font-bold">Total</td>
              <td className="border border-slate-600 font-bold">
                {printNumber(
                  client.assetSummary.debts.reduce(
                    (sum, a) => sum + (a.monthlyPayment || 0),
                    0,
                  ),
                )}
              </td>
              <td className="border border-slate-600 font-bold">
                {printNumber(
                  client.assetSummary.debts.reduce(
                    (sum, a) => sum + (a.balance || 0),
                    0,
                  ),
                )}
              </td>
            </tr>
          </table>
        </div>
      )}

      {assetSummary.inheritance.length > 0 && (
        <div className="break-inside-avoid-page">
          <Subtitle>Inheritances</Subtitle>
          <table className="text-center w-[800px] border-collapse">
            <thead>
              <th className="border border-slate-600">Name</th>
              <th className="border border-slate-600">Type</th>
              <th className="border border-slate-600">Amount</th>
            </thead>
            {assetSummary.inheritance.map((asset) => (
              <tr>
                <td className="border border-slate-600">{asset.name}</td>
                <td className="border border-slate-600">{asset.type}</td>
                <td className="border border-slate-600">
                  {printNumber(asset.amount)}
                </td>
              </tr>
            ))}
            <tr>
              <td className=""></td>
              <td className="border border-slate-600 font-bold">Total</td>
              <td className="border border-slate-600 font-bold">
                {printNumber(
                  client.assetSummary.inheritance.reduce(
                    (sum, a) => sum + (a.amount || 0),
                    0,
                  ),
                )}
              </td>
            </tr>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssetSummary;
