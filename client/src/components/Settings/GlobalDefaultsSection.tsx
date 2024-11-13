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
    <div className="grid gap-y-5 grid-cols-2 w-[500px]">
      <Input
        value={settings.globalInflation}
        subtype="percent"
        setValue={(e) => setSettings({ ...settings, globalInflation: e })}
        label="Inflation"
        labelLength={110}
        width="!w-24"
        tabIndex={4}
      />
      <Input
        value={settings.globalPreRetirementTaxRate}
        subtype="percent"
        setValue={(e) =>
          setSettings({ ...settings, globalPreRetirementTaxRate: e })
        }
        labelLength={190}
        width="!w-24"
        label="Pre-Retirement Tax Rate"
        tabIndex={7}
      />
      <Input
        value={settings.globalYearsShown}
        subtype="number"
        setValue={(e) => setSettings({ ...settings, globalYearsShown: e })}
        label="Years Shown"
        labelLength={110}
        width="!w-24"
        tabIndex={5}
      />
      <Input
        value={settings.globalPostRetirementTaxRate}
        subtype="percent"
        setValue={(e) =>
          setSettings({ ...settings, globalPostRetirementTaxRate: e })
        }
        label="Post-Retirement Tax Rate"
        labelLength={190}
        width="!w-24"
        tabIndex={8}
      />
      <Input
        value={settings.globalLifeExpectancy}
        subtype="number"
        setValue={(e) => setSettings({ ...settings, globalLifeExpectancy: e })}
        label="Mortality"
        labelLength={110}
        width="!w-24"
        tabIndex={6}
      />
    </div>
  );
};

export default GlobalDefaultsSection;
