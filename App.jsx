import React, { useState } from "react";

/* ═══════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════ */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;background:#1A0F1C;color:#F2EAD8;font-family:'Inter',system-ui,sans-serif;font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased}
    button{cursor:pointer;font-family:'Inter',system-ui,sans-serif;border:none;background:none;transition:all .18s}
    input,textarea,select{font-family:'Inter',system-ui,sans-serif;outline:none;background:#2A1A2D;color:#F2EAD8;border-color:rgba(242,234,216,0.14)}
    select option{background:#2A1A2D;color:#F2EAD8}
    .serif{font-family:'Cormorant Garamond','Georgia',serif;font-weight:500}
    .serif-light{font-family:'Cormorant Garamond','Georgia',serif;font-weight:400}
    .serif-italic{font-family:'Cormorant Garamond','Georgia',serif;font-style:italic;font-weight:400}
    ::-webkit-scrollbar{width:6px;height:6px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#5A4658;border-radius:3px}
    @keyframes slide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fade{from{opacity:0}to{opacity:1}}
    .slide{animation:slide .4s ease-out}
    .fade{animation:fade .3s ease-out}
  `}</style>
);

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — Dark aubergine
═══════════════════════════════════════════════════════ */
const T = {
  bg: "#1A0F1C", bgWarm: "#23142A", card: "#2A1A2D", cardAlt: "#371F3B",
  border: "rgba(242,234,216,0.14)", borderLt: "rgba(242,234,216,0.08)",
  text: "#F2EAD8", textDim: "#C5B8C0", textMute: "#8A6E80", textFaint: "#5A4658",
  gold: "#D49C7C", goldDk: "#A87858", goldLt: "#E5BFA8",
  goldBg: "rgba(212,156,124,0.12)", goldBdr: "rgba(212,156,124,0.32)",
  green: "#7CA89C", greenMd: "#5E8A7E", greenLt: "#A8C7BE",
  greenBg: "rgba(124,168,156,0.12)", greenBdr: "rgba(124,168,156,0.28)",
  red: "#D67A6A", redBg: "rgba(214,122,106,0.12)", redBdr: "rgba(214,122,106,0.3)",
};

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const MEMBERS = [
  {id:1, name:"Alexandra Voss",    email:"a.voss@email.com",       country:"Germany",        initials:"AV", color:"#3D5240", joined:"Jan 2024"},
  {id:2, name:"Rodrigo Méndez",    email:"r.mendez@email.com",     country:"Dominican Rep.", initials:"RM", color:"#5C4126", joined:"Mar 2024"},
  {id:3, name:"Catherine Blanc",   email:"c.blanc@email.com",      country:"France",         initials:"CB", color:"#2D4459", joined:"Jun 2024"},
  {id:4, name:"James Harrington",  email:"j.harrington@email.com", country:"United States",  initials:"JH", color:"#54324A", joined:"Aug 2024"},
  {id:5, name:"Amir Hassan",       email:"a.hassan@email.com",     country:"UAE",            initials:"AH", color:"#4A2D33", joined:"Sep 2024"},
  {id:6, name:"Sofia Costa",       email:"s.costa@email.com",      country:"Brazil",         initials:"SC", color:"#5D4A2A", joined:"Oct 2024"},
  {id:7, name:"David Park",        email:"d.park@email.com",       country:"South Korea",    initials:"DP", color:"#2F4A4C", joined:"Nov 2024"},
  {id:8, name:"Isabella Romano",   email:"i.romano@email.com",     country:"Italy",          initials:"IR", color:"#503939", joined:"Dec 2024"},
];

// Fixed rotation: each peak holiday rotates through all 8 owners over 8 years.
// Different starting offset per holiday keeps it interesting — no single owner gets all the marquee weeks in the same year.
// Member IDs 1-8. Each array starts with the 2026 holder, then 2027, 2028…
const HOLIDAY_ROTATION = {
  xmas:     [3, 1, 7, 5, 8, 4, 6, 2], // Christmas Week
  nye:      [5, 8, 4, 6, 2, 3, 1, 7], // New Year's Week
  carnival: [1, 7, 5, 8, 4, 6, 2, 3], // Dominican Carnival
  semana:   [7, 5, 8, 4, 6, 2, 3, 1], // Semana Santa
  easter:   [4, 6, 2, 3, 1, 7, 5, 8], // Easter
  summerA:  [6, 2, 3, 1, 7, 5, 8, 4], // Peak Summer July
  summerB:  [8, 4, 6, 2, 3, 1, 7, 5], // Peak Summer August
  thanks:   [2, 3, 1, 7, 5, 8, 4, 6], // Thanksgiving
};

// Get the assigned owner for a holiday in a given year
function holidayOwner(holidayId, year) {
  const rotation = HOLIDAY_ROTATION[holidayId];
  if (!rotation) return null;
  const yearIndex = (year - 2026) % rotation.length;
  return rotation[yearIndex >= 0 ? yearIndex : yearIndex + rotation.length];
}

// Peak holidays — fixed list, rotation-assigned
const PEAK_HOLIDAYS = [
  {id:"xmas",     name:"Christmas Week",        start:"2026-12-21", days:7, season:"winter"},
  {id:"nye",      name:"New Year's Week",       start:"2026-12-28", days:8, season:"winter"},
  {id:"carnival", name:"Dominican Carnival",    start:"2026-02-26", days:4, season:"winter"},
  {id:"semana",   name:"Semana Santa",          start:"2026-03-28", days:8, season:"spring"},
  {id:"easter",   name:"Easter Long Weekend",   start:"2026-04-02", days:5, season:"spring"},
  {id:"summerA",  name:"Peak Summer · July 4",  start:"2026-07-04", days:7, season:"summer"},
  {id:"summerB",  name:"Peak Summer · August",  start:"2026-08-02", days:7, season:"summer"},
  {id:"thanks",   name:"Thanksgiving Week",     start:"2026-11-21", days:8, season:"autumn"},
];

// 2026 starting assignment (owner ID assigned to each peak holiday slot, in order)
// Each subsequent year, the assignment rotates by 1 position so every owner cycles through all 8 peak weeks over 8 years
const ROTATION_BASE_2026 = [3, 5, 1, 7, 8, 4, 6, 2]; // owner IDs in order of PEAK_HOLIDAYS

// Compute assignments for a given year by rotating the base array
function holidayAssignments(year) {
  const offset = (year - 2026) % 8;
  const rotated = [...ROTATION_BASE_2026.slice(offset), ...ROTATION_BASE_2026.slice(0, offset)];
  return PEAK_HOLIDAYS.map((h, i) => ({ ...h, assignedTo: rotated[i] }));
}

const HOLIDAYS_INIT = holidayAssignments(2026);

const LONG_WEEKENDS_INIT = [
  {id:"lw1", name:"July Long Weekend",      start:"2026-07-10", days:3, claimedBy:6},
  {id:"lw2", name:"August Long Weekend",    start:"2026-08-14", days:3, claimedBy:8},
  {id:"lw3", name:"September Long Weekend", start:"2026-09-04", days:3, claimedBy:null},
  {id:"lw4", name:"October Long Weekend",   start:"2026-10-09", days:3, claimedBy:null},
  {id:"lw5", name:"November Long Weekend",  start:"2026-11-06", days:3, claimedBy:null},
  {id:"lw6", name:"February '27 Weekend",   start:"2027-02-12", days:3, claimedBy:null},
  {id:"lw7", name:"March '27 Weekend",      start:"2027-03-12", days:3, claimedBy:null},
  {id:"lw8", name:"April '27 Weekend",      start:"2027-04-16", days:3, claimedBy:null},
];

const RES_INIT = [
  {id:5, member:6, start:"2026-07-10", days:3, label:"July Weekend",     type:"long-weekend"},
  {id:6, member:8, start:"2026-08-14", days:3, label:"August Weekend",   type:"long-weekend"},
  {id:7, member:1, start:"2026-06-22", days:7, label:"Midsummer Escape", type:"regular"},
  {id:8, member:1, start:"2026-09-05", days:5, label:"September Trip",   type:"regular"},
  {id:9, member:4, start:"2026-07-22", days:5, label:"July Stay",        type:"regular"},
];

const CONCIERGE_INIT = [
  {id:1, member:1, category:"Pre-arrival", title:"Stock fridge before Feb 10",
   description:"Please stock with breakfast items, Sauvignon Blanc, fresh fruit, and snacks for 6 guests. Budget around $400.",
   status:"completed", date:"2026-02-08",
   reply:"Done. Receipt added to your account. Total: $387.50. Wine selection: Sancerre Pascal Jolivet 2022 (×6) and a case of Acqua Panna."},
  {id:2, member:1, category:"Dining", title:"Chef for Friday dinner (Feb 13)",
   description:"4 guests, seafood-focused menu preferred. Any dietary restrictions to consider?",
   status:"in-progress", date:"2026-02-09",
   reply:"Chef Mario confirmed for Friday. Proposing a tasting menu: ceviche de corvina, langosta thermidor, mero al pesto. Sending wine pairings tomorrow."},
  {id:3, member:1, category:"Activities", title:"Golf tee times at Teeth of the Dog",
   description:"Saturday & Sunday at 8am, foursome both days.", status:"pending", date:"2026-02-09", reply:null},
];

const EXPENSES_INIT = [
  {id:1, member:1, date:"2026-02-01", category:"Maintenance", vendor:"Paraíso Management",  description:"February management fee", amount:200.00,
   receipt: {
     invoiceNo: "INV-2026-0214", paymentMethod: "Visa •••• 4129", paidAt: "2026-02-01 09:00",
     items: [{name:"Monthly villa management fee", qty:1, price:200.00}], subtotal:200.00, tax:0, total:200.00,
     notes:"Auto-charged on the 1st of each month"
   }},
  {id:2, member:1, date:"2026-02-08", category:"Groceries", vendor:"La Romana Market", description:"Pre-arrival fridge stocking", amount:387.50,
   receipt: {
     invoiceNo: "LRM-88412", paymentMethod: "Villa account", paidAt: "2026-02-08 14:22",
     items: [
       {name:"Sancerre Pascal Jolivet 2022 (×6)", qty:6, price:42.00},
       {name:"Acqua Panna 1L case (×12)",         qty:1, price:38.00},
       {name:"Fresh berries assortment",          qty:3, price:12.50},
       {name:"Sourdough boules (artisan)",        qty:2, price:8.00},
       {name:"Smoked salmon, capers, cream cheese", qty:1, price:32.00},
       {name:"Local fruits & vegetables",         qty:1, price:48.00},
     ],
     subtotal:355.50, tax:32.00, total:387.50,
     notes:"Stocked the morning of Feb 9 ahead of guest arrival."
   }},
  {id:3, member:1, date:"2026-02-09", category:"Services", vendor:"Chef Mario", description:"Private dinner deposit", amount:250.00,
   receipt: {
     invoiceNo: "CM-2026-021", paymentMethod: "Villa account", paidAt: "2026-02-09 11:14",
     items: [
       {name:"Deposit · 4-course tasting menu for 4 guests", qty:1, price:250.00},
     ],
     subtotal:250.00, tax:0, total:250.00,
     notes:"Balance due day of service. Menu: ceviche, langosta thermidor, mero al pesto, tres leches."
   }},
  {id:4, member:1, date:"2026-02-09", category:"Activities", vendor:"Casa de Campo Golf", description:"Tee times — Sat & Sun (4 ppl)", amount:680.00,
   receipt: {
     invoiceNo: "CDC-G-44128", paymentMethod: "Villa account", paidAt: "2026-02-09 16:30",
     items: [
       {name:"Teeth of the Dog · Sat 8am · 4 players", qty:4, price:85.00},
       {name:"Teeth of the Dog · Sun 8am · 4 players", qty:4, price:85.00},
     ],
     subtotal:680.00, tax:0, total:680.00,
     notes:"Caddies included. Cart fee complimentary for villa members."
   }},
  {id:5, member:1, date:"2026-02-10", category:"Transport", vendor:"Premium Transfers", description:"Airport pickup PUJ", amount:185.00,
   receipt: {
     invoiceNo: "PT-7782", paymentMethod: "Villa account", paidAt: "2026-02-10 18:45",
     items: [
       {name:"Mercedes V-Class · PUJ → 77 Las Cañas I", qty:1, price:165.00},
       {name:"Cold water, snacks, wifi onboard",          qty:1, price:20.00},
     ],
     subtotal:185.00, tax:0, total:185.00,
     notes:"Pickup at 6:30pm, arrival to villa 8:15pm. Driver: Andrés."
   }},
  {id:6, member:1, date:"2026-01-15", category:"Maintenance", vendor:"Paraíso Management", description:"January management fee", amount:200.00,
   receipt: {
     invoiceNo: "INV-2026-0113", paymentMethod: "Visa •••• 4129", paidAt: "2026-01-15 09:00",
     items: [{name:"Monthly villa management fee", qty:1, price:200.00}], subtotal:200.00, tax:0, total:200.00, notes:"Auto-charged"
   }},
  {id:7, member:1, date:"2026-01-22", category:"Repairs", vendor:"Aqua Pool Services", description:"Pool pump replacement (shared)", amount:75.00,
   receipt: {
     invoiceNo: "AQ-2266", paymentMethod: "Villa account", paidAt: "2026-01-22 15:10",
     items: [
       {name:"Hayward pump motor replacement",      qty:1, price:480.00},
       {name:"Labor (2.5 hrs)",                     qty:1, price:120.00},
     ],
     subtotal:600.00, tax:0, total:600.00,
     splitNote:"Shared expense · Your 1/8 share: $75.00",
     notes:"Replaced after 6 years of service. New pump under 2-year warranty."
   }},
];

const SWAPS_INIT = [
  {id:1, from:3, to:1, fromDate:"2026-07-04", fromDays:7, toDate:"2026-04-20", toDays:7,
   message:"Hi Alexandra — would you swap your April week for my July 4th week? My family wants to come for Easter.",
   status:"pending", date:"2026-02-05"},
];

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const fmt = s => new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const fmtShort = s => new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric"});
const fmtLong = s => new Date(s).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
const diff = (a,b) => Math.round((new Date(b)-new Date(a))/864e5);
const ds = (y,m,d) => `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const daysInMonth = (y,m) => new Date(y,m+1,0).getDate();
const firstDow = (y,m) => new Date(y,m,1).getDay();
const mByID = id => MEMBERS.find(m => m.id === id);
const daysUsed = (id, res) => res.filter(r => r.member === id).reduce((s,r) => s+r.days, 0);
const daysUntil = (s) => Math.max(0, Math.ceil((new Date(s) - new Date()) / 864e5));
const endDate = (start, days) => {
  const d = new Date(start);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

function bookedOn(dateS, res) {
  return res.find(r => {
    const s = new Date(r.start);
    const e = new Date(r.start);
    e.setDate(e.getDate() + r.days);
    return new Date(dateS) >= s && new Date(dateS) < e;
  });
}

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
function Icon({ name, size = 18, color = "currentColor", stroke = 1.4 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    calendar:  <svg {...p}><rect x="3" y="5" width="18" height="16" rx="1.5"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>,
    bell:      <svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>,
    swap:      <svg {...p}><path d="M7 7h13l-3-3"/><path d="M17 17H4l3 3"/></svg>,
    receipt:   <svg {...p}><path d="M5 3v18l2.5-1.5L10 21l2-1.5L14 21l2.5-1.5L19 21V3l-2.5 1.5L14 3l-2 1.5L10 3 7.5 4.5 5 3z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>,
    home:      <svg {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>,
    concierge: <svg {...p}><path d="M4 21h16"/><path d="M5 21V11a7 7 0 0 1 14 0v10"/><circle cx="12" cy="6" r="2"/><line x1="12" y1="4" x2="12" y2="2"/></svg>,
    dining:    <svg {...p}><path d="M3 2v8c0 1 1 2 2 2h2c1 0 2-1 2-2V2"/><line x1="6" y1="12" x2="6" y2="22"/><path d="M16 3c-2 0-3 1.5-3 4v6h2v9h2V13h2V7c0-2.5-1-4-3-4z"/></svg>,
    transport: <svg {...p}><rect x="3" y="11" width="18" height="8" rx="2"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/><path d="M5 11l2-5h10l2 5"/></svg>,
    activity:  <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20"/></svg>,
    repair:    <svg {...p}><path d="M14 7l-7.5 7.5a3 3 0 1 0 4 4L18 11"/><path d="M14 7l3-3 4 4-3 3"/></svg>,
    shopping:  <svg {...p}><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l3 12h11l2-8H6"/></svg>,
    arrow:     <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>,
    arrowLeft: <svg {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 18 5 12 11 6"/></svg>,
    plus:      <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check:     <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    close:     <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    star:      <svg {...p}><polygon points="12 2 15 9 22 9.5 16.5 14.5 18 22 12 18 6 22 7.5 14.5 2 9.5 9 9"/></svg>,
    sparkle:   <svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>,
    sun:       <svg {...p}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>,
    mapPin:    <svg {...p}><path d="M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>,
    clock:     <svg {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></svg>,
    info:      <svg {...p}><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.5"/></svg>,
    message:   <svg {...p}><path d="M21 12c0 4.5-4 8-9 8a10 10 0 0 1-4-1l-5 1 1.5-4A8 8 0 0 1 3 12c0-4.5 4-8 9-8s9 3.5 9 8z"/></svg>,
    leaf:      <svg {...p}><path d="M5 21c8-1 14-7 14-15V3h-3c-8 0-14 5-14 13v5z"/><line x1="5" y1="21" x2="13" y2="13"/></svg>,
    flower:    <svg {...p}><circle cx="12" cy="12" r="2"/><path d="M12 10c0-3-1.5-5-3-5s-2 2-2 4M14 10c0-3 1.5-5 3-5s2 2 2 4M14 14c0 3 1.5 5 3 5s2-2 2-4M10 14c0 3-1.5 5-3 5s-2-2-2-4"/></svg>,
    bag:       <svg {...p}><path d="M5 7h14l-1 14H6L5 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>,
    download:  <svg {...p}><line x1="12" y1="4" x2="12" y2="16"/><polyline points="6 10 12 16 18 10"/><line x1="4" y1="20" x2="20" y2="20"/></svg>,
    eye:       <svg {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
    settings:  <svg {...p}><circle cx="12" cy="12" r="3"/></svg>,
  };
  return icons[name] || null;
}

/* ═══════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════ */
function Avatar({ m, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: m.color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 500, color: "#F2EAD8",
      flexShrink: 0, letterSpacing: "0.02em",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)"
    }}>
      {m.initials}
    </div>
  );
}

function Tag({ children, tone = "default", size = "md" }) {
  const styles = {
    default: { bg: T.cardAlt,    color: T.textDim, bdr: T.border },
    gold:    { bg: T.goldBg,     color: T.goldDk,  bdr: T.goldBdr },
    green:   { bg: T.greenBg,    color: T.green,   bdr: T.greenBdr },
    red:     { bg: T.redBg,      color: T.red,     bdr: T.redBdr },
  };
  const s = styles[tone];
  const sz = size === "sm" ? { padding: "2px 8px", fontSize: "0.65rem" } : { padding: "3px 10px", fontSize: "0.7rem" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      borderRadius: 100, fontWeight: 500, letterSpacing: "0.02em",
      whiteSpace: "nowrap", background: s.bg, color: s.color, border: `1px solid ${s.bdr}`,
      ...sz
    }}>
      {children}
    </span>
  );
}

function Eyebrow({ children, color = T.textMute }) {
  return (
    <div style={{
      fontSize: "0.66rem", fontWeight: 500, letterSpacing: "0.18em",
      textTransform: "uppercase", color
    }}>{children}</div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", icon, iconRight }) {
  const variants = {
    primary:   { bg: T.green, color: "#F2EAD8", bdr: T.green, hover: T.greenMd },
    gold:      { bg: T.gold,  color: "#F2EAD8", bdr: T.gold,  hover: T.goldDk },
    secondary: { bg: T.card,  color: T.text,    bdr: T.border, hover: T.cardAlt },
    ghost:     { bg: "transparent", color: T.textDim, bdr: T.border, hover: T.cardAlt },
  };
  const sizes = {
    sm: { padding: "0.4rem 0.85rem", fontSize: "0.74rem" },
    md: { padding: "0.65rem 1.2rem", fontSize: "0.82rem" },
    lg: { padding: "0.85rem 1.6rem", fontSize: "0.88rem" },
  };
  const v = variants[variant];
  const s = sizes[size];
  return (
    <button onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.background = v.hover}
      onMouseLeave={e => e.currentTarget.style.background = v.bg}
      style={{
        background: v.bg, color: v.color, border: `1px solid ${v.bdr}`,
        borderRadius: 6, fontWeight: 500, letterSpacing: "0.03em",
        display: "inline-flex", alignItems: "center", gap: 8,
        ...s,
      }}>
      {icon && <Icon name={icon} size={15} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={14} />}
    </button>
  );
}

function Panel({ title, action, children, padding = "1.5rem 1.6rem" }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
        <Eyebrow>{title}</Eyebrow>
        {action && (
          <button onClick={action.onClick}
            style={{ fontSize: "0.75rem", color: T.gold, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
            {action.label} <Icon name="arrow" size={12} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VILLA SCENE (CSS art)
═══════════════════════════════════════════════════════ */
function VillaScene({ height = 240, time = "day" }) {
  const palettes = {
    day:  { sky: "linear-gradient(180deg, #D8E5E8 0%, #B8CDD2 25%, #94B5BC 50%, #6B8E8A 75%, #4A6E64 100%)",
            sun: "rgba(248,229,184,0.75)", hills: "rgba(45,70,54,0.45)",
            water: "linear-gradient(180deg, #7DA6AE 0%, #4A7B85 40%, #2A4854 100%)",
            villa: "linear-gradient(180deg, #EFE4CD 0%, #D6C5A0 100%)", roof: "#5A3F25",
            door: "#3D2A1A", window: "rgba(45,71,72,0.85)",
            tree: "linear-gradient(180deg, #2C4A30 0%, #1A2E1C 100%)" },
    dusk: { sky: "linear-gradient(180deg, #2D1B33 0%, #5A2D4A 20%, #B8624D 50%, #D49C7C 75%, #6B3A45 100%)",
            sun: "rgba(232,180,140,0.85)", hills: "rgba(26,15,28,0.65)",
            water: "linear-gradient(180deg, #3A2138 0%, #2A1A2D 60%, #1A0F1C 100%)",
            villa: "linear-gradient(180deg, #D49C7C 0%, #A87858 100%)", roof: "#3D1F2A",
            door: "#1A0F1C", window: "rgba(244,220,180,0.65)",
            tree: "linear-gradient(180deg, #2A1A2D 0%, #1A0F1C 100%)" },
    night: { sky: "linear-gradient(180deg, #1A0F1C 0%, #2A1A2D 30%, #371F3B 60%, #2A1A2D 90%, #1A0F1C 100%)",
            sun: "rgba(229,191,168,0.5)", hills: "rgba(10,5,12,0.7)",
            water: "linear-gradient(180deg, #2A1A2D 0%, #1A0F1C 50%, #0D0610 100%)",
            villa: "linear-gradient(180deg, #4D3543 0%, #2A1A2D 100%)", roof: "#1A0F1C",
            door: "rgba(212,156,124,0.4)", window: "rgba(212,156,124,0.85)",
            tree: "linear-gradient(180deg, #1F1124 0%, #0D0610 100%)" },
  };
  const p = palettes[time];

  return (
    <div style={{ height, width: "100%", borderRadius: 8, overflow: "hidden", position: "relative", background: p.sky }}>
      <div style={{ position: "absolute", top: "14%", right: "22%", width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${p.sun} 0%, transparent 70%)`, filter: "blur(3px)" }} />
      <div style={{ position: "absolute", bottom: "44%", left: 0, right: 0, height: 60, background: `linear-gradient(180deg, transparent 0%, ${p.hills} 100%)`, clipPath: "polygon(0 100%, 0 70%, 18% 58%, 32% 65%, 48% 50%, 62% 62%, 78% 48%, 92% 58%, 100% 65%, 100% 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "42%", background: p.water }} />
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ position: "absolute", bottom: `${8 + i * 8}%`, left: `${6 + i * 3}%`, right: `${8 + i * 4}%`, height: 1, background: `linear-gradient(90deg, transparent, rgba(220,235,238,${0.4 - i * 0.08}), transparent)` }} />
      ))}
      <div style={{ position: "absolute", bottom: "37%", left: "22%", right: "22%", height: "22%", background: p.villa, boxShadow: "0 10px 35px rgba(0,0,0,0.22)" }}>
        <div style={{ position: "absolute", top: "-20px", left: "-12px", right: "-12px", height: "20px", background: p.roof, clipPath: "polygon(6% 100%, 94% 100%, 78% 0%, 22% 0%)" }} />
        <div style={{ display: "flex", gap: 10, padding: "22% 12% 0", justifyContent: "space-around" }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ width: "18%", height: 30, background: p.window, borderRadius: 1, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }} />
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: "44%", width: "12%", height: "55%", background: p.door, borderRadius: "2px 2px 0 0" }} />
      </div>
      {[{ left: "8%", h: 100, b: "37%" }, { left: "14%", h: 80, b: "35%" }, { left: "82%", h: 95, b: "37%" }, { left: "88%", h: 70, b: "35%" }].map((t, i) => (
        <div key={i} style={{ position: "absolute", left: t.left, bottom: t.b, width: 16, height: t.h, background: p.tree, borderRadius: "50% 50% 30% 30% / 60% 60% 20% 20%", filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.4))" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.22) 100%)", pointerEvents: "none" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════ */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  function doLogin() {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    const m = MEMBERS.find(x => x.email.toLowerCase() === email.toLowerCase().trim()) || MEMBERS[0];
    onLogin(m);
  }

  function onKey(e) { if (e.key === "Enter") doLogin(); }

  const inp = {
    width: "100%", padding: "0.9rem 1rem", borderRadius: 8,
    border: `1px solid ${T.border}`, background: T.card,
    fontSize: "0.92rem", color: T.text, outline: "none", transition: "border .2s",
  };

  return (
    <div className="slide" style={{ minHeight: "100vh", display: "flex" }}>
      <div style={{ flex: "0 0 50%", position: "relative", overflow: "hidden" }}>
        <VillaScene height="100%" time="dusk" />
        <div style={{ position: "absolute", top: "3.5rem", left: "3.5rem", color: "#F2EAD8", zIndex: 2 }}>
          <div className="serif" style={{ fontSize: "2rem", letterSpacing: "0.06em" }}>Paraíso</div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.34em", textTransform: "uppercase", color: "#D4C9AE", marginTop: 6 }}>
            Private Membership · Est. 2024
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "3.5rem", left: "3.5rem", right: "3.5rem", color: "#F2EAD8", zIndex: 2 }}>
          <div style={{ width: 40, height: 1, background: "rgba(212,201,174,0.6)", marginBottom: "1.5rem" }} />
          <div className="serif-italic" style={{ fontSize: "1.6rem", lineHeight: 1.45, color: "#F4ECD8", marginBottom: "1.2rem", maxWidth: 380 }}>
            Beyond ownership — belonging.
          </div>
          <div style={{ fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "#B8AE93" }}>
            77 Las Cañas I · Casa de Campo, D.R.
          </div>
        </div>
      </div>

      <div style={{ flex: 1, background: T.bg, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "2rem 3.5rem", display: "flex", justifyContent: "flex-end", fontSize: "0.78rem", color: T.textMute }}>
          <span>Need help? <a href="mailto:concierge@paraiso.co" style={{ color: T.gold, textDecoration: "none", fontWeight: 500 }}>concierge@paraiso.co</a></span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem 5rem", maxWidth: 560, width: "100%", margin: "0 auto" }}>
          <Eyebrow>Member Portal</Eyebrow>
          <h1 className="serif" style={{ fontSize: "2.8rem", marginTop: "0.7rem", marginBottom: "0.6rem", color: T.text, letterSpacing: "-0.01em", lineHeight: 1.05 }}>
            Sign in to your account.
          </h1>
          <p style={{ color: T.textDim, fontSize: "0.95rem", marginBottom: "2.5rem" }}>
            Access your villa, calendar, concierge and account.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.55rem" }}>
                Email address
              </label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey}
                placeholder="your.email@example.com" style={inp}
                onFocus={e => e.currentTarget.style.borderColor = T.gold}
                onBlur={e => e.currentTarget.style.borderColor = T.border} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim }}>
                  Password
                </label>
                <span style={{ fontSize: "0.72rem", color: T.gold, fontWeight: 500, cursor: "pointer" }}>Forgot password?</span>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)} onKeyDown={onKey}
                  placeholder="Enter your password"
                  style={{ ...inp, paddingRight: "3.2rem" }}
                  onFocus={e => e.currentTarget.style.borderColor = T.gold}
                  onBlur={e => e.currentTarget.style.borderColor = T.border} />
                <button onClick={() => setShowPw(s => !s)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", color: T.textMute, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", color: T.textDim, cursor: "pointer", userSelect: "none" }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: T.gold }} />
              Keep me signed in on this device
            </label>

            {error && (
              <div style={{ background: T.redBg, border: `1px solid ${T.redBdr}`, borderRadius: 8, padding: "0.7rem 1rem", color: T.red, fontSize: "0.83rem" }}>
                {error}
              </div>
            )}

            <button onClick={doLogin}
              style={{ marginTop: "0.4rem", padding: "1rem", borderRadius: 8, background: T.green, color: "#F2EAD8", fontWeight: 500, fontSize: "0.92rem", letterSpacing: "0.04em" }}>
              Sign in
            </button>
          </div>

          <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: `1px solid ${T.borderLt}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
            <p style={{ fontSize: "0.82rem", color: T.textMute }}>
              Not a member? <a href="mailto:hello@paraiso.co" style={{ color: T.gold, fontWeight: 500, textDecoration: "none" }}>Inquire about ownership →</a>
            </p>
            <p style={{ fontSize: "0.72rem", color: T.textMute }}>© 2026 Paraíso</p>
          </div>

          <details style={{ marginTop: "1.5rem" }}>
            <summary style={{ fontSize: "0.72rem", color: T.textMute, cursor: "pointer", letterSpacing: "0.04em", listStyle: "none" }}>
              ▸ Quick demo access
            </summary>
            <div style={{ marginTop: "0.8rem", fontSize: "0.72rem", color: T.textMute, lineHeight: 1.6 }}>
              Click any member to sign in instantly:
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                {MEMBERS.map(m => (
                  <button key={m.id} onClick={() => onLogin(m)}
                    style={{ padding: "4px 10px", borderRadius: 4, background: T.cardAlt, border: `1px solid ${T.borderLt}`, color: T.textDim, fontSize: "0.7rem" }}>
                    {m.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════ */
function Nav({ me, tab, setTab, onLogout, notif }) {
  const tabs = [
    { id: "home",      label: "Home" },
    { id: "villa",     label: "My Villa" },
    { id: "stays",     label: "Stays" },
    { id: "concierge", label: "Concierge", badge: notif.concierge },
    { id: "expenses",  label: "Expenses" },
    { id: "swaps",     label: "Swaps", badge: notif.swaps },
    { id: "owners",    label: "Community" },
  ];

  return (
    <header style={{
      background: T.card, borderBottom: `1px solid ${T.border}`,
      position: "sticky", top: 0, zIndex: 100, padding: "0 3rem",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 68
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
        <div>
          <div className="serif" style={{ fontSize: "1.4rem", letterSpacing: "0.05em", color: T.text, lineHeight: 1 }}>Paraíso</div>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.26em", textTransform: "uppercase", color: T.gold, fontWeight: 500, marginTop: 3 }}>
            Private Members
          </div>
        </div>
        <nav style={{ display: "flex", gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: "0 1.1rem", height: 68, fontSize: "0.82rem",
                fontWeight: tab === t.id ? 500 : 400,
                color: tab === t.id ? T.text : T.textDim,
                borderBottom: tab === t.id ? `2px solid ${T.gold}` : "2px solid transparent",
                position: "relative", transition: "color .15s"
              }}>
              {t.label}
              {t.badge ? (
                <span style={{ position: "absolute", top: 20, right: 4, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: T.gold, color: T.card, fontSize: "0.62rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button style={{ width: 36, height: 36, borderRadius: 8, color: T.textDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="bell" size={17} />
        </button>
        <div style={{ width: 1, height: 24, background: T.border }} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.83rem", fontWeight: 500 }}>{me.name.split(" ")[0]}</div>
          <div style={{ fontSize: "0.68rem", color: T.textMute }}>1/8 Owner · {me.country}</div>
        </div>
        <Avatar m={me} size={36} />
        <Btn size="sm" variant="ghost" onClick={onLogout}>Sign out</Btn>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════ */
function Home({ me, res, concierge, expenses, swaps, setTab }) {
  const myRes = res.filter(r => r.member === me.id).sort((a,b) => a.start > b.start ? 1 : -1);
  const today = new Date().toISOString().split("T")[0];
  const next = myRes.find(r => endDate(r.start, r.days) >= today);
  const du = daysUsed(me.id, res);
  const myExpenses = expenses.filter(e => e.member === me.id);
  const thisMonthExp = myExpenses.filter(e => e.date.startsWith("2026-02"));
  const thisMonthTotal = thisMonthExp.reduce((s,e) => s + e.amount, 0);
  const openConcierge = concierge.filter(c => c.member === me.id && c.status !== "completed").length;
  const incomingSwaps = swaps.filter(s => s.to === me.id && s.status === "pending").length;

  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="slide" style={{ maxWidth: 1180, margin: "0 auto", padding: "3rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Eyebrow>{greet} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</Eyebrow>
          <h1 className="serif-light" style={{ fontSize: "3rem", color: T.text, marginTop: "0.5rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
            {me.name.split(" ")[0]}<span style={{ color: T.gold, fontWeight: 400 }}>.</span>
          </h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <Eyebrow>Casa de Campo, D.R.</Eyebrow>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.4rem", color: T.textDim, fontSize: "0.85rem" }}>
            <Icon name="sun" size={16} color={T.gold} /> 82° · Sunny, light breeze
          </div>
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: "1.5rem", display: "flex", minHeight: 280 }}>
        <div style={{ width: 380, flexShrink: 0, padding: "1.2rem" }}>
          <VillaScene height={256} time="dusk" />
        </div>
        <div style={{ flex: 1, padding: "2.2rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {next ? (
            <>
              <div>
                <Eyebrow color={T.gold}>Your next stay · {daysUntil(next.start)} days away</Eyebrow>
                <h2 className="serif-light" style={{ fontSize: "2.4rem", color: T.text, marginTop: "0.6rem", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                  {next.label}
                </h2>
                <div style={{ marginTop: "0.8rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ fontSize: "0.95rem", color: T.textDim }}>
                    {fmtLong(next.start)} — {fmtLong(endDate(next.start, next.days))}
                  </div>
                  <Tag tone={next.type === "holiday" ? "gold" : next.type === "long-weekend" ? "green" : "default"}>
                    {next.days} nights
                  </Tag>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <Btn variant="primary" onClick={() => setTab("concierge")} icon="concierge">Pre-arrival request</Btn>
                <Btn variant="secondary" onClick={() => setTab("stays")}>Manage stay</Btn>
              </div>
            </>
          ) : (
            <>
              <div>
                <Eyebrow>No upcoming stays</Eyebrow>
                <h2 className="serif-light" style={{ fontSize: "2.2rem", color: T.text, marginTop: "0.6rem", lineHeight: 1.1 }}>
                  Time for an escape.
                </h2>
                <p style={{ color: T.textDim, fontSize: "0.92rem", marginTop: "0.7rem", maxWidth: 380, lineHeight: 1.6 }}>
                  You have <span style={{ color: T.gold, fontWeight: 500 }}>{45 - du} days</span> remaining this year. Book a regular stay, claim a long weekend, or pick your holiday in the annual draft.
                </p>
              </div>
              <Btn variant="primary" size="lg" onClick={() => setTab("stays")} iconRight="arrow">Book a stay</Btn>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.8rem", marginBottom: "1.5rem" }}>
        <StatTile label="Days remaining" value={45 - du} sub={`${du} of 45 used`} progress={du / 45 * 100} onClick={() => setTab("stays")} />
        <StatTile label="Open requests"   value={openConcierge} sub={openConcierge ? "Tap to view" : "All caught up"} tone={openConcierge > 0 ? "gold" : "default"} onClick={() => setTab("concierge")} />
        <StatTile label="Due this month"  value={`$${thisMonthTotal.toLocaleString("en-US", { minimumFractionDigits: 0 })}`} sub={`${thisMonthExp.length} items in February`} onClick={() => setTab("expenses")} />
        <StatTile label="Swap requests"   value={incomingSwaps} sub={incomingSwaps ? "Action needed" : "None pending"} tone={incomingSwaps > 0 ? "gold" : "default"} onClick={() => setTab("swaps")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
        <Panel title="Recent activity" action={{ label: "See all", onClick: () => setTab("expenses") }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[...concierge.filter(c => c.member === me.id), ...myExpenses.slice(0, 3)]
              .sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((item, i, arr) => {
                const isExp = "amount" in item;
                return (
                  <div key={`${isExp ? "e" : "c"}-${item.id}`} style={{
                    display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${T.borderLt}` : "none"
                  }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: isExp ? T.greenBg : T.goldBg, color: isExp ? T.green : T.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={isExp ? "receipt" : "concierge"} size={17} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 500, color: T.text }}>
                        {isExp ? item.description : item.title}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: T.textMute, marginTop: 2 }}>
                        {isExp ? `${item.vendor} · ${item.category}` : `${item.category} · ${item.status}`} · {fmtShort(item.date)}
                      </div>
                    </div>
                    {isExp && (
                      <div style={{ fontSize: "0.94rem", fontWeight: 500, color: T.text, fontVariantNumeric: "tabular-nums" }}>
                        ${item.amount.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Service request widget — Avalon style */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "1.5rem 1.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <Eyebrow>Request a service</Eyebrow>
              <button onClick={() => setTab("concierge")}
                style={{ fontSize: "0.74rem", color: T.gold, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                See all <Icon name="arrow" size={12} />
              </button>
            </div>
            <p style={{ fontSize: "0.78rem", color: T.textDim, lineHeight: 1.5, marginBottom: "1rem" }}>
              Tap a category — we'll open a tailored request form.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {[
                { icon: "dining",    cat: "Dining",      color: T.gold },
                { icon: "repair",    cat: "Maintenance", color: T.green },
                { icon: "activity",  cat: "Activities",  color: T.gold },
                { icon: "transport", cat: "Transport",   color: T.green },
                { icon: "shopping",  cat: "Pre-arrival", color: T.gold },
                { icon: "bag",       cat: "Errands",     color: T.green },
              ].map(s => (
                <button key={s.cat}
                  onClick={() => setTab("concierge", s.cat)}
                  onMouseEnter={e => { e.currentTarget.style.background = T.goldBg; e.currentTarget.style.borderColor = T.goldBdr; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.cardAlt; e.currentTarget.style.borderColor = T.borderLt; }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    padding: "0.75rem 0.85rem", borderRadius: 8,
                    background: T.cardAlt, border: `1px solid ${T.borderLt}`,
                    color: T.text, fontSize: "0.82rem", textAlign: "left",
                    transition: "all .15s"
                  }}>
                  <span style={{ color: s.color, display: "flex" }}><Icon name={s.icon} size={15} /></span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{s.cat}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setTab("concierge")}
              style={{
                marginTop: "0.8rem", width: "100%", padding: "0.7rem", borderRadius: 8,
                background: T.green, color: "#F2EAD8", fontSize: "0.82rem", fontWeight: 500,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>
              <Icon name="plus" size={14} /> Open the concierge
            </button>
          </div>

          {/* Quick actions — simpler list */}
          <Panel title="Quick links">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                { icon: "calendar",  label: "Book a stay",         tab: "stays" },
                { icon: "swap",      label: "Propose a date swap", tab: "swaps" },
                { icon: "receipt",   label: "View statement",      tab: "expenses" },
                { icon: "home",      label: "Villa details",       tab: "villa" },
              ].map(a => (
                <button key={a.label} onClick={() => setTab(a.tab)}
                  onMouseEnter={e => e.currentTarget.style.background = T.cardAlt}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.55rem 0.6rem",
                    borderRadius: 6, color: T.text, fontSize: "0.83rem", textAlign: "left"
                  }}>
                  <span style={{ color: T.gold, display: "flex" }}><Icon name={a.icon} size={15} /></span>
                  <span style={{ flex: 1 }}>{a.label}</span>
                  <span style={{ color: T.textMute, display: "flex" }}><Icon name="arrow" size={12} /></span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, progress, tone = "default", onClick }) {
  const isGold = tone === "gold";
  return (
    <div onClick={onClick}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = T.goldBdr; }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.borderColor = isGold ? T.goldBdr : T.border; }}
      style={{
        background: isGold ? T.goldBg : T.card,
        border: `1px solid ${isGold ? T.goldBdr : T.border}`,
        borderRadius: 12, padding: "1.3rem 1.4rem",
        cursor: onClick ? "pointer" : "default", transition: "border .2s"
      }}>
      <Eyebrow color={isGold ? T.goldDk : T.textMute}>{label}</Eyebrow>
      <div className="serif-light" style={{ fontSize: "2.2rem", color: isGold ? T.goldDk : T.text, lineHeight: 1, marginTop: "0.6rem", letterSpacing: "-0.01em" }}>
        {value}
      </div>
      <div style={{ fontSize: "0.74rem", color: T.textMute, marginTop: "0.45rem" }}>{sub}</div>
      {progress !== undefined && (
        <div style={{ height: 2, background: T.borderLt, borderRadius: 1, marginTop: "0.9rem" }}>
          <div style={{ width: `${Math.min(progress, 100).toFixed(0)}%`, height: "100%", background: T.gold, borderRadius: 1 }} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MY VILLA
═══════════════════════════════════════════════════════ */
function Villa({ setTab }) {
  return (
    <div className="slide" style={{ maxWidth: 1080, margin: "0 auto", padding: "3rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Eyebrow>Your home</Eyebrow>
        <h1 className="serif-light" style={{ fontSize: "3rem", color: T.text, marginTop: "0.5rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
          77 Las Cañas I
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.5rem", color: T.textDim, fontSize: "0.95rem" }}>
          <Icon name="mapPin" size={15} /> Las Cañas · Casa de Campo · La Romana, Dominican Republic
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <VillaScene height={420} time="dusk" />
      </div>

      <div style={{ marginBottom: "2.5rem", maxWidth: 720 }}>
        <p className="serif-italic" style={{ fontSize: "1.4rem", color: T.text, lineHeight: 1.45, marginBottom: "1.2rem" }}>
          A contemporary five-bedroom estate in the most coveted neighborhood of Casa de Campo.
        </p>
        <p style={{ color: T.textDim, fontSize: "0.95rem", lineHeight: 1.8 }}>
          Tucked into the prestigious Las Cañas area — long considered the resort's finest enclave — the villa is moments from Minitas Beach, the Marina, and the legendary Teeth of the Dog. Open-plan living, vaulted ceilings, an oversized pool with a swim-up bar, indoor and outdoor dining for sixteen, a private cinema, and full staff quarters. Includes butler, housekeeper, daily cook, and three golf carts.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[["5","Bedrooms"], ["6","Bathrooms"], ["9,800","Sq. ft. interior"], ["14","Maximum guests"]].map(([v, l]) => (
          <div key={l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "1.3rem 1.4rem", textAlign: "center" }}>
            <div className="serif-light" style={{ fontSize: "2.4rem", color: T.text, lineHeight: 1, marginBottom: "0.5rem" }}>{v}</div>
            <Eyebrow>{l}</Eyebrow>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <Panel title="Amenities">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1.2rem" }}>
            {[
              ["sparkle",   "Pool with swim-up bar"],
              ["activity",  "Teeth of the Dog golf"],
              ["sun",       "Minitas Beach Club"],
              ["concierge", "Butler & full-time staff"],
              ["dining",    "Indoor dining for 12"],
              ["leaf",      "Outdoor pavilion"],
              ["transport", "3 included golf carts"],
              ["star",      "Private cinema"],
              ["settings",  "Heated jacuzzi"],
              ["flower",    "Lush garden grounds"],
            ].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.4rem 0" }}>
                <span style={{ color: T.gold, display: "flex" }}><Icon name={icon} size={15} /></span>
                <span style={{ fontSize: "0.86rem", color: T.text }}>{label}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Ownership">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {[
              ["Your share", "1 of 8 (12.5%)"],
              ["Share value", "$625,000"],
              ["Total villa value", "$5.0M"],
              ["Annual days", "45 per year"],
              ["Annual fee", "$2,400 / year"],
              ["Deeded ownership", "Yes"],
            ].map(([l, v], i, arr) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.7rem", borderBottom: i < arr.length - 1 ? `1px solid ${T.borderLt}` : "none" }}>
                <span style={{ color: T.textDim, fontSize: "0.85rem" }}>{l}</span>
                <span style={{ color: T.text, fontWeight: 500, fontSize: "0.88rem" }}>{v}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="On-property team" padding="2rem">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.2rem" }}>
          {[
            { initials: "CR", color: "#5C4126", role: "House Manager",  name: "Carmen Reyes",  desc: "Operations, schedules, your main contact for everything villa-related." },
            { initials: "LM", color: "#2D4459", role: "Head Concierge", name: "Luis Morales",  desc: "Reservations, tours, transport, errands — anything you need." },
            { initials: "MJ", color: "#3D5240", role: "Housekeeping",   name: "María Jiménez", desc: "Daily cleaning, laundry, turn-down service, fresh flowers." },
          ].map(p => (
            <div key={p.role} style={{ padding: "1.3rem 1.4rem", background: T.cardAlt, border: `1px solid ${T.borderLt}`, borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "0.9rem" }}>
                <Avatar m={{ initials: p.initials, color: p.color }} size={48} />
                <div>
                  <Eyebrow>{p.role}</Eyebrow>
                  <div style={{ fontWeight: 500, color: T.text, fontSize: "0.95rem", marginTop: 4 }}>{p.name}</div>
                </div>
              </div>
              <p style={{ fontSize: "0.82rem", color: T.textDim, lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.6rem" }}>
        <Btn variant="primary" size="lg" onClick={() => setTab("stays")} iconRight="arrow">Reserve your next stay</Btn>
        <Btn variant="secondary" size="lg" onClick={() => setTab("concierge")} icon="message">Message your concierge</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STAYS — luxury hotel reservation page
═══════════════════════════════════════════════════════ */
function Stays({ me, res, setRes, holidays, setHolidays, longWeekends, setLongWeekends }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [step, setStep] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [label, setLabel] = useState("");
  const [msg, setMsg] = useState(null);
  const [showRotation, setShowRotation] = useState(false);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const today = new Date().toISOString().split("T")[0];
  const myRes = res.filter(r => r.member === me.id).sort((a,b) => a.start > b.start ? 1 : -1);
  const du = daysUsed(me.id, res);
  const dRemain = 45 - du;

  // My assigned peak holiday & released ones
  const myAssignedHoliday = holidays.find(h => h.assignedTo === me.id && h.start >= today && !h.released);
  const isHolidayConfirmed = myAssignedHoliday?.confirmedAt;
  const releasedHolidays = holidays.filter(h => h.released && h.start >= today);
  const upcomingWeekends = longWeekends.filter(l => l.start >= today).slice(0, 3);
  const peakHolidayRange = myAssignedHoliday
    ? { start: myAssignedHoliday.start, end: endDate(myAssignedHoliday.start, myAssignedHoliday.days) }
    : null;

  function isPeakDay(s) {
    if (!peakHolidayRange) return false;
    return s >= peakHolidayRange.start && s < peakHolidayRange.end;
  }

  function clickDay(d) {
    const s = ds(year, month, d);
    if (s < today || bookedOn(s, res) || isPeakDay(s)) return;
    if (!step) { setStep("end"); setStart(s); setEnd(null); return; }
    if (step === "end") {
      if (s <= start) { setStart(s); return; }
      setEnd(s); setStep("confirm");
    }
  }

  function confirm() {
    if (!start || !end || !label.trim()) { alert("Please name this stay."); return; }
    const n = diff(start, end);
    if (n < 1) return;
    if (du + n > 45) { alert(`Only ${dRemain} days remaining this year.`); return; }
    setRes(p => [...p, { id: Date.now(), member: me.id, start, days: n, label: label.trim(), type: "regular" }]);
    setMsg(`${label} booked — ${n} nights starting ${fmt(start)}`);
    setStep(null); setStart(null); setEnd(null); setLabel("");
  }

  function confirmPeakHoliday() {
    if (!myAssignedHoliday) return;
    if (du + myAssignedHoliday.days > 45) { alert(`Only ${dRemain} days remaining this year.`); return; }
    setHolidays(p => p.map(h => h.id === myAssignedHoliday.id ? { ...h, confirmedAt: new Date().toISOString() } : h));
    setRes(p => [...p, { id: Date.now(), member: me.id, start: myAssignedHoliday.start, days: myAssignedHoliday.days, label: myAssignedHoliday.name, type: "holiday" }]);
    setMsg(`${myAssignedHoliday.name} confirmed — ${myAssignedHoliday.days} nights from ${fmt(myAssignedHoliday.start)}`);
  }

  function releaseHoliday() {
    if (!myAssignedHoliday) return;
    if (!window.confirm(`Release your ${myAssignedHoliday.name}? Other owners can claim it first-come.`)) return;
    setHolidays(p => p.map(h => h.id === myAssignedHoliday.id ? { ...h, released: true, confirmedAt: null } : h));
    setRes(p => p.filter(r => !(r.start === myAssignedHoliday.start && r.member === me.id && r.type === "holiday")));
    setMsg(`${myAssignedHoliday.name} released — available to other owners`);
  }

  function claimReleased(item) {
    if (du + item.days > 45) { alert(`Only ${dRemain} days remaining this year.`); return; }
    setHolidays(p => p.map(h => h.id === item.id ? { ...h, claimedBy: me.id, released: false } : h));
    setRes(p => [...p, { id: Date.now(), member: me.id, start: item.start, days: item.days, label: item.name, type: "holiday" }]);
    setMsg(`${item.name} claimed — ${item.days} nights from ${fmt(item.start)}`);
  }

  function claimLongWeekend(lw) {
    if (lw.claimedBy) return;
    if (du + lw.days > 45) { alert(`Only ${dRemain} days remaining this year.`); return; }
    setLongWeekends(p => p.map(l => l.id === lw.id ? { ...l, claimedBy: me.id } : l));
    setRes(p => [...p, { id: Date.now(), member: me.id, start: lw.start, days: lw.days, label: lw.name, type: "long-weekend" }]);
    setMsg(`${lw.name} claimed — ${lw.days} nights from ${fmt(lw.start)}`);
  }

  function inSel(s) { return start && s >= start && s <= (end || start); }
  function prevM() { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); }
  function nextM() { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); }

  const dm = daysInMonth(year, month);
  const fd = firstDow(year, month);

  // Three "future peak weeks" preview
  const nextThreeYearsPeakWeeks = [2026, 2027, 2028].map(y => {
    const assigns = holidayAssignments(y);
    const mine = assigns.find(a => a.assignedTo === me.id);
    return mine ? `${mine.name.replace(" Week","").replace(" Long Weekend","")} ${y}` : null;
  }).filter(Boolean);

  return (
    <div className="slide" style={{ maxWidth: 1180, margin: "0 auto", padding: "3rem" }}>

      {/* HERO with villa scene */}
      <div style={{ position: "relative", height: 280, borderRadius: 14, overflow: "hidden", marginBottom: "1.5rem" }}>
        <VillaScene height={280} time="dusk" />
        <div style={{ position: "absolute", inset: 0, padding: "2.2rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#F2EAD8" }}>
          <div>
            <Eyebrow color="#D4C9AE">Stays · 2026</Eyebrow>
            <h1 className="serif-light" style={{ fontSize: "2.6rem", color: "#F2EAD8", marginTop: "0.5rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
              Plan your time.
            </h1>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <Eyebrow color="#B8AE93">77 Las Cañas I</Eyebrow>
              <div className="serif-italic" style={{ fontSize: "1rem", marginTop: 4, color: "#F4ECD8" }}>
                Casa de Campo, Dominican Republic
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Eyebrow color="#B8AE93">Allocation</Eyebrow>
              <div className="serif-light" style={{ fontSize: "2rem", marginTop: 2, lineHeight: 1, color: "#F2EAD8" }}>
                {dRemain}<span style={{ color: "#B8AE93", fontSize: "1.1rem" }}> / 45 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success message */}
      {msg && (
        <div style={{ background: T.greenBg, border: `1px solid ${T.greenBdr}`, borderRadius: 8, padding: "0.85rem 1.1rem", marginBottom: "1.2rem", color: T.green, fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={15} /> {msg}
          </span>
          <button onClick={() => setMsg(null)} style={{ color: T.green }}><Icon name="close" size={15} /></button>
        </div>
      )}

      {/* Peak holiday strip — compact */}
      {myAssignedHoliday && (
        <div style={{ background: T.card, border: `1px solid ${T.goldBdr}`, borderRadius: 14, padding: "1.2rem 1.4rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
          <div style={{ width: 56, height: 56, borderRadius: 8, background: T.goldBg, border: `1px solid ${T.goldBdr}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "0.6rem", color: T.goldDk, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {new Date(myAssignedHoliday.start).toLocaleDateString("en-US", { month: "short" })}
            </div>
            <div className="serif" style={{ fontSize: "1.3rem", color: T.goldDk, lineHeight: 1 }}>
              {new Date(myAssignedHoliday.start).getDate()}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Tag tone="gold" size="sm">Your peak holiday · 2026 {isHolidayConfirmed && "· confirmed"}</Tag>
            </div>
            <div className="serif-light" style={{ fontSize: "1.3rem", color: T.text, lineHeight: 1.2 }}>{myAssignedHoliday.name}</div>
            <div style={{ fontSize: "0.78rem", color: T.textDim, marginTop: 3 }}>
              {fmt(myAssignedHoliday.start)} → {fmt(endDate(myAssignedHoliday.start, myAssignedHoliday.days))} · {myAssignedHoliday.days} nights · counts toward your 45 days
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
            {!isHolidayConfirmed ? (
              <>
                <Btn variant="gold" size="sm" onClick={confirmPeakHoliday}>Confirm</Btn>
                <Btn variant="ghost" size="sm" onClick={releaseHoliday}>Release</Btn>
              </>
            ) : (
              <Btn variant="ghost" size="sm" onClick={releaseHoliday}>Release this week</Btn>
            )}
          </div>
        </div>
      )}

      {/* Released holidays callout */}
      {releasedHolidays.length > 0 && (
        <div style={{ background: T.goldBg, border: `1px dashed ${T.goldBdr}`, borderRadius: 12, padding: "1rem 1.3rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <Eyebrow color={T.goldDk}>Available · released by another owner</Eyebrow>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {releasedHolidays.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.6rem 0.8rem", background: T.card, border: `1px solid ${T.goldBdr}`, borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.86rem", fontWeight: 500 }}>{h.name}</div>
                  <div style={{ fontSize: "0.72rem", color: T.textMute }}>{fmtShort(h.start)} · {h.days} nights · released by {mByID(h.assignedTo)?.name.split(" ")[0]}</div>
                </div>
                <Btn variant="gold" size="sm" onClick={() => claimReleased(h)}>Claim</Btn>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CALENDAR header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.9rem", flexWrap: "wrap", gap: "0.6rem" }}>
        <div>
          <Eyebrow>Reserve a stay</Eyebrow>
          <div style={{ fontSize: "0.82rem", color: T.textMute, marginTop: 3 }}>
            Click any open day to begin — stay as long as you'd like.
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.74rem", color: T.textDim }}>
          {[
            { color: T.greenBg, bdr: T.greenBdr, label: "You" },
            { color: T.cardAlt, bdr: T.borderLt, label: "Co-owner" },
            { color: T.goldBg,  bdr: T.goldBdr,  label: "Peak holiday" },
          ].map(l => (
            <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 11, height: 11, borderRadius: 2, background: l.color, border: `1px solid ${l.bdr}` }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* CALENDAR */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1rem 1.4rem", borderBottom: `1px solid ${T.borderLt}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={prevM} style={{ width: 34, height: 34, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.textDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrowLeft" size={14} />
          </button>
          <div className="serif-light" style={{ fontSize: "1.4rem", color: T.text }}>{MONTHS[month]} {year}</div>
          <button onClick={nextM} style={{ width: 34, height: 34, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.textDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrow" size={14} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: T.cardAlt }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} style={{ textAlign: "center", padding: "0.55rem 0", fontSize: "0.62rem", letterSpacing: "0.14em", color: T.textMute, fontWeight: 500 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {Array.from({ length: fd }).map((_,i) => (
            <div key={"e"+i} style={{ minHeight: 70, borderBottom: `1px solid ${T.borderLt}`, borderRight: `1px solid ${T.borderLt}` }} />
          ))}
          {Array.from({ length: dm }, (_,i) => i + 1).map(d => {
            const s2 = ds(year, month, d);
            const bk = bookedOn(s2, res);
            const owner = bk ? mByID(bk.member) : null;
            const isMe = owner?.id === me.id;
            const sel = inSel(s2);
            const isStart = s2 === start;
            const past = s2 < today;
            const peak = isPeakDay(s2);
            const peakStart = peak && s2 === peakHolidayRange.start;

            let bg = T.card, tc = past ? "#CFC8B5" : T.text;
            if (peak) bg = T.goldBg;
            if (bk && !isMe && !peak) bg = T.cardAlt;
            if (isMe) bg = T.greenBg;
            if (sel && !bk && !peak) bg = T.goldBg;
            if (isStart) { bg = T.gold; tc = "#F2EAD8"; }

            return (
              <div key={d} onClick={() => clickDay(d)}
                style={{
                  minHeight: 70, background: bg, padding: "0.5rem 0.6rem", position: "relative",
                  borderBottom: `1px solid ${T.borderLt}`, borderRight: `1px solid ${T.borderLt}`,
                  cursor: past || bk || peak ? "default" : "pointer", userSelect: "none",
                  transition: "background .12s"
                }}>
                <div style={{ fontSize: "0.82rem", color: tc, fontWeight: isStart ? 500 : 400 }}>{d}</div>
                {peakStart && (
                  <div style={{ fontSize: "0.58rem", color: T.goldDk, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 6, lineHeight: 1.2 }}>
                    {myAssignedHoliday.name.replace(" Week","").replace(" Long Weekend","")}
                  </div>
                )}
                {(bk || peak) && (
                  <div style={{ position: "absolute", bottom: 6, left: 6, right: 6 }}>
                    <div style={{ height: 3, background: isMe ? T.green : peak ? T.gold : T.textFaint, borderRadius: 2 }} />
                    {!peak && (
                      <div style={{ fontSize: "0.6rem", color: isMe ? T.green : T.textMute, marginTop: 3, fontWeight: 500 }}>
                        {isMe ? "You" : owner?.initials}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inline booking confirm */}
        {(step === "end" || step === "confirm") && (
          <div style={{ padding: "1.1rem 1.4rem", background: T.goldBg, borderTop: `1px solid ${T.goldBdr}` }}>
            {step === "end" ? (
              <p style={{ fontSize: "0.86rem", color: T.goldDk, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="info" size={15} /> Arrive: <strong>{fmt(start)}</strong> — now click your departure date
              </p>
            ) : (
              <div style={{ display: "flex", gap: "0.9rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <p style={{ fontSize: "0.85rem", color: T.text, marginBottom: 8 }}>
                    {fmt(start)} → {fmt(end)} · <strong style={{ color: T.goldDk }}>{diff(start, end)} nights</strong>
                  </p>
                  <input value={label} onChange={e => setLabel(e.target.value)}
                    placeholder="Name this stay"
                    style={{ width: "100%", padding: "0.6rem 0.9rem", borderRadius: 6, border: `1px solid ${T.goldBdr}`, background: T.card, fontSize: "0.86rem", color: T.text }} />
                </div>
                <Btn variant="primary" onClick={confirm}>Confirm</Btn>
                <Btn variant="secondary" onClick={() => { setStep(null); setStart(null); setEnd(null); setLabel(""); }}>Cancel</Btn>
              </div>
            )}
          </div>
        )}
      </div>

      {/* UPCOMING STAYS */}
      {myRes.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.9rem" }}>
            <Eyebrow>Your upcoming stays</Eyebrow>
            <span style={{ fontSize: "0.74rem", color: T.textMute }}>{myRes.length} {myRes.length === 1 ? "stay" : "stays"}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {myRes.map(r => {
              const isHoliday = r.type === "holiday";
              const isWeekend = r.type === "long-weekend";
              return (
                <div key={r.id} style={{
                  background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
                  padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "1rem"
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 8,
                    background: isHoliday ? T.goldBg : isWeekend ? T.greenBg : T.cardAlt,
                    border: `1px solid ${isHoliday ? T.goldBdr : isWeekend ? T.greenBdr : T.borderLt}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <div style={{ fontSize: "0.6rem", color: T.textMute, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {new Date(r.start).toLocaleDateString("en-US", { month: "short" })}
                    </div>
                    <div className="serif" style={{ fontSize: "1.2rem", color: isHoliday ? T.goldDk : T.text, lineHeight: 1 }}>
                      {new Date(r.start).getDate()}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span className="serif-light" style={{ fontSize: "1.1rem", color: T.text }}>{r.label}</span>
                      {isHoliday && <Tag tone="gold" size="sm">Peak holiday</Tag>}
                      {isWeekend && <Tag tone="green" size="sm">Long weekend</Tag>}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: T.textDim }}>
                      {fmtShort(r.start)} → {fmtShort(endDate(r.start, r.days))} · {r.days} nights
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: "0.74rem", color: T.textMute }}>
                    in {daysUntil(r.start)} days
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LONG WEEKENDS */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.9rem" }}>
          <div>
            <Eyebrow>Long weekend escapes</Eyebrow>
            <div style={{ fontSize: "0.78rem", color: T.textMute, marginTop: 3 }}>
              Friday → Monday · first-come
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {upcomingWeekends.map(lw => {
            const claimedOwner = lw.claimedBy ? mByID(lw.claimedBy) : null;
            const isMine = lw.claimedBy === me.id;
            return (
              <div key={lw.id} style={{
                background: claimedOwner ? T.cardAlt : T.card,
                border: `1px solid ${claimedOwner ? T.borderLt : T.border}`,
                borderRadius: 12, padding: "1rem 1.1rem",
                opacity: claimedOwner && !isMine ? 0.75 : 1
              }}>
                <div className="serif-light" style={{ fontSize: "1.4rem", color: claimedOwner && !isMine ? T.textDim : T.text, lineHeight: 1 }}>
                  {fmtShort(lw.start)}
                </div>
                <div style={{ fontSize: "0.72rem", color: T.textMute, marginTop: 4 }}>
                  Fri → Mon · {lw.days} nights
                </div>
                <div style={{ marginTop: "0.7rem" }}>
                  {!claimedOwner ? (
                    <Btn variant="primary" size="sm" onClick={() => claimLongWeekend(lw)}>Claim</Btn>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                      <Avatar m={claimedOwner} size={22} />
                      <span style={{ fontSize: "0.72rem", color: T.textMute }}>
                        {isMine ? "You claimed" : `${claimedOwner.name.split(" ")[0]} claimed`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROTATION FOOTER — collapsed */}
      <div style={{ background: T.cardAlt, border: `1px solid ${T.borderLt}`, borderRadius: 10, padding: "0.85rem 1.2rem", marginBottom: showRotation ? "0.6rem" : 0, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.6rem" }}>
        <div style={{ fontSize: "0.78rem", color: T.textDim }}>
          <span style={{ fontWeight: 500, color: T.text }}>Your future peak weeks:</span>{" "}
          {nextThreeYearsPeakWeeks.join(" · ")}
        </div>
        <button onClick={() => setShowRotation(s => !s)}
          style={{ background: "none", border: "none", color: T.gold, fontWeight: 500, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          {showRotation ? "Hide rotation" : "See all 8 years"}
          <Icon name={showRotation ? "chevDown" : "arrow"} size={12} />
        </button>
      </div>

      {/* 8-year matrix (expanded) */}
      {showRotation && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `140px repeat(8, minmax(100px, 1fr))`, minWidth: 900 }}>
            <div style={{ padding: "0.8rem 1rem", borderBottom: `1px solid ${T.border}`, borderRight: `1px solid ${T.borderLt}`, background: T.cardAlt }}>
              <div style={{ fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.14em", color: T.textMute, textTransform: "uppercase" }}>Peak holiday</div>
            </div>
            {[2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033].map(y => (
              <div key={y} style={{ padding: "0.8rem 0.6rem", borderBottom: `1px solid ${T.border}`, background: T.cardAlt, textAlign: "center" }}>
                <div className="serif" style={{ fontSize: "1rem", color: T.text, lineHeight: 1 }}>{y}</div>
              </div>
            ))}
            {PEAK_HOLIDAYS.map((ph, rowIdx) => (
              <React.Fragment key={ph.id}>
                <div style={{ padding: "0.7rem 1rem", borderBottom: rowIdx < 7 ? `1px solid ${T.borderLt}` : "none", borderRight: `1px solid ${T.borderLt}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 500, color: T.text }}>{ph.name}</div>
                  <div style={{ fontSize: "0.66rem", color: T.textMute, marginTop: 2 }}>{ph.days} nights</div>
                </div>
                {[2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033].map(y => {
                  const assigns = holidayAssignments(y);
                  const ownerId = assigns[rowIdx].assignedTo;
                  const owner = mByID(ownerId);
                  const isMe = ownerId === me.id;
                  return (
                    <div key={y} style={{
                      padding: "0.6rem 0.4rem", borderBottom: rowIdx < 7 ? `1px solid ${T.borderLt}` : "none",
                      background: isMe ? T.goldBg : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5
                    }}>
                      <Avatar m={owner} size={20} />
                      <span style={{ fontSize: "0.7rem", color: isMe ? T.goldDk : T.textDim, fontWeight: isMe ? 500 : 400 }}>
                        {isMe ? "You" : owner.name.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONCIERGE — category-specific custom forms
═══════════════════════════════════════════════════════ */

const SERVICE_CATEGORIES = [
  {
    id: "Dining", icon: "dining", desc: "Private chefs, restaurant reservations",
    fields: [
      { id: "type",      label: "What kind of dining?",       type: "select", options: ["Private chef at villa","Restaurant reservation","Catering / event","Wine delivery"] },
      { id: "date",      label: "Date",                       type: "date" },
      { id: "time",      label: "Time",                       type: "select", options: ["Breakfast","Brunch","Lunch","Sunset","Dinner","Late night"] },
      { id: "guests",    label: "Number of guests",            type: "number", placeholder: "4" },
      { id: "cuisine",   label: "Cuisine preference",         type: "select", options: ["No preference","Dominican","Italian","French","Asian","Seafood","Mediterranean","BBQ / Grill"] },
      { id: "dietary",   label: "Dietary restrictions",       type: "text", placeholder: "e.g. gluten-free, no shellfish, vegetarian" },
      { id: "budget",    label: "Approximate budget (USD)",   type: "text", placeholder: "$1,500" },
      { id: "notes",     label: "Any special requests?",      type: "textarea", placeholder: "Birthday surprise, wine pairing preferences, ambiance, etc." },
    ],
  },
  {
    id: "Pre-arrival", icon: "shopping", desc: "Stock the fridge, fresh flowers, deep clean",
    fields: [
      { id: "arrivalDate",  label: "Arrival date",                  type: "date" },
      { id: "arrivalTime",  label: "Approximate arrival time",      type: "select", options: ["Morning","Afternoon","Evening","Late night"] },
      { id: "guests",       label: "Number of guests",               type: "number", placeholder: "4" },
      { id: "kids",         label: "Children in the group?",         type: "select", options: ["No","Yes — 1","Yes — 2","Yes — 3+"] },
      { id: "groceries",    label: "Grocery stocking",               type: "multi", options: ["Breakfast items","Fresh fruit","Snacks","Bottled water","Soft drinks","Coffee/tea","Local rum"] },
      { id: "wine",         label: "Wine preferences",               type: "select", options: ["None","Red — bold","Red — light","White — crisp","White — full","Champagne / sparkling","Rosé","Mixed selection"] },
      { id: "flowers",      label: "Fresh flower arrangement",       type: "select", options: ["No","Yes — modest","Yes — generous","Yes — elaborate centerpiece"] },
      { id: "budget",       label: "Stocking budget (USD)",          type: "text", placeholder: "$400" },
      { id: "notes",        label: "Anything else?",                  type: "textarea", placeholder: "Special items, allergies, surprises…" },
    ],
  },
  {
    id: "Activities", icon: "activity", desc: "Golf, spa, tours, water sports, polo",
    fields: [
      { id: "type",     label: "Activity",                   type: "select", options: ["Golf tee times","Spa appointments","Boat / yacht charter","Snorkeling / diving","Horseback riding","Polo lesson","Tennis","Tour / excursion","Other"] },
      { id: "date",     label: "Date",                       type: "date" },
      { id: "time",     label: "Preferred time",             type: "select", options: ["Early morning (6-8am)","Morning (8-11am)","Midday","Afternoon","Sunset","Flexible"] },
      { id: "people",   label: "Number of participants",      type: "number", placeholder: "2" },
      { id: "level",    label: "Skill level",                type: "select", options: ["Beginner","Intermediate","Advanced","Mixed group"] },
      { id: "notes",    label: "Special requests",            type: "textarea", placeholder: "Tee box preference, spa treatments, dietary on boat, etc." },
    ],
  },
  {
    id: "Transport", icon: "transport", desc: "Airport transfers, car service, helicopter",
    fields: [
      { id: "type",       label: "Type of transport",         type: "select", options: ["Airport pickup","Airport drop-off","Round-trip transfer","Local driver (hourly)","Helicopter","Yacht transfer"] },
      { id: "airport",    label: "Airport (if applicable)",   type: "select", options: ["N/A","Punta Cana (PUJ)","La Romana (LRM)","Santo Domingo (SDQ)"] },
      { id: "date",       label: "Date",                       type: "date" },
      { id: "time",       label: "Time",                       type: "text", placeholder: "e.g. 14:30 or arrive by 8pm" },
      { id: "flight",     label: "Flight number (if airport)", type: "text", placeholder: "e.g. AA 1234" },
      { id: "passengers", label: "Number of passengers",       type: "number", placeholder: "4" },
      { id: "luggage",    label: "Approximate luggage",        type: "select", options: ["Light (1-2 bags pp)","Moderate (3-4 bags pp)","Heavy (5+ bags pp)"] },
      { id: "vehicle",    label: "Vehicle preference",         type: "select", options: ["Sedan","SUV","Mercedes V-Class","Sprinter / minibus","Luxury (Maybach, etc.)"] },
      { id: "notes",      label: "Special requests",            type: "textarea", placeholder: "Cold water, snacks, baby seat, etc." },
    ],
  },
  {
    id: "Maintenance", icon: "repair", desc: "Repairs, replacements, services at the villa",
    fields: [
      { id: "area",      label: "Area of the villa",          type: "select", options: ["Pool / spa","Kitchen","Bedroom","Bathroom","Outdoor / garden","HVAC / AC","Electrical","Plumbing","Smart home / Wi-Fi","Appliances","Other"] },
      { id: "urgency",   label: "How urgent?",                type: "select", options: ["Low — when convenient","Medium — within the week","High — within 24-48 hours","Emergency — right now"] },
      { id: "duringStay",label: "Is this during a stay?",     type: "select", options: ["No — between stays","Yes — currently at villa","Yes — for upcoming arrival"] },
      { id: "issue",     label: "Describe the issue",         type: "textarea", placeholder: "What's wrong, when did it start, what have you noticed…" },
      { id: "photos",    label: "Photos available?",          type: "select", options: ["No","Yes — I can send via WhatsApp"] },
    ],
  },
  {
    id: "Errands", icon: "bag", desc: "Shopping, deliveries, gifts",
    fields: [
      { id: "type",     label: "What kind of errand?",       type: "select", options: ["Shopping (groceries)","Shopping (personal items)","Gift purchase","Delivery / drop-off","Pharmacy","Other"] },
      { id: "date",     label: "When?",                       type: "date" },
      { id: "items",    label: "What do you need?",          type: "textarea", placeholder: "List items, brands, sizes, recipient name if gift…" },
      { id: "budget",   label: "Budget (USD)",                type: "text", placeholder: "$200" },
      { id: "notes",    label: "Additional notes",            type: "textarea", placeholder: "Where to leave items, who to deliver to, etc." },
    ],
  },
  {
    id: "Other", icon: "sparkle", desc: "Anything else — just ask",
    fields: [
      { id: "title",  label: "What do you need?",            type: "text", placeholder: "Brief summary" },
      { id: "notes",  label: "Tell us everything",            type: "textarea", placeholder: "We'll figure it out — just describe what you have in mind." },
    ],
  },
];

function Concierge({ me, concierge, setConcierge, initialCategory }) {
  const [showNew, setShowNew] = useState(!!initialCategory);
  const [category, setCategory] = useState(initialCategory || "Dining");
  const [form, setForm] = useState({});

  const myRequests = concierge.filter(c => c.member === me.id).sort((a,b) => new Date(b.date) - new Date(a.date));
  const activeService = SERVICE_CATEGORIES.find(s => s.id === category);

  function updateField(id, value) {
    setForm(prev => ({ ...prev, [id]: value }));
  }

  function submit() {
    const fields = activeService.fields;
    const requiredFilled = fields.filter(f => f.type !== "textarea" && !["dietary","flight","notes","photos"].includes(f.id))
      .some(f => form[f.id]);
    if (!requiredFilled) { alert("Please fill in at least one field so we know what you need."); return; }

    // Generate a smart title based on category + key fields
    const titleParts = [];
    if (form.type) titleParts.push(form.type);
    else if (form.title) titleParts.push(form.title);
    else if (form.area) titleParts.push(`${form.area} — ${category}`);
    else titleParts.push(category);
    if (form.date) titleParts.push(`for ${fmtShort(form.date)}`);
    const generatedTitle = titleParts.join(" ");

    // Build description from filled fields
    const desc = fields
      .filter(f => form[f.id] && f.id !== "title")
      .map(f => {
        const v = Array.isArray(form[f.id]) ? form[f.id].join(", ") : form[f.id];
        return `${f.label}: ${v}`;
      }).join("\n");

    setConcierge(p => [{
      id: Date.now(), member: me.id, category,
      title: generatedTitle,
      description: desc,
      formData: { ...form },
      status: "pending",
      date: new Date().toISOString().split("T")[0], reply: null
    }, ...p]);
    setShowNew(false); setForm({});
  }

  return (
    <div className="slide" style={{ maxWidth: 1080, margin: "0 auto", padding: "3rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Eyebrow>Concierge</Eyebrow>
          <h1 className="serif-light" style={{ fontSize: "3rem", color: T.text, marginTop: "0.5rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
            At your service.
          </h1>
          <p style={{ color: T.textDim, fontSize: "0.92rem", marginTop: "0.5rem" }}>
            Your on-property team at 77 Las Cañas I is here to make your stay seamless.
          </p>
        </div>
        <Btn variant="primary" size="lg" icon="plus" onClick={() => { setShowNew(true); setForm({}); }}>New request</Btn>
      </div>

      <div style={{ background: T.cardAlt, color: "#F2EAD8", borderRadius: 14, padding: "2rem 2.4rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", border: `1px solid ${T.border}` }}>
        <Avatar m={{ initials: "LM", color: "#5C4126" }} size={72} />
        <div style={{ flex: 1, minWidth: 240 }}>
          <Eyebrow color={T.textMute}>Your concierge</Eyebrow>
          <div className="serif-light" style={{ fontSize: "1.8rem", color: "#F2EAD8", marginTop: "0.4rem", lineHeight: 1 }}>
            Luis Morales
          </div>
          <div style={{ fontSize: "0.85rem", color: T.textMute, marginTop: "0.4rem" }}>
            On property 7am–10pm · Available 24/7 via WhatsApp
          </div>
        </div>
        <Btn variant="gold" icon="message">Message directly</Btn>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <Eyebrow>What can we arrange?</Eyebrow>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.7rem" }}>
          {SERVICE_CATEGORIES.map(s => (
            <button key={s.id} onClick={() => { setCategory(s.id); setForm({}); setShowNew(true); }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.goldBdr; e.currentTarget.style.background = T.goldBg; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; }}
              style={{
                padding: "1.4rem 1.5rem", background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 12, textAlign: "left", display: "flex", alignItems: "flex-start", gap: "1rem"
              }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: T.goldBg, color: T.gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={s.icon} size={17} />
              </div>
              <div>
                <div style={{ fontSize: "0.92rem", fontWeight: 500, color: T.text }}>{s.id}</div>
                <div style={{ fontSize: "0.75rem", color: T.textDim, marginTop: 4, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal with category-specific form */}
      {showNew && (
        <div onClick={() => setShowNew(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(28,26,20,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: T.card, borderRadius: 14, padding: "0", width: "100%", maxWidth: 600, maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* Modal header */}
            <div style={{ padding: "1.8rem 2.2rem 1.2rem", borderBottom: `1px solid ${T.borderLt}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <Eyebrow>New request · {activeService.id}</Eyebrow>
                  <h2 className="serif-light" style={{ fontSize: "1.6rem", marginTop: "0.4rem", color: T.text, lineHeight: 1.2 }}>
                    How can Luis help with {activeService.id.toLowerCase()}?
                  </h2>
                </div>
                <button onClick={() => setShowNew(false)} style={{ width: 30, height: 30, color: T.textMute, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="close" size={18} />
                </button>
              </div>

              {/* Category pills inside modal */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "1rem" }}>
                {SERVICE_CATEGORIES.map(s => (
                  <button key={s.id} onClick={() => { setCategory(s.id); setForm({}); }}
                    style={{
                      padding: "0.35rem 0.8rem", borderRadius: 100, fontSize: "0.72rem",
                      background: category === s.id ? T.gold : T.cardAlt,
                      color: category === s.id ? "#F2EAD8" : T.textDim,
                      border: `1px solid ${category === s.id ? T.gold : T.border}`,
                      fontWeight: category === s.id ? 500 : 400
                    }}>
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal body - scrollable */}
            <div style={{ padding: "1.5rem 2.2rem", overflow: "auto", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {activeService.fields.map(f => (
                  <FormField key={f.id} field={f} value={form[f.id]} onChange={v => updateField(f.id, v)} />
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding: "1.2rem 2.2rem", borderTop: `1px solid ${T.borderLt}`, background: T.cardAlt, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ fontSize: "0.74rem", color: T.textMute }}>
                Luis usually responds within 1 hour · 7am–10pm
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Btn variant="secondary" onClick={() => setShowNew(false)}>Cancel</Btn>
                <Btn variant="primary" onClick={submit} icon="check">Send to Luis</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <Eyebrow>Your requests ({myRequests.length})</Eyebrow>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {myRequests.length === 0 ? (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "3rem", textAlign: "center" }}>
            <Icon name="concierge" size={32} color={T.textFaint} />
            <p style={{ marginTop: "0.8rem", color: T.textMute, fontSize: "0.88rem" }}>No requests yet — Luis is ready when you are.</p>
          </div>
        ) : (
          myRequests.map(r => {
            const tone = r.status === "completed" ? "green" : r.status === "in-progress" ? "gold" : "default";
            return (
              <div key={r.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "1.4rem 1.6rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
                  <Tag size="sm">{r.category}</Tag>
                  <Tag tone={tone} size="sm">
                    {r.status === "completed" && <Icon name="check" size={11} />}
                    {r.status === "in-progress" && <Icon name="clock" size={11} />}
                    {r.status.replace("-"," ")}
                  </Tag>
                  <span style={{ fontSize: "0.74rem", color: T.textMute, marginLeft: "auto" }}>{fmt(r.date)}</span>
                </div>
                <div className="serif-light" style={{ fontSize: "1.2rem", color: T.text, marginBottom: "0.4rem", lineHeight: 1.25 }}>
                  {r.title}
                </div>
                {r.description && (
                  <pre style={{
                    fontSize: "0.84rem", color: T.textDim, lineHeight: 1.7, fontFamily: "inherit",
                    whiteSpace: "pre-wrap", background: T.cardAlt, padding: "0.9rem 1.1rem",
                    borderRadius: 8, marginTop: "0.6rem", border: `1px solid ${T.borderLt}`
                  }}>{r.description}</pre>
                )}

                {r.reply && (
                  <div style={{ background: T.greenBg, border: `1px solid ${T.greenBdr}`, borderRadius: 10, padding: "1rem 1.2rem", marginTop: "1rem", display: "flex", alignItems: "flex-start", gap: "0.9rem" }}>
                    <Avatar m={{ initials: "LM", color: T.green }} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 500, color: T.green }}>Luis Morales</span>
                        <span style={{ fontSize: "0.7rem", color: T.textMute }}>· Concierge</span>
                      </div>
                      <div style={{ fontSize: "0.86rem", color: T.text, lineHeight: 1.6 }}>{r.reply}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─── FORM FIELD ─── */
function FormField({ field, value, onChange }) {
  const labelEl = (
    <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>
      {field.label}
    </label>
  );
  const inp = {
    width: "100%", padding: "0.7rem 0.95rem", borderRadius: 7,
    border: `1px solid ${T.border}`, background: T.cardAlt,
    fontSize: "0.88rem", color: T.text, fontFamily: "inherit"
  };

  if (field.type === "select") {
    return (
      <div>{labelEl}
        <select value={value || ""} onChange={e => onChange(e.target.value)} style={inp}>
          <option value="">— Select —</option>
          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (field.type === "multi") {
    const sel = value || [];
    function toggle(o) {
      onChange(sel.includes(o) ? sel.filter(x => x !== o) : [...sel, o]);
    }
    return (
      <div>{labelEl}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {field.options.map(o => {
            const on = sel.includes(o);
            return (
              <button key={o} onClick={() => toggle(o)}
                style={{
                  padding: "0.4rem 0.85rem", borderRadius: 100, fontSize: "0.76rem",
                  background: on ? T.green : T.cardAlt,
                  color: on ? "#F2EAD8" : T.textDim,
                  border: `1px solid ${on ? T.green : T.border}`, fontWeight: 500
                }}>
                {on && <Icon name="check" size={10} />} {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <div>{labelEl}
        <textarea value={value || ""} onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder} rows={3}
          style={{ ...inp, resize: "vertical" }} />
      </div>
    );
  }
  return (
    <div>{labelEl}
      <input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={value || ""} onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder} style={inp} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPENSES
═══════════════════════════════════════════════════════ */
function Expenses({ me, expenses }) {
  const [period, setPeriod] = useState("month"); // month | quarter | year | custom
  const [month, setMonth] = useState("2026-02");
  const [quarter, setQuarter] = useState("2026-Q1");
  const [year, setYear] = useState("2026");
  const [customFrom, setCustomFrom] = useState("2026-01-01");
  const [customTo, setCustomTo] = useState("2026-02-28");
  const [filter, setFilter] = useState("all");
  const [openReceipt, setOpenReceipt] = useState(null);

  const myExpenses = expenses.filter(e => e.member === me.id);

  // Determine date range based on period
  function getDateRange() {
    if (period === "month") {
      const [y, m] = month.split("-").map(Number);
      return { from: `${month}-01`, to: `${month}-${String(daysInMonth(y, m-1)).padStart(2,"0")}`, label: new Date(month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
    }
    if (period === "quarter") {
      const [y, q] = quarter.split("-Q");
      const startMonth = (Number(q) - 1) * 3;
      const endMonth = startMonth + 2;
      return { from: `${y}-${String(startMonth+1).padStart(2,"0")}-01`,
               to:   `${y}-${String(endMonth+1).padStart(2,"0")}-${daysInMonth(Number(y), endMonth)}`,
               label: `Q${q} ${y}` };
    }
    if (period === "year") {
      return { from: `${year}-01-01`, to: `${year}-12-31`, label: `Year ${year}` };
    }
    return { from: customFrom, to: customTo, label: `${fmtShort(customFrom)} → ${fmtShort(customTo)}` };
  }

  const { from, to, label: periodLabel } = getDateRange();

  const inRange = myExpenses.filter(e => e.date >= from && e.date <= to);
  const filtered = inRange.filter(e => filter === "all" || e.category === filter).sort((a,b) => new Date(b.date) - new Date(a.date));
  const periodTotal = inRange.reduce((s,e) => s + e.amount, 0);
  const total = filtered.reduce((s,e) => s + e.amount, 0);
  const categories = [...new Set(inRange.map(e => e.category))];

  const months = [...new Set(myExpenses.map(e => e.date.slice(0,7)))].sort().reverse();

  const catStyles = {
    "Maintenance": { icon: "home",      color: T.green },
    "Groceries":   { icon: "shopping",  color: T.gold },
    "Services":    { icon: "dining",    color: T.gold },
    "Activities":  { icon: "activity",  color: T.gold },
    "Transport":   { icon: "transport", color: T.green },
    "Repairs":     { icon: "repair",    color: T.textDim },
    "Other":       { icon: "sparkle",   color: T.textDim },
  };

  function downloadPDF() {
    const txt = [
      "PARAÍSO · 77 LAS CAÑAS I",
      "STATEMENT",
      "",
      `Account: ${me.name}`,
      `Period: ${periodLabel}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "─────────────────────────────────────",
      "DATE       DESCRIPTION                    AMOUNT",
      "─────────────────────────────────────",
      ...inRange.map(e =>
        `${e.date}  ${e.description.padEnd(28).slice(0,28)}  $${e.amount.toFixed(2).padStart(8)}`
      ),
      "─────────────────────────────────────",
      `TOTAL: $${periodTotal.toFixed(2)}`,
      "",
      "Thank you for being part of Paraíso."
    ].join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paraiso-statement-${periodLabel.replace(/\s/g,"-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="slide" style={{ maxWidth: 1080, margin: "0 auto", padding: "3rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Eyebrow>Account · 2026</Eyebrow>
        <h1 className="serif-light" style={{ fontSize: "3rem", color: T.text, marginTop: "0.5rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
          Your statement.
        </h1>
        <p style={{ color: T.textDim, fontSize: "0.92rem", marginTop: "0.5rem" }}>
          Every charge — itemized, receipted, downloadable.
        </p>
      </div>

      <div style={{ background: T.cardAlt, color: "#F2EAD8", borderRadius: 16, padding: "2.5rem 3rem", marginBottom: "1.5rem", position: "relative", overflow: "hidden", border: `1px solid ${T.border}` }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(176,142,74,0.15), transparent 70%)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: T.textFaint }}>
              Statement period
            </div>
            <div className="serif-light" style={{ fontSize: "1.4rem", color: "#F2EAD8", marginTop: "0.4rem" }}>
              {periodLabel}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: T.textFaint }}>
              Account holder
            </div>
            <div className="serif-light" style={{ fontSize: "1.1rem", color: "#F2EAD8", marginTop: "0.4rem" }}>
              {me.name}
            </div>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: T.gold, marginBottom: "0.6rem" }}>
            {period === "month" ? "Balance due" : "Total spent"}
          </div>
          <div className="serif-light" style={{ fontSize: "4rem", color: "#F2EAD8", lineHeight: 1, letterSpacing: "-0.02em" }}>
            ${periodTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "0.85rem", color: T.textFaint, marginTop: "0.7rem" }}>
            {inRange.length} transactions · {period === "month" ? "Due by the 15th of next month" : `${periodLabel}`}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.8rem", position: "relative", zIndex: 1 }}>
          {period === "month" && <Btn variant="gold" icon="check">Pay balance now</Btn>}
          <button onClick={downloadPDF}
            style={{ padding: "0.65rem 1.2rem", borderRadius: 6, background: "transparent", border: `1px solid ${T.textFaint}`, color: T.textFaint, fontSize: "0.82rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="download" size={14} /> Download statement
          </button>
        </div>
      </div>

      {/* Period mode selector */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {[
          { id: "month",   label: "Monthly" },
          { id: "quarter", label: "Quarterly" },
          { id: "year",    label: "Yearly" },
          { id: "custom",  label: "Custom range" },
        ].map(p => (
          <button key={p.id} onClick={() => setPeriod(p.id)}
            style={{
              padding: "0.45rem 1rem", borderRadius: 7, fontSize: "0.78rem",
              background: period === p.id ? T.text : T.cardAlt,
              color: period === p.id ? T.bg : T.textDim,
              border: `1px solid ${period === p.id ? T.text : T.border}`,
              fontWeight: 500
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Period-specific input */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {period === "month" && (
          <select value={month} onChange={e => setMonth(e.target.value)}
            style={{ padding: "0.55rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.card, fontSize: "0.82rem", color: T.text, fontWeight: 500 }}>
            {months.map(m => {
              const lbl = new Date(m + "-01").toLocaleDateString("en-US",{ month: "long", year: "numeric" });
              return <option key={m} value={m}>{lbl}</option>;
            })}
          </select>
        )}
        {period === "quarter" && (
          <select value={quarter} onChange={e => setQuarter(e.target.value)}
            style={{ padding: "0.55rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.card, fontSize: "0.82rem", color: T.text, fontWeight: 500 }}>
            {["Q1","Q2","Q3","Q4"].map(q => (
              <option key={q} value={`2026-${q}`}>2026 · {q}</option>
            ))}
            {["Q1","Q2","Q3","Q4"].map(q => (
              <option key={`2025${q}`} value={`2025-${q}`}>2025 · {q}</option>
            ))}
          </select>
        )}
        {period === "year" && (
          <select value={year} onChange={e => setYear(e.target.value)}
            style={{ padding: "0.55rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.card, fontSize: "0.82rem", color: T.text, fontWeight: 500 }}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        )}
        {period === "custom" && (
          <>
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
              style={{ padding: "0.5rem 0.85rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.card, fontSize: "0.82rem", color: T.text }} />
            <span style={{ color: T.textMute, fontSize: "0.85rem" }}>to</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
              style={{ padding: "0.5rem 0.85rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.card, fontSize: "0.82rem", color: T.text }} />
          </>
        )}
      </div>

      {/* Pie chart + summary grid */}
      {categories.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "1.8rem 2rem", marginBottom: "1.5rem", alignItems: "center" }}>
          <div>
            <Eyebrow>Spend breakdown</Eyebrow>
            <div style={{ marginTop: "1rem" }}>
              <PieChart
                data={categories.map(c => {
                  const cs = catStyles[c];
                  const amt = inRange.filter(e => e.category === c).reduce((s,e) => s + e.amount, 0);
                  return { label: c, value: amt, color: cs.color };
                })}
                size={180}
                total={periodTotal}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
            {categories.map(c => {
              const catTotal = inRange.filter(e => e.category === c).reduce((s,e) => s + e.amount, 0);
              const pct = (catTotal / periodTotal * 100).toFixed(0);
              const cs = catStyles[c];
              return (
                <div key={c} style={{ padding: "0.9rem 1rem", background: T.cardAlt, border: `1px solid ${T.borderLt}`, borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: cs.color }} />
                    <span style={{ fontSize: "0.72rem", color: T.textMute, letterSpacing: "0.04em" }}>{c}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div className="serif-light" style={{ fontSize: "1.3rem", color: T.text, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                      ${catTotal.toFixed(0)}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: T.textMute }}>{pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <Eyebrow>Transactions</Eyebrow>
        <div style={{ width: 1, height: 18, background: T.border, margin: "0 0.4rem" }} />
        <button onClick={() => setFilter("all")}
          style={{
            padding: "0.45rem 0.95rem", borderRadius: 100, fontSize: "0.78rem",
            background: filter === "all" ? T.gold : T.cardAlt,
            color: filter === "all" ? "#F2EAD8" : T.textDim,
            border: `1px solid ${filter === "all" ? T.gold : T.border}`,
            fontWeight: 500
          }}>
          All categories
        </button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{
              padding: "0.45rem 0.95rem", borderRadius: 100, fontSize: "0.78rem",
              background: filter === c ? T.gold : T.cardAlt,
              color: filter === c ? "#F2EAD8" : T.textDim,
              border: `1px solid ${filter === c ? T.gold : T.border}`,
              fontWeight: 500
            }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 140px 130px 90px", padding: "0.9rem 1.6rem", background: T.cardAlt, borderBottom: `1px solid ${T.border}` }}>
          {["Date","Description","Category","Amount","Receipt"].map((h,i) => (
            <div key={h} style={{ fontSize: "0.66rem", fontWeight: 500, letterSpacing: "0.14em", color: T.textMute, textTransform: "uppercase", textAlign: i >= 3 ? "right" : "left" }}>
              {h}
            </div>
          ))}
        </div>
        {filtered.map((e, i) => {
          const cs = catStyles[e.category] || catStyles.Other;
          return (
            <div key={e.id} style={{
              display: "grid", gridTemplateColumns: "120px 1fr 140px 130px 90px",
              padding: "1.1rem 1.6rem", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? `1px solid ${T.borderLt}` : "none",
              transition: "background .12s"
            }}
              onMouseEnter={ev => ev.currentTarget.style.background = T.cardAlt}
              onMouseLeave={ev => ev.currentTarget.style.background = T.card}>
              <div style={{ fontSize: "0.82rem", color: T.textDim }}>{fmtShort(e.date)}</div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 500, color: T.text }}>{e.description}</div>
                <div style={{ fontSize: "0.74rem", color: T.textMute, marginTop: 2 }}>{e.vendor}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: cs.color, display: "flex" }}><Icon name={cs.icon} size={15} /></span>
                <span style={{ fontSize: "0.8rem", color: T.textDim }}>{e.category}</span>
              </div>
              <div style={{ textAlign: "right", fontSize: "0.96rem", fontWeight: 500, color: T.text, fontVariantNumeric: "tabular-nums" }}>
                ${e.amount.toFixed(2)}
              </div>
              <div style={{ textAlign: "right" }}>
                {e.receipt && (
                  <button onClick={() => setOpenReceipt(e)}
                    onMouseEnter={ev => { ev.currentTarget.style.background = T.gold; ev.currentTarget.style.color = "#F2EAD8"; }}
                    onMouseLeave={ev => { ev.currentTarget.style.background = T.goldBg; ev.currentTarget.style.color = T.goldDk; }}
                    style={{ padding: "0.35rem 0.75rem", borderRadius: 5, background: T.goldBg, border: `1px solid ${T.goldBdr}`, color: T.goldDk, fontSize: "0.72rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4, transition: "all .15s" }}>
                    <Icon name="eye" size={11} /> View
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 140px 130px 90px", padding: "1.1rem 1.6rem", background: T.cardAlt, borderTop: `1px solid ${T.border}` }}>
            <div />
            <div style={{ fontSize: "0.82rem", fontWeight: 500 }}>Subtotal {filter !== "all" ? `(${filter})` : ""}</div>
            <div />
            <div style={{ textAlign: "right", fontSize: "1.05rem", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
              ${total.toFixed(2)}
            </div>
            <div />
          </div>
        )}
      </div>

      {/* Receipt modal */}
      {openReceipt && (
        <ReceiptModal expense={openReceipt} onClose={() => setOpenReceipt(null)} />
      )}
    </div>
  );
}

/* ─── PIE CHART ─── */
function PieChart({ data, size = 160, total }) {
  const filtered = data.filter(d => d.value > 0);
  if (filtered.length === 0 || total === 0) return null;

  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
  const inner = r * 0.6;

  let cumAngle = -Math.PI / 2;
  const slices = filtered.map((d, i) => {
    const angle = (d.value / total) * Math.PI * 2;
    const start = cumAngle;
    const end = cumAngle + angle;
    cumAngle = end;

    const x1 = cx + Math.cos(start) * r;
    const y1 = cy + Math.sin(start) * r;
    const x2 = cx + Math.cos(end) * r;
    const y2 = cy + Math.sin(end) * r;
    const xi2 = cx + Math.cos(end) * inner;
    const yi2 = cy + Math.sin(end) * inner;
    const xi1 = cx + Math.cos(start) * inner;
    const yi1 = cy + Math.sin(start) * inner;
    const largeArc = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${xi2} ${yi2}`,
      `A ${inner} ${inner} 0 ${largeArc} 0 ${xi1} ${yi1}`,
      "Z"
    ].join(" ");

    return { path, color: d.color, label: d.label };
  });

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ fontSize: "0.62rem", color: T.textMute, letterSpacing: "0.15em", textTransform: "uppercase" }}>Total</div>
        <div className="serif-light" style={{ fontSize: "1.3rem", color: T.text, fontVariantNumeric: "tabular-nums", lineHeight: 1, marginTop: 2 }}>
          ${total.toFixed(0)}
        </div>
      </div>
    </div>
  );
}

/* ─── RECEIPT MODAL ─── */
function ReceiptModal({ expense, onClose }) {
  const r = expense.receipt;
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(28,26,20,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: T.bgWarm, borderRadius: 12, padding: "1.5rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }}>

        {/* Modal header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
          <Eyebrow>Receipt</Eyebrow>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button style={{ width: 32, height: 32, borderRadius: 6, background: T.card, border: `1px solid ${T.border}`, color: T.textDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="download" size={14} />
            </button>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 6, background: T.card, border: `1px solid ${T.border}`, color: T.textDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="close" size={14} />
            </button>
          </div>
        </div>

        {/* The receipt itself — looks like a paper receipt */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 6,
          padding: "2rem 2rem 1.5rem",
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          position: "relative",
          fontFamily: "'Inter', monospace",
          color: "#1C1A14"
        }}>
          {/* Decorative top edge — receipt scallop */}
          <div style={{
            position: "absolute", top: -8, left: 0, right: 0, height: 8,
            background: `radial-gradient(circle at 8px 8px, transparent 6px, #FFFFFF 6.5px)`,
            backgroundSize: "16px 16px",
            backgroundPosition: "0 -8px"
          }} />

          {/* Header */}
          <div style={{ textAlign: "center", paddingBottom: "1.2rem", borderBottom: `1px dashed #E8E2D0` }}>
            <div className="serif" style={{ fontSize: "1.4rem", color: "#1C1A14", lineHeight: 1 }}>
              {expense.vendor}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#9A9385", marginTop: 6, letterSpacing: "0.04em" }}>
              {expense.category}
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1rem", padding: "1rem 0", borderBottom: `1px dashed #E8E2D0`, fontSize: "0.78rem" }}>
            <div>
              <div style={{ color: "#9A9385", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Invoice</div>
              <div style={{ color: "#1C1A14", fontWeight: 500 }}>{r.invoiceNo}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#9A9385", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Date</div>
              <div style={{ color: "#1C1A14", fontWeight: 500 }}>{fmt(expense.date)}</div>
            </div>
            <div>
              <div style={{ color: "#9A9385", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Paid via</div>
              <div style={{ color: "#1C1A14", fontWeight: 500 }}>{r.paymentMethod}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#9A9385", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Time</div>
              <div style={{ color: "#1C1A14", fontWeight: 500 }}>{r.paidAt.split(" ")[1]}</div>
            </div>
          </div>

          {/* Items */}
          <div style={{ padding: "1rem 0", borderBottom: "1px dashed #E8E2D0" }}>
            {r.items.map((it, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", padding: "0.5rem 0", fontSize: "0.82rem" }}>
                <div style={{ color: "#1C1A14" }}>
                  {it.name}
                  {it.qty > 1 && <span style={{ color: "#9A9385", marginLeft: 6 }}>× {it.qty}</span>}
                </div>
                <div style={{ color: "#1C1A14", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                  ${(it.price * it.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ padding: "1rem 0", borderBottom: "1px dashed #E8E2D0", fontSize: "0.82rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0", color: "#6B655A" }}>
              <span>Subtotal</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>${r.subtotal.toFixed(2)}</span>
            </div>
            {r.tax > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0", color: "#6B655A" }}>
                <span>Tax (ITBIS)</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>${r.tax.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0 0", color: "#1C1A14", fontWeight: 500, fontSize: "1rem" }}>
              <span>Total</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }} className="serif">${r.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Split / your share */}
          {r.splitNote && (
            <div style={{ padding: "1rem 0", borderBottom: "1px dashed #E8E2D0" }}>
              <div style={{ background: "#F4ECD8", border: "1px solid #E0D0A5", borderRadius: 6, padding: "0.7rem 0.9rem" }}>
                <div style={{ fontSize: "0.72rem", color: "#8A6E36", fontWeight: 500, marginBottom: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Cost split
                </div>
                <div style={{ fontSize: "0.82rem", color: "#1C1A14" }}>{r.splitNote}</div>
              </div>
            </div>
          )}

          {/* Notes */}
          {r.notes && (
            <div style={{ paddingTop: "1rem" }}>
              <div style={{ fontSize: "0.66rem", color: "#9A9385", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                Notes from Luis
              </div>
              <p className="serif-italic" style={{ fontSize: "0.86rem", color: "#6B655A", lineHeight: 1.6 }}>
                "{r.notes}"
              </p>
            </div>
          )}

          {/* Bottom scallop */}
          <div style={{ marginTop: "1.5rem", textAlign: "center", color: "#C5BDA9", fontSize: "0.68rem", letterSpacing: "0.15em" }}>
            · · ·  THANK YOU  · · ·
          </div>
        </div>

        <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.74rem", color: "#9A9385" }}>
          Receipt verified by Paraíso Management · All charges are itemized and transparent
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SWAPS
═══════════════════════════════════════════════════════ */
function Swaps({ me, res, swaps, setSwaps, setRes }) {
  const [showNew, setShowNew] = useState(false);
  const [toMember, setToMember] = useState(MEMBERS.filter(m => m.id !== me.id)[0].id);
  const [theirDateId, setTheirDateId] = useState("");
  const [myDateId, setMyDateId] = useState("");
  const [message, setMessage] = useState("");

  const incoming = swaps.filter(s => s.to === me.id);
  const outgoing = swaps.filter(s => s.from === me.id);
  const myDates = res.filter(r => r.member === me.id);

  function submitSwap() {
    if (!theirDateId || !myDateId || !message.trim()) { alert("Please complete all fields."); return; }
    const theirs = res.find(r => r.id === Number(theirDateId));
    const mine = res.find(r => r.id === Number(myDateId));
    if (!theirs || !mine) return;
    setSwaps(p => [...p, {
      id: Date.now(), from: me.id, to: toMember,
      fromDate: mine.start, fromDays: mine.days,
      toDate: theirs.start, toDays: theirs.days,
      message: message.trim(), status: "pending",
      date: new Date().toISOString().split("T")[0]
    }]);
    setShowNew(false); setMessage(""); setTheirDateId(""); setMyDateId("");
  }

  function accept(s) {
    setRes(prev => prev.map(r => {
      if (r.start === s.fromDate && r.member === s.from) return { ...r, member: s.to };
      if (r.start === s.toDate && r.member === s.to) return { ...r, member: s.from };
      return r;
    }));
    setSwaps(prev => prev.map(x => x.id === s.id ? { ...x, status: "accepted" } : x));
  }

  function decline(s) {
    setSwaps(prev => prev.map(x => x.id === s.id ? { ...x, status: "declined" } : x));
  }

  const theirDates = res.filter(r => r.member === toMember);

  return (
    <div className="slide" style={{ maxWidth: 1080, margin: "0 auto", padding: "3rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Eyebrow>Date swaps</Eyebrow>
          <h1 className="serif-light" style={{ fontSize: "3rem", color: T.text, marginTop: "0.5rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
            Trade dates gracefully.
          </h1>
          <p style={{ color: T.textDim, fontSize: "0.92rem", marginTop: "0.5rem", maxWidth: 540 }}>
            Propose a swap with a co-owner — they accept, and your reservations exchange. Perfect for when plans change.
          </p>
        </div>
        <Btn variant="primary" size="lg" icon="swap" onClick={() => setShowNew(true)}>Propose swap</Btn>
      </div>

      {showNew && (
        <div onClick={() => setShowNew(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(28,26,20,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: T.card, borderRadius: 14, padding: "2.2rem", width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto" }}>
            <Eyebrow>Propose a swap</Eyebrow>
            <h2 className="serif-light" style={{ fontSize: "1.7rem", marginTop: "0.5rem", marginBottom: "1.5rem", color: T.text }}>
              Trade dates with a co-owner
            </h2>

            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>
                Which co-owner?
              </label>
              <select value={toMember} onChange={e => { setToMember(Number(e.target.value)); setTheirDateId(""); }}
                style={{ width: "100%", padding: "0.7rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.cardAlt, fontSize: "0.88rem", color: T.text }}>
                {MEMBERS.filter(m => m.id !== me.id).map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>
                Their dates you want
              </label>
              {theirDates.length === 0 ? (
                <p style={{ fontSize: "0.82rem", color: T.textMute, fontStyle: "italic", padding: "0.5rem 0" }}>This member has no bookings.</p>
              ) : (
                <select value={theirDateId} onChange={e => setTheirDateId(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.cardAlt, fontSize: "0.88rem", color: T.text }}>
                  <option value="">— Select dates —</option>
                  {theirDates.map(r => (
                    <option key={r.id} value={r.id}>{r.label} · {fmt(r.start)} ({r.days}n)</option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>
                Your dates to offer
              </label>
              {myDates.length === 0 ? (
                <p style={{ fontSize: "0.82rem", color: T.textMute, fontStyle: "italic", padding: "0.5rem 0" }}>You have no bookings to offer.</p>
              ) : (
                <select value={myDateId} onChange={e => setMyDateId(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.cardAlt, fontSize: "0.88rem", color: T.text }}>
                  <option value="">— Select dates —</option>
                  {myDates.map(r => (
                    <option key={r.id} value={r.id}>{r.label} · {fmt(r.start)} ({r.days}n)</option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>
                Personal message
              </label>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="A friendly note explaining why you'd like to swap…"
                rows={4}
                style={{ width: "100%", padding: "0.7rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.cardAlt, fontSize: "0.88rem", color: T.text, resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setShowNew(false)}>Cancel</Btn>
              <Btn variant="primary" onClick={submitSwap} icon="check">Send proposal</Btn>
            </div>
          </div>
        </div>
      )}

      <Panel title={`Incoming proposals · ${incoming.filter(s => s.status === "pending").length} pending`} padding="2rem">
        {incoming.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2.5rem", color: T.textMute }}>
            <Icon name="swap" size={28} color={T.textFaint} />
            <p style={{ marginTop: "0.7rem", fontSize: "0.88rem" }}>No incoming swap proposals.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {incoming.map(s => {
              const from = mByID(s.from);
              const tone = s.status === "pending" ? "gold" : s.status === "accepted" ? "green" : "red";
              return (
                <div key={s.id} style={{
                  background: s.status === "pending" ? T.goldBg : T.cardAlt,
                  border: `1px solid ${s.status === "pending" ? T.goldBdr : T.borderLt}`,
                  borderRadius: 12, padding: "1.3rem 1.5rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "1rem" }}>
                    <Avatar m={from} size={40} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: T.text, fontSize: "0.92rem" }}>{from.name}</div>
                      <div style={{ fontSize: "0.74rem", color: T.textMute }}>Sent {fmt(s.date)}</div>
                    </div>
                    <Tag tone={tone}>{s.status}</Tag>
                  </div>

                  <div style={{ background: T.card, border: `1px solid ${T.borderLt}`, borderRadius: 10, padding: "1.1rem 1.3rem", marginBottom: "0.9rem", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "1.2rem" }}>
                    <div>
                      <Eyebrow color={T.green}>They give you</Eyebrow>
                      <div className="serif-light" style={{ fontSize: "1.1rem", color: T.text, marginTop: 4 }}>{fmt(s.toDate)}</div>
                      <div style={{ fontSize: "0.75rem", color: T.textMute }}>{s.toDays} nights</div>
                    </div>
                    <div style={{ color: T.gold, display: "flex" }}><Icon name="swap" size={22} stroke={1.2} /></div>
                    <div style={{ textAlign: "right" }}>
                      <Eyebrow color={T.red}>You give them</Eyebrow>
                      <div className="serif-light" style={{ fontSize: "1.1rem", color: T.text, marginTop: 4 }}>{fmt(s.fromDate)}</div>
                      <div style={{ fontSize: "0.75rem", color: T.textMute }}>{s.fromDays} nights</div>
                    </div>
                  </div>

                  <p className="serif-italic" style={{ fontSize: "0.95rem", color: T.textDim, lineHeight: 1.6, marginBottom: s.status === "pending" ? "1rem" : 0 }}>
                    "{s.message}"
                  </p>

                  {s.status === "pending" && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Btn variant="primary" onClick={() => accept(s)} icon="check">Accept</Btn>
                      <Btn variant="secondary" onClick={() => decline(s)}>Decline</Btn>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <div style={{ marginTop: "1rem" }}>
        <Panel title={`Sent proposals · ${outgoing.length} total`}>
          {outgoing.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: T.textMute, textAlign: "center", padding: "1.2rem 0" }}>
              You haven't sent any swap proposals yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {outgoing.map(s => {
                const to = mByID(s.to);
                const tone = s.status === "pending" ? "gold" : s.status === "accepted" ? "green" : "red";
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.9rem 1.1rem", background: T.cardAlt, border: `1px solid ${T.borderLt}`, borderRadius: 10 }}>
                    <Avatar m={to} size={34} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.88rem", color: T.text }}>
                        To <strong>{to.name}</strong>
                      </div>
                      <div style={{ fontSize: "0.74rem", color: T.textMute }}>
                        {fmtShort(s.fromDate)} → {fmtShort(s.toDate)} · Sent {fmt(s.date)}
                      </div>
                    </div>
                    <Tag tone={tone}>{s.status}</Tag>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMMUNITY BOARD (was Co-owners)
═══════════════════════════════════════════════════════ */

const PROPOSALS_INIT = [
  {
    id: 1, author: 3, type: "purchase",
    title: "New BBQ grill for the pavilion",
    body: "The current Weber is from 2019 and has been showing rust. I'm proposing we upgrade to a Lynx 42\" — built-in, infrared, will last 15+ years. It would make hosting much more enjoyable.",
    cost: 6800, perOwner: 850,
    createdAt: "2026-02-04", status: "open",
    votes: { 1:"yes", 2:"yes", 3:"yes", 5:"yes", 7:"abstain" },
    comments: [
      { author: 1, text: "Strongly in favor. The current one is past its prime.", at: "2026-02-04" },
      { author: 7, text: "Could we get a few quotes first? Lynx is excellent but pricey.", at: "2026-02-05" },
      { author: 3, text: "Sure — I'll have Carmen pull 3 quotes by Friday.", at: "2026-02-05" },
    ]
  },
  {
    id: 2, author: 7, type: "decision",
    title: "Replace the master bedroom artwork",
    body: "Catherine and I were talking — the current pieces feel dated. I'd love to commission something from a local Dominican artist. Would feel more in tune with the location. Budget around $4-6k.",
    cost: 5000, perOwner: 625,
    createdAt: "2026-02-01", status: "open",
    votes: { 1:"yes", 3:"yes", 7:"yes", 4:"no", 5:"abstain" },
    comments: [
      { author: 4, text: "I actually like the current pieces. Could we save this for next year?", at: "2026-02-02" },
      { author: 3, text: "Maybe a middle ground — refresh just one wall as a trial?", at: "2026-02-02" },
    ]
  },
  {
    id: 3, author: 5, type: "improvement",
    title: "Add Starlink for backup internet",
    body: "Lost internet during my last stay for 6 hours. For roughly $120/month, Starlink would give us a reliable backup. I think it's worth it given how many of us work remotely.",
    cost: 1440, perOwner: 180,
    createdAt: "2026-01-28", status: "approved",
    votes: { 1:"yes", 2:"yes", 3:"yes", 4:"yes", 5:"yes", 6:"yes", 7:"yes", 8:"abstain" },
    comments: [
      { author: 2, text: "Already on it — installed last week. Working great.", at: "2026-02-03" },
    ]
  },
  {
    id: 4, author: 1, type: "event",
    title: "Owners' weekend — proposed for April 24-26",
    body: "Would love to host all of us at the villa for a weekend. Get to know each other better, discuss the house, share a few meals. Costs split 8 ways. Anyone interested?",
    cost: null, perOwner: null,
    createdAt: "2026-02-07", status: "open",
    votes: { 1:"yes", 3:"yes", 6:"yes", 8:"yes" },
    comments: [
      { author: 6, text: "I'd love to come! Let me check flights from São Paulo.", at: "2026-02-08" },
      { author: 8, text: "Yes please. Will bring wine from Tuscany.", at: "2026-02-08" },
    ]
  },
];

function Owners({ me }) {
  const [proposals, setProposals] = useState(PROPOSALS_INIT);
  const [filter, setFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ type: "purchase", title: "", body: "", cost: "" });
  const [expanded, setExpanded] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");

  function castVote(proposalId, choice) {
    setProposals(p => p.map(pr => {
      if (pr.id !== proposalId) return pr;
      const votes = { ...pr.votes };
      if (votes[me.id] === choice) delete votes[me.id];
      else votes[me.id] = choice;
      return { ...pr, votes };
    }));
  }

  function addComment(proposalId) {
    if (!commentDraft.trim()) return;
    setProposals(p => p.map(pr => {
      if (pr.id !== proposalId) return pr;
      return { ...pr, comments: [...pr.comments, { author: me.id, text: commentDraft.trim(), at: new Date().toISOString().split("T")[0] }] };
    }));
    setCommentDraft("");
  }

  function createProposal() {
    if (!draft.title.trim() || !draft.body.trim()) { alert("Please fill in a title and description."); return; }
    const cost = draft.cost ? Number(draft.cost.replace(/[^0-9.]/g,"")) : null;
    setProposals(p => [{
      id: Date.now(), author: me.id, type: draft.type,
      title: draft.title.trim(), body: draft.body.trim(),
      cost, perOwner: cost ? Math.round(cost/8) : null,
      createdAt: new Date().toISOString().split("T")[0], status: "open",
      votes: { [me.id]: "yes" }, comments: []
    }, ...p]);
    setShowNew(false);
    setDraft({ type: "purchase", title: "", body: "", cost: "" });
  }

  const filtered = filter === "all" ? proposals : proposals.filter(p => p.type === filter);
  const openCount = proposals.filter(p => p.status === "open").length;

  const typeConfig = {
    purchase:    { label: "Group purchase", icon: "shopping",  color: T.gold },
    decision:    { label: "Decision",       icon: "info",      color: T.green },
    improvement: { label: "Improvement",    icon: "sparkle",   color: T.gold },
    event:       { label: "Event",          icon: "calendar",  color: T.green },
  };

  return (
    <div className="slide" style={{ maxWidth: 1080, margin: "0 auto", padding: "3rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Eyebrow>Community board · 8 owners</Eyebrow>
          <h1 className="serif-light" style={{ fontSize: "3rem", color: T.text, marginTop: "0.5rem", lineHeight: 1, letterSpacing: "-0.01em" }}>
            Decide together.
          </h1>
          <p style={{ color: T.textDim, fontSize: "0.92rem", marginTop: "0.5rem", maxWidth: 580 }}>
            Propose purchases, suggest improvements, plan events, and vote on shared decisions. The house is yours — and theirs.
          </p>
        </div>
        <Btn variant="primary" size="lg" icon="plus" onClick={() => setShowNew(true)}>New proposal</Btn>
      </div>

      {/* Co-owner avatars strip */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "1.3rem 1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" }}>
          <Eyebrow>The eight of you</Eyebrow>
          <span style={{ fontSize: "0.74rem", color: T.textMute }}>
            {openCount} open {openCount === 1 ? "proposal" : "proposals"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {MEMBERS.map(m => {
            const isMe = m.id === me.id;
            return (
              <div key={m.id} title={m.name} style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 0.9rem", borderRadius: 100,
                background: isMe ? T.goldBg : T.cardAlt,
                border: `1px solid ${isMe ? T.goldBdr : T.borderLt}`
              }}>
                <Avatar m={m} size={24} />
                <span style={{ fontSize: "0.78rem", fontWeight: isMe ? 500 : 400, color: T.text }}>
                  {m.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
        {[
          { id: "all",         label: "All", count: proposals.length },
          { id: "purchase",    label: "Purchases", count: proposals.filter(p => p.type === "purchase").length },
          { id: "improvement", label: "Improvements", count: proposals.filter(p => p.type === "improvement").length },
          { id: "decision",    label: "Decisions", count: proposals.filter(p => p.type === "decision").length },
          { id: "event",       label: "Events", count: proposals.filter(p => p.type === "event").length },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{
              padding: "0.45rem 0.95rem", borderRadius: 100, fontSize: "0.78rem",
              background: filter === f.id ? T.gold : T.cardAlt,
              color: filter === f.id ? "#F2EAD8" : T.textDim,
              border: `1px solid ${filter === f.id ? T.gold : T.border}`,
              fontWeight: 500
            }}>
            {f.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* New proposal modal */}
      {showNew && (
        <div onClick={() => setShowNew(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(28,26,20,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: T.card, borderRadius: 14, padding: "2rem", width: "100%", maxWidth: 540, maxHeight: "92vh", overflow: "auto" }}>
            <Eyebrow>New proposal</Eyebrow>
            <h2 className="serif-light" style={{ fontSize: "1.5rem", marginTop: "0.5rem", marginBottom: "1.5rem", color: T.text }}>
              Bring it to the group.
            </h2>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>Type</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {Object.entries(typeConfig).map(([k, v]) => (
                  <button key={k} onClick={() => setDraft(d => ({ ...d, type: k }))}
                    style={{
                      padding: "0.4rem 0.8rem", borderRadius: 100, fontSize: "0.78rem",
                      background: draft.type === k ? T.gold : T.cardAlt,
                      color: draft.type === k ? "#F2EAD8" : T.textDim,
                      border: `1px solid ${draft.type === k ? T.gold : T.border}`,
                      fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5
                    }}>
                    <Icon name={v.icon} size={12} /> {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>Title</label>
              <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="What's the proposal?"
                style={{ width: "100%", padding: "0.7rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.cardAlt, fontSize: "0.88rem", color: T.text }} />
            </div>

            <div style={{ marginBottom: "1.1rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>Details</label>
              <textarea value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
                placeholder="Explain the proposal, why it's worth it, and any context..."
                rows={5}
                style={{ width: "100%", padding: "0.7rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.cardAlt, fontSize: "0.88rem", color: T.text, resize: "vertical", fontFamily: "inherit" }} />
            </div>

            {(draft.type === "purchase" || draft.type === "improvement") && (
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textDim, display: "block", marginBottom: "0.5rem" }}>
                  Total cost (USD) · split 8 ways
                </label>
                <input value={draft.cost} onChange={e => setDraft(d => ({ ...d, cost: e.target.value }))}
                  placeholder="$5,000"
                  style={{ width: "100%", padding: "0.7rem 0.95rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.cardAlt, fontSize: "0.88rem", color: T.text }} />
                {draft.cost && !isNaN(Number(draft.cost.replace(/[^0-9.]/g,""))) && (
                  <p style={{ marginTop: 6, fontSize: "0.75rem", color: T.gold }}>
                    ≈ ${Math.round(Number(draft.cost.replace(/[^0-9.]/g,""))/8).toLocaleString()} per owner
                  </p>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={() => setShowNew(false)}>Cancel</Btn>
              <Btn variant="primary" onClick={createProposal} icon="check">Post proposal</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Proposals feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {filtered.length === 0 ? (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "3rem", textAlign: "center" }}>
            <Icon name="message" size={28} color={T.textFaint} />
            <p style={{ marginTop: "0.8rem", color: T.textMute, fontSize: "0.88rem" }}>No proposals yet — start the conversation.</p>
          </div>
        ) : (
          filtered.map(p => {
            const author = mByID(p.author);
            const tc = typeConfig[p.type];
            const yes = Object.values(p.votes).filter(v => v === "yes").length;
            const no  = Object.values(p.votes).filter(v => v === "no").length;
            const abstain = Object.values(p.votes).filter(v => v === "abstain").length;
            const totalVotes = yes + no + abstain;
            const myVote = p.votes[me.id];
            const isExpanded = expanded === p.id;
            const isMine = p.author === me.id;
            const isApproved = p.status === "approved";

            return (
              <div key={p.id} style={{
                background: T.card, border: `1px solid ${isApproved ? T.greenBdr : T.border}`,
                borderRadius: 12, overflow: "hidden"
              }}>
                {/* Header */}
                <div style={{ padding: "1.4rem 1.6rem", borderBottom: isExpanded ? `1px solid ${T.borderLt}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem" }}>
                    <Avatar m={author} size={42} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: T.text }}>
                          {isMine ? "You" : author.name.split(" ")[0]}
                        </span>
                        <Tag tone={p.type === "purchase" || p.type === "improvement" ? "gold" : "green"} size="sm">
                          <Icon name={tc.icon} size={10} /> {tc.label}
                        </Tag>
                        {isApproved && <Tag tone="green" size="sm"><Icon name="check" size={10} /> Approved</Tag>}
                        <span style={{ fontSize: "0.72rem", color: T.textMute, marginLeft: "auto" }}>{fmt(p.createdAt)}</span>
                      </div>
                      <h3 className="serif-light" style={{ fontSize: "1.3rem", color: T.text, marginTop: "0.4rem", lineHeight: 1.25 }}>
                        {p.title}
                      </h3>
                      <p style={{ fontSize: "0.88rem", color: T.textDim, lineHeight: 1.65, marginTop: "0.5rem" }}>
                        {p.body}
                      </p>

                      {/* Cost split */}
                      {p.cost && (
                        <div style={{ marginTop: "0.9rem", display: "inline-flex", alignItems: "center", gap: "1rem", padding: "0.6rem 1rem", background: T.goldBg, border: `1px solid ${T.goldBdr}`, borderRadius: 8 }}>
                          <div>
                            <div style={{ fontSize: "0.66rem", color: T.goldDk, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Total cost</div>
                            <div className="serif" style={{ fontSize: "1.1rem", color: T.text }}>${p.cost.toLocaleString()}</div>
                          </div>
                          <div style={{ width: 1, height: 28, background: T.goldBdr }} />
                          <div>
                            <div style={{ fontSize: "0.66rem", color: T.goldDk, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Your share (1/8)</div>
                            <div className="serif" style={{ fontSize: "1.1rem", color: T.text }}>${p.perOwner.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vote tally + actions */}
                  <div style={{ marginTop: "1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green }} />
                        <span style={{ color: T.textDim }}>{yes} yes</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.red }} />
                        <span style={{ color: T.textDim }}>{no} no</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.textFaint }} />
                        <span style={{ color: T.textDim }}>{abstain} abstain</span>
                      </div>
                      <span style={{ fontSize: "0.74rem", color: T.textMute }}>
                        · {totalVotes}/8 voted
                      </span>
                    </div>

                    {!isApproved && (
                      <div style={{ display: "flex", gap: "0.3rem" }}>
                        {[
                          { id: "yes",     label: "Yes",     color: T.green, bg: T.greenBg, bdr: T.greenBdr },
                          { id: "no",      label: "No",      color: T.red,   bg: T.redBg,   bdr: T.redBdr },
                          { id: "abstain", label: "Abstain", color: T.textDim, bg: T.cardAlt, bdr: T.border },
                        ].map(v => {
                          const on = myVote === v.id;
                          return (
                            <button key={v.id} onClick={() => castVote(p.id, v.id)}
                              style={{
                                padding: "0.4rem 0.85rem", borderRadius: 6, fontSize: "0.76rem",
                                background: on ? v.color : v.bg,
                                color: on ? "#F2EAD8" : v.color,
                                border: `1px solid ${on ? v.color : v.bdr}`,
                                fontWeight: 500
                              }}>
                              {v.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Vote bar */}
                  {totalVotes > 0 && (
                    <div style={{ marginTop: "0.9rem", height: 4, background: T.borderLt, borderRadius: 2, display: "flex", overflow: "hidden" }}>
                      <div style={{ width: `${yes/8*100}%`, background: T.green }} />
                      <div style={{ width: `${no/8*100}%`, background: T.red }} />
                      <div style={{ width: `${abstain/8*100}%`, background: T.textFaint }} />
                    </div>
                  )}

                  {/* Toggle comments */}
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)}
                    style={{ marginTop: "0.9rem", fontSize: "0.78rem", color: T.gold, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="message" size={13} /> {p.comments.length} {p.comments.length === 1 ? "comment" : "comments"}
                    <Icon name={isExpanded ? "chevDown" : "chevRight"} size={12} />
                  </button>
                </div>

                {/* Comments */}
                {isExpanded && (
                  <div style={{ background: T.cardAlt, padding: "1.2rem 1.6rem" }}>
                    {p.comments.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1rem" }}>
                        {p.comments.map((c, i) => {
                          const ca = mByID(c.author);
                          return (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
                              <Avatar m={ca} size={28} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                  <span style={{ fontSize: "0.78rem", fontWeight: 500, color: T.text }}>
                                    {c.author === me.id ? "You" : ca.name.split(" ")[0]}
                                  </span>
                                  <span style={{ fontSize: "0.7rem", color: T.textMute }}>· {fmtShort(c.at)}</span>
                                </div>
                                <p style={{ fontSize: "0.84rem", color: T.textDim, lineHeight: 1.55 }}>{c.text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Comment input */}
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                      <Avatar m={me} size={28} />
                      <div style={{ flex: 1 }}>
                        <textarea value={commentDraft} onChange={e => setCommentDraft(e.target.value)}
                          placeholder="Add a comment…" rows={2}
                          style={{ width: "100%", padding: "0.6rem 0.9rem", borderRadius: 7, border: `1px solid ${T.border}`, background: T.card, fontSize: "0.84rem", color: T.text, fontFamily: "inherit", resize: "vertical" }} />
                        {commentDraft && (
                          <Btn variant="primary" size="sm" onClick={() => addComment(p.id)}>Post</Btn>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PORTAL SHELL
═══════════════════════════════════════════════════════ */
function Portal({ me, onLogout }) {
  const [tab, setTab] = useState("home");
  const [conciergeCategory, setConciergeCategory] = useState(null);
  const [res, setRes] = useState(RES_INIT);
  const [concierge, setConcierge] = useState(CONCIERGE_INIT);
  const [expenses] = useState(EXPENSES_INIT);
  const [swaps, setSwaps] = useState(SWAPS_INIT);
  const [holidays, setHolidays] = useState(HOLIDAYS_INIT);
  const [longWeekends, setLongWeekends] = useState(LONG_WEEKENDS_INIT);

  // Custom setTab that also accepts optional category for concierge
  function goTab(newTab, category) {
    setTab(newTab);
    if (newTab === "concierge") setConciergeCategory(category || null);
    else setConciergeCategory(null);
  }

  const notif = {
    concierge: concierge.filter(c => c.member === me.id && c.status !== "completed").length,
    swaps: swaps.filter(s => s.to === me.id && s.status === "pending").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Nav me={me} tab={tab} setTab={goTab} onLogout={onLogout} notif={notif} />
      {tab === "home"      && <Home      me={me} res={res} concierge={concierge} expenses={expenses} swaps={swaps} setTab={goTab} />}
      {tab === "villa"     && <Villa     setTab={goTab} />}
      {tab === "stays"     && <Stays     me={me} res={res} setRes={setRes} holidays={holidays} setHolidays={setHolidays} longWeekends={longWeekends} setLongWeekends={setLongWeekends} />}
      {tab === "concierge" && <Concierge me={me} concierge={concierge} setConcierge={setConcierge} initialCategory={conciergeCategory} />}
      {tab === "expenses"  && <Expenses  me={me} expenses={expenses} />}
      {tab === "swaps"     && <Swaps     me={me} res={res} swaps={swaps} setSwaps={setSwaps} setRes={setRes} />}
      {tab === "owners"    && <Owners    me={me} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function App() {
  const [me, setMe] = useState(null);
  return (
    <>
      <Styles />
      {me ? <Portal me={me} onLogout={() => setMe(null)} /> : <Login onLogin={setMe} />}
    </>
  );
}
