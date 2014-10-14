#Drive-out

welcome to __Drive-out__, the node "exporter" for google drive. It parses GoogleDocument files,downloads files and much more. It comes with a (quite) full working website that gives you a preview of your google drive folder.

1. Get the Google OAUTH2 working
---
__Drive-out__ uses the Google's officially supported [Node.js client library](https://github.com/google/google-api-nodejs-client/), you need to fill some variables in `website/settings.js` file with the values provided by the [Google Developers Console](https://console.developers.google.com).
Remember to check the google drive api credentials, the application name, email and product Name.

1. Installation
---
Driveout needs [node](http://nodejs.org/) already installed, [bower](http://bower.io/#install-bower) and [grunt-cli](http://gruntjs.com/getting-started) as well. Open your terminal and type:
	
	npm install -g bower
	npm install -g grunt
	
Once git-cloned, install the dependencies required by drive_api.js

	cd ~~/drive-out
	npm install

Then install the requirements for the website viewer:
	
	cd ~~/drive-out/website
	cp settings.example.js settings.js
	npm install
	bower install

Edit the `settings.js` file 

1. Get the data ...
---

Now comes the tricky part.
First of all, get the [sharing link](https://support.google.com/drive/answer/2494822?hl=en) for the google drive folder you want to drive-out, something like `https://drive.google.com/folderview?id=XXXXXXXXXXX&usp=sharing`

	cd ~~/drive-out/website
	node indexer.js
	
Copy and paste the link in the same browser to follow asked for a code


1. ... and run
---
And finally run the grunt serve to host the website:
	
	cd ~~/drive-out/website
	grunt serve
	
	