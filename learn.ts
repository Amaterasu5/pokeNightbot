const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const learnsets = require('./learnsets.ts');

var methods = {};

methods.doesItLearn = function(pokemon, move){
  learnedGens = learnsets[pokemon].learnset[move];
  if (learnedGens==undefined){return false;}
  if (learnedGens[0].charAt(0)=='8'&&learnedGens[0].charAt(1)!='V'){
    return true;
  }
  return false;
}

module.exports = methods;
