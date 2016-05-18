var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//get the xml api make him json api and add all the url to new array.
var request = require('request');
var urlarr = [];
function array(urlCats){
request.post(
    'http://thecatapi.com/api/images/get?format=xml&results_per_page=10&type=gif',
    { form: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parseString = require('xml2js').parseString;
            var xml = body;
            parseString(xml, function (err, result) {
                var responsObj = result.response;
                var dataArrayObj = responsObj.data;
                var dataObj = dataArrayObj[0];

                var imagesArray = dataObj.images;
                var imageObj = imagesArray[0];
                var imageArray = imageObj.image;
                for (var i = 0; i < imageArray.length; i++) {
                    var object = imageArray[i];
                    var url = object.url[0];
                    urlarr.push({"id":  i,  "url": url});
                    console.log("url" + url);
                }
            });
        }
    });
    this.urlCats = urlarr;
  }
var urlCats = new array(urlCats);

app.get('/cats', function(req, res) {
    console.log("GET From SERVER");
    res.send(urlCats);
});

app.post('/cats', function(req, res) {
    var ingredient = req.body;
    console.log(req.body);
    urlCats.push(ingredient);
    res.status(200).send("Successfully posted cats url");
});

app.listen(6069);
