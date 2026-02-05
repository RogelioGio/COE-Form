function doGet(){
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("LRA Request System")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


function doPost(e) {
  try {

    var sheet = SpreadsheetApp.openById("1q92OCEfRIPR66PzpqErBxmW3xciPvp6KrXAkQkjaBkE").getActiveSheet();
    var folderId = "1L_EG3hJXfGwAHI7QbBihCN1aWegD1E7e"; // <-- ADD FOLDER ID HERE
    var data = JSON.parse(e.postData.contents);

    var requestor = data.requestor;
    var dataOwner = data.dataOwner;
    var email = data.requestorEmail;
    var relationship = data.relationship;
    var idNumber = data.idNumber;
    var issuedOn = data.issuedOn;
    var issuedAt = data.issuedAt;

    // base64 files from React
    var spaBase64 = data.spaFile; 
    var lraBase64 = data.lraId;


    if (!requestor) return json({status:"error", message:"Requestor required"});
    if (!dataOwner) return json({status:"error", message:"Data owner required"});
    if (!email) return json({status:"error", message:"Email required"});
    if (!idNumber) return json({status:"error", message:"ID number required"});

    if (dataOwner === "No" && (!relationship || relationship==""))
      return json({status:"error", message:"Relationship required if not data owner"});

    if (dataOwner === "No" && (!spaBase64 || spaBase64==""))
      return json({status:"error", message:"SPA required if not data owner"});

    if (!lraBase64) return json({status:"error", message:"LRA ID required"});

    // upload to drive
    var spaLink = "";
    var lraIdLink = "";

    if (spaBase64 && spaBase64.startsWith("data")){
      spaLink = uploadFileToDrive(spaBase64, "SPA_"+Date.now(), folderId);
    } else {
      spaLink = spaBase64 || "";
    }

    if (lraBase64 && lraBase64.startsWith("data")){
      lraIdLink = uploadFileToDrive(lraBase64, "LRAID_"+Date.now(), folderId);
    } else {
      lraIdLink = lraBase64 || "";
    }

    //save to sheets.
    sheet.appendRow([
      new Date(),
      requestor,
      dataOwner,
      email,
      relationship,
      idNumber,
      issuedOn,
      issuedAt,
      spaLink,
      lraIdLink
    ]);

    return json({status:"success", message:"Saved with upload"});

  } catch(err){
    return json({status:"error", message:err.toString()});
  }
}

function uploadFileToDrive(base64, fileName, folderId){

  var folder = DriveApp.getFolderById(folderId);

  var contentType = base64.match(/^data:(.*);base64,/)[1];
  var bytes = Utilities.base64Decode(base64.split(',')[1]);

  var extension = contentType.split("/")[1];
  var blob = Utilities.newBlob(bytes, contentType, fileName+"."+extension);

  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

function json(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function testDoPost(){

  // SAMPLE BASE64 SMALL FILE (text test)
  var sampleBase64 = "data:text/plain;base64,SGVsbG8gTFJB";

  var testData = {
    requestor: "Juan Dela Cruz",
    dataOwner: "No",
    requestorEmail: "test@email.com",
    relationship: "Brother",
    idNumber: "12345678",
    issuedOn: "Jan 5 2024",
    issuedAt: "Manila",
    spaFile: sampleBase64,
    lraId: sampleBase64
  };

  var e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  var result = doPost(e);
  Logger.log(result.getContent());
}
