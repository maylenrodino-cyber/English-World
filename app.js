/* ===== ENGLISH WORLD · app.js =====
   DÓNDE CAMBIAR COSAS:
   · Palabras, emojis y colores  → TOPICS  (cada palabra es ["Word","emoji"])
   · Frases de la mascota        → OK / NO
   · Insignias y recompensas     → BADGES
   · Imágenes propias: guárdalas en images/ y usa <img src="images/foto.png"> en lugar del emoji.
   Sin servidores ni claves: todo corre en el navegador (voz = speechSynthesis; progreso = localStorage). */
const TOPICS={
animals:{n:"Animals",i:"🐻",c:"#A9DDF5",w:[["Dog","🐶"],["Cat","🐱"],["Rabbit","🐰"],["Bear","🐻"],["Lion","🦁"],["Frog","🐸"],["Duck","🦆"],["Fish","🐟"]]},
colors:{n:"Colors",i:"🌈",c:"#F7C6D9",w:[["Red","🔴"],["Blue","🔵"],["Yellow","🟡"],["Green","🟢"],["Purple","🟣"],["Orange","🟠"],["Brown","🟤"],["White","⚪"]]},
numbers:{n:"Numbers",i:"🔢",c:"#FFE49A",w:[["One","1️⃣"],["Two","2️⃣"],["Three","3️⃣"],["Four","4️⃣"],["Five","5️⃣"],["Six","6️⃣"],["Seven","7️⃣"],["Eight","8️⃣"]]},
fruits:{n:"Fruits",i:"🍓",c:"#BDE5C5",w:[["Apple","🍎"],["Banana","🍌"],["Grapes","🍇"],["Mango","🥭"],["Strawberry","🍓"],["Watermelon","🍉"],["Pineapple","🍍"],["Cherry","🍒"]]},
family:{n:"Family",i:"👨‍👩‍👧",c:"#D9C8F3",w:[["Mother","👩"],["Father","👨"],["Brother","👦"],["Sister","👧"],["Grandma","👵"],["Grandpa","👴"],["Baby","👶"],["Family","👨‍👩‍👧‍👦"]]},
house:{n:"Parts of the House",i:"🏠",c:"#A9DDF5",w:[["Kitchen","🍳"],["Bedroom","🛏️"],["Bathroom","🛁"],["Sofa","🛋️"],["Door","🚪"],["Window","🪟"],["Garden","🌷"],["Garage","🚗"]]},
body:{n:"Parts of the Body",i:"🖐️",c:"#F7C6D9",w:[["Eye","👁️"],["Ear","👂"],["Nose","👃"],["Mouth","👄"],["Hand","✋"],["Foot","🦶"],["Leg","🦵"],["Tooth","🦷"]]},
school:{n:"School Objects",i:"🎒",c:"#FFE49A",w:[["Book","📚"],["Pencil","✏️"],["Backpack","🎒"],["Ruler","📏"],["Scissors","✂️"],["Notebook","📓"],["Clock","🕒"],["Paint","🎨"]]}};
const OK=["Great job!","Super!","Awesome!","You rock!","Yay!"],NO=["Oops!","Almost!","Nice try!"];
const BADGES=()=>[[10,"🌱","Little Sprout"],[30,"🌈","Rainbow Kid"],[60,"🦄","Super Star"],[100,"🏆","Champion"]].map(([n,i,t])=>({i,t,got:S.stars>=n,need:n+" ⭐"}))
 .concat(Object.entries(TOPICS).map(([k,t])=>({i:t.i,t:t.n+" Explorer",got:prog(k)==4,need:"Win 4 games"})));

