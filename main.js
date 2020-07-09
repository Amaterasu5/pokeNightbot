$(document).ready(function(){
  $("body").empty();
  let params = new URLSearchParams(window.location.search);
  //let pdata = params.get('data');
  let pdata = "porygon";
  let pdata8 = pdata.replace(/-/gi,'_');

  var promises = [Promise.resolve()];
  promise1 = new Promise((resolve,reject) => {
    $.ajax({
      url:'https://pokeapi.co/api/v2/pokemon/?limit=1000',
      dataType:'json',
      success:function(data){
        const allPokemon = data.results;
        resolve();
      }
    });
  });
  promise2 = new Promise((resolve,reject) => {
    $.ajax({
      url:'https://api.jsonbin.io/b/5ef40ab9e2ce6e3b2c792e97/4',
      dataType:'json',
      success:function(data){
        console.log("here");
        const galar = data;
        resolve();
      }
    });
  });
  promise3 = new Promise((resolve,reject) => {
    $.ajax({
      url:'https://api.jsonbin.io/b/5efea94f0bab551d2b6b08c3/1',
      dataType:'json',
      success:function(data){
        const galarMoves = data;
        resolve();
      }
    });
  });
  promise4 = new Promise((resolve,reject) => {
    $.ajax({
      url:'https://pokeapi.co/api/v2/move/?limit=800',
      dataType:'json',
      success:function(data){
        const allMoves = data.results;
        resolve();
      }
    });
  });

  function pushPromise(promise){
    promises.push(promises.pop().then(function(){
      return promise
    }));
  }

  pushPromise(promise1);
  pushPromise(promise2);
  pushPromise(promise3);
  pushPromise(promise4);


  // let request = new XMLHttpRequest();
  // request.open('GET', 'https://pokeapi.co/api/v2/pokemon/?limit=1000');
  // request.responseType = 'json';
  // request.send();
  // request.onload = function(){
  //   const allPokemon = (request.response).results; //not all pokemon lmao
  // }
  //
  // request = new XMLHttpRequest();
  // request.open('GET','https://jsonbin.io/5ef40ab9e2ce6e3b2c792e97/4');
  // request.responseType = 'json';
  // request.send();
  // request.onload = function(){
  //   const galar = request.response; //gen 8 mons + meltan and melmetal
  // }
  //
  // request = new XMLHttpRequest();
  // request.open('GET','https://jsonbin.io/5efea94f0bab551d2b6b08c3/1');
  // request.responseType = 'json';
  // request.send();
  // request.onload = function(){
  //   const galarMoves = request.response; //gen 8 moves and updates
  // }
  //
  // request = new XMLHttpRequest();
  // request.open('GET','https://pokeapi.co/api/v2/move/?limit=800');
  // request.responseType = 'json';
  // request.send();
  // request.onload = function(){
  //   const allMoves = request.response.results; //also not all moves lol
  // }

  if (galar.data8!=undefined){
    displayPokemon(data8.stats);
  }else if (allPokemon.data!=undefined){
    const url = allPokemon.find(item => item.name==data).url;
    request.open('GET', url);
    request.responseType = 'json';
    request.send();
    request.onload = function(){
      const apiData = (request.response).stats;
    }
    displayPokemon(apiData);
  }else if (galarMoves.data8!=undefined){
    dislayMove(data8.stats);
  }else if (allMoves.data!=undefined){
    const url = allMoves.find(item => item.name==data).url;
    request.open('GET', url);
    request.responseType = 'json';
    request.send();
    request.onload = function(){
      const apiData = (request.response);
    }
    displayMove(apiData);
  }else{//when people put in bullshit or spell things wrong
    $('body').text("WTF was that?");
  }
})

function displayPokemon(pokedata){
  items=[];
  for (i=0;i<6;i++){
    items.push(' '+pokedata[i].stat.name+': '+ pokedata[i].base_stat);
  }
  $('body').text(items);
}

function displayMove(movedata){
   items=[];
   items.push('Type: '+movedata.type.name+', Power: '+movedata.power+', Accuracy: '+movedata.accuracy+', Priority: '+ movedata.priority+ ', Max PP: '+parseInt(movedata.pp,10)*(8.0/5)+', Damage type: '+movedata.damage_class.name+ ', '+movedata.effect_entries[0].short_effect);
   $('body').text(items);
}
