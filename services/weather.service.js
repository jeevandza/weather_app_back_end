import { Op } from "sequelize";
import Models from "../models/index.js";
/**
 * Create/save weather based on type
 */
export async function saveWeatherToDB(data, type = "current") {
  const values = {
    location_name: data.location.name,
    region: data.location.region,
    country: data.location.country,
    lat: data.location.lat,
    lon: data.location.lon,
    localtime: data.location.localtime,
    temp_c: data.current.temp_c,
    temp_f: data.current.temp_f,
    is_day: data.current.is_day,
    condition_text: data.current.condition.text,
    condition_code: data.current.condition.code,
    condition_icon: data.current.condition.icon,
    wind_mph: data.current.wind_mph,
    wind_kph: data.current.wind_kph,
    wind_degree: data.current.wind_degree,
    wind_dir: data.current.wind_dir,
    pressure_mb: data.current.pressure_mb,
    precip_mm: data.current.precip_mm,
    humidity: data.current.humidity,
    cloud: data.current.cloud,
    feelslike_c: data.current.feelslike_c,
    dewpoint_c: data.current.dewpoint_c,
    vis_km: data.current.vis_km,
    uv: data.current.uv,
    gust_kph: data.current.gust_kph,
    data_type: type,
    updated_at: new Date(),
  };

  return await Models.weatherModel.upsert(values);
}



/**
 * Get all the data from collection
 */
export const getAllWeatherData = async () => {
  return await Models.weatherModel.findAll();
};

/**
 * Get weather based location and type
 */
export const getLatestWeather = async (location_name, type = "current") => {
  return await Models.weatherModel.findOne({
    where: { location_name, data_type: type },
    order: [["updated_at", "DESC"]],
  });
};

/**
 * Save to database
 */
export const saveWeather = async (data) => {
  return await Models.weatherModel.create(data);
};

/**
 * Update to database
 */
export const updateWeather = async (location_name, type, updates) => {
  return await Models.weatherModel.update(updates, {
    where: { location_name, data_type: type },
  });
};

/**
 * Get weather details based on geo location or location name
 */
export async function getWeatherFromDB(q, type = "current") {
  const isCoords = q.includes(",");

  let where = { data_type: type };

  if (isCoords) {
    const [lat, lon] = q.split(",").map(Number);
    where.lat = lat;
    where.lon = lon;
  } else {
    where.location_name = { [Op.iLike]: q };
  }

  return Models.weatherModel.findOne({
    where,
    order: [["updated_at", "DESC"]],
  });
}
