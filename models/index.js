import fs from "fs";
import sequelize from "../config/sequelize.js";
import logger from "../utils/logger.js";

const Models = {};
const modelFiles = fs
  .readdirSync(new URL(".", import.meta.url))
  .filter((file) => file.endsWith(".model.js"));

/**
 * Dynamically import all models
 */
for (const file of modelFiles) {
  const module = await import(`./${file}`);
  const model = module.default;
  const modelName = model.name.charAt(0).toLowerCase() + model.name.slice(1); 
  Models[`${modelName}Model`] = model;
}

/**
 * Handle associations if defined
 */
Object.values(Models).forEach((model) => {
  if (model.associate) model.associate(Models);
});

/**
 * Auto-sync all models
 */
(async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected!");

    await Promise.all(
      Object.values(Models).map((model) => model.sync({ alter: true }))
    );

    logger.info("All tables are synced!");
  } catch (err) {
    console.log(err, "err")
    logger.error("DB error:", err);

    process.exit(1);
  }
})();

export default Models;
