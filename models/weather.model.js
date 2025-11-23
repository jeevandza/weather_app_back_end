import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";


/**
 *  Weather modal
 */
const WeatherModel = sequelize.define("Weather", {
  location_name: DataTypes.STRING,
  region: DataTypes.STRING,
  country: DataTypes.STRING,
  lat: DataTypes.DOUBLE,
  lon: DataTypes.DOUBLE,
  localtime: DataTypes.DATE,
  temp_c: DataTypes.DOUBLE,
  temp_f: DataTypes.DOUBLE,
  is_day: DataTypes.BOOLEAN,
  condition_text: DataTypes.STRING,
  condition_code: DataTypes.INTEGER,
  condition_icon: DataTypes.STRING,
  wind_mph: DataTypes.DOUBLE,
  wind_kph: DataTypes.DOUBLE,
  wind_degree: DataTypes.INTEGER,
  wind_dir: DataTypes.STRING,
  pressure_mb: DataTypes.DOUBLE,
  precip_mm: DataTypes.DOUBLE,
  humidity: DataTypes.INTEGER,
  cloud: DataTypes.INTEGER,
  feelslike_c: DataTypes.DOUBLE,
  dewpoint_c: DataTypes.DOUBLE,
  vis_km: DataTypes.DOUBLE,
  uv: DataTypes.DOUBLE,
  gust_kph: DataTypes.DOUBLE,
  data_type: DataTypes.STRING, 
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "weather",
  timestamps: false,
});

export default WeatherModel;
