import { useState, useEffect } from "react";
import axios from "axios";

export const useChart = (year) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/admin/statistics/yearly-users?year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.data;
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return { data, loading };
};

export const useChartOrderProduct = (year) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/admin/statistics-order-product?year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = response.data;
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return { data, loading };
};

// export const useTopSellingProducts = (timeFrame) => {
//   const [topProducts, setTopProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTopProducts = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `http://localhost:5555/admin/top-selling-products`,
//           {
//             params: { timeFrame },
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setTopProducts(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     if (timeFrame) {
//       fetchTopProducts();
//     }
//   }, [timeFrame]);

//   return { topProducts, loading, error };
// };

export const useTopOrderProduct = (month, year) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topOrderProducts, setTopOrderProducts] = useState([]);

  useEffect(() => {
    const fetchTopOrderProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:5555/admin/top-user-order`,
          {
            params: { month, year },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        if (data.success && Array.isArray(data.data)) {
          setTopOrderProducts(data.data);
          setLoading(false);
          setError(null);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    if (month && year) {
      fetchTopOrderProducts();
    }
  }, [month, year]);
  return { topOrderProducts, loading, error };
};

export const useTopSellerProduct = (month, year) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topSellerProducts, setTopSellerProducts] = useState([]);

  useEffect(() => {
    const fetchTopSellerProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:5555/admin/top-user-product-post`,
          {
            params: { month, year },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        if (data.success && Array.isArray(data.data)) {
          setTopSellerProducts(data.data);
          setLoading(false);
          setError(null);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    if (month && year) {
      fetchTopSellerProducts();
    }
  }, [month, year]);
  return { topSellerProducts, loading, error };
};

export const useOrderStatus = () => {
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/admin/orders/status-chart`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.data;
        setOrderStatus(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { orderStatus, loading };
};

export const useRatingProduct = () => {
  const [ratingProduct, setRatingProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/admin/rating-distribution`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.data;
        setRatingProduct(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ratingProduct, loading };
};
