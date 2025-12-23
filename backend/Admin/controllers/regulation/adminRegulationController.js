import {
  getAllRegulations,
  createRegulation,
  updateRegulation,
  deleteRegulation,
} from "../../services/regulation/adminRegulationService.js";

// Lấy tất cả quy định với phân trang
const getRegulations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter || null;
    const result = await getAllRegulations(page, limit, sort, filter);
    res.status(200).json({
      success: true,
      totalRegulations: result.totalRegulations,
      totalPages: result.totalPages,
      limit: result.limit,
      curentPage: result.currentPage,
      regulations: result.regulations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Thêm quy định mới
const addRegulation = async (req, res) => {
  try {
    const regulation = await createRegulation(req.body);

    res.status(201).json({
      success: true,
      message: "Regulation created successfully",
      data: regulation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create regulation",
      error: error.message,
    });
  }
};

// Cập nhật quy định theo ID
const editRegulation = async (req, res) => {
  const { id } = req.params;
  try {
    const regulation = await updateRegulation(id, req.body);

    res.status(200).json({
      success: true,
      message: "Regulation updated successfully",
      data: regulation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update regulation",
      error: error.message,
    });
  }
};

// Xóa quy định theo ID
const removeRegulation = async (req, res) => {
  const { regulationIds } = req.body;

  if (!regulationIds || regulationIds.length === 0) {
    res.status(400).json({ message: "No regulation IDs provided" });
  }
  try {
    const regulations = await deleteRegulation(regulationIds);

    res.status(200).json({
      message: "Regulatons deleted successfully",
      deleteCount: regulations.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete regulation",
      error: error.message,
    });
  }
};

export { getRegulations, addRegulation, editRegulation, removeRegulation };
