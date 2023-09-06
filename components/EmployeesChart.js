import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeesChart = () => {
  const { activeCount, suspendedCount } = useSelector(
    (state) => state.employeesAllData
  );
  const countData = [activeCount, suspendedCount];
  const data = {
    labels: ["Active Employees", "Suspended Employees"],
    datasets: [
      {
        data: countData,
        backgroundColor: ["#42a5f5", "#e57373"],
        borderColor: ["white"],
        borderWidth: 2,
      },
    ],
  };
  const options = {
    plugins: {
      datalabels: {
        clamp: false,
        display: "auto",
        borderRadius: 4,
        color: "white",
        font: {
          weight: "bold",
        },

        padding: 6,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      arc: {
        spacing: 0.03,
      },
    },
  };

  return (
    <div>
      <Pie data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default EmployeesChart;
