// ─── app.js ───────────────────────────────────────────────────────────────────
import { loginWithGoogle, handleRedirectResult, logout, onAuth, getUserProfile,
         getProgress, saveProgress, enrollStudent, unenrollStudent,
         getAllStudents, deleteStudent, getAllProgress, SCHOOL_DOMAIN, ADMIN_EMAILS }
  from "./firebase.js";

// ══════════════════════════════════════════════════════════════════════════════
// DADES DEL CURS (mateixa estructura que l'app anterior)
// ══════════════════════════════════════════════════════════════════════════════

const COURSES = {
  "rus-catala": {
    id:"rus-catala", name:"Rus → Català", flag:"🇷🇺", color:"#E53935", accent:"#FF8A65",
    units:[
      { id:"ru-u1", title:"Salutacions", icon:"👋", level:"A1", lessons:[
        { id:"ru-l1", title:"Hola i adéu", xp:10, exercises:[
          {type:"translate",q:"Привет",a:"Hola",hint:"Privet",options:["Hola","Adéu","Gràcies","Si us plau"]},
          {type:"translate",q:"Пока",a:"Adéu",hint:"Poka",options:["Hola","Adéu","Bona nit","Bon dia"]},
          {type:"fill",q:"Доброе утро = ___",a:"Bon dia",options:["Bona nit","Bon dia","Bona tarda"]},
          {type:"order",q:"Ordena: dia / bon / a / tots",a:"bon dia a tots",words:["bon","dia","a","tots"]},
          {type:"write",q:"Com es diu 'Bona nit' en rus?",a:"Спокойной ночи",hint:"Spokoynoy nochi"},
        ]},
        { id:"ru-l2", title:"Com estàs?", xp:10, exercises:[
          {type:"translate",q:"Как дела?",a:"Com estàs?",hint:"Kak dela?",options:["Com et dius?","Com estàs?","D'on ets?","Quants anys tens?"]},
          {type:"translate",q:"Хорошо",a:"Bé",hint:"Khorosho",options:["Malament","Bé","Regular","Molt bé"]},
          {type:"fill",q:"Плохо = ___",a:"Malament",options:["Bé","Malament","Regular"]},
          {type:"order",q:"Ordena: estàs / com / avui / tu",a:"com estàs tu avui",words:["com","estàs","tu","avui"]},
          {type:"write",q:"Com es diu 'Gràcies' en rus?",a:"Спасибо",hint:"Spasibo"},
        ]},
      ]},
      { id:"ru-u2", title:"Números", icon:"🔢", level:"A1", lessons:[
        { id:"ru-l3", title:"1 al 10", xp:15, exercises:[
          {type:"translate",q:"Один",a:"Un",hint:"Odin",options:["Un","Dos","Tres","Zero"]},
          {type:"translate",q:"Три",a:"Tres",hint:"Tri",options:["Dos","Tres","Quatre","Cinc"]},
          {type:"fill",q:"Десять = ___",a:"Deu",options:["Vuit","Nou","Deu"]},
          {type:"order",q:"Ordena: dos / tres / un",a:"un dos tres",words:["un","dos","tres"]},
          {type:"write",q:"Com es diu 'Cinc' en rus?",a:"Пять",hint:"Pyat'"},
        ]},
        { id:"ru-l4", title:"11 al 20", xp:15, exercises:[
          {type:"translate",q:"Одиннадцать",a:"Onze",hint:"Odinnadtsat'",options:["Deu","Onze","Dotze","Tretze"]},
          {type:"translate",q:"Двадцать",a:"Vint",hint:"Dvadtsat'",options:["Quinze","Setze","Dinou","Vint"]},
          {type:"fill",q:"Пятнадцать = ___",a:"Quinze",options:["Catorze","Quinze","Setze"]},
          {type:"order",q:"Ordena: onze / dotze / tretze",a:"onze dotze tretze",words:["onze","dotze","tretze"]},
          {type:"write",q:"Com es diu 'Dotze' en rus?",a:"Двенадцать",hint:"Dvenadtsat'"},
        ]},
      ]},
      { id:"ru-u3", title:"Colors", icon:"🎨", level:"A1", lessons:[
        { id:"ru-l5", title:"Colors bàsics", xp:10, exercises:[
          {type:"translate",q:"Красный",a:"Vermell",hint:"Krasnyy",options:["Blau","Vermell","Verd","Groc"]},
          {type:"translate",q:"Синий",a:"Blau",hint:"Siniy",options:["Blau","Vermell","Verd","Groc"]},
          {type:"fill",q:"Зелёный = ___",a:"Verd",options:["Verd","Groc","Negre"]},
          {type:"order",q:"Ordena: vermell / blau / i / groc",a:"vermell blau i groc",words:["vermell","blau","i","groc"]},
          {type:"write",q:"Com es diu 'Groc' en rus?",a:"Жёлтый",hint:"Zheltyy"},
        ]},
      ]},
      { id:"ru-u4", title:"Família", icon:"👨‍👩‍👧", level:"A2", lessons:[
        { id:"ru-l6", title:"Família propera", xp:20, exercises:[
          {type:"translate",q:"Мама",a:"Mare",hint:"Mama",options:["Pare","Mare","Germà","Germana"]},
          {type:"translate",q:"Брат",a:"Germà",hint:"Brat",options:["Germà","Germana","Cosí","Cosina"]},
          {type:"fill",q:"Сестра = ___",a:"Germana",options:["Germà","Germana","Tia"]},
          {type:"order",q:"Ordena: mare / meva / la / simpàtica / és",a:"la meva mare és simpàtica",words:["la","meva","mare","és","simpàtica"]},
          {type:"write",q:"Com es diu 'Àvia' en rus?",a:"Бабушка",hint:"Babushka"},
        ]},
      ]},
      { id:"ru-u5", title:"Menjar", icon:"🍽️", level:"A2", lessons:[
        { id:"ru-l7", title:"Aliments bàsics", xp:20, exercises:[
          {type:"translate",q:"Хлеб",a:"Pa",hint:"Khleb",options:["Pa","Llet","Ou","Formatge"]},
          {type:"translate",q:"Яблоко",a:"Poma",hint:"Yabloko",options:["Pera","Poma","Plàtan","Taronja"]},
          {type:"fill",q:"Молоко = ___",a:"Llet",options:["Aigua","Llet","Suc"]},
          {type:"order",q:"Ordena: pa / menjo / cada / dia",a:"cada dia menjo pa",words:["cada","dia","menjo","pa"]},
          {type:"write",q:"Com es diu 'Aigua' en rus?",a:"Вода",hint:"Voda"},
        ]},
      ]},
      { id:"ru-u6", title:"Verbs bàsics", icon:"⚡", level:"B1", lessons:[
        { id:"ru-l8", title:"Accions quotidianes", xp:25, exercises:[
          {type:"translate",q:"Читать",a:"Llegir",hint:"Chitat'",options:["Escriure","Llegir","Parlar","Escoltar"]},
          {type:"translate",q:"Говорить",a:"Parlar",hint:"Govorit'",options:["Escoltar","Parlar","Cantar","Cridar"]},
          {type:"fill",q:"Работать = ___",a:"Treballar",options:["Jugar","Treballar","Descansar"]},
          {type:"order",q:"Ordena: cada / llegeixo / dia / un / llibre",a:"cada dia llegeixo un llibre",words:["cada","dia","llegeixo","un","llibre"]},
          {type:"write",q:"Com es diu 'Dormir' en rus?",a:"Спать",hint:"Spat'"},
        ]},
      ]},
      { id:"ru-u7", title:"Temps i clima", icon:"🌤️", level:"B1", lessons:[
        { id:"ru-l10", title:"El temps", xp:25, exercises:[
          {type:"translate",q:"Дождь",a:"Pluja",hint:"Dozht'",options:["Pluja","Neu","Sol","Vent"]},
          {type:"translate",q:"Снег",a:"Neu",hint:"Snyeg",options:["Pluja","Neu","Sol","Núvol"]},
          {type:"fill",q:"Солнечно = ___",a:"Fa sol",options:["Fa sol","Plou","Neva"]},
          {type:"order",q:"Ordena: fa / avui / molta / calor",a:"avui fa molta calor",words:["avui","fa","molta","calor"]},
          {type:"write",q:"Com es diu 'Fa fred' en rus?",a:"Холодно",hint:"Kholodno"},
        ]},
      ]},
      { id:"ru-u8", title:"Expressions B2", icon:"💬", level:"B2", lessons:[
        { id:"ru-l15", title:"Frases fetes", xp:40, exercises:[
          {type:"translate",q:"Ничего страшного",a:"No passa res",hint:"Nichego strashnogo",options:["No passa res","Molt bé","Fins aviat","Quin desastre"]},
          {type:"translate",q:"Вот именно!",a:"Exactament!",hint:"Vot imenno!",options:["Exactament!","Per descomptat!","En absolut!","Potser!"]},
          {type:"fill",q:"Конечно = ___",a:"Per descomptat",options:["Potser","Per descomptat","Mai"]},
          {type:"order",q:"Ordena: cap / problema / absolutament / no / hi / ha",a:"absolutament no hi ha cap problema",words:["absolutament","no","hi","ha","cap","problema"]},
          {type:"write",q:"Com es diu 'Ni idea' en rus?",a:"Понятия не имею",hint:"Ponyatiya ne imeyu"},
        ]},
      ]},
      { id:"ru-u9", title:"Cultura C1", icon:"📚", level:"C1", lessons:[
        { id:"ru-l17", title:"Literatura russa", xp:50, exercises:[
          {type:"translate",q:"Произведение искусства",a:"Obra d'art",hint:"Proizvedeniye iskusstva",options:["Obra d'art","Museu d'art","Galeria d'art","Crític d'art"]},
          {type:"translate",q:"По моему мнению",a:"Al meu parer",hint:"Po moyemu mneniyu",options:["Al meu parer","En resum","Per tant","Tot i això"]},
          {type:"fill",q:"Стихотворение = ___",a:"Poema",options:["Poema","Novel·la","Conte"]},
          {type:"order",q:"Ordena: he / llegit / una / novel·la / de / Tolstoi",a:"he llegit una novel·la de Tolstoi",words:["he","llegit","una","novel·la","de","Tolstoi"]},
          {type:"write",q:"Com es diu 'Intel·ligència artificial' en rus?",a:"Искусственный интеллект",hint:"Iskusstvennyy intellekt"},
        ]},
      ]},
    ]
  },
  "holandes-catala": {
    id:"holandes-catala", name:"Holandès → Català", flag:"🇳🇱", color:"#F57C00", accent:"#FFD54F",
    units:[
      { id:"nl-u1", title:"Salutacions", icon:"👋", level:"A1", lessons:[
        { id:"nl-l1", title:"Hola i adéu", xp:10, exercises:[
          {type:"translate",q:"Hallo",a:"Hola",hint:"Ha-lo",options:["Hola","Adéu","Gràcies","Bon dia"]},
          {type:"translate",q:"Dag",a:"Adéu",hint:"Dach",options:["Hola","Adéu","Bona nit","Fins aviat"]},
          {type:"fill",q:"Goedemorgen = ___",a:"Bon dia",options:["Bon dia","Bona nit","Bona tarda"]},
          {type:"order",q:"Ordena: dia / bon / a / tots",a:"bon dia a tots",words:["bon","dia","a","tots"]},
          {type:"write",q:"Com es diu 'Bona nit' en holandès?",a:"Goedenacht",hint:"Ghu-de-nacht"},
        ]},
        { id:"nl-l2", title:"Com estàs?", xp:10, exercises:[
          {type:"translate",q:"Hoe gaat het?",a:"Com estàs?",hint:"Hu-ghat-et?",options:["Com et dius?","Com estàs?","D'on ets?","Quants anys tens?"]},
          {type:"translate",q:"Goed",a:"Bé",hint:"Ghut",options:["Malament","Bé","Regular","Molt bé"]},
          {type:"fill",q:"Slecht = ___",a:"Malament",options:["Bé","Malament","Regular"]},
          {type:"order",q:"Ordena: com / estàs / avui / tu",a:"com estàs tu avui",words:["com","estàs","tu","avui"]},
          {type:"write",q:"Com es diu 'Gràcies' en holandès?",a:"Dankjewel",hint:"Dank-ye-vel"},
        ]},
      ]},
      { id:"nl-u2", title:"Números", icon:"🔢", level:"A1", lessons:[
        { id:"nl-l3", title:"1 al 10", xp:15, exercises:[
          {type:"translate",q:"Één",a:"Un",hint:"Eyn",options:["Un","Dos","Tres","Zero"]},
          {type:"translate",q:"Vijf",a:"Cinc",hint:"Veyf",options:["Quatre","Cinc","Sis","Set"]},
          {type:"fill",q:"Drie = ___",a:"Tres",options:["Dos","Tres","Quatre"]},
          {type:"order",q:"Ordena: tres / més / cinc / és / vuit",a:"tres més cinc és vuit",words:["tres","més","cinc","és","vuit"]},
          {type:"write",q:"Com es diu 'Deu' en holandès?",a:"Tien",hint:"Tin"},
        ]},
      ]},
      { id:"nl-u3", title:"Colors", icon:"🎨", level:"A1", lessons:[
        { id:"nl-l5", title:"Colors bàsics", xp:10, exercises:[
          {type:"translate",q:"Rood",a:"Vermell",hint:"Roht",options:["Blau","Vermell","Verd","Groc"]},
          {type:"translate",q:"Blauw",a:"Blau",hint:"Blau",options:["Blau","Vermell","Verd","Groc"]},
          {type:"fill",q:"Groen = ___",a:"Verd",options:["Verd","Groc","Negre"]},
          {type:"order",q:"Ordena: la / neu / és / blanca",a:"la neu és blanca",words:["la","neu","és","blanca"]},
          {type:"write",q:"Com es diu 'Negre' en holandès?",a:"Zwart",hint:"Zvart"},
        ]},
      ]},
      { id:"nl-u4", title:"Família", icon:"👨‍👩‍👧", level:"A2", lessons:[
        { id:"nl-l6", title:"Família propera", xp:20, exercises:[
          {type:"translate",q:"Moeder",a:"Mare",hint:"Mu-der",options:["Pare","Mare","Germà","Germana"]},
          {type:"translate",q:"Broer",a:"Germà",hint:"Brur",options:["Germà","Germana","Cosí","Cosina"]},
          {type:"fill",q:"Vader = ___",a:"Pare",options:["Pare","Mare","Avi"]},
          {type:"order",q:"Ordena: la / meva / mare / és / simpàtica",a:"la meva mare és simpàtica",words:["la","meva","mare","és","simpàtica"]},
          {type:"write",q:"Com es diu 'Àvia' en holandès?",a:"Oma",hint:"O-ma"},
        ]},
      ]},
      { id:"nl-u5", title:"Menjar", icon:"🍽️", level:"A2", lessons:[
        { id:"nl-l7", title:"Aliments bàsics", xp:20, exercises:[
          {type:"translate",q:"Brood",a:"Pa",hint:"Broht",options:["Pa","Llet","Ou","Formatge"]},
          {type:"translate",q:"Appel",a:"Poma",hint:"A-pel",options:["Pera","Poma","Plàtan","Taronja"]},
          {type:"fill",q:"Water = ___",a:"Aigua",options:["Llet","Suc","Aigua"]},
          {type:"order",q:"Ordena: cada / dia / menjo / pa",a:"cada dia menjo pa",words:["cada","dia","menjo","pa"]},
          {type:"write",q:"Com es diu 'Formatge' en holandès?",a:"Kaas",hint:"Kaas"},
        ]},
      ]},
      { id:"nl-u6", title:"Verbs bàsics", icon:"⚡", level:"B1", lessons:[
        { id:"nl-l8", title:"Accions quotidianes", xp:25, exercises:[
          {type:"translate",q:"Lezen",a:"Llegir",hint:"Le-zen",options:["Escriure","Llegir","Parlar","Escoltar"]},
          {type:"translate",q:"Spreken",a:"Parlar",hint:"Spre-ken",options:["Escoltar","Parlar","Cantar","Cridar"]},
          {type:"fill",q:"Werken = ___",a:"Treballar",options:["Jugar","Treballar","Descansar"]},
          {type:"order",q:"Ordena: cada / vespre / llegeixo / un / llibre",a:"cada vespre llegeixo un llibre",words:["cada","vespre","llegeixo","un","llibre"]},
          {type:"write",q:"Com es diu 'Dormir' en holandès?",a:"Slapen",hint:"Sla-pen"},
        ]},
      ]},
      { id:"nl-u7", title:"Transport", icon:"🚲", level:"B1", lessons:[
        { id:"nl-l10", title:"Transports", xp:25, exercises:[
          {type:"translate",q:"Fiets",a:"Bicicleta",hint:"Fits",options:["Bicicleta","Cotxe","Autobús","Tren"]},
          {type:"translate",q:"Trein",a:"Tren",hint:"Treyn",options:["Autobús","Tren","Metro","Vaixell"]},
          {type:"fill",q:"Auto = ___",a:"Cotxe",options:["Cotxe","Camió","Moto"]},
          {type:"order",q:"Ordena: cada / dia / agafa / la / bicicleta",a:"cada dia agafa la bicicleta",words:["cada","dia","agafa","la","bicicleta"]},
          {type:"write",q:"Com es diu 'Aeroport' en holandès?",a:"Luchthaven",hint:"Lucht-ha-ven"},
        ]},
      ]},
      { id:"nl-u8", title:"Expressions B2", icon:"💬", level:"B2", lessons:[
        { id:"nl-l15", title:"Frases fetes", xp:40, exercises:[
          {type:"translate",q:"Dat klopt!",a:"Tens raó! / Exacte!",hint:"Dat klopt!",options:["Tens raó! / Exacte!","No entenc res!","Quina llàstima!","Tinc ganes!"]},
          {type:"translate",q:"Geen probleem",a:"Cap problema",hint:"Ghen pro-bleym",options:["Cap problema","Molt bé","En absolut","Per descomptat"]},
          {type:"fill",q:"Natuurlijk = ___",a:"Naturalment",options:["Naturalment","Potser","Mai"]},
          {type:"order",q:"Ordena: absolutament / no / hi / ha / cap / problema",a:"absolutament no hi ha cap problema",words:["absolutament","no","hi","ha","cap","problema"]},
          {type:"write",q:"Com es diu 'Ni idea' en holandès?",a:"Geen idee",hint:"Ghen i-dey"},
        ]},
      ]},
      { id:"nl-u9", title:"Cultura C1", icon:"🎨", level:"C1", lessons:[
        { id:"nl-l17", title:"Art neerlandès", xp:50, exercises:[
          {type:"translate",q:"Het Nederlandse erfgoed is rijk.",a:"El patrimoni neerlandès és ric.",hint:"Het Ne-der-land-se erf-ghoed is reyk.",options:["El patrimoni neerlandès és ric.","La cultura belga és diversa.","L'art flamenc és famós.","La música holandesa és variada."]},
          {type:"translate",q:"Bovendien",a:"A més a més",hint:"Bo-ven-dien",options:["A més a més","Per tant","Tot i això","En canvi"]},
          {type:"fill",q:"Schilderij = ___",a:"Quadre",options:["Quadre","Escultura","Fotografia"]},
          {type:"order",q:"Ordena: he / visitat / el / Rijksmuseum",a:"he visitat el Rijksmuseum",words:["he","visitat","el","Rijksmuseum"]},
          {type:"write",q:"Com es diu 'Sostenibilitat' en holandès?",a:"Duurzaamheid",hint:"Duur-zaam-heyd"},
        ]},
      ]},
    ]
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const getLevelColor = l => ({A1:"#4CAF50",A2:"#8BC34A",B1:"#FF9800",B2:"#FF5722",C1:"#9C27B0"}[l]||"#2196F3");
const normalize = s => (s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[.,!?;:'"·]/g,"");

function el(tag, attrs={}, ...children) {
  const e = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === "style" && typeof v === "object") Object.assign(e.style, v);
    else if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return e;
}

function css(styles) {
  const tag = document.createElement("style");
  tag.textContent = styles;
  document.head.appendChild(tag);
}

function progressBar(value, max, color, height=12) {
  const pct = Math.min(100, (value/max)*100);
  return el("div", {style:{background:"#e8e8e8",borderRadius:"99px",height:`${height}px`,overflow:"hidden",width:"100%"}},
    el("div", {style:{height:"100%",borderRadius:"99px",background:color,width:`${pct}%`,transition:"width 0.6s cubic-bezier(.4,2,.6,1)"}})
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════════════════════

let state = {
  user: null,
  profile: null,
  progress: { xp:{}, completed:{}, streak:0, lastActive:null },
  screen: "loading",   // loading | login | home | course | lesson | admin
  activeCourse: null,
  activeLesson: null,
  // admin
  adminTab: "students", // students | progress
  students: [],
  allProgress: {},
  adminLoading: false,
};

function setState(patch) {
  Object.assign(state, patch);
  render();
}

// ══════════════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════════════

css(`
  @keyframes fadeSlide { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pop       { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes slideUp   { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes spin      { to{transform:rotate(360deg)} }
  .fade-in   { animation: fadeSlide 0.4s ease forwards; }
  .pop       { animation: pop 0.5s cubic-bezier(.4,2,.6,1) forwards; }
  .floating  { animation: float 3s ease-in-out infinite; }
  .slide-up  { animation: slideUp 0.3s ease forwards; }
  .btn:hover { filter: brightness(1.1); transform: scale(1.02); }
  .card:hover{ transform: scale(1.02); box-shadow: 0 12px 40px rgba(0,0,0,0.4)!important; }
  .opt:hover { opacity: 0.9; transform: scale(1.01); }
  .row:hover { background: rgba(255,255,255,0.07)!important; }
  input:focus{ outline:none; }
  button { transition: all 0.15s ease; cursor:pointer; }
  ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #ffffff33; border-radius:3px; }
`);

// ══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ══════════════════════════════════════════════════════════════════════════════

// ── LOGIN ─────────────────────────────────────────────────────────────────────

function LoginScreen() {
  let errorMsg = "";

  const doLogin = async () => {
    errorDiv.textContent = "";
    try {
      await loginWithGoogle();
      // La pàgina es recarregarà automàticament després del redirect
    } catch(e) {
      errorDiv.textContent = e.message || "Error d'autenticació";
    }
  };

  const errorDiv = el("div", {style:{color:"#FF4900",fontWeight:700,fontSize:14,textAlign:"center",minHeight:20}});

  return el("div", {class:"fade-in", style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",gap:24}},
    el("div", {class:"floating", style:{fontSize:72}}, "🦉"),
    el("div", {style:{textAlign:"center"}},
      el("div", {style:{fontFamily:"'Fredoka One',cursive",fontSize:40,color:"#58CC02",letterSpacing:2}}, "LinguCat"),
      el("div", {style:{color:"#ffffff88",fontSize:15,marginTop:6}}, "Aprèn idiomes en català")
    ),
    el("div", {style:{background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:20,padding:"28px 32px",textAlign:"center",maxWidth:360,width:"100%",display:"flex",flexDirection:"column",gap:16}},
      el("div", {style:{fontWeight:700,fontSize:16,color:"#fff"}}, "Accedeix amb el compte de l'escola"),
      el("div", {style:{color:"#ffffff66",fontSize:13}}, `Necessites un compte ${SCHOOL_DOMAIN}`),
      el("button", {class:"btn", onclick: doLogin,
        style:{background:"#fff",color:"#333",border:"none",borderRadius:12,padding:"14px 24px",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:12,width:"100%"}},
        el("span", {style:{fontSize:22}}, "🔑"),
        "Entrar amb Google"
      ),
      errorDiv
    ),
    el("div", {style:{color:"#ffffff44",fontSize:12,textAlign:"center"}},
      `Només comptes ${SCHOOL_DOMAIN} autoritzats`
    )
  );
}

// ── HOME (alumne) ─────────────────────────────────────────────────────────────

function HomeScreen() {
  const { profile, progress } = state;
  const totalXP = Object.values(progress.xp||{}).reduce((a,b)=>a+b,0);
  const streak  = progress.streak||0;
  const myCourses = profile?.courses||[];

  return el("div", {class:"fade-in", style:{minHeight:"100vh",paddingBottom:40}},
    // Header
    el("div", {style:{padding:"18px 20px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.1)"}},
      el("div", {style:{display:"flex",alignItems:"center",gap:10}},
        el("div", {class:"floating", style:{fontSize:30}}, "🦉"),
        el("div", {},
          el("div", {style:{fontFamily:"'Fredoka One',cursive",fontSize:22,color:"#58CC02"}}, "LinguCat"),
          el("div", {style:{fontSize:11,color:"#ffffff55"}}, profile?.name||"")
        )
      ),
      el("div", {style:{display:"flex",gap:12,alignItems:"center"}},
        el("div", {style:{textAlign:"center"}},
          el("div",{},"🔥"), el("div",{style:{fontSize:12,fontWeight:800,color:"#FF9600"}},streak), el("div",{style:{fontSize:9,color:"#ffffff55"}},"dies")
        ),
        el("div", {style:{textAlign:"center"}},
          el("div",{},"⭐"), el("div",{style:{fontSize:12,fontWeight:800,color:"#FFD700"}},totalXP), el("div",{style:{fontSize:9,color:"#ffffff55"}},"XP")
        ),
        el("button", {onclick:handleLogout, style:{background:"none",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"#ffffff88",padding:"6px 12px",fontSize:12}}, "Sortir")
      )
    ),
    el("div", {style:{padding:"20px 20px 0"}},
      el("div", {style:{fontFamily:"'Fredoka One',cursive",fontSize:22,marginBottom:4}}, "Els meus cursos"),
      myCourses.length===0
        ? el("div", {style:{background:"rgba(255,255,255,0.06)",borderRadius:16,padding:"32px",textAlign:"center",color:"#ffffff66",marginTop:16}},
            el("div",{style:{fontSize:40,marginBottom:12}},"📚"),
            el("div",{style:{fontSize:16,fontWeight:700,marginBottom:8}},"Encara no tens cursos assignats"),
            el("div",{style:{fontSize:13}},"El teu professor t'ha d'inscriure a un curs.")
          )
        : el("div", {style:{display:"flex",flexDirection:"column",gap:14,marginTop:12}},
            ...myCourses.map(cid => {
              const course = COURSES[cid]; if(!course) return null;
              const lessons = course.units.flatMap(u=>u.lessons);
              const done    = lessons.filter(l=>!!(progress.completed||{})[l.id]).length;
              const cxp     = lessons.reduce((s,l)=>s+((progress.xp||{})[l.id]||0),0);
              return el("div", {class:"card", onclick:()=>setState({screen:"course",activeCourse:cid}),
                style:{background:"linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))",border:`2px solid ${course.color}55`,borderRadius:18,padding:"18px",cursor:"pointer",transition:"all 0.25s"}},
                el("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:12}},
                  el("div",{style:{fontSize:36,background:`${course.color}22`,borderRadius:14,width:56,height:56,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${course.color}44`}}, course.flag),
                  el("div",{style:{flex:1}},
                    el("div",{style:{fontFamily:"'Fredoka One',cursive",fontSize:19,marginBottom:4}}, course.name),
                    el("div",{style:{display:"flex",gap:8}},
                      el("span",{style:{background:`${course.color}33`,color:course.color,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}},`${done}/${lessons.length} lliçons`),
                      el("span",{style:{background:"rgba(255,215,0,0.15)",color:"#FFD700",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}},`${cxp} XP`)
                    )
                  ),
                  el("span",{style:{fontSize:20,color:course.color}},"→")
                ),
                progressBar(done, lessons.length, course.color),
                el("div",{style:{marginTop:6,fontSize:11,color:"#ffffff44",display:"flex",justifyContent:"space-between"}},
                  el("span",{},`${course.units.length} unitats`),
                  el("span",{},`${Math.round((done/lessons.length)*100)}% completat`)
                )
              );
            })
          )
    )
  );
}

// ── COURSE SCREEN ─────────────────────────────────────────────────────────────

function CourseScreen() {
  const { activeCourse, progress } = state;
  const course = COURSES[activeCourse];
  let openUnit = null;

  const isCompleted = id => !!(progress.completed||{})[id];
  const isUnlocked  = (ui,li) => {
    if(ui===0&&li===0) return true;
    if(li>0) return isCompleted(course.units[ui].lessons[li-1].id);
    return course.units[ui-1].lessons.every(l=>isCompleted(l.id));
  };

  const container = el("div",{class:"fade-in",style:{minHeight:"100vh",paddingBottom:40}});

  // Header
  container.appendChild(
    el("div",{style:{padding:"18px 20px 14px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.1)"}},
      el("button",{onclick:()=>setState({screen:"home"}),style:{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer"}},"←"),
      el("span",{style:{fontSize:26}}, course.flag),
      el("div",{},
        el("div",{style:{fontFamily:"'Fredoka One',cursive",fontSize:18,color:course.color}}, course.name),
        el("div",{style:{fontSize:12,color:"#ffffff55"}}, `${course.units.length} unitats · A1→C1`)
      )
    )
  );

  const body = el("div",{style:{padding:"14px 20px 0"}});

  function renderUnits() {
    body.innerHTML = "";
    ["A1","A2","B1","B2","C1"].forEach(level => {
      const units = course.units.filter(u=>u.level===level);
      if(!units.length) return;
      body.appendChild(
        el("div",{style:{marginBottom:6}},
          el("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10}},
            el("div",{style:{width:34,height:34,borderRadius:10,background:`${getLevelColor(level)}33`,border:`2px solid ${getLevelColor(level)}66`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:getLevelColor(level)}}, level),
            el("div",{style:{height:2,flex:1,background:`${getLevelColor(level)}22`,borderRadius:2}})
          ),
          ...units.map(unit => {
            const unitIdx   = course.units.indexOf(unit);
            const allDone   = unit.lessons.every(l=>isCompleted(l.id));
            const unlocked  = unitIdx===0||course.units[unitIdx-1].lessons.every(l=>isCompleted(l.id));
            const isOpen    = openUnit===unit.id;

            const header = el("div",{
              style:{background:allDone?`linear-gradient(135deg,${course.color}44,${course.accent}22)`:"rgba(255,255,255,0.07)",border:`2px solid ${allDone?course.color:unlocked?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.05)"}`,borderRadius:isOpen?"12px 12px 0 0":"12px",padding:"12px 16px",cursor:unlocked?"pointer":"default",display:"flex",alignItems:"center",gap:12,opacity:unlocked?1:0.35,marginBottom:isOpen?0:10,transition:"all 0.2s"},
              onclick: () => { if(!unlocked)return; openUnit=isOpen?null:unit.id; renderUnits(); }
            },
              el("div",{style:{width:44,height:44,borderRadius:12,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",background:allDone?course.color:"rgba(255,255,255,0.1)",border:`2px solid ${allDone?course.color:"rgba(255,255,255,0.15)"}`}}, allDone?"✅":unit.icon),
              el("div",{style:{flex:1}},
                el("div",{style:{fontFamily:"'Fredoka One',cursive",fontSize:15}}, unit.title),
                el("div",{style:{fontSize:11,color:"#ffffff55",marginTop:2}},`${unit.lessons.filter(l=>isCompleted(l.id)).length}/${unit.lessons.length} completades`),
                progressBar(unit.lessons.filter(l=>isCompleted(l.id)).length, unit.lessons.length, course.color, 4)
              ),
              unlocked ? el("span",{style:{color:course.color,fontSize:14}}, isOpen?"▲":"▼") : null
            );

            const wrap = el("div",{style:{marginBottom:isOpen?10:0}}, header);

            if (isOpen) {
              const lessonList = el("div",{style:{background:"rgba(255,255,255,0.05)",border:`2px solid ${course.color}22`,borderTop:"none",borderRadius:"0 0 12px 12px",marginBottom:10}});
              unit.lessons.forEach((lesson,li)=>{
                const done=isCompleted(lesson.id), lu=isUnlocked(unitIdx,li);
                const xpE=(progress.xp||{})[lesson.id]||0;
                const row = el("div",{class:lu?"row":"",
                  style:{padding:"11px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:12,cursor:lu?"pointer":"default",opacity:lu?1:0.3,transition:"background 0.15s"},
                  onclick:()=>lu&&setState({screen:"lesson",activeLesson:lesson.id})
                },
                  el("div",{style:{width:34,height:34,borderRadius:9,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",background:done?course.color:"rgba(255,255,255,0.1)",border:`2px solid ${done?course.color:"rgba(255,255,255,0.15)"}`}}, done?"⭐":lu?"📖":"🔒"),
                  el("div",{style:{flex:1}},
                    el("div",{style:{fontWeight:700,fontSize:14}}, lesson.title),
                    el("div",{style:{fontSize:11,color:"#ffffff44",marginTop:1,display:"flex",gap:6}},
                      el("span",{},`${lesson.exercises.length} exercicis`),
                      lesson.exercises.some(e=>e.type==="write") ? el("span",{style:{color:"#64B5F6"}},"✏️") : null,
                      lesson.exercises.some(e=>e.type==="order") ? el("span",{style:{color:"#FFB74D"}},"🔀") : null
                    )
                  ),
                  done ? el("span",{style:{background:`${course.color}22`,color:course.color,border:`1.5px solid ${course.color}44`,borderRadius:8,padding:"2px 10px",fontSize:12,fontWeight:700}},`+${xpE} XP`)
                       : lu ? el("span",{style:{color:course.color,fontWeight:700,fontSize:12}},"Iniciar →") : null
                );
                lessonList.appendChild(row);
              });
              wrap.appendChild(lessonList);
            }
            return wrap;
          })
        )
      );
    });
  }

  renderUnits();
  container.appendChild(body);
  return container;
}

// ── EXERCISE SCREEN ───────────────────────────────────────────────────────────

function ExerciseScreen() {
  const { activeCourse, activeLesson, progress } = state;
  const course = COURSES[activeCourse];
  const unit   = course.units.find(u=>u.lessons.some(l=>l.id===activeLesson));
  const lesson = unit.lessons.find(l=>l.id===activeLesson);
  const exercises = shuffle(lesson.exercises);
  const shuffledOpts = exercises.map(e=>e.options?shuffle(e.options):[]);

  let currentIdx=0, hearts=3, xpEarned=0, streakCount=0, result=null, showNext=false;

  const root = el("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column"}});

  function render() {
    root.innerHTML="";
    if(currentIdx>=exercises.length) { showFinished(); return; }
    const ex = exercises[currentIdx];
    const typeLabel = {translate:"TRADUEIX AL CATALÀ",fill:"COMPLETA LA FRASE",write:"ESCRIU EN AQUEST IDIOMA",order:"ORDENA LES PARAULES"}[ex.type]||"EXERCICI";

    // Top bar
    root.appendChild(
      el("div",{style:{padding:"14px 18px",display:"flex",alignItems:"center",gap:12}},
        el("button",{onclick:()=>setState({screen:"course"}),style:{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:20,cursor:"pointer"}},"✕"),
        progressBar(currentIdx, exercises.length, course.color),
        el("div",{style:{display:"flex",gap:4,fontSize:18}}, ...[0,1,2].map(i=>el("span",{style:{opacity:i<hearts?1:0.2}},"❤️"))),
        streakCount>=2 ? el("div",{style:{background:"rgba(255,150,0,0.15)",border:"1.5px solid #FF9600",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:800,color:"#FF9600"}},`🔥${streakCount}`) : null
      )
    );

    const body = el("div",{style:{flex:1,padding:"14px 18px 0",display:"flex",flexDirection:"column",gap:14,overflowY:"auto"}});
    body.appendChild(el("div",{style:{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700,letterSpacing:1}}, typeLabel));
    body.appendChild(
      el("div",{style:{background:`linear-gradient(135deg,${course.color}22,rgba(255,255,255,0.04))`,border:`2px solid ${course.color}44`,borderRadius:18,padding:"22px",textAlign:"center"}},
        el("div",{style:{fontFamily:"'Fredoka One',cursive",fontSize:ex.type==="order"?17:28,color:"#fff",lineHeight:1.3}}, ex.q),
        ex.hint ? el("div",{style:{fontSize:12,color:"rgba(255,255,255,0.35)",fontStyle:"italic",marginTop:6}},`/${ex.hint}/`) : null
      )
    );

    if(ex.type==="translate"||ex.type==="fill") {
      const grid = el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}});
      shuffledOpts[currentIdx].forEach(opt=>{
        let bg="rgba(255,255,255,0.07)", border="rgba(255,255,255,0.15)", col="#fff";
        if(showNext){
          if(opt===ex.a){bg=`${course.color}22`;border=course.color;col=course.color;}
          else if(result!==null&&opt!==ex.a&&result===false){/* leave muted */}
        }
        const btn = el("button",{class:"opt",
          style:{background:bg,border:`2px solid ${border}`,borderRadius:12,padding:"15px 10px",color:col,fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:15,outline:"none",transition:"all 0.2s",cursor:showNext?"default":"pointer"},
          onclick:()=>{
            if(showNext) return;
            const ok = opt===ex.a;
            result=ok; showNext=true;
            btn.style.background=ok?`${course.color}22`:"rgba(255,73,0,0.15)";
            btn.style.border=`2px solid ${ok?course.color:"#FF4900"}`;
            btn.style.color=ok?course.color:"#FF4900";
            if(ok){xpEarned+=2+(streakCount>=2?5:0);streakCount++;}else{hearts--;streakCount=0;}
            render();
          }
        }, opt);
        grid.appendChild(btn);
      });
      body.appendChild(grid);
    }

    if(ex.type==="write") body.appendChild(buildWriteEx(ex));
    if(ex.type==="order") body.appendChild(buildOrderEx(ex));

    root.appendChild(body);

    if(showNext && (ex.type==="translate"||ex.type==="fill")) {
      const panel = el("div",{class:"slide-up",style:{background:result?"rgba(88,204,2,0.12)":"rgba(255,73,0,0.12)",borderTop:`3px solid ${result?"#58CC02":"#FF4900"}`,padding:"18px 18px 30px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}},
        el("div",{},
          el("div",{style:{fontWeight:800,fontSize:17,color:result?"#58CC02":"#FF4900"}}, result?"✓ Correcte!":"✗ Incorrecte"),
          !result?el("div",{style:{color:"rgba(255,255,255,0.6)",fontSize:13,marginTop:4}},`Resposta: `,el("strong",{style:{color:"#fff"}},ex.a)):null,
          result&&streakCount>=2?el("div",{style:{color:"#FF9600",fontSize:12,fontWeight:700}},`🔥 Ratxa x${streakCount}! +5 XP`):null
        ),
        el("button",{class:"btn",onclick:nextEx,
          style:{background:result?"#58CC02":"#FF4900",color:"#fff",border:"none",borderRadius:12,padding:"13px 24px",fontSize:15,fontWeight:800,boxShadow:`0 5px 0 ${result?"#45a800":"#cc3700"}`}},
          currentIdx+1>=exercises.length?"Acabar":"Continuar ›"
        )
      );
      root.appendChild(panel);
    }

    if(showNext && (ex.type==="write"||ex.type==="order")) {
      root.appendChild(
        el("div",{style:{padding:"14px 18px 30px",display:"flex",justifyContent:"flex-end"}},
          el("button",{class:"btn",onclick:nextEx,
            style:{background:result?"#58CC02":"#FF4900",color:"#fff",border:"none",borderRadius:12,padding:"13px 24px",fontSize:15,fontWeight:800,boxShadow:`0 5px 0 ${result?"#45a800":"#cc3700"}`}},
            currentIdx+1>=exercises.length?"Acabar":"Continuar ›"
          )
        )
      );
    }
  }

  function nextEx() {
    if(hearts<=0&&!result){ currentIdx=0;hearts=3;xpEarned=0;streakCount=0;result=null;showNext=false;render();return; }
    currentIdx++; result=null; showNext=false; render();
  }

  function showFinished() {
    const finalXP = lesson.xp + xpEarned;
    root.appendChild(
      el("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32}},
        el("div",{class:"pop",style:{fontSize:72}},"🎉"),
        el("div",{style:{fontFamily:"'Fredoka One',cursive",fontSize:30,color:"#58CC02",textAlign:"center"}},"Lliçó completada!"),
        el("div",{style:{background:"rgba(255,255,255,0.07)",borderRadius:18,padding:"18px 28px",textAlign:"center",border:"2px solid rgba(255,255,255,0.12)"}},
          el("div",{style:{fontSize:44,fontWeight:900,color:"#FFD700",fontFamily:"'Fredoka One',cursive"}},`+${finalXP} XP`),
          el("div",{style:{color:"rgba(255,255,255,0.55)",marginTop:4}}, lesson.title)
        ),
        el("div",{style:{display:"flex",gap:12}}, ...[0,1,2].map(i=>el("span",{class:"pop",style:{fontSize:32,animationDelay:`${i*0.15}s`,opacity:0}},"⭐"))),
        el("button",{class:"btn",onclick:()=>handleCompleteLesson(activeLesson,finalXP),
          style:{background:"#58CC02",color:"#fff",border:"none",borderRadius:14,padding:"15px 44px",fontSize:17,fontWeight:800,boxShadow:"0 6px 0 #45a800"}},
          "Continuar →"
        )
      )
    );
  }

  function buildWriteEx(ex) {
    const wrap = el("div",{style:{display:"flex",flexDirection:"column",gap:12}});
    const inp  = el("input",{type:"text",placeholder:"Escriu la teva resposta…",
      style:{flex:1,background:"none",border:"none",outline:"none",color:"#fff",fontSize:19,fontWeight:700,fontFamily:"'Nunito',sans-serif",padding:"14px 0"}});
    const inpWrap = el("div",{style:{background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.2)",borderRadius:12,padding:"0 16px",display:"flex",alignItems:"center",gap:10}}, inp);
    if(ex.hint) wrap.appendChild(el("div",{style:{color:"rgba(255,255,255,0.35)",fontSize:12,fontStyle:"italic",textAlign:"center"}},`Pronúncia: /${ex.hint}/`));
    wrap.appendChild(inpWrap);
    const check = () => {
      if(showNext) return;
      const ok = normalize(inp.value)===normalize(ex.a);
      result=ok; showNext=true;
      inpWrap.style.border=`2px solid ${ok?"#58CC02":"#FF4900"}`;
      if(ok){xpEarned+=2+(streakCount>=2?5:0);streakCount++;}else{hearts--;streakCount=0;}
      if(!ok) wrap.appendChild(el("div",{style:{background:"rgba(255,73,0,0.12)",border:"2px solid #FF4900",borderRadius:10,padding:"10px 14px"}},
        el("div",{style:{fontWeight:800,color:"#FF4900"}},"✗ Incorrecte"),
        el("div",{style:{color:"rgba(255,255,255,0.6)",fontSize:13,marginTop:4}},"Resposta correcta: ",el("strong",{style:{color:"#fff"}},ex.a))
      ));
      else wrap.appendChild(el("div",{style:{background:"rgba(88,204,2,0.12)",border:"2px solid #58CC02",borderRadius:10,padding:"10px 14px",fontWeight:800,color:"#58CC02"}},"✓ Exacte!"));
      render();
    };
    inp.addEventListener("keydown", e=>{ if(e.key==="Enter") check(); });
    wrap.appendChild(el("button",{class:"btn",onclick:check,
      style:{background:course.color,color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",fontSize:15,fontWeight:800,alignSelf:"flex-end",boxShadow:`0 5px 0 ${course.color}aa`}},
      "Comprovar →"
    ));
    return wrap;
  }

  function buildOrderEx(ex) {
    let pool   = shuffle(ex.words);
    let chosen = [];
    const wrap = el("div",{style:{display:"flex",flexDirection:"column",gap:12}});

    const chosenArea = el("div",{style:{minHeight:50,background:"rgba(255,255,255,0.06)",border:"2px dashed rgba(255,255,255,0.2)",borderRadius:12,padding:"10px 12px",display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}},
      el("span",{style:{color:"rgba(255,255,255,0.25)",fontSize:13}},"Toca les paraules per ordenar-les…")
    );
    const poolArea = el("div",{style:{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}});

    function renderOrder() {
      chosenArea.innerHTML="";
      if(chosen.length===0) chosenArea.appendChild(el("span",{style:{color:"rgba(255,255,255,0.25)",fontSize:13}},"Toca les paraules per ordenar-les…"));
      chosen.forEach((w,i)=>{
        chosenArea.appendChild(el("button",{
          onclick:()=>{if(showNext)return; pool.push(w); chosen.splice(i,1); renderOrder();},
          style:{background:`${course.color}33`,border:`2px solid ${course.color}`,borderRadius:9,padding:"7px 13px",color:"#fff",fontSize:14,fontWeight:700,cursor:showNext?"default":"pointer"}
        }, w));
      });
      poolArea.innerHTML="";
      pool.forEach((w,i)=>{
        poolArea.appendChild(el("button",{
          onclick:()=>{if(showNext)return; chosen.push(w); pool.splice(i,1); renderOrder();},
          style:{background:"rgba(255,255,255,0.1)",border:"2px solid rgba(255,255,255,0.2)",borderRadius:9,padding:"7px 13px",color:"#fff",fontSize:14,fontWeight:700,cursor:showNext?"default":"pointer",opacity:showNext?0.4:1}
        }, w));
      });
    }
    renderOrder();
    wrap.appendChild(chosenArea);
    wrap.appendChild(poolArea);
    wrap.appendChild(el("button",{class:"btn",
      onclick:()=>{
        if(showNext) return;
        const ok = normalize(chosen.join(" "))===normalize(ex.a);
        result=ok; showNext=true;
        chosenArea.style.border=`2px solid ${ok?"#58CC02":"#FF4900"}`;
        if(ok){xpEarned+=2+(streakCount>=2?5:0);streakCount++;}else{hearts--;streakCount=0;}
        wrap.appendChild(el("div",{style:{background:ok?"rgba(88,204,2,0.12)":"rgba(255,73,0,0.12)",border:`2px solid ${ok?"#58CC02":"#FF4900"}`,borderRadius:10,padding:"10px 14px"}},
          el("div",{style:{fontWeight:800,color:ok?"#58CC02":"#FF4900"}}, ok?"✓ Correcte!":"✗ Incorrecte"),
          !ok?el("div",{style:{color:"rgba(255,255,255,0.6)",fontSize:13,marginTop:4}},"Resposta: ",el("strong",{style:{color:"#fff"}},ex.a)):null
        ));
        render();
      },
      style:{background:course.color,color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",fontSize:15,fontWeight:800,alignSelf:"flex-end",boxShadow:`0 5px 0 ${course.color}aa`}
    }, "Comprovar →"));
    return wrap;
  }

  render();
  return root;
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────

function AdminScreen() {
  const { students, allProgress, adminTab, adminLoading, profile } = state;

  const root = el("div",{class:"fade-in",style:{minHeight:"100vh",paddingBottom:40}});

  // Header
  root.appendChild(
    el("div",{style:{padding:"18px 20px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.1)"}},
      el("div",{style:{display:"flex",alignItems:"center",gap:10}},
        el("div",{class:"floating",style:{fontSize:28}},"🦉"),
        el("div",{},
          el("div",{style:{fontFamily:"'Fredoka One',cursive",fontSize:20,color:"#58CC02"}},"LinguCat – Admin"),
          el("div",{style:{fontSize:11,color:"#ffffff55"}}, profile?.name||"Professor")
        )
      ),
      el("button",{onclick:handleLogout,style:{background:"none",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"#ffffff88",padding:"6px 12px",fontSize:12}},"Sortir")
    )
  );

  // Tabs
  root.appendChild(
    el("div",{style:{display:"flex",gap:0,borderBottom:"2px solid rgba(255,255,255,0.1)",margin:"0 20px"}},
      ...[["students","👥 Alumnes"],["progress","📊 Progrés"]].map(([tab,label])=>
        el("button",{onclick:()=>loadAdminTab(tab),
          style:{background:"none",border:"none",color:adminTab===tab?"#58CC02":"rgba(255,255,255,0.5)",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:14,padding:"12px 20px",borderBottom:`3px solid ${adminTab===tab?"#58CC02":"transparent"}`,cursor:"pointer",transition:"all 0.2s"}},
          label
        )
      )
    )
  );

  if(adminLoading) {
    root.appendChild(el("div",{style:{textAlign:"center",padding:40,fontSize:32,animation:"spin 1s linear infinite"}},"🌀"));
    return root;
  }

  if(adminTab==="students") root.appendChild(StudentsTab());
  else root.appendChild(ProgressTab());

  return root;
}

function StudentsTab() {
  const { students } = state;
  const wrap = el("div",{style:{padding:"16px 20px 0"}});

  // Stats row
  const totalEnrolled = students.filter(s=>(s.courses||[]).length>0).length;
  wrap.appendChild(
    el("div",{style:{display:"flex",gap:12,marginBottom:16}},
      el("div",{style:{flex:1,background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"14px",textAlign:"center"}},
        el("div",{style:{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)"}}, "Alumnes"),
        el("div",{style:{fontFamily:"'Fredoka One',cursive",fontSize:28,color:"#58CC02"}}, String(students.length))
      ),
      el("div",{style:{flex:1,background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"14px",textAlign:"center"}},
        el("div",{style:{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)"}}, "Inscrits"),
        el("div",{style:{fontFamily:"'Fredoka One',cursive",fontSize:28,color:"#58CC02"}}, String(totalEnrolled))
      )
    )
  );

  if(students.length===0) {
    wrap.appendChild(el("div",{style:{textAlign:"center",padding:32,color:"rgba(255,255,255,0.4)"}},
      el("div",{style:{fontSize:40,marginBottom:8}},"📭"),
      el("div",{},"Encara no hi ha alumnes. Quan un alumne entri per primer cop apareixerà aquí.")
    ));
    return wrap;
  }

  students.forEach(s=>{
    const myCourses = s.courses||[];
    const card = el("div",{style:{background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"14px 16px",marginBottom:10}},
      // Student info
      el("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:10}},
        el("div",{style:{width:40,height:40,borderRadius:10,background:"#58CC0233",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#58CC02"}},
          (s.name||"?")[0].toUpperCase()
        ),
        el("div",{style:{flex:1}},
          el("div",{style:{fontWeight:700,fontSize:15}}, s.name||s.email),
          el("div",{style:{fontSize:11,color:"rgba(255,255,255,0.4)"}}, s.email)
        ),
        el("button",{onclick:()=>confirmDelete(s),
          style:{background:"rgba(255,73,0,0.15)",border:"1px solid rgba(255,73,0,0.4)",borderRadius:8,color:"#FF6B6B",fontSize:12,fontWeight:700,padding:"5px 10px",cursor:"pointer"}},
          "🗑 Eliminar"
        )
      ),
      // Course enrollment
      el("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},
        ...Object.values(COURSES).map(course=>{
          const enrolled = myCourses.includes(course.id);
          const btn = el("button",{
            onclick:()=>toggleEnroll(s.uid, course.id, enrolled),
            style:{background:enrolled?`${course.color}33`:"rgba(255,255,255,0.07)",border:`2px solid ${enrolled?course.color:"rgba(255,255,255,0.15)"}`,borderRadius:10,padding:"6px 12px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}},
            `${course.flag} ${enrolled?"✓ "+course.name.split("→")[0].trim():"+ "+course.name.split("→")[0].trim()}`
          );
          return btn;
        })
      )
    );
    wrap.appendChild(card);
  });
  return wrap;
}

function ProgressTab() {
  const { students, allProgress } = state;
  const wrap = el("div",{style:{padding:"16px 20px 0"}});

  if(students.length===0){
    wrap.appendChild(el("div",{style:{textAlign:"center",padding:32,color:"rgba(255,255,255,0.4)"}},"Sense alumnes encara."));
    return wrap;
  }

  students.forEach(s=>{
    const prog = allProgress[s.uid]||{};
    const xp   = Object.values(prog.xp||{}).reduce((a,b)=>a+b,0);
    const done  = Object.keys(prog.completed||{}).length;
    const streak = prog.streak||0;
    const myCourses = s.courses||[];

    const card = el("div",{style:{background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"14px 16px",marginBottom:10}},
      el("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10}},
        el("div",{style:{width:38,height:38,borderRadius:10,background:"#9C27B033",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:17,color:"#CE93D8"}},
          (s.name||"?")[0].toUpperCase()
        ),
        el("div",{style:{flex:1}},
          el("div",{style:{fontWeight:700,fontSize:14}}, s.name||s.email),
          el("div",{style:{fontSize:11,color:"rgba(255,255,255,0.4)"}}, s.email)
        ),
        el("div",{style:{display:"flex",gap:10,alignItems:"center"}},
          el("div",{style:{textAlign:"center"}},el("div",{},"🔥"),el("div",{style:{fontSize:12,fontWeight:800,color:"#FF9600"}},streak)),
          el("div",{style:{textAlign:"center"}},el("div",{},"⭐"),el("div",{style:{fontSize:12,fontWeight:800,color:"#FFD700"}},xp+" XP")),
          el("div",{style:{textAlign:"center"}},el("div",{},"📖"),el("div",{style:{fontSize:12,fontWeight:800,color:"#58CC02"}},done))
        )
      ),
      // Per-course progress bars
      ...myCourses.filter(cid=>!!COURSES[cid]).map(cid=>{
        const course = COURSES[cid];
        const lessons = course.units.flatMap(u=>u.lessons);
        const cDone   = lessons.filter(l=>!!(prog.completed||{})[l.id]).length;
        return el("div",{style:{marginBottom:6}},
          el("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:3}},
            el("span",{},`${course.flag} ${course.name}`),
            el("span",{},`${cDone}/${lessons.length}`)
          ),
          progressBar(cDone, lessons.length, course.color, 6)
        );
      })
    );
    wrap.appendChild(card);
  });
  return wrap;
}

// ── ADMIN ACTIONS ─────────────────────────────────────────────────────────────

async function loadAdminTab(tab) {
  setState({adminTab:tab, adminLoading:true});
  try {
    const students    = await getAllStudents();
    const allProgress = await getAllProgress();
    setState({students, allProgress, adminLoading:false});
  } catch(e) {
    setState({adminLoading:false});
  }
}

async function toggleEnroll(uid, courseId, isEnrolled) {
  if(isEnrolled) await unenrollStudent(uid, courseId);
  else           await enrollStudent(uid, courseId);
  await loadAdminTab(state.adminTab);
}

function confirmDelete(student) {
  const modal = el("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:24}},
    el("div",{style:{background:"#1e2a45",border:"2px solid rgba(255,73,0,0.4)",borderRadius:18,padding:"28px",maxWidth:340,width:"100%",textAlign:"center"}},
      el("div",{style:{fontSize:40,marginBottom:12}},"⚠️"),
      el("div",{style:{fontWeight:800,fontSize:17,marginBottom:8}},`Eliminar ${student.name||student.email}?`),
      el("div",{style:{color:"rgba(255,255,255,0.5)",fontSize:13,marginBottom:20}},"S'eliminarà el compte i tot el progrés. Aquesta acció és irreversible."),
      el("div",{style:{display:"flex",gap:12}},
        el("button",{onclick:()=>document.body.removeChild(modal),style:{flex:1,background:"rgba(255,255,255,0.1)",border:"2px solid rgba(255,255,255,0.2)",borderRadius:12,padding:"12px",color:"#fff",fontWeight:700,cursor:"pointer"}},"Cancel·lar"),
        el("button",{onclick:async()=>{await deleteStudent(student.uid);document.body.removeChild(modal);await loadAdminTab(state.adminTab);},
          style:{flex:1,background:"#FF4900",border:"none",borderRadius:12,padding:"12px",color:"#fff",fontWeight:700,cursor:"pointer"}},"Eliminar")
      )
    )
  );
  document.body.appendChild(modal);
}

// ══════════════════════════════════════════════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════════════════════════════════════════════

async function handleCompleteLesson(lessonId, xp) {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now()-86400000).toDateString();
  const { progress, user } = state;
  const newStreak = progress.lastActive===today ? progress.streak
    : progress.lastActive===yesterday ? progress.streak+1 : 1;
  const newProgress = {
    ...progress,
    xp:       {...progress.xp, [lessonId]:xp},
    completed:{...progress.completed, [lessonId]:true},
    streak:   newStreak,
    lastActive: today,
  };
  await saveProgress(user.uid, newProgress);
  setState({progress:newProgress, screen:"course", activeLesson:null});
}

async function handleLogout() {
  await logout();
  setState({user:null, profile:null, progress:{xp:{},completed:{},streak:0,lastActive:null}, screen:"login"});
}

// ══════════════════════════════════════════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════════════════════════════════════════

function render() {
  const root = document.getElementById("root");
  root.innerHTML = "";
  const { screen } = state;
  let view;
  if      (screen==="loading")  view = el("div",{class:"spinner",style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontSize:48,animation:"spin 1s linear infinite"}},"🦉");
  else if (screen==="login")    view = LoginScreen();
  else if (screen==="home")     view = HomeScreen();
  else if (screen==="course")   view = CourseScreen();
  else if (screen==="lesson")   view = ExerciseScreen();
  else if (screen==="admin")    view = AdminScreen();
  else                          view = LoginScreen();
  root.appendChild(view);
}

// ══════════════════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════════════════

render();

// Gestiona el resultat del redirect de Google en tornar a la pàgina
handleRedirectResult().catch(() => {});

onAuth(async user => {
  if(!user) { setState({screen:"login",user:null,profile:null}); return; }
  try {
    let profile = await getUserProfile(user.uid);

    // Si no existeix el perfil, el creem ara (pot passar just després del redirect)
    if (!profile) {
      const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const { db, ADMIN_EMAILS: admins } = await import("./firebase.js");
      await setDoc(doc(db, "users", user.uid), {
        uid:       user.uid,
        email:     user.email,
        name:      user.displayName || user.email.split("@")[0],
        photo:     user.photoURL || "",
        role:      ADMIN_EMAILS.includes(user.email) ? "admin" : "student",
        courses:   [],
        createdAt: serverTimestamp(),
      });
      profile = await getUserProfile(user.uid);
    }

    const progress = await getProgress(user.uid);
    if(profile?.role==="admin") {
      const students    = await getAllStudents();
      const allProgress = await getAllProgress();
      setState({user, profile, progress, screen:"admin", students, allProgress});
    } else {
      setState({user, profile, progress, screen:"home"});
    }
  } catch(e) {
    console.error(e);
    setState({screen:"login"});
  }
});
