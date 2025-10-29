// routes/expenses.js
import express from "express";
import { body, validationResult } from "express-validator";
import auth from "../middlewares/auth.js";
import Expense from "../models/Expense.js";

const router = express.Router();

// Create expense
router.post(
  "/",
  auth,
  [body("amount").isNumeric(), body("category").notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      const exp = await Expense.create({ ...req.body, userId: req.user.id });
      res.json(exp);
    } catch (err) {
      next(err);
    }
  }
);

// Get all expenses for user with optional month/year filter
router.get("/", auth, async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const filter = { userId: req.user.id };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      filter.date = { $gte: start, $lt: end };
    }
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

// Update
router.put("/:id", auth, async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Not found" });
    res.json(expense);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const removed = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!removed) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
