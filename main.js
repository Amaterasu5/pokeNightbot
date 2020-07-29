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
const galarItems = require('./galarItems.json');

var methods = {};
methods.displayData = async function(pdata,pdata8, fixed=false){
  let thisUrl=null;
  let apiData=null;
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
      if (editDistance(pdata,item.name)<2){
        pseudo = item.name;
        break;
      }
    }
    for(item in galar){
      if (editDistance(pdata8,item)<2){
        pseudo = item;
        break;
      }
    }
    for(item of allMoves){
      if (editDistance(pdata,item.name)<2){
        pseudo = item.name;
        break;
      }
    }
    for(item in galarMoves){
      if (editDistance(pdata8,item)<2){
        pseudo = item;
        break;
      }
    }
    for(item of allAbilities){
      if (editDistance(pdata,item.name)<2){
        pseudo = item.name;
        break;
      }
    }
    for(item in galarAbilities){
      if (editDistance(pdata8,item)<2){
        pseudo = item;
        break;
      }
    }
    for(item of allItems){
      if (editDistance(pdata,item.name)<2){
        pseudo = item.name;
        break;
      }
    }
    for(item in galarItems){
      if (editDistance(pdata8,item)<2){
        pseudo = item;
        break;
      }
    }
    if(pseudo){
      return methods.displayData(pseudo,pseudo,fixed=true);
    }else{
      return ["lol wtf was that"]; //you spelled it too wrong kek
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

function editDistance(string1, string2){
  var m = string1.length;
  var n = string2.length;
  var memoTable = new Array();
  for (i=0;i<m;i++){
    memoTable.push((new Array(n)).fill(-1));
  }
  return editRecur(string1, string2, m, n, memoTable);
}


function editRecur(string1, string2, m, n, memoTable){
  if(m==0) return n;
  if(n==0) return m;
  if(memoTable[m-1][n-1]!=-1){
    return memoTable[m-1][n-1];
  }

  if(string1[m-1]==string2[n-1]){
    return memoTable[m-1][n-1] = editRecur(string1,string2,m-1,n-1, memoTable);
  }
  return memoTable[m-1][n-1] = 1+ Math.min(editRecur(string1,string2,m-1,n, memoTable),editRecur(string1,string2,m,n-1,memoTable),editRecur(string1,string2,m-1,n-1, memoTable));
}

module.exports = methods;
