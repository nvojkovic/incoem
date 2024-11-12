import Input from "../Inputs/Input";
import { SettingsData } from "./types";

interface AdvisorSectionProps {
  settings: SettingsData;
  setSettings: (settings: SettingsData) => void;
  user: any;
}

const AdvisorSection = ({ settings, setSettings }: AdvisorSectionProps) => {
  return (
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
    </div>
  );
};

export default AdvisorSection;
