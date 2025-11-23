import redis from "../config/redis.js";
import { getWeatherData } from "../utils/weather_api.js";
import { saveWeatherToCache } from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { WeatherService } from "../services/index.js";

const FIVE_HOURS = 5 * 60 * 60 * 1000; // 5 hours

/**
 * Get current weather
 */
export const getCurrentWeather = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res
      .status(400)
      .json({ success: false, message: "q parameter required" });
  }

  const cacheKey = `weather:current:${q}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);
      const lastUpdated = new Date(cachedData.updated_at);
      const isExpired = new Date() - lastUpdated > FIVE_HOURS;

      if (isExpired) {
        const apiData = await getWeatherData(q, "current");
        if (apiData) {
          await WeatherService.saveWeatherToDB(apiData, "current");
          await saveWeatherToCache(q, apiData, "current");
          return res.status(200).json({ success: true, data: apiData });
        }
      }

      return res.status(200).json({ success: true, data: cachedData });
    }

    // Check DB if Redis missed
    const dbData = await WeatherService.getWeatherFromDB(q, "current");
    if (dbData) {
      await saveWeatherToCache(q, dbData, "current");
      const lastUpdated = new Date(dbData.updated_at);
      const isExpired = new Date() - lastUpdated > FIVE_HOURS;

      if (isExpired) {
        const apiData = await getWeatherData(q, "current");
        if (apiData) {
          await WeatherService.saveWeatherToDB(apiData, "current");
          await saveWeatherToCache(q, apiData, "current");
          return res.status(200).json({ success: true, data: apiData });
        }
      }

      return res.status(200).json({ success: true, data: dbData });
    }

    const apiData = await getWeatherData(q, "current");
    if (apiData) {
      await WeatherService.saveWeatherToDB(apiData, "current");
      await saveWeatherToCache(q, apiData, "current");
      return res.status(200).json({ success: true, data: apiData });
    }

    return res
      .status(404)
      .json({ success: false, message: "Data not available" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather",
      error: err.message,
    });
  }
});

/**
 * Fetch all weather data
 */
export const getWeatherList = asyncHandler(async (req, res) => {
  const weatherData = await WeatherService.getAllWeatherData();
  return res.status(200).json({ success: true, data: weatherData });
});
