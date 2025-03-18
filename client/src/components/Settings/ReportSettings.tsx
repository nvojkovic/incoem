import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../Sortable/SortableItem";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Toggle from "../Inputs/Toggle";
import { ReportSettings } from "src/types";

interface Props {
  settings: ReportSettings;
  updateSettings: any;
  switchOrder: (name1: string, name2: string) => void;
  flags: {
    needsFlag: boolean;
    longevityFlag: boolean;
  };
}

const names: any = {
  cover: "Cover",
  incomes: "Income",
  "income-chart": "Income Chart",
  spending: "Spending",
  "spending-chart": "Spending Chart",
  longevity: "Longevity",
  composite: "Composite",
  "by-person": "By Person",
  "by-income-type": "By Income Type",
  "by-tax-status": "By Tax Status",
};

const Page = ({ setting, setSetting, index }: any) => {
  return (
    <div className="border shadow-md rounded-lg bg-white justify-center">
      <div
        className={`bg-white p-3  items-center rounded-lg ${setting.enabled ? "" : "opacity-50"}`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-between w-full">
            <div className="flex justify-start cursor-pointer mr-2">
              <EllipsisVerticalIcon className="text-slate-800 w-5 mr-[-15px]" />
              <EllipsisVerticalIcon className="text-slate-800 w-5 mr-[-15px]" />
              <EllipsisVerticalIcon className="text-slate-800 w-5 " />
            </div>
            {names[setting.name]}
            <Toggle
              enabled={setting.enabled}
              setEnabled={() =>
                setSetting({ ...setting, enabled: !setting.enabled })
              }
            />
          </div>
          <img
            src={`/report-screenshots/${setting.name}.png`}
            alt=""
            className="h-48 w-auto object-cover"
          />
          <div className="text-sm">({index})</div>
        </div>
      </div>
    </div>
  );
};
// <div className="w-[320px] h-[200px]">
//         <iframe
//           id="printFrame"
//           style={{
//             width: "500px",
//             height: "380px",
//           }}
//           src="http://dev.incomemapper.com/print-live/6/?page={%22name%22:%22longevity%22}"
//           className="frame wrap"
//         ></iframe>
//       </div>
//

const ReportSettingsPage = ({
  flags,
  settings,
  updateSettings,
  switchOrder,
}: Props) => {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = settings.find((s) => s.id === active.id)?.name || "";
    const newIndex = settings.find((s) => s.id === over.id)?.name || "";

    console.log(oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      switchOrder(oldIndex, newIndex);
      // const newArr = arrayMove([...settings], oldIndex, newIndex);
      // console.log(newArr);
      // updateSettings(newArr);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  console.log("settings", settings);
  const filtered = settings.filter(
    (s) =>
      !(s.name === "longevity" && !flags.longevityFlag) &&
      !(s.name === "spending" && !flags.needsFlag) &&
      !(s.name === "spending-chart" && !flags.needsFlag),
  );
  console.log(filtered);
  return (
    <div className="grid gap-6 grid-cols-4 w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={structuredClone(settings)}
          strategy={horizontalListSortingStrategy}
        >
          {settings.map((sc, i) => (
            <SortableItem
              key={sc.id}
              id={sc.id}
            // onClick={() => setTab(i)}
            >
              <Page
                setting={sc}
                index={i + 1}
                setSetting={(item: any) =>
                  updateSettings(
                    settings.map((old, ind) => (ind === i ? item : old)),
                  )
                }
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ReportSettingsPage;

// style="width: 1200px; height: 800px; background-color: white"
