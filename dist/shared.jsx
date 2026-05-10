/* global React */
const { useState, useEffect, useMemo, useRef, createContext, useContext } = React;

/* =============== ICONS (inline SVG, original) =============== */
const Icon = ({ name, size = 18, stroke = 1.75, ...rest }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
    ...rest
  };
  switch (name) {
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-left':  return <svg {...props}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case 'check': return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'check-circle': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>;
    case 'x': return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'bell': return <svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'home': return <svg {...props}><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>;
    case 'building': return <svg {...props}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></svg>;
    case 'school': return <svg {...props}><path d="M3 10l9-5 9 5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/><path d="M9 14h6"/></svg>;
    case 'users': return <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a4.5 4.5 0 0 1 5 4"/></svg>;
    case 'user': return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'briefcase': return <svg {...props}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>;
    case 'calendar': return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'book': return <svg {...props}><path d="M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2z"/><path d="M19 17H6"/></svg>;
    case 'graduation': return <svg {...props}><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5a6 6 0 0 0 12 0v-5"/></svg>;
    case 'map-pin': return <svg {...props}><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'star': return <svg {...props} fill="currentColor" stroke="none"><path d="M12 2l3 6.5 7 .9-5 4.7 1.4 7-6.4-3.5L5.6 21l1.4-7-5-4.7 7-.9z"/></svg>;
    case 'shield': return <svg {...props}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'zap': return <svg {...props}><path d="M13 3L4 14h7l-1 7 9-11h-7z"/></svg>;
    case 'sparkles': return <svg {...props}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>;
    case 'settings': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'log-out': return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'log-in': return <svg {...props}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l-5-5 5-5M5 12h12"/></svg>;
    case 'menu': return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'chevron-right': return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chevron-down': return <svg {...props}><path d="M6 9l6 6 6-6"/></svg>;
    case 'upload': return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>;
    case 'file': return <svg {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>;
    case 'paperclip': return <svg {...props}><path d="M21 12l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/></svg>;
    case 'send': return <svg {...props}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>;
    case 'mail': return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case 'phone': return <svg {...props}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></svg>;
    case 'trending-up': return <svg {...props}><path d="M22 7l-9 9-4-4-7 7"/><path d="M16 7h6v6"/></svg>;
    case 'trending-down': return <svg {...props}><path d="M22 17l-9-9-4 4-7-7"/><path d="M16 17h6v-6"/></svg>;
    case 'filter': return <svg {...props}><path d="M22 3H2l8 9.5V19l4 2v-8.5z"/></svg>;
    case 'edit': return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.4 2.6a2 2 0 1 1 2.8 2.8L12 14.5l-4 1 1-4z"/></svg>;
    case 'trash': return <svg {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1.3 13.1a2 2 0 0 1-2 1.9H8.3a2 2 0 0 1-2-1.9L5 6"/></svg>;
    case 'eye': return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'message': return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'thumbs-up': return <svg {...props}><path d="M14 9V5a3 3 0 0 0-6 0v4H4v11h14a2 2 0 0 0 2-1.6l1.5-7A2 2 0 0 0 19.5 9z"/></svg>;
    case 'lightning': return <svg {...props}><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>;
    case 'globe': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case 'bar-chart': return <svg {...props}><path d="M3 21h18"/><rect x="6" y="11" width="3" height="8"/><rect x="11" y="6" width="3" height="13"/><rect x="16" y="14" width="3" height="5"/></svg>;
    case 'shield-check': return <svg {...props}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'puzzle': return <svg {...props}><path d="M14 4a2 2 0 1 1 4 0v3h3v3a2 2 0 1 1 0 4h-3v3h-4a2 2 0 1 0 0 4H7a2 2 0 0 1-2-2v-5H2a2 2 0 1 1 0-4h3V7h5z"/></svg>;
    case 'flag': return <svg {...props}><path d="M4 22V4M4 4h14l-3 4 3 4H4"/></svg>;
    case 'help': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4M12 17h.01"/></svg>;
    case 'compass': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6z"/></svg>;
    case 'inbox': return <svg {...props}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5 5l-3 7v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3-7z"/></svg>;
    case 'history': return <svg {...props}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>;
    case 'list-check': return <svg {...props}><path d="M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17M11 6h10M11 12h10M11 18h10"/></svg>;
    case 'arrow-up-right': return <svg {...props}><path d="M7 17L17 7M8 7h9v9"/></svg>;
    case 'download': return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>;
    case 'alert-triangle': return <svg {...props}><path d="M10.3 3.3L2 19h20L13.7 3.3a2 2 0 0 0-3.4 0z"/><path d="M12 9v5M12 17h.01"/></svg>;
    case 'credit-card': return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;
    case 'x-circle': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>;
    default: return null;
  }
};

/* =============== LOGO =============== */
const Logo = ({ size = 28, withWord = true }) => (
  <span className="logo" style={{ gap: 10, fontSize: size > 28 ? 18 : 16 }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="0" y="0" width="40" height="40" rx="11" fill="url(#tcGrad)"/>
      <defs>
        <linearGradient id="tcGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="oklch(48% 0.18 252)"/>
          <stop offset="1" stopColor="oklch(40% 0.18 240)"/>
        </linearGradient>
      </defs>
      {/* Connection arc + nodes (school ↔ teacher) */}
      <circle cx="12" cy="22" r="3" fill="white"/>
      <circle cx="28" cy="22" r="3" fill="oklch(78% 0.13 195)"/>
      <path d="M12 22 Q20 8, 28 22" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.95"/>
      {/* checkmark linking dot */}
      <path d="M17.5 28 L19.5 30 L23 26.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
    {withWord && <span style={{ letterSpacing: '-0.025em' }}>TeachConnect</span>}
  </span>
);

/* =============== STATE / STORE =============== */
const StoreCtx = createContext(null);
const useStore = () => useContext(StoreCtx);

const initialState = {
  user: null, // { id, name, role: 'school'|'teacher'|'leadership'|'admin', schoolId? }
  toast: null,
};

/* Demo data — Graubünden schools */
const SCHOOLS = [
  { id: 's1', name: 'Schule Davos Platz', region: 'Davos', address: 'Promenade 47, 7270 Davos', size: 280, contact: 'Anna Brunner', logo: 1 },
  { id: 's2', name: 'Primarschule Chur West', region: 'Chur', address: 'Rheinstrasse 12, 7000 Chur', size: 410, contact: 'Markus Caduff', logo: 2 },
  { id: 's3', name: 'Sekundarschule Klosters', region: 'Klosters', address: 'Schulweg 8, 7250 Klosters', size: 195, contact: 'Sabina Janett', logo: 3 },
];

const SUBJECTS = ['Mathematik','Deutsch','Englisch','Französisch','Italienisch','NMG','Geografie','Biologie','Sport','Musik','Bildnerisches Gestalten','Geschichte','Physik','Informatik'];
const GRADES = ['Kindergarten','1./2. Primar','3./4. Primar','5./6. Primar','Sek I','Sek II'];

const TEACHERS = [
  { id: 't1', name: 'Lara Hofer',     subjects: ['Deutsch','Englisch','Geschichte'], grades: ['Sek I','Sek II'], region: 'Chur', km: 4.2, qual: 'PH Graubünden', exp: 6, rating: 4.9, jobs: 38, av: 'today', avatarKey: 1 },
  { id: 't2', name: 'David Eberle',   subjects: ['Mathematik','Physik','Informatik'], grades: ['Sek I','Sek II'], region: 'Davos', km: 1.8, qual: 'ETH Zürich', exp: 9, rating: 4.8, jobs: 52, av: 'today', avatarKey: 2 },
  { id: 't3', name: 'Sina Capaul',    subjects: ['NMG','Deutsch','Bildnerisches Gestalten'], grades: ['1./2. Primar','3./4. Primar'], region: 'Klosters', km: 0.5, qual: 'PH Bern', exp: 4, rating: 4.7, jobs: 22, av: 'tomorrow', avatarKey: 3 },
  { id: 't4', name: 'Reto Janett',    subjects: ['Sport','Mathematik','NMG'], grades: ['3./4. Primar','5./6. Primar'], region: 'Davos', km: 3.1, qual: 'PH Zürich', exp: 12, rating: 4.9, jobs: 87, av: 'today', avatarKey: 4 },
  { id: 't5', name: 'Mirjam Cathomen',subjects: ['Französisch','Italienisch','Englisch'], grades: ['Sek I','Sek II'], region: 'Chur', km: 6.4, qual: 'Uni Fribourg', exp: 7, rating: 4.6, jobs: 31, av: 'this-week', avatarKey: 5 },
  { id: 't6', name: 'Andrin Bisaz',   subjects: ['Musik','Deutsch'], grades: ['Kindergarten','1./2. Primar','3./4. Primar'], region: 'Chur', km: 5.9, qual: 'HKB', exp: 3, rating: 4.5, jobs: 14, av: 'today', avatarKey: 6 },
  { id: 't7', name: 'Nora Willi',     subjects: ['Biologie','Geografie','Mathematik'], grades: ['Sek I'], region: 'Klosters', km: 1.2, qual: 'PH Graubünden', exp: 5, rating: 4.8, jobs: 27, av: 'tomorrow', avatarKey: 7 },
  { id: 't8', name: 'Patrick Saluz',  subjects: ['Bildnerisches Gestalten','Musik','Geschichte'], grades: ['Sek I','Sek II'], region: 'Davos', km: 2.7, qual: 'ZHdK', exp: 10, rating: 4.7, jobs: 44, av: 'this-week', avatarKey: 8 },
];

const REQUESTS = [
  { id: 'r1', schoolId: 's1', subject: 'Mathematik', grade: 'Sek I', date: '2026-05-12', start: '08:00', end: '11:30', lessons: 4, status: 'matched', urgency: 'high', note: 'Frau Müller fällt kurzfristig wegen Krankheit aus. Kapitel Bruchrechnen, Klasse 7a.', applicants: 3, suggestedIds: ['t2','t4','t1'], confirmedId: null, handoverComplete: true, createdAt: '2026-05-08T07:14:00' },
  { id: 'r2', schoolId: 's1', subject: 'Sport', grade: '5./6. Primar', date: '2026-05-12', start: '13:30', end: '15:15', lessons: 2, status: 'open', urgency: 'medium', note: 'Hallenturnen, Geräte. Klasse 6b – sehr lebhaft.', applicants: 1, suggestedIds: ['t4','t3','t6'], confirmedId: null, handoverComplete: true, createdAt: '2026-05-08T07:42:00' },
  { id: 'r3', schoolId: 's2', subject: 'Französisch', grade: 'Sek I', date: '2026-05-13', start: '10:15', end: '12:00', lessons: 2, status: 'confirmed', urgency: 'low', note: 'Konversation Unité 7. Lehrmittel mille feuilles.', applicants: 2, suggestedIds: ['t5'], confirmedId: 't5', handoverComplete: true, createdAt: '2026-05-07T15:20:00' },
  { id: 'r4', schoolId: 's3', subject: 'Biologie', grade: 'Sek I', date: '2026-05-14', start: '08:00', end: '09:35', lessons: 2, status: 'matched', urgency: 'medium', note: 'Thema: Zellbiologie. Mikroskope vorbereitet.', applicants: 4, suggestedIds: ['t7','t2'], confirmedId: null, handoverComplete: false, createdAt: '2026-05-08T08:05:00' },
  { id: 'r5', schoolId: 's2', subject: 'Musik', grade: '3./4. Primar', date: '2026-05-15', start: '10:00', end: '11:30', lessons: 2, status: 'open', urgency: 'low', note: 'Liederkanon, Rhythmus-Übungen.', applicants: 0, suggestedIds: ['t6','t8'], confirmedId: null, handoverComplete: false, createdAt: '2026-05-08T09:10:00' },
  { id: 'r6', schoolId: 's3', subject: 'Deutsch', grade: 'Sek I', date: '2026-05-09', start: '08:00', end: '11:30', lessons: 4, status: 'completed', urgency: 'high', note: 'Aufsatz – Erörterung. Kapitel abgeschlossen.', applicants: 3, suggestedIds: ['t1'], confirmedId: 't1', handoverComplete: true, createdAt: '2026-05-06T14:30:00', rating: 5 },
  { id: 'r7', schoolId: 's1', subject: 'Englisch', grade: 'Sek II', date: '2026-05-11', start: '13:00', end: '14:45', lessons: 2, status: 'completed', urgency: 'medium', note: 'Reading comprehension, Unit 9.', applicants: 2, suggestedIds: ['t1'], confirmedId: 't1', handoverComplete: true, createdAt: '2026-05-04T11:00:00', rating: 5 },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('de-CH', { weekday: 'short', day: 'numeric', month: 'short' });
}
function formatRelativeDate(iso) {
  const d = new Date(iso);
  const today = new Date('2026-05-08');
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return 'Heute';
  if (diff === 1) return 'Morgen';
  if (diff === -1) return 'Gestern';
  if (diff > 1 && diff < 7) return `In ${diff} Tagen`;
  return formatDate(iso);
}

function StoreProvider({ children }) {
  const [route, setRoute] = useState(() => {
    return localStorage.getItem('tc.route') || '/';
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tc.user') || 'null'); } catch { return null; }
  });
  const [requests, setRequests] = useState(REQUESTS);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => { localStorage.setItem('tc.route', route); }, [route]);
  useEffect(() => { localStorage.setItem('tc.user', JSON.stringify(user)); }, [user]);

  const navigate = (r) => { setRoute(r); window.scrollTo(0,0); };

  const showToast = (msg, kind = 'success') => {
    setToast({ msg, kind, id: Date.now() });
    setTimeout(() => setToast(null), 2800);
  };

  const value = {
    route, navigate, user, setUser,
    requests, setRequests, schools: SCHOOLS, teachers: TEACHERS,
    subjects: SUBJECTS, grades: GRADES,
    showToast, toast, modal, setModal,
  };
  return (
    <StoreCtx.Provider value={value}>
      {children}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100 }} className="fade-in">
          <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow-3)' }}>
            <Icon name="check-circle" size={18} style={{ color: 'var(--success)' }}/>
            <span style={{ fontSize: 14 }}>{toast.msg}</span>
          </div>
        </div>
      )}
    </StoreCtx.Provider>
  );
}

