import redis from "../config/redis.js";
import {
  saveWeatherToDB,
  getAllWeatherData,
  getWeatherFromDB,
} from "../services/weather_service.js";
import { getWeatherData } from "../utils/weather_api.js";
import { revalidateWeather, saveWeatherToCache } from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

/**
 * 5 hours in milliseconds
 */
const FIVE_HOURS = 5 * 60 * 60 * 1000;

/**
 * Fetch weather data
 */
export const getWeather = asyncHandler(async (req, res) => {
  const { q, type = "current" } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "q parameter required",
    });
  }

  const cacheKey = `weather:${type}:${q}`;

  try {
    /**
     * First Check Redis cache
     */
    const cached = await redis.get(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);

      const lastUpdated = new Date(cachedData.updated_at);
      const isExpired = new Date() - lastUpdated > FIVE_HOURS;

      if (isExpired) {
        logger.info(`Cached data expired for ${q}, fetching new data...`);
        const apiData = await getWeatherData(q, type);
        if (apiData) {
          await saveWeatherToDB(apiData, type);
          await saveWeatherToCache(q, apiData, type);
          return res.status(200).json({ success: true, data: apiData });
        }
      }

      return res.status(200).json({ success: true, data: cachedData });
    }

    /**
     * Second Check DB if Redis missed
     */
    const dbData = await getWeatherFromDB(q, type);
    if (dbData) {
      await saveWeatherToCache(q, dbData, type);

      const lastUpdated = new Date(dbData.updated_at);
      const isExpired = new Date() - lastUpdated > FIVE_HOURS;

      if (isExpired) {
        logger.info(`DB data expired for ${q}, fetching new data...`);
        const apiData = await getWeatherData(q, type);
        if (apiData) {
          await saveWeatherToDB(apiData, type);
          await saveWeatherToCache(q, apiData, type);
          return res.status(200).json({ success: true, data: apiData });
        }
      }

      return res.status(200).json({ success: true, data: dbData });
    }

    /**
     * Third If no cache or DB data, fetch from third-party API
     */
    const apiData = await getWeatherData(q, type);
    if (apiData) {
      await saveWeatherToDB(apiData, type);
      await saveWeatherToCache(q, apiData, type);
      return res.status(200).json({ success: true, data: apiData });
    }

    return res.status(404).json({
      success: false,
      message: "Data not available yet",
    });
  } catch (err) {
    logger.error(`controller.getWeather->:, ${err}`);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
      error: err.message,
    });
  }
});

/**
 * Fetch all weather data
 */
export const getWeatherList = asyncHandler(async (req, res) => {
  const weatherData = await getAllWeatherData();
  return res.status(200).json({ success: true, data: weatherData });
});
