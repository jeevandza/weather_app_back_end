import express from "express";
import weatherRouter from "./weather.routes.js";
import forecastRouter from "./forecast.routes.js";
// import locationRouter from "./location.routes.js";

const router = express.Router();

router.use("/weather", weatherRouter);
router.use("/forecast", forecastRouter);
// router.use("/location", locationRouter);

export default router;
