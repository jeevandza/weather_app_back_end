import express from "express";
import { getWeatherDetails } from "../controllers/weather.controller.js";

const router = express.Router();

router.route("/").get(getWeatherDetails);

export default router;
