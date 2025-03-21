import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const ScenarioTab = ({
  name,
  active,
  live,
  setActive,
  store,
}: {
  name: string;
  active: boolean;
  live?: boolean;
  setActive: any;
  id: number;
  store: any;
}) => {
  const [n, setN] = useState(name);

  const [editing, setEditing] = useState(false);
  const finish = (x: string) => {
    setEditing(false);
    store(x);
  };
  return (
    <div className={active ? "bg-white" : ""}>
      <div
        className={`${live ? "px-6" : "px-5"
          } text-sm cursor-pointer h-[44px] flex justify-center items-center w-auto font-medium ${active
            ? "border-b-2 border-main-orange text-black bg-[#ffdad0]"
            : "text-[#667085]"
          } z-50 w-full`}
        style={
          {
            // backgroundColor: active
            //   ? "rgba(var(--primary-color-segment),0.1)"
            //   : "",
          }
        }
        onClick={setActive}
        onDoubleClick={() => !live && setEditing(true)}
      >
        <div className="flex gap-3">
          {live && <ChartBarIcon className="h-5 w-5" />}
          {editing ? (
            <input
              value={n}
              onChange={(e) => setN(e.target.value)}
              autoFocus
              className="focus:outline-none focus:border-transparent focus:ring-1 focus:ring-transparent rounded-lg border border-[#D0D5DD] px-3 py-2 disabled:bg-gray-100 bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  finish(name);
                }
                if (e.key === "Enter") {
                  finish(n);
                }
              }}
              onBlur={() => {
                finish(n);
              }}
            />
          ) : (
            name
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioTab;
