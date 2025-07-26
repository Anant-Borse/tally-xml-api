import pool from "../config/mysql.js";
import parseLedgerDataToXML from "../utils/xmlParser.js";
import { create } from "xmlbuilder2";

// ✅ Allowed tables for export (add more as needed)
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

// ✅ 1. Static route: returns XML for mst_ledger with custom format
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

// ✅ 2. Dynamic route: returns XML for any allowed table
export const getTallyXMLByTable = async (req, res) => {
  const table = req.params.tableName;

  if (!allowedTables.includes(table)) {
    return res.status(400).json({ message: "Invalid or unauthorized table" });
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM ??`, [table]);

    if (table === "mst_ledger") {
      const xml = parseLedgerDataToXML(rows);
      res.set("Content-Type", "application/xml");
      return res.send(xml);
    }

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

// ✅ 3. Download route: returns file attachment XML for allowed tables
export const downloadTallyXMLByTable = async (req, res) => {
  const tableName = req.params.tableName;

  if (!allowedTables.includes(tableName)) {
    return res.status(400).send("Invalid table name.");
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM ??`, [tableName]);

    let xml;

    if (tableName === "mst_ledger") {
      xml = parseLedgerDataToXML(rows);
    } else {
      const root = {
        ENVELOPE: {
          [`${tableName.toUpperCase()}LIST`]: rows.map((row) => ({
            [tableName.toUpperCase()]: Object.fromEntries(
              Object.entries(row).map(([key, value]) => [
                key.toUpperCase(),
                value ?? "",
              ])
            ),
          })),
        },
      };

      xml = create(root).end({ prettyPrint: true });
    }

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${tableName}.xml"`
    );

    res.send(xml);
  } catch (err) {
    console.error("Error in downloadTallyXMLByTable:", err);
    res.status(500).send("Internal Server Error");
  }
};
