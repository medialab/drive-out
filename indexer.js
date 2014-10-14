'use strict';
/*
  
  Example and basiuc usage for drive-out!
  settings fil have to be in the same level.
*/
var settings = require('./settings'),
    extend   = require('util')._extend,
    drive    = require('./drive-api')(settings),

    fs       = require('fs'),

    MEDIA_PATH = './app/media',
    CONTENTS_PATH    = './app/contents';


drive.start().then(function logic() {
  console.log('custom indexer of drive-out');

  var fileId = drive.utils.getFileId(settings.DRIVE_FOLDER_URL);
  
  console.log();
  console.log('folder url:', settings.DRIVE_FOLDER_URL);
  console.log('folder id: ', fileId);

  var files = drive.files.walk({fileId: fileId, mediapath: MEDIA_PATH}, drive.iterators.flatten);

  // todo: cycle through files to discover hidden metadata

  // create contents directory if it does not exist
  fs.existsSync(MEDIA_PATH) || fs.mkdirSync(MEDIA_PATH);

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
      } else if(!items[i].target){
        results.push(items[i]);
      }
      
    };

    for(var i in results) {
      for(var j in items) {
        if(results[i].slug == items[j].target){
          results[i].metadata = extend({},items[j]);
          break;
        }
      }
    }

    // save index here.
    drive.utils.write(path + '/index.json', JSON.stringify(results,null,2)); 
  };
  save_recursively(files, CONTENTS_PATH);
  

}, console.log).catch(function(err) {
  console.log(err)
});