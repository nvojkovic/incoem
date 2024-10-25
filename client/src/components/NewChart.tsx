import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

const StackedAreaChart = ({ years, stackedData, lineData }: any) => {
  const svgRef = useRef() as any;
  const containerRef = useRef() as any;
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });

  // Custom color array (removed gray array)
  // const colorArray = [
  //   "#77AADD",
  //   "#EE8866",
  //   "#EEDD88",
  //   "#FFAABB",
  //   "#99DDFF",
  //   "#44BB99",
  //   "#BBCC33",
  //   "#AAAA00",
  // ];
  const color = d3.scaleSequential(d3.interpolateSinebow);
  const colorArray = [
    "#ff000066",
    color(0.3),
    color(0.2),
    color(0.1),
    color(0.4),
    color(0.6),
    color(0.7),
    color(0.8),
    color(0.9),
  ];

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: 500,
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (
      dimensions.width === 0 ||
      !years.length ||
      !stackedData.length //||
      // !lineData.length
    )
      return;

    const margin = { top: 40, right: 30, bottom: 80, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    svgRef.current.innerHtml = "";
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Sort stackedData to put unstable incomes on top
    stackedData.sort((a: any, b: any) =>
      a.stable === b.stable ? 0 : a.stable ? -1 : 1,
    );

    // Process data
    const processedData = years.map((year: any, index: any) => {
      const yearData = { year } as any;
      stackedData.forEach((item: any) => {
        yearData[item.name] = item.values[index];
      });
      return yearData;
    });

    const keys = stackedData.map((d: any) => d.name) as any;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(years) as any)
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          (d3 as any).max(processedData as any, (d: any) => {
            return d3.sum(keys, (key: any) => d[key]);
          }),
          lineData ? Math.max(...lineData) : 0,
        ) * 1.1,
      ])
      .range([height, 0]);

    // Updated color scale using only colorArray
    const color = d3.scaleOrdinal().domain(keys).range(colorArray);

    const stackGenerator = d3.stack().keys(keys);
    const layers = stackGenerator(processedData);

    const area = d3
      .area()
      .x((d: any) => x(d.data.year))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBumpX);

    (svg as any)
      .selectAll("path.area")
      .data(layers)
      .join("path")
      .attr("class", "area")
      .attr("fill", (d: any) => color(d.key))
      .attr("opacity", (d: any) =>
        stackedData.find((item: any) => item.name === d.key).stable ? 1 : 0.9,
      )
      .attr("d", area);

    const line = d3
      .line()
      .x((_, i) => x(years[i]))
      .y((d: any) => y(d))
      .curve(d3.curveBumpX);

    if (lineData)
      svg
        .append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 5)
        .attr("d", line);

    // Update x-axis
    svg
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
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `$${d3.format(",")(d)}`),
      )
      .call((g) => g.select(".domain").attr("stroke", "#888"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#888"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#666")
          .style("font-size", "12px"),
      );

    // Add vertical guideline
    const guideline = svg
      .append("line")
      .attr("class", "guideline")
      .style("stroke", "#999")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0);

    // Add hover functionality
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

    const mouseover = function (_: any, __: any) {
      tooltip.style("opacity", 1);
      guideline.style("opacity", 1);
    };

    const mousemove = function (event: any, _: any) {
      const [xPos] = d3.pointer(event);
      const year = Math.round(x.invert(xPos));
      const selectedData = processedData.find((d: any) => d.year === year);

      if (selectedData) {
        const tooltipContent =
          keys
            .map(
              (key: any) =>
                `<div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; margin-bottom: 7px">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 20px;">
                  <div>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${color(key)}; margin-right: 5px;"></span>
                    ${key}: 
                  </div>
                  <div>
                    <b>${formatCurrency.format(selectedData[key])}</b>
                  </div>
                </div>
              </div>`,
            )
            .join("") +
          `<div style="font-size:12px;display:flex;justify-content:space-between;align-items: center;">
            <div>
            <span style="display: inline-block; font-size: 12px; width: 10px; height: 10px; border-radius: 50%; background-color: red; margin-right: 5px;"></span>
            </div>
            <div style="">
          <div style="font-size:12px;display:flex;justify-content:space-between;align-items: center;width:100%">
            <b>Spending</b>: ${formatCurrency.format(lineData[years.indexOf(year)])}
            </div>
            </div>
          </div>`;

        tooltip.html(`<strong>Year: ${year}</strong><br>${tooltipContent}`);

        // Calculate tooltip dimensions
        const tooltipNode = tooltip.node() as any;
        const tooltipRect = tooltipNode.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        let left = event.pageX - containerRect.left + 15;
        let top = event.pageY - containerRect.top - 10;

        // Adjust horizontal position if too close to the right edge
        if (left + tooltipRect.width > containerRect.width) {
          left = containerRect.width - tooltipRect.width - 10;
        }

        // Adjust vertical position if too close to the bottom edge
        if (top + tooltipRect.height > containerRect.height) {
          top = containerRect.height - tooltipRect.height - 10 - 100;
        }

        tooltip.style("left", `${left}px`).style("top", `${top}px`);

        guideline
          .attr("x1", x(year))
          .attr("x2", x(year))
          .attr("y1", 0)
          .attr("y2", height);
      }
    };

    const mouseleave = function (_: any, __: any) {
      tooltip.style("opacity", 0);
      guideline.style("opacity", 0);
    };

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    // Add legend container
    const legendContainer = d3
      .select(containerRef.current)
      .append("div")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("flex-wrap", "wrap")
      .style("gap", "20px")
      .style("margin-top", "10px")
      .style("position", "absolute")
      .style("width", "100%")
      .style("bottom", "20px");

    // Add legend items
    keys.forEach((key) => {
      const legendItem = legendContainer
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "5px");

      legendItem
        .append("div")
        .style("width", "10px")
        .style("height", "10px")
        .style("background-color", color(key))
        .style("border-radius", "50%")
        .style("opacity", stackedData.find((item: any) => item.name === key).stable ? 1 : 0.5);

      legendItem
        .append("span")
        .style("font-size", "12px")
        .text(key);
    });

    // Add line to legend if lineData exists
    if (lineData?.length) {
      const lineItem = legendContainer
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "5px");

      lineItem
        .append("div")
        .style("width", "10px")
        .style("height", "10px")
        .style("background-color", "red")
        .style("border-radius", "50%");

      lineItem
        .append("span")
        .style("font-size", "12px")
        .text("Spending");
    }
  }, [dimensions, years, stackedData, lineData]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "450px", position: "relative" }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
};

StackedAreaChart.propTypes = {
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  stackedData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(PropTypes.number).isRequired,
      stable: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  lineData: PropTypes.arrayOf(PropTypes.number),
};

export default StackedAreaChart;
