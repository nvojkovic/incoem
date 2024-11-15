import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../Sortable/SortableItem";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Toggle from "../Inputs/Toggle";

interface Props {
  settings: ReportSettings;
  updateSettings: any;
}

const names: any = {
  cover: "Cover",
  incomes: "Incomes",
  "income-chart": "Chart",
  spending: "Spending",
};

const Page = ({ setting, setSetting }: any) => {
  return (
    <div
      className={`bg-white p-3 border shadow-md rounded-lg flex items-center ${setting.enabled ? "" : "opacity-50"}`}
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
          className="w-64"
        />
      </div>
    </div>
  );
};

const ReportSettings = ({ settings, updateSettings }: Props) => {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = settings.findIndex((s) => s.id === active.id);
    const newIndex = settings.findIndex((s) => s.id === over.id);
    console.log(oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      const newArr = arrayMove([...settings], oldIndex, newIndex);
      console.log(newArr);
      updateSettings(newArr);
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
  return (
    <div className="flex gap-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={settings}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-6">
            {settings.map((sc, i) => (
              <SortableItem
                key={sc.id}
                id={sc.id}
              // onClick={() => setTab(i)}
              >
                <Page
                  setting={sc}
                  setSetting={(item: any) =>
                    updateSettings(
                      settings.map((old, ind) => (ind === i ? item : old)),
                    )
                  }
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ReportSettings;
