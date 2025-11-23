import redis from "../config/redis.js";
import {
  saveWeatherToDB,
  getAllWeatherData,
} from "../services/weather_service.js";
import { getWeatherData } from "../utils/weather_api.js";

/**
 * Fetch weather data with Redis cache and Postgres fallback
 */
export async function getWeather(req, res) {
  const { q, type = "current" } = req.query;
  if (!q)
    return res
      .status(400)
      .json({ success: false, message: "q parameter required" });

  const cacheKey = `weather:${type}:${q}`;

  try {
    // 1️⃣ Check Redis
    const cached = await redis.get(cacheKey);
    if (cached)
      return res.status(200).json({ success: true, data: JSON.parse(cached) });

    // 2️⃣ Check Postgres (FIXED lookup)
    const dbData = await getWeatherFromDB(q, type);

    if (dbData) {
      await redis.set(
        cacheKey,
        JSON.stringify(dbData),
        "EX",
        type === "current" ? 600 : 10800
      );

      return res.status(200).json({ success: true, data: dbData });
    }

    // 3️⃣ No DB → Fetch from external API
    const apiData = await getWeatherData(q, type);

    if (apiData) {
      await saveWeatherToDB(apiData, type);

      await redis.set(
        cacheKey,
        JSON.stringify(apiData),
        "EX",
        type === "current" ? 600 : 10800
      );

      return res.status(200).json({ success: true, data: apiData });
    }

    return res
      .status(404)
      .json({ success: false, message: "Data not available yet" });
  } catch (err) {
    console.error("Weather error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
      error: err.message,
    });
  }
}

/**
 * Get all list of weather details
 */

export async function getWeatherList(req, res) {
  try {
    const weatherData = await getAllWeatherData();
    return res.status(200).json({ success: true, data: weatherData });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
      error: err.message,
    });
  }
}