/* =============== SHARED UI =============== */
function Avatar({ name, size = 36, k = 1 }) {
  const initials = name?.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || '?';
  return <span className={`avatar av-${k}`} style={{ width: size, height: size, fontSize: size*0.36 }}>{initials}</span>;
}

function Button({ children, variant = 'primary', size = 'md', icon, iconRight, ...rest }) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''}`;
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 16}/>}
    </button>
  );
}

function Pill({ children, variant }) {
  const cls = `pill ${variant ? 'pill-' + variant : ''}`;
  return <span className={cls}>{children}</span>;
}

function StatusPill({ status }) {
  const map = {
    open: { label: 'Offen', variant: 'warn' },
    matched: { label: 'Vorschläge bereit', variant: 'primary' },
    confirmed: { label: 'Bestätigt', variant: 'success' },
    completed: { label: 'Abgeschlossen', variant: '' },
    cancelled: { label: 'Storniert', variant: 'danger' },
  };
  const m = map[status] || { label: status, variant: '' };
  return <Pill variant={m.variant}>{m.label}</Pill>;
}

function UrgencyPill({ u }) {
  const map = { high: { l: 'Sehr dringend', v: 'danger' }, medium: { l: 'Dringend', v: 'warn' }, low: { l: 'Planbar', v: 'success' } };
  const m = map[u];
  return <Pill variant={m.v}>{m.l}</Pill>;
}

function Modal({ children, onClose, size }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className={`modal ${size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : ''}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon name={icon} size={24}/></div>
      <div className="h-3" style={{ marginBottom: 6 }}>{title}</div>
      <div className="t-muted" style={{ maxWidth: 360, margin: '0 auto 18px' }}>{description}</div>
      {action}
    </div>
  );
}

