import { useEffect, useRef, useState } from "react";
import Input from "../components/Inputs/Input";
import Layout from "../components/Layout";
import MapSection from "../components/MapSection";
import { useUser } from "../useUser";
import Button from "../components/Inputs/Button";
import { updateSettings, uploadLogo } from "../services/client";
import Spinner from "../components/Spinner";
import { Tooltip } from "flowbite-react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const Settings = () => {
  const { user, fetchUser } = useUser();
  useEffect(() => {
    setSettings(user?.info || null);
  }, [user]);
  const [settings, setSettings] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null as any);
  const upload = async (e: any) => {
    const file = e.target.files[0];
    await uploadLogo(file);
    fetchUser();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, primaryColor: e.target.value });
  };

  return (
    <Layout page="settings" onTabChange={() => { }}>
      {settings ? (
        <div className="px-10">
          <MapSection title="Settings" defaultOpen>
            <div className="flex flex-col w-[500px] gap-6 m-auto">
              {user?.info?.logo && (
                <div className="flex items-center justify-center">
                  <img
                    src={`${import.meta.env.VITE_API_URL}logo/?logo=${user.info.logo}`}
                    className="h-20"
                  />
                </div>
              )}
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
              <div className="flex items-center gap-4">
                <label
                  htmlFor="primaryColor"
                  className="text-sm text-[#344054]"
                >
                  Primary Color
                </label>
                <input
                  type="color"
                  id="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleColorChange}
                  className="w-10 h-10 rounded-md cursor-pointer"
                />
              </div>
              <Input
                value={settings.stabilityRatioFlag}
                setValue={(e) =>
                  setSettings({ ...settings, stabilityRatioFlag: e })
                }
                label="Calculate Stability Ratio?"
                size="full"
                subtype="toggle"
              />
              <div className="flex gap-3">
                <Tooltip
                  content={
                    "You can upload image files (JPG, PNG, GIF, WebP) up to 10 MB in size."
                  }
                  theme={{ target: "" }}
                  placement="right-end"
                  style="light"
                >
                  <Button type="secondary" onClick={() => ref.current.click()}>
                    <div
                      className="flex items-center gap-3 justify-center"
                      style={{ width: user?.info?.logo ? "220px" : "480px" }}
                    >
                      Upload Logo
                      <QuestionMarkCircleIcon className="h-5 w-5 text-[#D0D5DD]" />
                    </div>
                  </Button>
                </Tooltip>
                <input
                  type="file"
                  className="hidden"
                  ref={ref}
                  onChange={upload}
                />

                {user?.info?.logo && (
                  <Button
                    type="secondary"
                    onClick={async () => {
                      await updateSettings({ ...settings, logo: null });
                      await fetchUser();
                    }}
                  >
                    Remove Logo
                  </Button>
                )}
              </div>
              <Button
                type="secondary"
                onClick={async () => {
                  if (
                    user?.info?.subsciptionStatus === "active" ||
                    user?.info?.subsciptionStatus === "trialing"
                  ) {
                    const d = await fetch(
                      import.meta.env.VITE_API_URL + "stripeRedirect",
                    ).then((a) => a.json());
                    window.open(d.url, "_blank");
                  } else {
                    const d = await fetch(
                      import.meta.env.VITE_API_URL + "stripeSubscribe",
                    ).then((a) => a.json());
                    window.open(d.url, "_blank");
                  }
                }}
              >
                Billing settings
              </Button>

              <div className="uto">
                <Button
                  type="primary"
                  onClick={async () => {
                    setLoading(true);
                    await updateSettings(settings);
                    await fetchUser();
                    setLoading(false);
                  }}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
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
