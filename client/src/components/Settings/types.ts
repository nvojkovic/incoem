export interface SettingsData {
  name: string;
  firmName: string;
  disclosures: string;
  subsciptionStatus?: string;
  globalInflation: number;
  globalYearsShown: number;
  globalLifeExpectancy: number;
  globalPreRetirementTaxRate: number;
  globalPostRetirementTaxRate: number;
  primaryColor: string;
  logo?: string | null;
  stabilityRatioFlag: boolean;
  needsFlag: boolean;
}

export interface SectionHeaderProps {
  title: string;
  subtitle: string;
}
