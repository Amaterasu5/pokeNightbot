const learnsets = require('../data/learnsets.ts');
const allPokemon = require('../data/allPokemon.json').results;
const galar = require('../data/pokemonGen8.json');
const allMoves = require('../data/allMoves.json').results;
const galarMoves = require('../data/gen8moves.json');
const errorCorrection = require('./error-correction.js');

var methods = {};

methods.doesItLearn = function(pokemon, move, gen){
  const checkBaby = learnsets[pokemon].baby;
  if (checkBaby!=undefined){
    const babyLearnedGens = learnsets[checkBaby].learnset[move];
    if(babyLearnedGens!=undefined){
      if(gen=='any'){
        return true;
      }else if(gen=='8'){
        if(babyLearnedGens[0].charAt(0)=='8'&&babyLearnedGens[0].charAt(1)!='V'){
          return true;
        }
      }else{
        if(babyLearnedGens.map(e=>e.charAt(0)).includes(gen)){
          return true;
        }
      }
    }
  }
  const learnedGens = learnsets[pokemon].learnset[move];
  if (learnedGens==undefined){return false;}
  if(gen=='any'){
    return true;
  }else if(gen=='8'){
    if (learnedGens[0].charAt(0)=='8'&&learnedGens[0].charAt(1)!='V'){
      return true;
    }
  }else{
    if(learnedGens.map(e=>e.charAt(0)).includes(gen)){
      return true;
    }
  }
  return false;
}

methods.doesPokemonMoveExist = function(pokemon, move){
  if (pokemon=='urshifu') {pokemon='urshifusinglestrike'};
  if (move=='urshifu') {move='urshifusinglestrike'};
  let returnPokemon = learnsets[pokemon]!=undefined? pokemon : null;
  if(!returnPokemon){
    for (const item of allPokemon){
      if (errorCorrection.editDistance(pokemon,item.name)<3){
        returnPokemon = item.name;
        break;
      }
    }for (const item in galar){
      if(errorCorrection.editDistance(pokemon,item)<3){
        returnPokemon = item;
        break;
      }
    }
  }
  let thisMove = allMoves.find(element => element.name == move);
  let underMove = move.replace(/-/gi,'_');
  let returnMove = thisMove? thisMove.name:galarMoves[underMove]?underMove:null;
  if (!returnMove){
    for (const item of allMoves){
      if(errorCorrection.editDistance(move,item.name)<3){
        returnMove = item.name;
        break;
      }
    }for(const item in galarMoves){
      if(errorCorrection.editDistance(move,item)<3){
        returnMove = item;
        break;
      }
    }
  }
  return [returnPokemon && returnMove,returnPokemon,returnMove];
}

module.exports = methods;
