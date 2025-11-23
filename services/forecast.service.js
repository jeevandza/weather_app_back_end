import Models from "../models/index.js";

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
