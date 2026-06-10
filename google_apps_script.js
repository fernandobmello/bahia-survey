// ============================================================
// Google Apps Script — Bahia Survey collector
// ------------------------------------------------------------
// CORRECT SETUP STEPS:
//
//   1. Go to Google Drive → New → Google Sheets
//      Name it e.g. "Bahia Survey Responses"
//
//   2. Inside that sheet: Extensions menu → Apps Script
//      (This binds the script to YOUR sheet automatically)
//
//   3. Delete any existing code in the editor, paste this
//      entire file
//
//   4. Click Deploy → New deployment → Web app
//      - Execute as: Me
//      - Who has access: Anyone
//      Click Deploy → authorise when prompted → copy the URL
//
//   5. In each survey HTML file, replace:
//        PASTE_YOUR_APPS_SCRIPT_URL_HERE
//      with the URL you just copied
//
// ⚠️  Do NOT create this at script.google.com as a standalone
//     script — it won't know which sheet to write to.
// ============================================================

const COLUMN_ORDER = [
  'timestamp','nte','teacher','school','student','consent',
  'a1','a2','a3','a4',
  'dl5','dl6','dl7','dl8',
  'm1',
  'm7_0_a','m7_0_b','m7_0_c','m7_1_a','m7_1_b','m7_1_c',
  'm7_2_a','m7_2_b','m7_2_c','m7_3_a','m7_3_b','m7_3_c',
  'm7_4_a','m7_4_b','m7_4_c','m7_5_a','m7_5_b','m7_5_c',
  'm7_6_a','m7_6_b','m7_6_c','m7_7_a','m7_7_b','m7_7_c',
  'm7_8_a','m7_8_b','m7_8_c','m7_9_a','m7_9_b','m7_9_c',
  't1','t2','p1',
  'b1','b2','b3','b4',
  'b5','b6','b7','b8','b9','b10',
  'att1',
  'e1','e2','e3','e4','e5','e6','e7','e8','e9','e10','e11','e12',
  'conjoint_0','conjoint_1','conjoint_2','conjoint_3','conjoint_4',
  'opinion_0','opinion_1','opinion_2','opinion_3',
  'att2',
  'ctfc1_q1','ctfc1_q2','ctfc1_q3',
  'conjoint_tasks'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Write header row once
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMN_ORDER);
      sheet.setFrozenRows(1);
    }

    // Build row in fixed column order
    const row = COLUMN_ORDER.map(col => {
      const v = data[col];
      if (v === undefined || v === null) return '';
      if (Array.isArray(v))             return v.join('|');
      if (typeof v === 'object')        return JSON.stringify(v);
      return v;
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this manually inside the Apps Script editor
// to confirm the script can write to the sheet before deploying
function testWrite() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow(['TEST_ROW', new Date().toISOString()]);
  Logger.log('Test row written successfully.');
}
