import { useEffect, useRef } from "react";
import * as d3 from "d3";

const InvestmentChart = ({ data }: any) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate data points
    // const data = [];
    // let balance = initialBalance;
    //
    // for (let year = 0; year <= years; year++) {
    //   const yearlyReturn = balance * returnRate;
    //   const yearlyTax = yearlyReturn * taxRate;
    //   const residual = yearlyReturn - yearlyTax - yearlyPayment;
    //
    //   data.push({
    //     year,
    //     balance,
    //     tax: yearlyTax,
    //     payment: yearlyPayment,
    //     residual,
    //   });
    //
    //   balance = balance + residual;
    // }

    // Set up dimensions
    const margin = { top: 20, right: 60, bottom: 200, left: 60 };
    const width = 1200 - margin.left - margin.right;
    const baseHeight = 600 - margin.top - margin.bottom;

    // Calculate the proportion of space needed for negative values
    const maxPositiveStack: any = d3.max(
      data,
      (d: any) => d.tax + d.payment + Math.max(0, d.residual),
    );
    const minNegativeValue: any = d3.min(data, (d: any) =>
      Math.min(0, d.residual),
    );
    const totalRange = maxPositiveStack - minNegativeValue;
    const negativeRatio =
      minNegativeValue < 0 ? Math.abs(minNegativeValue) / totalRange : 0;

    // Adjust height to accommodate negative values
    const height = baseHeight / (1 - negativeRatio);
    const zeroY = baseHeight; // This keeps x-axis at the original height

    // Create SVG with extra space for negative values
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", baseHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales with padding for bars
    const x = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([20, width - 20]); // Add padding on both sides

    const y1 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.balance as any) as any])
      .range([zeroY, 0]);

    const factor = height / 3000;
    console.log("fact", zeroY, height, factor);
    const y2 = d3
      .scaleLinear()
      .domain([minNegativeValue, maxPositiveStack])
      .range([zeroY + (height - zeroY) * factor, 200]);

    // Create axes
    const xAxis = d3.axisBottom(x);
    const y1Axis = d3
      .axisLeft(y1)
      .tickFormat((d) => `$${d3.format(",.0f")(d)}`);
    const y2Axis = d3
      .axisRight(y2)
      .tickFormat((d) => `$${d3.format(",.0f")(d)}`);

    // Draw zero line if we have negative values
    if (minNegativeValue < 0) {
      svg
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y2(0))
        .attr("y2", y2(0))
        .attr("stroke", "#666")
        .attr("stroke-dasharray", "2,2");
    }

    // Draw x-axis at zero point
    svg.append("g").attr("transform", `translate(0,${zeroY})`).call(xAxis);

    // Draw y axes
    svg.append("g").call(y1Axis);

    svg.append("g").attr("transform", `translate(${width},0)`).call(y2Axis);

    // Draw zero line
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", zeroY)
      .attr("y2", zeroY)
      .attr("stroke", "#666")
      .attr("stroke-opacity", 0.5);

    // Draw balance line

    // Draw bars
    data.forEach((d: any) => {
      const barWidth = 20;

      if (d.residual >= 0) {
        // Draw positive stack from bottom up
        svg
          .append("rect") // Residual
          .attr("x", x(d.year) - barWidth / 2)
          .attr("y", y2(d.residual))
          .attr("width", barWidth)
          .attr("height", y2(0) - y2(d.residual))
          .attr("fill", "#9999ff")
          .attr("opacity", 0.7);

        svg
          .append("rect") // Payment
          .attr("x", x(d.year) - barWidth / 2)
          .attr("y", y2(0))
          .attr("width", barWidth)
          .attr("height", y2(d.residual) - y2(d.residual + d.payment))
          .attr("fill", "#99ff99")
          .attr("opacity", 0.7);

        svg
          .append("rect") // Tax
          .attr("x", x(d.year) - barWidth / 2)
          .attr("y", y2(d.residual + d.payment + d.tax))
          .attr("width", barWidth)
          .attr(
            "height",
            y2(d.residual + d.payment) - y2(d.residual + d.payment + d.tax),
          )
          .attr("fill", "#ff9999")
          .attr("opacity", 0.7);
      } else {
        // Draw negative residual down from zero
        svg
          .append("rect") // Residual below zero
          .attr("x", x(d.year) - barWidth / 2)
          .attr("y", y2(0))
          .attr("width", barWidth)
          .attr("height", y2(d.residual) - y2(0))
          .attr("fill", "#9999ff")
          .attr("opacity", 0.7);

        // Draw positive components up from zero
        svg
          .append("rect") // Payment
          .attr("x", x(d.year) - barWidth / 2)
          .attr("y", y2(d.payment))
          .attr("width", barWidth)
          .attr("height", y2(0) - y2(d.payment))
          .attr("fill", "#99ff99")
          .attr("opacity", 0.7);

        svg
          .append("rect") // Tax
          .attr("x", x(d.year) - barWidth / 2)
          .attr("y", y2(d.payment + d.tax))
          .attr("width", barWidth)
          .attr("height", y2(d.payment) - y2(d.payment + d.tax))
          .attr("fill", "#ff9999")
          .attr("opacity", 0.7);
      }
    });

    // Add labels
    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Balance ($)");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .attr("text-anchor", "middle")
      .text("Years");

    svg
      .append("text")
      .attr("x", height / 2)
      .attr("y", width + margin.right - 15)
      .attr("transform", "rotate(90)")
      .attr("text-anchor", "middle")
      .text("Yearly Components ($)");

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 100}, 0)`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "steelblue");
    legend.append("text").attr("x", 15).attr("y", 9).text("Balance");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#9999ff");
    legend.append("text").attr("x", 15).attr("y", 29).text("Residual");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 40)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#99ff99");
    legend.append("text").attr("x", 15).attr("y", 49).text("Payment");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 60)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "#ff9999");
    legend.append("text").attr("x", 15).attr("y", 69).text("Taxes");

    const line = d3
      .line()
      .x((d: any) => x(d.year))
      .y((d: any) => y1(d.balance));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }, [data]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default InvestmentChart;
