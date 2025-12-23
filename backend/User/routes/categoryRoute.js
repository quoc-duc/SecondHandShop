import express from 'express';
import {addCategory, 
    getAllCategory, 
    getCategoryById, 
    updateCategory, 
    deleteCategory} from '../controllers/categoryController.js';

const categoryRoute = express.Router();

categoryRoute.get('/', getAllCategory);
categoryRoute.get('/:id', getCategoryById);
categoryRoute.post('/', addCategory);
categoryRoute.put('/:id', updateCategory);
categoryRoute.delete('/:id', deleteCategory);

export default categoryRoute;