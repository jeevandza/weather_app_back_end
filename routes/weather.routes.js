import express from "express";
import { WeatherController } from "../controllers/index.js";
import { WeatherValidations } from "../middlewares/validations/index.js";
import { validate } from "../middlewares/validation.js";



const router = express.Router();

/**
 * GET based in q params
 */
router
  .route("/")
  .get(
    validate(WeatherValidations.weatherQuerySchema),
    WeatherController.getCurrentWeather
  );

/**
 * Complete list from database added to testing
 */
router
  .route("/list")
  .get(
    validate(WeatherValidations.fetchAllWeatherSchema),
    WeatherController.getWeatherList
  );

export default router;
