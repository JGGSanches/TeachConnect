/* =============== SCHOOL DASHBOARD =============== */
function SchoolShell({ children, active }) {
  const { requests, user } = useStore();
  const open = requests.filter(r => r.status === 'open' || r.status === 'matched').length;
  const items = [
    { route: '/school', icon: 'home', label: 'Übersicht' },
    { route: '/school/requests', icon: 'briefcase', label: 'Anfragen', badge: open },
    { route: '/school/bookings', icon: 'calendar', label: 'Buchungen' },
    { route: '/school/handover', icon: 'book', label: 'Übergaben' },
    { route: '/school/teachers', icon: 'users', label: 'Lehrpersonen-Pool' },
    { route: '/school/finances', icon: 'bar-chart', label: 'Finanzen' },
    { route: '/school/profile', icon: 'building', label: 'Schulprofil' },
  ];
  return (
    <div className="app-with-sidebar">
      <Sidebar items={items} active={active}/>
      <div className="main">{children}</div>
    </div>
  );
}

function SchoolHome() {
  const { requests, navigate, schools, teachers, user, setModal, inserateUsed, inserateLimit, setInserateUsed, showToast } = useStore();
  const isMobile = useIsMobile();
  const school = schools.find(s => s.id === user.schoolId);
  const myReqs = requests.filter(r => r.schoolId === school.id);
  const open = myReqs.filter(r => r.status === 'open' || r.status === 'matched');
  const confirmed = myReqs.filter(r => r.status === 'confirmed');
  const completed = myReqs.filter(r => r.status === 'completed');
  const insUsed = inserateUsed || 7;
  const insLimit = inserateLimit || 10;

  return (
    <SchoolShell active="/school">
      <AppTopbar title={school.name} sub={school.region}/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Guten Morgen, {user.name.split(' ')[0]}.</div>
            <div className="page-sub">Sonntag, 11. Mai 2026 · {open.length} offene Anfragen</div>
          </div>
          <Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Neue Stellvertretung</Button>
        </div>

        <div className="grid-4" style={{ marginBottom: 16 }}>
          <KPI num={open.length} label="Offen" trend="+2 heute" icon="briefcase" tone="primary"/>
          <KPI num={confirmed.length} label="Bestätigt" trend="" icon="check-circle" tone="success"/>
          <KPI num={completed.length} label="Diese Woche" trend="100% besetzt" icon="history" tone="accent"/>
          <KPI num="4 min" label="Ø Bearbeitung" trend="↓ 91 min vs. vorher" icon="zap" tone="warn"/>
        </div>

        {/* Inserate-Kontingent Banner */}
        <div className="card" style={{ padding:'14px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:16 }}>
          <Icon name="briefcase" size={18} style={{ color: insUsed >= insLimit ? 'var(--danger)' : 'var(--primary)', flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:5 }}>
              {insUsed} von {insLimit} Inseraten verwendet (Mai 2026) · <span style={{ color:'var(--ink-3)' }}>{insLimit - insUsed} verbleibend</span>
            </div>
            <div className="match-bar">
              <div className="match-bar-fill" style={{ width:`${Math.round(insUsed/insLimit*100)}%`, background: insUsed >= insLimit ? 'var(--danger)' : insUsed >= insLimit - 2 ? 'oklch(72% 0.13 75)' : 'var(--primary)' }}/>
            </div>
          </div>
          {insUsed >= insLimit - 2 && (
            <Button variant="primary" size="sm" icon="plus" onClick={() => { setInserateUsed(n => Math.max(0, n - 5)); showToast('+5 Inserate hinzugefügt. CHF 30.00 wird verrechnet.'); }}>
              Paket kaufen (CHF 30)
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate('/school/finances')}>Finanzen</Button>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr' }}>
          <div className="card">
            <div className="spread" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="h-3">Offene Anfragen</div>
              <a className="t-tiny" style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/school/requests')}>Alle ansehen →</a>
            </div>
            {open.length === 0 ? (
              <div style={{ padding: 24 }}>
                <EmptyState icon="check-circle" title="Alle Klassen besetzt." description="Aktuell gibt es keine offenen Anfragen. Erstelle eine, sobald du eine Absenz bekommst." action={<Button variant="outline" icon="plus" onClick={() => navigate('/school/new-request')}>Neue Anfrage</Button>}/>
              </div>
            ) : open.map(r => (
              <RequestRow key={r.id} r={r} onClick={() => navigate('/school/request/' + r.id)} school/>
            ))}
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card">
              <div className="spread" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                <div className="h-3" style={{ fontSize: 14 }}>Diese Woche</div>
                <span className="t-tiny">KW 19</span>
              </div>
              <div style={{ padding: 16 }}>
                <MiniCalendar requests={myReqs}/>
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div className="row" style={{ marginBottom: 12 }}>
                <Icon name="zap" size={18} style={{ color: 'var(--primary)' }}/>
                <div className="h-3" style={{ fontSize: 14 }}>Schnellaktionen</div>
              </div>
              <div className="col" style={{ gap: 8 }}>
                <button className="btn btn-soft" style={{ justifyContent: 'flex-start', width: '100%' }} onClick={() => navigate('/school/new-request')}><Icon name="plus" size={15}/>Neue Stellvertretung erfassen</button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', width: '100%' }} onClick={() => navigate('/school/handover')}><Icon name="upload" size={15}/>Lektionsplan hochladen</button>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', width: '100%' }} onClick={() => navigate('/school/teachers')}><Icon name="users" size={15}/>Pool durchsuchen</button>
              </div>
            </div>

            <div className="card" style={{ padding: 18, background: 'linear-gradient(135deg, var(--primary-50), var(--accent-50))', border: '1px solid var(--primary-100)' }}>
              <Icon name="sparkles" size={18} style={{ color: 'var(--primary)' }}/>
              <div className="h-3" style={{ fontSize: 14, marginTop: 8 }}>3 Lehrpersonen aus Davos sind heute neu verfügbar</div>
              <p className="t-muted" style={{ marginTop: 4, fontSize: 12 }}>Match-Score ≥85% für Mathematik & Sport, Sek I.</p>
              <a className="t-tiny" style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, marginTop: 8, display: 'inline-block' }}>Pool ansehen →</a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div className="spread" style={{ marginBottom: 12 }}>
            <div className="h-3" style={{ fontSize: 16 }}>Verlauf</div>
            <Button variant="ghost" size="sm" iconRight="arrow-right">Alle ansehen</Button>
          </div>
          <div className="card">
            <table className="tbl">
              <thead><tr><th>Datum</th><th>Fach / Stufe</th><th>Stellvertretung</th><th>Lektionen</th><th>Bewertung</th><th>Status</th></tr></thead>
              <tbody>
                {completed.map(r => {
                  const t = teachers.find(x => x.id === r.confirmedId);
                  return (
                    <tr key={r.id} onClick={() => navigate('/school/request/' + r.id)}>
                      <td>{formatDate(r.date)}</td>
                      <td><b>{r.subject}</b> · <span className="t-muted">{r.grade}</span></td>
                      <td>{t && <span className="row" style={{ gap: 8 }}><Avatar size={24} k={t.avatarKey} name={t.name}/>{t.name}</span>}</td>
                      <td className="t-mono">{r.lessons}</td>
                      <td><Stars n={r.rating}/></td>
                      <td><StatusPill status={r.status}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}

/* small components */
function KPI({ num, label, trend, icon, tone = 'primary' }) {
  const colorMap = { primary: 'var(--primary)', success: 'var(--success)', warn: 'oklch(45% 0.13 75)', accent: 'var(--accent)' };
  const bgMap = { primary: 'var(--primary-50)', success: 'var(--success-50)', warn: 'var(--warning-50)', accent: 'var(--accent-50)' };
  return (
    <div className="kpi">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="kpi-label">{label}</span>
        <span style={{ background: bgMap[tone], color: colorMap[tone], width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={15}/>
        </span>
      </div>
      <div className="kpi-num">{num}</div>
      {trend && <div className="kpi-trend"><Icon name="trending-up" size={12}/>{trend}</div>}
    </div>
  );
}

function Stars({ n }) {
  if (!n) return <span className="t-muted t-tiny">—</span>;
  return (
    <span className="row" style={{ gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Icon key={i} name="star" size={13} style={{ color: i <= n ? 'oklch(75% 0.16 75)' : 'var(--border-strong)' }}/>
      ))}
    </span>
  );
}

function MiniCalendar({ requests }) {
  const days = ['Mo','Di','Mi','Do','Fr','Sa','So'];
  const dayNums = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return (
    <div>
      <div className="cal" style={{ marginBottom: 6 }}>
        {days.map(d => <div key={d} className="t-tiny" style={{ textAlign: 'center', fontWeight: 600 }}>{d}</div>)}
      </div>
      <div className="cal">
        {dayNums.map(n => {
          const has = requests.some(r => parseInt(r.date.slice(-2)) === n);
          const isToday = n === 8;
          return <div key={n} className={`cal-day ${has ? 'has' : ''} ${isToday ? 'today' : ''}`}>{n}</div>;
        })}
      </div>
      <div className="row" style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-3)', gap: 12 }}>
        <div className="row" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--primary)' }}/>Anfragen</div>
        <div className="row" style={{ gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, border: '1px solid var(--primary)' }}/>Heute</div>
      </div>
    </div>
  );
}

function RequestRow({ r, onClick, school }) {
  const { teachers, schools } = useStore();
  const sch = schools.find(s => s.id === r.schoolId);
  const top = r.suggestedIds?.map(id => teachers.find(t => t.id === id)).filter(Boolean).slice(0,3) || [];
  return (
    <div className="list-row" onClick={onClick}>
      <div style={{ width: 56, textAlign: 'center', flexShrink: 0 }}>
        <div className="t-tiny" style={{ color: 'var(--ink-3)' }}>{new Date(r.date).toLocaleDateString('de-CH', { month: 'short' })}</div>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginTop: 2 }}>{new Date(r.date).getDate()}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 8, marginBottom: 4 }}>
          <b style={{ fontSize: 14 }}>{r.subject}</b>
          <span className="t-muted" style={{ fontSize: 13 }}>· {r.grade}</span>
          <UrgencyPill u={r.urgency}/>
        </div>
        <div className="t-tiny">
          <Icon name="clock" size={11} style={{ verticalAlign: 'middle', marginRight: 4 }}/>{r.start}–{r.end} · {r.lessons} Lektionen{!school && ` · ${sch.name}`}
        </div>
      </div>
      <div className="col" style={{ gap: 4, alignItems: 'flex-end' }}>
        <StatusPill status={r.status}/>
        {r.status !== 'confirmed' && r.status !== 'completed' && (
          <div className="row" style={{ gap: -6 }}>
            {top.map((t, i) => (
              <div key={t.id} style={{ marginLeft: i ? -8 : 0, border: '2px solid var(--surface)', borderRadius: 999 }}>
                <Avatar name={t.name} size={22} k={t.avatarKey}/>
              </div>
            ))}
            {r.applicants > 0 && <span className="t-tiny" style={{ marginLeft: 8 }}>{r.applicants} Bewerbungen</span>}
          </div>
        )}
      </div>
      <Icon name="chevron-right" size={16} style={{ color: 'var(--ink-4)' }}/>
    </div>
  );
}

