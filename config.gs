const isiSheet = SpreadsheetApp.openById("-").getSheetByName("Оформление_V.2");
const commonLkSheet = SpreadsheetApp.openById("-").getSheetByName("Оформление_V.2");

const isiSheetId = "-";
const lkSheetId = "-";
const main = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Оформление_V.2");
const isi = SpreadsheetApp.openById(isiSheetId).getSheetByName("Оформление_V.2");
const lk = SpreadsheetApp.openById(lkSheetId).getSheetByName("Оформление_V.2");

const enterString = String.fromCharCode(10);