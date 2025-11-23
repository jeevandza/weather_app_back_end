import Models from "../models/index.js";
import { Op } from "sequelize";


/**
 * Save forecast if it does not exist for weather
 */
export const saveForecastForWeather = async (weatherId, apiData, type = "daily") => {
  const existing = await Models.forecastModel.findOne({
    where: { weather_id: weatherId },
    order: [["fetched_at", "DESC"]],
  });

  if (existing) return existing;

const forecastPayload = {
  weather_id: weatherId,
  location: apiData.location,
  current: apiData.current || null,
  forecast_type: type,
  fetched_at: new Date(),
  forecast_data: apiData.forecast?.forecastday || [], 
};


  return Models.forecastModel.create(forecastPayload);
};

/**
 * Get forecast by weather ID
 */
export const getForecastByWeatherId = async (weatherId) => {
  return Models.forecastModel.findAll({
    where: { weather_id: weatherId },
    order: [["fetched_at", "DESC"]],
  });
};


/**
 * Get forecast by based on location
 */
export async function getForecastByLocation(q, type = "daily") {
  if (!Models.forecastModel || !Models.weatherModel) {
    throw new Error("Forecast or Weather model not initialized");
  }

  const isCoords = q.includes(",");
  const where = { forecast_type: type };

  if (isCoords) {
    const [lat, lon] = q.split(",").map(Number);

    const weather = await Models.weatherModel.findOne({
      where: { lat, lon },
    });

    if (!weather) return null;
    where.weather_id = weather.id;
  } else {
    const weather = await Models.weatherModel.findOne({
      where: { location_name: { [Op.iLike]: q } },
    });

    if (!weather) return null;
    where.weather_id = weather.id;
  }

  const forecast = await Models.forecastModel.findAll({
    where,
    order: [["fetched_at", "DESC"]],
    include: [
      {
        model: Models.weatherModel,
        as: "weather",
      },
    ],
  });

  return forecast[0];
}
