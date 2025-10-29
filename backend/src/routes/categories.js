// routes/categories.js
import express from "express";
import Category from "../models/Category.js"; // create this model
const router = express.Router();

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find(); // [{ name: "Food" }, ...]
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

export default router;
