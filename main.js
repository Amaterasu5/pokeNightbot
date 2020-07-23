const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const allPokemon = require('./allPokemon.json').results;
const galar = require('./pokemonGen8.json');
const galarMoves = require('./gen8moves.json');
const allMoves = require('./allMoves.json').results;
const allAbilities = require('./allAbilities.json').results;
const galarAbilities = require('./galarAbilities.json');
const allItems = require('./allitems.json').results;


var methods = {};
methods.displayData = async function(pdata,pdata8){
  let thisUrl=null;
  let apiData=null;
  thisPokemon = allPokemon.find(element => element.name == pdata);
  thisMove = allMoves.find(element => element.name == pdata);
  thisAbility = allAbilities.find(element => element.name == pdata);
  thisItem = allItems.find(element => element.name == pdata);

  if (galar[pdata8]!=undefined){
    return displayPokemon(galar[pdata8].stats);
  }else if (thisPokemon!=undefined){
    thisUrl = thisPokemon.url;
    var promise1 = new Promise((resolve,reject) => {
      $.ajax({
        url:thisUrl,
        dataType:'json',
        success:function(data){
          apiData = data.stats;
          resolve();
        }
      });
    });
    await Promise.all([promise1]);
    return displayPokemon(apiData);
  }else if (galarMoves[pdata8]!=undefined){
    return displayMove(galarMoves[pdata8]);
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
    return displayMove(apiData);
  }else if (galarAbilities[pdata8]!=undefined){
    return displayAbility(galarAbilities[pdata8],0);
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
    return displayAbility(apiData,undefined);
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
    return displayItem(apiData);
  }else{//when people put in bullshit or spell things wrong
    return ["lol wtf was that"];
  }
}

function displayPokemon(pokedata){
  items=[];
  for (i=0;i<6;i++){
    items.push(' '+pokedata[i].stat.name+': '+ pokedata[i].base_stat);
  }
  return items;
}

function displayMove(movedata){
   items=[];
   items.push('Type: '+movedata.type.name+', Power: '+movedata.power+', Accuracy: '+movedata.accuracy+', Priority: '+ movedata.priority+ ', Max PP: '+parseInt(movedata.pp,10)*(8.0/5)+', Damage type: '+movedata.damage_class.name+ ', '+movedata.effect_entries[0].short_effect);
   return items;
}

function displayAbility(abdata,index){
  items=[];
  if (index==undefined){
    index = abdata.generation.name=='generation-vii'? 0:1;
  }
  items.push('Original generation: '+abdata.generation.name+', '+abdata.effect_entries[index].short_effect);
  return items;
}

function displayItem(itemdata){
  items=[];
  items.push(itemdata.effect_entries[0].short_effect);
  return items;
}

module.exports = methods;
