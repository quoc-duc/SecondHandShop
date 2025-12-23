import express from 'express';
import countryController from '../controllers/countryController.js';

const countriesRouter = express.Router();

countriesRouter.post('/', countryController.addCountries);
countriesRouter.get('/', countryController.getAllCountries);
countriesRouter.get('/:id', countryController.getCountryById);
countriesRouter.get('/name/:name', countryController.getCountryByName); // Thêm route tìm theo tên
countriesRouter.put('/:id', countryController.updateCountry);
countriesRouter.delete('/:id', countryController.deleteCountry);

export default countriesRouter;