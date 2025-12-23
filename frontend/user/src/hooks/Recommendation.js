import { useState, useEffect } from "react";
import axios from "axios";

const getRecommendationProduct = async (user_id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/recommend?user_id=${user_id}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
  }
};

export default getRecommendationProduct;
