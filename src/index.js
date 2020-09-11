const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mainFunctions = require('./main.js');
const learnFunction = require('./learn.ts');
const calculate = require('./calculate.js');
const evString = require('./evs.js');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const app = express();
const url = require('url');
const fs = require('fs');
const path = require('path');

app.get('/index',(req,res) => {
  res.writeHead(200,{
    'Content-Type':'text/html'
  });
  fs.readFile(path.join(__dirname,'index.html'),null,(e,d)=>{
    res.write(d);
  });
});

app.get('/', (req, res) => {
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let pdata = params.get('data').toLowerCase();
  let pdata8 = pdata.replace(/-/gi,'_');
  console.log(params.get('extended'));
  let extended = params.get('extended')? params.get('extended').includes('extra'):false;
  console.log(extended);
  (async function(){
    const [fixed,finalP,info] = await mainFunctions.displayData(pdata,pdata8,extended);
    if(fixed){
      res.send(["Did you mean "+finalP+"? " + info]);
    }else{
      res.send(info);
    }
  })();
});

app.get('/learn',(req,res) => {
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let pokemon = params.get('pokemon').toLowerCase();
  let ppokemon = pokemon.replace(/-/gi,'');
  let move = params.get('move').toLowerCase();
  let pmove = move.replace(/-/gi,'');
  const [existence,fmon,fmove] = learnFunction.doesPokemonMoveExist(ppokemon,move);
  const [rexistence,rmon,rmove] = learnFunction.doesPokemonMoveExist(pmove,pokemon);
  if (!(existence||rexistence)){
    res.send("that's not it bruh");
  }else{
    if(rexistence){
      move = rmove.replace(/-/gi,' ').replace(/_/gi,' ');
      pokemon = rmon;
      ppokemon = rmon.replace(/-/gi,'').replace(/_/gi,'');
      pmove = rmove.replace(/-/gi,'').replace(/_/gi,'');
    }else{
      move = fmove.replace(/-/gi,' ').replace(/_/gi,' ');
      pokemon = fmon;
      ppokemon = fmon.replace(/-/gi,'').replace(/_/gi,'');
      pmove = fmove.replace(/-/gi,'').replace(/_/gi,'');
    }
    const canLearn = learnFunction.doesItLearn(ppokemon,pmove);
    if (canLearn){
      res.send("Yes, "+pokemon+" can learn "+move+" in galar.");
    }else{
      res.send("No, "+pokemon+" can't learn "+move+" in galar.");
    }
  }
});

app.get('/calc',(req,res) => {
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let attackerData = params.get('attacker').split(',');
  let attacker = calculate.setUpPokemon(attackerData);
  let defenderData = params.get('defender').split(',');
  let defender = calculate.setUpPokemon(defenderData);
  let move = params.get('move').replace(/-/,' ');
  let fieldData = params.get('field');
  let field = fieldData? calculate.setUpField(fieldData.split(',')):{};
  let result = calculate.performCalc(attacker,defender,move,field);
  if(result){
    res.send([result]);
  }else{
    res.send("sorry boss idk");
  }
});

app.get('/evs',(req,res)=>{
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let rawEVs = params.get('evs');
  result=evString.vitamins(rawEVs);
  res.send([result]);
});

app.listen(process.env.PORT||5000);
