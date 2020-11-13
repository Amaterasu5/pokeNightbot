const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const allPokemon = require('../data/allPokemon.json').results;
const galar = require('../data/pokemonGen8.json');
const galarMoves = require('../data/gen8moves.json');
const allMoves = require('../data/allMoves.json').results;
const allAbilities = require('../data/allAbilities.json').results;
const galarAbilities = require('../data/galarAbilities.json');
const allItems = require('../data/allitems.json').results;
const galarItems = require('../data/galarItems.json');
const errorCorrection = require('./error-correction.js');

var methods = {};
methods.displayData = async function(pdata,pdata8,extended,fixed=false){
  let thisUrl=null;
  let apiData=null;
  [pdata,pdata8] = errorCorrection.inputFix(pdata,pdata8);
  thisPokemon = allPokemon.find(element => element.name == pdata);
  thisMove = allMoves.find(element => element.name == pdata);
  thisAbility = allAbilities.find(element => element.name == pdata);
  thisItem = allItems.find(element => element.name == pdata);

  if (galar[pdata8]!=undefined){
    return [fixed,pdata8,displayPokemon(galar[pdata8].abilities,galar[pdata8].stats)];
  }else if (thisPokemon!=undefined){
    thisUrl = thisPokemon.url;
    var promise1 = new Promise((resolve,reject) => {
      $.ajax({
        url:thisUrl,
        dataType:'json',
        success:function(data){
          apiAbilities = data.abilities;
          apiData = data.stats;
          resolve();
        }
      });
    });
    await Promise.all([promise1]);
    return [fixed,pdata,displayPokemon(apiAbilities,apiData)];
  }else if (galarMoves[pdata8]!=undefined){
    return [fixed,pdata8,displayMove(galarMoves[pdata8],extended=false)];
  }else if (thisMove!=undefined){
    thisUrl = thisMove.url;
    var promise2 = new Promise((resolve,reject) => {
      $.ajax({
        url:thisUrl,
        dataType:'json',
        success:function(data){
          apiData = data;
          resolve();
        }
      });
    });
    await Promise.all([promise2]);
    return [fixed,pdata,displayMove(apiData,extended)];
  }else if (galarAbilities[pdata8]!=undefined){
    return [fixed,pdata8,displayAbility(galarAbilities[pdata8],0,extended=false)];
  }else if (thisAbility!=undefined){
    thisUrl = thisAbility.url;
    var promise3 = new Promise((resolve,reject) => {
      $.ajax({
        url:thisUrl,
        dataType:'json',
        success:function(data){
          apiData = data;
          resolve();
        }
      });
    });
    await Promise.all([promise3]);
    return [fixed,pdata,displayAbility(apiData,undefined,extended)];
  }else if(galarItems[pdata8]!=undefined){
    return [fixed,pdata8,displayItem(galarItems[pdata8],extended=false)];
  }else if (thisItem!=undefined){
    thisUrl=thisItem.url;
    var promise4 = new Promise((resolve,reject) => {
      $.ajax({
        url:thisUrl,
        dataType:'json',
        success:function(data){
          apiData = data;
          resolve();
        }
      });
    });
    await Promise.all([promise4]);
    return [fixed,pdata,displayItem(apiData,extended)];
  }else{//when people put in bullshit or spell things wrong
    let pseudo = null;
    for(item of allPokemon){
      if (errorCorrection.editDistance(pdata,item.name)<3){
        pseudo = item.name;
        break;
      }
    }
    for(item in galar){
      if (errorCorrection.editDistance(pdata8,item)<3){
        pseudo = item;
        break;
      }
    }
    for(item of allMoves){
      if (errorCorrection.editDistance(pdata,item.name)<3){
        pseudo = item.name;
        break;
      }
    }
    for(item in galarMoves){
      if (errorCorrection.editDistance(pdata8,item)<3){
        pseudo = item;
        break;
      }
    }
    for(item of allAbilities){
      if (errorCorrection.editDistance(pdata,item.name)<3){
        pseudo = item.name;
        break;
      }
    }
    for(item in galarAbilities){
      if (errorCorrection.editDistance(pdata8,item)<3){
        pseudo = item;
        break;
      }
    }
    for(item of allItems){
      if (errorCorrection.editDistance(pdata,item.name)<3){
        pseudo = item.name;
        break;
      }
    }
    for(item in galarItems){
      if (errorCorrection.editDistance(pdata8,item)<3){
        pseudo = item;
        break;
      }
    }
    if(pseudo){
      return methods.displayData(pseudo,pseudo,extended,fixed=true);
    }else{
      return [false,null,["that's not it bruh"]]; //you spelled it too wrong kek
    }
  }
}

