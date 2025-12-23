import express from 'express';
import {
    getAllCategoryDetails,
    getCategoryDetailById,
    createCategoryDetail,
    updateCategoryDetail,
    deleteCategoryDetail,
    getCategoryDetailsByParentId
} from '../controllers/categoryDetailsController.js';

const categoryDetailsRouter = express.Router();

categoryDetailsRouter.get('/', getAllCategoryDetails);
categoryDetailsRouter.get('/:id', getCategoryDetailById);
categoryDetailsRouter.post('/', createCategoryDetail);
categoryDetailsRouter.put('/:id', updateCategoryDetail);
categoryDetailsRouter.delete('/:id', deleteCategoryDetail);
categoryDetailsRouter.get('/parent/:categoryId', getCategoryDetailsByParentId);

export default categoryDetailsRouter;