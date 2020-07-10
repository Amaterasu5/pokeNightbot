  const { JSDOM } = require( "jsdom" );
  const { window } = new JSDOM( "" );
  const $ = require( "jquery" )( window );

  let allPokemon = null;
  let galar = null;
  let galarMoves = null;
  let allMoves = null;

  var promise1 = new Promise((resolve,reject) => {
    $.ajax({
      url:'https://pokeapi.co/api/v2/pokemon/?limit=1000',
      dataType:'json',
      success:function(data){
        allPokemon = data.results;
        resolve(1);
      }
    });
  });
  var promise2 = new Promise((resolve,reject) => {
    $.ajax({
      url:'https://api.jsonbin.io/b/5ef40ab9e2ce6e3b2c792e97/4',
      dataType:'json',
      success:function(data){
        galar = data;
        resolve(1);
      }
    });
  });
  var promise3 = new Promise((resolve,reject) => {
    $.ajax({
      url:'https://api.jsonbin.io/b/5efea94f0bab551d2b6b08c3/1',
      dataType:'json',
      success:function(data){
        galarMoves = data;
        resolve(1);
      }
    });
  });
  var promise4 = new Promise((resolve,reject) => {
    $.ajax({
      url:'https://pokeapi.co/api/v2/move/?limit=800',
      dataType:'json',
      success:function(data){
        allMoves = data.results;
        resolve(1);
      }
    });
  });

  var methods = {};
  methods.displayData = async function(pdata,pdata8){
    var promises = [promise1,promise2,promise3,promise4];
    var unneeded = await Promise.all(promises); //wait for the "databases" to populate
    let thisUrl=null;
    let apiData=null;
    thisPokemon = allPokemon.find(element => element.name == pdata);
    thisMove = allMoves.find(element => element.name == pdata);

    if (galar[pdata8]!=undefined){
      return displayPokemon(galar[pdata8].stats);
    }else if (thisPokemon!=undefined){
      thisUrl = thisPokemon.url;
      var promise6 = new Promise((resolve,reject) => {
        $.ajax({
          url:thisUrl,
          dataType:'json',
          success:function(data){
            apiData = data.stats;
            resolve();
          }
        });
      });
      await Promise.all([promise6]);
      return displayPokemon(apiData);
    }else if (galarMoves[pdata8]!=undefined){
      return displayMove(galarMoves[pdata8]);
    }else if (thisMove!=undefined){
      thisUrl = thisMove.url;
      var promise7 = new Promise((resolve,reject) => {
        $.ajax({
          url:thisUrl,
          dataType:'json',
          success:function(data){
            apiData = data;
            resolve();
          }
        });
      });
      await Promise.all([promise7]);
      return displayMove(apiData);
    }else{//when people put in bullshit or spell things wrong
      return ["lol wtf was that"];
    }
  }

  //displayData();

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

module.exports = methods;
