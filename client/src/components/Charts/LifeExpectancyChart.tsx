import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  person1Data?: number[];
  person2Data?: number[];
  jointData?: number[];
  startYear?: number;
  person1Name?: string;
  person2Name?: string;
}

const SurvivalChart = ({
  person1Data = [],
  person2Data = [],
  jointData = [],
  startYear = new Date().getFullYear(),
  person1Name = "Person 1",
  person2Name = "Person 2",
}: Props) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!person1Data.length) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 85, left: 80 };
    const width = 900 - margin.left - margin.right;
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
      .domain([
        startYear,
        startYear + Math.max(person1Data.length, person2Data.length || 0) - 1,
      ])
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    // Create line generators
    const line = d3
      .line()
      .x((_, i) => xScale(startYear + i))
      .y((d) => yScale(d as any));

    // Add grid lines with lighter color
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .attr("stroke", "#e5e5e5")
      .call(
        d3
          .axisBottom(xScale)
          .ticks(10)
          .tickSize(-height)
          .tickFormat("" as any),
      )
      .selectAll("line") // Select all the lines within the grid
      .attr("stroke", "#e5e5e5"); // Apply the stroke color to the lines specifically

    svg
      .append("g")
      .attr("class", "grid")
      .attr("stroke", "#e5e5e5")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(10)
          .tickSize(-width)
          .tickFormat("" as any),
      )
      .selectAll("line") // Select all the lines within the grid
      .attr("stroke", "#e5e5e5"); // Apply the stroke color to the lines specifically

    // Add lines
    svg
      .append("path")
      .datum(person1Data)
      .attr("fill", "none")
      .attr("stroke", "#ff6b6b")
      .attr("stroke-width", 2)
      .attr("d", line as any);

    if (person2Data.length > 0) {
      svg
        .append("path")
        .datum(person2Data)
        .attr("fill", "none")
        .attr("stroke", "#70ba1c")
        .attr("stroke-width", 2)
        .attr("d", line as any);

      if (jointData.length > 0) {
        svg
          .append("path")
          .datum(jointData)
          .attr("fill", "none")
          .attr("stroke", "#45b7d1")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("d", line as any);

        // Add the "at least one alive" line
        svg
          .append("path")
          .datum(
            person2Data.map(
              (_, i) => 1 - (1 - person1Data[i]) * (1 - person2Data[i]),
            ),
          )
          .attr("fill", "none")
          .attr("stroke", "#9c27b0")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("d", line as any);
      }
    }

    // Add tooltip
    const tooltip = d3
      .select(svgRef.current.parentNode)
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

    // Add guideline
    const guideline = svg
      .append("line")
      .attr("class", "guideline")
      .style("stroke", "#999")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0);

    const mouseover = function(_: any, __: any) {
      tooltip.style("opacity", 1);
      guideline.style("opacity", 1);
    };

    const mousemove = function(event: any) {
      const [xPos] = d3.pointer(event);
      const year = Math.round(xScale.invert(xPos));
      const index = year - startYear;
      
      if (index >= 0 && index < person1Data.length) {
        const prob1 = person1Data[index];
        const prob2 = person2Data.length ? person2Data[index] : null;
        const jointProb = jointData.length ? jointData[index] : null;
        const atLeastOneProb = prob2 !== null ? 1 - (1 - prob1) * (1 - prob2) : null;

        let tooltipContent = `<div style="font-size: 12px;">
          <strong>Year: ${year}</strong><br/>
          <div style="margin-top: 5px;">
            <span style="color: #ff6b6b">${person1Name}: ${(prob1 * 100).toFixed(1)}%</span>
          </div>`;

        if (prob2 !== null) {
          tooltipContent += `
            <div>
              <span style="color: #70ba1c">${person2Name}: ${(prob2 * 100).toFixed(1)}%</span>
            </div>`;
        }

        if (jointProb !== null) {
          tooltipContent += `
            <div>
              <span style="color: #45b7d1">Both Alive: ${(jointProb * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span style="color: #9c27b0">At Least One: ${(atLeastOneProb! * 100).toFixed(1)}%</span>
            </div>`;
        }

        tooltipContent += '</div>';

        tooltip.html(tooltipContent);

        // Position tooltip
        const svgRect = svgRef.current.getBoundingClientRect();
        const tooltipNode = tooltip.node() as HTMLElement;
        const tooltipRect = tooltipNode.getBoundingClientRect();

        const left = Math.min(
          xScale(year) + margin.left + 15,
          width + margin.left - tooltipRect.width - 10
        );
        
        // Position tooltip vertically in middle of chart
        const top = margin.top + (height / 2) - (tooltipRect.height / 2);

        tooltip.style("left", `${left}px`).style("top", `${top}px`);

        // Update guideline position
        guideline
          .attr("x1", xScale(year))
          .attr("x2", xScale(year))
          .attr("y1", 0)
          .attr("y2", height);
      }
    };

    const mouseleave = function() {
      tooltip.style("opacity", 0);
      guideline.style("opacity", 0);
    };

    // Add invisible overlay for mouse events
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    // Add axes
    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")); // Format as decimal number

    const yAxis = d3.axisLeft(yScale).tickFormat((d: any) => `${d * 100}%`);

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
      legendData.push({ color: "#70ba1c", text: person2Name });
      if (jointData.length > 0) {
        legendData.push({ color: "#45b7d1", text: "Both Alive" });
        legendData.push({ color: "#9c27b0", text: "At Least One Alive" });
      }
    }

    const legendWidth = 400 / legendData.length;

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
        (_: any, i) =>
          `translate(${(i + 0.5) * legendWidth + 195},${height + 70})`,
      );

    legend
      .append("line")
      .attr("x1", -20)
      .attr("x2", 20)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) =>
        d.text === "Both Alive" || d.text === "At Least One Alive"
          ? "5,5"
          : "none",
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
