#Drive-out

welcome to __Drive-out__, the node "exporter" for google drive. It parses GoogleDocument files,downloads files and much more. It comes with a (quite) full working website that gives you a preview of your google drive folder.

1. Get the Google OAUTH2 working
---
__Drive-out__ uses the Google's officially supported [Node.js client library](https://github.com/google/google-api-nodejs-client/), you need to fill some variables in `website/settings.js` file with the values provided by the [Google Developers Console](https://console.developers.google.com).
Remember to check the google drive api credentials, the application name, email and product Name.

1. Installation
---
Driveout needs [node](http://nodejs.org/) because it uses [bower](http://bower.io/#install-bower) and [grunt-cli](http://gruntjs.com/getting-started) as well. Open your terminal and type:
	
	npm install -g bower
	npm install -g grunt
	
Git-cloned (e.g under `~~/`) and install the dependencies required by drive_api.js:

	cd ~~/drive-out
	npm install
	bower install
	
	

Copy the `settings.js` file

	cp settings.js.example settings.js

1. Get the data ...
---

Now comes the tricky part.
First of all, get the [sharing link](https://support.google.com/drive/answer/2494822?hl=en) for the google drive folder you want to drive-out, something like `https://drive.google.com/folderview?id=XXXXXXXXXXX&usp=sharing`.
Fill the `settings.js` file carefully. Almost all those lines are mandatory:

	settings.CLIENT_ID = 'YOUR GOOGLE CLIENT ID.apps.googleusercontent.com';
	settings.CLIENT_SECRET = 'YOUR GOOGLE CLIENT SECRET';
	settings.REDIRECT_URL = 'YOUR GOOGLE REDIRECT_URL';
	settings.DRIVE_FOLDER_URL = 'https://drive.google.com/folderview?id=XXXXXXXXXXX&usp=sharing';

Drive_out will store your oauth2 token under a file named `secrets.json`. Feel free to change the file location, but try to use an absolute path.

	settings.SECRETS_PATH = './secrets.json';

Then get the data from your google drive folder:

	npm start

copy the link after this line and paste to your browser address bar

	Please visit the following url and authenticate with your google drive credentials: 

Normally you will be asked for your google credential and should receive a code as answer. Copy and paste the code into the terminal :

	Enter the code here:


1. ... and run
---
And finally run the grunt serve to host the website:
	
	grunt serve
	
	