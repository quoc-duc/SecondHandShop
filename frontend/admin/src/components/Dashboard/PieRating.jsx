// PieRatingChart.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { useRatingProduct } from "../../hooks/useDashboard";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieRatingChart = () => {
  const { ratingProduct, loading } = useRatingProduct();

  if (loading) return <p>Loading rating chart...</p>;

  // Parse data into arrays
  const labels = [];
  const dataValues = [];

  for (let star = 1; star <= 5; star++) {
    const percentage = parseFloat(ratingProduct?.data?.[star] || 0);
    if (percentage > 0) {
      labels.push(`${star} ★ `);
      dataValues.push(percentage);
    }
  }

  const backgroundColors = [
    "#ff7675", // 1 star
    "#fdcb6e", // 2 stars
    "#ffeaa7", // 3 stars
    "#74b9ff", // 4 stars
    "#55efc4", // 5 stars
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors.slice(5 - labels.length),
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
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full">
      <h2 className="text-xl mr-4 font-semibold">Tỉ lệ đánh giá sản phẩm</h2>
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

export default PieRatingChart;
