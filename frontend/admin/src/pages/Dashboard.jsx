import TopTenBuyer from "../components/Dashboard/TopTenOrder.jsx";
import ChartUserYears from "../components/Dashboard/ChartUserYears.jsx";
import OrderProductChart from "../components/Dashboard/OrderProductChart.jsx";
import TopTenSeller from "../components/Dashboard/TopTenSellerProduct.jsx";
import PieOrderStatus from "../components/Dashboard/PieOrderStatus.jsx";
import PieRatingChart from "../components/Dashboard/PieRating.jsx";

const Dashboard = () => {
  return (
    <div className="w-5/6 ml-[16.6666%] items-stretch p-4 bg-gray-100 rounded-md ">
      <div className="flex justify-between items-stretch mb-2">
        <div className="w-1/2 p-2 mr-2 bg-white rounded-lg flex flex-col">
          <TopTenBuyer />
        </div>
        <div className="w-1/2 p-2 bg-white rounded-lg flex flex-col">
          <TopTenSeller />
        </div>
      </div>
      <div className="flex justify-between items-stretch mb-2">
        <div className="w-1/2 p-2 mr-2 bg-white rounded-lg flex flex-col">
          <ChartUserYears />
        </div>
        <div className="w-1/2 p-2 bg-white rounded-lg flex flex-col">
          <OrderProductChart />
        </div>
      </div>
      <div className="flex p-4 bg-white mb-2 rounded-lg">
        <PieOrderStatus />

        <PieRatingChart />
      </div>
    </div>
  );
};

export default Dashboard;
