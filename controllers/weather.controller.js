import redis from "../config/redis.js";
import { getWeatherData } from "../utils/weather_api.js";
import { saveWeatherToCache } from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { WeatherService } from "../services/index.js";

const FIVE_HOURS = 5 * 60 * 60 * 1000; 

/**
 * Get current weather
 */
export const getCurrentWeather = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res
      .status(400)
      .json({ success: false, message: "location parameter required" });
  }

  const cacheKey = `weather:current:${q}`;

  try {
    /**
     * Check Redis cache first
     */
    const cached = await redis.get(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);
      const lastUpdated = new Date(cachedData.updated_at);
      const isExpired = new Date() - lastUpdated > FIVE_HOURS;

      if (!isExpired) return res.status(200).json({ success: true, data: cachedData });
      /**
       * else, fetch new data and update DB/cache in background
       */
    }

    /**
     * Check DB
     */
    let dbData = await WeatherService.getWeatherFromDB(q, "current");

    /**
     * If DB empty or expired, fetch from API and save to DB
     */
    const needUpdate =
      !dbData || new Date() - new Date(dbData.updated_at) > FIVE_HOURS;

    if (needUpdate) {
      const apiData = await getWeatherData(q, "current");
      if (apiData) {
        await WeatherService.saveWeatherToDB(apiData, "current");
      }
    }

    /**
     * Fetch latest from DB (after saving API data if needed)
     */
    dbData = await WeatherService.getWeatherFromDB(q, "current");

    if (!dbData) {
      return res
        .status(404)
        .json({ success: false, message: "Data not available" });
    }

    // 5️⃣ Save to cache and return
    await saveWeatherToCache(q, dbData, "current");
    return res.status(200).json({ success: true, data: dbData });
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
