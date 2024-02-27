import { useLayoutEffect, useState } from "react";
import Live from "./Live";
import ResultTable from "./ResultTable";
import save from "../assets/save.png";
import Button from "./Inputs/Button";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";

const Tab = ({
  name,
  active,
  setActive,
}: {
  name: string;
  active: boolean;
  setActive: any;
}) => {
  return (
    <div
      className={`px-3 text-sm cursor-pointer border-b-2 h-[44px] flex justify-center items-center w-auto font-semibold ${active ? "border-[#FF6C47] text-[#FF6C47] bg-[#FF79571A]" : "text-[#667085]"}`}
      onClick={setActive}
    >
      {name}
    </div>
  );
};

const Summary = ({
  data,
  store,
  scenarios,
}: {
  data: IncomeMapData;
  scenarios: ScenarioSettings[];
  store: any;
}) => {
  const [tab, setTab] = useState(-1);
  const openFullScreen = () => {
    var elem = document.documentElement as any;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  function closeFullscreen() {
    const doc: any = document;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      /* Safari */
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      /* IE11 */
      doc.msExitFullscreen();
    }
  }

  const [fullScreen, setFullScreen] = useState(false);
  useLayoutEffect(() => {
    const fullscreenchange = () => {
      setFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", fullscreenchange);
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenchange);
    };
  }, []);

  const newScenario = (data: any) => {
    let name = prompt("Name of scenario");
    data.name = name;
    store(save);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="font-semibold text-[30px]">Income Map Overview</div>
        <div className="flex gap-3">
          <div>
            <Button type="secondary" onClick={newScenario}>
              <div className="flex gap-2">
                <img src={save} className="w-5 h-5" />
                <div className="text-sm">Save scenario</div>
              </div>
            </Button>
          </div>
          <div>
            <Button
              type="secondary"
              onClick={fullScreen ? closeFullscreen : openFullScreen}
            >
              <div className="flex gap-3">
                <div className="flex items-center">
                  {fullScreen ? (
                    <ArrowsPointingInIcon className="h-5 w-5" />
                  ) : (
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-sm">Presentation mode</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className="border-b border-[#EAECF0] mb-10 flex">
        <Tab name="Live" active={tab == -1} setActive={() => setTab(-1)} />
        {scenarios.map((s, i) => (
          <Tab name={s.name} active={tab == i} setActive={() => setTab(i)} />
        ))}
      </div>
      {tab == -1 ? (
        <Live data={data} store={newScenario} />
      ) : (
        <ResultTable
          settings={scenarios[tab]}
          data={scenarios[tab].data}
          name={scenarios[tab].name}
        />
      )}
    </div>
  );
};

export default Summary;
