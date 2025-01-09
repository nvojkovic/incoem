import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { jointTable, makeTable } from "../Longevity/calculate";

interface Props {
  years: any;
  stackedData: any;
  spending: any;
  stability: any;
  needsFlag: any;
  longevityFlag: any;
  people: any;
  initialHeight: any;
  maxY?: any;
}

const SpendingChart = ({
  years,
  stackedData,
  spending,
  stability,
  needsFlag,
  longevityFlag,
  people,
  initialHeight = 500,
  maxY,
}: Props) => {
  const svgRef = useRef() as any;
  const containerRef = useRef() as any;
  const [dimensions, setDimensions] = useState({
    width: 1100,
    height: initialHeight,
  });
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  // Custom color array (removed gray array)
  // const colorArray = [

  // ];
  // const color = d3.scaleSequential(d3.interpolateSinebow);
  const colorArray = [
    "#ff000066",
    "#BBCC33",
    "#77AADD",
    "#AAAA00",
    "#EE8866",
    "#EEDD88",
    "#FFAABB",
    "#99DDFF",
    "#44BB99",
  ];

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width - 10,
          height: initialHeight,
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    // cleanup first
    svgRef.current.innerHtml = "";
    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(containerRef.current).selectAll(".legend-container").remove();

    if (dimensions.width === 0 || !years.length || !stackedData.length) return;

    const margin = { top: 40, right: 30, bottom: 80, left: 75 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // Define the diagonal stripe pattern
    const defs = svg.append("defs");
    const pattern = defs
      .append("pattern")
      .attr("id", "diagonalStripes")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", 8)
      .attr("height", 8);

    pattern
      .append("path")
      .attr("d", "M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", 0.5);

    const mainG = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // First sort the stackedData array

    // Process data after sorting
    const processedData = years.map((year: any, index: any) => {
      const yearData = { year } as any;
      stackedData.forEach((item: any) => {
        yearData[item.name] = item.values[index];
      });
      return yearData;
    });

    // Get keys from sorted data
    const keys = stackedData
      .filter((d: any) => !hiddenSeries.has(d.name))
      .map((d: any) => d.name) as any;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(years) as any)
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        maxY * 1.1 ||
        Math.max(
          (d3 as any).max(processedData as any, (d: any) => {
            return d3.sum(keys, (key: any) => d[key]);
          }),
        ) * 1.1,
      ])
      .range([height, 0]);

    // Create sorted domain for consistent color mapping
    const sortedDomain = [...stackedData]
      // .sort((a, b) => {
      //   if (a.stable === b.stable) {
      //     return a.name.localeCompare(b.name);
      //   }
      //   return a.stable ? -1 : 1;
      // })
      .map((d) => d.name);
    console.log("sorted domain", sortedDomain);

    // Updated color scale using sorted domain
    const color = d3.scaleOrdinal().domain(sortedDomain).range(colorArray);

    const stackGenerator = d3.stack().keys(keys);
    const layers = stackGenerator(processedData);

    const area = d3
      .area()
      .x((d: any) => x(d.data.year))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveMonotoneX);

    (mainG as any)
      .selectAll("path.area")
      .data(layers)
      .join("path")
      .attr("class", "area")
      .attr("fill", (d: any) => {
        const item = stackedData.find((item: any) => item.name === d.key);
        const baseColor = d.key == "Taxes" ? "#000" : color(d.key);
        if (item.stable || !stability) return baseColor;

        // Create a unique pattern ID for each unstable series
        const patternId = `diagonalStripes-${d.key.replace(/\s+/g, "-")}`;

        // Create a new pattern for this specific color
        const pattern = defs
          .append("pattern")
          .attr("id", patternId)
          .attr("patternUnits", "userSpaceOnUse")
          .attr("width", 8)
          .attr("height", 8);

        // Set the background to the series color
        pattern
          .append("rect")
          .attr("width", 8)
          .attr("height", 8)
          .attr("fill", baseColor as any);

        // Add white diagonal stripes
        pattern
          .append("path")
          .attr("d", "M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .attr("opacity", 0.5);

        return `url(#${patternId})`;
      })
      .attr("opacity", (d: any) =>
        stackedData.find((item: any) => item.name === d.key).stable ? 1 : 0.9,
      )
      .attr("d", area)
      .style("stroke", (d: any) => color(d.key))
      .style("stroke-width", 1);

    // Update x-axis
    mainG
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(years.length).tickFormat(d3.format("d")))
      .call((g) => g.select(".domain").attr("stroke", "#888"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#888"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#666")
          .attr("x", -15)
          .style("font-size", "12px")
          .attr("transform", "rotate(-45)"),
      );

    // Update y-axis
    mainG
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(10)
          .tickFormat((d) => `$${d3.format(",")(d)}`),
      )
      .call((g) => g.select(".domain").attr("stroke", "#888"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#888"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#666")
          .style("font-size", "13px"),
      );

    // Add vertical guideline
    const guideline = mainG
      .append("line")
      .attr("class", "guideline")
      .style("stroke", "#999")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0);

    // Add hover functionality
    //
    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("pointer-events", "none");

    const formatCurrency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const mouseover = function(_: any, __: any) {
      tooltip.style("opacity", 1);
      guideline.style("opacity", 1);
    };

    const mousemove = function(event: any, _: any) {
      const [xPos] = d3.pointer(event);
      const year = Math.round(x.invert(xPos));
      const selectedData = processedData.find((d: any) => d.year === year);

      if (selectedData) {
        let tooltipContent = "";
        tooltipContent =
          keys
            .filter((key: any) => selectedData[key])
            .map(
              (key: any) =>
                `<div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; margin-bottom: 7px">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 20px; width: 100%;">
                  <div>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${key == "Taxes" ? "#000" : color(key)
                }; margin-right: 5px;"></span>
                    ${key}: 
                  </div>
                  <div>
                    <b>${formatCurrency.format(selectedData[key])}</b>
                  </div>
                </div>
              </div>`,
            )
            .join("") +
          `

                     <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; margin-bottom: 7px margin-top: 50px" class="mb-1">

              <div class="h-[1px] bg-black my-1"/>
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 20px; width: 100%;" class="mt-2">
                  <div class="ml-5">
                    <b>Total Spending: </b>
                  </div>
                  <div>
                    <b>${formatCurrency.format(keys.map((key: any) => selectedData[key]).reduce((a: any, b: any) => a + b, 0))}</b>
                  </div>
                </div>
              </div>`;
        if (needsFlag)
          tooltipContent += `<div style="display: flex; flex-direction:column; align-items: center; justify-content: space-between; font-size: 12px; margin-bottom: 7px margin-top: 50px" class="mb-1">
                              </div>
            `;

        const longevityContent = longevityFlag
          ? `<div class="text-xs mt-1 mb-2 text-gray-700 py-2 border-y border-black"><div><div class="text-black">Longevity</div> <div>${people?.map((person: any) => `${person.name} (${Math.round(1000 * (makeTable(person) as any).table.find((i: any) => i.year === year)?.probability) / 10}%)`).join(", ")}${people.length > 1
            ? `, <span>Joint: (${Math.round((jointTable(people[0], people[1]).find((i: any) => i.year === year)?.probability || 0) * 100)}%)</span>`
            : ""
          }</div></div></div>`
          : "";
        tooltip.html(
          `<div class="mb-4"><strong>Year: ${year}</strong><br>${longevityContent}${tooltipContent}</div>`,
        );

        // Calculate tooltip dimensions
        const tooltipNode = tooltip.node() as any;
        const tooltipRect = tooltipNode.getBoundingClientRect();
        // const containerRect = containerRef.current.getBoundingClientRect();

        const left = Math.min(
          xPos + margin.left + 15,
          width + margin.left - tooltipRect.width - 10,
        );

        // Position tooltip near bottom of chart
        const top = margin.top + height / 2 - tooltipRect.height / 2;

        tooltip.style("left", `${left}px`).style("top", `${top}px`);

        guideline
          .attr("x1", x(year))
          .attr("x2", x(year))
          .attr("y1", 0)
          .attr("y2", height);
      }
    };

    const mouseleave = function(_: any, __: any) {
      tooltip.style("opacity", 0);
      guideline.style("opacity", 0);
    };

    mainG
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    // Remove any existing legend containers

    // Add legend container
    const legendContainer = d3
      .select(containerRef.current)
      .append("div")
      .attr("class", "legend-container")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("flex-wrap", "wrap")
      .style("gap", "20px")
      .style("margin-top", "150px")
      .style("margin-right", "100px")
      .style("position", "absolute")
      .style("width", "calc(100%-20px)")
      .style("bottom", "-90px");

    // Add legend items

    // Use sortedDomain for legend order
    sortedDomain.forEach((key) => {
      if (key === "Spending") return null;
      const legendItem = legendContainer
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "5px");

      legendItem
        .append("div")
        .style("width", "15px")
        .style("height", "15px")
        .style(
          "background-color",
          key == "Taxes" ? "#000" : (color(key as any) as any),
        )
        .style("border-radius", "50%")
        .style(
          "opacity",
          stackedData.find((item: any) => item.name === key).stable ? 1 : 0.5,
        );

      legendItem
        .append("span")
        .style("font-size", "12px")
        .style(
          "text-decoration",
          hiddenSeries.has(key) ? "line-through" : "none",
        )
        .style("color", hiddenSeries.has(key) ? "#aaa" : "none")
        .style("cursor", "pointer")
        .text(key)
        .on("click", () => {
          const newHiddenSeries = new Set(hiddenSeries);
          if (hiddenSeries.has(key)) {
            newHiddenSeries.delete(key);
          } else {
            newHiddenSeries.add(key);
          }
          setHiddenSeries(newHiddenSeries);
        });
    });
  }, [
    dimensions,
    years,
    stackedData,
    hiddenSeries,
    colorArray,
    longevityFlag,
    maxY,
    needsFlag,
    people,
    spending,
    stability,
    years,
  ]);

  return (
    <div className="bg-white">
      <div
        ref={containerRef}
        style={{
          width: "calc(100% - 20px)",
          backgroundColor: "white",
          height: `${initialHeight - 50}px`,
          position: "relative",
          marginBottom: 100,
          marginLeft: 15,
        }}
      >
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};
//
// MainChart.propTypes = {
//   years: PropTypes.arrayOf(PropTypes.number).isRequired,
//   stackedData: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       values: PropTypes.arrayOf(PropTypes.number).isRequired,
//       stable: PropTypes.bool.isRequired,
//     }),
//   ).isRequired,
//   lineData: PropTypes.arrayOf(PropTypes.number),
//   spending: PropTypes.bool.isRequired,
//   stability: PropTypes.bool.isRequired,
//   needsFlag: PropTypes.bool.isRequired,
//   maxY: PropTypes.number,
//   initialHeight: PropTypes.number,
// };

export default SpendingChart;
