import express from "express";
import { LocationController } from "../controllers/index.js";
import { locationValidations } from "../middlewares/validations/index.js";
import { validate } from "../middlewares/validation.js";

const router = express.Router();

/**
 * Countries
 */
router
  .route("/countries")
  .get(validate(locationValidations.getCitiesSchema), LocationController.getCountries)
  .post(validate(locationValidations.createCountrySchema), LocationController.createCountry);

router
  .route("/countries/:id")
  .get(validate(locationValidations.getCountryByIdSchema), LocationController.getCountryById)
  .put(validate(locationValidations.updateCountrySchema), LocationController.updateCountry);

/**
 * Cities
 */
router
  .route("/cities")
  .get(validate(locationValidations.getCitiesSchema), LocationController.getCities)
  .post(validate(locationValidations.createCitySchema), LocationController.createCity);

router
  .route("/cities/:id")
  .get(validate(locationValidations.getCityByIdSchema), LocationController.getCityById)
  .put(validate(locationValidations.updateCitySchema), LocationController.updateCity);

/**
 * Seed locations from third-party API
 */
router.route("/seed").post(LocationController.seedLocations);

export default router;
