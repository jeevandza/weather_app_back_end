import express from "express";
import { weatherController } from "../controllers/index.js";

const router = express.Router();

/**
 * GET based in q params
 */
router.route("/").get(weatherController.getWeather);

/**
 * Complete list from database added to testing
 */
router.route("/list").get( weatherController.getWeatherList);

export default router;
