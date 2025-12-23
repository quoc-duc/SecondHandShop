import React, { useState, useEffect } from 'react';
import { getProductByCategory } from '../../../hooks/Products';
import { useParams } from 'react-router-dom';
import ListProductCard from '../ListProducts/ListProductCard';
import BackButton from '../../../commons/BackButton';
import { getCategoryDetailByCategoryId } from '../../../hooks/Categories';

const ProductByCategory = () => {   
    const { categoryId } = useParams();
    const { products, loading, error } = getProductByCategory(categoryId);
    const { categoryDetail, loadings, errors } = getCategoryDetailByCategoryId(categoryId);
    
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
        if (loading) return; // Nếu đang tải, không làm gì
        if (selectedSubcategory) {
            const filtered = products.filter(product => product.subcategory_name === selectedSubcategory);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [selectedSubcategory, products, loading]);

    if (loading) {
        return <h2>Đang tải sản phẩm...</h2>;
    }

    if (error) {
        return <h2 className="text-red-500 font-bold">Có lỗi xảy ra: {error.message}</h2>;
    }

    return (
        <div className="p-5 min-h-screen">
            <div className="flex items-center mb-4">
                <BackButton />
            </div>
            <div className="w-screen h-auto flex flex-col justify-center items-center bg-main overflow-x-hidden">
                <div className="mb-4">
                    <label htmlFor="categorySelect" className="mr-2">Chọn danh mục:</label>
                    <select id="categorySelect" className="border p-2 rounded" onChange={(e) => {setSelectedSubcategory(e.target.value)}}>
                        <option value="">Tất cả danh mục con</option>
                        {categoryDetail.map((detail) => (
                            <option key={detail._id} value={detail.name}>
                                {detail.name}
                            </option>
                        ))}
                    </select>
                </div>
                {filteredProducts.length !== 0 ? 
                    <ListProductCard data={{ products: filteredProducts, loading, error }} />
                : <h2 className="text-red-500 font-bold">Không còn sản phẩm cho danh mục này.</h2>
                }
            </div>
        </div>
    );
}

export default ProductByCategory;