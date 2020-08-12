const smogon = require('@smogon/calc');

const gen = smogon.Generations.get(8);

methods = {};
methods.performCalc = function(attacker,defender,move,field){
  attackerCalc = new smogon.Pokemon(gen,attacker.name,{
    item:attacker.item,
    nature:attacker.nature || 'Serious',
    ability:attacker.ability,
    evs:attacker.evs || {hp:252,atk:252,spa:252,spe:252},
    //ivs:attacker.ivs || {hp:31,atk:31,def:31,spa:31,spd:31,spe:31},
    //boosts:attacker.boosts || {},
    level:50,
    isDynamaxed:attacker.dynamax || false
  });
  defenderCalc = new smogon.Pokemon(gen, defender.name,{
    item:defender.item,
    nature:defender.nature || 'Serious',
    ability:defender.ability,
    evs:defender.evs || {hp:0,atk:0,def:0,spa:0,spd:0,spe:252},
    //ivs:defender.ivs || {hp:31,atk:31,def:31,spa:31,spd:31,spe:31},
    //boosts:defender.boosts || {},
    level:50,
    isDynamaxed:defender.dynamax || false
  });
  moveCalc = new smogon.Move(gen,move,{
    useMax:attackerCalc.isDynamaxed&&!['weather ball','terrain pulse'].includes(move)
  });
  fieldCalc = new smogon.Field({
    gameType:field.singleTarget? 'Singles':'Doubles',
    terrain:field.terrain,
    weather:field.weather,
    isGravity:field.gravity,
    attackerSide:field.attackerSide,
    defenderSide:field.defenderSide
  });
  attackerBoost=moveCalc.category=='Special'?'spa':move=='body press'?'def':'atk';
  let temp=attacker.boosts? attacker.boosts:0;
  attackerCalc.boosts[attackerBoost]=temp;

  defenderBoost=moveCalc.category=='Special'?'spd':['psyshock','psystrike','secret sword'].includes(move)?'spd':'def';
  temp=defender.boosts? defender.boosts:0;
  defenderCalc.boosts[defenderBoost]=temp;

  result = smogon.calculate(gen, attackerCalc,defenderCalc,moveCalc,fieldCalc);
  try{
    return result.desc();
  }catch(err){
    return "sorry love, no damage because of that damn ability";
  }
}

function capitalizeWords(string){
  words=string.split(' ');
  for(i=0;i<words.length;i++){
    words[i]=words[i].charAt(0).toUpperCase()+words[i].substring(1);
  }
  return words.join(' ');
}

methods.setUpPokemon = function(data){
  const stats=['hp','atk','def','spa','spd','spe'];
  const statChange={spatk:'spa',spdef:'spd',speed:'spe'};
  monEvs={};
  for(let item of data){
    for(let stat of stats){
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
  ability=data.find(element=>element.includes('ability='));
  boosts=data.find(element=> element.charAt(0)=="+"||element.charAt(0)=='-');
  pokemon={
    name:capitalizeWords(data[0]),
    item:item?capitalizeWords(item.substring(5).replace(/-/gi,' ')):null,
    nature:nature?nature.substring(7):null,
    ability:ability?capitalizeWords(ability.substring(8).replace(/-/gi,' ')):null,
    boosts:boosts?boosts.replace('+',''):null,
    evs:monEvs,
    dynamax:data.some(element => element.includes('dynamax'))
  };
  return pokemon;
}

methods.setUpField = function(data){
  const terrains = ['grassy','misty','psychic','electric'];
  const weathers = ['sand','hail','sun','rain','harsh sunlight','heavy rain','strong winds'];
  let weatherData = null;
  for (let weather of weathers){
    for (let item of data){
      if (item.replace(/-/gi,' ')==weather){
        weatherData=weather;
      }
    }
  }
  let terrain = data.find(element=>terrains.includes(element));
  let switching = data.find(element=>element.includes('switch-'));
  attackerSide = {
    isTailwind:data.some(element=>element.includes('attacker-tailwind')),
    isHelpingHand:data.some(element=>element.includes('helping-hand')||element.includes('hh')),
    isBattery:data.some(element=>element.includes('battery'))
  };
  defenderSide = {
    isTailwind:data.some(element=>element.includes('defender-tailwind')),
    isReflect:data.some(element=>element.includes('reflect')),
    isLightScreen:data.some(element=>element.includes('light-screen')),
    isFriendGuard:data.some(element=>element.includes('friend-guard')),
    isAuroraVeil:data.some(element=>element.includes('aurora-veil')),
    isSwitching:switching? switching.replace('switch-',''):undefined
  };
  field={
    singleTarget:data.some(element=>element.includes('single')),
    terrain:terrain? capitalizeWords(terrain):null,
    weather:weatherData? capitalizeWords(weatherData):null,
    gravity:data.some(element=>element.includes('gravity')),
    attackerSide:attackerSide,
    defenderSide:defenderSide
  };
  return field;
}

module.exports = methods;
