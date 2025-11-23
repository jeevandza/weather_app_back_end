import express from "express";
import { LocationController } from "../controllers/index.js";
import { LocationValidations } from "../middlewares/validations/index.js";
import { validate } from "../middlewares/validation.js";




const router = express.Router();

/**
 * Countries
 */
router
  .route("/countries")
  .get(validate(LocationValidations.getCitiesSchema), LocationController.getCountries)
  .post(validate(LocationValidations.createCountrySchema), LocationController.createCountry);

router
  .route("/countries/:id")
  .get(validate(LocationValidations.getCountryByIdSchema), LocationController.getCountryById)
  .put(validate(LocationValidations.updateCountrySchema), LocationController.updateCountry);

/**
 * Cities
 */
router
  .route("/cities")
  .get(validate(LocationValidations.getCitiesSchema), LocationController.getCities)
  .post(validate(LocationValidations.createCitySchema), LocationController.createCity);

router
  .route("/cities/:id")
  .get(validate(LocationValidations.getCityByIdSchema), LocationController.getCityById)
  .put(validate(LocationValidations.updateCitySchema), LocationController.updateCity);

/**
 * Seed locations from third-party API
 */
router.route("/seed").post(LocationController.seedLocations);

export default router;