const $=s=>document.querySelector(s),sh=a=>[...a].sort(()=>Math.random()-.5),pick=a=>a[Math.random()*a.length|0];
const ALL=Object.values(TOPICS).flatMap(t=>t.w),COLS=["#A9DDF5","#FFE49A","#F7C6D9","#BDE5C5","#D9C8F3"];
let S;try{S=JSON.parse(localStorage.ew)}catch(e){}S=S||{stars:0,done:{}};
const save=()=>{try{localStorage.ew=JSON.stringify(S)}catch(e){}};
const prog=k=>Object.keys(S.done[k]||{}).length;
const star=n=>{S.stars+=n;save();$("#starCount").textContent=S.stars};
let VO=[];const lv=()=>{try{VO=speechSynthesis.getVoices()}catch(e){}};lv();try{speechSynthesis.onvoiceschanged=lv}catch(e){}
const say=t=>{try{const ss=speechSynthesis,u=new SpeechSynthesisUtterance(t),v=VO.find(x=>/^en[-_]US/i.test(x.lang))||VO.find(x=>/^en/i.test(x.lang));if(v)u.voice=v;u.lang=v?v.lang:"en-US";u.rate=.8;ss.cancel();setTimeout(()=>{ss.resume();ss.speak(u)},80)}catch(e){}};
/* Información extra al tocar una tarjeta: FACT = dato del animal; TPL = frase de ejemplo por tema */
const FACT={Dog:"Dogs are loyal friends. They love to run and play!",Cat:"Cats sleep a lot and love to climb. They say meow!",Rabbit:"Rabbits hop fast and love to eat carrots.",Bear:"Bears are big and strong. They love honey!",Lion:"The lion is the king of the jungle. It says roar!",Frog:"Frogs jump and swim. They say ribbit!",Duck:"Ducks swim in ponds. They say quack quack!",Fish:"Fish live in water and breathe with gills."};
const TPL={numbers:(w,i)=>`${w} is the number ${i+1}. Let's count to ${w.toLowerCase()}!`,colors:w=>`I see something ${w.toLowerCase()}!`,fruits:w=>`I like to eat ${w.toLowerCase()}. Yummy!`,family:w=>`I love my ${w.toLowerCase()}.`};
const info=w=>{const[k,t]=Object.entries(TOPICS).find(([k,t])=>t.w.some(x=>x[0]==w)),i=t.w.findIndex(x=>x[0]==w),txt=FACT[w]||(TPL[k]?TPL[k](w,i):`This is my ${w.toLowerCase()}.`);
 const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="box" style="--c:${t.c}"><button class="x" aria-label="Close">✖</button><div class="big">${t.w[i][1]}</div><h2>${w}</h2><p class="spell">${[...w.toUpperCase()].join(" · ")}</p><p>${txt}</p><button class="btn" id="mh">🔊 Listen</button><button class="btn" id="mr">📖 Read to me</button></div>`;
 document.body.appendChild(m);m.onclick=e=>{if(e.target==m||e.target.className=="x")m.remove()};m.querySelector("#mh").onclick=()=>hear(w);m.querySelector("#mr").onclick=()=>say(txt);hear(w,1)};
let AC;const ctx=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=="suspended")AC.resume();return AC};
/* Sonidos de animales sintetizados (sin archivos). bl(onda,Hz inicial,Hz final,duración,retraso,volumen,filtro) */
const bl=(ty,f0,f1,d,t=0,v=.25,fl)=>{const c=ctx(),o=c.createOscillator(),g=c.createGain(),s=c.currentTime+t;o.type=ty;o.frequency.setValueAtTime(f0,s);o.frequency.exponentialRampToValueAtTime(f1,s+d);g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(v,s+.02);g.gain.exponentialRampToValueAtTime(.001,s+d);let n=o;if(fl){const f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=fl;o.connect(f);n=f}n.connect(g);g.connect(c.destination);o.start(s);o.stop(s+d+.05)};
const SND={
Dog:()=>{bl("sawtooth",450,200,.18,0,.3,1200);bl("sawtooth",480,190,.2,.32,.3,1200)},
Cat:()=>{bl("sawtooth",500,900,.25,0,.2,1800);bl("sawtooth",900,450,.4,.25,.2,1800)},
Rabbit:()=>{[0,.2,.4].forEach(t=>bl("sine",1200,1900,.1,t,.2))},
Bear:()=>{bl("sawtooth",110,60,.9,0,.35,500);bl("square",55,48,.9,0,.15,300)},
Lion:()=>{bl("sawtooth",170,70,1.3,0,.35,800);bl("sawtooth",85,60,1.3,0,.25,400)},
Frog:()=>{bl("square",180,320,.09,0,.15,900);bl("square",180,320,.09,.14,.15,900);bl("square",200,120,.18,.3,.15,700)},
Duck:()=>{[0,.24].forEach(t=>{bl("sawtooth",720,420,.16,t,.22,2200);bl("square",360,210,.16,t,.08,1500)})},
Fish:()=>{[[400,900,0],[600,1200,.14],[350,800,.28],[500,1100,.4]].forEach(([a,b,t])=>bl("sine",a,b,.09,t,.22))}};
const hear=(w,nm)=>{if(SND[w]){SND[w]();if(nm)setTimeout(()=>say(w),1500)}else say(w)};
const tone=ok=>{try{(ok?[523,659]:[220,196]).forEach((f,k)=>bl("triangle",f,f,.15,k*.12,.1))}catch(e){}};
const app=$("#app"),tiles=s=>[...s].map((c,i)=>c==" "?" ":`<i style="--c:${COLS[i%5]};--i:${i}">${c}</i>`).join("");

function home(){app.innerHTML=`<section class="hero"><div class="mascots"><b>🐰</b><b>🐻</b><b>🐱</b></div><h1>${tiles("English")}<br>${tiles("World")}</h1>
<div class="bubble">Hello, little explorer! 👋 Welcome to a magical world where words come alive. Tap, listen, play and collect stars! ⭐</div>
<a class="btn big" href="#menu">Let's start! ▶</a></section>`}
function menu(){app.innerHTML=`<h2 class="t">Where do you want to go today?</h2><div class="grid">${Object.entries(TOPICS).map(([k,t])=>`<a class="card" style="--c:${t.c}" href="#topic/${k}"><span class="ic">${t.i}</span><h3>${t.n}</h3><div class="bar"><i style="width:${prog(k)*25}%"></i></div></a>`).join("")}<a class="card" style="--c:#D9C8F3" href="#games"><span class="ic">🎮</span><h3>Games</h3></a></div>`}
function topic(k){const t=TOPICS[k];if(!t)return home();
 app.innerHTML=`<div class="top" style="--c:${t.c}"><span class="ic">${t.i}</span><h2>${t.n}</h2><div class="bar"><i style="width:${prog(k)*25}%"></i></div></div><div class="tabs">${[["learn","📖 Learn"],["quiz","❓ Quiz"],["listen","👂 Listen"],["spell","✏️ Spell"],["memory","🧠 Memory"]].map(([a,b])=>`<button class="btn" data-a="${a}">${b}</button>`).join("")}</div><div id="stage"></div>`;
 const learn=()=>$("#stage").innerHTML=`<p class="hint">Tap a card to hear it and learn more! 🔊</p><div class="grid">${t.w.map(([w,e],j)=>`<button class="card" style="--c:${COLS[j%5]}" onclick="info('${w}');this.classList.add('pop');setTimeout(()=>this.classList.remove('pop'),500)"><span class="ic">${e}</span><h3>${w}</h3></button>`).join("")}</div>`;
 app.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>b.dataset.a=="learn"?learn():play(b.dataset.a,t.w,k));learn()}
