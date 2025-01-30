import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { printNumber } from "src/utils";

const D3TimeseriesChart = ({ data }: { data: any[] }) => {
  const svgRef = useRef<any>();

  useEffect(() => {
    if (!data || !data.length) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const largest = d3.max(data, (d) => d.endingBalance) as number;

    const margin = {
      top: 20,
      right: 40,
      bottom: 40,
      left: 50 + 12 * Math.log10(largest),
    };
    const width = 1050 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as any)
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.endingBalance) * 1.05])
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
      .attr("y", height + margin.bottom - 10)
      .text("Years")
      .style("font-size", "14px");

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
      .style("font-size", "20px");

    const line = d3
      .line()
      .x((d: any) => x(d.year))
      .y((d: any) => y(d.endingBalance));

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
        const bisect = d3.bisector((d: any) => d.year).left;
        const i = bisect(data, x0);
        const d0 = data[i - 1];
        const d1 = data[i];
        if (!d0 || !d1) return;
        const d = x0 - d0.year > d1.year - x0 ? d1 : d0;

        vertical.attr("transform", `translate(${x(d.year)},0)`);
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px").html(`
            <div style="font-family: sans-serif">
              <div style="font-weight: bold; margin-bottom: 4px">Year: ${d.year} (Age: ${d.age})</div>
              <div>Beginning Balance: ${printNumber(d.beginning)}</div>
              <div>Payment: ${printNumber(-d.totalPayments)}</div>
              <div>Investment fee: ${printNumber(-d.investmentFee)}</div>
              <div>Return: ${printNumber(d.return)}</div>
              <div>Taxes: ${printNumber(-d.taxes)}</div>
              <div>Ending Balance: ${printNumber(d.endingBalance)}</div>
            </div>
          `);
      });
  }, [data]);

  return (
    <div className="bg-white px-5 rounded-lg mb-5">
      <svg ref={svgRef} />
    </div>
  );
};

export default D3TimeseriesChart;
