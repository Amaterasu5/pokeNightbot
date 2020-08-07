const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mainFunctions = require('./main.js');
const learnFunction = require('./learn.ts');
const calculate = require('./calculate.js');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const app = express();
//app.use(bodyParser.json());
//app.use(cookieParser());
const url = require('url');

app.get('/', (req, res) => {
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let pdata = params.get('data').toLowerCase();
  let pdata8 = pdata.replace(/-/gi,'_');
  (async function(){
    const [fixed,finalP,info] = await mainFunctions.displayData(pdata,pdata8);
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
    res.send("lol wtf was that?");
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
  attackerData = params.get('attacker').split(',');
  attacker = setUpPokemon(attackerData);
  defenderData = params.get('defender').split(',');
  defender = setUpPokemon(defenderData);
  move=params.get('move').replace(/-/,' ');
  field={};
  result = calculate.performCalc(attacker,defender,move,field);
  if(result){
    res.send([result]);
  }else{
    res.send("sorry boss idk");
  }
});

function capitalizeWords(string){
  words=string.split(' ');
  for(i=0;i<words.length;i++){
    words[i]=words[i].charAt(0).toUpperCase()+words[i].substring(1);
  }
  return words.join(' ');
}

function setUpPokemon(data){
  const stats=['hp','atk','def','spa','spd','spe'];
  const statChange={spatk:'spa',spdef:'spd',speed:'spe'};
  monEvs={};
  for(let item of data){
    for(let stat of stats){
      //console.log(item);
      if(statChange.hasOwnProperty(item.substring(0,5))){
        item=statChange[item.substring(0,5)]+item.substring(5);
      }
      if(item.includes(stat)){
        monEvs[stat]=item.replace(stat+'=','');
      }
    }
  }
  item=data.find(element=>element.includes('item='));
  nature=data.find(element =>element.includes('nature='));
  boosts=data.find(element=> element.charAt(0)=="+"||element.charAt(0)=='-');
  pokemon={
    name:capitalizeWords(data[0]),
    item:item?capitalizeWords(item.substring(5).replace(/-/gi,' ')):null,
    nature:nature?nature.substring(7):null,
    boosts:boosts?boosts.substring(1):null,
    evs:monEvs,
    dynamax:data.some(element => element.includes('dynamax'))
  };
  console.log(pokemon.dynamax);
  return pokemon;
}

app.listen(process.env.PORT||5000);
