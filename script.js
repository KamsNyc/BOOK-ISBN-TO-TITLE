const COLUMN_ISBN = 0;
const COLUMN_TITLE = 1;
const COLUMN_AUTHORS = 3;
const API_URL = "https://www.googleapis.com/books/v1/volumes?country=US";

function processDataFromGoogleSheet(url) {
  var spreadsheet = SpreadsheetApp.openByUrl(url);
  var dataSheet = spreadsheet.getSheets()[0];
  var data = dataSheet.getDataRange().getValues();
  for (var i=1; i<data.length; i++) {
    var isbn = data[i][COLUMN_ISBN];
    var title = data[i][COLUMN_TITLE];
    if(title == '') {
      var bookData = getBookDetails(isbn);
      if (bookData) {
        title = bookData["volumeInfo"]["title"];
        var authors = bookData["volumeInfo"]["authors"];
        dataSheet.getRange(i+1, COLUMN_TITLE+1).setValue(title);
        dataSheet.getRange(i+1, COLUMN_AUTHORS).setValue(authors);
        SpreadsheetApp.flush();
      } else {
        dataSheet.getRange(i+1, COLUMN_TITLE+1).setValue('Error finding ISBN data. Please see Logs');
      }
    }
  } 
}

function getBookDetails(isbn) {
  var url = API_URL + "&q=isbn:" + isbn;
  var response = UrlFetchApp.fetch(url);
  var results = JSON.parse(response.getContentText());
  if (results.totalItems) {
    var book = results.items[0];
    return book;
  } 
  return false;
}

processDataFromGoogleSheet("https://docs.google.com/spreadsheets/d/example123/edit");
