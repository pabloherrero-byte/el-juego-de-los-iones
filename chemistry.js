export const CATIONS=[
["Na","sodio",1,false,1],["K","potasio",1,false,1],["Ag","plata",1,false,1],
["Mg","magnesio",2,false,1],["Ca","calcio",2,false,1],["Ba","bario",2,false,1],["Zn","zinc",2,false,1],
["Al","aluminio",3,false,2],["NH4","amonio",1,true,2],
["Fe","hierro",2,false,2],["Fe","hierro",3,false,2],["Cu","cobre",1,false,2],["Cu","cobre",2,false,2],
["Co","cobalto",2,false,3],["Co","cobalto",3,false,3],["Ni","níquel",2,false,3],["Ni","níquel",3,false,3],
["Cr","cromo",2,false,3],["Cr","cromo",3,false,3],["Mn","manganeso",2,false,3],["Mn","manganeso",3,false,3],
["Sn","estaño",2,false,4],["Sn","estaño",4,false,4],["Pb","plomo",2,false,4],["Pb","plomo",4,false,4]
].map(([symbol,name,charge,polyatomic=false,level=1])=>({symbol,name,charge,polyatomic,level}));

export const ANIONS=[
["Cl","cloruro",-1,false,"binary",1],["F","fluoruro",-1,false,"binary",1],["Br","bromuro",-1,false,"binary",1],
["I","yoduro",-1,false,"binary",1],["O","óxido",-2,false,"binary",1],["S","sulfuro",-2,false,"binary",1],
["CN","cianuro",-1,true,"binary",2],
["OH","hidróxido",-1,true,"hydroxide",1],
["NO3","nitrato",-1,true,"oxosalt",1],["SO4","sulfato",-2,true,"oxosalt",1],["CO3","carbonato",-2,true,"oxosalt",1],
["NO2","nitrito",-1,true,"oxosalt",2],["SO3","sulfito",-2,true,"oxosalt",2],["PO4","fosfato",-3,true,"oxosalt",2],
["PO3","fosfito",-3,true,"oxosalt",2],["ClO","hipoclorito",-1,true,"oxosalt",3],["ClO2","clorito",-1,true,"oxosalt",3],
["ClO3","clorato",-1,true,"oxosalt",3],["ClO4","perclorato",-1,true,"oxosalt",3],
["MnO4","permanganato",-1,true,"oxosalt",4],["CrO4","cromato",-2,true,"oxosalt",4],["Cr2O7","dicromato",-2,true,"oxosalt",4],
["HSO4","hidrogenosulfato",-1,true,"acidsalt",1],["HS","hidrogenosulfuro",-1,true,"acidsalt",1],
["H2PO4","dihidrogenofosfato",-1,true,"acidsalt",2],["HPO4","hidrogenofosfato",-2,true,"acidsalt",2],
["HCO3","hidrogenocarbonato",-1,true,"acidsalt",3],["HSO3","hidrogenosulfito",-1,true,"acidsalt",3]
].map(([symbol,name,charge,polyatomic=false,family="binary",level=1])=>({symbol,name,charge,polyatomic,family,level}));

const OXO_SYSTEMATIC={
 NO3:"trioxonitrato (V)",NO2:"dioxonitrato (III)",
 SO4:"tetraoxosulfato (VI)",SO3:"trioxosulfato (IV)",
 CO3:"trioxocarbonato (IV)",PO4:"tetraoxofosfato (V)",PO3:"trioxofosfato (III)",
 ClO:"oxoclorato (I)",ClO2:"dioxoclorato (III)",ClO3:"trioxoclorato (V)",ClO4:"tetraoxoclorato (VII)",
 MnO4:"tetraoxomanganato (VII)",CrO4:"tetraoxocromato (VI)",Cr2O7:"heptaoxodicromato (VI)"
};



