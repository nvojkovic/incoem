import Chart from "react-apexcharts";

function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
const StackedChart = ({ years, incomes }: any) => {
  const options = {
    width: "1000px",
    redrawOnWindowResize: true,
    // colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
    chart: {
      type: "area",
      stacked: true,
      events: {
        mounted: (chart: any) => {
          chart.windowResizeHandler();
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: years,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    yaxis: {
      labels: {
        formatter: (value: any) => {
          return `$${numberWithCommas(value)}`;
        },
      },
    },
  };

  console.log("drawing", incomes);
  return (
    <Chart options={options as any} series={incomes} type="area" height={500} />
  );
};

export default StackedChart;