function games(){app.innerHTML=`<h2 class="t">Game Land 🎮</h2><p class="hint">Words from all the worlds, mixed up!</p><div class="grid">${[["quiz","❓","Picture Quiz"],["listen","👂","Listen & Find"],["spell","✏️","Missing Letter"],["memory","🧠","Memory Match"]].map(([a,e,n],j)=>`<button class="card" style="--c:${COLS[j]}" data-a="${a}"><span class="ic">${e}</span><h3>${n}</h3></button>`).join("")}</div><div id="stage"></div>`;
 app.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>play(b.dataset.a,ALL,"mix"))}
function stars(){app.innerHTML=`<h2 class="t">My Stars ⭐ ${S.stars}</h2><div class="grid">${BADGES().map(b=>`<div class="card b ${b.got?"":"lock"}" style="--c:#FFE49A"><span class="ic">${b.i}</span><h3>${b.t}</h3><small>${b.got?"Unlocked!":b.need}</small></div>`).join("")}</div><p class="hint"><button class="btn" id="rs">Restart progress 🔄</button></p>`;
 $("#rs").onclick=()=>{if(confirm("Restart all stars and badges?")){S={stars:0,done:{}};save();star(0);stars()}}}

function play(type,pool,key){const st=$("#stage");st.scrollIntoView({behavior:"smooth"});if(type=="memory")return mem(pool,key);
 const R=sh(pool).slice(0,6);let i=0,ok=0;
 const step=()=>{if(i==6)return end(ok,6,type,key,pool);
  const [w,e]=R[i],o=sh(pool.filter(x=>x[0]!=w)).slice(0,3);let q,A=[w,...o.map(x=>x[0])],a=w,L=x=>x;
  if(type=="quiz")q=`<div class="big">${e}</div><p>What is this?</p>`;
  if(type=="listen"){q=`<button class="btn big" onclick="hear('${w}')">🔊 Listen</button>${VO.length?"":"<p class=hint>⚠️ No voice found. Turn on text-to-speech in your device settings.</p>"}`;L=x=>pool.find(p=>p[0]==x)[1];setTimeout(()=>hear(w),300)}
  if(type=="spell"){const d=Math.random()*w.length|0,s=new Set([a=w[d].toLowerCase()]);while(s.size<4)s.add("abcdefghijklmnopqrstuvwxyz"[Math.random()*26|0]);A=[...s];
   q=`<div class="big">${e}</div><p class="gap">${[...w.toLowerCase()].map((c,j)=>j==d?"<u>?</u>":c).join("")}</p>`}
  st.innerHTML=`<div class="game"><div class="bar"><i style="width:${i/6*100}%"></i></div><div class="mascot" id="bub">🐻 Let's go!</div>${q}<div class="opts">${sh(A).map(x=>`<button class="opt" data-v="${x}">${L(x)}</button>`).join("")}</div></div>`;
  st.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const g=b.dataset.v==a;st.querySelectorAll(".opt").forEach(x=>{x.disabled=true;if(x.dataset.v==a)x.classList.add("yes")});
   if(g){ok++;star(1);say(w)}else b.classList.add("no");tone(g);$("#bub").textContent="🐻 "+(g?pick(OK):pick(NO)+" It's "+w+"!");i++;setTimeout(step,1300)})};
 step()}
