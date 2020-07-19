const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mainFunctions = require('./main.js');
const learnFunction = require('./learn.ts');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const url = require('url');

app.get('/', (req, res) => {
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let pdata = params.get('data').toLowerCase();
  let pdata8 = pdata.replace(/-/gi,'_');
  (async function(){
    let info = await mainFunctions.displayData(pdata,pdata8);
    res.send(info);
  })();
});

app.get('/learn',(req,res) => {
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let pokemon = params.get('pokemon').toLowerCase();
  let ppokemon = pokemon.replace(/-/gi,'');
  let move = params.get('move').toLowerCase();
  let pmove = move.replace(/-/gi,'');
  const existence = learnFunction.doesPokemonMoveExist(ppokemon,move);
  const rexistence = learnFunction.doesPokemonMoveExist(pmove,pokemon);
  if (!(existence||rexistence)){
    res.send("lol wtf was that?");
  }else{
    if(rexistence){
      let temp = move;
      move = pokemon.replace(/-/gi,' ');
      pokemon = temp;
      temp = ppokemon;
      ppokemon = pmove;
      pmove = temp;
    }else{
      move = move.replace(/-/gi,' ');
    }
    const canLearn = learnFunction.doesItLearn(ppokemon,pmove);
    if (canLearn){
      res.send("Yes, "+pokemon+" can learn "+move+" in galar.");
    }else{
      res.send("No, "+pokemon+" can't learn "+move+" in galar.");
    }
  }
});

app.listen(process.env.PORT||5000);
