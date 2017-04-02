var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
} else {
  mongoURL = 'mongodb://localhost/videoApp';
}

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
     var origin = req.get('origin');
     res.header('Access-Control-Allow-Origin', origin);
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
});

app.route('/history').post(function(req, res){
  console.log("request:" , req.body);
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection('history').updateOne(
      {"id": req.body.id},
      {$set: req.body},
      {upsert:true}
    );
    res.send(req.body);
  });
});

app.route('/history').get(function(req, res){
  MongoClient.connect(mongoURL, function(err, db) {
    var response = [];
    var data = db.collection('history').find();
    data.toArray(function(err, items) {
      console.log("response:", items);
      res.send(items);
    });
  });
});

app.use('/js', express.static(__dirname + '/../client/js'));
app.use('/css', express.static(__dirname + '/../client/css'));
app.use('/views', express.static(__dirname + '/../client/views'));
app.use('/node_modules', express.static(__dirname + '/../node_modules'));
app.route('/*').get(function(req, res){
  res.sendFile('index.html', {root: __dirname + '/../client'});
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {

    console.log( "Listening on " + server_ip_address + ", server_port " + server_port  );

});
