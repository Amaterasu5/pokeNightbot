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
methods.displayData = async function(pdata,pdata8, fixed=false){
  let thisUrl=null;
  let apiData=null;
  if(pdata8=='urshifu') pdata8='urshifu_single_strike';
  thisPokemon = allPokemon.find(element => element.name == pdata);
  thisMove = allMoves.find(element => element.name == pdata);
  thisAbility = allAbilities.find(element => element.name == pdata);
  thisItem = allItems.find(element => element.name == pdata);

  if (galar[pdata8]!=undefined){
    return [fixed,pdata8,displayPokemon(galar[pdata8].stats)];
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
    return [fixed,pdata,displayPokemon(apiData)];
  }else if (galarMoves[pdata8]!=undefined){
    return [fixed,pdata8,displayMove(galarMoves[pdata8])];
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
    return [fixed,pdata,displayMove(apiData)];
  }else if (galarAbilities[pdata8]!=undefined){
    return [fixed,pdata8,displayAbility(galarAbilities[pdata8],0)];
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
    return [fixed,pdata,displayAbility(apiData,undefined)];
  }else if(galarItems[pdata8]!=undefined){
    return [fixed,pdata8,displayItem(galarItems[pdata8])];
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
    return [fixed,pdata,displayItem(apiData)];
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
      return methods.displayData(pseudo,pseudo,fixed=true);
    }else{
      return [false,null,["lol wtf was that"]]; //you spelled it too wrong kek
    }
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
   let short_effect = movedata.effect_entries[0].short_effect.replace('$effect_chance',movedata.effect_chance);
   items.push('Type: '+movedata.type.name+', Power: '+movedata.power+', Accuracy: '+movedata.accuracy+', Priority: '+ movedata.priority+ ', Max PP: '+parseFloat(movedata.pp,10)*(8.0/5)+', Damage type: '+movedata.damage_class.name+ ', '+short_effect);
   return items;
}

function displayAbility(abdata,index){
  items=[];
  if (index==undefined){
    index = abdata.generation.name=='generation-vii'? 0:1;
  }
  let short_effect = abdata.effect_entries[0].short_effect.replace('$effect_chance',abdata.effect_chance);
  items.push('Original generation: '+abdata.generation.name+', '+abdata.effect_entries[index].short_effect);
  return items;
}

function displayItem(itemdata){
  items=[];
  let short_effect = itemdata.effect_entries[0].short_effect.replace('$effect_chance',itemdata.effect_chance);
  items.push(itemdata.effect_entries[0].short_effect);
  return items;
}

module.exports = methods;
