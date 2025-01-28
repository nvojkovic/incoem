import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3TimeseriesChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.length) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 1200 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.time))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height, 0]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .style("font-size", "12px");

    svg.append("g").call(d3.axisLeft(y)).style("font-size", "12px");

    const line = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.value));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "8px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
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
        const x0 = x.invert(mouseX);
        const bisect = d3.bisector((d) => d.time).left;
        const i = bisect(data, x0);
        const d0 = data[i - 1];
        const d1 = data[i];
        if (!d0 || !d1) return;
        const d = x0 - d0.time > d1.time - x0 ? d1 : d0;

        vertical.attr("transform", `translate(${x(d.time)},0)`);
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .html(`Year: ${d.time}<br>Value: ${d.value}`);
      });
  }, [data]);

  return <svg ref={svgRef} />;
};

export default D3TimeseriesChart;
