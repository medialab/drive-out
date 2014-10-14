'use-strict';
var extend   = require('util')._extend,
    fs       = require('fs'),

    Promise  = require('promise'),

    colors   = require('cli-color'),
    request  = require('request'),

    request_sync  = require('request-sync'),
    
    google   = require('googleapis'),
    cheerio = require('cheerio'),

    settings, // cfr module.exports function
    secrets, // the content of SECRETS_PATH .json file
    drive = {};




/*
  Some utils.
  ===
*/
drive.utils = {};

drive.utils.slugify = function(text) {
  return text.toString().toLowerCase()
    .replace(/[\s_]+/g, '-')           // Replace spaces and underscore with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};


/*
  function utils.getFileId 
  ---

  get drive id from a google drive share link,
  e.g "https://drive.google.com/a/sciencespo.fr/folderview?id=0ByZTyEnzm9qqdVkwUWtqa2k1MFU&usp=sharing".match(/ids=(.*?)&/)[1]
*/
drive.utils.getFileId = function(url) {
  var fileId;
  try {
    fileId = url.match(/id=(.*?)&/)[1]
  } catch(err) {
    console.log(err);
    throw 'drive.utils.getFileId failed. Unable to find fileId form the given url: ' + url
  }
  return fileId
};



/*
  function utils.write 
  ---

  fs write a file in sync
*/
drive.utils.write = function(filepath, contents) {
  console.log(colors.white('writing file'), colors.inverse(filepath));    
  var fd = fs.openSync(filepath, 'w');
  fs.writeSync(fd, contents);
  fs.closeSync(fd);
};



/*
  Clean html from sapn and style attributes
  @return cleaned text
*/
drive.utils.clean = function(html){
  if(!html) return html;

  var c = html
            .replace(/<sup(.*?)href="#cmnt(.*?)<\/sup>/g, '')
            .replace(/<div(.*?)href="#cmnt(.*?)<\/div>/g, '') // avoid comment in text
            .replace(/<span(.*?)>/g,'')
            .replace(/<\/span(.*?)>/g,'')
            .replace(/name="(.*?)"/g,'')
            .replace(/style="(.*?)"/g,'')
            .replace(/class="(.*?)"/g,'')
            .replace(/<table(.*?)>/g, function(d, attrs){ return '<table class="table" ' + attrs + '>';})
            .replace(/<a><\/a>/g,'')
            .replace(/<p\s+><\/p>/g,'')
            .replace(/<p\s+>/g,'<p>');
  return c;
}




/*
  function start
  ---
  Core function, return a promise.
*/
drive.start = function() {
  console.log("       __     _                              __ \n  ____/ /____(_)   _____        ____  __  __/ /_\n / __  / ___/ / | / / _ \\______/ __ \\/ / / / __/\n/ /_/ / /  / /| |/ /  __/_____/ /_/ / /_/ / /_  \n\\__,_/_/  /_/ |___/\\___/      \\____/\\__,_/\\__/  \n");

  return new Promise(function (resolve, reject) {
    var oauth2Client = new google.auth.OAuth2(settings.CLIENT_ID, settings.CLIENT_SECRET, settings.REDIRECT_URL);

    var flush = function() {
      secrets = require(settings.SECRETS_PATH);
      oauth2Client.setCredentials(secrets);
      

      console.log('date this token will expire:', colors.inverse(new Date(secrets.expiry_date)));
      console.log();
      console.log();
      //drive = google.drive({ version: 'v2', auth: oauth2Client });
      ///exports.drive = drive; // the original drive api;
      // test dummy drive if everything works
      // check for expiry, then resolve automatically. Handle the case the user has blocked the auth...
      return resolve();
    }

    if(fs.existsSync(settings.SECRETS_PATH)){
      console.log('secrets file found in ' + settings.SECRETS_PATH)
      return flush();

    }
      
    var readline = require('readline'),
        
        rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        }),

        url = oauth2Client.generateAuthUrl({
          access_type: 'offline', // will return a refresh token
          scope: settings.SCOPES // can be a space-delimited string or an array of scopes
        });


    console.log('Please visit the', colors.bold('following url'), 'and authenticate with your', colors.cyan('google drive'),'credentials: ');
    console.log(url);

    rl.question('Enter the code here:', function(code) {
      console.log('Thanks!\nCode:',colors.green(code));
      oauth2Client.getToken(code, function(err, tokens) {
        if(err)
          return reject(err)
        rl.close()

        console.log('gettin\' token from code', tokens);
        secrets = tokens;
        
        drive.utils.write(settings.SECRETS_PATH, JSON.stringify(tokens));

        drive = google.drive({ version: 'v2', auth: oauth2Client });
        return flush();
      });
    });
  });
};



/*
  Response handler for googleapi calls
  ===
*/
drive.response = function(res) {
  console.log(colors.white('    status'), res.statusCode==200? colors.greenBright(res.statusCode): colors.red(res.statusCode));
  var contents = JSON.parse(res.body);

  if(res.statusCode!= 200) {
    console.log('    error ', colors.red(contents.error.message));

    throw 'googleapi response does not allow to proceed...'; 
  };

  return contents;

}


drive.iterators = {};

drive.iterators.basic = function(file) {
  console.log('drive.iterators.basic', file.title)
  return {
    id: file.id,
    title: file.title,
    mimeType: file.mimeType
  };
};


/*
  This special iterator download the content of googleDdocuments
*/
drive.iterators.flatten = function(file, options, results) {
  console.log('drive.iterators.flatten', file.title, file.id);
  
  var result = {
    id: file.id,
    title: file.title,
    slug: drive.utils.slugify(file.title),
    mimeType: file.mimeType
  };
 
  if(file.mimeType == 'application/vnd.google-apps.document') {
    var html = drive.files.getHtml({fileId:file.id}),
        body = html.match(/<body[^>]*>(.*?)<\/body>/i)[1],
        $ = cheerio.load(body);

    result.title = $('.title').text() || file.title;
    result.subtitle = $('.subtitle').text();
    result.html = drive.utils.clean(body);
    result.type = 'document';
  }

  if(file.mimeType == 'image/jpeg' || file.mimeType == 'image/png') {
    drive.files.download({
      downloadUrl: file.downloadUrl,
      filepath: options.mediapath + '/' + file.id + '.' + file.fileExtension
    })


    result.type = 'image';
    result.src = file.id + '.' + file.fileExtension;
    result.bounds = file.imageMediaMetadata // : { width: 930, height: 561 } }
  }

  if(result.slug.indexOf('-metadata')!= -1) {
    result.type = "metadata";
    result.target = result.slug.replace('-metadata', '');
  }

  if(file.mimeType == 'application/vnd.google-apps.folder') {
    result.type = 'folder';
    result.items = drive.files.walk(extend(options,{fileId: file.id}), drive.iterators.flatten);
  }

  return result;
};



/*
  Pseudo-api modules (sync, not async!) meant for drivein specific usage. They do not require Oauth, but the google folder should be publibly available
  ===
*/
drive.open = {};
drive.open.files = {};


drive.open.files.get = function(options) {
  

};

/*
  get html contents
*/
drive.open.files.getHtml = function(options) {
  
};

drive.open.files.list = function(options) {
  
};



/*
  Api modules (sync, not async!)
  ===
*/
drive.files = {}

drive.files.list = function(options) {
  if(!options || !options.fileId)
    throw 'files.list interrupted: please specify a "fileId" field ...';
  
  console.log(colors.white('files.list'), colors.greenBright(options.fileId));

  var res = request_sync({
      url: 'https://www.googleapis.com/drive/v2/files',
      qs:{
        q:  '"'+options.fileId + '" in parents'
      },
      headers: {
        'Authorization' : 'Bearer ' + secrets.access_token
      }
    });

  return drive.response(res);
};


drive.files.getHtml = function(options) {
  if(!options || !options.fileId)
    throw 'files.getHtml interrupted: please specify a "fileId" field ...';
  
  var f = options.format || 'html'; // format can either be html or txt
  console.log('         ',colors.cyan('get '+f), 'of', options.fileId);
  var response = request_sync({
    url: 'https://docs.google.com/feeds/download/documents/export/Export?id='+options.fileId+'&exportFormat=' + f,
    method: 'GET',
    headers: {
      'Authorization' : 'Bearer ' + secrets.access_token
    }
  });
  return response.body;
}


/*
  Download asyncrh the url specified in options.url to options.filepath. 
  Use only with downloadUrl fields.
  @return Promise
*/
drive.files.download =function(options) {
  if(!options || !options.downloadUrl || !options.filepath)
    throw 'files.download interrupted: please specify a "fileId" field AND a "filepath" field...';
  console.log('         ',colors.cyan('download'), 'to', options.filepath);

  var ws = fs.createWriteStream(options.filepath);
  ws.on('error', function(err) { console.log(err); throw 'options filepath ' + options.filepath});
  
  request({
    url: options.downloadUrl,
    headers: {
      'Authorization' : 'Bearer ' + secrets.access_token
    }
  }).pipe(ws) // save image
};


/*
  Recursively look for items in files.list. Then apply iterator function on each item.
  @param fileId - google drive folder fileId
  @param iterator - transform the object, e-g according to the type. There is a short lint under drive.iterators
*/
drive.files.walk = function(options, iterator){
  if(!options || !options.fileId)
    throw 'files.flatten interrupted: please specify a "fileId" field ...';

  if(typeof iterator != 'function')
    iterator = drive.iterators.basic;
  console.log('walking')
  var files = drive.files.list({fileId: options.fileId}),
      results = [];

  // sort files here by function, @todo
  files.items.sort(function(a, b) {
    if (a.title > b.title)
      return 1;
    if (a.title < b.title)
      return -1;
    // a doit être égale à b
    return 0;
  })

  for(var i=0; i<files.items.length; i++) {
    var file = iterator(files.items[i], options, results); // if iterator function return null or undefined
    if(file)
      results.push(file);
  };

  return results;
}


/*
  Main export module.
  ===
*/
module.exports = function(options) {
  settings = extend({
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URL: '',
    YQL_URL: 'https://query.yahooapis.com/v1/public/yql',
    DRIVE_FOLDERVIEW_URL: 'https://drive.google.com/folderview?id=',
    SECRETS_PATH: false,
    SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly'
  }, options);

  // check secrets path
  if(!settings.SECRETS_PATH)
    throw 'settings.SECRETS_PATH must be specified with a valid path. Plase note that Driveout will override that file!'

  return drive;
};