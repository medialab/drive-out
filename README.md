#Drive-out

welcome to __Drive-out__, the node "exporter" for google drive.


Installation
---


Install dependencies, then copy `settings.example.js` to `settings.js`
	
	cd drive-out
	npm install
	cp settings.example.js settings.js


Since __drive-out__ uses the Google's officially supported [Node.js client library](https://github.com/google/google-api-nodejs-client/), you need to fill settings.js fields with the values provided by the [Google Developers Console](https://console.developers.google.com).
Once accomplished, this task will lead you 

Run the node application given as example
	
	node index.js