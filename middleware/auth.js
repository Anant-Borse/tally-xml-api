import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authPool from "../config/authMysql.js";

dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await authPool.query(
      "SELECT * FROM companies WHERE company_id = ? AND secret = ?",
      [decoded.company_id, decoded.secret]
    );

    if (rows.length === 0) return res.sendStatus(403);

    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

export default authenticateToken;
