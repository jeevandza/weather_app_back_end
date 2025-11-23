import redis from "../config/redis.js";
import { getWeatherData } from "../utils/weather_api.js";
import { saveWeatherToCache } from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { WeatherService, ForecastService } from "../services/index.js";

const ONE_DAY = 24 * 60 * 60 * 1000;

export const getForecast = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ success: false, message: "q parameter required" });

  const cacheKey = `forecast:${q}`;

  try {
    // 1. Check Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);
      const isExpired = new Date() - new Date(cachedData.fetched_at) > ONE_DAY;
      if (!isExpired) return res.status(200).json({ success: true, data: cachedData });
    }

    // 2. Check DB
    const dbForecast = await ForecastService.getForecastByLocation(q);
    if (dbForecast && dbForecast.length > 0) {
      const isExpired = new Date() - new Date(dbForecast[0].fetched_at) > ONE_DAY;
      if (!isExpired) {
        await saveWeatherToCache(q, dbForecast, "forecast");
        return res.status(200).json({ success: true, data: dbForecast });
      }
    }

    // 3. Fetch from API
    const apiData = await getWeatherData(q, "forecast");
    if (!apiData) return res.status(404).json({ success: false, message: "Forecast data not found" });

    // Ensure weather exists in DB
    const weather = await WeatherService.getWeatherFromDB(q, "current");
    if (!weather) return res.status(404).json({ success: false, message: "Weather data not found" });

    // Save forecast in DB & cache
    const forecastData = await ForecastService.saveForecastForWeather(weather.id, apiData);
    await saveWeatherToCache(q, forecastData, "forecast");

    return res.status(200).json({ success: true, data: forecastData });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch forecast", error: err.message });
  }
});
