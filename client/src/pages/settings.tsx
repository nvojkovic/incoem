import { useEffect, useRef, useState } from "react";
import Input from "../components/Inputs/Input";
import Layout from "../components/Layout";
import { useUser } from "../useUser";
import Button from "../components/Inputs/Button";
import { updateSettings, uploadLogo } from "../services/client";
import Spinner from "../components/Spinner";
import { Tooltip } from "flowbite-react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Alert from "src/components/Alert";

const SectionHeader = ({ title }: any) => (
  <div className="text-lg border-b border-black pb-1">{title}</div>
);

const isColorTooLight = (
  hexColor: string,
  threshold: number = 0.7,
): boolean => {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error("Invalid hex color format. Expected 6 characters (RGB)");
  }

  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // Calculate relative luminance using sRGB color space
  // Formula from: https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const toSRGB = (c: number): number => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const luminance =
    0.2126 * toSRGB(r) + 0.7152 * toSRGB(g) + 0.0722 * toSRGB(b);

  return luminance > threshold;
};

const Settings = () => {
  const { user, fetchUser } = useUser();
  useEffect(() => {
    setSettings(user?.info || null);
  }, [user]);
  const [settings, setSettings] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const [tooLight, setTooLight] = useState(false);
  const ref = useRef(null as any);
  const upload = async (e: any) => {
    const file = e.target.files[0];
    await uploadLogo(file);
    fetchUser();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isColorTooLight(e.target.value)) {
      setTooLight(true);
    } else {
      setSettings({ ...settings, primaryColor: e.target.value });
    }
  };

  return (
    <Layout page="settings">
      <Alert onClose={() => setTooLight(false)} isOpen={tooLight}>
        <div className="mb-5">
          This color is too light. It would interfere with the rest of the UI.
          Please choose a different color
        </div>
      </Alert>
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
                  labelLength={110}
                  size="full"
                />
                <Input
                  value={settings.firmName}
                  setValue={(e) => setSettings({ ...settings, firmName: e })}
                  label="Firm name"
                  labelLength={110}
                  size="full"
                />
                <Input
                  value={settings.disclosures}
                  labelLength={110}
                  setValue={(e) => setSettings({ ...settings, disclosures: e })}
                  label="Disclosures"
                  size="full"
                  subtype="textarea"
                />
                <div className="flex items-baseline">
                  <div className="text-sm text-[#344054] w-[172px]">
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
                    Open billing settings
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-5">
              <SectionHeader title="Global defaults" />
              <div className="flex gap-6 flex-col">
                <Input
                  value={settings.globalInflation}
                  subtype="percent"
                  setValue={(e) =>
                    setSettings({ ...settings, globalInflation: e })
                  }
                  label="Inflation"
                  size="full"
                />
                <Input
                  value={settings.globalYearsShown}
                  subtype="number"
                  setValue={(e) =>
                    setSettings({ ...settings, globalYearsShown: e })
                  }
                  label="Years Shown"
                  size="full"
                />
                <Input
                  value={settings.globalLifeExpectancy}
                  subtype="number"
                  setValue={(e) =>
                    setSettings({ ...settings, globalLifeExpectancy: e })
                  }
                  label="Life Expectancy"
                  size="full"
                />
                <Input
                  value={settings.globalPreRetirementTaxRate}
                  subtype="percent"
                  setValue={(e) =>
                    setSettings({ ...settings, globalPreRetirementTaxRate: e })
                  }
                  label="Pre-Retirement Tax Rate"
                  size="full"
                />
                <Input
                  value={settings.globalPostRetirementTaxRate}
                  subtype="percent"
                  setValue={(e) =>
                    setSettings({ ...settings, globalPostRetirementTaxRate: e })
                  }
                  label="Post-Retirement Tax Rate"
                  size="full"
                />
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
                  <div className="w-32">
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

                <div className="w-32">
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

              <SectionHeader title="Extra Features" />

              <div className="italic text-gray-500 text-sm">
                Set the default for new clients created. This default can be
                overridden (turned off/on) for each individual client in client
                settings page
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
