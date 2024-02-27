import { useEffect, useState } from "react";
import Input from "../components/Inputs/Input";
import Layout from "../components/Layout";
import MapSection from "../components/MapSection";
import useUser from "../useUser";
import Button from "../components/Inputs/Button";
import { updateSettings } from "../services/client";
import Spinner from "../components/Spinner";

const Settings = () => {
  const { user } = useUser();
  useEffect(() => {
    setSettings(user?.info || null);
  }, [user]);
  const [settings, setSettings] = useState(null as any);
  const [loading, setLoading] = useState(false);
  return (
    <Layout page="settings" onTabChange={() => { }}>
      {settings ? (
        <div className="px-10">
          <MapSection title="Settings" defaultOpen>
            <div className="flex flex-col w-[500px] gap-6 m-auto">
              <Input
                value={settings.name}
                setValue={(e) => setSettings({ ...settings, name: e })}
                label="Name"
                size="full"
              />
              <Input
                value={settings.firmName}
                setValue={(e) => setSettings({ ...settings, firmName: e })}
                label="Firm name"
                size="full"
              />
              <Input
                value={settings.disclosures}
                setValue={(e) => setSettings({ ...settings, disclosures: e })}
                label="Disclosures"
                size="full"
                subtype="textarea"
              />
              <div className="uto">
                <Button
                  type="primary"
                  onClick={async () => {
                    setLoading(true);
                    await updateSettings(settings);
                    setLoading(false);
                  }}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>

              <Button
                type="secondary"
                onClick={async () => {
                  const d = await fetch(
                    "https://my-express-api.onrender.com/stripeRedirect",
                  ).then((a) => a.json());
                  window.open(d.url, "_blank");
                }}
              >
                Billing settings
              </Button>
            </div>
          </MapSection>
        </div>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default Settings;
