import parseLedgerDataToXML from "../utils/xmlParser.js";
import pool from "../config/mysql.js";

export const getTallyXML = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM mst_ledger");

    const xml = parseLedgerDataToXML(rows);

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Error generating XML:", err);
    res.status(500).send("Internal Server Error");
  }
};
