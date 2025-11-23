import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";



/**
 * Weather model schema
 */
const WeatherModel = sequelize.define(
  "Weather",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    lon: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    localtime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    temp_c: DataTypes.FLOAT,
    temp_f: DataTypes.FLOAT,
    feelslike_c: DataTypes.FLOAT,
    dewpoint_c: DataTypes.FLOAT,

    is_day: DataTypes.BOOLEAN,
    condition_text: DataTypes.STRING,
    condition_code: DataTypes.INTEGER,
    condition_icon: DataTypes.STRING,

    wind_mph: DataTypes.FLOAT,
    wind_kph: DataTypes.FLOAT,
    wind_degree: DataTypes.INTEGER,
    wind_dir: DataTypes.STRING,
    gust_kph: DataTypes.FLOAT,

    pressure_mb: DataTypes.FLOAT,
    precip_mm: DataTypes.FLOAT,
    humidity: DataTypes.INTEGER,
    cloud: DataTypes.INTEGER,
    vis_km: DataTypes.FLOAT,
    uv: DataTypes.FLOAT,

    data_type: {
      type: DataTypes.ENUM("current", "forecast", "hourly"),
      allowNull: false,
      defaultValue: "current",
    },
  },
  {
    tableName: "weather",
    timestamps: true,
    underscored: true,

    indexes: [
      { unique: true, fields: ["location_name", "data_type"] },
      { unique: true, fields: ["lat", "lon", "data_type"] },
      { fields: ["country"] },
      { fields: ["localtime"] },
    ],
  }
);

export default WeatherModel;
