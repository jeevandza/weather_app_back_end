import fs from "fs";
import path from "path";
import sequelize from "../config/sequelize.js";
import logger from "../utils/logger.js";

const Models = {};

/**
 * Initialize all Sequelize models
 */
export async function initializeModels() {
  try {
    // Get all model files in this directory
    const modelFiles = fs
      .readdirSync(new URL(".", import.meta.url))
      .filter((file) => file.endsWith(".model.js"));

    // Dynamically import each model
    for (const file of modelFiles) {
      const module = await import(`./${file}`);
      const model = module.default;
      if (!model) continue;

      // Normalize model name: lowercase first char + "Model" suffix
      const modelName =
        model.name.charAt(0).toLowerCase() + model.name.slice(1) + "Model";
      Models[modelName] = model;
    }

    // Handle associations after all models are loaded
    Object.values(Models).forEach((model) => {
      if (typeof model.associate === "function") {
        try {
          model.associate(Models);
        } catch (err) {
          logger.error(
            `Failed to associate model ${model.name}: ${err.message}`
          );
        }
      }
    });

    // Test DB connection
    await sequelize.authenticate();
    logger.info("Database connected!");

    // Sync all models
    await Promise.all(
      Object.values(Models).map((model) =>
        model.sync({ alter: true }).catch((err) => {
          logger.error(`Failed to sync model ${model.name}: ${err.message}`);
        })
      )
    );

    logger.info("All tables synced successfully!");

    return Models;
  } catch (err) {
    logger.error("Failed to initialize models:", err);
    process.exit(1); // Exit app if DB init fails
  }
}

export default Models;
