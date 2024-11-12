import Input from "../Inputs/Input";
import { SettingsData } from "./types";

interface GlobalDefaultsSectionProps {
  settings: SettingsData;
  setSettings: (settings: SettingsData) => void;
}

const GlobalDefaultsSection = ({
  settings,
  setSettings,
}: GlobalDefaultsSectionProps) => {
  return (
    <div className="grid gap-6 grid-cols-2">
      <Input
        value={settings.globalInflation}
        subtype="percent"
        setValue={(e) => setSettings({ ...settings, globalInflation: e })}
        label="Inflation"
        width="!w-32"
      />
      <Input
        value={settings.globalPreRetirementTaxRate}
        subtype="percent"
        setValue={(e) =>
          setSettings({ ...settings, globalPreRetirementTaxRate: e })
        }
        label="Pre-Retirement Tax Rate"
      />
      <Input
        value={settings.globalYearsShown}
        subtype="number"
        setValue={(e) => setSettings({ ...settings, globalYearsShown: e })}
        label="Years Shown"
      />
      <Input
        value={settings.globalPostRetirementTaxRate}
        subtype="percent"
        setValue={(e) =>
          setSettings({ ...settings, globalPostRetirementTaxRate: e })
        }
        label="Post-Retirement Tax Rate"
      />
      <Input
        value={settings.globalLifeExpectancy}
        subtype="number"
        setValue={(e) => setSettings({ ...settings, globalLifeExpectancy: e })}
        label="Mortality"
      />
    </div>
  );
};

export default GlobalDefaultsSection;
