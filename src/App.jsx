import { useState, useEffect, useRef } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

const TYPES = ["All","Sports","Arts","STEM","Outdoor","Academic","Dance","Music"];
const AGES  = ["All Ages","4-6","7-9","10-12","13-15","16+"];
const COSTS = ["Any Cost","Free","Under $200/wk","$200-$400/wk","$400-$600/wk","$600+/wk"];
const TIMES = ["Any Schedule","Full Day (8h+)","Half Day","Extended Care","Before Care","After Care"];

const TYPE_STYLE = {
  Sports:  {bg:"#DBEAFE",fg:"#1E40AF",dot:"#3B82F6"},
  Arts:    {bg:"#FCE7F3",fg:"#9D174D",dot:"#EC4899"},
  STEM:    {bg:"#EDE9FE",fg:"#5B21B6",dot:"#8B5CF6"},
  Outdoor: {bg:"#D1FAE5",fg:"#065F46",dot:"#10B981"},
  Academic:{bg:"#E0E7FF",fg:"#3730A3",dot:"#6366F1"},
  Dance:   {bg:"#FFE4E6",fg:"#9F1239",dot:"#F43F5E"},
  Music:   {bg:"#CCFBF1",fg:"#134E4A",dot:"#14B8A6"},
};

const CAMPS = [
  {id:1,name:"Arizona Science Center Camp",org:"Arizona Science Center",type:"STEM",ages:"5-14",cost:"$250/wk",costNum:250,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"600 E Washington St, Phoenix",lat:33.4484,lng:-112.0669,desc:"Hands-on STEM camps with themed weeks: robotics, chemistry, and space exploration. All levels welcome.",schedule:"Mon–Fri, 9am–3pm",web:"https://azscience.org",phone:"(602) 716-2000",extras:"Scholarships offered",extCare:true,beforeCare:true,afterCare:true,featured:true,registrationOpen:true,reviews:[{name:"Jennifer M.",rating:5,text:"My daughter loved the robotics week — instructors were incredible!",childAge:"10",date:"Aug 2024"},{name:"Tom K.",rating:4,text:"Great curriculum, worth every penny.",childAge:"8",date:"Jul 2024"}]},
  {id:2,name:"Phoenix Parks Summer Camp",org:"City of Phoenix Parks & Rec",type:"Outdoor",ages:"6-13",cost:"$60/wk",costNum:60,dates:"June 9 – July 25",startDate:"2025-06-09",endDate:"2025-07-25",address:"Multiple Phoenix Parks",lat:33.4651,lng:-112.0794,desc:"Affordable city-run camps with outdoor activities, sports, arts & crafts, and field trips across Phoenix.",schedule:"Mon–Fri, 7:30am–5:30pm",web:"https://phoenix.gov/parks",phone:"(602) 262-6861",extras:"Financial assistance available",extCare:true,beforeCare:true,afterCare:true,featured:true,registrationOpen:true,reviews:[{name:"Maria L.",rating:5,text:"Best value in Phoenix! My kids went 3 summers in a row.",childAge:"7",date:"Aug 2024"}]},
  {id:3,name:"Code Ninjas Summer Camp",org:"Code Ninjas Arcadia",type:"STEM",ages:"7-14",cost:"$350/wk",costNum:350,dates:"June 9 – Aug 8",startDate:"2025-06-09",endDate:"2025-08-08",address:"3902 E Thomas Rd, Phoenix",lat:33.4794,lng:-111.9990,desc:"Kids build their own video games using Scratch, JavaScript, and Roblox Studio. No experience needed.",schedule:"Mon–Fri, 9am–3pm",web:"https://codeninjas.com",phone:"(602) 555-0199",extras:"Beginner to advanced",extCare:false,beforeCare:false,afterCare:false,featured:false,registrationOpen:false,reviews:[{name:"Ashley T.",rating:5,text:"My son built his own game in one week. He talks about it constantly!",childAge:"9",date:"Jun 2024"}]},
  {id:4,name:"Desert Sky Soccer Camp",org:"Desert Sky FC",type:"Sports",ages:"5-16",cost:"$199/wk",costNum:199,dates:"June 2 – Aug 1",startDate:"2025-06-02",endDate:"2025-08-01",address:"Reach 11 Sports Complex, Phoenix",lat:33.6445,lng:-112.0184,desc:"Professional coaching for all skill levels with weekly age-grouped training in a fun environment.",schedule:"Mon–Fri, 8am–12pm",phone:"(602) 555-0182",extras:"Jersey + sibling discounts",extCare:false,beforeCare:false,afterCare:false,featured:false,registrationOpen:true,reviews:[{name:"David R.",rating:4,text:"Good coaching staff. My son improved a lot over 2 weeks.",childAge:"11",date:"Jul 2024"}]},
  {id:5,name:"Valley Youth Theatre",org:"VYT",type:"Music",ages:"6-18",cost:"$375/wk",costNum:375,dates:"June 2 – July 25",startDate:"2025-06-02",endDate:"2025-07-25",address:"525 N 1st St, Phoenix",lat:33.4523,lng:-112.0707,desc:"Musical theatre training in voice, movement, and acting. Campers perform in a full production.",schedule:"Mon–Fri, 9am–3pm",web:"https://vyt.com",phone:"(602) 253-8188",extras:"Scholarships available. Alumni include Emma Stone!",extCare:false,beforeCare:false,afterCare:false,featured:true,registrationOpen:false,reviews:[{name:"Rachel P.",rating:5,text:"My daughter has done this 4 years in a row. Highlight of her summer!",childAge:"13",date:"Aug 2024"}]},
  {id:6,name:"Young Artists Summer Studio",org:"Scottsdale Museum of Contemporary Art",type:"Arts",ages:"7-14",cost:"$320/wk",costNum:320,dates:"June 16 – July 18",startDate:"2025-06-16",endDate:"2025-07-18",address:"7374 E 2nd St, Scottsdale",lat:33.4942,lng:-111.9261,desc:"Immersive visual arts camp exploring painting, sculpture, and mixed media. New theme each week.",schedule:"Mon–Fri, 9am–12pm or 1pm–4pm",extras:"All materials included",extCare:false,beforeCare:false,afterCare:false,featured:false,registrationOpen:true,reviews:[]},
  {id:7,name:"YMCA Summer Day Camp",org:"Valley of the Sun YMCA",type:"Outdoor",ages:"5-15",cost:"$175/wk",costNum:175,dates:"June 2 – Aug 8",startDate:"2025-06-02",endDate:"2025-08-08",address:"Multiple YMCA locations",lat:33.5092,lng:-112.1268,desc:"Classic summer camp with swimming, sports, field trips, and character-building activities.",schedule:"Mon–Fri, 7am–6pm",web:"https://valleyofthesunymca.org",phone:"(602) 264-9011",extras:"Swim lessons included",extCare:true,beforeCare:true,afterCare:true,featured:true,registrationOpen:true,reviews:[{name:"Christine W.",rating:4,text:"Reliable, safe, and affordable. My kids have gone 3 years and love it.",childAge:"6",date:"Jul 2024"}]},
  {id:8,name:"Phoenix Children's Theatre",org:"Phoenix Theatre Company",type:"Arts",ages:"8-17",cost:"$425/wk",costNum:425,dates:"June 23 – July 11",startDate:"2025-06-23",endDate:"2025-07-11",address:"1825 N Central Ave, Phoenix",lat:33.4793,lng:-112.0740,desc:"Professional theater training in acting, singing, and dance. Ends with a family showcase.",schedule:"Mon–Fri, 9am–4pm",web:"https://phoenixtheatre.com",extras:"Costumes provided",extCare:false,beforeCare:false,afterCare:false,featured:false,registrationOpen:false,reviews:[]},
  {id:9,name:"Challenger Multi-Sport Camp",org:"Challenger Sports",type:"Sports",ages:"3-14",cost:"$180/wk",costNum:180,dates:"June 9 – Aug 1",startDate:"2025-06-09",endDate:"2025-08-01",address:"Various Phoenix fields",lat:33.5722,lng:-112.0893,desc:"International coaching staff with fun, skills-focused soccer and multi-sport sessions.",schedule:"Mon–Fri, 9am–12pm or 2pm–5pm",web:"https://challengersports.com",extras:"Ball + backpack included",extCare:false,beforeCare:false,afterCare:false,featured:false,registrationOpen:true,reviews:[]},
  {id:10,name:"YMCA Dance & Cheer Camp",org:"Valley of the Sun YMCA",type:"Dance",ages:"5-14",cost:"$190/wk",costNum:190,dates:"June 9 – July 25",startDate:"2025-06-09",endDate:"2025-07-25",address:"Multiple YMCA locations",lat:33.4901,lng:-112.1100,desc:"High-energy dance and cheer covering hip-hop, jazz, and cheerleading. Ends with a family performance.",schedule:"Mon–Fri, 9am–12pm",web:"https://valleyofthesunymca.org",extras:"Before/after care available",extCare:true,beforeCare:true,afterCare:true,featured:false,registrationOpen:false,reviews:[]},
];

