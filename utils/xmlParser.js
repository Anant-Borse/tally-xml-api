import { create } from "xmlbuilder2";

function parseLedgerDataToXML(data) {
  const root = {
    ENVELOPE: {
      LEDGERLIST: data.map((item) => ({
        LEDGER: {
          GUID: item.guid,
          NAME: item.name,
          PARENT: item.parent,
          ALIAS: item.alias,
          DESCRIPTION: item.description,
          NOTES: item.notes,
          IS_REVENUE: item.is_revenue,
          IS_DEEMEDPOSITIVE: item.is_deemedpositive,
          OPENING_BALANCE: item.opening_balance,
          CLOSING_BALANCE: item.closing_balance,
          MAILING_NAME: item.mailing_name,
          MAILING_ADDRESS: item.mailing_address,
          MAILING_STATE: item.mailing_state,
          MAILING_COUNTRY: item.mailing_country,
          MAILING_PINCODE: item.mailing_pincode,
          EMAIL: item.email,
          IT_PAN: item.it_pan,
          GSTN: item.gstn,
          GST_REGISTRATION_TYPE: item.gst_registration_type,
          GST_SUPPLY_TYPE: item.gst_supply_type,
          GST_DUTY_HEAD: item.gst_duty_head,
          TAX_RATE: item.tax_rate,
          BANK_ACCOUNT_HOLDER: item.bank_account_holder,
          BANK_ACCOUNT_NUMBER: item.bank_account_number,
          BANK_IFSC: item.bank_ifsc,
          BANK_SWIFT: item.bank_swift,
          BANK_NAME: item.bank_name,
          BANK_BRANCH: item.bank_branch,
          BILL_CREDIT_PERIOD: item.bill_credit_period,
        },
      })),
    },
  };

  return create(root).end({ prettyPrint: true });
}

export default parseLedgerDataToXML;
