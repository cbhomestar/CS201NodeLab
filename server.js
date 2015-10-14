var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "client/";
http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  
  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    else {
      if (urlObj.path == "/index.html")
      {
        res.writeHead(200);
        res.end(data);
      }
      else if (urlObj.path == "/cities.txt")
      {
        res.end(JSON.stringify(require("./client/cities.json")));
      }
      else if (urlObj.path == "/test1.html" || urlObj.path == "/test2.txt" || urlObj.path == "/test3.gif" || urlObj.path == "/test4.jpg")
      {
        res.end(data);
      }
      else {
        res.writeHead(200);
        //res.setHeader('Content-Type', 'application/json');
        var myRe = new RegExp("^"+urlObj.query["q"]);
        
        
        var jsonresult = [];
        
        for(var i = 0; i < cityArr.length; i++) {
        var result = cityArr[i].search(myRe);
        if(result != -1) {
          jsonresult.push(cityArr[i]);
        }
      }
        
        res.end(JSON.stringify( jsonresult ));
        //res.end("{hey, there}");
      }
      
    }
    //res.writeHead(200);
    //res.end("hey");//data);
  });
}).listen(process.env.PORT);

var serverData = "";
var cityArr = [];

var options = {
    hostname: 'localhost',
    port: '8080',
    path: '/cities.txt'
  };
function handleResponse(response) {
  
  response.on('data', function (chunk) {
    serverData += chunk;
  });
  response.on('end', function () {
    
    var parsed = JSON.parse(serverData);
    

    for(var x in parsed){
      cityArr.push(parsed[x].Name);
    }
  });
}
http.request(options, function(response){
  handleResponse(response);
}).end();