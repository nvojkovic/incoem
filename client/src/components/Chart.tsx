import Chart from "react-apexcharts";

function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
const StackedChart = ({ years, incomes }: any) => {
  const options = {
    width: "1000px",
    redrawOnWindowResize: true,
    chart: {
      type: "area",
      stacked: true,
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

  return (
    <Chart options={options as any} series={incomes} type="area" height={500} />
  );
};

export default StackedChart;