// ── Helpers ───────────────────────────────────────────────────────────────
const avg = r => r.length ? (r.reduce((s,x)=>s+x.rating,0)/r.length).toFixed(1) : null;

const parseCost = (cost,f) => {
  if(f==="Any Cost") return true;
  const n=parseInt((cost||"").replace(/[^0-9]/g,""));
  if(f==="Free") return n===0;
  if(f==="Under $200/wk") return n<200;
  if(f==="$200-$400/wk") return n>=200&&n<=400;
  if(f==="$400-$600/wk") return n>400&&n<=600;
  if(f==="$600+/wk") return n>600;
  return true;
};
const ageMatch = (a,f) => {
  if(f==="All Ages") return true;
  const [fMin,fMax]=f.split("-").map(Number);
  const [cMin,cMax]=(a||"").split("-").map(Number);
  return cMin<=(fMax||fMin)&&(cMax||cMin)>=fMin;
};
const timeMatch = (c,f) => {
  if(f==="Any Schedule") return true;
  if(f==="Extended Care") return c.extCare;
  if(f==="Before Care") return c.beforeCare;
  if(f==="After Care") return c.afterCare;
  if(f==="Full Day (8h+)") return /7am|7:30|8am|full/i.test(c.schedule||"");
  if(f==="Half Day") return /12pm|half|noon/i.test(c.schedule||"");
  return true;
};

const getCampUrl = id => `${window.location.href.split("?")[0]}?camp=${id}`;
const getHighlightedId = () => { try { return parseInt(new URLSearchParams(window.location.search).get("camp"))||null; } catch { return null; } };

// ── iCal export ───────────────────────────────────────────────────────────
const exportToICal = (camp) => {
  const fmt = d => d.replace(/-/g,"");
  const uid = `campful-${camp.id}-${Date.now()}@campful.app`;
  const ical = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Campful//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${fmt(camp.startDate||"2025-06-02")}`,
    `DTEND;VALUE=DATE:${fmt(camp.endDate||"2025-08-08")}`,
    `SUMMARY:${camp.name}`,
    `DESCRIPTION:${camp.desc}\\nSchedule: ${camp.schedule||""}\\nCost: ${camp.cost||""}\\nWebsite: ${camp.web||""}\\nPhone: ${camp.phone||""}`,
    `LOCATION:${camp.address}`,
    "STATUS:CONFIRMED",
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ical], {type:"text/calendar;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${camp.name.replace(/[^a-z0-9]/gi,"_")}.ics`;
  a.click(); URL.revokeObjectURL(url);
};