// Combinaciones especiales oxígeno-halógeno (Cl, Br, I).
// En la convención didáctica empleada, O se escribe a la izquierda y el halógeno a la derecha.
export const OXYGEN_HALIDES=[
 ["F","flúor",-1],
 ["Cl","cloro",1],["Cl","cloro",3],["Cl","cloro",5],["Cl","cloro",7],
 ["Br","bromo",1],["Br","bromo",3],["Br","bromo",5],["Br","bromo",7],
 ["I","yodo",1],["I","yodo",3],["I","yodo",5],["I","yodo",7]
].map(([symbol,name,oxidation])=>({symbol,name,oxidation,family:"oxygenhalide"}));

const multiplicativePrefix=n=>({1:"mono",2:"di",3:"tri",4:"tetra",5:"penta",6:"hexa",7:"hepta"}[n]||String(n));
const halideRoot=s=>({F:"fluoruro",Cl:"cloruro",Br:"bromuro",I:"yoduro"}[s]);
export function generateOxygenHalide(h){
 if(h.symbol==="F")return{oxygenCount:1,halogenCount:2,formula:"OF2"};
 const g=gcd(2,h.oxidation),o=h.oxidation/g,x=2/g;
 return{oxygenCount:o,halogenCount:x,formula:`${o>1?"O"+o:"O"}${h.symbol}${x>1?x:""}`};
}
export function getOxygenHalideName(h){
 const q=generateOxygenHalide(h),hp=q.halogenCount===1?"":multiplicativePrefix(q.halogenCount),op=q.oxygenCount===1?"":multiplicativePrefix(q.oxygenCount);
 return `${hp}${halideRoot(h.symbol)} de ${op}oxígeno`;
}
export function oxygenHalideCompound(h){
 const q=generateOxygenHalide(h);
 return{
  special:true,family:"oxygenhalide",
  cation:{symbol:"O",name:"oxígeno",charge:h.symbol==="F"?2:-2,polyatomic:false},
  anion:{symbol:h.symbol,name:h.name,charge:h.oxidation,polyatomic:false},
  formula:q.formula,stockName:getOxygenHalideName(h),systematicName:getOxygenHalideName(h),
  explanation:[
   `1. ${h.symbol==="F"?"En OF₂, el flúor actúa con −1 y el oxígeno con +2.":`El oxígeno actúa con −2 y el ${h.name} con +${h.oxidation}.`}`,
   "2. En esta familia escribimos primero O y después el halógeno.",
   `3. ${h.symbol==="F"?"La proporción es 1 átomo de O por 2 de F.":"Intercambiamos los valores absolutos de los estados de oxidación y simplificamos si es posible."}`,
   `4. La fórmula resultante es ${q.formula}.`,
   `5. Con prefijos multiplicadores se nombra: ${getOxygenHalideName(h)}.`
  ]
 };
}
export const FAMILY_NAMES={all:"Todos los compuestos",binary:"Compuestos binarios",oxygenhalide:"Haluros de oxígeno",hydroxide:"Hidróxidos",oxosalt:"Oxosales",acidsalt:"Sales ácidas"};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),lcm=(a,b)=>Math.abs(a*b)/gcd(a,b),roman=n=>({1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII"}[n]||String(n)),prefix=["","mono","di","tri","tetra","penta","hexa"];
export function subscripts(c,a){const g=gcd(c.charge,a.charge);return{c:Math.abs(a.charge)/g,a:Math.abs(c.charge)/g}}
const part=(ion,n)=>`${ion.polyatomic&&n>1?"("+ion.symbol+")":ion.symbol}${n>1?n:""}`;
export function generateFormula(c,a){const n=subscripts(c,a);return part(c,n.c)+part(a,n.a)}
export function getStockName(c,a){const variable=new Set(CATIONS.filter(x=>x.symbol===c.symbol).map(x=>x.charge)).size>1;return `${a.name} de ${c.name}${variable?`(${roman(c.charge)})`:""}`}
export function getSystematicName(c,a){
 const n=subscripts(c,a);
 if(a.family==="hydroxide")return `${n.a>1?prefix[n.a]:""}hidróxido de ${n.c>1?prefix[n.c]:""}${c.name}`;
 if(a.family==="oxosalt"){
   const base=OXO_SYSTEMATIC[a.symbol];
   if(!base)return null;
   const variable=new Set(CATIONS.filter(x=>x.symbol===c.symbol).map(x=>x.charge)).size>1;
   return `${n.a>1?prefix[n.a]:""}${base} de ${n.c>1?prefix[n.c]:""}${c.name}${variable?` (${roman(c.charge)})`:""}`;
 }
 // Para sales ácidas mantenemos el nombre de hidrógeno del ion y la nomenclatura de estado de oxidación;
 // no se etiqueta como nomenclatura de composición hasta disponer de una regla específica validada.
 if(a.family==="acidsalt")return null;
 if(a.polyatomic)return null;
 let an=a.symbol==="O"?(n.a>1?`${prefix[n.a]}óxido`:"óxido"):(n.a>1?`${prefix[n.a]}${a.name}`:a.name);
 let cat=n.c>1?`${prefix[n.c]}${c.name}`:c.name;
 return `${an} de ${cat}`;
}
export function allowedNomenclatures(compound){
 if(compound.special)return["formula","systematic"];
 if(compound.anion?.family==="acidsalt")return["formula","stock"];
 return["formula","stock",...(compound.systematicName?["systematic"]:[])];
}
export function formatIon(ion){const m=Math.abs(ion.charge),s=ion.charge>0?"+":"−";return ion.symbol+`<sup>${m===1?"":m}${s}</sup>`}
export function explainFormula(c,a){
 const n=subscripts(c,a),m=lcm(Math.abs(c.charge),Math.abs(a.charge)),positive=n.c*c.charge,negative=n.a*a.charge;
 const rawC=Math.abs(a.charge),rawA=Math.abs(c.charge),needsSimplify=gcd(rawC,rawA)>1;
 const steps=[
  `1. Identificamos las cargas: ${c.symbol} tiene +${c.charge} y ${a.symbol} tiene ${a.charge}.`,
  `2. Intercambiamos los estados de oxidación (sin signo) y los colocamos como subíndices: ${c.symbol} recibe ${rawC} y ${a.symbol} recibe ${rawA}.`
 ];
 if(needsSimplify)steps.push(`3. Simplificamos los subíndices hasta obtener la proporción mínima: ${n.c} : ${n.a}.`);
 steps.push(`4. Comprobación de neutralidad: ${n.c} × (+${c.charge}) = +${positive} y ${n.a} × (${a.charge}) = ${negative}; suma total = 0.`);
 if((c.polyatomic&&n.c>1)||(a.polyatomic&&n.a>1))steps.push("5. Como un ion poliatómico aparece más de una vez, se escribe entre paréntesis antes de colocar su subíndice.");
 steps.push(`Fórmula final: ${generateFormula(c,a)}.`);
 return steps;
}
function compactFormula(s){return String(s??"").replace(/\s+/g,"").replace(/[₀-₉]/g,x=>String("₀₁₂₃₄₅₆₇₈₉".indexOf(x)))}
export function diagnoseFormulaError(answer,c,a){
 const given=compactFormula(answer),expected=generateFormula(c,a),n=subscripts(c,a);
 if(!given)return"Escribe una fórmula antes de comprobar.";
 if(given.toLowerCase()===expected.toLowerCase()&&given!==expected)return"Revisa las mayúsculas y minúsculas de los símbolos químicos.";
 const unreduced=part(c,Math.abs(a.charge))+part(a,Math.abs(c.charge));
 if(given===unreduced&&unreduced!==expected)return"Has cruzado correctamente las cargas, pero los subíndices tienen un divisor común. Simplifica hasta la proporción mínima.";
 if((a.polyatomic&&n.a>1&&!given.includes("("))||(c.polyatomic&&n.c>1&&!given.includes("(")))return"Faltan paréntesis: cuando un ion poliatómico aparece más de una vez, se encierra entre paréntesis y el subíndice se coloca fuera.";
 const reversed=part(a,n.a)+part(c,n.c);
 if(given===reversed)return"Has escrito primero el anión. En estos compuestos se escribe primero el catión y después el anión.";
 if(given.includes("+")||given.includes("-")||given.includes("−"))return"En la fórmula del compuesto neutro no se escriben las cargas de los iones; se compensan mediante los subíndices.";
 if(given===c.symbol+a.symbol&&expected!==given)return"Has omitido los subíndices necesarios. Ajusta la proporción de iones hasta que la carga total sea cero.";
 return`Comprueba la neutralidad: la suma de las cargas positivas y negativas debe ser 0. La proporción correcta es ${n.c}:${n.a}.`;
}
export function explainName(c,a,type="stock"){
 const variable=new Set(CATIONS.filter(x=>x.symbol===c.symbol).map(x=>x.charge)).size>1;
 if(type==="stock")return variable?[`Identifica primero el anión: ${a.name}.`,`El catión es ${c.name} y en este compuesto actúa con estado de oxidación +${c.charge}.`,`Como ${c.name} presenta más de un estado de oxidación en el juego, se indica con número romano: ${roman(c.charge)}.`,`Nombre: ${getStockName(c,a)}.`]:[`Identifica el anión: ${a.name}.`,`El catión es ${c.name} y no necesita número romano en este banco de ejercicios.`,`Nombre: ${getStockName(c,a)}.`];
 return[`Observa la proporción de átomos/iones en la fórmula ${generateFormula(c,a)}.`,`La nomenclatura solicitada es: ${getSystematicName(c,a)}.`];
}
const normalize=s=>String(s??"").trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ");
export const checkFormulaAnswer=(answer,expected)=>normalize(answer).replace(/[₀-₉]/g,x=>"₀₁₂₃₄₅₆₇₈₉".indexOf(x))===normalize(expected);
export const checkNameAnswer=(answer,expected)=>normalize(answer)===normalize(expected);
const LEVEL={easy:1,medium:2,hard:3,expert:4};
export function randomCompound({difficulty="medium",family="all"}={}){
 const level=LEVEL[difficulty]||2;
 let cs=CATIONS.filter(x=>x.level<=level);
 // Desde nivel medio pueden aparecer haluros de oxígeno dentro de los compuestos binarios.
 if(difficulty!=="easy"&&(family==="all"||family==="binary")&&Math.random()<0.18){
   const h=OXYGEN_HALIDES[Math.floor(Math.random()*OXYGEN_HALIDES.length)];
   return oxygenHalideCompound(h);
 }
 let as;
 if(difficulty==="easy"){
   // Fácil: exclusivamente óxidos.
   as=ANIONS.filter(x=>x.symbol==="O");
 }else if(difficulty==="medium"){
   // Medio: compuestos binarios (óxidos y sales binarias).
   as=ANIONS.filter(x=>x.family==="binary");
 }else if(difficulty==="hard"){
   // Difícil: binarios y ternarios (hidróxidos y oxosales incluidas).
   as=ANIONS.filter(x=>["binary","hydroxide","oxosalt"].includes(x.family)&&x.level<=3);
 }else{
   // Experto: banco completo, incluidas sales ácidas.
   as=ANIONS.filter(x=>x.level<=4);
 }
 // El filtro manual por familia se aplica solo si es compatible con el nivel.
 if(family!=="all"){
   const filtered=as.filter(x=>x.family===family);
   if(filtered.length)as=filtered;
 }
 const c=cs[Math.floor(Math.random()*cs.length)],a=as[Math.floor(Math.random()*as.length)];
 return{cation:c,anion:a,family:a.family,formula:generateFormula(c,a),stockName:getStockName(c,a),systematicName:getSystematicName(c,a),explanation:explainFormula(c,a)}
}
