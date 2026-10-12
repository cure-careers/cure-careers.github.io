(function(){
"use strict";
/* Where listings come from: a JSON file or any API returning the same shape (see README). */
var JOBS_SOURCE = (window.CURE_CONFIG && window.CURE_CONFIG.jobsSource) || "jobs.json";
var DATA = JSON.parse(document.getElementById("cure-data").textContent);
try{var cached=localStorage.getItem("cure-jobs:data");if(cached){var cd=JSON.parse(cached);if(cd&&cd.jobs&&String(cd.updated)>String(DATA.updated))DATA=cd}}catch(e){}
var TODAY = new Date();

/* ================= reference tables ================= */
var ANCHORS = [
  ["CURE campus, White Plains",41.0340,-73.7629],["Yonkers",40.9312,-73.8988],["New Rochelle",40.9115,-73.7824],["Bronx",40.8448,-73.8648],
  ["Manhattan",40.7831,-73.9712],["Brooklyn",40.6782,-73.9442],["Queens",40.7282,-73.7949],["Staten Island",40.5795,-74.1502],
  ["Nassau County (Mineola)",40.7493,-73.6407],["Suffolk County (Hauppauge)",40.8257,-73.2026],
  ["Stamford, CT",41.0534,-73.5387],["Norwalk, CT",41.1177,-73.4082],["Bridgeport, CT",41.1865,-73.1952],["Danbury, CT",41.3948,-73.4540],["New Haven, CT",41.3083,-72.9279],
  ["Hackensack, NJ",40.8859,-74.0435],["Paterson, NJ",40.9168,-74.1718],["Newark, NJ",40.7357,-74.1724],["Jersey City, NJ",40.7178,-74.0431],
  ["Peekskill",41.2901,-73.9204],["Mount Kisco",41.2043,-73.7271],["New City (Rockland)",41.1476,-73.9896],["Carmel (Putnam)",41.4301,-73.6801],
  ["Poughkeepsie",41.7004,-73.9210],["Newburgh",41.5034,-74.0104],["Middletown, NY",41.4459,-74.4229],["Kingston, NY",41.9270,-73.9974],
  ["Charlotte, NC",35.2271,-80.8431],["Raleigh, NC",35.7796,-78.6382],["Charleston, SC",32.7765,-79.9311],["Atlanta, GA",33.7490,-84.3880],["Jacksonville, FL",30.3322,-81.6557],["Orlando, FL",28.5383,-81.3792],["Tampa, FL",27.9506,-82.4572],["Miami, FL",25.7617,-80.1918],["Honolulu, HI",21.3069,-157.8583]
];
var TOWNS = [
  ["White Plains, NY",41.0340,-73.7629,"whv"],["Yonkers, NY",40.9312,-73.8988,"whv"],["New Rochelle, NY",40.9115,-73.7824,"whv"],
  ["Mount Vernon, NY",40.9126,-73.8371,"whv"],["Valhalla, NY",41.0748,-73.7757,"whv"],["Harrison, NY",40.9690,-73.7126,"whv"],["Scarsdale / Hartsdale, NY",41.0051,-73.7846,"whv"],
  ["Rye / Port Chester, NY",41.0016,-73.6657,"whv"],["Sleepy Hollow / Tarrytown, NY",41.0857,-73.8585,"whv"],["Mount Kisco, NY",41.2043,-73.7271,"whv"],
  ["Katonah, NY",41.2590,-73.6851,"whv"],["Cortlandt Manor / Peekskill, NY",41.2901,-73.9204,"whv"],["Bronxville, NY",40.9382,-73.8321,"whv"],["Dobbs Ferry, NY",41.0145,-73.8726,"whv"],
  ["Carmel / Putnam, NY",41.4301,-73.6801,"whv"],["West Nyack / Nyack, NY",41.0965,-73.9732,"whv"],["Pomona / New City, NY",41.1670,-74.0429,"whv"],
  ["Poughkeepsie, NY",41.7004,-73.9210,"whv"],["Fishkill, NY",41.5354,-73.8990,"whv"],["Newburgh, NY",41.5034,-74.0104,"whv"],
  ["Middletown, NY",41.4459,-74.4229,"whv"],["Kingston, NY",41.9270,-73.9974,"whv"],
  ["Bronx, NY",40.8448,-73.8648,"nyc"],["Manhattan, NY",40.7831,-73.9712,"nyc"],["Brooklyn, NY",40.6782,-73.9442,"nyc"],
  ["Queens, NY",40.7282,-73.7949,"nyc"],["Staten Island, NY",40.5795,-74.1502,"nyc"],
  ["Mineola / Garden City, NY",40.7409,-73.6423,"li"],["New Hyde Park / Lake Success, NY",40.7590,-73.7090,"li"],["Syosset / Hicksville, NY",40.8262,-73.5021,"li"],
  ["Huntington, NY",40.8682,-73.4257,"li"],["Stony Brook / East Setauket, NY",40.9257,-73.1409,"li"],["Patchogue, NY",40.7657,-73.0151,"li"],["Riverhead, NY",40.9170,-72.6620,"li"],
  ["Stamford, CT",41.0534,-73.5387,"ct"],["Greenwich, CT",41.0262,-73.6282,"ct"],["Norwalk, CT",41.1177,-73.4082,"ct"],["Bridgeport, CT",41.1865,-73.1952,"ct"],
  ["Danbury, CT",41.3948,-73.4540,"ct"],["New Haven, CT",41.3083,-72.9279,"ct"],["Waterbury, CT",41.5582,-73.0515,"ct"],["Hartford, CT",41.7658,-72.6734,"ct"],
  ["Hackensack, NJ",40.8859,-74.0435,"nj"],["Paterson, NJ",40.9168,-74.1718,"nj"],["Newark, NJ",40.7357,-74.1724,"nj"],["Jersey City / Hoboken, NJ",40.7178,-74.0431,"nj"],
  ["Morristown, NJ",40.7968,-74.4815,"nj"],["Edison / Iselin, NJ",40.5390,-74.3685,"nj"],["New Brunswick, NJ",40.4862,-74.4518,"nj"],["Asbury Park / Neptune, NJ",40.2204,-74.0121,"nj"]
];
var REGIONS = [["whv","Westchester & Hudson Valley"],["nyc","New York City"],["li","Long Island"],["nj","New Jersey"],["ct","Connecticut"],["south","Carolinas, Georgia & Florida"],["hi","Hawaii"],["reloc","Other states"]];
var STATES = [["NY","New York"],["NJ","New Jersey"],["CT","Connecticut"],["NC","North Carolina"],["SC","South Carolina"],["GA","Georgia"],["FL","Florida"],["HI","Hawaii"],["OT","All other states"]];
var STATENAMES={AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District of Columbia",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"};
var MODS = [["general","General"],["obgyn","OB/GYN"],["vascular","Vascular"],["echo","Echo"],["breast","Breast"],["peds","Pediatric"],["msk","MSK"]];
var MODLONG = {general:"General / abdominal",obgyn:"OB/GYN and MFM",vascular:"Vascular",echo:"Echocardiography",breast:"Breast",peds:"Pediatric",msk:"Musculoskeletal"};
var TYPES = ["Full time","Part time","Per diem","Travel"];
var CREDS = ["RDMS","RVT","RDCS","RCS","RVS","RT(S)","RT(VS)"];
var STATUS = [["verified","Verified with employer"],["unverified","Third party listing"],["search","Saved search"]];
var STATUSLONG = {verified:"Verified with employer",unverified:"Third party listing, not verified",search:"Saved search, opens live results"};
var SETTINGS = [["hospital","Hospital or health system"],["outpatient","Outpatient clinic or imaging center"],["other","Other or varies"]];
var QUICK = [["White Plains",0],["Danbury",13],["Poughkeepsie",23]];
var SOCIAL = [["Instagram",["ultrasoundjobs","sonographerjobs","ultrasoundtech","vascularsonographer","echotech"],function(t){return "https://www.instagram.com/explore/tags/"+t+"/"}],
  ["TikTok",["ultrasoundjobs","sonographerjobs","ultrasoundtech","vascularsonographer","sonographer"],function(t){return "https://www.tiktok.com/tag/"+t}]];
var REG = {required:"Registration required",eligible:"Registry eligible accepted",unstated:"Credential not stated"};
var BANDS = [[15,"Local","b1"],[30,"Short commute","b2"],[50,"Commutable","b3"],[75,"Extended commute","b4"],[1e9,"Relocation","b5"]];
var regionName = {}; REGIONS.forEach(function(r){regionName[r[0]]=r[1]});

/* ================= helpers ================= */
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function safeUrl(u){return /^https:\/\//i.test(String(u||""))?String(u):""}
function miles(a1,o1,a2,o2){var R=3958.8,t=Math.PI/180,dA=(a2-a1)*t,dO=(o2-o1)*t;var h=Math.sin(dA/2)*Math.sin(dA/2)+Math.cos(a1*t)*Math.cos(a2*t)*Math.sin(dO/2)*Math.sin(dO/2);return 2*R*Math.asin(Math.sqrt(h))}
function band(d){for(var i=0;i<BANDS.length;i++){if(d<=BANDS[i][0])return BANDS[i]}return BANDS[BANDS.length-1]}
function fmtDate(s){if(!s)return "";var d=new Date(s+"T12:00:00");if(isNaN(d))return s;return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
function daysSince(s){var d=new Date((s||"")+"T12:00:00");return isNaN(d)?0:Math.floor((TODAY-d)/864e5)}
function isoToday(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function store(k,v){try{if(v===undefined){var r=localStorage.getItem("cure-jobs:"+k);return r?JSON.parse(r):null}localStorage.setItem("cure-jobs:"+k,JSON.stringify(v))}catch(e){return null}}
function statusOf(j){var s=j.status;return (s==="unverified"||s==="search")?s:"verified"}
function settingOf(j){var s=j.setting;return (s==="hospital"||s==="outpatient")?s:"other"}
function stateKey(j){var s=String(j.state||"").toUpperCase();return ["NY","NJ","CT","NC","SC","GA","FL","HI"].indexOf(s)>-1?s:"OT"}
var $ = function(id){return document.getElementById(id)};
var qsa = function(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel))};

/* ================= shell ================= */
var app = $("app");
app.innerHTML =
'<header class="mast"><div class="wrap">'+
  '<div class="brand"><img class="mark" src="icons/icon-192.png" alt="" width="44" height="44"><span class="eyebrow">Center for Ultrasound Research &amp; Education · Career Services</span>'+
  '<h1>Sonography Jobs</h1>'+
  '<p>Sonography openings for CURE students and graduates, each labeled by how it was checked, plus a resume builder made for sonographers and the tools to search everywhere else.</p></div>'+
  '<nav class="tabs" role="tablist" aria-label="Sections">'+
    '<button class="tab" role="tab" id="t-jobs" data-view="jobs" aria-controls="v-jobs">Job openings</button>'+
    '<button class="tab" role="tab" id="t-resume" data-view="resume" aria-controls="v-resume">Resume builder</button>'+
    '<button class="tab" role="tab" id="t-toolkit" data-view="toolkit" aria-controls="v-toolkit">Career toolkit</button>'+
  '</nav>'+
'</div></header>'+
'<main class="wrap">'+
/* ---------- jobs view ---------- */
'<div class="view" id="v-jobs" role="tabpanel" aria-labelledby="t-jobs">'+
  '<div class="installbar" id="installbar" hidden></div>'+
  '<section class="dash" aria-label="Openings at a glance">'+
    '<div class="sec-head" style="margin:0"><h2>Current openings</h2><p id="updatedLine"></p></div>'+
    '<div class="tiles big" id="tilesBig"></div>'+
    '<div class="lbl">By state</div><div class="tiles small" id="tilesState"></div>'+
    '<div class="lbl">By specialty</div><div class="tiles small" id="tilesMod"></div>'+
    '<div class="lbl">By work setting</div><div class="tiles small" id="tilesSet"></div>'+
    '<div class="lbl">By listing type</div><div class="tiles small" id="tilesStatus"></div>'+
    '<p class="hint statkey"><b>Verified with employer:</b> CURE opened the posting on the employer\'s site and confirmed it open. <b>Third party listing:</b> found on a job board or aggregator and not yet confirmed by CURE. <b>Saved search:</b> opens live results for that area, specialty or employer.</p>'+
  '</section>'+
  '<section class="hotwrap" id="hotjobs" hidden></section>'+
  '<section id="openings">'+
    '<div class="layout">'+
      '<aside class="rail" aria-label="Filters">'+
        '<div class="fgroup"><label for="fq">Search</label><input id="fq" type="search" placeholder="Title, employer, town"></div>'+
        '<div class="fgroup"><label for="fanchor">Measure distance from</label><select id="fanchor"></select><p class="hint">Pick the area closest to where you live.</p></div>'+
        '<div class="fgroup"><label for="fmaxd">Maximum distance</label><select id="fmaxd"><option value="any">Any distance</option><option value="15">Within 15 miles</option><option value="30">Within 30 miles</option><option value="50">Within 50 miles</option><option value="60">Within 60 miles</option><option value="75">Within 75 miles</option><option value="120">Within 120 miles</option></select></div>'+
        '<div class="fgroup"><span class="gl" id="lreg">My registry status</span><div class="seg" role="radiogroup" aria-labelledby="lreg">'+
          '<label><input type="radio" name="freg" value="any"> Show all openings</label>'+
          '<label><input type="radio" name="freg" value="notyet"> Not yet registered (registry eligible accepted)</label>'+
          '<label><input type="radio" name="freg" value="registered"> I am registered</label></div>'+
          '<label class="toggle"><input type="checkbox" id="fnewgrad"> New graduates welcome</label>'+
          '<label class="toggle"><input type="checkbox" id="frecent"> Added in the last 7 days</label>'+
          '<label class="toggle"><input type="checkbox" id="fhot"> Hot Jobs only</label></div>'+
        '<div class="fgroup"><span class="gl">Listing type</span><div class="chips" id="cstatus"></div></div>'+
        '<div class="fgroup"><span class="gl">Specialty</span><div class="chips" id="cmods"></div></div>'+
        '<div class="fgroup"><span class="gl">Work setting</span><div class="chips" id="csetting"></div></div>'+
        '<div class="fgroup"><span class="gl">State</span><div class="chips" id="cstates"></div><label for="fst" class="hint" style="margin:4px 0 0">Or choose any state</label><select id="fst"></select></div>'+
        '<div class="fgroup"><span class="gl">Region</span><div class="chips" id="cregions"></div></div>'+
        '<div class="fgroup"><span class="gl">Job type</span><div class="chips" id="ctypes"></div></div>'+
        '<div class="fgroup"><label class="toggle"><input type="checkbox" id="fshort"> Show my saved jobs only</label><button class="linkbtn" id="fclear" type="button">Clear all filters</button></div>'+
      '</aside>'+
      '<div style="min-width:0">'+
        '<div class="resbar"><div class="count" id="count" aria-live="polite"></div><div class="ctl"><span class="status">Nearest to</span><span class="quick" id="quick"></span><label for="fsort" class="status">Sort</label><select id="fsort"><option value="near">Nearest first (verified first within each distance band)</option><option value="new">Newest first</option></select></div></div>'+
        '<div id="results"></div>'+
      '</div>'+
    '</div>'+
  '</section>'+
  '<p class="disclaim">Listings link to the employer or job board, where you apply. Only listings marked Verified with employer were confirmed open by CURE, and even those can close without notice. Third party listings and saved searches have not been checked by CURE. Confirm requirements, pay and status on the original posting before you apply. Distances are approximate straight line miles, not driving distance. CURE does not guarantee employment.</p>'+
'</div>'+
/* ---------- resume view ---------- */
'<div class="view" id="v-resume" role="tabpanel" aria-labelledby="t-resume" hidden>'+
  '<div class="sec-head" style="margin:0"><h2>Sonographer resume builder</h2><p>An ultrasound first format: registry status, skills, clinical experience and equipment come first, where hiring managers look. Your entries are saved only on this device.</p></div>'+
  '<div class="rb"><form class="rform" id="rform" novalidate></form>'+
  '<aside class="preview" aria-label="Resume preview"><div class="pbar"><b>Preview</b><div class="acts">'+
    '<button type="button" class="btn sm ghost" id="rb-copy">Copy text</button>'+
    '<button type="button" class="btn sm" id="rb-docx" hidden>Download Word file</button>'+
        '<button type="button" class="btn sm ghost" id="rb-clear">Clear</button></div></div>'+
    '<p class="msg" id="rb-msg" hidden></p>'+
    '<div class="paperwrap"><div class="paper" id="paper"></div></div>'+
    '<textarea id="rb-copybox" hidden aria-label="Resume text to copy" style="min-height:160px"></textarea>'+
  '</aside></div>'+
  '<p class="callout"><b>Accuracy standard.</b> List only credentials, examinations, equipment, skills and experience you have actually completed or earned. Skill ratings only shape the wording; the numbers never appear on the resume. Ask Career Services to review your resume before you send it.</p>'+
'</div>'+
/* ---------- toolkit view ---------- */
'<div class="view" id="v-toolkit" role="tabpanel" aria-labelledby="t-toolkit" hidden>'+
  '<div class="sec-head" style="margin:0"><h2>Career toolkit</h2><p>Open any section when you need it.</p></div>'+
  '<div id="kit"></div>'+
  '<section class="help"><div><h2>Need help with your search?</h2><p>Career Services helps CURE students and graduates with résumés, finding positions, applications, interview preparation, credential planning and approaching employers. Start before you finish clinical externship.</p>'+
    '<p>When you accept a position, tell Career Services. Your employment information is part of how CURE documents graduate outcomes.</p></div><div class="contact" id="contact"></div></section>'+
'</div>'+
'</main>';

/* ================= tabs ================= */
function showView(v){
  if(["jobs","resume","toolkit"].indexOf(v)<0)v="jobs";
  ["jobs","resume","toolkit"].forEach(function(n){$("v-"+n).hidden=n!==v;$("t-"+n).setAttribute("aria-selected",String(n===v))});
  store("view",v);
}
qsa(".tab").forEach(function(t){t.addEventListener("click",function(){showView(t.dataset.view);try{history.replaceState(null,"","#"+t.dataset.view)}catch(e){}})});
showView((location.hash||"").replace("#","")||store("view")||"jobs");
window.addEventListener("hashchange",function(){var h=(location.hash||"").replace("#","");if(h)showView(h)});

/* ================= openings ================= */
var saved = store("filters") || {};
var F = {q:saved.q||"",regions:saved.regions||[],states:saved.states||[],mods:saved.mods||[],types:saved.types||[],reg:saved.reg||"any",
  newgrad:!!saved.newgrad,recent:!!saved.recent,statuses:saved.statuses||[],settings:saved.settings||[],hot:!!saved.hot,st:saved.st||"",maxd:saved.maxd||"any",anchor:saved.anchor||0,sort:saved.sort||"near",shortlist:!!saved.shortlist};
var stars = store("stars") || [];
var PAGE = 36, shown = PAGE;
var hidden = {};
function persist(){store("filters",F);store("stars",stars)}

$("fanchor").innerHTML = ANCHORS.map(function(a,i){return '<option value="'+i+'">'+esc(a[0])+'</option>'}).join("");
function syncInputs(){
  $("fanchor").value=String(F.anchor);$("fmaxd").value=F.maxd;$("fsort").value=F.sort;$("fq").value=F.q;
  $("fst").value=F.st;$("fnewgrad").checked=F.newgrad;$("frecent").checked=F.recent;$("fhot").checked=F.hot;$("fshort").checked=F.shortlist;
  qsa('input[name=freg]').forEach(function(r){r.checked=r.value===F.reg});
  qsa(".rail .chip").forEach(function(c){c.setAttribute("aria-pressed",String(F[c.dataset.k].indexOf(c.dataset.v)>-1))});
  qsa("#quick .chip").forEach(function(c){c.setAttribute("aria-pressed",String(+c.dataset.anchor===+F.anchor))});
}
function chipGroup(el,items,key){el.innerHTML=items.map(function(it){return '<button type="button" class="chip" data-k="'+key+'" data-v="'+esc(it[0])+'" aria-pressed="false">'+esc(it[1])+' <span class="n"></span></button>'}).join("")}
chipGroup($("cmods"),MODS,"mods");chipGroup($("cstates"),STATES,"states");chipGroup($("cregions"),REGIONS,"regions");
chipGroup($("ctypes"),TYPES.map(function(t){return [t,t]}),"types");chipGroup($("cstatus"),STATUS,"statuses");chipGroup($("csetting"),SETTINGS,"settings");
$("quick").innerHTML=QUICK.map(function(q){return '<button type="button" class="chip" data-anchor="'+q[1]+'" aria-pressed="false">'+esc(q[0])+'</button>'}).join("");
$("quick").addEventListener("click",function(e){var b=e.target.closest("[data-anchor]");if(!b)return;F.anchor=+b.dataset.anchor;F.sort="near";syncInputs();render()});
syncInputs();
document.querySelector(".rail").addEventListener("click",function(e){
  var b=e.target.closest(".chip");if(!b)return;
  var arr=F[b.dataset.k],i=arr.indexOf(b.dataset.v);if(i>-1)arr.splice(i,1);else arr.push(b.dataset.v);
  b.setAttribute("aria-pressed",String(i===-1));shown=PAGE;render();
});
$("fq").addEventListener("input",function(){F.q=this.value;shown=PAGE;render()});
$("fanchor").addEventListener("change",function(){F.anchor=+this.value;render()});
$("fmaxd").addEventListener("change",function(){F.maxd=this.value;shown=PAGE;render()});
$("fsort").addEventListener("change",function(){F.sort=this.value;render()});
$("fnewgrad").addEventListener("change",function(){F.newgrad=this.checked;shown=PAGE;render()});
$("frecent").addEventListener("change",function(){F.recent=this.checked;shown=PAGE;render()});
$("fhot").addEventListener("change",function(){F.hot=this.checked;shown=PAGE;render()});
$("fst").addEventListener("change",function(){F.st=this.value;shown=PAGE;render()});
function stateOptions(){var c={};DATA.jobs.forEach(function(j){if(!hidden[j.id]){var s=String(j.state||"").toUpperCase();c[s]=(c[s]||0)+1}});
  $("fst").innerHTML='<option value="">Any state</option>'+Object.keys(c).sort(function(a,b){return (STATENAMES[a]||a).localeCompare(STATENAMES[b]||b)}).map(function(s){return '<option value="'+esc(s)+'">'+esc(STATENAMES[s]||s)+' ('+c[s]+')</option>'}).join("");$("fst").value=F.st}
$("fshort").addEventListener("change",function(){F.shortlist=this.checked;shown=PAGE;render()});
qsa('input[name=freg]').forEach(function(r){r.addEventListener("change",function(){F.reg=this.value;shown=PAGE;render()})});
function resetF(){F.q="";F.regions=[];F.states=[];F.mods=[];F.types=[];F.reg="any";F.newgrad=false;F.recent=false;F.maxd="any";F.shortlist=false;F.statuses=[];F.settings=[];F.hot=false;F.st=""}
function clearFilters(){resetF();shown=PAGE;syncInputs();render()}
$("fclear").addEventListener("click",clearFilters);

function distOf(j){var a=ANCHORS[F.anchor]||ANCHORS[0];return (typeof j.lat==="number"&&typeof j.lng==="number")?miles(a[1],a[2],j.lat,j.lng):null}
function isNew(j){return daysSince(j.added)<=7}
function matches(j,skip){
  if(hidden[j.id])return false;
  if(F.shortlist&&stars.indexOf(j.id)<0)return false;
  if(F.q){var hay=[j.title,j.employer,j.facility,j.city,j.state,j.notes].join(" ").toLowerCase();
    var terms=F.q.toLowerCase().split(/\s+/).filter(Boolean);for(var i=0;i<terms.length;i++){if(hay.indexOf(terms[i])<0)return false}}
  if(skip!=="mods"&&F.mods.length&&!(j.mods||[]).some(function(m){return F.mods.indexOf(m)>-1}))return false;
  if(skip!=="regions"&&F.regions.length&&F.regions.indexOf(j.region)<0)return false;
  if(skip!=="states"&&F.states.length&&F.states.indexOf(stateKey(j))<0)return false;
  if(F.st&&String(j.state||"").toUpperCase()!==F.st)return false;
  if(skip!=="types"&&F.types.length&&F.types.indexOf(j.type)<0)return false;
  if(skip!=="statuses"&&F.statuses.length&&F.statuses.indexOf(statusOf(j))<0)return false;
  if(skip!=="settings"&&F.settings.length&&F.settings.indexOf(settingOf(j))<0)return false;
  if(F.hot&&!j.hot)return false;
  if(F.reg==="notyet"&&(j.reg==="required"||statusOf(j)==="search"))return false;
  if(F.reg==="registered"&&j.reg==="eligible"&&!(j.creds&&j.creds.length))return false;
  if(F.newgrad&&!j.newgrad)return false;
  if(F.recent&&!isNew(j))return false;
  if(F.maxd!=="any"){var d=distOf(j);if(d==null||d>+F.maxd)return false}
  return true;
}
function chipCounts(){
  [["cmods","mods",function(j,v){return (j.mods||[]).indexOf(v)>-1}],["cregions","regions",function(j,v){return j.region===v}],
   ["cstates","states",function(j,v){return stateKey(j)===v}],["ctypes","types",function(j,v){return j.type===v}],
   ["cstatus","statuses",function(j,v){return statusOf(j)===v}],["csetting","settings",function(j,v){return settingOf(j)===v}]].forEach(function(g){
    var pool=DATA.jobs.filter(function(j){return matches(j,g[1])});
    qsa(".chip",$(g[0])).forEach(function(c){c.querySelector(".n").textContent=pool.filter(function(j){return g[2](j,c.dataset.v)}).length});
  });
}

/* ---------- summary tiles ---------- */
function tiles(){
  var all=DATA.jobs.filter(function(j){return !hidden[j.id]});
  var a=ANCHORS[F.anchor]||ANCHORS[0];
  var near=all.filter(function(j){var d=distOf(j);return d!=null&&d<=60}).length;
  var only=function(o){return JSON.stringify({regions:F.regions,states:F.states,mods:F.mods,types:F.types,reg:F.reg,newgrad:F.newgrad,recent:F.recent,maxd:F.maxd,q:F.q,shortlist:F.shortlist,statuses:F.statuses,settings:F.settings,hot:F.hot,st:F.st})===JSON.stringify(Object.assign({regions:[],states:[],mods:[],types:[],reg:"any",newgrad:false,recent:false,maxd:"any",q:"",shortlist:false,statuses:[],settings:[],hot:false,st:""},o))};
  var big=[
    ["all","lead",all.length,"Listings",only({})],
    ["near","",near,"Within 60 miles of "+a[0].replace(", White Plains",""),only({maxd:"60"})],
    ["ng","ng",all.filter(function(j){return j.newgrad}).length,"New grad friendly",only({newgrad:true})],
    ["re","re",all.filter(function(j){return j.reg!=="required"&&statusOf(j)!=="search"}).length,"Open to candidates not yet registered",only({reg:"notyet"})],
    ["hot","hot",all.filter(function(j){return j.hot}).length,"Hot Jobs",only({hot:true})],
    ["new","",all.filter(isNew).length,"Added in the last 7 days",only({recent:true})]
  ];
  $("tilesBig").innerHTML=big.map(function(t){return '<button type="button" class="tile '+t[1]+'" data-tile="'+t[0]+'" aria-pressed="'+t[4]+'"><span class="num">'+t[2]+'</span><span class="cap">'+esc(t[3])+'</span></button>'}).join("");
  $("tilesState").innerHTML=STATES.map(function(s){var n=all.filter(function(j){return stateKey(j)===s[0]}).length;return '<button type="button" class="tile" data-tile="st:'+s[0]+'" aria-pressed="'+only({states:[s[0]]})+'"><span class="num">'+n+'</span><span class="cap">'+esc(s[1])+'</span></button>'}).join("");
  $("tilesSet").innerHTML=SETTINGS.map(function(s){var n=all.filter(function(j){return settingOf(j)===s[0]}).length;return '<button type="button" class="tile" data-tile="se:'+s[0]+'" aria-pressed="'+only({settings:[s[0]]})+'"><span class="num">'+n+'</span><span class="cap">'+esc(s[1])+'</span></button>'}).join("");
  $("tilesStatus").innerHTML=STATUS.map(function(s){var n=all.filter(function(j){return statusOf(j)===s[0]}).length;return '<button type="button" class="tile st-'+s[0]+'" data-tile="ss:'+s[0]+'" aria-pressed="'+only({statuses:[s[0]]})+'"><span class="num">'+n+'</span><span class="cap">'+esc(s[1])+'</span></button>'}).join("");
  $("tilesMod").innerHTML=MODS.map(function(m){var n=all.filter(function(j){return (j.mods||[]).indexOf(m[0])>-1}).length;return '<button type="button" class="tile" data-tile="md:'+m[0]+'" aria-pressed="'+only({mods:[m[0]]})+'"><span class="num">'+n+'</span><span class="cap">'+esc(MODLONG[m[0]])+'</span></button>'}).join("");
}
document.querySelector(".dash").addEventListener("click",function(e){
  var t=e.target.closest("[data-tile]");if(!t)return;
  var k=t.dataset.tile,was=t.getAttribute("aria-pressed")==="true";
  resetF();
  if(!was){
    if(k==="near")F.maxd="60";else if(k==="ng")F.newgrad=true;else if(k==="re")F.reg="notyet";else if(k==="hot")F.hot=true;else if(k==="new"){F.recent=true;F.sort="new"}
    else if(k.indexOf("st:")===0)F.states=[k.slice(3)];else if(k.indexOf("md:")===0)F.mods=[k.slice(3)];
    else if(k.indexOf("se:")===0)F.settings=[k.slice(3)];else if(k.indexOf("ss:")===0)F.statuses=[k.slice(3)];
  }
  shown=PAGE;syncInputs();render();
  var o=$("openings");if(o&&o.scrollIntoView)o.scrollIntoView({behavior:"smooth",block:"start"});
});

/* ---------- job card ---------- */
var STBADGE={verified:'<span class="sbadge s-verified">✓ Verified with employer</span>',unverified:'<span class="sbadge s-unverified">Third party · not verified</span>',search:'<span class="sbadge s-search">Saved search</span>'};
function card(j){
  var d=distOf(j),b=d==null?null:band(d),st=statusOf(j);
  var tags=(st==="search"?'':'<span class="tag reg-'+esc(j.reg||"unstated")+'">'+esc(REG[j.reg]||REG.unstated)+'</span>')+(j.newgrad?'<span class="tag newgrad">New grad friendly</span>':'')+
    (j.mods||[]).map(function(m){return '<span class="tag">'+esc(MODLONG[m]||m)+'</span>'}).join("")+
    (j.creds||[]).map(function(c){return '<span class="tag cred">'+esc(c)+'</span>'}).join("");
  var facts='';
  if(j.type)facts+='<dt>Type</dt><dd>'+esc(j.type)+'</dd>';
  if(j.shift)facts+='<dt>Schedule</dt><dd>'+esc(j.shift)+'</dd>';
  if(j.pay)facts+='<dt>Pay</dt><dd>'+esc(j.pay)+'</dd>';
  facts+='<dt>Setting</dt><dd>'+esc((SETTINGS.filter(function(s){return s[0]===settingOf(j)})[0]||["",""])[1])+'</dd>';
  var url=safeUrl(j.url),eurl=safeUrl(j.employerUrl),on=stars.indexOf(j.id)>-1,age=daysSince(j.checked||j.added);
  var foot=st==="verified"?'Added '+esc(fmtDate(j.added))+(j.checked&&j.checked!==j.added?' · confirmed open '+esc(fmtDate(j.checked)):'')+(j.source?' · '+esc(j.source):'')
    :st==="unverified"?'Found '+esc(fmtDate(j.added))+(j.source?' on '+esc(j.source):'')+' · not yet checked by CURE'
    :'Saved search'+(j.source?' on '+esc(j.source):'')+' · results change daily';
  var btn=st==="search"?'Open search results ↗':'View job and apply ↗';
  return '<article class="job st-'+st+(j.hot?' hotcard':'')+'">'+
    '<div class="badges">'+STBADGE[st]+(j.hot?'<span class="sbadge s-hot">🔥 Hot Job</span>':'')+(isNew(j)?'<span class="new">NEW</span>':'')+'</div>'+
    '<div class="top"><div style="min-width:0"><span class="band '+(b?b[2]:"b5")+'"><i></i>'+(b?b[1]:"Location varies")+'</span>'+
    '<h3>'+esc(j.title)+'</h3><div class="emp">'+esc(j.employer)+(j.facility&&j.facility!==j.employer?' · '+esc(j.facility):'')+'</div>'+
    '<div class="loc">'+esc(j.city)+(j.state?', '+esc(j.state):'')+'</div></div>'+
    (d!=null?'<span class="dist" title="Approximate straight line distance from '+esc((ANCHORS[F.anchor]||ANCHORS[0])[0])+'">≈ '+Math.round(d)+' mi</span>':'')+'</div>'+
    '<div class="tags">'+tags+'</div>'+(facts?'<dl class="facts">'+facts+'</dl>':'')+
    (j.notes?'<p class="note">'+esc(j.notes)+'</p>':'')+
    (st==="unverified"?'<p class="old">Not confirmed by CURE. Open the posting and confirm it is still accepting applications.</p>':'')+
    (st==="verified"&&age>45?'<p class="old">Last confirmed open more than 45 days ago. Check the posting before you apply.</p>':'')+
    '<div class="actions">'+(url?'<a class="btn'+(st==="search"?' ghost':'')+'" href="'+esc(url)+'" target="_blank" rel="noopener">'+btn+'</a>':'')+
    '<button type="button" class="star" data-star="'+esc(j.id)+'" aria-pressed="'+on+'">'+(on?'★ Saved':'☆ Save')+'</button>'+
    (eurl&&eurl!==url?'<a class="linkbtn" href="'+esc(eurl)+'" target="_blank" rel="noopener">All openings at this employer</a>':'')+'</div>'+
    '<div class="added">'+foot+'</div></article>';
}
/* ---------- hot jobs ---------- */
function renderHot(){
  var hot=DATA.jobs.filter(function(j){return j.hot&&!hidden[j.id]});
  var el=$("hotjobs");if(!hot.length){el.hidden=true;return}
  var g={};hot.forEach(function(j){var k=j.hotGroup||j.employer;(g[k]=g[k]||[]).push(j)});
  var keys=Object.keys(g).sort();
  el.hidden=false;
  el.innerHTML='<div class="hothead"><span class="eyebrow">Featured employers</span><h2>🔥 Hot Jobs</h2><p>Openings at major health systems, grouped by employer. Hot means featured, not a guarantee the posting is open; each card shows how CURE checked it.</p></div>'+
    '<div class="hotgroups">'+keys.map(function(k){var items=g[k];items.forEach(function(j){j._d=distOf(j)});items.sort(function(a,b){return (a._d==null?1e9:a._d)-(b._d==null?1e9:b._d)});
      return '<details class="hotgrp"><summary><b>'+esc(k)+'</b><span class="hcount">'+items.length+(items.length===1?' job':' jobs')+'</span></summary><div class="grid">'+items.map(card).join("")+'</div></details>'}).join("")+'</div>'+
    '<div class="more"><button class="btn gold" type="button" data-hotall="1">Show all Hot Jobs in the list below</button></div>';
}
$("hotjobs").addEventListener("click",function(e){
  if(e.target.closest("[data-hotall]")){resetF();F.hot=true;shown=PAGE;syncInputs();render();var o=$("openings");if(o&&o.scrollIntoView)o.scrollIntoView({behavior:"smooth",block:"start"});return}
  var s=e.target.closest("[data-star]");if(!s)return;
  var id=s.dataset.star,i=stars.indexOf(id);if(i>-1)stars.splice(i,1);else stars.push(id);
  qsa('[data-star="'+id.replace(/"/g,'')+'"]').forEach(function(x){x.setAttribute("aria-pressed",String(i<0));x.textContent=i<0?"★ Saved":"☆ Save"});persist();
});
function render(){
  persist();stateOptions();tiles();chipCounts();renderHot();
  var list=DATA.jobs.filter(function(j){return matches(j)});
  list.forEach(function(j){j._d=distOf(j)});
  var RANK={verified:0,unverified:1,search:2};
  function bi(j){if(j._d==null)return 99;for(var i=0;i<BANDS.length;i++){if(j._d<=BANDS[i][0])return i}return 99}
  list.sort(F.sort==="new"?function(a,b){return String(b.added||"").localeCompare(String(a.added||""))||RANK[statusOf(a)]-RANK[statusOf(b)]||((a._d==null?1e9:a._d)-(b._d==null?1e9:b._d))}
    :function(a,b){return bi(a)-bi(b)||RANK[statusOf(a)]-RANK[statusOf(b)]||((a._d==null?1e9:a._d)-(b._d==null?1e9:b._d))});
  var total=DATA.jobs.filter(function(j){return !hidden[j.id]}).length;
  var nv=list.filter(function(j){return statusOf(j)==="verified"}).length;
  $("count").innerHTML=list.length+(list.length===1?' listing':' listings')+'<small>of '+total+' · '+nv+' verified with employer</small>';
  $("updatedLine").textContent="Updated "+fmtDate(DATA.updated)+" by CURE Career Services. Every listing is labeled by how it was checked.";
  if(!total){
    $("results").innerHTML='<div class="empty"><h3>Openings are on their way</h3><p>CURE checks every posting before it appears here. While this list fills, the live job search in the Career toolkit covers every major board.</p><button class="btn ghost" type="button" data-goto="toolkit">Open the Career toolkit</button></div>';
  } else if(!list.length){
    $("results").innerHTML='<div class="empty"><h3>No openings match these filters</h3><p>Widen the distance, remove a specialty, or switch the registry filter. The live job search in the Career toolkit covers postings that are not listed here.</p><button class="btn ghost" type="button" data-clear="1">Clear all filters</button></div>';
  } else {
    $("results").innerHTML='<div class="grid">'+list.slice(0,shown).map(card).join("")+'</div>'+
      (list.length>shown?'<div class="more"><button class="btn ghost" type="button" data-more="1">Show '+Math.min(PAGE,list.length-shown)+' more of '+(list.length-shown)+' remaining</button></div>':'');
  }
}
$("results").addEventListener("click",function(e){
  if(e.target.closest("[data-clear]")){clearFilters();return}
  if(e.target.closest("[data-more]")){shown+=PAGE;render();return}
  var g=e.target.closest("[data-goto]");if(g){showView(g.dataset.goto);return}
  var s=e.target.closest("[data-star]");if(!s)return;
  var id=s.dataset.star,i=stars.indexOf(id);if(i>-1)stars.splice(i,1);else stars.push(id);
  qsa('[data-star="'+id.replace(/"/g,'')+'"]').forEach(function(x){x.setAttribute("aria-pressed",String(i<0));x.textContent=i<0?"★ Saved":"☆ Save"});persist();
  if(F.shortlist)render();
});

/* ================= toolkit ================= */
var BOARDS=[
  ["Indeed","Largest volume of postings",function(q,l,r){return "https://www.indeed.com/jobs?q="+encodeURIComponent(q)+"&l="+encodeURIComponent(l)+"&radius="+r},1],
  ["LinkedIn Jobs","Jobs and recruiters",function(q,l){return "https://www.linkedin.com/jobs/search/?keywords="+encodeURIComponent(q)+"&location="+encodeURIComponent(l)}],
  ["Glassdoor","Jobs and employer reviews",function(q,l){return "https://www.glassdoor.com/Job/jobs.htm?sc.keyword="+encodeURIComponent(q)+"&locKeyword="+encodeURIComponent(l)}],
  ["ZipRecruiter","Job alerts",function(q,l){return "https://www.ziprecruiter.com/jobs-search?search="+encodeURIComponent(q)+"&location="+encodeURIComponent(l)}],
  ["Vivian Health","Healthcare and travel roles",function(q,l){return "https://www.vivian.com/allied/jobs/?search="+encodeURIComponent(q)}],
  ["SimplyHired","Job search",function(q,l){return "https://www.simplyhired.com/search?q="+encodeURIComponent(q)+"&l="+encodeURIComponent(l)}],
  ["Monster","Job search",function(q,l){return "https://www.monster.com/jobs/search?q="+encodeURIComponent(q)+"&where="+encodeURIComponent(l)}],
  ["CareerBuilder","Job search",function(q,l){return "https://www.careerbuilder.com/jobs?keywords="+encodeURIComponent(q)+"&location="+encodeURIComponent(l)}],
  ["ARDMS Ultrasound Jobs","Registry job board",function(q,l){return "https://ultrasoundjobs.ardms.org/jobs/?keywords="+encodeURIComponent(q)+"&location="+encodeURIComponent(l)}],
  ["USAJOBS","VA and federal hospitals",function(q,l){return "https://www.usajobs.gov/Search/Results?k="+encodeURIComponent(q)+"&l="+encodeURIComponent(l)}]
];
var SPEC=[["sonographer","All ultrasound"],["diagnostic medical sonographer","General / abdominal"],["OB GYN sonographer","OB/GYN"],["vascular technologist","Vascular"],["echocardiographer","Echocardiography"],["breast sonographer","Breast"],["pediatric sonographer","Pediatric"],["musculoskeletal sonographer","Musculoskeletal"],["travel sonographer","Travel"]];
var EMPLOYERS=[
  ["Westchester & Hudson Valley",[
    ["NewYork-Presbyterian","Hudson Valley, Lawrence, Westchester","https://careers.nyp.org/us/en"],
    ["White Plains Hospital (Montefiore Einstein)","White Plains and outpatient sites","https://montefiore.wd12.myworkdayjobs.com/WP"],
    ["Montefiore Einstein Advanced Care","Westchester and Bronx practices","https://montefiore.wd12.myworkdayjobs.com/MEAC"],
    ["Westchester Medical Center Health Network","Valhalla, MidHudson, HealthAlliance","https://wmchealthjobs.org/search-jobs/"],
    ["St. John's Riverside Hospital","Yonkers, Dobbs Ferry","https://careers-riversidehealth.icims.com/jobs"],
    ["Northwell Health","Phelps, Northern Westchester and more","https://jobs.northwell.edu/"],
    ["Optum NY","Mount Kisco, Katonah, Poughkeepsie, Rockland","https://careers.unitedhealthgroup.com/"],
    ["Garnet Health","Middletown, Harris, Catskill","https://careers.garnethealth.org/jobs"]]],
  ["New York City",[
    ["Mount Sinai Health System","Manhattan, Brooklyn, Queens","https://careers.mountsinai.org/home"],
    ["NYU Langone Health","Manhattan, Brooklyn, Long Island","https://jobs.nyulangone.org/"],
    ["NYC Health + Hospitals","Public hospitals, all boroughs","https://www.nychealthandhospitals.org/careers/working-at-nyc-health-hospitals/"],
    ["RadNet","Lenox Hill Radiology and NJ imaging centers","https://careers.radnet.com/careers-home/jobs"]]],
  ["Long Island",[
    ["Catholic Health","Six Long Island hospitals","https://jobs.chsli.org/"],
    ["Stony Brook Medicine","Stony Brook, Southampton, Eastern LI","https://www.stonybrookmedicine.edu/careers/apply"],
    ["NYU Langone Hospital Long Island","Mineola, Garden City, Patchogue","https://jobs.nyulangone.org/"]]],
  ["New Jersey",[
    ["Hackensack Meridian Health","Hackensack, Edison, Shore region","https://jobs.hackensackmeridianhealth.org/"],
    ["RWJBarnabas Health","Central and northern NJ","https://www.rwjbh.org/careers/"],
    ["Atlantic Health System","Morristown, Overlook, Rockaway","https://careers-atlantichealth.icims.com/jobs"]]],
  ["Connecticut",[
    ["Yale New Haven Health","Greenwich, Bridgeport, New Haven","https://jobs.ynhhs.org/search/jobs"],
    ["Hartford HealthCare","St. Vincent's Bridgeport, Hartford region","https://www.hhccareers.org/us/en"],
    ["Stamford Health","Stamford Hospital and practices","https://www.stamfordhealth.org/careers/"],
    ["Northwell Health","Danbury, Norwalk, New Milford","https://jobs.northwell.edu/"]]],
  ["Nationwide and relocation",[
    ["VA and federal hospitals","Through USAJOBS","https://www.usajobs.gov/Search/Results?k=sonographer"],
    ["HCA Healthcare","Hospitals in many states","https://careers.hcahealthcare.com/"],
    ["Optum / UnitedHealth Group","Practices nationwide","https://careers.unitedhealthgroup.com/"],
    ["Cleveland Clinic","Ohio, Florida and more","https://jobs.clevelandclinic.org/"]]]
];
var openKit=store("kit")||{live:true};
function kitSec(id,title,sub,body){return '<details class="kit" data-kit="'+id+'"'+(openKit[id]?' open':'')+'><summary><div><b>'+title+'</b><span>'+sub+'</span></div></summary><div class="body">'+body+'</div></details>'}
$("kit").innerHTML=
  kitSec("start","Start your search","Search terms and habits that work",
    '<p>Do not rely on one website or one posting. Check hospital career sites, outpatient imaging companies and two or three job boards every week, and set alerts so new postings reach you first.</p>'+
    '<div class="terms">'+["sonographer","ultrasound technologist","diagnostic medical sonographer","vascular technologist","vascular sonographer","RVT","echocardiographer","cardiac sonographer","OB/GYN sonographer","ultrasound technician"].map(function(t){return '<code>'+t+'</code>'}).join("")+'</div>'+
    '<p>Apply on the employer\'s own site when you can. Postings there are current, and your application goes straight to the hiring department.</p>')+
  kitSec("live","Live job search","Any city or state, any specialty, every major board",
    '<div class="launch"><div class="fgroup"><label for="lloc">City and state, or a state</label><input id="lloc" type="text" placeholder="White Plains, NY"></div>'+
    '<div class="fgroup"><label for="lrole">Specialty</label><select id="lrole">'+SPEC.map(function(s){return '<option value="'+esc(s[0])+'">'+esc(s[1])+'</option>'}).join("")+'</select></div>'+
    '<div class="fgroup"><label for="lrad">Radius (Indeed)</label><select id="lrad"><option value="15">15 miles</option><option value="25">25 miles</option><option value="50" selected>50 miles</option><option value="100">100 miles</option></select></div></div>'+
    '<div class="launch-x"><label class="toggle"><input type="checkbox" id="lnew"> Add "new grad"</label><label class="toggle"><input type="checkbox" id="lelig"> Add "registry eligible"</label></div>'+
    '<div class="boards" id="boardlinks"></div><p class="qtext" id="qtext"></p>')+
  kitSec("social","Social media job offers","Hiring posts on Instagram and TikTok",
    '<p>Recruiters and imaging practices often post openings on social media before job boards. Tap a hashtag to browse recent posts. Results include content other than job offers, and nothing there is checked by CURE.</p>'+
    '<div class="social">'+SOCIAL.map(function(s){return '<div><h3>'+esc(s[0])+'</h3><div class="terms">'+s[1].map(function(t){return '<a class="htag" target="_blank" rel="noopener" href="'+esc(s[2](t))+'">#'+esc(t)+'</a>'}).join("")+'</div></div>'}).join("")+'</div>')+
  kitSec("emp","Employer career sites","Hospital systems and imaging companies, by region",'<div class="emps" id="emplist"></div>')+
  kitSec("dist","Distance guide","How the colored distance bands are set",
    '<p>Each opening shows its approximate straight line distance from the place you choose under "Measure distance from." Driving time varies with route and traffic.</p>'+
    '<div class="bandkey">'+BANDS.map(function(b,i){var lo=i?BANDS[i-1][0]+1:0;return '<div class="band '+b[2]+'"><b><i></i> '+b[1]+'</b><span>'+(b[0]>1e8?lo+'+ miles':lo+' to '+b[0]+' miles')+'</span></div>'}).join("")+'</div>')+
  kitSec("cred","Reading the credential line","What registry wording in a posting means for you",
    '<div class="creds"><div><h4>Registration required</h4><p>You must hold the credential when you start. Common listings: <code>RDMS</code>, <code>RVT</code>, <code>RDCS</code> (ARDMS); <code>RCS</code>, <code>RVS</code> (CCI); <code>RT(S)</code>, <code>RT(VS)</code> (ARRT).</p></div>'+
    '<div><h4>Registry eligible accepted</h4><p>The employer will hire you before you pass, provided you are eligible to sit for the examination and earn the credential within the stated window, often 6 to 18 months. Confirm the deadline before you apply.</p></div>'+
    '<div><h4>Credential not stated</h4><p>The posting does not say. Read the full description and ask the recruiter directly before you assume either way.</p></div></div>')+
  kitSec("hired","When you are hired","What to tell Career Services",
    '<p>Tell Career Services the employer, your job title, your start date and a phone number for the employer. CURE verifies employment with the employer or with your signed attestation, as accreditation reporting requires. Your information is used only for graduate outcome records.</p>');
qsa("details.kit").forEach(function(d){d.addEventListener("toggle",function(){openKit[d.dataset.kit]=d.open;store("kit",openKit)})});
function launcher(){
  var role=$("lrole").value,q=role+($("lnew").checked?" new grad":"")+($("lelig").checked?" registry eligible":"");
  var l=$("lloc").value.trim()||"White Plains, NY",r=$("lrad").value;
  $("boardlinks").innerHTML=BOARDS.map(function(b){return '<a class="board'+(b[3]?' primary':'')+'" target="_blank" rel="noopener" href="'+esc(b[2](q,l,r))+'"><b>'+esc(b[0])+' ↗</b><span>'+esc(b[1])+'</span></a>'}).join("");
  $("qtext").textContent='Searching "'+q+'" near '+l+'. Vivian Health opens a nationwide search; set the location there.';
  store("launch",{role:role,loc:$("lloc").value,rad:r,nw:$("lnew").checked,el:$("lelig").checked});
}
(function(){var s=store("launch");if(s){$("lrole").value=s.role||"sonographer";$("lloc").value=s.loc||"";$("lrad").value=s.rad||"50";$("lnew").checked=!!s.nw;$("lelig").checked=!!s.el}})();
["lrole","lrad","lnew","lelig"].forEach(function(id){$(id).addEventListener("change",launcher)});
$("lloc").addEventListener("input",launcher);
launcher();
$("emplist").innerHTML=EMPLOYERS.map(function(g){return '<div><h3>'+esc(g[0])+'</h3><ul>'+g[1].map(function(e){return '<li><a href="'+esc(e[2])+'" target="_blank" rel="noopener"><b>'+esc(e[0])+' ↗</b><span>'+esc(e[1])+'</span></a></li>'}).join("")+'</ul></div>'}).join("");
function renderContact(){var c=DATA.contact||{};$("contact").innerHTML='<b>'+esc(c.office||"Career Services")+'</b><p>'+esc(c.where||"")+'</p><p>'+esc(c.how||"")+'</p>'}
renderContact();
render();
/* ---- fetch the latest listings ---- */
function refreshData(){
  if(!window.fetch)return;
  fetch(JOBS_SOURCE,{cache:"no-cache"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
    if(!d||!Array.isArray(d.jobs))return;
    if(String(d.updated)>=String(DATA.updated)){DATA=d;try{localStorage.setItem("cure-jobs:data",JSON.stringify(d))}catch(e){};renderContact();render()}
  }).catch(function(){ if(!navigator.onLine)$("updatedLine").textContent+=" Offline: showing the last listings saved on this device." });
}
refreshData();
document.addEventListener("visibilitychange",function(){if(!document.hidden)refreshData()});
/* ---- install ---- */
var deferred=null,ib=$("installbar");
var standalone=(window.navigator.standalone===true)||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches);
var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
function showInstall(html){if(standalone||store("installDismissed"))return;ib.innerHTML=html+'<button type="button" class="linkbtn" id="ib-x">Not now</button>';ib.hidden=false;
  $("ib-x").addEventListener("click",function(){ib.hidden=true;store("installDismissed",1)})}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;
  showInstall('<span><b>Install CURE Jobs</b> on this device for one tap access.</span><button type="button" class="btn sm gold" id="ib-go">Install</button>');
  $("ib-go").addEventListener("click",function(){ib.hidden=true;deferred.prompt();deferred.userChoice.then(function(){deferred=null})})});
if(ios&&!standalone)showInstall('<span><b>Install CURE Jobs:</b> tap the Share button, then <b>Add to Home Screen</b>.</span>');
if("serviceWorker" in navigator)window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});

