function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("Certificate of Employment")
    // CHANGED: DEFAULT prevents external sites from breaking your UI layout
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT) 
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}


function saveForm(values) {
  //IDs
  var mainFolderId = "1L_EG3hJXfGwAHI7QbBihCN1aWegD1E7e"; 
  var spreadsheetId = "1q92OCEfRIPR66PzpqErBxmW3xciPvp6KrXAkQkjaBkE";

  try {
    var sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
   
    // 1. Destructure exactly as React sends it (Case Sensitive!)
    var {
      Requestor_Name,
      Data_Owner,
      Requester_Email,
      Relation,
      ID_Number,
      Issue_On,
      officeDepartment, // <--- Correct: camelCase matches React
      SPA_Authorization,
      LRA_Official_ID
    } = values;

    // 2. Validate
    if (!Requestor_Name) return {status: "error", message: "Requestor Name is required"};
    if (!Data_Owner) return {status: "error", message: "Data Owner is required"};
    if (!Requester_Email) return {status: "error", message: "Email is required"};
    if (!Issue_On) return {status: "error", message: "Issue Date is required"};
    
    // Validate Office Department
    if (!officeDepartment) return {status: "error", message: "Issue Place (Office/Department) is required"}; 
    
    if (!ID_Number) return {status: "error", message: "ID Number is required"};

    // Validate Relationship if not Data Owner
    if (Data_Owner === "No") {
      if (!Relation) return {status: "error", message: "Relation is required for non-owners"};
      if (!SPA_Authorization) return {status: "error", message: "SPA Authorization file is required"};
    }

    // 3. Folder Logic
    var folderSuffix = ID_Number ? " (" + ID_Number + ")" : " (" + Date.now() + ")";
    var userFolderName = Requestor_Name + folderSuffix;
    
    var userFolderId = getOrCreateSubfolder(mainFolderId, userFolderName); 

    // 4. FILE UPLOAD 
    var spaLink = "N/A";
    var lraLink = "N/A";

    if (SPA_Authorization) {
      // CHANGED: Added ".pdf" extension so Drive knows how to open it
      spaLink = uploadFileToDrive(SPA_Authorization, "SPA_Auth.pdf", userFolderId);
    }

    if (LRA_Official_ID) {
      // CHANGED: Added ".pdf" extension
      lraLink = uploadFileToDrive(LRA_Official_ID, "LRA_ID.pdf", userFolderId);
    }

    // 5. SAVE TO SHEET
    sheet.appendRow([
      new Date(),       // Timestamp
      Requestor_Name,
      Data_Owner,
      Requester_Email,
      Relation,
      ID_Number,
      Issue_On,
      officeDepartment, // Correct variable passed
      spaLink,
      lraLink
    ]);

    return {status: "success", message: "Request submitted successfully!"};

  } catch (err) {
    Logger.log(err.toString());
    return {status: "error", message: "System Error: " + err.toString()};
  }
}


function getOrCreateSubfolder(parentFolderId, subfolderName) {
  var parentFolder = DriveApp.getFolderById(parentFolderId);
  var folders = parentFolder.getFoldersByName(subfolderName);
  
  if (folders.hasNext()) {
    return folders.next().getId();
  } else {
    return parentFolder.createFolder(subfolderName).getId();
  }
}


function uploadFileToDrive(base64Data, fileName, folderId) {
  try {
    if (!base64Data || !folderId) throw new Error("Missing data or folder ID");

    var folder = DriveApp.getFolderById(folderId);
    
    var decodedBytes = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decodedBytes);
    
    blob.setName(fileName); 
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();

  } catch (e) {
    Logger.log("Upload Error: " + e.toString());
    return "Error Uploading File";
  }
}


function sendEmailNotification(values, spaLink, lraLink) {
  var template = HtmlService.createTemplateFromFile("EmailTemplate"); // Make sure your HTML file is named 'EmailTemplate.html'
  
  // Pass the data to the template
  template.data = {
    name: values.Requestor_Name,
    id: values.ID_Number,
    email: values.Requester_Email,
    owner: values.Data_Owner,
    relation: values.Relation || "N/A",
    date: values.Issue_On,
    place: values.officeDepartment,
    lraLink: lraLink,
    spaLink: spaLink
  };

  var emailBody = template.evaluate().getContent();

  
  GmailApp.sendEmail("techojt398@gmail.com", "New COE Request: " + values.Requestor_Name, "", {
    htmlBody: emailBody
  });
}