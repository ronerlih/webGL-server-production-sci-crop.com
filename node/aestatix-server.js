var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
//		 csvdata = require('csvdata'),
var fs = require('fs');
//		  jsonexport = require('jsonexport'),
//		  diskspace = require('diskspace'),
var request = require('request');
// var poster =  require("poster");
var cors = require('cors');
var events = require('events');
var multer = require('multer');
//var bodyParser = require('body-parser');

//constructors
var eventEmitter = new events.EventEmitter();
var app = express();

//view engin - ejs
app.set('view engine','ejs');
app.set('views', 'assets/views');
//use
app.use(cors({origin: '*'}));
//app.use(fileUpload());

//tamplate locals
app.locals.local = 'test: success';
app.locals.buckets = {};
app.locals.policy = [];

//template vars
var ownerName = 'Aestatix - webGL';

//vars
var lastImageName;
var options = {
    root: __dirname + '/www/stage.aestatix.com/public_html/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};

//img filter
const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files please'), false);
    }
    cb(null, true);
};
//file upload storage
var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
//		 			console.log("request: " + JSON.stringify(file.originalname));
			 if(file){
			 	var now = new Date();
			 lastImageName = file.fieldname + "_" + now.getDate() + "_" + now.getMonth() + "_" + now.getFullYear() + "_" + now.getHours() + "_" + Math.floor( now.getMilliseconds()/60) + "_" + now.getMilliseconds()%60 + "_" + file.originalname;
			 	console.log("file name:" + lastImageName);
         }
				 
				 callback(null, "./www/stage.aestatix.com/public_html/uploads");
     },
   filename: function(req, file, callback) {
		 	var now = new Date();
         callback(null, file.fieldname + "_" + now.getDate() + "_" + now.getMonth() + "_" + now.getFullYear() + "_" + now.getHours() + "_" + Math.floor( now.getMilliseconds()/60) + "_" + now.getMilliseconds()%60 + "_" + file.originalname);
				 
     }
 });
const upload = multer({ storage: Storage ,fileFilter: imageFilter}).single('img');

//root-home route
app.get('/', function (req, res) {
	//res.send("response..: Success!! ");
	res.sendFile("index.html", options);
	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
});  

//player route
app.get('/player.html', function (req, res) {
	//res.send("response..: Success!! ");
	res.sendFile("iframe-parent.html", options);
	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
});  

//file upload
app.post('/upload',  function (req, res, callback) {
upload(req, res, function (err) {

		if (err){
      console.log(JSON.stringify(err));
//      res.status(400).send("fail saving image");
    } else {
		console.log("file sent");
//		callback(console.log('callback: ' + lastImageName));
		callback(console.log('callback: ' +lastImageName ));
		res.send(lastImageName);
			
    }		
	});
//	console.log("req.file.originalname: " + lastImagePath.file);
//    res.redirect('/');
});

//answer favicon request
app.get('/favicon.ico', function (req, res) {
}); 
		
//resopond to all other routes
//app.get('/*', function (req, res) {
//  console.log("requested /*undefined rout");
//	res.send("..this was a weird rout <br>");
//	logRequest(req.protocol + '://' + req.get('host'),req.originalUrl,req.ip);
//
//});  



//serve static
app.use(express.static('www/stage.aestatix.com/public_html/'));

function logRequest(requestURL, requestQuary, requestIp){
	console.log("requested to: " + requestURL);				
	console.log("client request: " + JSON.stringify( requestQuary));
	console.log("at: " + new Date().toISOString() + "\nfrom: " + requestIp + "\n - done - \n");
}

var ip = process.env.IP || '127.0.0.1';
var port = process.env.PORT || '3000';

app.listen(port, () => console.log('running on port 3000'));
console .log('\n## Hi there, Welcome to node server ##');







































