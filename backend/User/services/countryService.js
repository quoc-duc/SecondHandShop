import Countries from '../models/Countries.js';

const countryService = {
    addCountries: async (countriesData) => {
        return await Countries.create(countriesData);
    },

    getAllCountries: async () => {
        try {
            const countries = await Countries.find();
            // Sắp xếp theo thứ tự không phân biệt tiếng Việt
            countries.sort((a, b) => {
                return a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
            });
            return countries;
        } catch (err) {
            console.error("Error fetching countries:", err);
            throw new Error("Không có sản phẩm nào.");
        }
    },

    // getAllCountries: async () => {
    //     return await Countries.find().sort({ name: 1 });;
    // },

    getCountryById: async (id) => {
        return await Countries.findById(id);
    },

    getCountryByName: async (name) => {
        return await Countries.find({ name: { $regex: name, $options: 'i' } }); // Tìm theo tên
    },

    updateCountry: async (id, updateData) => {
        return await Countries.findByIdAndUpdate(id, updateData, { new: true });
    },

    deleteCountry: async (id) => {
        return await Countries.findByIdAndDelete(id);
    },
};

export default countryService;