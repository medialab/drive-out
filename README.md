#Drive-out

welcome to __Drive-out__, the node "exporter" for google drive. It parses GoogleDocument files,downloads files and much more. It comes with a (quite) full working website that gives you a preview of your google drive folder.



1. Get the Google OAUTH2 working
---
__Drive-out__ uses the Google's officially supported [Node.js client library](https://github.com/google/google-api-nodejs-client/). This measn that you you need to provide some values in driveout `settings.js` file.

Go to the [google developer console](https://console.developers.google.com) and authenticate with your _google credentials_.

One authenticated, follow these instruction carefully:

1. create a new project
2. Under __APIs & Auth__ / __APIs__ please enable __DriveAPI__ by setting its status to __ON__
3. Under __APIs & Auth__ / __Credentials__ click on __create new Client ID__ and select  `Installed application` for _Application type_ and `Other` when the Installed Application Type panel appears.
4. Under __APIs & Auth__ / __Concsent Screen__ select an _EMAIL ADDRESS_ and give a _PRODUCT NAME_ to your application.

Remember to double check the google drive api credentials, the application name, email and product Name.



2. Installation
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



3. Get the data ...
---

Now comes the __tricky part__.
First of all, get the [sharing link](https://support.google.com/drive/answer/2494822?hl=en) for the google drive folder you want to drive-out, something like `https://drive.google.com/folderview?id=XXXXXXXXXXX&usp=sharing`.

Please note that the shared folder can belong to any other google account - that's why you need to authorize the drive-out application to read the shared folder (Cfr. step 1).

Fill the `settings.js` file accordingly. Almost all those lines are mandatory:

	settings.CLIENT_ID = 'YOUR GOOGLE CLIENT ID.apps.googleusercontent.com';
	settings.CLIENT_SECRET = 'YOUR GOOGLE CLIENT SECRET';
	settings.REDIRECT_URL = 'YOUR GOOGLE REDIRECT_URL';
	settings.DRIVE_FOLDER_URL = 'https://drive.google.com/folderview?id=XXXXXXXXXXX&usp=sharing';

Drive_out will store your oauth2 token under a file named `secrets.json`. Feel free to change the file location, but make sure it is an absolute path (with slash).

	settings.SECRETS_PATH = './secrets.json';

Then get the data from your google drive folder:

	npm start

copy the link after this line and paste to your browser address bar

	Please visit the following url and authenticate with your google drive credentials: 

Normally you will be asked for your google credential and should receive a code as answer. Copy and paste the code into the terminal :

	Enter the code here:



4. ... and run
---
And finally run the grunt serve to host the website:
	
	grunt serve

or 
	
	grunt build

and copy the dist path to your server root.

	
	