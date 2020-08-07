const smogon = require('@smogon/calc');
//import {calculate, Generations, Pokemon, Move, Field} from smogon;

const gen = smogon.Generations.get(8);

methods = {};
methods.performCalc = function(attacker,defender,move,field){
  attackerCalc = new smogon.Pokemon(gen,attacker.name,{
    item:attacker.item,
    nature:attacker.nature || 'Serious',
    evs:attacker.evs || {hp:252,atk:252,spa:252,spe:252},
    //ivs:attacker.ivs || {hp:31,atk:31,def:31,spa:31,spd:31,spe:31},
    boosts:attacker.boosts || {},
    level:50
  });
  defenderCalc = new smogon.Pokemon(gen, defender.name,{
    item:defender.item,
    nature:defender.nature || 'Serious',
    evs:defender.evs || {hp:0,atk:0,def:0,spa:0,spd:0,spe:252},
    //ivs:defender.ivs || {hp:31,atk:31,def:31,spa:31,spd:31,spe:31},
    boosts:defender.boosts || {},
    level:50
  });
  fieldCalc = new smogon.Field({
    gameType:field.singleTarget? 'Singles':'Doubles',
    terrain:field.terrain,
    weather:field.weather,
    isGravity:field.gravity,
    attackerSide:field.attackerSide,
    defenderSide:field.defenderSide
  });
  result = smogon.calculate(gen, attackerCalc,defenderCalc,new smogon.Move(gen, move),fieldCalc);
  return result.desc();
}
module.exports = methods;
