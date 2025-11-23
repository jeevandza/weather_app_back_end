import fs from "fs";
import sequelize from "../config/sequelize.js";

const Models = {};
const modelFiles = fs.readdirSync(new URL('.', import.meta.url))
  .filter(file => file.endsWith(".model.js"));

// Dynamically import all models
for (const file of modelFiles) {
  const module = await import(`./${file}`);
  const model = module.default;
  const modelName = model.name.charAt(0).toLowerCase() + model.name.slice(1); // e.g., Weather -> weather
  Models[`${modelName}Model`] = model;
}

// Handle associations if defined
Object.values(Models).forEach(model => {
  if (model.associate) model.associate(Models);
});

// Auto-sync all models
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    await Promise.all(
      Object.values(Models).map(model => model.sync({ alter: true }))
    );

    console.log("All tables are synced!");
  } catch (err) {
    console.error("DB error:", err);
    process.exit(1);
  }
})();

export default Models;
