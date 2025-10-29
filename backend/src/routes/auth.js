// routes/auth.js
import bcrypt from "bcryptjs";
import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Note the .js extension

const router = express.Router();

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  });
}

// Register
router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(409).json({ message: "User exists" });
      const hashed = await bcrypt.hash(password, 12);
      user = await User.create({ email, password: hashed });
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.cookie("jid", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/refresh_token",
      });
      res.json({ accessToken, user: { id: user._id, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
);

// Login
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        return res.status(401).json({ message: "Invalid credentials" });
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.cookie("jid", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/refresh_token",
      });
      res.json({ accessToken, user: { id: user._id, email: user.email } });
    } catch (err) {
      next(err);
    }
  }
);

// Refresh token endpoint
router.post("/refresh_token", async (req, res) => {
  const token = req.cookies.jid;
  if (!token) return res.json({ ok: false, accessToken: "" });
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.json({ ok: false, accessToken: "" });
    const accessToken = generateAccessToken(user);
    return res.json({ ok: true, accessToken });
  } catch (e) {
    console.error(e);
    return res.json({ ok: false, accessToken: "" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("jid", { path: "/api/auth/refresh_token" });
  res.json({ ok: true });
});

export default router;
