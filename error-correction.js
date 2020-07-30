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
module.exports = methods;
