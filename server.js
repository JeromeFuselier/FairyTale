/* 
Copyright 2018 - University of Liverpool

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var express = require('express');
var app = express();
var fs = require("fs");

app.use('/js', express.static('static/js'))
app.use('/css', express.static('static/css'))
app.use('/img', express.static('static/img'))


app.use('/db_img', express.static('db/img'))

app.get('/fairy', function (req, res) {
   res.sendFile( __dirname + "/" + "interface.html" );
})

const data = require('./db/db.json')

app.get('/db', function (req, res) {
  /*res.header("Content-Type",'application/json');
  res.send(JSON.stringify(data));*/
  res.json(data);
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})
