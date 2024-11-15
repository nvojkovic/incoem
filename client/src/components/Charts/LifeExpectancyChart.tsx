import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const SurvivalChart = ({
  person1Data = [],
  person2Data = [],
  jointData = [],
  startYear = new Date().getFullYear(),
  person1Name = "Person 1",
  person2Name = "Person 2",
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!person1Data.length) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([startYear, startYear + person1Data.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    // Create line generators
    const line = d3
      .line()
      .x((d, i) => xScale(startYear + i))
      .y((d) => yScale(d));

    // Add grid lines with lighter color
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .attr("stroke", "#e5e5e5")
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-height).tickFormat(""))
      .selectAll("line") // Select all the lines within the grid
      .attr("stroke", "#e5e5e5"); // Apply the stroke color to the lines specifically

    svg
      .append("g")
      .attr("class", "grid")
      .attr("stroke", "#e5e5e5")
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat(""))
      .selectAll("line") // Select all the lines within the grid
      .attr("stroke", "#e5e5e5"); // Apply the stroke color to the lines specifically

    // Add lines
    svg
      .append("path")
      .datum(person1Data)
      .attr("fill", "none")
      .attr("stroke", "#ff6b6b")
      .attr("stroke-width", 2)
      .attr("d", line);

    if (person2Data.length > 0) {
      svg
        .append("path")
        .datum(person2Data)
        .attr("fill", "none")
        .attr("stroke", "#4ecdc4")
        .attr("stroke-width", 2)
        .attr("d", line);

      if (jointData.length > 0) {
        svg
          .append("path")
          .datum(jointData)
          .attr("fill", "none")
          .attr("stroke", "#45b7d1")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("d", line);

        // Add the "at least one alive" line
        svg
          .append("path")
          .datum(person2Data.map((_, i) => 1 - (1 - person1Data[i]) * (1 - person2Data[i])))
          .attr("fill", "none")
          .attr("stroke", "#9c27b0")
          .attr("stroke-width", 2)
          .attr("d", line);
      }
    }

    // Add axes
    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")); // Format as decimal number

    const yAxis = d3.axisLeft(yScale).tickFormat((d) => `${d * 100}%`);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .call((g) => g.select(".domain").attr("stroke", "#888"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#888"))
      .call((g) => g.selectAll(".tick text").attr("fill", "#666").attr("x"));
    svg
      .append("g")
      .call(yAxis)
      .call((g) => g.select(".domain").attr("stroke", "#888"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#888"))
      .call((g) => g.selectAll(".tick text").attr("fill", "#666").attr("x"));

    // Add labels
    svg
      .append("text")
      .attr("transform", `translate(${width / 2},${height + 40})`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Year");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Survival Probability");

    // Create legend data based on available data
    const legendData = [{ color: "#ff6b6b", text: person1Name }];

    if (person2Data.length > 0) {
      legendData.push({ color: "#4ecdc4", text: person2Name });
      if (jointData.length > 0) {
        legendData.push({ color: "#45b7d1", text: "Joint Survival" });
        legendData.push({ color: "#9c27b0", text: "At Least One Alive" });
      }
    }

    // Add legend at the bottom
    const legendHeight = 40;
    const legendWidth = width / legendData.length;

    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .selectAll("g")
      .data(legendData)
      .join("g")
      .attr(
        "transform",
        (d, i) => `translate(${(i + 0.5) * legendWidth},${height + 70})`,
      );

    legend
      .append("line")
      .attr("x1", -20)
      .attr("x2", 20)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) =>
        d.text === "Joint Survival" ? "5,5" : "none",
      );

    legend
      .append("text")
      .attr("y", -8)
      .text((d) => d.text);
  }, [
    person1Data,
    person2Data,
    jointData,
    startYear,
    person1Name,
    person2Name,
  ]);

  return (
    <div className="w-full h-full bg-white rounded-lg border shadow-md max-h-[500px]">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default SurvivalChart;
