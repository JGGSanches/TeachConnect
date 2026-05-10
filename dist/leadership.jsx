/* =============== LEADERSHIP DASHBOARD =============== */
function LeadershipShell({ children, active }) {
  const items = [
    { route: '/leadership', icon: 'home', label: 'Übersicht' },
    { route: '/leadership/absences', icon: 'calendar-x', label: 'Absenzen' },
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
              <Icon name="alert-triangle" size={16} style={{ color: 'oklch(60% 0.16 50)' }}/>
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
    { route: '/admin/billing', icon: 'credit-card', label: 'Abrechnung' },
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

Object.assign(window, { LeadershipShell, LeadershipHome, AdminShell, AdminHome, Donut, CoverageChart });
