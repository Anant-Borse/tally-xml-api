import express from "express";
import {
  getTallyXML,
  getTallyXMLByTable,
  downloadTallyXMLByTable,
} from "../controllers/tallyController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// ✅ Allow token via query string (for browser-friendly URLs)
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromQuery = req.query.token;
  if (!authHeader && tokenFromQuery) {
    req.headers.authorization = `Bearer ${tokenFromQuery}`;
  }
  next();
});

// Route: GET /api/tally/tally-xml (full list view, unused if not needed)
router.get("/tally-xml", authenticateToken, getTallyXML);

// ✅ Route to show XML in browser (for TDL / developer view)
router.get("/xml/:tableName", authenticateToken, getTallyXMLByTable);

// ✅ Route to download XML file directly (secured by token)
router.get(
  "/xml/:tableName/download",
  authenticateToken,
  downloadTallyXMLByTable
);

export default router;
