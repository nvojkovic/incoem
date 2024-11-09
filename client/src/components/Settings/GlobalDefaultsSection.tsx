import Input from "../Inputs/Input";
import SectionHeader from "./SectionHeader";
import { SettingsData } from "./types";

interface GlobalDefaultsSectionProps {
  settings: SettingsData;
  setSettings: (settings: SettingsData) => void;
}

const GlobalDefaultsSection = ({ settings, setSettings }: GlobalDefaultsSectionProps) => {
  return (
    <div className="w-1/2 flex gap-5">
      <SectionHeader title="Global defaults" />
      <div className="flex gap-6 flex-col">
        <Input
          value={settings.globalInflation}
          subtype="percent"
          setValue={(e) => setSettings({ ...settings, globalInflation: e })}
          label="Inflation"
          size="full"
        />
        <Input
          value={settings.globalYearsShown}
          subtype="number"
          setValue={(e) => setSettings({ ...settings, globalYearsShown: e })}
          label="Years Shown"
          size="full"
        />
        <Input
          value={settings.globalLifeExpectancy}
          subtype="number"
          setValue={(e) => setSettings({ ...settings, globalLifeExpectancy: e })}
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
  );
};

export default GlobalDefaultsSection;
