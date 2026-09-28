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

export const FAMILY_NAMES={all:"Todos los compuestos",binary:"Sales binarias y óxidos",hydroxide:"Hidróxidos",oxosalt:"Oxosales",acidsalt:"Sales ácidas"};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),roman=n=>({1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII"}[n]||String(n)),prefix=["","mono","di","tri","tetra","penta","hexa"];
export function subscripts(c,a){const g=gcd(c.charge,a.charge);return{c:Math.abs(a.charge)/g,a:Math.abs(c.charge)/g}}
const part=(ion,n)=>`${ion.polyatomic&&n>1?"("+ion.symbol+")":ion.symbol}${n>1?n:""}`;
export function generateFormula(c,a){const n=subscripts(c,a);return part(c,n.c)+part(a,n.a)}
export function getStockName(c,a){const variable=new Set(CATIONS.filter(x=>x.symbol===c.symbol).map(x=>x.charge)).size>1;return `${a.name} de ${c.name}${variable?`(${roman(c.charge)})`:""}`}
export function getSystematicName(c,a){const n=subscripts(c,a);if(a.polyatomic)return getStockName(c,a);let an=a.symbol==="O"?`${prefix[n.a]}óxido`:(n.a>1?`${prefix[n.a]}${a.name}`:a.name);let cat=n.c>1?`${prefix[n.c]}${c.name}`:c.name;return `${an} de ${cat}`}
export function formatIon(ion){const m=Math.abs(ion.charge),s=ion.charge>0?"+":"−";return ion.symbol+`<sup>${m===1?"":m}${s}</sup>`}
export function explainFormula(c,a){const n=subscripts(c,a);return[`El catión ${c.name} tiene carga +${c.charge}.`,`El anión ${a.name} tiene carga ${a.charge}.`,`Para que el compuesto sea neutro se necesitan ${n.c} catión(es) y ${n.a} anión(es).`,`La fórmula resultante es ${generateFormula(c,a)}.`]}
const normalize=s=>String(s??"").trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ");
export const checkFormulaAnswer=(answer,expected)=>normalize(answer).replace(/[₀-₉]/g,x=>"₀₁₂₃₄₅₆₇₈₉".indexOf(x))===normalize(expected);
export const checkNameAnswer=(answer,expected)=>normalize(answer)===normalize(expected);
const LEVEL={easy:1,medium:2,hard:3,expert:4};
export function randomCompound({difficulty="medium",family="all"}={}){
 const level=LEVEL[difficulty]||2;
 let cs=CATIONS.filter(x=>x.level<=level),as=ANIONS.filter(x=>x.level<=level&&(family==="all"||x.family===family));
 if(!as.length)as=ANIONS.filter(x=>family==="all"||x.family===family);
 const c=cs[Math.floor(Math.random()*cs.length)],a=as[Math.floor(Math.random()*as.length)];
 return{cation:c,anion:a,family:a.family,formula:generateFormula(c,a),stockName:getStockName(c,a),systematicName:getSystematicName(c,a),explanation:explainFormula(c,a)}
}
