// Where survey responses are sent (Google Apps Script web app URL).
// Edit ONLY this line — every teacher page reads it.
window.ENDLINE2_GS_URL = "PASTE_ENDLINE2_APPS_SCRIPT_URL_HERE";

// Where index.html reads WHO COMPLETED the survey (only teacher + student names).
// Leave empty to use the Apps Script above (?action=status), or point it to a
// Google Sheet CSV query selecting the teacher and student columns, e.g.
// https://docs.google.com/spreadsheets/d/<ID>/gviz/tq?tqx=out:csv&gid=875547696&tq=select%20B%2C%20D
window.ENDLINE2_STATUS_URL = "";
