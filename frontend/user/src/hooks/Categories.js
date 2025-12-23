import { useState, useEffect } from "react";
import axios from "axios";
import { IP } from "../config";

const getCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://${IP}:5555/categories`);
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    // alert(JSON.stringify(categories))
    return { categories, loading, error };
};

const getCategoryDetailByCategoryId = (categoryId) => {
    const [categoryDetail, setCategoryDetail] = useState([]);
    const [loadings, setLoading] = useState(true);
    const [errors, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://${IP}:5555/categoryDetails/parent/${categoryId}`);
                setCategoryDetail(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    // alert(JSON.stringify(categories))
    return { categoryDetail, loadings, errors };
};

const fetchSubcategories = async (categoryId) => {
    if (categoryId) {
        const response = await axios.get(`http://${IP}:5555/categoryDetails/parent/${categoryId}`);
        const subcategoryData = response.data;
        return subcategoryData; // Lưu danh mục con vào state
    } else {
        return []; // Nếu không có danh mục cha, reset danh mục con
    }
};

const fetchOrigin = async () => {
    const response = await axios.get(`http://${IP}:5555/countries`);
    const countries = response.data;
    return countries; 
};


export {getCategories, getCategoryDetailByCategoryId, fetchSubcategories, fetchOrigin};