function displayPokemon(abilities,pokedata){
  items=[];
  for (i=0;i<6;i++){
    items.push(' '+pokedata[i].stat.name+': '+ pokedata[i].base_stat);
  }
  abs=[];
  for(i=0;i<abilities.length;i++){
    abs.push(abilities[i].ability.name);
  }
  items=items.join();
  abs=" | abilities: ".concat(abs.join(', '));
  return items+abs;
}

function displayMove(movedata,extended){
   items=[];
   let short_effect='';
   if(extended){
     short_effect = movedata.effect_entries[0].effect.replace('$effect_chance',movedata.effect_chance).replace(/\n/gi,'');
   }else{
     short_effect = movedata.effect_entries[0].short_effect.replace('$effect_chance',movedata.effect_chance);
   }
   items.push('Type: '+movedata.type.name+', Power: '+movedata.power+', Accuracy: '+movedata.accuracy+', Priority: '+ movedata.priority+ ', Max PP: '+parseFloat(movedata.pp,10)*(8.0/5)+', Damage type: '+movedata.damage_class.name+ ', '+short_effect);
   return items.join();
}

function displayAbility(abdata,index,extended){
  items=[];
  if (index==undefined){
    index = abdata.generation.name=='generation-vii'? 0:1;
  }
  let short_effect='';
  if(extended){
    short_effect = abdata.effect_entries[index].effect.replace('$effect_chance',abdata.effect_chance).replace(/\n/gi,'');
  }else{
    short_effect = abdata.effect_entries[index].short_effect.replace('$effect_chance',abdata.effect_chance);
  }
  items.push('Original generation: '+abdata.generation.name+', '+short_effect);
  return items.join();
}

function displayItem(itemdata,extended){
  items=[];
  let short_effect='';
  if(extended){
    short_effect = itemdata.effect_entries[0].effect.replace('$effect_chance',itemdata.effect_chance).replace(/\n/gi,'');
  }else{
    short_effect = itemdata.effect_entries[0].short_effect.replace('$effect_chance',itemdata.effect_chance);
  }
  items.push(short_effect);
  return items.join();
}

function speedOnly(pokedata){
  return pokedata[5].base_stat;
}

async function findPokemon(name){
  let thisPokemon = allPokemon.find(element => element.name == name);
  let speed;
  if (galar[name]!=undefined){
    speed=speedOnly(galar[name].stats);
  }else if (thisPokemon!=undefined){
    thisUrl = thisPokemon.url;
    var promise1 = new Promise((resolve,reject) => {
      $.ajax({
        url:thisUrl,
        dataType:'json',
        success:function(data){
          apiData = data.stats;
          resolve();
        },
        error:function(obj,err){
          reject();
        }
      });
    });
    promise1.then((res)=>{
      speed=speedOnly(apiData);
    }).catch((err)=>{
      console.log(err);
    });
  }
  await Promise.all([promise1]);
  return speed;
}

async function setUpSpeed(pokemon){
  let name=pokemon[0];
  let nature=1;
  let iv=31;
  let ev=252;
  let boost=0;
  let doubled=1;
  let base = await findPokemon(pokemon[0]);
  for(let i=1;i<pokemon.length;i++){
    let current=pokemon[i];
    if(current=='+'){
      nature=1.1;
    }else if(current=='-'){
      nature=.9;
    }
    if(current.includes('iv')){
      iv=parseInt(current.replace('iv',''),10);
    }
    if(current.match(/evs?/g)||current.match(/(?<!\+)[0-9]+/g)){
      ev=parseInt(current.replace(/evs?/,''),10);
    }
    if(current.match(/\+[1-6]/g)){
      boost=parseInt(current.replace('+',''),10);
    }
    if(current=='tw' || current=='tailwind'||current=="swift-swim"||current=="slush-rush"||current=='chlorophyll'||current=="sand-rush"){
      doubled*=2;
    }
  }
  //before boosts
  let speed=Math.floor(nature*(5+Math.floor(.5*(2*base+iv+Math.floor(ev/4.0)))));
  //add boosts
  if(!boost){
    return speed*doubled;
  }
  return Math.floor(speed*(Math.pow(((2+boost)/2.0),(Math.abs(boost)/boost)))*doubled);
}

methods.faster = async function(mon1,mon2){
  speed1 = await setUpSpeed(mon1);
  speed2 = await setUpSpeed(mon2);
  return [speed1,speed2];
}

module.exports = methods;
