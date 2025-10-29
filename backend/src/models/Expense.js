// src/models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: "" },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Optional index to speed up queries by user and date
expenseSchema.index({ userId: 1, date: -1 });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
