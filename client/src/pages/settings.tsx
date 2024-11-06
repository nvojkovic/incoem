import { useEffect, useRef, useState } from "react";
import { HuePicker } from "react-color";
import Input from "../components/Inputs/Input";
import Layout from "../components/Layout";
import { useUser } from "../useUser";
import Button from "../components/Inputs/Button";
import { updateSettings, uploadLogo } from "../services/client";
import Spinner from "../components/Spinner";
import { Tooltip } from "flowbite-react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const SectionHeader = ({ title }: any) => (
  <div className="text-lg border-b border-black pb-1">{title}</div>
);

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
    <Layout page="settings">
      {settings ? (
        <div className="mt-6 max-w-[1480px] m-auto mb-32 px-10">
          <div className="flex lg:flex-row flex-col gap-10 w-full">
            <div className="w-full flex flex-col gap-5">
              <SectionHeader title="Advisor" />
              <div className="flex gap-6 flex-col">
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
                <div className="flex items-baseline">
                  <div className="text-sm text-[#344054] w-[192px]">
                    Billing
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
                    Open settings
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <SectionHeader title="Appearance" />

              <div className="flex items-center gap-4">
                <label
                  htmlFor="primaryColor"
                  className="text-sm text-[#344054] w-[132px]"
                >
                  Primary Color
                </label>
                <HuePicker
                  color={settings.primaryColor}
                  onChange={(e) => {
                    setSettings({ ...settings, primaryColor: e.hex });
                  }}
                />
                <input
                  type="color"
                  id="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleColorChange}
                  className="w-10 h-10 rounded-md cursor-pointer"
                />
                <div className="w-24">
                  <Button
                    type="secondary"
                    onClick={() => {
                      setSettings({ ...settings, primaryColor: "#FF6C47" });
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="text-sm text-[#344054] w-[136px]">Logo</div>
                {user?.info?.logo && (
                  <div className="flex items-center justify-center">
                    <img
                      src={`${import.meta.env.VITE_API_URL}logo/?logo=${user.info.logo}`}
                      className="h-20 min-w-20"
                    />
                  </div>
                )}
                <Tooltip
                  content={
                    "You can upload image files (JPG, PNG, GIF, WebP) up to 10 MB in size."
                  }
                  theme={{ target: "" }}
                  placement="right-end"
                  style="light"
                >
                  <div className="w-48">
                    <Button
                      type="secondary"
                      onClick={() => ref.current.click()}
                    >
                      <div className="flex items-center gap-3 justify-center">
                        Upload
                        <QuestionMarkCircleIcon className="h-5 w-5 text-[#D0D5DD]" />
                      </div>
                    </Button>
                  </div>
                </Tooltip>
                <input
                  type="file"
                  className="hidden"
                  ref={ref}
                  onChange={upload}
                />

                <div className="w-48">
                  {user?.info?.logo && (
                    <Button
                      type="secondary"
                      onClick={async () => {
                        await updateSettings({ ...settings, logo: null });
                        await fetchUser();
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              <SectionHeader title="Features" />

              <div className="italic text-gray-500 text-sm">
                These are global settings that new clients will inherit.
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-60">
                  <Input
                    value={settings.stabilityRatioFlag}
                    setValue={(e) =>
                      setSettings({ ...settings, stabilityRatioFlag: e })
                    }
                    label="Stability Ratio"
                    size="full"
                    tooltip="Calculate and show the % of income considered “Stable” on the Income Map"
                    subtype="toggle"
                  />
                </div>
                <div className="w-60">
                  <Input
                    value={settings.needsFlag}
                    setValue={(e) => setSettings({ ...settings, needsFlag: e })}
                    label="Spending"
                    tooltip="Include the Spending calculator page and show Spending on Income Map"
                    size="full"
                    subtype="toggle"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[500px] gap-6 m-auto mt-10">
            <div>
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
        </div>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default Settings;
