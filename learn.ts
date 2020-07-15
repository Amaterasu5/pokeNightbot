const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const learnsets = require('./learnsets.ts');
const allMoves = require('./allMoves.json').results;
const galarMoves = require('./gen8moves.json');

var methods = {};

methods.doesItLearn = function(pokemon, move){
  const checkBaby = learnsets[pokemon].baby;
  if (checkBaby!=undefined){
    const babyLearnedGens = learnsets[checkBaby].learnset[move];
    if(babyLearnedGens!=undefined){
      if(babyLearnedGens[0].charAt(0)=='8'&&babyLearnedGens[0].charAt(1)!='V'){
        return true;
      }
    }
  }
  const learnedGens = learnsets[pokemon].learnset[move];
  if (learnedGens==undefined){return false;}
  if (learnedGens[0].charAt(0)=='8'&&learnedGens[0].charAt(1)!='V'){
    return true;
  }
  return false;
}

methods.doesPokemonMoveExist = function(pokemon, move){
  const pokemonExists = learnsets[pokemon]!=undefined? true : false;
  let thisMove = allMoves.find(element => element.name == move);
  let underMove = move.replace(/-/gi,'_');
  const moveExists = !(thisMove==undefined&&galarMoves[underMove]==undefined);
  return (pokemonExists && moveExists);
}

module.exports = methods;
