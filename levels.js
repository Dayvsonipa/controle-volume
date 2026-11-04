/* Faixas do índice relativo: mesma escala para microfone, demonstração e relatório. */
(function(scope){
 'use strict';
 const tiers = [
  {id:'normal',min:0,max:49,number:0,label:'NORMAL',signal:'normal',color:'#70ef48',heat:0,message:'AMBIENTE CONTROLADO. BOM TRABALHO, TURMA!'},
  {id:'attention',min:50,max:59,number:1,label:'ATENÇÃO',signal:'attention',color:'#ffe36a',heat:.06,message:'ATENÇÃO, TURMA! A CONVERSA ESTÁ AUMENTANDO.'},
  {id:'warning',min:60,max:69,number:2,label:'CONVERSA ALTA',signal:'attention',color:'#ffba3b',heat:.28,message:'VAMOS BAIXAR O TOM DE VOZ, TURMA!'},
  {id:'alert',min:70,max:79,number:3,label:'ALERTA',signal:'alert',color:'#ff8c32',heat:.5,message:'CONVERSA EXCESSIVA! REDUZAM O VOLUME.'},
  {id:'overload',min:80,max:89,number:4,label:'SOBRECARGA',signal:'alert',color:'#ff503c',heat:.76,message:'CENTRAL EM SOBRECARGA! PRECISAMOS DE SILÊNCIO.'},
  {id:'critical',min:90,max:100,number:5,label:'PANE CRÍTICA',signal:'alert',color:'#ff2745',heat:1,message:'PANE CRÍTICA! TURMA, VAMOS FAZER SILÊNCIO.'}
 ];
 function forValue(value){const v=Math.max(0,Math.min(100,Math.round(Number(value)||0)));return [...tiers].reverse().find(t=>v>=t.min);}
 function forId(id){return tiers.find(t=>t.id===id);}
 const api={tiers,forValue,forId};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else scope.BunkerLevels=api;
})(typeof window!=='undefined'?window:globalThis);
