import Input from "../Inputs/Input";
import Button from "../Inputs/Button";
import SectionHeader from "./SectionHeader";
import { SettingsData } from "./types";

interface AdvisorSectionProps {
  settings: SettingsData;
  setSettings: (settings: SettingsData) => void;
  user: any;
}

const AdvisorSection = ({ settings, setSettings, user }: AdvisorSectionProps) => {
  return (
    <div className="w-full flex flex-row gap-5">
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
          <div className="text-sm text-[#344054] w-[172px]">Billing</div>
          <Button
            type="secondary"
            onClick={async () => {
              if (
                user?.info?.subsciptionStatus === "active" ||
                user?.info?.subsciptionStatus === "trialing"
              ) {
                const d = await fetch(
                  import.meta.env.VITE_API_URL + "stripeRedirect"
                ).then((a) => a.json());
                window.open(d.url, "_blank");
              } else {
                const d = await fetch(
                  import.meta.env.VITE_API_URL + "stripeSubscribe"
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
  );
};

export default AdvisorSection;
