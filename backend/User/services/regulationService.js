import Regulations from "../models/Regulations.js";

const createRegulation = async (regulationData) => {
    const regulation = new Regulations(regulationData);
    return await regulation.save();
};

const getActiveRegulations = async () => {
    return await Regulations.find({ status: true });
};

const getActiveRegulationsById = async (regulationId) => {
    return await Regulations.findById(regulationId);
};

const updateRegulation = async (regulationId, updateData) => {
    return await Regulations.findByIdAndUpdate(
        regulationId,
        updateData,
        { new: true }
      );
  };

const deleteRegulation = async (regulationId) => {
    return await Regulations.findByIdAndUpdate(
        regulationId,
        { status: false },
        { new: true }
      );
};

export {createRegulation, getActiveRegulations, getActiveRegulationsById, updateRegulation, deleteRegulation}