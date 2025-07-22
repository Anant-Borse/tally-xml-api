import express from "express";
import { getTallyXML } from "../controllers/tallyController.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// This becomes GET /api/tally/tally-xml
router.get("/tally-xml", authenticateToken, getTallyXML);

export default router;
