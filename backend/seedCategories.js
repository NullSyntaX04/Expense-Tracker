import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./src/models/Category.js";

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Health",
  "Education",
  "Misc",
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    for (const name of categories) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name });
        console.log(`Category created: ${name}`);
      } else {
        console.log(`Category already exists: ${name}`);
      }
    }

    console.log("Seeding finished!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding categories:", err);
    mongoose.disconnect();
  }
}

seed();
