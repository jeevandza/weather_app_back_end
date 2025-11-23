import redis from "../config/redis.js";
import { getWeatherData } from "../utils/weather_api.js";
import { saveWeatherToDB } from "../services/weather_service.js";

/**
 * Cache redis for weather data
 */
export async function saveWeatherToCache(q, weatherData, type = "current") {
  const key = `weather:${type}:${q}`;
  await redis.set(
    key,
    JSON.stringify(weatherData),
    "EX",
    type === "current" ? 600 : 10800
  );
}

/**
 * Validate redis and db data
 */
export async function revalidateWeather(q, type, currentData, cacheKey) {
  try {
    const lastUpdated = new Date(currentData.updated_at);
    const now = new Date();

    /**
     * Set cache age threshold: 5 hours
     */
    const maxAgeMs = 5 * 60 * 60 * 1000;

    /**
     * If data is still fresh, skip API call
     */
    if (now - lastUpdated < maxAgeMs) return;

    /**
     * Fetch new data from API
     */
    const apiData = await getWeatherData(q, type);

    if (apiData) {
      /**
       *  Save updated data to DB and cache
       */
      await saveWeatherToDB(apiData, type);
      await saveWeatherToCache(q, apiData, type);
    }
  } catch (err) {
    logger.error(`Revalidation failed for ${q}: ${err}`);
  }
}
