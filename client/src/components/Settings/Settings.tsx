import { useEffect, useRef, useState } from "react";
import { Tooltip } from "flowbite-react";
import {
  ArrowUpRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Alert from "src/components/Alert";
import { useUser } from "src/useUser";
import { applyToAll, updateSettings, uploadLogo } from "src/services/client";
import Layout from "../Layout";
import Input from "../Inputs/Input";
import Button from "../Inputs/Button";
import Spinner from "../Spinner";
import AdvisorSection from "./AdvisorSection";
import GlobalDefaultsSection from "./GlobalDefaultsSection";
import SectionHeader from "./SectionHeader";
import ReportSettings from "./ReportSettings";

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

export const ApplyToCurrent = ({
  name,
  value,
  content = <ArrowUpRightIcon className="h-5" />,
  tooltip = "",
}: any) => {
  const updateSetting = async () => {
    await applyToAll(name, value);
    setUpdateTimer(true);
    setTimeout(() => {
      setUpdateTimer(false);
    }, 2000);
  };

  const [updating, setUpdateTimer] = useState(false);

  return (
    <Tooltip content={tooltip} style="light">
      <div className={`flex ${"gap-3"} items-center justify-center`}>
        <div>
          <Button type="primary" onClick={updateSetting}>
            {content}
          </Button>
        </div>
        <div
          className={`mt-2 text-sm  text-center text-main-orange transition ease-in-out ${updating ? "opacity-100" : "opacity-0"}`}
        >
          Clients updated!
        </div>
      </div>
    </Tooltip>
  );
};

const Settings = () => {
  const { user, fetchUser, updateInfo } = useUser();
  useEffect(() => {
    // setSettings(user?.info || null, false);
  }, [user]);
  // const [settings, setSettingsS] = useState(null as any);
  // const setSettings = (a: any, save = true) => {
  //   if (save) setToSave(true);
  //   setSettingsS(a);
  // };
  //
  const settings = user?.info;

  const setSettings = (settings: any) => {
    updateInfo(settings);
  };
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
      <div className="sticky top-[70px] font-semibold text-[30px] flex justify-between px-10 bg-[#f3f4f6] z-50 py-5">
        <div>Settings</div>
      </div>
      {settings ? (
        <div className="mt-6 max-w-[1480px] m-auto mb-32 px-10">
          <div className="flex lg:flex-col flex-col gap-10 w-full">
            <div className="flex flex-row gap-5 border-b border-black pb-7">
              <SectionHeader
                title="Advisor"
                subtitle="Advisor information will appear on the printed pdf."
              />
              <AdvisorSection
                settings={settings as any}
                setSettings={setSettings}
                user={user}
              />
            </div>

            <div className="flex gap-5 border-b border-black pb-7">
              <SectionHeader
                title="Appearance"
                subtitle="Primary color is used to customize the look of the app. Logo is used in top left in the app, and on PDF reports."
              />

              <div className="flex flex-col gap-6">
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
                    tabIndex={9}
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
                        tabIndex={10}
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
              </div>
            </div>
            <div className="flex gap-5 border-b border-black pb-7">
              <SectionHeader
                title="Global Assumptions"
                subtitle="Prefill assumptions for new clients created. These defaults can be changed for each individual client."
              />
              <GlobalDefaultsSection
                settings={settings as any}
                setSettings={setSettings}
              />
            </div>
            <div className="flex gap-5 border-b border-black pb-7">
              <SectionHeader
                title="Extra Features"
                subtitle="Set the default for new clients created. This default can be
                overridden (turned off/on) for each individual client in client
                settings page."
              />
              <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-5 items-center w-full">
                  <div className="flex gap-5 items-center w-[730px]">
                    <div>
                      <Input
                        value={settings.stabilityRatioFlag}
                        tabIndex={11}
                        setValue={(e) =>
                          setSettings({ ...settings, stabilityRatioFlag: e })
                        }
                        label="Stability Ratio"
                        size="full"
                        subtype="toggle"
                      />
                    </div>
                    <div className="text-gray-400 text-nowrap text-sm">
                      Calculate and show the % of income considered “Stable” on
                      the Income Map
                    </div>
                  </div>
                  <div className="">
                    <ApplyToCurrent
                      name="stabilityRatioFlag"
                      value={settings.stabilityRatioFlag}
                      tooltip="Apply this Stability setting to existing clients"
                    />
                  </div>
                </div>
                <div className="flex gap-5 items-center w-full ">
                  <div className="flex gap-5 items-center w-[730px]">
                    <div>
                      <Input
                        value={settings.needsFlag}
                        tabIndex={12}
                        setValue={(e) =>
                          setSettings({ ...settings, needsFlag: e })
                        }
                        label="Spending"
                        size="full"
                        subtype="toggle"
                      />
                    </div>
                    <div className="text-gray-400 text-nowrap text-sm">
                      Include the Spending calculator page and show Spending on
                      Income Map
                    </div>
                  </div>
                  <ApplyToCurrent
                    name="needsFlag"
                    value={settings.needsFlag}
                    tooltip="Apply this Spending setting to existing clients"
                  />
                </div>
                <div className="flex gap-5 items-center w-full">
                  <div className="flex gap-5 items-center w-[730px]">
                    <div>
                      <Input
                        value={settings.longevityFlag}
                        tabIndex={12}
                        setValue={(e) =>
                          setSettings({ ...settings, longevityFlag: e })
                        }
                        label="Longevity"
                        size="full"
                        subtype="toggle"
                      />
                    </div>
                    <div className="text-gray-400 text-nowrap text-sm text-left">
                      Include Longevity / Life Expectancy calculation.
                    </div>
                  </div>
                  <div>
                    <ApplyToCurrent
                      name="longevityFlag"
                      tooltip="Apply this Longevity setting to existing clients"
                      value={settings.longevityFlag}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-5 border-b border-black pb-7">
              <SectionHeader
                title="Reports"
                subtitle={
                  <>
                    "Choose which pages in which order are included in PDF
                    reports."
                    <div className="mt-5">
                      <ApplyToCurrent
                        name="reportSettings"
                        value={settings.globalReportSettings}
                        tooltip="Apply report settings to existing clients"
                      />
                    </div>
                  </>
                }
              />
              <div>
                <ReportSettings
                  flags={{
                    needsFlag: settings.needsFlag,
                    longevityFlag: settings.longevityFlag,
                  }}
                  settings={settings.globalReportSettings}
                  updateSettings={(globalReportSettings: any) => {
                    console.log("update", globalReportSettings);
                    setSettings({
                      ...settings,
                      globalReportSettings,
                    });
                  }}
                />
              </div>
            </div>

            <div className="flex gap-5 border-b border-black pb-7">
              <SectionHeader
                title="Billing"
                subtitle="Manage your subscription."
              />

              <div className="flex items-baseline w-64">
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
        </div>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default Settings;
