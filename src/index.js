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
//comment for update

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
  if (!pdata){res.redirect('/index');}
  let pdata8 = pdata.replace(/-/gi,'_');
  let extended = params.get('extended')? params.get('extended').includes('extra'):false;
  (async function(){
    let [fixed,finalP,info] = await mainFunctions.displayData(pdata,pdata8,extended);
    if(fixed){
      if(info.length+finalP.length>378){
        info=info.substring(0,378-finalP.length);
      }
      res.send(["Did you mean "+finalP+"? " + info]);
    }else{
      if(info.length>390){
        info=info.substring(0,391);
      }
      res.send([info]);
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
  let gen = params.get('gen')&&params.get('gen')!='null'?params.get('gen'):'9';
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
    const canLearn = learnFunction.doesItLearn(ppokemon,pmove,gen);
    let phrase = gen!='any'?" in gen "+gen+".":canLearn?" in some generation.":" in any generation.";
    if (canLearn){
      res.send("Yes, "+pokemon+" can learn "+move+phrase);
    }else{
      res.send("No, "+pokemon+" can't learn "+move+phrase);
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
    res.send(["sorry boss idk"]);
  }
});

app.get('/evs',(req,res)=>{
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let rawEVs = params.get('evs').toLowerCase().replace(/ /gi,'');
  let result = evString.vitamins(rawEVs);
  res.send([result]);
});

app.get('/speed',(req,res)=>{
  var searchQuery = req.originalUrl.replace(req.path,'');
  let params = new URLSearchParams(searchQuery);
  let pokemon1Data = params.get('mon1').toLowerCase().split(',');
  let pokemon2Data = params.get('mon2').toLowerCase().split(',');
  (async function(){
    const [speed1, speed2] = await mainFunctions.faster(pokemon1Data,pokemon2Data);
    if(speed1>speed2){
      res.send([pokemon1Data[0]+" has "+speed1+" speed and is faster than "+pokemon2Data[0]+" at "+speed2+" speed."]);
    }else if(speed2>speed1){
      res.send([pokemon2Data[0]+" has "+speed2+" speed and is faster than "+pokemon1Data[0]+" at "+speed1+" speed."]);
    }else{
      res.send([pokemon1Data[0]+" and "+pokemon2Data[0]+" are speed tying at "+speed1]);
    }
  })();
});

// app.get('/ct',(req,res)=>{
//   var searchQuery = req.originalUrl.replace(req.path,'');
//   let params = new URLSearchParams(searchQuery);
//   let mon = params.get('mon').toLowerCase();
//   var crownTundra = ['Nidoran-f','Nidorina', 'Nidoqueen', 'Nidoran-m', 'Nidorino', 'Nidoking', 'Zubat', 'Golbat', 'Jynx', 'Electabuzz', 'Magmar', 'Omanyte', 'Omastar', 'Kabuto', 'Kabutops', 'Aerodactyl', 'Articuno', 'Zapdos', 'Moltres', 'Dratini', 'Dragonair', 'Dragonite', 'Crobat', 'Smoochum', 'Elekid', 'Magby', 'Raikou', 'Entei', 'Suicune', 'Lugia', 'Ho-Oh', 'Treecko','Grovyle','Sceptile','Torchic','Combusken','Blaziken','Mudkip','Marshtomp', 'Swampert', 'Aron', 'Lairon', 'Aggron', 'Swablu', 'Altaria', 'Lileep', 'Cradily', 'Anorith', 'Armaldo', 'Absol', 'Spheal', 'Sealeo', 'Walrein', 'Relicanth', 'Bagon', 'Shelgon', 'Salamence', 'Beldum', 'Metang', 'Metagross', 'Regirock', 'Regice', 'Registeel', 'Latias', 'Latios', 'Kyogre', 'Groudon', 'Rayquaza', 'Spiritomb', 'Gible', 'Gabite', 'Garchomp', 'Electivire', 'Magmortar', 'Uxie', 'Mesprit', 'Azelf','Dialga','Palkia', 'Heatran','Regigigas','Giratina','Cresselia', 'Victini', 'Audino', 'Tirtouga', 'Carracosta', 'Archen', 'Archeops', 'Cryogonal', 'Tornadus','Tornadus-therian','Tornadus-incarnate', 'Thundurus','Thundurus-incarnate', 'Thundurus-therian', 'Landorus','Landorus-incarnate','Landorus-therian', 'Genesect', 'Tyrunt', 'Tyrantrum', 'Amaura', 'Aurorus', 'Carbink', 'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Volcanion', 'Tapu-Koko', 'Tapu-Lele', 'Tapu-Bulu', 'Tapu-Fini', 'Nihilego', 'Buzzwole', 'Pheromosa', 'Xurkitree', 'Celesteela', 'Kartana','Guzzlord','Poipole','Naganadel','Stakataka','Blacephalon','Calyrex','Slowking-galar','Regieleki','Regidrago'];
//   crownTundra = crownTundra.map(x=>x.toLowerCase());
//   if(crownTundra.includes(mon)){
//     res.send("Yeah, "+mon+" is new in Crown Tundra");
//   }else{
//     res.send("No, "+mon+" is not gonna be new in Crown Tundra :(");
//   }
// });

app.listen(process.env.PORT||5000);
