const feathers = {'hp':'health','atk':'muscle','def':'resist','spa':'genius','spd':'clever','spe':'swift','spatk':'genius','spdef':'clever','speed':'swift'};
const vitamins = {'hp':'hp-up','atk':'protein','def':'iron','spa':'calcium','spd':'zinc','spe':'carbos','spatk':'calcium','spdef':'zinc','speed':'carbos'};

methods.vitamins = function(evString){
  evs = evString.split('/');
  evs.sort(function(e1,e2){
    return parseInt(e1.replace(/[a-z]+/gi,''))%10-parseInt(e2.replace(/[a-z]+/gi,''))%10;
  });
  evs.forEach(function(e,i){
    if(parseInt(e.replace(/[a-z]+/gi,''))==252){
      evs.splice(i,1);
      evs.unshift(e);
    }
  });
  evNumbers = evs.map((e)=>parseInt(e.replace(/[a-z]+/gi,'')));
  evStats = evs.map((e)=>e.replace(/[0-9]+/gi,''));
  neededFeathers = evNumbers.map((item) => item%10);
  evVitamins=[];
  evFeathers=[];
  for (let i=0;i<evNumbers.length;i++){
    if (i==evNumbers.length-1&&neededFeathers[i]==8){
      evVitamins[i-1]=1+Math.floor(evNumbers[i]/10);
      evVitamins[i]=1+Math.floor(evNumbers[i-1]/10);
      let temp = evStats[i-1];
      evStats[i-1]=evStats[i];
      evStats[i]=temp;
      evFeathers[i]=evFeathers[i-1]=0;
      break;
    }else if (i==evNumbers.length-1){
      if(evNumbers[i]%10==0){
        evVitamins[i]=evNumbers[i]/10;
      }else{
        evVitamins[i]=1+Math.floor(evNumbers[i]/10);
      }
      evFeathers[i]=0;
      break;
    }
    if(evNumbers[i]==252){
      evVitamins[i]=26;
      evFeathers[i]=0;
    }else{
      evVitamins[i]=Math.floor(evNumbers[i]/10);
      evFeathers[i]=neededFeathers[i];
    }
  }
  resp="";
  for(let i=0;i<evStats.length;i++){
    if(evVitamins[i]!=0){
      resp+=evVitamins[i]+' '+vitamins[evStats[i]]+', ';
    }if(evFeathers[i]!=0){
      resp+=evFeathers[i]+' '+feathers[evStats[i]]+' feathers, ';
    }
  }
  return resp;
}
module.exports = methods;
