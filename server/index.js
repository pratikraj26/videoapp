var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = '';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
  url = connection_string;
} else {
  url = 'mongodb://localhost/videoApp';
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
