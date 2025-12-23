import { useState } from "react";
import { useTopOrderProduct } from "../../hooks/useDashboard";

const TopTenBuyer = () => {
  const [month, setMonth] = useState(6);
  const [year, setYear] = useState(2025);
  const { topOrderProducts, loading, error } = useTopOrderProduct(month, year);

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  return (
    <div className="">
      <div className="flex gap-4 mb-4">
        <h2 className="text-xl font-semibold">Top 10 Người Mua Hàng</h2>
        <select
          value={month}
          onChange={handleMonthChange}
          className="border p-1 rounded"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={handleYearChange}
          className="border p-1 rounded"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
      </div>
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {/* Product Table */}
      {!loading && !error && (
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Người mua</th>
              {/* <th className="px-4 py-2 text-left">Image</th> */}
              <th className="px-4 py-2 text-center">Số lượng đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            {topOrderProducts.map((buyer, index) => (
              <tr key={index + 1} className="border-t">
                <td className="px-4 py-2 text-sm text-gray-800 flex items-center">
                  {buyer.name} ({buyer.username})
                </td>
                {/* <td className="px-4 py-2">
                  
                </td> */}
                <td className="px-4 py-2 text-sm text-gray-600 text-center">
                  {buyer.orderCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TopTenBuyer;
