import redis from "../config/redis";

export async function saveWeatherToCache(q, weatherData, type = "current") {
  const key = `weather:${type}:${q}`;
  await redis.set(key, JSON.stringify(weatherData), "EX", type === "current" ? 600 : 10800); // 10 min current, 3 hr forecast
}