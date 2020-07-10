const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mainFunctions = require('./main.js');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const url = require('url');

app.get('/', (req, res) => {
  var searchQuery = req.originalUrl;
  searchQuery = searchQuery.charAt(0)=='/'? searchQuery.substring(1) : searchQuery;
  let params = new URLSearchParams(searchQuery);
  let pdata = params.get('data');
  let pdata8 = pdata.replace(/-/gi,'_');
  (async function(){
    let info = await mainFunctions.displayData(pdata,pdata8);
    res.send(info);
  })();
});

app.listen(8000process.env.PORT||5000);
