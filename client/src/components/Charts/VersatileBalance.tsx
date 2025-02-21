import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { convertToParens, printNumber } from "src/utils";
import { CalculationRow } from "src/components/Calculators/Versatile/versatileTypes";

interface ChartData {
  label: string;
  data: CalculationRow[];
  returns: number[];
  color: string;
}

const D3TimeseriesChart = ({
  datasets,
  print,
  full,
}: {
  datasets: ChartData[];
  print: boolean;
  full?: boolean;
}) => {
  const svgRef = useRef<any>();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  useEffect(() => {
    d3.select(svgRef.current).selectAll(".tooltip").remove();

    document.querySelectorAll(".tooltip").forEach((el) => {
      el.remove();
    });
    if (!datasets || !datasets.length || !datasets[0].data.length) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const shownDatasets = datasets.filter((d) => !hiddenSeries.has(d.label));
    const largest = shownDatasets.length
      ? (d3.max(shownDatasets, (series) =>
          d3.max(series.data, (d) => d.endingBalance),
        ) as number)
      : (d3.max(datasets, (series) =>
          d3.max(series.data, (d) => d.endingBalance),
        ) as number) * 0.1;

    const margin = {
      top: 20,
      right: 0,
      bottom: 80,
      left: 50 + 12 * Math.log10(largest),
    };
    const width =
      (print ? 850 : full ? window.innerWidth * 0.9 : 1100) -
      margin.left -
      margin.right;
    const height =
      (print ? 500 : full ? window.innerHeight * 0.8 : 350) -
      margin.top -
      margin.bottom;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(datasets[0].data, (d) => d.year) as any)
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, largest * 1.05])
      .range([height, 0]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis and label
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#666")
          .style("font-size", "13px"),
      )
      .style("font-size", "13px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 30)
      .text("Years")
      .style("font-size", "18px");

    // Add Y axis and label
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d) => `$${d3.format(",")(d)}`)
          .ticks(7),
      )
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#666")
          .style("font-size", "13px"),
      )
      .style("font-size", "13px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .text("Balance")
      .style("font-size", "18px");

    const line = d3
      .line()
      .x((d: any) => x(d.year))
      .y((d: any) => y(d.endingBalance));

    // Add lines for each visible dataset
    datasets
      .filter((d) => !hiddenSeries.has(d.label))
      .forEach((series) => {
        svg
          .append("path")
          .datum(series.data)
          .attr("fill", "none")
          .attr("stroke", series.color)
          .attr("stroke-width", 2.5)
          .attr("d", line as any);
      });

    // Add legend at the bottom
    const legendItemWidth = 80;
    const legendItemHeight = 25;
    const itemsPerRow = Math.floor(width / legendItemWidth);

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, ${height + 65})`);

    datasets.forEach((series, i) => {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;

      const legendRow = legend
        .append("g")
        .attr(
          "transform",
          `translate(${col * legendItemWidth}, ${row * legendItemHeight})`,
        )
        .style("cursor", "pointer")
        .on("click", () => {
          const newHidden = new Set(hiddenSeries);
          if (hiddenSeries.has(series.label)) {
            newHidden.delete(series.label);
          } else {
            newHidden.add(series.label);
          }
          setHiddenSeries(newHidden);
        });

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", series.color)
        .style("opacity", hiddenSeries.has(series.label) ? 0.3 : 1);

      legendRow
        .append("text")
        .attr("x", 15)
        .attr("y", 9)
        .attr("font-size", "12px")
        .text(series.label)
        .style("opacity", hiddenSeries.has(series.label) ? 0.3 : 1);
    });

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "8px")
      .style("border", "1px solid black")
      .style("border-radius", "8px")
      .style("pointer-events", "none")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("opacity", 0);

    // Create vertical line for hover effect
    const vertical = svg
      .append("line")
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "4,4")
      .style("opacity", 0);

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => {
        vertical.style("opacity", 1);
        tooltip.style("opacity", 1);
      })
      .on("mouseout", () => {
        vertical.style("opacity", 0);
        tooltip.style("opacity", 0);
      })
      .on("mousemove", (event) => {
        const mouseX = d3.pointer(event)[0];
        const year = Math.round(x.invert(mouseX));
        const values: any[] = datasets
          .map((series) => {
            const d = series.data.find((d) => d.year === year);
            return {
              label: series.label,
              color: series.color,
              data: d,
              return: Math.round(series.returns[year - 1] * 100) / 100,
            };
          })
          .filter((d) => d.data);

        if (!values.length) return;

        vertical.attr("transform", `translate(${x(values[0]?.data?.year)},0)`);
        // Calculate tooltip dimensions and position
        const tooltipNode = tooltip.node() as HTMLElement;
        const tooltipRect = tooltipNode.getBoundingClientRect();
        const containerRect = svgRef.current.getBoundingClientRect();

        const left = Math.min(
          event.pageX + 10,
          containerRect.right - tooltipRect.width - 10,
        );

        tooltip.style("left", left + "px").style("top", event.pageY - 10 + "px")
          .html(`
            <div style="font-family: sans-serif; font-size: 14px;">
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 18px;">Year: ${year}</div>
              <div class="flex flex-col gap-1">
              ${values
                .map(
                  (v: any) => `
                <div style="" class="flex">
                  <strong style="width:120px; display:inline-block; color: ${v.color}">${v.label}:</strong>
                <div class="flex justify-between w-full">
                    ${printNumber(v.data.endingBalance)}
                    <span class="${v.data.return < 0 ? "text-red-500" : ""} font-semibold">
                        ${`${convertToParens(v.return.toString() + `%`)}`}
                    </span>
                </div>
                </div>
              `,
                )
                .join("")}