/* =============== NEW REQUEST FLOW =============== */
function NewRequest() {
  const { navigate, requests, setRequests, user, showToast, subjects, grades, inserateUsed, inserateLimit, setInserateUsed } = useStore();
  const isMobile = useIsMobile();
  const [s, setS] = useState({
    subject: 'Mathematik', grade: 'Sek I', date: '2026-05-12',
    start: '08:00', end: '11:30', lessons: 4,
    urgency: 'medium', note: ''
  });
  const [matchVisible, setMatchVisible] = useState(false);
  const matches = useMemo(() => {
    return TEACHERS.map(t => {
      let score = 50;
      if (t.subjects.includes(s.subject)) score += 25;
      if (t.grades.includes(s.grade)) score += 15;
      if (t.av === 'today' || t.av === 'tomorrow') score += 6;
      score += Math.max(0, 10 - t.km);
      score += (t.rating - 4) * 6;
      return { ...t, score: Math.min(99, Math.round(score)) };
    }).sort((a, b) => b.score - a.score);
  }, [s.subject, s.grade]);

  const submit = () => {
    if (inserateUsed >= inserateLimit) {
      showToast('Inserate-Kontingent aufgebraucht. Kaufe ein zusätzliches Paket.', 'error');
      return;
    }
    const newR = {
      id: 'r' + Date.now(), schoolId: user.schoolId,
      ...s, status: 'matched', applicants: 0,
      suggestedIds: matches.slice(0,5).map(m => m.id),
      confirmedId: null, handoverComplete: false,
      createdAt: new Date().toISOString(),
    };
    setRequests([newR, ...requests]);
    setInserateUsed(n => n + 1);
    showToast('Anfrage veröffentlicht. 5 Lehrpersonen benachrichtigt.');
    navigate('/school/request/' + newR.id);
  };

  return (
    <SchoolShell active="/school/requests">
      <AppTopbar title="Neue Stellvertretung" sub="Anfrage erfassen → Match wählen → Bestätigen" search={false}/>
      <div className="page fade-in">
        <div className="row" style={{ marginBottom: 16 }}>
          <Button variant="ghost" size="sm" icon="arrow-left" onClick={() => navigate('/school')}>Zurück</Button>
          <span className="t-tiny">Schritt 1 von 2</span>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 24, alignItems: 'flex-start' }}>
          <div className="card" style={{ padding: 28 }}>
            <div className="h-2">Was wird benötigt?</div>
            <p className="t-muted" style={{ marginTop: 4, marginBottom: 24 }}>Diese Angaben helfen TeachConnect, passende Lehrpersonen vorzuschlagen.</p>

            <div className="grid-2">
              <div className="field">
                <label className="label">Fach</label>
                <select className="select" value={s.subject} onChange={e => setS({ ...s, subject: e.target.value })}>
                  {subjects.map(x => <option key={x}>{x}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Schulstufe</label>
                <select className="select" value={s.grade} onChange={e => setS({ ...s, grade: e.target.value })}>
                  {grades.map(x => <option key={x}>{x}</option>)}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="label">Datum</label>
              <input className="input" type="date" value={s.date} onChange={e => setS({ ...s, date: e.target.value })}/>
            </div>

            <div className="grid-3" style={{ gap: 12 }}>
              <div className="field">
                <label className="label">Start</label>
                <input className="input" type="time" value={s.start} onChange={e => setS({ ...s, start: e.target.value })}/>
              </div>
              <div className="field">
                <label className="label">Ende</label>
                <input className="input" type="time" value={s.end} onChange={e => setS({ ...s, end: e.target.value })}/>
              </div>
              <div className="field">
                <label className="label">Lektionen</label>
                <input className="input" type="number" value={s.lessons} onChange={e => setS({ ...s, lessons: +e.target.value })}/>
              </div>
            </div>

            <div className="field">
              <label className="label">Dringlichkeit</label>
              <div className="seg">
                {[{v:'low',l:'Planbar'},{v:'medium',l:'Dringend'},{v:'high',l:'Sehr dringend'}].map(x =>
                  <button key={x.v} className={s.urgency === x.v ? 'active' : ''} onClick={() => setS({ ...s, urgency: x.v })}>{x.l}</button>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label">Notiz für Stellvertretung</label>
              <textarea className="textarea" rows={3} placeholder={'Klasse, Thema, Material… z.B. „Bruchrechnen Kapitel 7, Klasse 7a, Mathbu.ch S. 84"'} value={s.note} onChange={e => setS({ ...s, note: e.target.value })}/>
            </div>

            <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name="paperclip" size={16} style={{ color: 'var(--ink-3)' }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Lektionsplan & Material anhängen</div>
                <div className="t-tiny">Optional. Kann auch nach Bestätigung ergänzt werden.</div>
              </div>
              <Button variant="outline" size="sm" icon="upload">Hochladen</Button>
            </div>

            {inserateUsed >= inserateLimit - 2 && (
              <div style={{ background: inserateUsed >= inserateLimit ? 'oklch(99% 0.015 20)' : 'var(--surface-2)', border: `1px solid ${inserateUsed >= inserateLimit ? 'var(--danger)' : 'oklch(72% 0.13 75)'}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                <Icon name="alert-triangle" size={16} style={{ color: inserateUsed >= inserateLimit ? 'var(--danger)' : 'oklch(55% 0.13 75)', flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  {inserateUsed >= inserateLimit
                    ? <><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>Kontingent aufgebraucht</div><div className="t-tiny">Alle {inserateLimit} Inserate für Mai 2026 sind aufgebraucht. Kaufe ein Zusatz-Paket, um neue Anfragen zu stellen.</div></>
                    : <><div style={{ fontSize: 13, fontWeight: 600 }}>Nur noch {inserateLimit - inserateUsed} Inserate verfügbar</div><div className="t-tiny">{inserateUsed} von {inserateLimit} Inseraten für Mai 2026 verwendet.</div></>
                  }
                </div>
                {inserateUsed >= inserateLimit && <Button variant="primary" size="sm" icon="plus" onClick={() => { setInserateUsed(n => Math.max(0, n - 5)); showToast('+5 Inserate hinzugefügt. CHF 30.00 wird verrechnet.'); }}>Paket kaufen (CHF 30)</Button>}
              </div>
            )}
            <div className="row" style={{ marginTop: 16, justifyContent: 'space-between' }}>
              <Button variant="ghost" onClick={() => setMatchVisible(!matchVisible)}>{matchVisible ? 'Vorschau ausblenden' : 'Match-Vorschau'}</Button>
              <div className="row">
                <Button variant="outline" onClick={() => showToast('Als Entwurf gespeichert.')}>Als Entwurf speichern</Button>
                <Button variant="primary" iconRight="arrow-right" onClick={submit} disabled={inserateUsed >= inserateLimit}>Veröffentlichen & matchen</Button>
              </div>
            </div>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="row" style={{ marginBottom: 12 }}>
                <Icon name="sparkles" size={18} style={{ color: 'var(--primary)' }}/>
                <div className="h-3" style={{ fontSize: 14 }}>Smart Match Vorschau</div>
              </div>
              <p className="t-muted" style={{ fontSize: 13, marginBottom: 16 }}>Live-Vorschläge auf Basis deiner aktuellen Eingaben. Wird beim Veröffentlichen final berechnet.</p>
              <div className="col" style={{ gap: 8 }}>
                {matches.slice(0, 4).map(m => (
                  <div key={m.id} className="row" style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)' }}>
                    <Avatar name={m.name} size={32} k={m.avatarKey}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                      <div className="t-tiny">{m.region} · {m.km} km · {m.subjects.slice(0,2).join(', ')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`match-score ${m.score < 70 ? 'low' : m.score < 85 ? 'med' : ''}`}>{m.score}%</span>
                      <div className="t-tiny" style={{ marginTop: 2 }}>{m.av === 'today' ? 'Heute frei' : m.av === 'tomorrow' ? 'Morgen frei' : 'Diese Woche'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 18, background: 'var(--surface-2)' }}>
              <Icon name="shield-check" size={16} style={{ color: 'var(--success)' }}/>
              <div className="h-3" style={{ fontSize: 13, marginTop: 8 }}>Wer wird benachrichtigt?</div>
              <p className="t-muted" style={{ fontSize: 12, marginTop: 6 }}>Beim Veröffentlichen erhalten die Top 5 Vorschläge eine Push-Benachrichtigung. Anfragen sind bis zur Bestätigung anonym sichtbar.</p>
            </div>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}

/* =============== REQUEST DETAIL =============== */
function RequestDetail({ id }) {
  const { requests, setRequests, navigate, schools, teachers, user, showToast } = useStore();
  const isMobile = useIsMobile();
  const r = requests.find(x => x.id === id);
  if (!r) return <SchoolShell active="/school/requests"><AppTopbar title="Nicht gefunden"/><div className="page">Anfrage nicht gefunden.</div></SchoolShell>;

  const sch = schools.find(s => s.id === r.schoolId);
  const matches = (r.suggestedIds || []).map(tid => teachers.find(t => t.id === tid)).filter(Boolean);
  const confirmed = r.confirmedId ? teachers.find(t => t.id === r.confirmedId) : null;

  const confirmTeacher = (teacherId) => {
    setRequests(requests.map(x => x.id === r.id ? { ...x, status: 'confirmed', confirmedId: teacherId } : x));
    showToast(`${teachers.find(t => t.id === teacherId).name} bestätigt. Übergabe wird vorbereitet.`);
  };

  return (
    <SchoolShell active="/school/requests">
      <AppTopbar title={`${r.subject} · ${r.grade}`} sub={`${formatDate(r.date)} · ${r.start}–${r.end}`} search={false}/>
      <div className="page fade-in">
        <div className="row" style={{ marginBottom: 16 }}>
          <Button variant="ghost" size="sm" icon="arrow-left" onClick={() => navigate('/school/requests')}>Zurück zu Anfragen</Button>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: 24, alignItems: 'flex-start' }}>
          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <div className="spread">
                <div>
                  <div className="row" style={{ gap: 8 }}>
                    <StatusPill status={r.status}/>
                    <UrgencyPill u={r.urgency}/>
                    {r.handoverComplete ? <Pill variant="success"><Icon name="check" size={11}/>Übergabe vollständig</Pill> : <Pill variant="warn"><Icon name="clock" size={11}/>Übergabe ausstehend</Pill>}
                  </div>
                  <div className="h-2" style={{ marginTop: 10 }}>{r.subject} · {r.grade}</div>
                  <div className="t-muted" style={{ marginTop: 4 }}>
                    <Icon name="calendar" size={13} style={{ verticalAlign: 'middle', marginRight: 4 }}/>{formatDate(r.date)} ({formatRelativeDate(r.date)}) ·
                    <Icon name="clock" size={13} style={{ verticalAlign: 'middle', margin: '0 4px 0 8px' }}/>{r.start}–{r.end} · {r.lessons} Lektionen
                  </div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <Button variant="outline" size="sm" icon="edit">Bearbeiten</Button>
                  {r.status !== 'completed' && <Button variant="ghost" size="sm" icon="trash">Löschen</Button>}
                </div>
              </div>
              <div className="divider" style={{ margin: '20px 0' }}/>
              <div className="t-eyebrow">Notiz</div>
              <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-2)' }}>{r.note}</p>
            </div>

            {confirmed ? (
              <div className="card" style={{ padding: 24 }}>
                <div className="row" style={{ marginBottom: 14 }}>
                  <Icon name="check-circle" size={18} style={{ color: 'var(--success)' }}/>
                  <div className="h-3">Bestätigte Stellvertretung</div>
                </div>
                <div className="row" style={{ gap: 16 }}>
                  <Avatar name={confirmed.name} size={56} k={confirmed.avatarKey}/>
                  <div style={{ flex: 1 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <b style={{ fontSize: 16 }}>{confirmed.name}</b>
                      <Pill variant="success"><Icon name="shield-check" size={11}/>Verifiziert</Pill>
                    </div>
                    <div className="t-muted" style={{ marginTop: 4 }}>{confirmed.qual} · {confirmed.exp} J. Erfahrung · ★ {confirmed.rating} ({confirmed.jobs} Einsätze)</div>
                  </div>
                  <div className="col" style={{ gap: 6 }}>
                    <Button variant="outline" size="sm" icon="message">Nachricht</Button>
                    <Button variant="ghost" size="sm" icon="phone">Anrufen</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="spread" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div className="h-3">Vorgeschlagene Lehrpersonen</div>
                  <span className="t-tiny">{matches.length} Vorschläge · sortiert nach Match-Score</span>
                </div>
                <div className="col" style={{ gap: 0 }}>
                  {matches.map((t, i) => (
                    <MatchRow key={t.id} t={t} score={97 - i*4} onConfirm={() => confirmTeacher(t.id)}/>
                  ))}
                </div>
              </div>
            )}

            <div className="card" style={{ padding: 24 }}>
              <div className="spread" style={{ marginBottom: 16 }}>
                <div className="h-3">Unterrichtsübergabe</div>
                {r.handoverComplete ? <Pill variant="success">Vollständig</Pill> : <Pill variant="warn">Bitte ergänzen</Pill>}
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                {[
                  { i: 'file', t: 'Lektionsplan', d: r.handoverComplete ? 'lektionsplan-mathe-7a.pdf' : '—', ok: r.handoverComplete },
                  { i: 'users', t: 'Klassenliste', d: 'Klasse 7a · 22 SuS', ok: true },
                  { i: 'book', t: 'Lehrmittel', d: 'Mathbu.ch 7, Kapitel 6', ok: r.handoverComplete },
                  { i: 'map-pin', t: 'Schulhaus & Raum', d: `${sch.address} · Raum 204`, ok: true },
                  { i: 'shield', t: 'Notfall & Hausordnung', d: 'PDF · 2 Seiten', ok: true },
                  { i: 'message', t: 'Spezielle Hinweise', d: 'Tim braucht Sitz vorne. Lara hat Heuschnupfen-Attest.', ok: r.handoverComplete },
                ].map(h => (
                  <div key={h.t} className="row" style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 10, background: h.ok ? 'var(--surface)' : 'var(--surface-2)' }}>
                    <div className="feature-icon" style={{ width: 32, height: 32, background: h.ok ? 'var(--success-50)' : 'var(--surface-3)', color: h.ok ? 'var(--success)' : 'var(--ink-4)' }}>
                      <Icon name={h.i} size={15}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{h.t}</div>
                      <div className="t-tiny" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.d}</div>
                    </div>
                    <Icon name={h.ok ? 'check' : 'plus'} size={14} style={{ color: h.ok ? 'var(--success)' : 'var(--ink-4)' }}/>
                  </div>
                ))}
              </div>
              {!r.handoverComplete && (
                <Button variant="primary" size="sm" icon="upload" style={{ marginTop: 16 }}>Übergabe vervollständigen</Button>
              )}
            </div>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Verlauf</div>
              <div className="tl">
                <TLItem dot="success" t="Anfrage veröffentlicht" sub={new Date(r.createdAt).toLocaleString('de-CH', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}/>
                <TLItem dot="success" t={`${matches.length} Lehrpersonen benachrichtigt`} sub="Push & E-Mail"/>
                {r.applicants > 0 && <TLItem dot="primary" t={`${r.applicants} Bewerbungen erhalten`} sub="Sortiert nach Match-Score"/>}
                {confirmed && <TLItem dot="success" t={`${confirmed.name} bestätigt`} sub="Übergabe gestartet"/>}
                {r.status === 'completed' && <TLItem dot="success" t="Einsatz abgeschlossen" sub="Bewertung abgegeben"/>}
                <TLItem dot="muted" t="Wartet auf Einsatz" sub={formatRelativeDate(r.date)}/>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Schule</div>
              <div className="row">
                <Avatar name={sch.name} size={40} k={sch.logo}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{sch.name}</div>
                  <div className="t-tiny">{sch.region} · {sch.size} SuS</div>
                </div>
              </div>
              <div className="t-muted" style={{ fontSize: 13, marginTop: 10 }}>{sch.address}</div>
            </div>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}

function TLItem({ dot, t, sub }) {
  return (
    <div className="tl-item">
      <div className={`tl-dot ${dot || ''}`}/>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
        <div className="t-tiny">{sub}</div>
      </div>
    </div>
  );
}

function MatchRow({ t, score, onConfirm }) {
  return (
    <div className="list-row">
      <Avatar name={t.name} size={44} k={t.avatarKey}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 8, marginBottom: 4 }}>
          <b style={{ fontSize: 14 }}>{t.name}</b>
          <Pill variant="success"><Icon name="shield-check" size={11}/>Verifiziert</Pill>
          <Stars n={Math.round(t.rating)}/>
          <span className="t-tiny">({t.jobs})</span>
        </div>
        <div className="t-tiny">
          {t.subjects.slice(0,3).join(', ')} · {t.grades.join(', ')} · {t.region} · {t.km} km · {t.av === 'today' ? 'Heute frei' : t.av === 'tomorrow' ? 'Morgen frei' : 'Diese Woche'}
        </div>
      </div>
      <div className="col" style={{ alignItems: 'flex-end', gap: 6 }}>
        <span className={`match-score ${score < 70 ? 'low' : score < 85 ? 'med' : ''}`}>{score}% Match</span>
        <div className="match-bar"><div className="match-bar-fill" style={{ width: `${score}%`, background: score < 70 ? 'var(--danger)' : score < 85 ? 'oklch(72% 0.13 75)' : 'var(--success)' }}/></div>
      </div>
      <div className="row" style={{ gap: 6 }}>
        <Button variant="ghost" size="sm" icon="eye">Profil</Button>
        <Button variant="primary" size="sm" iconRight="check" onClick={onConfirm}>Bestätigen</Button>
      </div>
    </div>
  );
}

/* =============== SCHOOL: REQUESTS LIST =============== */
function SchoolRequests() {
  const { requests, navigate, user } = useStore();
  const [tab, setTab] = useState('open');
  const myReqs = requests.filter(r => r.schoolId === user.schoolId);
  const filtered = tab === 'open' ? myReqs.filter(r => r.status === 'open' || r.status === 'matched')
    : tab === 'confirmed' ? myReqs.filter(r => r.status === 'confirmed')
    : tab === 'completed' ? myReqs.filter(r => r.status === 'completed')
    : myReqs;

  return (
    <SchoolShell active="/school/requests">
      <AppTopbar title="Anfragen" sub="Alle deine Stellvertretungs-Anfragen"/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Anfragen</div>
            <div className="page-sub">Status, Bewerbungen, Bestätigungen</div>
          </div>
          <Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Neue Stellvertretung</Button>
        </div>

        <div className="tabs">
          {[{v:'open',l:`Offen (${myReqs.filter(r=>r.status==='open'||r.status==='matched').length})`},{v:'confirmed',l:`Bestätigt (${myReqs.filter(r=>r.status==='confirmed').length})`},{v:'completed',l:`Abgeschlossen (${myReqs.filter(r=>r.status==='completed').length})`},{v:'all',l:'Alle'}].map(t =>
            <div key={t.v} className={`tab ${tab === t.v ? 'active' : ''}`} onClick={() => setTab(t.v)}>{t.l}</div>
          )}
        </div>

        <div className="card">
          {filtered.length === 0 ? (
            <div style={{ padding: 32 }}><EmptyState icon="briefcase" title="Keine Anfragen in dieser Ansicht." description="Wechsle den Tab oder erstelle eine neue Anfrage." action={<Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Neue Anfrage</Button>}/></div>
          ) : filtered.map(r => <RequestRow key={r.id} r={r} onClick={() => navigate('/school/request/' + r.id)} school/>)}
        </div>
      </div>
    </SchoolShell>
  );
}

/* =============== SCHOOL: BOOKINGS =============== */
function SchoolBookings() {
  const { requests, teachers, user, navigate, showToast } = useStore();
  const [tab, setTab] = useState('upcoming');
  const [subjectF, setSubjectF] = useState('');
  const [gradeF, setGradeF] = useState('');

  const sid = user?.schoolId || 's1';
  const today = '2026-05-10';

  const EXTRA = [
    { id: 'bk1', schoolId: sid, subject: 'Deutsch', grade: '5./6. Primar', date: '2026-05-14', start: '08:00', end: '11:30', lessons: 4, status: 'confirmed', confirmedId: 't1', urgency: 'medium', note: '', suggestedIds: ['t1'], handoverComplete: true, createdAt: '2026-05-09T08:00:00' },
    { id: 'bk2', schoolId: sid, subject: 'Mathematik', grade: '3./4. Primar', date: '2026-05-16', start: '10:00', end: '11:30', lessons: 2, status: 'confirmed', confirmedId: 't4', urgency: 'low', note: '', suggestedIds: ['t4'], handoverComplete: false, createdAt: '2026-05-09T09:00:00' },
    { id: 'bk3', schoolId: sid, subject: 'NMG', grade: '3./4. Primar', date: '2026-05-07', start: '10:00', end: '11:30', lessons: 2, status: 'completed', confirmedId: 't3', urgency: 'low', note: '', suggestedIds: ['t3'], handoverComplete: true, createdAt: '2026-05-05T10:00:00', rating: 5 },
    { id: 'bk4', schoolId: sid, subject: 'Musik', grade: '1./2. Primar', date: '2026-05-06', start: '13:00', end: '14:30', lessons: 2, status: 'completed', confirmedId: 't6', urgency: 'low', note: '', suggestedIds: ['t6'], handoverComplete: true, createdAt: '2026-05-04T09:00:00', rating: 4 },
    { id: 'bk5', schoolId: sid, subject: 'Informatik', grade: 'Sek II', date: '2026-05-20', start: '08:00', end: '11:30', lessons: 4, status: 'confirmed', confirmedId: 't2', urgency: 'high', note: '', suggestedIds: ['t2'], handoverComplete: true, createdAt: '2026-05-09T11:00:00' },
  ];

  const allReqs = [...requests, ...EXTRA];
  const base = allReqs.filter(r => r.schoolId === sid && (r.status === 'confirmed' || r.status === 'completed'));

  const filtered = base.filter(r => {
    const ok1 = tab === 'upcoming' ? r.status === 'confirmed' && r.date >= today
      : tab === 'completed' ? r.status === 'completed'
      : true;
    return ok1 && (!subjectF || r.subject === subjectF) && (!gradeF || r.grade === gradeF);
  });

  const upcoming = base.filter(r => r.status === 'confirmed');
  const done = base.filter(r => r.status === 'completed');
  const totalLessons = base.reduce((s, r) => s + r.lessons, 0);
  const allSubjects = [...new Set(base.map(r => r.subject))];
  const allGrades = [...new Set(base.map(r => r.grade))];

  return (
    <SchoolShell active="/school/bookings">
      <AppTopbar title="Buchungen" sub="Bestätigte Stellvertretungen"/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Buchungen</div>
            <div className="page-sub">Bestätigte und abgeschlossene Stellvertretungen</div>
          </div>
          <Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Neue Stellvertretung</Button>
        </div>

        <div className="grid-4" style={{ marginBottom: 24 }}>
          <KPI num={upcoming.length} label="Kommend" icon="calendar" tone="primary"/>
          <KPI num={done.length} label="Abgeschlossen" icon="check-circle" tone="success"/>
          <KPI num={totalLessons} label="Lektionen gesamt" icon="book" tone="accent"/>
          <KPI num={`CHF ${(totalLessons * 92).toLocaleString('de-CH')}`} label="Gesamtkosten" icon="trending-up" tone="warn"/>
        </div>

        <div className="card">
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
              <div className="tabs" style={{ flex: 1, minWidth: 0 }}>
                {[{ v:'upcoming', l:`Kommend (${upcoming.length})` }, { v:'completed', l:`Abgeschlossen (${done.length})` }, { v:'all', l:'Alle' }]
                  .map(t => <div key={t.v} className={`tab ${tab===t.v?'active':''}`} onClick={() => setTab(t.v)}>{t.l}</div>)}
              </div>
              <div className="row" style={{ gap: 8 }}>
                <select className="select" style={{ height: 36, fontSize: 13 }} value={subjectF} onChange={e => setSubjectF(e.target.value)}>
                  <option value="">Alle Fächer</option>
                  {allSubjects.map(s => <option key={s}>{s}</option>)}
                </select>
                <select className="select" style={{ height: 36, fontSize: 13 }} value={gradeF} onChange={e => setGradeF(e.target.value)}>
                  <option value="">Alle Stufen</option>
                  {allGrades.map(g => <option key={g}>{g}</option>)}
                </select>
                <Button variant="ghost" size="sm" icon="filter" onClick={() => { setSubjectF(''); setGradeF(''); }}>Zurücksetzen</Button>
              </div>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: 32 }}><EmptyState icon="calendar" title="Keine Buchungen in dieser Ansicht." description="Wechsle den Tab oder passe die Filter an."/></div>
          ) : (
            <table className="tbl">
              <thead><tr><th>Datum</th><th>Fach / Stufe</th><th>Stellvertretung</th><th>Lektionen</th><th>Kosten</th><th>Übergabe</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.sort((a,b) => a.date.localeCompare(b.date)).map(r => {
                  const t = r.confirmedId ? teachers.find(x => x.id === r.confirmedId) : null;
                  return (
                    <tr key={r.id} onClick={() => navigate('/school/request/' + r.id)}>
                      <td><div style={{ fontWeight:600, fontSize:13 }}>{formatDate(r.date)}</div><div className="t-tiny">{r.start}–{r.end}</div></td>
                      <td><b>{r.subject}</b> · <span className="t-muted">{r.grade}</span></td>
                      <td>{t ? <div className="row" style={{ gap:8 }}><Avatar name={t.name} size={24} k={t.avatarKey}/><div><div style={{ fontSize:13, fontWeight:600 }}>{t.name}</div><div className="t-tiny">★ {t.rating}</div></div></div> : <span className="t-muted">—</span>}</td>
                      <td className="t-mono">{r.lessons}</td>
                      <td className="t-mono">CHF {(r.lessons * 92).toFixed(2)}</td>
                      <td>{r.handoverComplete ? <Pill variant="success"><Icon name="check" size={10}/>Ok</Pill> : <Pill variant="warn">Ausstehend</Pill>}</td>
                      <td><StatusPill status={r.status}/></td>
                      <td><Icon name="chevron-right" size={16} style={{ color:'var(--ink-4)' }}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SchoolShell>
  );
}

/* =============== SCHOOL: HANDOVER =============== */
function SchoolHandover() {
  const { navigate, showToast } = useStore();
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState('ho1');

  const INIT = [
    { id:'ho1', cls:'7a', teacher:'Frau Müller', subject:'Mathematik', date:'2026-05-12', requestId:'r1',
      note:'Tim braucht Sitz vorne. Lara hat Heuschnupfen-Attest. Mara wird um 11:00 abgeholt.',
      docs:[
        { key:'lp', label:'Lektionsplan', file:'lp-mathe-7a-kw19.pdf', ok:true },
        { key:'kl', label:'Klassenliste', file:'klassenliste-7a.pdf', ok:true },
        { key:'rp', label:'Schulhaus-Plan', file:'schulhaus-davos-plan.pdf', ok:true },
        { key:'lm', label:'Lehrmittel', file:'Mathbu.ch 7 – Kap. 6', ok:true },
        { key:'ho', label:'Hausordnung', file:'hausordnung-davos.pdf', ok:true },
      ],
    },
    { id:'ho2', cls:'6b', teacher:'Herr Schneider', subject:'Sport', date:'2026-05-12', requestId:'r2',
      note:'',
      docs:[
        { key:'lp', label:'Lektionsplan', file:'lp-sport-6b.pdf', ok:true },
        { key:'kl', label:'Klassenliste', file:'klassenliste-6b.pdf', ok:true },
        { key:'rp', label:'Turnhallen-Plan', file:'', ok:false },
        { key:'lm', label:'Geräte-Übersicht', file:'', ok:false },
        { key:'ho', label:'Hausordnung', file:'hausordnung-davos.pdf', ok:true },
      ],
    },
    { id:'ho3', cls:'9c', teacher:'Frau Ritter', subject:'Englisch', date:'2026-05-15', requestId:'r7',
      note:'Prüfung nächste Woche – nicht zu viel neues Stoff.',
      docs:[
        { key:'lp', label:'Lektionsplan', file:'lp-englisch-9c.pdf', ok:true },
        { key:'kl', label:'Klassenliste', file:'klassenliste-9c.pdf', ok:true },
        { key:'rp', label:'Schulhaus-Plan', file:'schulhaus-davos-plan.pdf', ok:true },
        { key:'lm', label:'Lehrmittel', file:'', ok:false },
        { key:'ho', label:'Hausordnung', file:'hausordnung-davos.pdf', ok:true },
      ],
    },
    { id:'ho4', cls:'5a', teacher:'Frau Berger', subject:'NMG', date:'2026-05-19', requestId:'',
      note:'Ruhige Klasse. Bitte Hefte einsammeln.',
      docs:[
        { key:'lp', label:'Lektionsplan', file:'lp-nmg-5a.pdf', ok:true },
        { key:'kl', label:'Klassenliste', file:'klassenliste-5a.pdf', ok:true },
        { key:'rp', label:'Schulhaus-Plan', file:'schulhaus-davos-plan.pdf', ok:true },
        { key:'lm', label:'Lehrmittel', file:'Natur & Mensch 5/6, Kap. 4', ok:true },
        { key:'ho', label:'Hausordnung', file:'hausordnung-davos.pdf', ok:true },
      ],
    },
  ];

  const [classes, setClasses] = useState(INIT);
  const [noteVal, setNoteVal] = useState({});

  const sel = classes.find(c => c.id === selected);
  const complete = c => c.docs.every(d => d.ok);

  const markDoc = (docKey) => {
    setClasses(cls => cls.map(c => c.id === selected
      ? { ...c, docs: c.docs.map(d => d.key === docKey ? { ...d, ok: true, file: d.label + '-neu.pdf' } : d) }
      : c));
    showToast('Dokument hochgeladen.');
  };

  const markComplete = () => {
    setClasses(cls => cls.map(c => c.id === selected ? { ...c, docs: c.docs.map(d => ({ ...d, ok:true, file: d.file || d.label + '.pdf' })) } : c));
    showToast('Übergabe als vollständig markiert.');
  };

  return (
    <SchoolShell active="/school/handover">
      <AppTopbar title="Unterrichtsübergabe" sub="Materialien für Stellvertretungen"/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Unterrichtsübergabe</div>
            <div className="page-sub">Lektionspläne, Klassenlisten und Notizen verwalten</div>
          </div>
          <div className="row">
            <Button variant="outline" icon="upload" onClick={() => showToast('Upload gestartet.')}>Material hochladen</Button>
            <Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Neue Anfrage</Button>
          </div>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1.7fr', gap:24, alignItems:'flex-start' }}>
          <div className="col" style={{ gap:10 }}>
            <div className="card" style={{ padding:'12px 16px', background:'var(--surface-2)' }}>
              <div className="t-tiny" style={{ fontWeight:600 }}>{classes.filter(c => complete(c)).length}/{classes.length} Übergaben vollständig</div>
              <div className="match-bar" style={{ marginTop:6 }}>
                <div className="match-bar-fill" style={{ width:`${Math.round(classes.filter(c=>complete(c)).length/classes.length*100)}%`, background:'var(--success)' }}/>
              </div>
            </div>
            {classes.map(c => {
              const done = c.docs.filter(d => d.ok).length;
              const full = complete(c);
              return (
                <div key={c.id} onClick={() => setSelected(c.id)}
                  className="card"
                  style={{ padding:16, cursor:'pointer', border: selected===c.id ? '2px solid var(--primary)' : '1px solid var(--border)', background: selected===c.id ? 'var(--primary-50)' : 'var(--surface)' }}>
                  <div className="spread">
                    <div className="row" style={{ gap:10 }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:'var(--primary-50)', color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, flexShrink:0 }}>{c.cls}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{c.subject} · Kl. {c.cls}</div>
                        <div className="t-tiny">{c.teacher} · {formatDate(c.date)}</div>
                      </div>
                    </div>
                    {full ? <Pill variant="success"><Icon name="check" size={10}/>OK</Pill> : <Pill variant="warn">{done}/{c.docs.length}</Pill>}
                  </div>
                </div>
              );
            })}
          </div>

          {sel && (
            <div className="card" style={{ padding:24 }}>
              <div className="spread" style={{ marginBottom:20 }}>
                <div>
                  <div className="h-2">{sel.subject} · Klasse {sel.cls}</div>
                  <div className="t-muted" style={{ marginTop:4 }}>{sel.teacher} · {formatDate(sel.date)}</div>
                </div>
                {complete(sel) ? <Pill variant="success">Vollständig</Pill> : <Pill variant="warn">Bitte ergänzen</Pill>}
              </div>

              <div className="col" style={{ gap:8 }}>
                {sel.docs.map(d => (
                  <div key={d.key} className="row" style={{ padding:12, border:'1px solid var(--border)', borderRadius:10, background: d.ok ? 'var(--surface)' : 'oklch(98.5% 0.01 30)' }}>
                    <div style={{ width:32, height:32, borderRadius:8, background: d.ok ? 'var(--success-50)' : 'var(--surface-3)', color: d.ok ? 'var(--success)' : 'var(--ink-4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon name={d.ok ? 'check' : 'upload'} size={14}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{d.label}</div>
                      {d.file ? <div className="t-tiny">{d.file}</div> : <div className="t-tiny" style={{ color:'var(--danger)' }}>Noch nicht hinterlegt</div>}
                    </div>
                    {d.ok
                      ? <div className="row" style={{ gap:4 }}>
                          <Button variant="ghost" size="sm" icon="eye" onClick={() => showToast(`${d.label} geöffnet.`)}>Ansehen</Button>
                          <Button variant="ghost" size="sm" icon="edit" onClick={() => showToast(`${d.label} ersetzt.`)}>Ersetzen</Button>
                        </div>
                      : <Button variant="outline" size="sm" icon="upload" onClick={() => markDoc(d.key)}>Hochladen</Button>
                    }
                  </div>
                ))}
              </div>

              <div style={{ marginTop:18 }}>
                <div className="h-3" style={{ fontSize:14, marginBottom:8 }}>Spezielle Hinweise</div>
                <textarea className="textarea" rows={3}
                  value={noteVal[sel.id] !== undefined ? noteVal[sel.id] : sel.note}
                  onChange={e => setNoteVal(n => ({ ...n, [sel.id]: e.target.value }))}
                  placeholder="Besonderheiten, Schüler:innen mit spez. Bedürfnissen, Klassenregeln…"/>
              </div>

              <div className="row" style={{ marginTop:16, justifyContent:'space-between' }}>
                {sel.requestId
                  ? <Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => navigate('/school/request/' + sel.requestId)}>Zur Anfrage</Button>
                  : <div/>}
                <div className="row">
                  <Button variant="outline" onClick={() => showToast('Entwurf gespeichert.')}>Speichern</Button>
                  <Button variant="primary" icon="check" onClick={markComplete}>Als vollständig markieren</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SchoolShell>
  );
}

/* =============== SCHOOL: FINANCES =============== */
function SchoolFinances() {
  const { inserateUsed, inserateLimit, setInserateUsed, showToast, user } = useStore();
  const insLeft = inserateLimit - inserateUsed;

  const MONTHS = [
    { m: 'Dez 25', abo: 75, inserate: 0,  vermittlung: 184 },
    { m: 'Jan 26', abo: 75, inserate: 0,  vermittlung: 552 },
    { m: 'Feb 26', abo: 75, inserate: 30, vermittlung: 368 },
    { m: 'Mär 26', abo: 75, inserate: 0,  vermittlung: 736 },
    { m: 'Apr 26', abo: 75, inserate: 30, vermittlung: 920 },
    { m: 'Mai 26', abo: 75, inserate: 0,  vermittlung: 460 },
  ];

  const TRANSACTIONS = [
    { date: '2026-05-01', type: 'Abo',        desc: 'Schul-Abonnement Mai 2026',                            amount: 75,  status: 'bezahlt' },
    { date: '2026-05-09', type: 'Vermittlung', desc: 'Stellvertretung: Englisch Sek II (Lara Hofer)',        amount: 115, status: 'bezahlt' },
    { date: '2026-05-09', type: 'Vermittlung', desc: 'Stellvertretung: Mathematik Sek I (David Eberle)',     amount: 345, status: 'ausstehend' },
    { date: '2026-04-28', type: 'Inserate',    desc: '+5 Inserate-Paket (April)',                            amount: 30,  status: 'bezahlt' },
    { date: '2026-04-01', type: 'Abo',         desc: 'Schul-Abonnement April 2026',                          amount: 75,  status: 'bezahlt' },
    { date: '2026-04-10', type: 'Vermittlung', desc: 'Stellvertretung: Sport Sek I (Reto Janett)',           amount: 230, status: 'bezahlt' },
    { date: '2026-04-18', type: 'Vermittlung', desc: 'Stellvertretung: Biologie Sek I (Nora Willi)',         amount: 345, status: 'bezahlt' },
    { date: '2026-04-22', type: 'Vermittlung', desc: 'Stellvertretung: Deutsch 5./6. Primar (Sina Capaul)', amount: 345, status: 'bezahlt' },
  ];

  const maxTotal = Math.max(...MONTHS.map(m => m.abo + m.inserate + m.vermittlung));
  const totalThisMonth = MONTHS[5].abo + MONTHS[5].inserate + MONTHS[5].vermittlung;
  const typeColor = { Abo: 'primary', Vermittlung: 'accent', Inserate: 'warn' };

  return (
    <SchoolShell active="/school/finances">
      <AppTopbar title="Finanzen" sub="Abo, Vermittlungsgebühren, Inserate"/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Finanzen</div>
            <div className="page-sub">Übersicht aller Kosten und Transaktionen</div>
          </div>
          <Button variant="outline" icon="download" onClick={() => showToast('Export wird vorbereitet…')}>Exportieren</Button>
        </div>

        <div className="grid-4" style={{ marginBottom: 24 }}>
          <KPI num="CHF 75" label="Abo / Monat" icon="check-circle" tone="success"/>
          <KPI num={`CHF ${totalThisMonth}`} label="Mai 2026 gesamt" icon="trending-up" tone="primary"/>
          <KPI num={`${insLeft}/${inserateLimit}`} label="Inserate verfügbar" icon="briefcase" tone={insLeft <= 2 ? 'warn' : 'accent'}/>
          <KPI num="12.5 %" label="Vermittlungsgebühr" icon="zap" tone="accent"/>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="spread" style={{ marginBottom: 20 }}>
            <div className="h-3">Kosten letzte 6 Monate</div>
            <div className="row" style={{ gap: 16, fontSize: 11, color: 'var(--ink-3)' }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, background:'var(--primary)', borderRadius:2, display:'inline-block' }}/>Abo</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, background:'oklch(72% 0.13 75)', borderRadius:2, display:'inline-block' }}/>Inserate</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, background:'var(--accent)', borderRadius:2, display:'inline-block' }}/>Vermittlung</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'flex-end', height:160 }}>
            {MONTHS.map((m, i) => {
              const total = m.abo + m.inserate + m.vermittlung;
              const isCurrent = i === MONTHS.length - 1;
              const barH = Math.max(12, Math.round(total / maxTotal * 128));
              return (
                <div key={m.m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                  <div style={{ fontSize:10, fontWeight:600, color:'var(--ink-2)' }}>CHF {total}</div>
                  <div style={{ width:'100%', height: barH, display:'flex', flexDirection:'column', gap:1, borderRadius:6, overflow:'hidden' }}>
                    <div style={{ background:'var(--accent)', flex: m.vermittlung }}/>
                    {m.inserate > 0 && <div style={{ background:'oklch(72% 0.13 75)', flex: m.inserate }}/>}
                    <div style={{ background: isCurrent ? 'var(--primary)' : 'var(--primary-100)', flex: m.abo }}/>
                  </div>
                  <div className="t-tiny" style={{ fontWeight: isCurrent ? 700 : 400, color: isCurrent ? 'var(--primary)' : 'var(--ink-3)' }}>{m.m}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid-2" style={{ gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="h-3" style={{ marginBottom: 16 }}>Inserate-Kontingent Mai 2026</div>
            <div className="spread" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 13 }}>{inserateUsed} von {inserateLimit} verwendet</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: insLeft <= 2 ? 'var(--danger)' : 'var(--ink-1)' }}>{insLeft} verbleibend</span>
            </div>
            <div className="match-bar" style={{ marginBottom: 16 }}>
              <div className="match-bar-fill" style={{ width:`${Math.round(inserateUsed/inserateLimit*100)}%`, background: inserateUsed >= inserateLimit ? 'var(--danger)' : insLeft <= 2 ? 'oklch(72% 0.13 75)' : 'var(--primary)' }}/>
            </div>
            <div className="col" style={{ gap: 8 }}>
              <div className="row" style={{ padding:'10px 14px', background:'var(--surface-2)', borderRadius:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>Schul-Abonnement</div>
                  <div className="t-tiny">10 Inserate/Monat inklusive · CHF 75/Mt</div>
                </div>
                <Pill variant="success">Aktiv</Pill>
              </div>
              <div className="row" style={{ padding:'10px 14px', border:'1px solid var(--border)', borderRadius:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>Zusatz-Paket kaufen</div>
                  <div className="t-tiny">+5 Inserate · CHF 30.00 einmalig</div>
                </div>
                <Button variant="primary" size="sm" icon="plus" onClick={() => { setInserateUsed(n => Math.max(0, n - 5)); showToast('+5 Inserate hinzugefügt. CHF 30.00 wird verrechnet.'); }}>Kaufen</Button>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="h-3" style={{ marginBottom: 16 }}>Kostenaufschlüsselung Mai 2026</div>
            <div className="col" style={{ gap: 0 }}>
              {[
                { label:'Schul-Abonnement', amount: 75,  desc:'CHF 75/Monat · automatisch verlängert' },
                { label:'Inserate-Pakete',   amount: 0,   desc:'Keine Zusatz-Pakete diesen Monat' },
                { label:'Vermittlungsgebühren', amount: 460, desc:'12.5 % von CHF 3 680 Lohnsumme (5 Einsätze)' },
              ].map(item => (
                <div key={item.label} className="spread" style={{ padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{item.label}</div>
                    <div className="t-tiny">{item.desc}</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700 }}>CHF {item.amount.toFixed(2)}</div>
                </div>
              ))}
              <div className="spread" style={{ padding:'14px 0', fontWeight:700 }}>
                <span style={{ fontSize:14 }}>Total Mai 2026</span>
                <span style={{ fontSize:16 }}>CHF {totalThisMonth.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="spread" style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
            <div className="h-3">Transaktionen</div>
            <Button variant="ghost" size="sm" icon="download" onClick={() => showToast('Export wird vorbereitet…')}>CSV exportieren</Button>
          </div>
          <table className="tbl">
            <thead><tr><th>Datum</th><th>Typ</th><th>Beschreibung</th><th>Betrag</th><th>Status</th></tr></thead>
            <tbody>
              {TRANSACTIONS.map((tx, i) => (
                <tr key={i}>
                  <td className="t-mono">{formatDate(tx.date)}</td>
                  <td><Pill variant={typeColor[tx.type]}>{tx.type}</Pill></td>
                  <td style={{ fontSize:13 }}>{tx.desc}</td>
                  <td className="t-mono" style={{ fontWeight:600 }}>CHF {tx.amount.toFixed(2)}</td>
                  <td><Pill variant={tx.status==='bezahlt'?'success':'warn'}>{tx.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SchoolShell>
  );
}

Object.assign(window, { SchoolHome, SchoolShell, NewRequest, RequestDetail, SchoolRequests, SchoolBookings, SchoolHandover, SchoolFinances, KPI, Stars, MiniCalendar, RequestRow, MatchRow, TLItem });
