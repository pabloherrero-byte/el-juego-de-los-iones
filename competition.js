import{randomCompound,checkFormulaAnswer,checkNameAnswer,diagnoseFormulaError,explainName,allowedNomenclatures}from"./chemistry.js";
export function createGame(config={}){const durationSeconds=Number(config.durationSeconds??300);return{config:{durationSeconds,mode:"mixed",difficulty:"medium",family:"all",workMode:"practice",questionCount:10,...config},score:0,correct:0,incorrect:0,answered:0,answers:[],streak:0,bestStreak:0,current:null,remaining:durationSeconds,finished:false,saved:false}}
export function nextChallenge(game){
 let compound,type=game.config.mode,tries=0;
 do{
  compound=randomCompound({difficulty:game.config.difficulty,family:game.config.family});
  const allowed=allowedNomenclatures(compound);
  type=game.config.mode==="mixed"?allowed[Math.floor(Math.random()*allowed.length)]:game.config.mode;
  if(allowed.includes(type))break;
  tries++;
 }while(tries<40);
 const allowed=allowedNomenclatures(compound);
 if(!allowed.includes(type))type=allowed.includes("stock")?"stock":"formula";
 const expected=type==="formula"?compound.formula:type==="stock"?compound.stockName:compound.systematicName;
 const question=compound.metalHydride&&type==="formula"?`Formula el hidruro de ${compound.cation.name} con el estado de oxidación indicado.`:compound.hydrogenSpecial&&type==="formula"?`Escribe la fórmula del compuesto binario de hidrógeno con ${compound.anion.name}.`:compound.special&&type==="formula"?`Formula la combinación entre oxígeno y ${compound.anion.name} con los estados de oxidación indicados.`:type==="formula"?`Formula el compuesto formado por ${compound.cation.name} y ${compound.anion.name}.`:type==="stock"?`Nombra indicando el estado de oxidación cuando sea necesario: ${compound.formula}`:`Nombra mediante nomenclatura de composición/sistemática: ${compound.formula}`;
 game.current={...compound,type,expected,question,startedAt:Date.now()};
 return game.current
}
export function submit(game,answer){if(game.finished)throw Error("La partida ha terminado");const q=game.current;if(!q)throw Error("No hay reto activo");const ok=q.type==="formula"?checkFormulaAnswer(answer,q.expected):checkNameAnswer(answer,q.expected);game.answered++;game.answers.push({question:q.question,answer,expected:q.expected,correct:ok,type:q.type,family:q.family});if(ok){game.correct++;game.streak++;game.bestStreak=Math.max(game.bestStreak,game.streak);const speed=Math.max(0,10-Math.floor((Date.now()-q.startedAt)/3000));game.score+=10+speed+Math.min(15,Math.floor(game.streak/3)*3)}else{game.incorrect++;game.streak=0}const diagnosis=ok?"":q.special?(q.type==="formula"?"Recuerda la excepción: en los haluros de oxígeno se escribe primero O y después el halógeno; intercambia los estados de oxidación y simplifica si procede.":"Revisa los prefijos multiplicadores: indican cuántos átomos de halógeno y de oxígeno aparecen en la fórmula."):q.type==="formula"?diagnoseFormulaError(answer,q.cation,q.anion):q.type==="stock"?"Revisa la identificación del anión y el estado de oxidación del catión.":"Revisa la proporción indicada por la fórmula y los prefijos de la nomenclatura.";
 const teaching=q.special?q.explanation:q.type==="formula"?q.explanation:explainName(q.cation,q.anion,q.type);
 return{correct:ok,expected:q.expected,score:game.score,streak:game.streak,diagnosis,teaching}}
export default{createGame,nextChallenge,submit};
