// PieOrderStatus.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { useOrderStatus } from "../../hooks/useDashboard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieOrderStatus = () => {
  const { orderStatus, loading } = useOrderStatus();

  if (loading) return <p>Loading chart...</p>;

  // Prepare labels and data
  const labels = orderStatus.map((item) => item.status);
  const dataValues = orderStatus.map((item) => item.count);

  // Optional: Define colors for each status
  const backgroundColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8BC34A",
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const percentage = orderStatus[index].percentage.toFixed(2);
            return `${tooltipItem.label}: ${percentage}% (${tooltipItem.raw})`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full">
      <h2 className="text-xl mr-4 font-semibold">Tỉ lệ trạng thái đơn hàng</h2>
      <div style={{ width: "100%", height: "0 auto", margin: "0 auto" }}>
        <Pie
          data={data}
          options={{
            ...options,
            responsive: false,
            maintainAspectRatio: false,
          }}
          width={400}
          height={400}
        />
      </div>
    </div>
  );
};

export default PieOrderStatus;
