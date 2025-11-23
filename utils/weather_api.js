import axios from "axios";
import logger from "../utils/logger.js";

/**
 * Fetch weather details based on the type
 */
export async function getWeatherData(q, type = "current") {
  try {
    const endpoint =
      type === "current"
        ? "https://api.weatherapi.com/v1/current.json"
        : "https://api.weatherapi.com/v1/forecast.json";

    const { data } = await axios.get(endpoint, {
      params: {
        key: process.env.WEATHER_KEY,
        q,
        days: type === "forecast" ? 7 : undefined,
      },
    });

    return data;
  } catch (err) {
    logger.error(
      `Weather API error for query "${q}" and type "${type}": ${err.message}`
    );
  }
}
