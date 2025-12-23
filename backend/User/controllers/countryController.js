import countryService from '../services/countryService.js';

const countryController = {
    addCountries: async (req, res) => {
        try {
            const countries = await countryService.addCountries(req.body);
            res.status(201).json(countries);
        } catch (error) {
            res.status(500).json({ message: 'Error adding countries', error });
        }
    },

    getAllCountries: async (req, res) => {
        try {
            const countries = await countryService.getAllCountries();
            res.status(200).json(countries);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching countries', error });
        }
    },

    getCountryById: async (req, res) => {
        try {
            const country = await countryService.getCountryById(req.params.id);
            if (!country) return res.status(404).json({ message: 'Country not found' });
            res.status(200).json(country);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching country', error });
        }
    },

    getCountryByName: async (req, res) => {
        try {
            const countries = await countryService.getCountryByName(req.params.name);
            res.status(200).json(countries);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching countries by name', error });
        }
    },

    updateCountry: async (req, res) => {
        try {
            const updatedCountry = await countryService.updateCountry(req.params.id, req.body);
            if (!updatedCountry) return res.status(404).json({ message: 'Country not found' });
            res.status(200).json(updatedCountry);
        } catch (error) {
            res.status(500).json({ message: 'Error updating country', error });
        }
    },

    deleteCountry: async (req, res) => {
        try {
            const deletedCountry = await countryService.deleteCountry(req.params.id);
            if (!deletedCountry) return res.status(404).json({ message: 'Country not found' });
            res.status(200).json({ message: 'Country deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting country', error });
        }
    },
};

export default countryController;