/* =============== LEADERSHIP DASHBOARD =============== */
function LeadershipShell({ children, active }) {
  const items = [
    { route: '/leadership', icon: 'home', label: 'Übersicht' },
    { route: '/leadership/absences', icon: 'calendar', label: 'Absenzen' },
    { route: '/leadership/bookings', icon: 'briefcase', label: 'Buchungen' },
    { route: '/leadership/team', icon: 'users', label: 'Team & Klassen' },
    { route: '/leadership/stats', icon: 'trending-up', label: 'Statistiken' },
    { route: '/leadership/profile', icon: 'building', label: 'Schulhaus' },
  ];
  return <div className="app-with-sidebar"><Sidebar items={items} active={active}/><div className="main">{children}</div></div>;
}

function LeadershipHome() {
  const { requests, schools, teachers, navigate, user } = useStore();
  const sch = schools.find(s => s.id === user.schoolId) || schools[0];
  const all = requests.filter(r => r.schoolId === sch.id);

  const absent = [
    { name: 'Daniel Brunner', subj: 'Mathematik / Physik', cls: '8b', from: '5. Mai', to: '15. Mai', reason: 'Krankheit', status: 'covered' },
    { name: 'Andrea Lutz', subj: 'Deutsch / Französisch', cls: '7a, 9c', from: '8. Mai', to: '8. Mai', reason: 'Weiterbildung', status: 'open' },
    { name: 'Marco Steiner', subj: 'Sport', cls: '6a–9c', from: '12. Mai', to: '14. Mai', reason: 'Ferien', status: 'matched' },
    { name: 'Petra Caduff', subj: 'Bildnerisches Gestalten', cls: '5b, 6a', from: '20. Mai', to: '20. Mai', reason: 'Termin', status: 'open' },
  ];

  return (
    <LeadershipShell active="/leadership">
      <AppTopbar title={sch.name} sub={`Schulleitung · ${sch.region}`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Schulhaus-Übersicht</div>
            <div className="page-sub">KW 19 · 4 aktive Absenzen, davon 2 vertreten</div>
          </div>
          <div className="row">
            <Button variant="outline" icon="download">Bericht</Button>
            <Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Absenz erfassen</Button>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: 24 }}>
          <KPI num="4" label="Aktive Absenzen" trend="2 sind vertreten" icon="calendar-x" tone="primary"/>
          <KPI num="92%" label="Deckungsgrad" trend="↑ +14% YoY" icon="shield-check" tone="success"/>
          <KPI num="3.4 h" label="Ø Zeit zur Buchung" trend="↓ von 2.5 Tagen" icon="zap" tone="accent"/>
          <KPI num="CHF 11'420" label="Ausgaben Mai" icon="trending-up" tone="warn"/>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'flex-start', gap: 24 }}>
          <div className="card">
            <div className="spread" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="h-3">Aktive Absenzen</div>
              <Button variant="ghost" size="sm" icon="filter">Filter</Button>
            </div>
            <table className="tbl">
              <thead><tr><th>Lehrperson</th><th>Fach / Klassen</th><th>Zeitraum</th><th>Grund</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {absent.map((a, i) => (
                  <tr key={i}>
                    <td><div className="row"><Avatar name={a.name} size={28} k={i+2}/><b>{a.name}</b></div></td>
                    <td><div style={{ fontSize: 13 }}>{a.subj}</div><div className="t-tiny">Klasse {a.cls}</div></td>
                    <td><div style={{ fontSize: 13 }}>{a.from}{a.from !== a.to ? ` – ${a.to}` : ''}</div></td>
                    <td className="t-muted" style={{ fontSize: 13 }}>{a.reason}</td>
                    <td><StatusPill status={a.status === 'covered' ? 'confirmed' : a.status === 'matched' ? 'matched' : 'open'}/></td>
                    <td><Button variant="ghost" size="sm" iconRight="chevron-right">Details</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Deckungsgrad letzte 12 Wochen</div>
              <CoverageChart/>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Top-Stellvertretungen</div>
              <div className="col" style={{ gap: 10 }}>
                {teachers.slice(0,4).map((t, i) => (
                  <div key={t.id} className="row">
                    <div className="t-mono" style={{ width: 18, fontSize: 11, color: 'var(--ink-3)' }}>#{i+1}</div>
                    <Avatar name={t.name} size={28} k={t.avatarKey}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                      <div className="t-tiny">{t.subjects.slice(0,2).join(', ')} · ★ {t.rating}</div>
                    </div>
                    <span className="t-mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{6 - i} Einsätze</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 18, background: 'var(--surface-2)' }}>
              <Icon name="flag" size={16} style={{ color: 'oklch(60% 0.16 50)' }}/>
              <div className="h-3" style={{ fontSize: 13, marginTop: 8 }}>2 Absenzen ohne Vertretung</div>
              <p className="t-muted" style={{ fontSize: 12, marginTop: 6 }}>Die Anfrage von Frau Lutz (Französisch, 9c) ist seit 36 Stunden offen.</p>
              <Button variant="outline" size="sm" style={{ marginTop: 10 }} onClick={() => navigate('/school/requests')}>Anfragen ansehen</Button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }} className="grid-2">
          <div className="card" style={{ padding: 22 }}>
            <div className="h-3" style={{ marginBottom: 14 }}>Klassen heute</div>
            <div className="grid-3" style={{ gap: 8 }}>
              {[
                { c: '5a', s: 'normal' }, { c: '5b', s: 'sub' }, { c: '6a', s: 'normal' },
                { c: '6b', s: 'normal' }, { c: '7a', s: 'sub' }, { c: '7b', s: 'normal' },
                { c: '8a', s: 'normal' }, { c: '8b', s: 'open' }, { c: '9a', s: 'normal' },
                { c: '9b', s: 'normal' }, { c: '9c', s: 'open' }, { c: '9d', s: 'normal' },
              ].map(x => (
                <div key={x.c} style={{
                  padding: 12, textAlign: 'center', borderRadius: 10,
                  background: x.s === 'open' ? 'oklch(96% 0.03 30)' : x.s === 'sub' ? 'var(--accent-50)' : 'var(--surface-2)',
                  border: `1px solid ${x.s === 'open' ? 'oklch(85% 0.07 30)' : x.s === 'sub' ? 'var(--accent-100)' : 'var(--border)'}`,
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{x.c}</div>
                  <div className="t-tiny" style={{ marginTop: 2, color: x.s === 'open' ? 'var(--danger)' : x.s === 'sub' ? 'var(--accent)' : 'var(--ink-3)' }}>
                    {x.s === 'open' ? 'Offen' : x.s === 'sub' ? 'Vertretung' : 'Regulär'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div className="h-3" style={{ marginBottom: 14 }}>Absenz-Gründe (letzte 90 Tage)</div>
            <div className="col" style={{ gap: 12 }}>
              {[
                { l: 'Krankheit', v: 48, c: 'var(--primary)' },
                { l: 'Weiterbildung', v: 22, c: 'var(--accent)' },
                { l: 'Ferien / Urlaub', v: 14, c: 'var(--success)' },
                { l: 'Termine', v: 10, c: 'oklch(70% 0.13 75)' },
                { l: 'Andere', v: 6, c: 'var(--ink-4)' },
              ].map(x => (
                <div key={x.l}>
                  <div className="spread" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>{x.l}</span>
                    <span className="t-mono" style={{ fontSize: 12, fontWeight: 600 }}>{x.v}%</span>
                  </div>
                  <div className="match-bar"><div className="match-bar-fill" style={{ width: x.v + '%', background: x.c }}/></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LeadershipShell>
  );
}

function CoverageChart() {
  const data = [88, 76, 92, 81, 95, 100, 90, 88, 100, 96, 92, 98];
  return (
    <div>
      <div className="row" style={{ alignItems: 'flex-end', gap: 6, height: 110 }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: '100%',
              height: `${v}%`,
              background: i === data.length - 1 ? 'var(--primary)' : 'var(--primary-100)',
              borderRadius: '4px 4px 0 0',
              minHeight: 4,
            }}/>
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 8, justifyContent: 'space-between' }}>
        <span className="t-tiny">KW 8</span>
        <span className="t-tiny">KW 19</span>
      </div>
    </div>
  );
}

/* =============== ADMIN DASHBOARD =============== */
function AdminShell({ children, active }) {
  const items = [
    { route: '/admin', icon: 'home', label: 'Übersicht' },
    { route: '/admin/schools', icon: 'building', label: 'Schulen' },
    { route: '/admin/teachers', icon: 'users', label: 'Lehrpersonen' },
    { route: '/admin/bookings', icon: 'briefcase', label: 'Buchungen' },
    { route: '/admin/matching', icon: 'sparkles', label: 'Matching-Daten' },
    { route: '/admin/billing', icon: 'bar-chart', label: 'Abrechnung' },
    { route: '/admin/settings', icon: 'settings', label: 'Einstellungen' },
  ];
  return <div className="app-with-sidebar"><Sidebar items={items} active={active} brand="admin"/><div className="main">{children}</div></div>;
}

function AdminHome() {
  const { schools, teachers, requests } = useStore();
  return (
    <AdminShell active="/admin">
      <AppTopbar title="Plattform-Admin" sub="Operations & Health"/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Operations</div>
            <div className="page-sub">Live-Status der TeachConnect Plattform</div>
          </div>
          <div className="row">
            <Pill variant="success"><span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--success)' }}/>Alle Systeme stabil</Pill>
            <Button variant="outline" icon="download">Export</Button>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: 24 }}>
          <KPI num={schools.length + 9} label="Schulen aktiv" trend="+3 diesen Monat" icon="building" tone="primary"/>
          <KPI num={teachers.length + 178} label="Lehrpersonen" trend="+22 verifiziert" icon="users" tone="success"/>
          <KPI num="486" label="Vermittlungen YTD" trend="+34% vs. 2025" icon="briefcase" tone="accent"/>
          <KPI num="CHF 38'420" label="MRR" trend="↑ 18% MoM" icon="trending-up" tone="warn"/>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'flex-start', gap: 24 }}>
          <div className="card">
            <div className="spread" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="h-3">Letzte Buchungen</div>
              <div className="row">
                <div style={{ position: 'relative' }}>
                  <input className="input" placeholder="Suchen…" style={{ paddingLeft: 32, height: 32, fontSize: 13, width: 200 }}/>
                  <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--ink-4)' }}/>
                </div>
              </div>
            </div>
            <table className="tbl">
              <thead><tr><th>ID</th><th>Schule</th><th>Lehrperson</th><th>Datum</th><th>Match</th><th>Status</th></tr></thead>
              <tbody>
                {requests.slice(0, 8).map(r => {
                  const sch = schools.find(s => s.id === r.schoolId);
                  const t = r.confirmedId ? teachers.find(x => x.id === r.confirmedId) : (r.suggestedIds && teachers.find(x => x.id === r.suggestedIds[0]));
                  return (
                    <tr key={r.id}>
                      <td className="t-mono" style={{ fontSize: 12 }}>#{r.id.slice(-6).toUpperCase()}</td>
                      <td><div className="row" style={{ gap: 8 }}><Avatar name={sch.name} size={24} k={sch.logo}/><span style={{ fontSize: 13 }}>{sch.name}</span></div></td>
                      <td>{t ? <div className="row" style={{ gap: 8 }}><Avatar name={t.name} size={24} k={t.avatarKey}/><span style={{ fontSize: 13 }}>{t.name}</span></div> : <span className="t-muted">—</span>}</td>
                      <td className="t-mono" style={{ fontSize: 12 }}>{r.date}</td>
                      <td><span className="match-score" style={{ fontSize: 11 }}>{Math.floor(75 + Math.random()*22)}%</span></td>
                      <td><StatusPill status={r.status}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Match-Qualität (live)</div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                <Donut value={87}/>
              </div>
              <div className="grid-3" style={{ gap: 8, marginTop: 8 }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="t-mono" style={{ fontWeight: 700 }}>92%</div>
                  <div className="t-tiny">Match ≥80%</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="t-mono" style={{ fontWeight: 700 }}>3.4 h</div>
                  <div className="t-tiny">Ø Buchungszeit</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="t-mono" style={{ fontWeight: 700 }}>4.8★</div>
                  <div className="t-tiny">Bewertung</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Verifizierungs-Queue</div>
              <div className="col" style={{ gap: 10 }}>
                {[
                  { n: 'Sandro Maissen', s: 'Strafregisterauszug · seit 2h', c: 'urgent' },
                  { n: 'Renate Vogt', s: 'Lehrdiplom · seit 1 Tag', c: 'normal' },
                  { n: 'Lukas Hartmann', s: 'Identitätsprüfung · seit 6h', c: 'normal' },
                ].map((x, i) => (
                  <div key={i} className="row" style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 10 }}>
                    <Avatar name={x.n} size={32} k={i+5}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{x.n}</div>
                      <div className="t-tiny">{x.s}</div>
                    </div>
                    <Button variant="primary" size="sm">Prüfen</Button>
                  </div>
                ))}
                <a className="t-tiny" style={{ color: 'var(--primary)', fontWeight: 600, textAlign: 'center', marginTop: 4, cursor: 'pointer' }}>+ 4 weitere ansehen</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }} className="grid-2">
          <div className="card" style={{ padding: 22 }}>
            <div className="h-3" style={{ marginBottom: 14 }}>Wachstum (letzte 30 Tage)</div>
            <div className="row" style={{ alignItems: 'flex-end', gap: 4, height: 140 }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const v = 30 + Math.sin(i / 4) * 25 + i * 1.5 + Math.random() * 10;
                return <div key={i} style={{ flex: 1, height: `${v}%`, background: i > 24 ? 'var(--primary)' : 'var(--primary-100)', borderRadius: '3px 3px 0 0' }}/>;
              })}
            </div>
            <div className="row" style={{ marginTop: 12, gap: 24 }}>
              <div><div className="t-mono" style={{ fontWeight: 700, fontSize: 18 }}>+34</div><div className="t-tiny">Neue Schulen</div></div>
              <div><div className="t-mono" style={{ fontWeight: 700, fontSize: 18 }}>+187</div><div className="t-tiny">Neue Lehrpersonen</div></div>
              <div><div className="t-mono" style={{ fontWeight: 700, fontSize: 18 }}>+162</div><div className="t-tiny">Neue Vermittlungen</div></div>
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div className="h-3" style={{ marginBottom: 14 }}>Region-Heatmap</div>
            <div className="col" style={{ gap: 10 }}>
              {[
                { r: 'Graubünden Nord', s: 32, t: 78, c: 96 },
                { r: 'Engadin', s: 14, t: 41, c: 88 },
                { r: 'Surselva', s: 11, t: 28, c: 92 },
                { r: 'Prättigau', s: 8, t: 22, c: 84 },
                { r: 'Mesolcina / Bregaglia', s: 5, t: 12, c: 71 },
              ].map((x, i) => (
                <div key={i} className="row">
                  <div style={{ flex: 1, fontSize: 13 }}>{x.r}</div>
                  <div style={{ width: 80, fontSize: 12, color: 'var(--ink-3)' }} className="t-mono">{x.s} S · {x.t} L</div>
                  <div style={{ width: 100 }}>
                    <div className="match-bar"><div className="match-bar-fill" style={{ width: x.c + '%', background: 'var(--accent)' }}/></div>
                  </div>
                  <span className="t-mono" style={{ width: 38, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>{x.c}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Donut({ value = 87 }) {
  const size = 140, sw = 14, r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--primary)" strokeWidth={sw} strokeDasharray={c} strokeDashoffset={c - (c * value / 100)} strokeLinecap="round"/>
      <text x={size/2} y={size/2 + 7} textAnchor="middle" fontSize={28} fontWeight={700} fill="var(--ink)" transform={`rotate(90 ${size/2} ${size/2})`}>{value}%</text>
    </svg>
  );
}

/* =============== LEADERSHIP: ABSENCES =============== */
function LeadershipAbsences() {
  const { navigate, showToast } = useStore();
  const [statusF, setStatusF] = useState('');
  const [reasonF, setReasonF] = useState('');

  const ALL_ABSENT = [
    { id:'a1', name:'Daniel Brunner', subj:'Mathematik / Physik', cls:'8b', from:'2026-05-05', to:'2026-05-15', reason:'Krankheit', status:'confirmed', requestId:'r1', days:11 },
    { id:'a2', name:'Andrea Lutz', subj:'Deutsch / Französisch', cls:'7a, 9c', from:'2026-05-08', to:'2026-05-08', reason:'Weiterbildung', status:'open', requestId:'r2', days:1 },
    { id:'a3', name:'Marco Steiner', subj:'Sport', cls:'6a–9c', from:'2026-05-12', to:'2026-05-14', reason:'Ferien', status:'matched', requestId:'r4', days:3 },
    { id:'a4', name:'Petra Caduff', subj:'Bildnerisches Gestalten', cls:'5b, 6a', from:'2026-05-20', to:'2026-05-20', reason:'Termin', status:'open', requestId:'', days:1 },
    { id:'a5', name:'Beat Locher', subj:'Geschichte / Geografie', cls:'8a, 9b', from:'2026-05-27', to:'2026-05-29', reason:'Krankheit', status:'open', requestId:'', days:3 },
    { id:'a6', name:'Sandra Mäder', subj:'Englisch', cls:'7b', from:'2026-04-28', to:'2026-05-02', reason:'Weiterbildung', status:'completed', requestId:'r6', days:5 },
  ];

  const filtered = ALL_ABSENT.filter(a =>
    (!statusF || a.status === statusF) && (!reasonF || a.reason === reasonF)
  );

  const reasons = [...new Set(ALL_ABSENT.map(a => a.reason))];

  return (
    <LeadershipShell active="/leadership/absences">
      <AppTopbar title="Absenzen" sub="Alle Abwesenheiten im Schulhaus"/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Absenzen</div>
            <div className="page-sub">Erfasste Abwesenheiten und Vertretungsstatus</div>
          </div>
          <div className="row">
            <Button variant="outline" icon="download" onClick={() => showToast('Export wird erstellt…')}>Exportieren</Button>
            <Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Absenz erfassen</Button>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom:24 }}>
          <KPI num={ALL_ABSENT.filter(a=>a.status==='open').length} label="Offen" icon="calendar" tone="primary"/>
          <KPI num={ALL_ABSENT.filter(a=>a.status==='matched').length} label="Vorschläge bereit" icon="sparkles" tone="warn"/>
          <KPI num={ALL_ABSENT.filter(a=>a.status==='confirmed').length} label="Bestätigt" icon="check-circle" tone="success"/>
          <KPI num={ALL_ABSENT.filter(a=>a.status==='completed').length} label="Abgeschlossen" icon="history" tone="accent"/>
        </div>

        <div className="card">
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <div className="row" style={{ gap:8 }}>
              <select className="select" style={{ height:36, fontSize:13 }} value={statusF} onChange={e => setStatusF(e.target.value)}>
                <option value="">Alle Status</option>
                <option value="open">Offen</option>
                <option value="matched">Vorschläge bereit</option>
                <option value="confirmed">Bestätigt</option>
                <option value="completed">Abgeschlossen</option>
              </select>
              <select className="select" style={{ height:36, fontSize:13 }} value={reasonF} onChange={e => setReasonF(e.target.value)}>
                <option value="">Alle Gründe</option>
                {reasons.map(r => <option key={r}>{r}</option>)}
              </select>
              {(statusF || reasonF) && <Button variant="ghost" size="sm" onClick={() => { setStatusF(''); setReasonF(''); }}>Zurücksetzen</Button>}
            </div>
          </div>
          <table className="tbl">
            <thead><tr><th>Lehrperson</th><th>Fach / Klassen</th><th>Zeitraum</th><th>Tage</th><th>Grund</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id}>
                  <td><div className="row" style={{ gap:8 }}><Avatar name={a.name} size={28} k={i+2}/><b style={{ fontSize:13 }}>{a.name}</b></div></td>
                  <td><div style={{ fontSize:13 }}>{a.subj}</div><div className="t-tiny">Kl. {a.cls}</div></td>
                  <td><div style={{ fontSize:13 }}>{formatDate(a.from)}{a.from!==a.to ? ` – ${formatDate(a.to)}` : ''}</div></td>
                  <td className="t-mono" style={{ fontSize:13 }}>{a.days}</td>
                  <td className="t-muted" style={{ fontSize:13 }}>{a.reason}</td>
                  <td><StatusPill status={a.status==='completed'?'completed':a.status}/></td>
                  <td>
                    {a.status==='open'
                      ? <Button variant="primary" size="sm" onClick={() => navigate('/school/new-request')}>Anfrage erstellen</Button>
                      : a.requestId
                        ? <Button variant="ghost" size="sm" iconRight="chevron-right" onClick={() => navigate('/school/request/'+a.requestId)}>Details</Button>
                        : <Button variant="ghost" size="sm" onClick={() => showToast('Details werden geladen.')}>Details</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LeadershipShell>
  );
}

/* =============== LEADERSHIP: BOOKINGS =============== */
function LeadershipBookings() {
  const { requests, teachers, schools, navigate } = useStore();
  const sch = schools[0];
  const all = requests.filter(r => r.schoolId === sch.id);
  const booked = all.filter(r => r.status === 'confirmed' || r.status === 'completed');

  return (
    <LeadershipShell active="/leadership/bookings">
      <AppTopbar title="Buchungen" sub="Alle bestätigten Stellvertretungen"/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Buchungen</div>
            <div className="page-sub">Bestätigte und abgeschlossene Stellvertretungen</div>
          </div>
          <Button variant="outline" icon="download">Export</Button>
        </div>

        <div className="grid-4" style={{ marginBottom:24 }}>
          <KPI num={booked.filter(r=>r.status==='confirmed').length} label="Kommend" icon="calendar" tone="primary"/>
          <KPI num={booked.filter(r=>r.status==='completed').length} label="Abgeschlossen" icon="check-circle" tone="success"/>
          <KPI num={booked.reduce((s,r)=>s+r.lessons,0)} label="Lektionen" icon="book" tone="accent"/>
          <KPI num={`CHF ${(booked.reduce((s,r)=>s+r.lessons,0)*92).toLocaleString('de-CH')}`} label="Kosten" icon="trending-up" tone="warn"/>
        </div>

        <div className="card">
          <table className="tbl">
            <thead><tr><th>Datum</th><th>Fach / Stufe</th><th>Stellvertretung</th><th>Lektionen</th><th>CHF</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {booked.map(r => {
                const t = r.confirmedId ? teachers.find(x => x.id === r.confirmedId) : null;
                return (
                  <tr key={r.id} onClick={() => navigate('/school/request/'+r.id)}>
                    <td><div style={{ fontWeight:600, fontSize:13 }}>{formatDate(r.date)}</div><div className="t-tiny">{r.start}–{r.end}</div></td>
                    <td><b>{r.subject}</b> · <span className="t-muted">{r.grade}</span></td>
                    <td>{t ? <div className="row" style={{ gap:8 }}><Avatar name={t.name} size={24} k={t.avatarKey}/>{t.name}</div> : '—'}</td>
                    <td className="t-mono">{r.lessons}</td>
                    <td className="t-mono">{(r.lessons*92).toFixed(2)}</td>
                    <td><StatusPill status={r.status}/></td>
                    <td><Icon name="chevron-right" size={16} style={{ color:'var(--ink-4)' }}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </LeadershipShell>
  );
}

/* =============== LEADERSHIP: TEAM =============== */
function LeadershipTeam() {
  const { teachers, showToast } = useStore();
  const [search, setSearch] = useState('');
  const TEAM = [
    { id:'lp1', name:'Daniel Brunner', subj:'Mathematik, Physik', cls:'8b', pct:100, status:'absent', deg:'Uni Bern', exp:14 },
    { id:'lp2', name:'Andrea Lutz', subj:'Deutsch, Französisch', cls:'7a, 9c', pct:80, status:'active', deg:'PH Graubünden', exp:8 },
    { id:'lp3', name:'Marco Steiner', subj:'Sport', cls:'6a–9c', pct:100, status:'active', deg:'EHSM', exp:11 },
    { id:'lp4', name:'Petra Caduff', subj:'Bildnerisches Gestalten', cls:'5b, 6a', pct:60, status:'active', deg:'ZHdK', exp:6 },
    { id:'lp5', name:'Beat Locher', subj:'Geschichte, Geografie', cls:'8a, 9b', pct:100, status:'active', deg:'Uni Zürich', exp:19 },
    { id:'lp6', name:'Sandra Mäder', subj:'Englisch', cls:'7b', pct:80, status:'active', deg:'PH Zürich', exp:5 },
    { id:'lp7', name:'Rolf Hunger', subj:'Informatik, Mathematik', cls:'8a, 9a', pct:100, status:'active', deg:'ETH Zürich', exp:9 },
    { id:'lp8', name:'Vreni Walther', subj:'Musik', cls:'5a–7a', pct:50, status:'active', deg:'HKB Bern', exp:22 },
  ];
  const filtered = TEAM.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subj.toLowerCase().includes(search.toLowerCase()));

  return (
    <LeadershipShell active="/leadership/team">
      <AppTopbar title="Team & Klassen" sub={`${TEAM.length} Lehrpersonen`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Team & Klassen</div>
            <div className="page-sub">Übersicht aller Lehrpersonen und Klassenzuteilungen</div>
          </div>
          <Button variant="primary" icon="plus" onClick={() => showToast('Lehrperson hinzufügen: Funktion kommt demnächst.')}>Lehrperson erfassen</Button>
        </div>

        <div className="grid-4" style={{ marginBottom:24 }}>
          <KPI num={TEAM.length} label="Lehrpersonen" icon="users" tone="primary"/>
          <KPI num={TEAM.filter(t=>t.status==='active').length} label="Aktiv heute" icon="check-circle" tone="success"/>
          <KPI num={TEAM.filter(t=>t.status==='absent').length} label="Abwesend" icon="calendar" tone="warn"/>
          <KPI num={Math.round(TEAM.reduce((s,t)=>s+t.exp,0)/TEAM.length) + ' J.'} label="Ø Erfahrung" icon="graduation" tone="accent"/>
        </div>

        <div className="card">
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ position:'relative', maxWidth:300 }}>
              <Icon name="search" size={15} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-4)' }}/>
              <input className="input" style={{ paddingLeft:32, height:36 }} placeholder="Name oder Fach suchen…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>
          <table className="tbl">
            <thead><tr><th>Name</th><th>Fächer</th><th>Klassen</th><th>Pensum</th><th>Ausbildung</th><th>Erfahrung</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id}>
                  <td><div className="row" style={{ gap:8 }}><Avatar name={t.name} size={28} k={i+1}/><b style={{ fontSize:13 }}>{t.name}</b></div></td>
                  <td style={{ fontSize:13 }}>{t.subj}</td>
                  <td style={{ fontSize:13 }}>Kl. {t.cls}</td>
                  <td className="t-mono" style={{ fontSize:13 }}>{t.pct}%</td>
                  <td className="t-muted" style={{ fontSize:12 }}>{t.deg}</td>
                  <td className="t-mono" style={{ fontSize:13 }}>{t.exp} J.</td>
                  <td><Pill variant={t.status==='active'?'success':'warn'}>{t.status==='active'?'Aktiv':'Abwesend'}</Pill></td>
                  <td><Button variant="ghost" size="sm" icon="eye" onClick={() => showToast(`Profil von ${t.name} wird geladen.`)}>Profil</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop:24 }}>
          <div className="h-3" style={{ marginBottom:14 }}>Klassen-Übersicht</div>
          <div className="grid-3" style={{ gap:10 }}>
            {['5a','5b','6a','6b','7a','7b','8a','8b','9a','9b','9c','9d'].map(cls => {
              const lp = TEAM.find(t => t.cls.includes(cls.slice(0,1)));
              const absent = lp?.status === 'absent';
              return (
                <div key={cls} style={{ padding:14, borderRadius:12, border:'1px solid var(--border)', background: absent ? 'oklch(97% 0.02 30)' : 'var(--surface)' }}>
                  <div className="spread">
                    <div style={{ fontWeight:700, fontSize:16 }}>{cls}</div>
                    <Pill variant={absent?'warn':'success'}>{absent?'Vertretung':'OK'}</Pill>
                  </div>
                  {lp && <div className="t-tiny" style={{ marginTop:6 }}>{lp.name}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </LeadershipShell>
  );
}

/* =============== LEADERSHIP: STATS =============== */
function LeadershipStats() {
  const { showToast } = useStore();
  const monthlyData = [
    { m:'Jan', absences:8, covered:8, cost:5840 },
    { m:'Feb', absences:12, covered:11, cost:8280 },
    { m:'Mär', absences:9, covered:9, cost:6750 },
    { m:'Apr', absences:14, covered:13, cost:9880 },
    { m:'Mai', absences:6, covered:5, cost:4140 },
  ];
  const maxCost = Math.max(...monthlyData.map(d => d.cost));

  return (
    <LeadershipShell active="/leadership/stats">
      <AppTopbar title="Statistiken" sub="Auswertungen und Kennzahlen"/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Statistiken</div>
            <div className="page-sub">Ausfallquote, Besetzungszeit und Kosten</div>
          </div>
          <Button variant="outline" icon="download" onClick={() => showToast('Bericht wird exportiert…')}>Bericht exportieren</Button>
        </div>

        <div className="grid-4" style={{ marginBottom:24 }}>
          <KPI num="92%" label="Deckungsgrad 2026" trend="↑ +14% vs. 2025" icon="shield-check" tone="success"/>
          <KPI num="49" label="Absenzen gesamt" trend="KW 1–19" icon="calendar" tone="primary"/>
          <KPI num="3.4 h" label="Ø Besetzungszeit" trend="↓ von 2.5 Tagen" icon="zap" tone="accent"/>
          <KPI num="CHF 34'890" label="Kosten 2026 YTD" trend="Ø CHF 711 / Absenz" icon="trending-up" tone="warn"/>
        </div>

        <div className="grid-2" style={{ gap:24, alignItems:'flex-start' }}>
          <div className="card" style={{ padding:22 }}>
            <div className="h-3" style={{ marginBottom:16 }}>Monatliche Kosten (CHF)</div>
            <div className="row" style={{ alignItems:'flex-end', gap:12, height:160 }}>
              {monthlyData.map(d => (
                <div key={d.m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <div className="t-mono" style={{ fontSize:11, color:'var(--ink-3)' }}>{(d.cost/1000).toFixed(1)}k</div>
                  <div style={{ width:'100%', height:`${Math.round(d.cost/maxCost*100)}%`, background:'var(--primary)', borderRadius:'6px 6px 0 0', minHeight:4 }}/>
                  <div className="t-tiny">{d.m}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <div className="h-3" style={{ marginBottom:16 }}>Deckungsgrad pro Monat (%)</div>
            <div className="col" style={{ gap:10 }}>
              {monthlyData.map(d => {
                const pct = Math.round(d.covered/d.absences*100);
                return (
                  <div key={d.m}>
                    <div className="spread" style={{ marginBottom:4 }}>
                      <span style={{ fontSize:13 }}>{d.m} – {d.covered}/{d.absences} vertreten</span>
                      <span className="t-mono" style={{ fontSize:12, fontWeight:600, color: pct===100?'var(--success)':pct>=80?'oklch(60% 0.13 75)':'var(--danger)' }}>{pct}%</span>
                    </div>
                    <div className="match-bar">
                      <div className="match-bar-fill" style={{ width:pct+'%', background: pct===100?'var(--success)':pct>=80?'oklch(72% 0.13 75)':'var(--danger)' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <div className="h-3" style={{ marginBottom:14 }}>Absenz-Gründe 2026</div>
            <div className="col" style={{ gap:12 }}>
              {[
                { l:'Krankheit', v:47, c:'var(--primary)' },
                { l:'Weiterbildung', v:24, c:'var(--accent)' },
                { l:'Ferien / Urlaub', v:16, c:'var(--success)' },
                { l:'Arzttermin', v:8, c:'oklch(70% 0.13 75)' },
                { l:'Andere', v:5, c:'var(--ink-4)' },
              ].map(x => (
                <div key={x.l}>
                  <div className="spread" style={{ marginBottom:4 }}>
                    <span style={{ fontSize:13 }}>{x.l}</span>
                    <span className="t-mono" style={{ fontSize:12, fontWeight:600 }}>{x.v}%</span>
                  </div>
                  <div className="match-bar"><div className="match-bar-fill" style={{ width:x.v+'%', background:x.c }}/></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <div className="h-3" style={{ marginBottom:14 }}>Top-Stellvertretungen 2026</div>
            <div className="col" style={{ gap:10 }}>
              {[
                { name:'Lara Hofer', einsaetze:12, rating:4.9, fach:'Deutsch, Englisch' },
                { name:'Reto Janett', einsaetze:9, rating:4.9, fach:'Sport, Mathe' },
                { name:'David Eberle', einsaetze:8, rating:4.8, fach:'Mathe, Physik' },
                { name:'Sina Capaul', einsaetze:6, rating:4.7, fach:'NMG, Deutsch' },
                { name:'Mirjam Cathomen', einsaetze:5, rating:4.6, fach:'Französisch' },
              ].map((t, i) => (
                <div key={i} className="row">
                  <div className="t-mono" style={{ width:20, fontSize:11, color:'var(--ink-3)', flexShrink:0 }}>#{i+1}</div>
                  <Avatar name={t.name} size={28} k={i+1}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{t.name}</div>
                    <div className="t-tiny">{t.fach} · ★ {t.rating}</div>
                  </div>
                  <span className="t-mono" style={{ fontSize:12, color:'var(--ink-3)' }}>{t.einsaetze} ×</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LeadershipShell>
  );
}

/* =============== LEADERSHIP: PROFILE =============== */
function LeadershipProfile() {
  const { schools, user, showToast } = useStore();
  const sch = schools.find(s => s.id === user?.schoolId) || schools[0];
  return (
    <LeadershipShell active="/leadership/profile">
      <AppTopbar title="Schulhaus" sub="Stammdaten und Einstellungen"/>
      <div className="page fade-in" style={{ maxWidth:900 }}>
        <div className="card" style={{ padding:28 }}>
          <div className="row" style={{ gap:20 }}>
            <Avatar name={sch.name} size={80} k={sch.logo}/>
            <div style={{ flex:1 }}>
              <div className="h-2">{sch.name}</div>
              <div className="t-muted" style={{ marginTop:4 }}>{sch.address} · {sch.size} Schüler:innen</div>
              <div className="row" style={{ marginTop:10, gap:8 }}>
                <Pill variant="success"><Icon name="shield-check" size={11}/>Verifiziert</Pill>
                <Pill variant="primary">Schul-Abonnement · CHF 75/Mt</Pill>
              </div>
            </div>
            <Button variant="outline" icon="edit" onClick={() => showToast('Bearbeitungsmodus aktiviert.')}>Bearbeiten</Button>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop:16, gap:16, alignItems:'flex-start' }}>
          <div className="card" style={{ padding:24 }}>
            <div className="h-3" style={{ fontSize:14, marginBottom:14 }}>Stammdaten</div>
            <div className="col" style={{ gap:12 }}>
              {[['Name', sch.name], ['Adresse', sch.address], ['Ansprechperson', sch.contact], ['Region', sch.region], ['Schüler:innen', String(sch.size)]].map(([l,v]) => (
                <div key={l}><div className="t-tiny" style={{ marginBottom:4 }}>{l}</div><input className="input" defaultValue={v}/></div>
              ))}
            </div>
            <Button variant="primary" size="sm" style={{ marginTop:14 }} onClick={() => showToast('Stammdaten gespeichert.')}>Speichern</Button>
          </div>

          <div className="card" style={{ padding:24 }}>
            <div className="h-3" style={{ fontSize:14, marginBottom:14 }}>Standard-Übergabe-Dokumente</div>
            <div className="col" style={{ gap:8 }}>
              {[
                { i:'shield', l:'Hausordnung', d:'hausordnung-davos.pdf · 2 Seiten' },
                { i:'users', l:'Notfallkontakte', d:'notfallkontakte.pdf · 4 Einträge' },
                { i:'map-pin', l:'Schulhaus-Plan', d:'schulhaus-plan.pdf · 3 Seiten' },
                { i:'phone', l:'Pikettliste', d:'pikettliste.pdf · aktuell' },
              ].map(x => (
                <div key={x.l} className="row" style={{ padding:10, border:'1px solid var(--border)', borderRadius:10 }}>
                  <Icon name={x.i} size={16} style={{ color:'var(--ink-3)' }}/>
                  <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{x.l}</div><div className="t-tiny">{x.d}</div></div>
                  <Pill variant="success"><Icon name="check" size={10}/>Aktiv</Pill>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" icon="upload" style={{ marginTop:12 }} onClick={() => showToast('Upload-Dialog wird geöffnet.')}>Dokument hinzufügen</Button>
          </div>
        </div>
      </div>
    </LeadershipShell>
  );
}

/* =============== ADMIN: SCHOOLS =============== */
function AdminSchools() {
  const { schools, showToast } = useStore();
  const [search, setSearch] = useState('');
  const ALL = [
    ...schools,
    { id:'s4', name:'Primarschule Arosa', region:'Arosa', address:'Schulweg 3, 7050 Arosa', size:145, contact:'Hanspeter Gilli', logo:4 },
    { id:'s5', name:'Sekundarschule Thusis', region:'Thusis', address:'Bahnhofstr. 22, 7430 Thusis', size:310, contact:'Eva Müller', logo:5 },
    { id:'s6', name:'Schule Ilanz', region:'Ilanz', address:'Stradung 15, 7130 Ilanz', size:220, contact:'Gion Andri Stuppan', logo:6 },
    { id:'s7', name:'Primarschule Flims', region:'Flims', address:'Via Principala 5, 7017 Flims', size:180, contact:'Claudia Ritter', logo:7 },
    { id:'s8', name:'Sekundarschule Landquart', region:'Landquart', address:'Schulhausstr. 4, 7302 Landquart', size:390, contact:'Thomas Kessler', logo:8 },
    { id:'s9', name:'Primarschule Pontresina', region:'Pontresina', address:'Via Maistra 12, 7504 Pontresina', size:95, contact:'Angela Planta', logo:1 },
    { id:'s10', name:'Schule St. Moritz', region:'St. Moritz', address:'Via Serlas 8, 7500 St. Moritz', size:260, contact:'Beat Meier', logo:2 },
    { id:'s11', name:'Volksschule Zernez', region:'Zernez', address:'Via Maistra 3, 7530 Zernez', size:75, contact:'Flurin Fanzun', logo:3 },
    { id:'s12', name:'Primarschule Disentis', region:'Disentis', address:'Voia Principala 20, 7180 Disentis', size:160, contact:'Cla Maissen', logo:4 },
  ];
  const filtered = ALL.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.region.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminShell active="/admin/schools">
      <AppTopbar title="Schulen" sub={`${ALL.length} registrierte Schulen`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div><div className="page-title">Schulen</div><div className="page-sub">Alle registrierten Schulen auf TeachConnect</div></div>
          <div className="row">
            <Button variant="outline" icon="download" onClick={() => showToast('Export wird erstellt…')}>Exportieren</Button>
            <Button variant="primary" icon="plus" onClick={() => showToast('Schule manuell hinzufügen: Formular öffnet sich.')}>Schule hinzufügen</Button>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom:24 }}>
          <KPI num={ALL.length} label="Schulen gesamt" trend="+3 diesen Monat" icon="building" tone="primary"/>
          <KPI num={ALL.length} label="Aktive Abos" icon="check-circle" tone="success"/>
          <KPI num={ALL.reduce((s,x)=>s+x.size,0).toLocaleString('de-CH')} label="Schüler:innen" icon="users" tone="accent"/>
          <KPI num={`CHF ${(ALL.length*75).toLocaleString('de-CH')}`} label="MRR (Schulen)" icon="trending-up" tone="warn"/>
        </div>

        <div className="card">
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ position:'relative', maxWidth:320 }}>
              <Icon name="search" size={15} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-4)' }}/>
              <input className="input" style={{ paddingLeft:32, height:36 }} placeholder="Name oder Region suchen…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>
          <table className="tbl">
            <thead><tr><th>Schule</th><th>Region</th><th>Adresse</th><th>Schüler:innen</th><th>Kontakt</th><th>Abo</th><th></th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><div className="row" style={{ gap:8 }}><Avatar name={s.name} size={28} k={s.logo}/><b style={{ fontSize:13 }}>{s.name}</b></div></td>
                  <td style={{ fontSize:13 }}>{s.region}</td>
                  <td className="t-muted" style={{ fontSize:12 }}>{s.address}</td>
                  <td className="t-mono">{s.size}</td>
                  <td style={{ fontSize:13 }}>{s.contact}</td>
                  <td><Pill variant="success">Aktiv</Pill></td>
                  <td><Button variant="ghost" size="sm" icon="eye" onClick={() => showToast(`Schulprofil ${s.name} wird geöffnet.`)}>Details</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

/* =============== ADMIN: TEACHERS =============== */
function AdminTeachers() {
  const { teachers, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('');

  const ALL_T = [
    ...teachers,
    { id:'t9',  name:'Flurin Bardill',  subjects:['Geschichte','Geografie'], grades:['Sek I'], region:'Davos', km:2.1, qual:'Uni Bern', exp:7, rating:4.7, jobs:19, av:'today', avatarKey:1, verified:true },
    { id:'t10', name:'Karin Sutter',    subjects:['Biologie','NMG'], grades:['Prim'], region:'Chur', km:3.8, qual:'PH Graubünden', exp:4, rating:4.6, jobs:11, av:'tomorrow', avatarKey:2, verified:true },
    { id:'t11', name:'Marco Caviezel',  subjects:['Mathematik','Physik'], grades:['Sek II'], region:'Klosters', km:1.2, qual:'ETH Zürich', exp:15, rating:4.9, jobs:67, av:'today', avatarKey:3, verified:true },
    { id:'t12', name:'Sandro Maissen',  subjects:['Deutsch'], grades:['Prim'], region:'Ilanz', km:0.8, qual:'PH Bern', exp:2, rating:0, jobs:0, av:'today', avatarKey:4, verified:false },
    { id:'t13', name:'Renate Vogt',     subjects:['Englisch','Französisch'], grades:['Sek I','Sek II'], region:'Chur', km:5.2, qual:'Uni Fribourg', exp:9, rating:4.8, jobs:33, av:'this-week', avatarKey:5, verified:false },
  ];

  const filtered = ALL_T.filter(t =>
    (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.join(' ').toLowerCase().includes(search.toLowerCase()))
    && (!statusF || (statusF==='verified' ? t.verified!==false : t.verified===false))
  );

  return (
    <AdminShell active="/admin/teachers">
      <AppTopbar title="Lehrpersonen" sub={`${ALL_T.length} registrierte Lehrpersonen`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div><div className="page-title">Lehrpersonen</div><div className="page-sub">Alle registrierten Lehrpersonen und Verifizierungsstatus</div></div>
          <Button variant="outline" icon="download" onClick={() => showToast('Export wird erstellt…')}>Exportieren</Button>
        </div>

        <div className="grid-4" style={{ marginBottom:24 }}>
          <KPI num={ALL_T.length} label="Lehrpersonen" trend="+22 verifiziert" icon="users" tone="primary"/>
          <KPI num={ALL_T.filter(t=>t.verified!==false).length} label="Verifiziert" icon="shield-check" tone="success"/>
          <KPI num={ALL_T.filter(t=>t.verified===false).length} label="In Prüfung" icon="clock" tone="warn"/>
          <KPI num={`${(ALL_T.filter(t=>t.verified!==false).length/ALL_T.length*100).toFixed(0)}%`} label="Verifizierungsquote" icon="trending-up" tone="accent"/>
        </div>

        <div className="card">
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <div className="row" style={{ gap:8 }}>
              <div style={{ position:'relative', flex:1, maxWidth:300 }}>
                <Icon name="search" size={15} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-4)' }}/>
                <input className="input" style={{ paddingLeft:32, height:36 }} placeholder="Name oder Fach suchen…" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
              <select className="select" style={{ height:36, fontSize:13 }} value={statusF} onChange={e => setStatusF(e.target.value)}>
                <option value="">Alle</option>
                <option value="verified">Verifiziert</option>
                <option value="pending">In Prüfung</option>
              </select>
            </div>
          </div>
          <table className="tbl">
            <thead><tr><th>Name</th><th>Fächer</th><th>Region</th><th>Ausbildung</th><th>Erfahrung</th><th>Einsätze</th><th>Bewertung</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><div className="row" style={{ gap:8 }}><Avatar name={t.name} size={28} k={t.avatarKey}/><b style={{ fontSize:13 }}>{t.name}</b></div></td>
                  <td style={{ fontSize:12 }}>{t.subjects.slice(0,2).join(', ')}</td>
                  <td style={{ fontSize:13 }}>{t.region}</td>
                  <td className="t-muted" style={{ fontSize:12 }}>{t.qual}</td>
                  <td className="t-mono">{t.exp} J.</td>
                  <td className="t-mono">{t.jobs}</td>
                  <td>{t.rating ? <span className="t-mono" style={{ fontSize:13 }}>★ {t.rating}</span> : <span className="t-muted">—</span>}</td>
                  <td>{t.verified===false ? <Pill variant="warn">In Prüfung</Pill> : <Pill variant="success"><Icon name="shield-check" size={10}/>Verifiziert</Pill>}</td>
                  <td>
                    {t.verified===false
                      ? <Button variant="primary" size="sm" onClick={() => showToast(`${t.name} verifiziert.`)}>Prüfen</Button>
                      : <Button variant="ghost" size="sm" icon="eye" onClick={() => showToast(`Profil ${t.name} wird geöffnet.`)}>Profil</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

/* =============== ADMIN: BOOKINGS =============== */
function AdminBookings() {
  const { requests, teachers, schools, showToast } = useStore();
  const [search, setSearch] = useState('');
  const filtered = requests.filter(r =>
    !search || r.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell active="/admin/bookings">
      <AppTopbar title="Buchungen" sub={`${requests.length} Anfragen`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div><div className="page-title">Alle Buchungen</div><div className="page-sub">Plattformweite Vermittlungsübersicht</div></div>
          <Button variant="outline" icon="download" onClick={() => showToast('Export wird erstellt…')}>Exportieren</Button>
        </div>

        <div className="grid-4" style={{ marginBottom:24 }}>
          <KPI num={requests.length} label="Anfragen gesamt" icon="briefcase" tone="primary"/>
          <KPI num={requests.filter(r=>r.status==='confirmed'||r.status==='completed').length} label="Vermittelt" icon="check-circle" tone="success"/>
          <KPI num={`${Math.round(requests.filter(r=>r.status==='confirmed'||r.status==='completed').length/requests.length*100)}%`} label="Erfolgsquote" icon="trending-up" tone="accent"/>
          <KPI num={`CHF ${(requests.reduce((s,r)=>s+r.lessons,0)*92*0.125).toFixed(0)}`} label="Vermittlungsgebühren" icon="zap" tone="warn"/>
        </div>

        <div className="card">
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ position:'relative', maxWidth:300 }}>
              <Icon name="search" size={15} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-4)' }}/>
              <input className="input" style={{ paddingLeft:32, height:36 }} placeholder="Fach suchen…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>
          <table className="tbl">
            <thead><tr><th>ID</th><th>Schule</th><th>Fach / Stufe</th><th>Lehrperson</th><th>Datum</th><th>Lekt.</th><th>Gebühr</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(r => {
                const sch = schools.find(s => s.id === r.schoolId);
                const t = r.confirmedId ? teachers.find(x => x.id === r.confirmedId) : null;
                const fee = (r.lessons * 92 * 0.125).toFixed(2);
                return (
                  <tr key={r.id}>
                    <td className="t-mono" style={{ fontSize:12 }}>#{r.id.slice(-6).toUpperCase()}</td>
                    <td><div className="row" style={{ gap:8 }}><Avatar name={sch.name} size={22} k={sch.logo}/><span style={{ fontSize:13 }}>{sch.name}</span></div></td>
                    <td><b style={{ fontSize:13 }}>{r.subject}</b> · <span className="t-muted">{r.grade}</span></td>
                    <td>{t ? <div className="row" style={{ gap:6 }}><Avatar name={t.name} size={22} k={t.avatarKey}/><span style={{ fontSize:13 }}>{t.name}</span></div> : <span className="t-muted">—</span>}</td>
                    <td className="t-mono" style={{ fontSize:12 }}>{r.date}</td>
                    <td className="t-mono">{r.lessons}</td>
                    <td className="t-mono" style={{ color:(r.status==='confirmed'||r.status==='completed')?'var(--success)':'var(--ink-3)' }}>CHF {fee}</td>
                    <td><StatusPill status={r.status}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

/* =============== ADMIN: BILLING =============== */
function AdminBilling() {
  const { schools, showToast } = useStore();
  const [tab, setTab] = useState('invoices');

  const INVOICES = [
    { id:'INV-2026-0041', school:'Schule Davos Platz', date:'2026-05-01', due:'2026-05-31', amount:75, type:'Abo', status:'paid' },
    { id:'INV-2026-0042', school:'Primarschule Chur West', date:'2026-05-01', due:'2026-05-31', amount:75, type:'Abo', status:'paid' },
    { id:'INV-2026-0043', school:'Sekundarschule Klosters', date:'2026-05-01', due:'2026-05-31', amount:75, type:'Abo', status:'open' },
    { id:'INV-2026-0044', school:'Schule Davos Platz', date:'2026-05-10', due:'2026-05-25', amount:138, type:'Vermittlungsgebühr', status:'open' },
    { id:'INV-2026-0039', school:'Primarschule Arosa', date:'2026-04-01', due:'2026-04-30', amount:75, type:'Abo', status:'paid' },
    { id:'INV-2026-0038', school:'Primarschule Arosa', date:'2026-04-15', due:'2026-04-30', amount:30, type:'Inserate-Bundle', status:'paid' },
    { id:'INV-2026-0037', school:'Schule Ilanz', date:'2026-04-01', due:'2026-04-30', amount:75, type:'Abo', status:'overdue' },
  ];

  return (
    <AdminShell active="/admin/billing">
      <AppTopbar title="Abrechnung" sub="Rechnungen und Umsatz"/>
      <div className="page fade-in">
        <div className="page-header">
          <div><div className="page-title">Abrechnung</div><div className="page-sub">Rechnungen, MRR und Revenue-Übersicht</div></div>
          <Button variant="primary" icon="plus" onClick={() => showToast('Rechnung manuell erstellen: Formular öffnet sich.')}>Rechnung erstellen</Button>
        </div>

        <div className="grid-4" style={{ marginBottom:24 }}>
          <KPI num={`CHF ${(schools.length*75).toLocaleString('de-CH')}`} label="MRR (Abos)" trend="+3 Schulen" icon="trending-up" tone="primary"/>
          <KPI num={`CHF 2'875`} label="Vermittlungsgebühren YTD" icon="zap" tone="success"/>
          <KPI num={`CHF 360`} label="Bundle-Einnahmen YTD" icon="briefcase" tone="accent"/>
          <KPI num={INVOICES.filter(i=>i.status==='overdue').length} label="Überfällige Rechnungen" icon="flag" tone="warn"/>
        </div>

        <div className="card">
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
            <div className="tabs">
              {[{v:'invoices',l:'Rechnungen'},{v:'subscriptions',l:'Abonnemente'}].map(t =>
                <div key={t.v} className={`tab ${tab===t.v?'active':''}`} onClick={() => setTab(t.v)}>{t.l}</div>
              )}
            </div>
          </div>

          {tab === 'invoices' ? (
            <table className="tbl">
              <thead><tr><th>Rechnungs-Nr.</th><th>Schule</th><th>Typ</th><th>Datum</th><th>Fällig</th><th>Betrag</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {INVOICES.map(inv => (
                  <tr key={inv.id}>
                    <td className="t-mono" style={{ fontSize:12 }}>{inv.id}</td>
                    <td style={{ fontSize:13 }}>{inv.school}</td>
                    <td><Pill variant={inv.type==='Abo'?'primary':inv.type==='Vermittlungsgebühr'?'accent':''}>{inv.type}</Pill></td>
                    <td className="t-mono" style={{ fontSize:12 }}>{inv.date}</td>
                    <td className="t-mono" style={{ fontSize:12 }}>{inv.due}</td>
                    <td className="t-mono" style={{ fontWeight:600 }}>CHF {inv.amount.toFixed(2)}</td>
                    <td><Pill variant={inv.status==='paid'?'success':inv.status==='overdue'?'danger':'warn'}>{inv.status==='paid'?'Bezahlt':inv.status==='overdue'?'Überfällig':'Offen'}</Pill></td>
                    <td><Button variant="ghost" size="sm" icon="eye" onClick={() => showToast(`Rechnung ${inv.id} wird angezeigt.`)}>Ansehen</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="tbl">
              <thead><tr><th>Schule</th><th>Plan</th><th>Startdatum</th><th>Nächste Zahlung</th><th>Betrag</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {[...schools, { id:'s4', name:'Primarschule Arosa', logo:4 }, { id:'s5', name:'Sekundarschule Thusis', logo:5 }].map((s, i) => (
                  <tr key={s.id}>
                    <td><div className="row" style={{ gap:8 }}><Avatar name={s.name} size={24} k={s.logo}/><span style={{ fontSize:13 }}>{s.name}</span></div></td>
                    <td><Pill variant="primary">Schul-Abonnement</Pill></td>
                    <td className="t-mono" style={{ fontSize:12 }}>2026-{String(((i%5)+1)).padStart(2,'0')}-01</td>
                    <td className="t-mono" style={{ fontSize:12 }}>2026-06-01</td>
                    <td className="t-mono" style={{ fontWeight:600 }}>CHF 75.00</td>
                    <td><Pill variant="success">Aktiv</Pill></td>
                    <td><Button variant="ghost" size="sm" onClick={() => showToast('Abo-Details werden angezeigt.')}>Details</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { LeadershipShell, LeadershipHome, LeadershipAbsences, LeadershipBookings, LeadershipTeam, LeadershipStats, LeadershipProfile, AdminShell, AdminHome, AdminSchools, AdminTeachers, AdminBookings, AdminBilling, Donut, CoverageChart });
