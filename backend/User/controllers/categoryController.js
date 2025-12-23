import {createCategory, 
    getCategory, 
    getOneCategoryById, 
    updateOneCategory, 
    deleteOneCategory} from '../services/categoryService.js';

const addCategory = async (req, res) => {
    try {
        const Category = await createCategory(req.body);
        return res.status(201).send(Category);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const getAllCategory = async (req, res) => {
    try {
        const Category = await getCategory();
        return res.status(200).send(Category);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const Category = await getOneCategoryById(req.params.id);
        if (!Category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        return res.status(200).send(Category);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const Category = await updateOneCategory(req.params.id, req.body);
        if (!Category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        return res.status(200).send(Category);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const Category = await deleteOneCategory(req.params.id);
        if (!Category) {
            return res.status(404).send({ message: 'Category not found' });
        }
        return res.status(204).send();
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

export { addCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory};