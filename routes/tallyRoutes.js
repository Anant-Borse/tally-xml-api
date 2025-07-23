import express from "express";
import {
  getTallyXML,
  getTallyXMLByTable,
} from "../controllers/tallyController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// Route: GET /api/tally/tally-xml (static mst_ledger)
router.get("/tally-xml", authenticateToken, getTallyXML);

// ✅ New route: GET /api/tally/xml/:tableName (any table)
router.get("/xml/:tableName", authenticateToken, getTallyXMLByTable);

export default router;
