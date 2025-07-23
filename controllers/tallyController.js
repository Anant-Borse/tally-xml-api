import pool from "../config/mysql.js";
import parseLedgerDataToXML from "../utils/xmlParser.js";
import js2xmlparser from "js2xmlparser";
import { create } from "xmlbuilder2";

// ✅ Step 1: Whitelisted tables
const allowedTables = [
  "config",
  "mst_attendance_type",
  "mst_cost_category",
  "mst_cost_centre",
  "mst_employee",
  "mst_godown",
  "mst_group",
  "mst_gst_effective_rate",
  "mst_ledger",
  "mst_opening_batch_allocation",
  "mst_opening_bill_allocation",
  "mst_payhead",
  "mst_stock_group",
  "mst_stock_item",
  "mst_stockitem_standard_cost",
  "mst_stockitem_standard_price",
  "mst_uom",
  "mst_vouchertype",
  "trn_accounting",
  "trn_attendance",
  "trn_bank",
  "trn_batch",
  "trn_bill",
  "trn_closingstock_ledger",
  "trn_cost_category_centre",
  "trn_cost_centre",
  "trn_cost_inventory_category_centre",
  "trn_employee",
  "trn_inventory",
  "trn_inventory_accounting",
  "trn_payhead",
  "trn_voucher",
];

// ✅ Static route for mst_ledger (custom Tally format)
export const getTallyXML = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM mst_ledger");
    const xml = parseLedgerDataToXML(rows); // Custom function
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Error generating XML:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Generic dynamic route — works for all other tables
export const getTallyXMLByTable = async (req, res) => {
  const table = req.params.tableName;

  if (!allowedTables.includes(table)) {
    return res.status(400).json({ message: "Invalid or unauthorized table" });
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM ??`, [table]);

    // Use custom parser for specific tables
    if (table === "mst_ledger") {
      const xml = parseLedgerDataToXML(rows);
      res.set("Content-Type", "application/xml");
      return res.send(xml);
    }

    // ✅ Generic XML format for Tally import
    const root = {
      ENVELOPE: {
        [`${table.toUpperCase()}LIST`]: rows.map((row) => ({
          [table.toUpperCase()]: Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key.toUpperCase(),
              value ?? "",
            ])
          ),
        })),
      },
    };

    const xml = create(root).end({ prettyPrint: true });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Error generating XML:", err);
    res.status(500).send("Internal Server Error");
  }
};
