/**
 * Google Apps Script for RTB Survey System
 * 이 코드를 구글 스프레드시트의 [확장 프로그램] > [Apps Script]에 붙여넣으세요.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheetName = data.survey_type === 'SSP' ? 'SSP_Submissions' : 'DSP_Submissions';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);

    // 시트가 없으면 생성
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    const headers = Object.keys(data);

    // 첫 번째 줄(헤더)이 없으면 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', ...headers]);
    }

    // 데이터 추가
    const row = [new Date(), ...headers.map(h => data[h])];
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
