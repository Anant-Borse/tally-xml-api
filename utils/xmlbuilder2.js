import { create } from "xmlbuilder2";

/**
 * Convert table rows into Tally-friendly XML
 * @param {string} tableName - The name of the table (e.g., mst_ledger)
 * @param {Array<Object>} rows - Array of rows from the database
 * @returns {string} - XML string
 */
function buildTallyXml(tableName, rows) {
  const upperTableName = tableName.toUpperCase();

  const obj = {
    ENVELOPE: {
      HEADER: {
        TALLYREQUEST: "Import Data",
      },
      BODY: {
        IMPORTDATA: {
          REQUESTDESC: {
            REPORTNAME: "All Masters",
          },
          REQUESTDATA: rows.map((row) => ({
            TALLYMESSAGE: {
              [upperTableName]: convertRowToXmlStructure(row),
            },
          })),
        },
      },
    },
  };

  return create(obj).end({ prettyPrint: true });
}

/**
 * Converts a flat DB row object into nested XML structure (optional: flat is okay too)
 * @param {Object} row
 */
function convertRowToXmlStructure(row) {
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    result[key.toUpperCase()] = value ?? ""; // Tally-friendly: uppercase keys, empty string if null
  }
  return result;
}

export default buildTallyXml;
