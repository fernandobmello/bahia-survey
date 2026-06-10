// ============================================================
// Google Apps Script — Bahia Survey collector
// ------------------------------------------------------------
// Setup steps:
//
//   1. Go to script.google.com → New project (or use an
//      existing one — either standalone or sheet-bound works)
//
//   2. Delete any existing code, paste this entire file
//
//   3. Make sure SHEET_NAME below matches your sheet name exactly
//
//   4. Click Deploy → New deployment → Web app
//      - Execute as: Me
//      - Who has access: Anyone
//      Click Deploy → authorise when prompted → copy the URL
//
//   5. In each survey HTML file, replace:
//        PASTE_YOUR_APPS_SCRIPT_URL_HERE
//      with the URL you just copied
// ============================================================

// ← Change this if the sheet is ever renamed
const SHEET_NAME = 'Bahia Survey Responses Treatment';

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

// Finds the sheet by name in Google Drive — works whether this
// script is standalone or bound to a spreadsheet
function getSheet() {
  const files = DriveApp.getFilesByName(SHEET_NAME);
  if (!files.hasNext()) {
    throw new Error('Sheet not found: "' + SHEET_NAME + '". Check the name matches exactly.');
  }
  return SpreadsheetApp.openById(files.next().getId()).getActiveSheet();
}

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = getSheet();

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

// Run this manually in the Apps Script editor to confirm
// the script can find and write to the sheet
function testWrite() {
  const sheet = getSheet();
  sheet.appendRow(['TEST_ROW', new Date().toISOString()]);
  Logger.log('Success — wrote to: ' + sheet.getParent().getName());
}
