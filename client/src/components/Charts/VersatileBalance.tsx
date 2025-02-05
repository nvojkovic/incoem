import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { convertToParens, printNumber } from "src/utils";
import { CalculationRow } from "../Calculators/versatileTypes";

interface ChartData {
  label: string;
  data: CalculationRow[];
  returns: number[];
  color: string;
}

const D3TimeseriesChart = ({ datasets }: { datasets: ChartData[] }) => {
  const svgRef = useRef<any>();
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(
    new Set(datasets.map(d => d.label))
  );

  useEffect(() => {
    d3.select(svgRef.current).selectAll(".tooltip").remove();

    document.querySelectorAll(".tooltip").forEach((el) => {
      el.remove();
    });
    if (!datasets || !datasets.length || !datasets[0].data.length) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const largest = d3.max(datasets, (series) =>
      d3.max(series.data, (d) => d.endingBalance),
    ) as number;

    const margin = {
      top: 20,
      right: 40,
      bottom: 40,
      left: 50 + 12 * Math.log10(largest),
    };
    const width = 1050 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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
      .style("font-size", "15px");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom + 0)
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
      .style("font-size", "16px");

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
    datasets.filter(d => visibleSeries.has(d.label)).forEach((series) => {
      svg
        .append("path")
        .datum(series.data)
        .attr("fill", "none")
        .attr("stroke", series.color)
        .attr("stroke-width", 2.5)
        .attr("d", line as any);
    });

    // Add legend at the bottom
    const legendItemWidth = 120;
    const legendItemHeight = 25;
    const legendRows = Math.ceil(datasets.length * legendItemWidth / width);
    const itemsPerRow = Math.floor(width / legendItemWidth);
    
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, ${height + 30})`);

    datasets.forEach((series, i) => {
      const row = Math.floor(i / itemsPerRow);
      const col = i % itemsPerRow;
      
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(${col * legendItemWidth}, ${row * legendItemHeight})`)
        .style("cursor", "pointer")
        .on("click", () => {
          const newVisible = new Set(visibleSeries);
          if (newVisible.has(series.label)) {
            newVisible.delete(series.label);
          } else {
            newVisible.add(series.label);
          }
          setVisibleSeries(newVisible);
        });

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", series.color)
        .style("opacity", visibleSeries.has(series.label) ? 1 : 0.3);

      legendRow
        .append("text")
        .attr("x", 15)
        .attr("y", 9)
        .attr("font-size", "12px")
        .text(series.label)
        .style("opacity", visibleSeries.has(series.label) ? 1 : 0.3);
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
          containerRect.right - tooltipRect.width - 10
        );

        tooltip
          .style("left", left + "px")
          .style("top", event.pageY - 10 + "px").html(`
            <div style="font-family: sans-serif; font-size: 14px;">
              <div style="font-weight: bold; margin-bottom: 4px; font-size: 18px;">Year: ${year}</div>
              <div class="flex flex-col gap-1">
              ${values
              .map(
                (v: any) => `
                <div style="">
                  <strong style="width:70px; display:inline-block; color: ${v.color}">${v.label}:</strong> ${printNumber(v.data.endingBalance)}
                  <span class="${v.data.return < 0 ? "text-red-500" : ""}">
                      ${`${convertToParens(v.return.toString() + `%`)}`}
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
          containerRect.right - tooltipRect.width - 10
        );

        tooltip
          .style("left", left + "px")
          .style("top", event.pageY - 10 + "px").html(`
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
  }, [datasets]);

  return (
    <div className="bg-white px-5 rounded-lg pb-5">
      <svg ref={svgRef} />
    </div>
  );
};

export default D3TimeseriesChart;
