'use strict';
/*
  
  Example and basiuc usage for drive-out!
  settings fil have to be in the same level.
*/
var settings = require('./settings'),
    drive = require('../drive-api')(settings),

    fs = require('fs'),

    CONTENTS_PATH = './app/contents';


drive.start().then(function logic() {
  console.log('custom indexer of drive-out');

  var fileId = drive.utils.getFileId("https://drive.google.com/a/sciencespo.fr/folderview?id=0ByZTyEnzm9qqdVkwUWtqa2k1MFU&usp=sharing");
  
  console.log();
  console.log('folder url:', "https://drive.google.com/a/sciencespo.fr/folderview?id=0ByZTyEnzm9qqdVkwUWtqa2k1MFU&usp=sharing");
  console.log('folder id: ', fileId);

  var files = drive.files.walk({fileId: fileId}, drive.iterators.flatten);

  // todo: cycle through files to discover hidden metadata

  // create contents directory if it does not exist
  fs.existsSync(CONTENTS_PATH) || fs.mkdirSync(CONTENTS_PATH);

  // recursive save files data
  
  function save_recursively(items, path) {
    var results = [];

    fs.existsSync(path) || fs.mkdirSync(path);
    
    for(var i in items) {
      
      if(items[i].items){
        var clone = {};
        for(var k in items[i]){ // copy only non items
          if(k != 'items')
            clone[k] =   items[i][k];
        }
        results.push(clone); 
        save_recursively(items[i].items, path + "/" + items[i].slug);
      } else {
        results.push(items[i]);
      }
    };
    // save index here.
    drive.utils.write(path + '/index.json', JSON.stringify(results,null,2)); 
  };
  save_recursively(files, CONTENTS_PATH);
  

}, console.log).catch(function(err) {
  console.log(err)
});