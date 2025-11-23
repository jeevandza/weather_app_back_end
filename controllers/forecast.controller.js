import redis from "../config/redis.js";
import { getWeatherData } from "../utils/weather_api.js";
import { saveWeatherToCache } from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { WeatherService, ForecastService } from "../services/index.js";

const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get forecast for a location
 */
export const getForecast = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ success: false, message: "q parameter required" });
  }

  const cacheKey = `forecast:${q}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const cachedData = JSON.parse(cached);
      const lastUpdated = new Date(cachedData.fetched_at);
      const isExpired = new Date() - lastUpdated > ONE_DAY;

      if (isExpired) {
        const apiData = await getWeatherData(q, "forecast");
        if (apiData) {
          const weather = await WeatherService.getWeatherFromDB(q, "current");
          const forecastData = await ForecastService.saveForecastForWeather(weather.id, apiData);
          await saveWeatherToCache(q, forecastData, "forecast");
          return res.status(200).json({ success: true, data: forecastData });
        }
      }

      return res.status(200).json({ success: true, data: cachedData });
    }

    const dbForecast = await ForecastService.getForecastByLocation(q);
    if (dbForecast) {
      await saveWeatherToCache(q, dbForecast, "forecast");
      const lastUpdated = new Date(dbForecast.fetched_at);
      const isExpired = new Date() - lastUpdated > ONE_DAY;

      if (isExpired) {
        const apiData = await getWeatherData(q, "forecast");
        if (apiData) {
          const weather = await WeatherService.getWeatherFromDB(q, "current");
          const forecastData = await ForecastService.saveForecastForWeather(weather.id, apiData);
          await saveWeatherToCache(q, forecastData, "forecast");
          return res.status(200).json({ success: true, data: forecastData });
        }
      }

      return res.status(200).json({ success: true, data: dbForecast });
    }

    // Fetch from API if no cache or DB
    const apiData = await getWeatherData(q, "forecast");
    const weather = await WeatherService.getWeatherFromDB(q, "current");
    const forecastData = await ForecastService.saveForecastForWeather(weather.id, apiData);
    await saveWeatherToCache(q, forecastData, "forecast");
    return res.status(200).json({ success: true, data: forecastData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch forecast", error: err.message });
  }
});