<div style="">
                  <strong style="width:70px; display:inline-block; color: ">Payment:</strong>                   <span class="">
                    ${printNumber(values[0]?.data?.totalPayments)}
                  </span>
                </div>
              </div>
            </div>
          `);
      })
      .on("wheel", (event) => {
        const mouseX = d3.pointer(event)[0];
        const year = Math.round(x.invert(mouseX));
        const values: any[] = datasets
          .map((series) => {
            const d = series.data.find((d) => d.year === year);
            return {
              label: series.label,
              color: series.color,
              data: d,
            };
          })
          .filter((d) => d.data);

        if (!values.length) return;

        vertical.attr("transform", `translate(${x(values[0]?.data?.year)},0)`);
        // Calculate tooltip dimensions and position
        const tooltipNode = tooltip.node() as HTMLElement;
        const tooltipRect = tooltipNode.getBoundingClientRect();
        const containerRect = svgRef.current.getBoundingClientRect();

        const left = Math.min(
          event.pageX + 10,
          containerRect.right - tooltipRect.width - 10,
        );

        tooltip.style("left", left + "px").style("top", event.pageY - 10 + "px")
          .html(`
            <div style="font-family: sans-serif; font-size: 14px;">
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 18px;">Year: ${year}</div>
              <div class="flex flex-col gap-1">
              ${values
                .map(
                  (v: any) => `
                <div style="">
                  <strong style="width:70px; display:inline-block; color: ${v.color}">${v.label}:</strong> ${printNumber(v.data.endingBalance)}
                  <span class="${v.data.return < 0 ? "text-red-500" : ""}">
                    ${printNumber(v.data.return)}
                  </span>
                </div>
              `,
                )
                .join("")}
<div style="">
                  <strong style="width:70px; display:inline-block; color: ">Payment:</strong>                   <span class="">
                    ${printNumber(values[0]?.data?.totalPayments)}
                  </span>
                </div>
              </div>
            </div>
          `);
      });

    d3.select(svgRef.current).selectAll(".tooltip").remove();
  }, [datasets, hiddenSeries]);

  return (
    <div className={`bg-white px-1 rounded-lg pb-2 ${print && "border "}`}>
      <svg ref={svgRef} />
    </div>
  );
};

export default D3TimeseriesChart;
