'use-strict'

var settings = {};


/*
  Modify according to your own google console settings ...
  Client ID and client secret are available at
  https://code.google.com/apis/console
*/
settings.CLIENT_ID			= 'XXXXXXXXX-xxxxxxxxxx.apps.googleusercontent.com';
settings.CLIENT_SECRET		= 'xxxxxxxxxxxxx';
settings.REDIRECT_URL		= '';
settings.DRIVE_FOLDER_URL	= 'https://drive.google.com/folderview?id=XXXXX&usp=sharing';

/*
  Please provide a valid and writeable path for the secrets.json file. This file will be gitignored by default and will contain
  Google OAUTH2 access token.
  Note: drive-out SHOULD override this file!
*/
settings.SECRETS_PATH		= './secrets.json';

module.exports = settings;