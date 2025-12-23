import {createRegulation, 
    getActiveRegulations, 
    getActiveRegulationsById, 
    updateRegulation, 
    deleteRegulation} from '../services/regulationService.js';

const createRegulationCon = async (req, res) => {
    try {
        const regulation = await createRegulation(req.body);
        res.status(201).json(regulation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveRegulationsCon = async (req, res) => {
    try {
      const regulations = await getActiveRegulations();
      res.status(200).json(regulations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getRegulationById = async (req, res) => {
    try {
        const product = await getActiveRegulationsById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Regulation not found' });
        }
        return res.status(200).send(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const updateRegulationCon = async (req, res) => {
    const { regulationId } = req.params;
    const updateData = req.body;
    try {
        const updatedRegulation = await updateRegulation(regulationId, updateData);
        res.status(200).json(updatedRegulation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRegulationCon= async (req, res) => {
    const { regulationId } = req.params;
  
    try {
      const updatedRegulation = await deleteRegulation(regulationId);
      res.status(200).json(updatedRegulation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export {createRegulationCon, getActiveRegulationsCon, getRegulationById, updateRegulationCon, deleteRegulationCon}