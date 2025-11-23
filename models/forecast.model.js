import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";


const ForecastModel = sequelize.define(
  "Forecast",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    weather_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
    forecast_data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "forecast",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["weather_id"] }, { fields: ["fetched_at"] }],
  }
);



/**
 * Define associations after all models are loaded
 * This avoids circular dependency issues
 */
ForecastModel.associate = (models) => {
  if (models.weatherModel) {
    ForecastModel.belongsTo(models.weatherModel, {
      foreignKey: "weather_id",
      as: "weather",
    });
  }
};



export default ForecastModel;
