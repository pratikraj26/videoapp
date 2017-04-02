var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb');
var url = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
var mongoURLLabel = '';


if (url == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = url = 'mongodb://';
    if (mongoUser && mongoPassword) {
      url += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    url += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}

console.log(url);

app.use(bodyParser.json());

app.route('/history').post(function(req, res){
  MongoClient.connect(url, function(err, db) {
    db.collection('history').updateOne(
      {"id": req.body.id},
      {$set: req.body},
      {upsert:true}
    );
    res.send(req.body);
  });
});

app.route('/history').get(function(req, res){
  MongoClient.connect(url, function(err, db) {
    var response = [];
    var data = db.collection('history').find();
    data.toArray(function(err, items) {
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


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.listen(port, ip, function () {
    console.log( "Listening on " + ip + ", server_port " + port  );
});
module.exports = app;
