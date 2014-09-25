'use strict';
/*
  
  Example and basiuc usage for drive-out!
*/
var settings = require('./settings'),
    drive = require('./drive-api')(settings);


/*
  Download files along with their data
*/ 
drive.start().then(function logic() {
  console.log('put your logic herew');

  var fileId = drive.utils.getFileId("https://drive.google.com/a/sciencespo.fr/folderview?id=0ByZTyEnzm9qqdVkwUWtqa2k1MFU&usp=sharing");
  console.log('folder', fileId);

  var files = drive.files.walk({fileId: fileId}, drive.iterators.flatten);

  drive.utils.write('./items.json', JSON.stringify(files, null, 2))
  console.log(files);


}, console.log).catch(function(err) {
  console.log(err)
});