/* =============== APP TOPBAR (signed in) =============== */
function AppTopbar({ title, sub, search }) {
  const { user, navigate, setUser } = useStore();
  return (
    <div className="topbar">
      <div className="row" style={{ gap: 16, flex: 1 }}>
        <div>
          <div className="h-3" style={{ fontSize: 16 }}>{title}</div>
          {sub && <div className="t-muted" style={{ fontSize: 12 }}>{sub}</div>}
        </div>
      </div>
      <div className="row" style={{ gap: 8 }}>
        {search !== false && (
          <div style={{ position: 'relative' }}>
            <Icon name="search" size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)' }}/>
            <input className="input" placeholder="Suchen…" style={{ paddingLeft: 32, height: 36, width: 220 }}/>
          </div>
        )}
        <button className="btn btn-icon btn-ghost" title="Benachrichtigungen"><Icon name="bell" size={16}/></button>
        <button className="btn btn-icon btn-ghost" title="Einstellungen"><Icon name="settings" size={16}/></button>
        <div className="row" style={{ paddingLeft: 6, gap: 8 }}>
          <Avatar name={user?.name || '?'} size={32} k={user?.avatarKey || 1}/>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div className="t-tiny">{user?.role === 'school' ? 'Schule' : user?.role === 'teacher' ? 'Lehrperson' : user?.role === 'leadership' ? 'Schulleitung' : 'Admin'}</div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={() => { setUser(null); navigate('/'); }} title="Abmelden">
            <Icon name="log-out" size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =============== APP SIDEBAR =============== */
function Sidebar({ items, active }) {
  const { navigate, user } = useStore();
  return (
    <aside className="sidebar">
      <div onClick={() => navigate('/')} style={{ padding: '4px 10px 16px', cursor: 'pointer' }}>
        <Logo size={26}/>
      </div>
      <div className="sidebar-section">Übersicht</div>
      {items.map(it => (
        <div key={it.route} className={`sidebar-link ${active === it.route ? 'active' : ''}`} onClick={() => navigate(it.route)}>
          <Icon name={it.icon} size={17}/>
          <span>{it.label}</span>
          {it.badge && <span className="sidebar-badge">{it.badge}</span>}
        </div>
      ))}
      <div style={{ marginTop: 'auto' }}>
        <div className="divider" style={{ margin: '12px 0' }}/>
        <div className="sidebar-link" onClick={() => navigate('/settings')}>
          <Icon name="settings" size={17}/><span>Einstellungen</span>
        </div>
        <div className="sidebar-link" onClick={() => navigate('/help')}>
          <Icon name="help" size={17}/><span>Hilfe</span>
        </div>
      </div>
    </aside>
  );
}

/* expose globals */
Object.assign(window, {
  Icon, Logo, useStore, StoreProvider, StoreCtx,
  SCHOOLS, TEACHERS, REQUESTS, SUBJECTS, GRADES,
  formatDate, formatRelativeDate,
  Avatar, Button, Pill, StatusPill, UrgencyPill, Modal, EmptyState,
  AppTopbar, Sidebar,
});
