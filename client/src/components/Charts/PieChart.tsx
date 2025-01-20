import { useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChart = ({ data }: any) => {
  const svgRef = useRef(null);
  const colorArray = ["#002060", "#c00000", "#4471c4", "#00b050"];

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const legendHeight = 100;

    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height + legendHeight)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d: any) => d.label))
      .range(colorArray);

    // Pie generator
    const pie = d3
      .pie()
      .value((d: any) => d.value as any)
      .sort(null);

    // Arc generator
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 20);

    // Add pie slices
    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d: any) => color(d.data.label) as any);

    // Create temporary hidden text elements to measure widths
    const tempText = svg
      .append("g")
      .selectAll(".temp-text")
      .data(data)
      .enter()
      .append("text")
      .attr("font-size", 12)
      .text((d: any) => d.label)
      .style("visibility", "hidden");

    // Calculate widths
    const textWidths: any[] = [];
    tempText.each(function() {
      textWidths.push(this.getBBox().width);
    });
    tempText.remove();

    // Calculate total width needed and spacing
    const padding = 10;
    const rectWidth = 15;
    const textPadding = 5;
    const itemWidths = textWidths.map(
      (w) => w + rectWidth + textPadding + padding,
    );
    const totalWidth = itemWidths.reduce((a, b) => a + b, 0);

    // Add horizontal legend with dynamic spacing
    const legend = svg
      .append("g")
      .attr("transform", `translate(${-totalWidth / 2},${height / 2 + 20})`);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => {
        const offset = itemWidths.slice(0, i).reduce((a, b) => a + b, 0);
        return `translate(${offset},0)`;
      });

    legendItems
      .append("rect")
      .attr("width", rectWidth)
      .attr("height", 15)
      .attr("fill", (d: any) => color(d.label) as any);

    legendItems
      .append("text")
      .attr("x", rectWidth + textPadding)
      .attr("y", 12)
      .attr("font-size", 12)
      .text((d: any) => d.label);
  }, [data]);

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;
