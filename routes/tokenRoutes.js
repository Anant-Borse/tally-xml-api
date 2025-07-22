import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authPool from "../config/authMysql.js";
import generateToken from "../utils/generateToken.js";

dotenv.config();
const router = express.Router();

router.post("/generate-token", async (req, res) => {
  const { companyId, secret } = req.body;

  try {
    const [rows] = await authPool.query(
      "SELECT * FROM companies WHERE company_id = ? AND secret = ?",
      [companyId, secret]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      company_id: rows[0].company_id,
      secret: rows[0].secret,
    });

    res.json({ token });
  } catch (err) {
    console.error("Token generation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