const exportAllToICal = (savedCamps) => {
  const fmt = d => d.replace(/-/g,"");
  const events = savedCamps.map(camp => [
    "BEGIN:VEVENT",
    `UID:campful-${camp.id}-${Date.now()}@campful.app`,
    `DTSTART;VALUE=DATE:${fmt(camp.startDate||"2025-06-02")}`,
    `DTEND;VALUE=DATE:${fmt(camp.endDate||"2025-08-08")}`,
    `SUMMARY:${camp.name}`,
    `DESCRIPTION:${camp.desc}\\nSchedule: ${camp.schedule||""}\\nCost: ${camp.cost||""}`,
    `LOCATION:${camp.address}`,
    "STATUS:CONFIRMED",
    "TRANSP:TRANSPARENT",
    "END:VEVENT"
  ].join("\r\n")).join("\r\n");
  const ical = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Campful//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n${events}\r\nEND:VCALENDAR`;
  const blob = new Blob([ical], {type:"text/calendar;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="campful_summer_schedule.ics";
  a.click(); URL.revokeObjectURL(url);
};

// ── Styles ────────────────────────────────────────────────────────────────
const S = {
  input: {width:"100%",border:"1.5px solid #E8DDD3",borderRadius:10,padding:"9px 13px",fontSize:13,fontFamily:"'DM Sans',sans-serif",background:"#FFFDF9",color:"#2D1810",boxSizing:"border-box",outline:"none"},
  btn: (active,color="#C1440E") => ({padding:"8px 16px",borderRadius:20,border:active?"none":"1.5px solid #E8DDD3",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.15s",background:active?color:"#FFFDF9",color:active?"white":"#7C6257"}),
  pill: (active,ts) => ({padding:"7px 14px",borderRadius:20,border:"none",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap",background:active?(ts?.dot||"#C1440E"):"#FFFDF9",color:active?"white":"#7C6257",boxShadow:active?`0 3px 10px ${ts?.dot||"#C1440E"}55`:"0 1px 3px rgba(0,0,0,0.06)",border:active?"none":"1.5px solid #E8DDD3",transform:active?"translateY(-1px)":"none"}),
};

// ── Stars ─────────────────────────────────────────────────────────────────
const Stars = ({rating,interactive=false,onRate,size=18}) => {
  const [hover,setHover]=useState(0);
  return <span style={{display:"inline-flex",gap:1}}>
    {[1,2,3,4,5].map(s=>(
      <span key={s} onClick={()=>interactive&&onRate&&onRate(s)} onMouseEnter={()=>interactive&&setHover(s)} onMouseLeave={()=>interactive&&setHover(0)}
        style={{fontSize:size,cursor:interactive?"pointer":"default",color:(hover||rating)>=s?"#F59E0B":"#E5E7EB",lineHeight:1}}>★</span>
    ))}
  </span>;
};

// ── Alert Modal ───────────────────────────────────────────────────────────
const AlertModal = ({camp, onClose}) => {
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);
  const subject = encodeURIComponent(`Alert me when ${camp.name} opens registration`);
  const body = encodeURIComponent(`Hi,\n\nPlease notify me when registration opens for:\n\n${camp.name}\n${camp.org||""}\n${camp.dates}\n${camp.address}\n\nMy email: ${email}\n\nThanks!`);
  const mailto = camp.web ? `mailto:info@${camp.web.replace("https://","").replace("http://","").split("/")[0]}?subject=${subject}&body=${body}` : null;

  const handleAlert = () => {
    if(!email.trim()||!email.includes("@")){alert("Please enter a valid email.");return;}
    // In a real app this would hit a backend. For now we open mailto or show confirmation.
    if(mailto) window.open(mailto,"_blank");
    setSent(true);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(45,24,16,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#FFFDF9",borderRadius:20,padding:28,width:"100%",maxWidth:420,boxShadow:"0 30px 80px rgba(45,24,16,0.25)"}}>
        {!sent ? <>
          <div style={{fontSize:36,marginBottom:8}}>🔔</div>
          <h3 style={{margin:"0 0 4px",fontSize:20,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1810"}}>Registration Alert</h3>
          <p style={{margin:"0 0 6px",fontSize:14,fontWeight:600,color:"#2D1810",fontFamily:"'DM Sans',sans-serif"}}>{camp.name}</p>
          <p style={{margin:"0 0 20px",fontSize:13,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>
            {camp.registrationOpen
              ? "🟢 Registration is currently open! Visit the website to sign up now."
              : "Registration isn't open yet. Enter your email and we'll send you a draft alert email to forward to the camp directly."}
          </p>
          {camp.registrationOpen ? (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {camp.web&&<a href={camp.web} target="_blank" rel="noopener noreferrer" style={{display:"block",padding:"12px 0",borderRadius:12,background:"#C1440E",color:"white",textAlign:"center",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",textDecoration:"none"}}>Register Now →</a>}
              <button onClick={onClose} style={{...S.btn(false),width:"100%",padding:"11px 0",borderRadius:12}}>Close</button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:600,color:"#7C6257",marginBottom:5,fontFamily:"'DM Sans',sans-serif"}}>YOUR EMAIL</label>
                <input style={S.input} type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
              </div>
              <p style={{margin:0,fontSize:11,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>💡 This will open your email app with a pre-filled message to the camp asking to be notified when registration opens.</p>
              <div style={{display:"flex",gap:8}}>
                <button onClick={onClose} style={{...S.btn(false),flex:1,padding:"11px 0",borderRadius:12}}>Cancel</button>
                <button onClick={handleAlert} style={{...S.btn(true),flex:1,padding:"11px 0",borderRadius:12}}>Send Alert Request</button>
              </div>
            </div>
          )}
        </> : (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <h3 style={{margin:"0 0 8px",fontSize:20,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1810"}}>Alert set!</h3>
            <p style={{margin:"0 0 20px",fontSize:13,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>Your email app should have opened with a pre-filled message. Once registration opens, you'll be first to know!</p>
            <button onClick={onClose} style={{...S.btn(true),width:"100%",padding:"12px 0",borderRadius:12,fontSize:13}}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Schedule Builder ──────────────────────────────────────────────────────
const ScheduleBuilder = ({savedCamps, allCamps, onToggleSave, onClose}) => {
  const totalCost = savedCamps.reduce((s,c)=>s+(c.costNum||0),0);
  const MONTHS = ["June","July","August"];
  const WEEKS = [
    {label:"June 2–6",start:"2025-06-02"},{label:"June 9–13",start:"2025-06-09"},
    {label:"June 16–20",start:"2025-06-16"},{label:"June 23–27",start:"2025-06-23"},
    {label:"July 7–11",start:"2025-07-07"},{label:"July 14–18",start:"2025-07-14"},
    {label:"July 21–25",start:"2025-07-21"},{label:"July 28–Aug 1",start:"2025-07-28"},
    {label:"Aug 4–8",start:"2025-08-04"},
  ];

  const campForWeek = (week) => savedCamps.find(c => {
    if(!c.startDate||!c.endDate) return false;
    return week.start >= c.startDate && week.start <= c.endDate;
  });

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(45,24,16,0.6)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:200,padding:16,overflowY:"auto",backdropFilter:"blur(4px)"}}>
      <div style={{background:"#FFFDF9",borderRadius:20,width:"100%",maxWidth:680,boxShadow:"0 30px 80px rgba(45,24,16,0.25)",margin:"auto",overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#C1440E,#F59E0B)",padding:"24px 28px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <h2 style={{margin:"0 0 4px",fontSize:24,fontWeight:900,fontFamily:"'Fraunces',serif",color:"white"}}>📅 Summer Schedule</h2>
              <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.85)",fontFamily:"'DM Sans',sans-serif"}}>Build your family's perfect summer plan</p>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"white",borderRadius:10,padding:"6px 12px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>✕ Close</button>
          </div>
          {savedCamps.length>0&&(
            <div style={{marginTop:16,display:"flex",gap:16,flexWrap:"wrap"}}>
              <div style={{background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"8px 14px"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontFamily:"'DM Sans',sans-serif"}}>CAMPS SAVED</div>
                <div style={{fontSize:20,fontWeight:900,color:"white",fontFamily:"'Fraunces',serif"}}>{savedCamps.length}</div>
              </div>
              <div style={{background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"8px 14px"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontFamily:"'DM Sans',sans-serif"}}>EST. TOTAL COST</div>
                <div style={{fontSize:20,fontWeight:900,color:"white",fontFamily:"'Fraunces',serif"}}>${totalCost.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{padding:28}}>
          {/* Calendar grid */}
          <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1810"}}>Weekly View</h3>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
            {WEEKS.map(week=>{
              const camp = campForWeek(week);
              const ts = camp ? TYPE_STYLE[camp.type] : null;
              return (
                <div key={week.label} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:120,fontSize:12,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>{week.label}</div>
                  <div style={{flex:1,borderRadius:10,padding:"10px 14px",background:camp?(ts?.bg||"#F3F4F6"):"#F5EFE8",border:`1.5px solid ${camp?(ts?.dot||"#C1440E"):"#E8DDD3"}`,minHeight:40,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    {camp ? (
                      <>
                        <div>
                          <span style={{fontSize:13,fontWeight:700,color:ts?.fg||"#2D1810",fontFamily:"'DM Sans',sans-serif"}}>{camp.name}</span>
                          <span style={{fontSize:11,color:ts?.fg||"#7C6257",marginLeft:8,fontFamily:"'DM Sans',sans-serif"}}>{camp.type}</span>
                        </div>
                        <button onClick={()=>onToggleSave(camp)} style={{fontSize:11,padding:"4px 10px",borderRadius:8,border:"none",background:"rgba(0,0,0,0.1)",color:ts?.fg||"#2D1810",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Remove</button>
                      </>
                    ) : (
                      <span style={{fontSize:12,color:"#C4B0A5",fontFamily:"'DM Sans',sans-serif"}}>Free week — add a camp below</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saved camps list */}
          {savedCamps.length>0 ? (
            <>
              <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1810"}}>Saved Camps</h3>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                {savedCamps.map(camp=>{
                  const ts=TYPE_STYLE[camp.type]||{};
                  return (
                    <div key={camp.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#F5EFE8",borderRadius:12,border:"1.5px solid #E8DDD3"}}>
                      <span style={{width:10,height:10,borderRadius:"50%",background:ts.dot||"#C1440E",flexShrink:0,display:"inline-block"}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#2D1810",fontFamily:"'DM Sans',sans-serif"}}>{camp.name}</div>
                        <div style={{fontSize:11,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>{camp.dates} · {camp.cost} · {camp.schedule}</div>
                      </div>
                      <button onClick={()=>exportToICal(camp)} style={{...S.btn(false),fontSize:11,padding:"5px 10px",borderRadius:8,flexShrink:0}} title="Export to calendar">📅 iCal</button>
                      <button onClick={()=>onToggleSave(camp)} style={{fontSize:11,padding:"5px 10px",borderRadius:8,border:"none",background:"#FFE4E6",color:"#9F1239",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>✕</button>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>exportAllToICal(savedCamps)} style={{...S.btn(true),flex:1,padding:"12px 0",borderRadius:12,fontSize:13}}>
                  📅 Export All to Calendar
                </button>
              </div>
              <p style={{margin:"8px 0 0",fontSize:11,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif",textAlign:"center"}}>Opens in Apple Calendar, Google Calendar, or Outlook</p>
            </>
          ) : (
            <div style={{textAlign:"center",padding:"24px",background:"#F5EFE8",borderRadius:14,border:"1.5px dashed #D4C5BB"}}>
              <div style={{fontSize:36,marginBottom:8}}>🏕️</div>
              <p style={{margin:"0 0 4px",fontSize:15,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1810"}}>No camps saved yet</p>
              <p style={{margin:0,fontSize:13,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>Hit the bookmark icon on any camp card to add it here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Review Modal ──────────────────────────────────────────────────────────
const ReviewModal = ({camp,onClose,onSubmit}) => {
  const [name,setName]=useState(""); const [rating,setRating]=useState(0);
  const [text,setText]=useState(""); const [childAge,setChildAge]=useState(""); const [year,setYear]=useState("2025");
  const submit = () => {
    if(!name.trim()||!rating||!text.trim()){alert("Please fill in your name, a rating, and a review.");return;}
    onSubmit({name,rating,text,childAge,year,date:new Date().toLocaleDateString()});
    onClose();
  };
  const lbl={display:"block",fontSize:12,fontWeight:600,color:"#7C6257",marginBottom:5,fontFamily:"'DM Sans',sans-serif"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(45,24,16,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#FFFDF9",borderRadius:20,padding:28,width:"100%",maxWidth:440,boxShadow:"0 30px 80px rgba(45,24,16,0.25)"}}>
        <h3 style={{margin:"0 0 4px",fontSize:22,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1810"}}>Leave a Review</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>{camp.name}</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={lbl}>YOUR NAME</label><input style={S.input} placeholder="e.g. Sarah M." value={name} onChange={e=>setName(e.target.value)}/></div>
          <div><label style={lbl}>RATING</label><Stars rating={rating} interactive onRate={setRating} size={28}/>
            {rating>0&&<p style={{margin:"4px 0 0",fontSize:12,color:"#C1440E",fontFamily:"'DM Sans',sans-serif"}}>{["","Poor","Fair","Good","Great","Excellent!"][rating]}</p>}
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={lbl}>CHILD'S AGE</label><input style={S.input} placeholder="e.g. 8" value={childAge} onChange={e=>setChildAge(e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>YEAR</label>
              <select style={S.input} value={year} onChange={e=>setYear(e.target.value)}>
                {["2025","2024","2023","2022"].map(y=><option key={y}>{y}</option>)}</select></div>
          </div>
          <div><label style={lbl}>YOUR REVIEW</label><textarea style={{...S.input,height:90,resize:"none"}} placeholder="What did your child love? How were the staff?" value={text} onChange={e=>setText(e.target.value)}/></div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{...S.btn(false),flex:1,padding:"11px 0",borderRadius:12}}>Cancel</button>
            <button onClick={submit} style={{...S.btn(true),flex:1,padding:"11px 0",borderRadius:12}}>Submit ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Add Camp Modal ────────────────────────────────────────────────────────
const AddCampModal = ({onClose,onAdd}) => {
  const [f,setF]=useState({name:"",org:"",type:"Sports",ages:"",cost:"",costNum:0,dates:"",startDate:"2025-06-02",endDate:"2025-08-08",address:"",desc:"",schedule:"",web:"",phone:"",extras:"",extCare:false,beforeCare:false,afterCare:false});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    if(!f.name.trim()||!f.address.trim()||!f.desc.trim()){alert("Please fill in camp name, address, and description.");return;}
    onAdd({...f,id:Date.now(),reviews:[],featured:false,registrationOpen:false,lat:33.4484+Math.random()*0.3-0.15,lng:-112.0669+Math.random()*0.3-0.15,costNum:parseInt(f.cost.replace(/[^0-9]/g,""))||0});
    onClose();
  };
  const lbl={display:"block",fontSize:12,fontWeight:600,color:"#7C6257",marginBottom:5,fontFamily:"'DM Sans',sans-serif"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(45,24,16,0.6)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:200,padding:16,overflowY:"auto",backdropFilter:"blur(4px)"}}>
      <div style={{background:"#FFFDF9",borderRadius:20,padding:28,width:"100%",maxWidth:520,boxShadow:"0 30px 80px rgba(45,24,16,0.25)",margin:"auto"}}>
        <h3 style={{margin:"0 0 4px",fontSize:22,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1810"}}>Add a Camp 🏕️</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>Know a great camp that's missing? Add it for the community!</p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:2}}><label style={lbl}>CAMP NAME *</label><input style={S.input} placeholder="e.g. Desert Sun Art Camp" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>TYPE</label><select style={S.input} value={f.type} onChange={e=>set("type",e.target.value)}>{TYPES.filter(t=>t!=="All").map(t=><option key={t}>{t}</option>)}</select></div>
          </div>
          <div><label style={lbl}>ORGANIZATION</label><input style={S.input} placeholder="e.g. Phoenix Parks & Rec" value={f.org} onChange={e=>set("org",e.target.value)}/></div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={lbl}>AGE RANGE</label><input style={S.input} placeholder="e.g. 6-12" value={f.ages} onChange={e=>set("ages",e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>COST</label><input style={S.input} placeholder="e.g. $250/wk" value={f.cost} onChange={e=>set("cost",e.target.value)}/></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={lbl}>START DATE</label><input style={S.input} type="date" value={f.startDate} onChange={e=>set("startDate",e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>END DATE</label><input style={S.input} type="date" value={f.endDate} onChange={e=>set("endDate",e.target.value)}/></div>
          </div>
          <div><label style={lbl}>ADDRESS *</label><input style={S.input} placeholder="e.g. 600 E Washington St, Phoenix" value={f.address} onChange={e=>set("address",e.target.value)}/></div>
          <div><label style={lbl}>HOURS / SCHEDULE</label><input style={S.input} placeholder="e.g. Mon–Fri, 9am–3pm" value={f.schedule} onChange={e=>set("schedule",e.target.value)}/></div>
          <div><label style={lbl}>DESCRIPTION *</label><textarea style={{...S.input,height:80,resize:"none"}} placeholder="What makes this camp special?" value={f.desc} onChange={e=>set("desc",e.target.value)}/></div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={lbl}>WEBSITE</label><input style={S.input} placeholder="https://..." value={f.web} onChange={e=>set("web",e.target.value)}/></div>
            <div style={{flex:1}}><label style={lbl}>PHONE</label><input style={S.input} placeholder="(602) 555-0100" value={f.phone} onChange={e=>set("phone",e.target.value)}/></div>
          </div>
          <div><label style={lbl}>EXTRAS / NOTES</label><input style={S.input} placeholder="Lunch included, scholarships, sibling discount..." value={f.extras} onChange={e=>set("extras",e.target.value)}/></div>
          <div><label style={lbl}>CARE OPTIONS</label>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {[["extCare","Extended Care"],["beforeCare","Before Care"],["afterCare","After Care"]].map(([k,l])=>(
                <label key={k} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",color:"#2D1810"}}>
                  <input type="checkbox" checked={f[k]} onChange={e=>set(k,e.target.checked)} style={{width:16,height:16,accentColor:"#C1440E"}}/>{l}
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button onClick={onClose} style={{...S.btn(false),flex:1,padding:"11px 0",borderRadius:12}}>Cancel</button>
            <button onClick={submit} style={{...S.btn(true),flex:1,padding:"11px 0",borderRadius:12}}>Add Camp ✓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Map View ──────────────────────────────────────────────────────────────
const MapView = ({camps,onSelect}) => {
  const ref=useRef(null); const mapRef=useRef(null); const markersRef=useRef([]);
  useEffect(()=>{
    if(!ref.current) return;
    const init=()=>{
      if(mapRef.current) mapRef.current.remove();
      const map=window.L.map(ref.current,{zoomControl:true}).setView([33.4943,-112.0200],11);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
      mapRef.current=map;
      markersRef.current.forEach(m=>m.remove()); markersRef.current=[];
      camps.forEach(camp=>{
        if(!camp.lat||!camp.lng) return;
        const ts=TYPE_STYLE[camp.type]||{dot:"#C1440E"};
        const icon=window.L.divIcon({html:`<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:${ts.dot};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);transform:rotate(-45deg)"></div>`,iconSize:[30,30],iconAnchor:[15,30],className:""});
        const m=window.L.marker([camp.lat,camp.lng],{icon}).addTo(map)
          .bindPopup(`<div style="font-family:'DM Sans',sans-serif;min-width:180px"><div style="font-weight:700;font-size:13px;color:#2D1810;margin-bottom:3px">${camp.name}</div><div style="font-size:11px;color:#7C6257;margin-bottom:5px">${camp.type} · Ages ${camp.ages}</div><div style="font-size:11px;margin-bottom:2px">💰 ${camp.cost||"See website"}</div><div style="font-size:11px;margin-bottom:8px">📅 ${camp.dates||""}</div><button onclick="window._campSel(${camp.id})" style="width:100%;padding:6px;background:#C1440E;color:white;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer">View Details →</button></div>`,{maxWidth:220});
        markersRef.current.push(m);
      });
      window._campSel=id=>onSelect(id);
    };
    if(!window.L){
      const css=document.createElement("link"); css.rel="stylesheet"; css.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(css);
      const js=document.createElement("script"); js.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; js.onload=init; document.head.appendChild(js);
    } else init();
    return()=>{delete window._campSel;};
  },[camps]);
  return (
    <div style={{borderRadius:16,overflow:"hidden",border:"2px solid #E8DDD3"}}>
      <div ref={ref} style={{height:500,width:"100%",background:"#F5EFE8"}}/>
      <div style={{padding:"10px 14px",background:"#FFFDF9",borderTop:"1px solid #E8DDD3",display:"flex",gap:12,flexWrap:"wrap"}}>
        {Object.entries(TYPE_STYLE).map(([t,{dot}])=>(
          <span key={t} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#7C6257",fontFamily:"'DM Sans',sans-serif"}}>
            <span style={{width:9,height:9,borderRadius:"50%",background:dot,display:"inline-block"}}/>{t}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Camp Card ─────────────────────────────────────────────────────────────
const CampCard = ({camp,highlighted,saved,onAddReview,onToggleSave,onShowAlert}) => {
  const [expanded,setExpanded]=useState(highlighted);
  const [showReview,setShowReview]=useState(false);
  const [copied,setCopied]=useState(false);
  const [reviews,setReviews]=useState(camp.reviews||[]);
  const cardRef=useRef(null);
  const rating=avg(reviews);
  const ts=TYPE_STYLE[camp.type]||{bg:"#F3F4F6",fg:"#374151",dot:"#9CA3AF"};
  useEffect(()=>{if(highlighted&&cardRef.current)cardRef.current.scrollIntoView({behavior:"smooth",block:"center"});},[highlighted]);
  const addReview=r=>{const nr=[...reviews,r];setReviews(nr);onAddReview(camp.id,r);};
  const copyLink=()=>{navigator.clipboard.writeText(getCampUrl(camp.id)).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});};

  return (
    <>
      <div ref={cardRef} style={{background:"#FFFDF9",borderRadius:18,border:`2px solid ${highlighted?"#C1440E":"#E8DDD3"}`,overflow:"hidden",transition:"all 0.2s",boxShadow:highlighted?"0 0 0 4px rgba(193,68,14,0.12)":"0 2px 8px rgba(45,24,16,0.06)"}}
        onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(45,24,16,0.12)";e.currentTarget.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.currentTarget.style.boxShadow=highlighted?"0 0 0 4px rgba(193,68,14,0.12)":"0 2px 8px rgba(45,24,16,0.06)";e.currentTarget.style.transform="none";}}>
        <div style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:ts.bg,color:ts.fg,fontFamily:"'DM Sans',sans-serif"}}>{camp.type}</span>
                {camp.featured&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#FFF3CD",color:"#92400E",fontFamily:"'DM Sans',sans-serif"}}>⭐ Popular</span>}
                {camp.registrationOpen
                  ?<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#D1FAE5",color:"#065F46",fontFamily:"'DM Sans',sans-serif"}}>🟢 Open</span>
                  :<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#FEF3C7",color:"#92400E",fontFamily:"'DM Sans',sans-serif"}}>⏳ Coming Soon</span>}
                {camp.extCare&&<span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:"#E0E7FF",color:"#3730A3",fontFamily:"'DM Sans',sans-serif"}}>🕐 Ext. Care</span>}
              </div>
              <h3 style={{margin:0,fontSize:17,fontWeight:900,fontFamily:"'Fraunces',serif",color:"#2D1810",lineHeight:1.25}}>{camp.name}</h3>
              {camp.org&&<p style={{margin:"3px 0 0",fontSize:12,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>{camp.org}</p>}
            </div>
            {rating&&<div style={{textAlign:"right",marginLeft:12,flexShrink:0}}>
              <div style={{fontSize:24,fontWeight:900,color:"#F59E0B",fontFamily:"'Fraunces',serif",lineHeight:1}}>{rating}</div>
              <div style={{fontSize:11,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>{reviews.length} review{reviews.length!==1?"s":""}</div>
            </div>}
          </div>
          <p style={{margin:"0 0 14px",fontSize:13,color:"#5C4A40",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>{camp.desc}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
            {[["👶",`Ages ${camp.ages||"?"}`],["💰",camp.cost||"See website"],["📅",camp.dates||"—"],["📍",camp.address]].map(([icon,txt])=>(
              <div key={icon} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#7C6257",fontFamily:"'DM Sans',sans-serif"}}>
                <span style={{flexShrink:0,fontSize:14}}>{icon}</span>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{txt}</span>
              </div>
            ))}
          </div>
          {/* Action buttons */}
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            <button onClick={()=>setExpanded(!expanded)} style={{...S.btn(false),flex:1,minWidth:80,padding:"9px 0",borderRadius:10,fontSize:12}}>
              {expanded?"Hide ▲":"Details ▼"}
            </button>
            <button onClick={()=>setShowReview(true)} style={{...S.btn(true),flex:2,minWidth:120,padding:"9px 0",borderRadius:10,fontSize:12}}>
              ⭐ Review
            </button>
            <button onClick={()=>onShowAlert(camp)} style={{...S.btn(false),padding:"9px 10px",borderRadius:10,fontSize:12,flexShrink:0}} title="Registration alert">
              🔔
            </button>
            <button onClick={()=>onToggleSave(camp)} style={{padding:"9px 10px",borderRadius:10,border:"1.5px solid #E8DDD3",fontSize:14,cursor:"pointer",background:saved?"#FFF3CD":"#FFFDF9",flexShrink:0,transition:"all 0.15s"}} title={saved?"Remove from schedule":"Save to schedule"}>
              {saved?"🔖":"🏷️"}
            </button>
            <button onClick={copyLink} style={{...S.btn(false),padding:"9px 10px",borderRadius:10,fontSize:12,flexShrink:0}} title="Copy link">
              {copied?"✓":"🔗"}
            </button>
          </div>
          {saved&&<p style={{margin:"8px 0 0",fontSize:11,color:"#C1440E",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>🔖 Saved to your schedule</p>}
        </div>

        {expanded&&(
          <div style={{borderTop:"1.5px solid #E8DDD3",padding:20,background:"#FDF8F4"}}>
            <div style={{fontSize:13,color:"#5C4A40",fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
              {camp.schedule&&<p style={{margin:0}}><strong style={{color:"#2D1810"}}>Schedule:</strong> {camp.schedule}</p>}
              {camp.web&&<p style={{margin:0}}><strong style={{color:"#2D1810"}}>Website:</strong> <a href={camp.web} target="_blank" rel="noopener noreferrer" style={{color:"#C1440E",textDecoration:"none",fontWeight:600}}>{camp.web}</a></p>}
              {camp.phone&&<p style={{margin:0}}><strong style={{color:"#2D1810"}}>Phone:</strong> {camp.phone}</p>}
              {camp.extras&&<p style={{margin:0}}><strong style={{color:"#2D1810"}}>Extras:</strong> {camp.extras}</p>}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              <button onClick={()=>exportToICal(camp)} style={{...S.btn(false),fontSize:12,padding:"8px 14px",borderRadius:10}}>📅 Export to Calendar</button>
              <button onClick={()=>onShowAlert(camp)} style={{...S.btn(camp.registrationOpen,"#059669"),fontSize:12,padding:"8px 14px",borderRadius:10}}>
                {camp.registrationOpen?"🟢 Register Now":"🔔 Alert Me When Open"}
              </button>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <h4 style={{margin:0,fontSize:15,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1810"}}>Parent Reviews</h4>
              <button onClick={()=>setShowReview(true)} style={{...S.btn(true),fontSize:11,padding:"5px 12px",borderRadius:8}}>+ Add Yours</button>
            </div>
            {reviews.length>0?(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {reviews.map((r,i)=>(
                  <div key={i} style={{background:"#FFFDF9",borderRadius:12,padding:14,border:"1.5px solid #E8DDD3"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontWeight:700,fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#2D1810"}}>{r.name}</span>
                      <span style={{fontSize:11,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>{r.date||r.year}</span>
                    </div>
                    <Stars rating={r.rating} size={15}/>
                    <p style={{margin:"7px 0 0",fontSize:13,color:"#5C4A40",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>{r.text}</p>
                    {r.childAge&&<p style={{margin:"5px 0 0",fontSize:11,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>Child age: {r.childAge}</p>}
                  </div>
                ))}
              </div>
            ):(
              <div style={{textAlign:"center",padding:16,background:"#FFFDF9",borderRadius:12,border:"1.5px dashed #D4C5BB"}}>
                <p style={{margin:0,fontSize:13,color:"#9C7B6E",fontFamily:"'DM Sans',sans-serif"}}>No reviews yet — be the first! 🌵</p>
              </div>
            )}
          </div>
        )}
      </div>
      {showReview&&<ReviewModal camp={camp} onClose={()=>setShowReview(false)} onSubmit={addReview}/>}
    </>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────
export default function Campful() {
  const [camps,setCamps]=useState(CAMPS);
  const [search,setSearch]=useState("");
  const [typeFilter,setTypeFilter]=useState("All");
  const [ageFilter,setAgeFilter]=useState("All Ages");
  const [costFilter,setCostFilter]=useState("Any Cost");
  const [timeFilter,setTimeFilter]=useState("Any Schedule");
  const [sortBy,setSortBy]=useState("featured");
  const [view,setView]=useState("list");
  const [aiQuery,setAiQuery]=useState("");
  const [isSearching,setIsSearching]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [showSchedule,setShowSchedule]=useState(false);
  const [alertCamp,setAlertCamp]=useState(null);
  const [savedIds,setSavedIds]=useState(new Set());
  const [highlighted,setHighlighted]=useState(getHighlightedId());

  const filtered=camps.filter(c=>{
    const q=search.toLowerCase();
    return (!q||[c.name,c.desc,c.type,c.address,c.org].some(s=>(s||"").toLowerCase().includes(q)))
      &&(typeFilter==="All"||c.type===typeFilter)&&ageMatch(c.ages,ageFilter)&&parseCost(c.cost,costFilter)&&timeMatch(c,timeFilter);
  }).sort((a,b)=>{
    if(sortBy==="featured") return (b.featured?1:0)-(a.featured?1:0);
    if(sortBy==="rating"){const r=x=>x.reviews.length?x.reviews.reduce((s,r)=>s+r.rating,0)/x.reviews.length:0;return r(b)-r(a);}
    if(sortBy==="cost") return (a.costNum||0)-(b.costNum||0);
    return a.name.localeCompare(b.name);
  });

  const savedCamps=camps.filter(c=>savedIds.has(c.id));

  const toggleSave=camp=>{
    setSavedIds(prev=>{const n=new Set(prev);n.has(camp.id)?n.delete(camp.id):n.add(camp.id);return n;});
  };

  const handleAISearch=async()=>{
    if(!aiQuery.trim()) return;
    setIsSearching(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`Find Phoenix Arizona summer camps matching: "${aiQuery}". Return ONLY a raw JSON array (no markdown, no backticks) of 2-3 real camps. Fields: name, org, type (Sports/Arts/STEM/Outdoor/Academic/Dance/Music), ages (like "6-12"), cost (like "$300/wk"), costNum (number only), dates, startDate (YYYY-MM-DD), endDate (YYYY-MM-DD), address, desc (2 sentences), schedule, web, phone, extras, extCare (bool), beforeCare (bool), afterCare (bool), registrationOpen (bool), lat (~33.4), lng (~-112.0).`}]})});
      const data=await res.json();
      const text=data.content.map(i=>i.text||"").join("\n").replace(/```json|```/g,"").trim();
      const start=text.indexOf("["),end=text.lastIndexOf("]")+1;
      const parsed=JSON.parse(text.slice(start,end));
      setCamps(prev=>[...parsed.map((c,i)=>({...c,id:Date.now()+i,reviews:[],featured:false})),...prev]);
      setAiQuery("");
    } catch(e){alert("Search failed — please try again.");}
    setIsSearching(false);
  };

  const handleAddReview=(id,r)=>setCamps(prev=>prev.map(c=>c.id===id?{...c,reviews:[...c.reviews,r]}:c));

  return (
    <div style={{minHeight:"100vh",background:"#F5EFE8",fontFamily:"'DM Sans',sans-serif"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#C1440E 0%,#E8731A 60%,#F59E0B 100%)",padding:"20px 16px 0",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:-50,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-80,left:80,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{maxWidth:980,margin:"0 auto",position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <span style={{fontSize:32}}>🏕️</span>
                <h1 style={{margin:0,fontSize:30,fontWeight:900,fontFamily:"'Fraunces',serif",color:"white",letterSpacing:"-1px"}}>Campful</h1>
              </div>
              <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.85)",fontFamily:"'DM Sans',sans-serif"}}>Summer plans, sorted. By parents, for parents. 🌵</p>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button onClick={()=>setShowSchedule(true)} style={{padding:"8px 14px",borderRadius:10,border:"none",background:"rgba(255,255,255,0.2)",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",backdropFilter:"blur(8px)"}}>
                📅 Schedule {savedIds.size>0&&`(${savedIds.size})`}
              </button>
              <button onClick={()=>setShowAdd(true)} style={{padding:"8px 14px",borderRadius:10,border:"none",background:"white",color:"#C1440E",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                + Add a Camp
              </button>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:"14px 14px 0 0",padding:"14px 14px 16px",backdropFilter:"blur(10px)"}}>
            <div style={{display:"flex",gap:8}}>
              <input style={{flex:1,border:"none",borderRadius:10,padding:"11px 16px",fontSize:13,outline:"none",background:"white",fontFamily:"'DM Sans',sans-serif",color:"#2D1810"}}
                placeholder='✨ AI Search: e.g. "outdoor camp with extended care under $200" or "STEM for a 10 year old"'
                value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAISearch()}/>
              <button onClick={handleAISearch} disabled={isSearching} style={{padding:"11px 18px",background:"#2D1810",color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",opacity:isSearching?0.7:1,fontFamily:"'DM Sans',sans-serif"}}>
                {isSearching?"Searching…":"Find 🔍"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:980,margin:"0 auto",padding:"16px"}}>
        {/* Category Pills */}
        <div style={{overflowX:"auto",marginBottom:14,paddingBottom:4}}>
          <div style={{display:"flex",gap:8}}>
            {TYPES.map(t=><button key={t} onClick={()=>setTypeFilter(t)} style={S.pill(typeFilter===t,TYPE_STYLE[t])}>
              {t==="All"?"🏕️ All Camps":t}
            </button>)}
          </div>
        </div>

        {/* Filters */}
        <div style={{background:"#FFFDF9",borderRadius:14,padding:14,marginBottom:14,border:"1.5px solid #E8DDD3",boxShadow:"0 2px 8px rgba(45,24,16,0.06)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:12}}>
            {[["SEARCH","text",search,setSearch,"Search camps…"],["CHILD'S AGE","select",ageFilter,setAgeFilter,AGES],["WEEKLY COST","select",costFilter,setCostFilter,COSTS],["SCHEDULE / CARE","select",timeFilter,setTimeFilter,TIMES]].map(([lbl,type,val,set,opts])=>(
              <div key={lbl}>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:"#9C7B6E",marginBottom:5,letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif"}}>{lbl}</label>
                {type==="text"?<input style={S.input} placeholder={opts} value={val} onChange={e=>set(e.target.value)}/>
                :<select style={S.input} value={val} onChange={e=>set(e.target.value)}>{opts.map(o=><option key={o}>{o}</option>)}</select>}
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:10,fontWeight:700,color:"#9C7B6E",letterSpacing:"0.06em",fontFamily:"'DM Sans',sans-serif"}}>SORT:</span>
              {["featured","rating","cost","name"].map(s=>(
                <button key={s} onClick={()=>setSortBy(s)} style={S.btn(sortBy===s)}>
                  {s[0].toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:13,color:"#9C7B6E",fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{filtered.length} camp{filtered.length!==1?"s":""}</span>
              <div style={{display:"flex",border:"1.5px solid #E8DDD3",borderRadius:10,overflow:"hidden"}}>
                {[["list","≡ List"],["map","🗺 Map"]].map(([v,label])=>(
                  <button key={v} onClick={()=>setView(v)} style={{padding:"7px 14px",border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:view===v?"#C1440E":"#FFFDF9",color:view===v?"white":"#7C6257",transition:"all 0.15s"}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tip bar */}
        <div style={{background:"#FFF3CD",borderRadius:10,padding:"10px 14px",marginBottom:14,border:"1.5px solid #FDE68A",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16}}>💡</span>
          <p style={{margin:0,fontSize:12,color:"#92400E",fontFamily:"'DM Sans',sans-serif"}}>
            <strong>New:</strong> Hit 🏷️ to save camps to your schedule · 🔔 to get registration alerts · 📅 in Details to export to your calendar
          </p>
        </div>

        {/* Content */}
        {view==="map"?(
          <MapView camps={filtered} onSelect={id=>{setView("list");setHighlighted(id);}}/>
        ):filtered.length>0?(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
            {filtered.map(c=><CampCard key={c.id} camp={c} highlighted={highlighted===c.id} saved={savedIds.has(c.id)} onAddReview={handleAddReview} onToggleSave={toggleSave} onShowAlert={setAlertCamp}/>)}
          </div>
        ):(
          <div style={{textAlign:"center",padding:"60px 0",color:"#9C7B6E"}}>
            <div style={{fontSize:52,marginBottom:10}}>🌵</div>
            <p style={{fontSize:18,fontWeight:700,fontFamily:"'Fraunces',serif",color:"#2D1810",margin:"0 0 6px"}}>No camps found</p>
            <p style={{fontSize:13,margin:"0 0 18px",fontFamily:"'DM Sans',sans-serif"}}>Try adjusting your filters or use AI Search above</p>
            <button onClick={()=>setShowAdd(true)} style={{...S.btn(true),padding:"11px 22px",borderRadius:12,fontSize:13}}>+ Add a Camp</button>
          </div>
        )}

        <div style={{textAlign:"center",padding:"24px 0 8px",fontSize:12,color:"#C4B0A5",fontFamily:"'DM Sans',sans-serif"}}>
          🏕️ Campful · Summer plans, sorted. By parents, for parents.
        </div>
      </div>

      {showSchedule&&<ScheduleBuilder savedCamps={savedCamps} allCamps={camps} onToggleSave={toggleSave} onClose={()=>setShowSchedule(false)}/>}
      {showAdd&&<AddCampModal onClose={()=>setShowAdd(false)} onAdd={c=>setCamps(prev=>[c,...prev])}/>}
      {alertCamp&&<AlertModal camp={alertCamp} onClose={()=>setAlertCamp(null)}/>}
    </div>
  );
}
