import Regulations from "../../../User/models/Regulations.js";

//--------------------------------Lấy tất cả quy định--------------------------------
const getAllRegulations = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = { status: true };
    const skip = (page - 1) * limit;
    if (filter) {
      const label = filter[0];
      const value = filter[1];
      query[label] = { $regex: value, $options: "i" };
      const totalRegulations = await Regulations.countDocuments(query);
      const totalPages = await Math.ceil(totalRegulations / limit);
      const filterRegulations = await Regulations.find(query)
        .skip(skip)
        .limit(limit)
        .lean();
      return {
        success: true,
        totalRegulations,
        totalPages,
        skip,
        limit,
        currentPage: page,
        regulations: filterRegulations,
      };
    }
    const totalRegulations = await Regulations.countDocuments(query);
    const totalPages = await Math.ceil(totalRegulations / limit);
    if (sort) {
      const objectSort = {};
      objectSort[sort[1]] = sort[0];
      const sortRegulations = await Regulations.find(query)
        .skip(skip)
        .limit(limit)
        .sort(objectSort)
        .lean();
      return {
        success: true,
        totalRegulations,
        totalPages,
        skip,
        limit,
        currentPage: page,
        regulations: sortRegulations,
      };
    }
    const regulations = await Regulations.find(query)
      .skip(skip)
      .limit(limit)
      .lean();
    return {
      success: true,
      totalRegulations,
      totalPages,
      skip,
      limit,
      currentPage: page,
      regulations,
    };
  } catch (error) {
    throw new Error("Error fetching regulations: " + error.message);
  }
};

//--------------------------------Thêm quy định mới--------------------------------
const createRegulation = async (data) => {
  try {
    const regulation = new Regulations(data);
    return await regulation.save();
  } catch (error) {
    throw new Error("Error creating regulation: " + error.message);
  }
};

// Cập nhật quy định theo ID
const updateRegulation = async (id, data) => {
  try {
    const regulation = await Regulations.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!regulation) {
      throw new Error("Regulation not found");
    }

    return regulation;
  } catch (error) {
    throw new Error("Error updating regulation: " + error.message);
  }
};

//--------------------------------Xóa (cập nhật trạng thái) quy định theo ID--------------------------------
const deleteRegulation = async (regulationIds) => {
  try {
    const regulations = await Regulations.updateMany(
      { _id: { $in: regulationIds } },
      { status: false }
    );

    if (regulations.matchedCount === 0) {
      throw new Error("No regulations found or already");
    }

    return regulations;
  } catch (error) {
    throw new Error("Error deleting regulation: " + error.message);
  }
};

export {
  getAllRegulations,
  createRegulation,
  updateRegulation,
  deleteRegulation,
};
