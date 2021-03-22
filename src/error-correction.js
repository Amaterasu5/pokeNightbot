var methods = {};

methods.editDistance = function(string1, string2){
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

methods.inputFix = function(pdata,pdata8){
  //mega text replacement
  if(pdata.substring(0,5)=='mega-'){
    for(let i=4; i<pdata.length-1;i++){
      if (pdata.charAt(i+1)=='-'){
        pdata = pdata.slice(5,i+1)+"-mega"+pdata.slice(i+1);
        break;
      }
      else if (i==pdata.length-2){
        pdata = pdata.slice(5)+"-mega";
      }
    }
  }
  //location forme text replacement
  else if(pdata.substring(0,6).includes('alola')){
    pdata=pdata.replace(/(?:alola)+n?-/gi,'').concat('-alola');
  }
  else if(pdata8.substring(0,8).includes('galar')){
    pdata8=pdata8.replace(/(?:galar)(?:ian)?_/gi,'').concat('_galar');
  }
  //incarnate forme default
  else if(pdata=='thundurus') pdata='thundurus-incarnate';
  else if(pdata=='tornadus') pdata='tornadus-incarnate';
  else if(pdata=='landorus') pdata='landorus-incarnate';
  //urshifu forme default
  else if(pdata8=='urshifu') pdata8='urshifu_single_strike';
  //calyrex forme fix
  else if(pdata8=='calyrex_ice') pdata8='calyrex_ice_rider';
  else if(pdata8=='calyrex_shadow'||pdata8=='calyrex_ghost') pdata8='calyrex_shadow_rider';
  return [pdata,pdata8];
}
module.exports = methods;
