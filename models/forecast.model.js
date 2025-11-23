import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Models from "./index.js";

const ForecastModel = sequelize.define(
  "Forecast",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    weather_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Models.weatherModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    // Storing API data as JSON
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    current: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    forecast_type: {
      type: DataTypes.ENUM("daily", "hourly"),
      allowNull: false,
      defaultValue: "daily",
    },
    fetched_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "forecast",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["weather_id"] }, { fields: ["fetched_at"] }],
  }
);

Models.weatherModel.hasMany(ForecastModel, {
  foreignKey: "weather_id",
  as: "forecasts",
});
ForecastModel.belongsTo(Models.weatherModel, {
  foreignKey: "weather_id",
  as: "weather",
});

export default ForecastModel;
