import { getWeatherData } from "../utils/weather_service.js";

/**
 * Fetch weather data
 */
const getWeatherDetails = async (req, res, next) => {
  const { lon, lat } = req.query;

  console.log(lon, lat, "atat")

  try {
    const weatherData = await getWeatherData( lat, lon);
    return res.status(200).json({
      success: true,
      data: weatherData,
    });
  } catch (err) {
    console.error("Weather error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
      error: err.message,
    });
  }
};

export { getWeatherDetails };