function mem(pool,key){let f=[],lock=0,m=0,mv=0;const C=sh(sh(pool).slice(0,6).flatMap(([w,e])=>[{w,t:e},{w,t:w}]));
 $("#stage").innerHTML=`<div class="game"><p class="hint">Match each picture with its word! Moves: <b id="mv">0</b></p><div class="mgrid">${C.map((c,j)=>`<button class="mc" data-j="${j}"><span>${c.t}</span></button>`).join("")}</div></div>`;
 document.querySelectorAll(".mc").forEach(b=>b.onclick=()=>{if(lock||b.classList.contains("on"))return;const c=C[b.dataset.j];b.classList.add("on");say(c.w);f.push(b);
  if(f.length<2)return;$("#mv").textContent=++mv;
  if(C[f[0].dataset.j].w==c.w){f.forEach(x=>x.classList.add("ok"));f=[];star(1);tone(true);if(++m==6)setTimeout(()=>end(6,6,"memory",key,pool),900)}
  else{lock=1;tone(false);setTimeout(()=>{f.forEach(x=>x.classList.remove("on"));f=[];lock=0},900)}})}
function end(ok,n,type,key,pool){star(ok==n?3:0);if(ok>=n-1)(S.done[key]=S.done[key]||{})[type]=1;
 const nb=BADGES().filter(x=>x.got).length,fresh=nb-(S.nb||0);S.nb=nb;save();
 $("#stage").innerHTML=`<div class="game end">${Array.from({length:14},(_,j)=>`<s style="left:${j*7}%;animation-delay:${j*.2}s">${["⭐","🌸","✨"][j%3]}</s>`).join("")}<div class="big">${ok==n?"🏆":"🌟"}</div><h2>${ok} / ${n}</h2><p>${ok==n?"Perfect! +3 bonus stars ⭐⭐⭐":"Good try! Practice makes perfect!"}</p>${fresh>0?"<p>🎉 New badge unlocked!</p>":""}<button class="btn" id="again">Play again 🔁</button><a class="btn" href="#stars">My stars ⭐</a></div>`;
 $("#again").onclick=()=>play(type,pool,key)}

function route(){const[v,k]=(location.hash.slice(1)||"home").split("/");({home,menu,topic,games,stars}[v]||home)(k);scrollTo(0,0);
 document.querySelectorAll("#nav a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")=="#"+v+(k?"/"+k:"")))}
$("#nav").innerHTML=Object.entries(TOPICS).map(([k,t])=>`<a href="#topic/${k}" style="--c:${t.c}">${t.i} ${t.n}</a>`).join("")+`<a href="#games" style="--c:#D9C8F3">🎮 Games</a><a href="#stars" style="--c:#FFE49A">⭐ My Stars</a>`;
star(0);addEventListener("hashchange",route);route();
