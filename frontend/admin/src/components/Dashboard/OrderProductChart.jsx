import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useChartOrderProduct } from "../../hooks/useDashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsChart = () => {
  // Tính toán năm hiện tại và năm cuối cùng (năm hiện tại + 1)
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear;
  const startYear = 2021;

  // Tạo mảng các năm từ 2021 đến năm hiện tại + 1
  const years = Array.from(
    { length: lastYear - startYear + 1 },
    (_, index) => startYear + index
  );

  const [year, setYear] = useState(currentYear); // Mặc định là năm hiện tại

  // Fetch dữ liệu từ hook
  const { data, loading } = useChartOrderProduct(year);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Chuẩn bị dữ liệu cho chart
  const chartData = {
    labels: [
      "tháng 1",
      "tháng 2",
      "tháng 3",
      "tháng 4",
      "tháng 5",
      "tháng 6",
      "tháng 7",
      "tháng 8",
      "tháng 9",
      "tháng 10",
      "tháng 11",
      "tháng 12",
    ],
    datasets: [
      {
        label: "Đơn hàng",
        data: data.map((item) => item.totalOrders), // Giả sử totalOrders có trong dữ liệu
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Sản phẩm",
        data: data.map((item) => item.totalProducts), // Giả sử totalProducts có trong dữ liệu
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="">
      <div className="flex items-center mb-4">
        <h3 className="text-xl mr-4 font-semibold">
          Thống kê Đơn hàng & Sản phẩm
        </h3>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          {years.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </div>
      <div
        className="bg-white p-6 rounded-lg w-full"
        style={{ width: "100%", height: "0 auto" }}
      >
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default StatisticsChart;