/* ================= resume builder ================= */
var R0={name:"",city:"",phone:"",email:"",link:"",regStatus:"",spi:"",creds:"",bls:false,posType:"",area:"",env:"",priority:"",start:"",relocate:"",travel:"",extra:"",
  level:"student",skills:"",exams:[{n:"",r:""}],equip:"",sites:[{site:"",loc:"",dates:"",hours:"",desc:""}],program:"Diagnostic Medical Sonography",gradDate:"",awards:"",otherEdu:"",related:"",refFmt:"request",refs:""};
var R=Object.assign({},R0,store("resume")||{});
if(!R.exams||!R.exams.length)R.exams=[{n:"",r:""}];if(!R.sites||!R.sites.length)R.sites=[{site:"",loc:"",dates:"",hours:"",desc:""}];
var POL=store("polish")||null;
function sel(k,opts){return '<select id="r-'+k+'" data-k="'+k+'">'+opts.map(function(o){return '<option value="'+esc(o[0])+'"'+(R[k]===o[0]?' selected':'')+'>'+esc(o[1])+'</option>'}).join("")+'</select>'}
function inp(k,ph,type){return '<input id="r-'+k+'" data-k="'+k+'" type="'+(type||"text")+'" value="'+esc(R[k])+'" placeholder="'+esc(ph||"")+'">'}
function area(k,ph){return '<textarea id="r-'+k+'" data-k="'+k+'" placeholder="'+esc(ph||"")+'">'+esc(R[k])+'</textarea>'}
function fld(k,label,ctl,full){return '<div class="fgroup'+(full?' full':'')+'"><label for="r-'+k+'">'+label+'</label>'+ctl+'</div>'}
function sec(n,title,body){return '<section class="rsec"><h3><small>'+n+'</small>'+title+'</h3>'+body+'</section>'}
var RATE=[["","Rate 1 to 10"]].concat([10,9,8,7,6,5,4,3,2,1].map(function(n){return [String(n),String(n)+(n>=8?" · minimal assistance":n>=5?" · with supervision":" · assisted")]}));
function exRows(){return R.exams.map(function(e,i){return '<div class="exrow"><input type="text" aria-label="Examination '+(i+1)+'" data-ex="'+i+'" data-f="n" value="'+esc(e.n)+'" placeholder="Examination, e.g. Carotid duplex"><select aria-label="Skill level '+(i+1)+'" data-ex="'+i+'" data-f="r">'+RATE.map(function(o){return '<option value="'+o[0]+'"'+(e.r===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join("")+'</select><button type="button" class="btn sm ghost" data-rm-ex="'+i+'">Remove</button></div>'}).join("")}
function siteRows(){return R.sites.map(function(s,i){return '<div class="siteblk"><div class="rgrid">'+
  '<div class="fgroup"><label for="s'+i+'-site">Clinical site or employer</label><input id="s'+i+'-site" type="text" data-site="'+i+'" data-f="site" value="'+esc(s.site)+'" placeholder="Facility name"></div>'+
  '<div class="fgroup"><label for="s'+i+'-loc">City, state</label><input id="s'+i+'-loc" type="text" data-site="'+i+'" data-f="loc" value="'+esc(s.loc)+'" placeholder="Valhalla, NY"></div>'+
  '<div class="fgroup"><label for="s'+i+'-dates">Dates</label><input id="s'+i+'-dates" type="text" data-site="'+i+'" data-f="dates" value="'+esc(s.dates)+'" placeholder="April 2026 to October 2026"></div>'+
  '<div class="fgroup"><label for="s'+i+'-hours">Clinical hours</label><input id="s'+i+'-hours" type="text" data-site="'+i+'" data-f="hours" value="'+esc(s.hours)+'" placeholder="900"></div></div>'+
  '<div class="fgroup"><label for="s'+i+'-desc">Describe what you did</label><textarea id="s'+i+'-desc" data-site="'+i+'" data-f="desc" placeholder="Write it naturally, one task per line or in sentences. Example: I scanned abdomen, renal, thyroid, carotids and DVT studies. I positioned patients, explained exams and worked with sonographers and radiologists.">'+esc(s.desc)+'</textarea></div>'+
  (R.sites.length>1?'<div><button type="button" class="btn sm ghost" data-rm-site="'+i+'">Remove this site</button></div>':'')+'</div>'}).join("")}
function drawForm(){
  $("rform").innerHTML=
  sec("1","Contact information",'<div class="rgrid">'+fld("name","Full name",inp("name","First and last name"))+fld("city","City, state",inp("city","White Plains, NY"))+fld("phone","Phone",inp("phone","(914) 555-0123","tel"))+fld("email","Professional email",inp("email","name@email.com","email"))+'</div>'+fld("link","LinkedIn (optional)",inp("link","linkedin.com/in/yourname")))+
  sec("2","Registry and credential status",'<p class="callout">Registry status belongs near the top of a sonographer\'s resume. List only credentials you have earned.</p><div class="rgrid">'+
    fld("regStatus","Registry status",sel("regStatus",[["","Select status"],["registered","Registered (credential earned)"],["spi","SPI passed, specialty examination next"],["eligible","Registry eligible now"],["upon","Eligible upon program completion"]]))+
    fld("spi","SPI examination",sel("spi",[["","Select status"],["passed","Passed"],["scheduled","Scheduled"],["none","Not yet taken"]]))+'</div>'+
    fld("creds","Credentials earned",inp("creds","Example: RDMS (AB), RVT"))+'<label class="toggle"><input type="checkbox" id="r-bls" data-k="bls"'+(R.bls?' checked':'')+'> Current BLS / CPR (American Heart Association)</label>')+
  sec("3","Objective and availability",'<div class="rgrid">'+
    fld("posType","Position type",sel("posType",[["","Select"],["full time","Full time"],["part time","Part time"],["per diem","Per diem"],["any","Open to any schedule"]]))+
    fld("area","Ultrasound area of interest",sel("area",[["","Select"],["general","General ultrasound"],["obgyn","OB/GYN ultrasound"],["vascular","Vascular ultrasound"],["echo","Echocardiography"],["genvasc","General and vascular ultrasound"],["open","Open to all areas"]]))+
    fld("env","Preferred setting",sel("env",[["","No preference"],["hospital","Hospital"],["outpatient","Outpatient imaging center"],["office","Physician practice"],["mfm","Maternal fetal medicine"]]))+
    fld("priority","Most important in your first position",sel("priority",[["","Select"],["mentor","Mentorship from experienced sonographers"],["variety","A broad range of examinations"],["registry","Support for earning registry credentials"],["patients","High quality, patient centered care"],["growth","Long term growth with one employer"]]))+
    fld("start","Earliest start date",inp("start","October 26, 2026"))+
    fld("relocate","Willing to relocate?",sel("relocate",[["","Select"],["yes","Yes"],["no","No"]]))+
    fld("travel","Open to travel positions?",sel("travel",[["","Select"],["yes","Yes"],["no","No"]]))+'</div>'+
    fld("extra","Anything else for the objective? (optional)",area("extra","Example: I especially enjoy vascular studies and want a role that includes both general and vascular ultrasound.")))+
  sec("4","Career level",fld("level","Current career level",sel("level",[["student","Current student"],["newgrad","New graduate"],["experienced","Experienced sonographer"]]))+'<p class="callout">Students and new graduates use an Objective. A Professional Summary replaces it once you have paid sonography experience.</p>')+
  sec("5","Ultrasound skills",fld("skills","Studies and skills, separated by commas or lines",area("skills","Abdomen, renal, thyroid, aorta, carotid, lower extremity venous, DVT, venous reflux, peripheral arterial, color Doppler, spectral Doppler")))+
  sec("6","Clinical proficiency",'<p class="callout">Add each examination you performed and rate your current supervised skill level. The number never appears; the builder turns it into accurate wording.</p><div id="exrows" style="display:flex;flex-direction:column;gap:8px">'+exRows()+'</div><button type="button" class="btn ghost wide" id="add-ex">+ Add another examination</button>')+
  sec("7","Ultrasound equipment",fld("equip","Machines and systems, with manufacturer and model when known",area("equip","GE LOGIQ E10, Philips EPIQ, Siemens Acuson Sequoia, PACS")))+
  sec("8","Ultrasound experience",'<p class="callout">Clinical externship belongs here, clearly labeled as supervised clinical experience.</p><div id="siterows" style="display:flex;flex-direction:column;gap:10px">'+siteRows()+'</div><button type="button" class="btn ghost wide" id="add-site">+ Add another site</button>')+
  sec("9","Ultrasound education",'<div class="rgrid">'+fld("program","CURE program",sel("program",[["Diagnostic Medical Sonography","Diagnostic Medical Sonography"],["Vascular Technology","Vascular Technology"],["Echocardiography","Echocardiography"]]))+fld("gradDate","Graduation date (or expected)",inp("gradDate","October 2026"))+'</div><p class="status">Listed as Center for Ultrasound Research and Education (CURE), White Plains, NY.</p>')+
  sec("10","Awards and honors",fld("awards","Only honors actually received, one per line",area("awards","Perfect attendance, Quarter 6")))+
  sec("11","Other education",fld("otherEdu","Degrees, colleges or certifications, one per line",area("otherEdu","Associate of Science, Biology, Westchester Community College, 2022")))+
  sec("12","Other related experience",fld("related","Prior healthcare or related work",area("related","Medical assistant, ABC Family Practice, 2021 to 2024. Roomed patients, took vital signs, documented histories.")))+
  sec("13","References",fld("refFmt","Reference format",sel("refFmt",[["request","Available upon request"],["list","List references"],["omit","Leave off the resume"]]))+fld("refs","Professional references (when listing them)",area("refs","Jane Smith, RDMS, RVT\nClinical Preceptor, Hospital Name\n(914) 555-0100")));
}
drawForm();
function saveR(){store("resume",R)}
$("rform").addEventListener("input",function(e){
  var t=e.target;
  if(t.dataset.k){R[t.dataset.k]=t.type==="checkbox"?t.checked:t.value}
  else if(t.dataset.ex!=null){R.exams[+t.dataset.ex][t.dataset.f]=t.value}
  else if(t.dataset.site!=null){R.sites[+t.dataset.site][t.dataset.f]=t.value}
  saveR();renderResume();
});
$("rform").addEventListener("change",function(e){var t=e.target;if(t.tagName==="SELECT"||t.type==="checkbox"){t.dispatchEvent(new Event("input",{bubbles:true}))}});
$("rform").addEventListener("click",function(e){
  var t=e.target;
  if(t.id==="add-ex"){R.exams.push({n:"",r:""});$("exrows").innerHTML=exRows();var l=qsa("#exrows input");if(l.length)l[l.length-1].focus()}
  else if(t.dataset.rmEx!=null){R.exams.splice(+t.dataset.rmEx,1);if(!R.exams.length)R.exams=[{n:"",r:""}];$("exrows").innerHTML=exRows()}
  else if(t.id==="add-site"){R.sites.push({site:"",loc:"",dates:"",hours:"",desc:""});$("siterows").innerHTML=siteRows()}
  else if(t.dataset.rmSite!=null){R.sites.splice(+t.dataset.rmSite,1);$("siterows").innerHTML=siteRows()}
  else return;
  saveR();renderResume();
});
$("rform").addEventListener("submit",function(e){e.preventDefault()});

/* ---- wording ---- */
var FIX=[[/\bdoppler\b/gi,"Doppler"],[/\bdvt\b/gi,"DVT"],[/\brvt\b/gi,"RVT"],[/\brdms\b/gi,"RDMS"],[/\bpacs\b/gi,"PACS"],[/\bob\s*\/\s*gyn\b/gi,"OB/GYN"],[/\bmfm\b/gi,"MFM"],[/\btee\b/gi,"TEE"],[/\babi\b/gi,"ABI"],[/\bpvr\b/gi,"PVR"],[/\bekg\b/gi,"EKG"],[/\bbls\b/gi,"BLS"],[/\bcpr\b/gi,"CPR"],[/\bhipaa\b/gi,"HIPAA"],[/\bspi\b/gi,"SPI"]];
function fix(s){FIX.forEach(function(f){s=s.replace(f[0],f[1])});return s}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function lines(s){return String(s||"").split(/\n+/).map(function(x){return x.trim()}).filter(Boolean)}
function list(s){return String(s||"").split(/[\n,;]+/).map(function(x){return fix(x.trim())}).filter(Boolean)}
function tidyBullets(s){
  var parts=[];String(s||"").replace(/([.!?])\s+/g,"$1\n").split(/\n+/).forEach(function(p){p=p.trim().replace(/^[-•*]\s*/,"");if(p)parts.push(p)});
  return parts.map(function(p){
    p=p.replace(/^(i|we)\s+(have\s+|also\s+|was\s+able\s+to\s+)?/i,"").replace(/[.;]+$/,"");
    return fix(cap(p));
  }).filter(Boolean);
}
var AREA={general:"general ultrasound",obgyn:"OB/GYN ultrasound",vascular:"vascular ultrasound",echo:"echocardiography",genvasc:"general and vascular ultrasound",open:"diagnostic ultrasound"};
var ENV={hospital:"hospital",outpatient:"outpatient imaging",office:"physician practice",mfm:"maternal fetal medicine"};
var PRI={mentor:" where I can continue developing alongside experienced sonographers",variety:" that offers a broad range of examinations",registry:" that supports earning additional registry credentials",patients:" focused on high quality, patient centered care",growth:" with long term opportunity for growth"};
function objective(){
  var a=AREA[R.area]||"diagnostic ultrasound",typ=(R.posType&&R.posType!=="any")?R.posType+" ":"",env=ENV[R.env]?" in a "+ENV[R.env]+" setting":"",pri=PRI[R.priority]||"";
  var creds=R.creds.trim(),who;
  if(R.level==="experienced")who=(creds?"Registered sonographer ("+fix(creds)+")":"Sonographer")+" with clinical experience in "+a+",";
  else{who=(R.level==="newgrad"?"Recent graduate":"Student")+" of the "+R.program+" program at the Center for Ultrasound Research and Education (CURE)";
    if(R.regStatus==="registered"&&creds)who+=", "+fix(creds)+",";else if(R.regStatus==="eligible"||R.regStatus==="spi")who+=", registry eligible,";}
  var s=who+" seeking a "+typ+(AREA[R.area]?a+" ":"sonography ")+"position"+env+pri+".";
  var av=[];if(R.start.trim())av.push("Available to start "+R.start.trim()+".");
  if(R.relocate==="yes")av.push("Open to relocation.");if(R.travel==="yes")av.push("Open to travel assignments.");
  var ex=R.extra.trim();if(ex){ex=fix(cap(ex.replace(/^i\s+/i,"I ")));if(!/[.!?]$/.test(ex))ex+=".";}
  return [s.replace(/\s+/g," ")].concat(av).concat(ex?[ex]:[]).join(" ");
}
function proficiency(){
  var ex=R.exams.filter(function(e){return e.n.trim()&&e.r});
  var exp=R.level==="experienced";
  var tiers=exp?[[8,"Independently performs"],[5,"Performs"],[1,"Familiar with"]]:[[8,"Performs with minimal assistance under clinical supervision"],[5,"Performs with direct supervision"],[1,"Assisted with and observed"]];
  var out=[];tiers.forEach(function(t,i){var hi=i?tiers[i-1][0]-1:10;var names=ex.filter(function(e){var r=+e.r;return r>=t[0]&&r<=hi}).map(function(e){return fix(e.n.trim())});if(names.length)out.push(t[1]+": "+names.join(", "))});
  return out;
}
function polishKey(){return JSON.stringify([objective(),R.sites.map(function(s){return s.desc}),R.related,R.level])}

/* ---- model: one structure drives preview, copy text and Word file ---- */
function model(){
  var M=[],P=(POL&&POL.key===polishKey())?POL:null;
  var creds=R.creds.trim()?fix(R.creds.trim()):"";
  var nm=R.name.trim();if(!nm&&!R.city&&!R.email&&!R.phone)return [];
  M.push({t:"name",x:(nm||"Your Name")+(R.regStatus==="registered"&&creds?", "+creds:"")});
  M.push({t:"contact",x:[R.city,R.phone,R.email,R.link].map(function(x){return String(x||"").trim()}).filter(Boolean).join("  |  ")});
  var rc=[];
  if(R.regStatus==="registered"&&creds)rc.push("Registered: "+creds);
  else if(R.regStatus==="spi")rc.push("ARDMS Sonography Principles and Instrumentation (SPI) examination passed; specialty examination pending");
  else if(R.regStatus==="eligible")rc.push("Registry eligible"+(creds?"; credentials earned: "+creds:""));
  else if(R.regStatus==="upon")rc.push("Registry eligible upon program completion");
  else if(creds)rc.push("Credentials: "+creds);
  if(R.spi==="passed"&&R.regStatus!=="spi")rc.push("ARDMS SPI examination: passed");
  if(R.spi==="scheduled")rc.push("ARDMS SPI examination: scheduled");
  if(R.bls)rc.push("BLS / CPR, American Heart Association, current");
  if(rc.length){M.push({t:"h",x:"Registry and Credentials"});M.push({t:"ul",items:rc})}
  var obj=P?P.objective:objective();
  if(R.posType||R.area||R.env||R.priority||R.start||R.extra||R.regStatus){M.push({t:"h",x:R.level==="experienced"?"Professional Summary":"Objective"});M.push({t:"p",x:obj})}
  var sk=list(R.skills).map(cap);if(sk.length){M.push({t:"h",x:"Ultrasound Skills"});M.push({t:"p",x:sk.join("  •  ")})}
  var pr=proficiency();if(pr.length){M.push({t:"h",x:"Clinical Proficiency"});M.push({t:"ul",items:pr})}
  var eq=list(R.equip);if(eq.length){M.push({t:"h",x:"Ultrasound Equipment"});M.push({t:"p",x:eq.join(", ")})}
  var sites=R.sites.filter(function(s){return s.site.trim()||s.desc.trim()});
  if(sites.length){M.push({t:"h",x:"Ultrasound Experience"});
    R.sites.forEach(function(s,i){if(!(s.site.trim()||s.desc.trim()))return;
      M.push({t:"sub",x:(s.site.trim()||"Clinical site")+(s.loc.trim()?", "+s.loc.trim():""),r:s.dates.trim()});
      var lab=R.level==="experienced"?"":"Supervised Clinical Externship";var hrs=s.hours.trim()?(lab?" · ":"")+s.hours.trim().replace(/\s*hours?$/i,"")+" clinical hours":"";
      if(lab||hrs)M.push({t:"meta",x:lab+hrs});
      var b=P&&P.sites&&P.sites[i]?P.sites[i]:tidyBullets(s.desc);if(b.length)M.push({t:"ul",items:b});
    });}
  M.push({t:"h",x:"Ultrasound Education"});
  M.push({t:"sub",x:"Center for Ultrasound Research and Education (CURE), White Plains, NY",r:R.gradDate.trim()?(R.level==="student"?"Expected "+R.gradDate.trim():R.gradDate.trim()):""});
  M.push({t:"p",x:R.program+" Program"});
  var aw=lines(R.awards);if(aw.length){M.push({t:"h",x:"Awards and Honors"});M.push({t:"ul",items:aw.map(fix)})}
  var oe=lines(R.otherEdu);if(oe.length){M.push({t:"h",x:"Other Education"});M.push({t:"ul",items:oe})}
  var rel=P&&P.related&&P.related.length?P.related:tidyBullets(R.related);if(rel.length){M.push({t:"h",x:"Related Experience"});M.push({t:"ul",items:rel})}
  if(R.refFmt==="request"){M.push({t:"h",x:"References"});M.push({t:"p",x:"Professional references available upon request."})}
  else if(R.refFmt==="list"&&R.refs.trim()){M.push({t:"h",x:"References"});R.refs.split(/\n\s*\n/).forEach(function(b){var l=lines(b);if(l.length)M.push({t:"ref",items:l})})}
  return M;
}
function toHtml(M){
  if(!M.length)return '<p class="ph">Start with your name and contact details. Your resume builds here as you type.</p>';
  return M.map(function(b){
    if(b.t==="name")return '<div class="nm">'+esc(b.x)+'</div>';
    if(b.t==="contact")return '<div class="ct">'+esc(b.x)+'</div>';
    if(b.t==="h")return '<div class="hd">'+esc(b.x)+'</div>';
    if(b.t==="p")return '<p>'+esc(b.x)+'</p>';
    if(b.t==="ul")return '<ul>'+b.items.map(function(i){return '<li>'+esc(i)+'</li>'}).join("")+'</ul>';
    if(b.t==="sub")return '<p style="display:flex;justify-content:space-between;gap:12px;margin-top:6px"><span class="sub">'+esc(b.x)+'</span><span>'+esc(b.r||"")+'</span></p>';
    if(b.t==="meta")return '<p class="meta">'+esc(b.x)+'</p>';
    if(b.t==="ref")return '<p>'+b.items.map(esc).join("<br>")+'</p>';
    return "";
  }).join("");
}
function toText(M){
  return M.map(function(b){
    if(b.t==="name")return b.x.toUpperCase();
    if(b.t==="contact")return b.x;
    if(b.t==="h")return "\n"+b.x.toUpperCase();
    if(b.t==="ul")return b.items.map(function(i){return "• "+i}).join("\n");
    if(b.t==="sub")return b.x+(b.r?"    "+b.r:"");
    if(b.t==="ref")return b.items.join("\n");
    return b.x;
  }).join("\n");
}
function xmlEsc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function run(t,o){o=o||{};return '<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>'+(o.b?'<w:b/>':'')+(o.i?'<w:i/>':'')+(o.color?'<w:color w:val="'+o.color+'"/>':'')+'<w:sz w:val="'+(o.sz||21)+'"/></w:rPr><w:t xml:space="preserve">'+xmlEsc(t)+'</w:t></w:r>'}
function para(inner,o){o=o||{};return '<w:p><w:pPr>'+(o.border?'<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="1" w:color="14245C"/></w:pBdr>':'')+(o.tabs?'<w:tabs><w:tab w:val="right" w:pos="10080"/></w:tabs>':'')+'<w:spacing w:before="'+(o.before||0)+'" w:after="'+(o.after==null?40:o.after)+'"/>'+(o.ind?'<w:ind w:left="300" w:hanging="200"/>':'')+(o.center?'<w:jc w:val="center"/>':'')+'</w:pPr>'+inner+'</w:p>'}
function toDocxXml(M){
  var body=M.map(function(b){
    if(b.t==="name")return para(run(b.x,{b:1,sz:34}),{center:1,after:20});
    if(b.t==="contact")return para(run(b.x,{sz:19,color:"4A5068"}),{center:1,after:80});
    if(b.t==="h")return para(run(b.x.toUpperCase(),{b:1,sz:21,color:"14245C"}),{border:1,before:180,after:60});
    if(b.t==="p")return para(run(b.x));
    if(b.t==="ul")return b.items.map(function(i){return para(run("•  "+i),{ind:1,after:20})}).join("");
    if(b.t==="sub")return para(run(b.x,{b:1})+(b.r?'<w:r><w:tab/></w:r>'+run(b.r):''),{tabs:1,before:80,after:10});
    if(b.t==="meta")return para(run(b.x,{i:1,color:"4A5068"}),{after:30});
    if(b.t==="ref")return b.items.map(function(l,k){return para(run(l),{after:k===b.items.length-1?100:0})}).join("");
    return "";
  }).join("");
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+
    '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1008" w:right="1080" w:bottom="1008" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>';
}
function msg(t,kind){var m=$("rb-msg");if(!t){m.hidden=true;return}m.hidden=false;m.className="msg"+(kind?" "+kind:"");m.textContent=t}
function renderResume(){
  $("paper").innerHTML=toHtml(model());
  if(POL&&POL.key!==polishKey()&&!$("rb-msg").hidden&&/Claude/.test($("rb-msg").textContent))msg("You changed your entries, so the preview shows the builder's wording again. Polish again to update it.");
}
renderResume();
$("rb-copy").addEventListener("click",function(){
  var txt=toText(model());if(!txt){msg("Add your details first.","err");return}
  var box=$("rb-copybox");
  function fallback(){box.hidden=false;box.value=txt;box.focus();box.select();msg("Copying is blocked here. The text is selected below; press Ctrl+C or Cmd+C.")}
  try{navigator.clipboard.writeText(txt).then(function(){box.hidden=true;msg("Copied. Paste it into Word or Google Docs.","ok")},fallback)}catch(e){fallback()}
});
$("rb-clear").addEventListener("click",function(){
  var b=this;if(b.dataset.armed!=="1"){b.dataset.armed="1";b.textContent="Click again to clear everything";setTimeout(function(){b.dataset.armed="";b.textContent="Clear"},4000);return}
  b.dataset.armed="";b.textContent="Clear";R=JSON.parse(JSON.stringify(R0));POL=null;store("polish",null);saveR();drawForm();renderResume();msg("Cleared.");
});

if(window.JSZip)$("rb-docx").hidden=false;
$("rb-docx").addEventListener("click",function(){
  var M=model();if(!M.length){msg("Add your details first.","err");return}
  var z=new window.JSZip();
  z.file("[Content_Types].xml",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  z.file("_rels/.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  z.file("word/document.xml",toDocxXml(M));
  var fn=(R.name.trim()||"Resume").replace(/[^A-Za-z0-9]+/g,"_").replace(/^_|_$/g,"")+"_Resume.docx";
  z.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}).then(function(blob){
    var u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=fn;document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(u)},4000);msg("Saved "+fn+". Check your Downloads or Files app.","ok");
  }).catch(function(){msg("The Word file could not be created. Use Copy text instead.","err")});
});
})();
