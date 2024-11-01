import React from "react";
import TimeValueCalculator from "./TimeValueCalculator";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useInfo } from "../../useData";
import Layout from "../Layout";
import { Link } from "react-router-dom";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../Sortable/SortableItem";

const initialState = {
  futureValue: 0,
  presentValue: 0,
  interestRate: 0,
  annualPayment: 0,
  timePeriod: 0,
  calculatorType: "Future Value",
  timing: "End of Year",
  compounding: "Annual",
};
const AllInOneCalculator: React.FC<any> = () => {
  const { data: client, setField } = useInfo();
  const data = client.allInOneCalculator;
  const setData = setField("allInOneCalculator");
  const addCalculator = () =>
    setData([
      ...data,
      {
        ...initialState,
        id: Math.round(Math.random() * 100000),
        name: `New Calculator (${data.length + 1})`,
      },
    ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = data.findIndex((s) => s.id === active.id);
    const newIndex = data.findIndex((s) => s.id === over.id);
    if (oldIndex !== newIndex) {
      setData(arrayMove([...data], oldIndex, newIndex));
    }
  };

  return (
    <Layout page="calculator">
      <div className="p-6 rounded-lg">
        <div className="flex gap-3 items-center mb-8">
          <Link to={`/client/${client.id}/calculator`}>
            <div className="rounded-full border border-gray-400 h-8 w-8 flex justify-center items-center cursor-pointer bg-white">
              <ArrowLeftIcon className="h-5 text-gray-500" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold">All-In-One Calculator</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={data} strategy={rectSortingStrategy}>
              {data.map((item: any, index: any) => (
                <SortableItem key={item.id} id={item.id}>
                  <TimeValueCalculator
                    data={item}
                    setData={(fn: any) => {
                      setData(
                        data.map((item: any, i: any) =>
                          i == index ? fn(item) : item,
                        ),
                      );
                    }}
                    remove={() =>
                      setData(data.filter((_: any, i: any) => i !== index))
                    }
                    duplicate={() =>
                      setData(
                        data.flatMap((item: any, i: any) =>
                          i === index
                            ? [
                                item,
                                {
                                  ...item,
                                  id: Math.round(Math.random() * 100000),
                                },
                              ]
                            : [item],
                        ),
                      )
                    }
                  />
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
          <div
            className="border p-4 rounded-lg h-[355px] flex justify-center items-center cursor-pointer bg-white shadow-md"
            onClick={addCalculator}
          >
            <div className="flex flex-col justify-center items-center gap-2 ">
              <div className="text-main-orange rounded-full w-12 h-12 bg-main-orange-light flex justify-center items-center">
                <PlusIcon className="w-8" />
              </div>
              <div className="font-medium">Add another calculator</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllInOneCalculator;
