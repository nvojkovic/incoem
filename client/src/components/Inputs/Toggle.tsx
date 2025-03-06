import { Switch } from "@headlessui/react";

interface ToggleProps {
  enabled: boolean;
  disabled?: boolean;
  setEnabled: (enabled: boolean) => void;
  tooltip?: string;
  size?: "sm" | "lg";
}

function Toggle({
  enabled,
  setEnabled,
  disabled,
  size = "lg",
  ...props
}: ToggleProps) {
  return (
    <div>
      {size === "sm" ? (
        <Switch
          {...props}
          checked={enabled}
          disabled={disabled}
          onChange={setEnabled}
          className={`${enabled ? "bg-main-orange" : "bg-gray-200"
            } relative inline-flex h-4 w-7 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${enabled ? "translate-x-3" : "translate-x-1"
              } inline-block h-3 w-3 transform rounded-full bg-white transition`}
          />
        </Switch>
      ) : (
        <Switch
          {...props}
          checked={enabled}
          disabled={disabled}
          onChange={setEnabled}
          className={`${enabled ? "bg-main-orange" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${enabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      )}
    </div>
  );
}

export default Toggle;
