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
  const { requests, navigate, schools, teachers, user, setModal } = useStore();
  const school = schools.find(s => s.id === user.schoolId);
  const myReqs = requests.filter(r => r.schoolId === school.id);
  const open = myReqs.filter(r => r.status === 'open' || r.status === 'matched');
  const confirmed = myReqs.filter(r => r.status === 'confirmed');
  const completed = myReqs.filter(r => r.status === 'completed');

  return (
    <SchoolShell active="/school">
      <AppTopbar title={school.name} sub={school.region}/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Guten Morgen, {user.name.split(' ')[0]}.</div>
            <div className="page-sub">Donnerstag, 8. Mai 2026 · {open.length} offene Anfragen</div>
          </div>
          <Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Neue Stellvertretung</Button>
        </div>

        <div className="grid-4" style={{ marginBottom: 24 }}>
          <KPI num={open.length} label="Offen" trend="+2 heute" icon="briefcase" tone="primary"/>
          <KPI num={confirmed.length} label="Bestätigt" trend="" icon="check-circle" tone="success"/>
          <KPI num={completed.length} label="Diese Woche" trend="100% besetzt" icon="history" tone="accent"/>
          <KPI num="4 min" label="Ø Bearbeitung" trend="↓ 91 min vs. vorher" icon="zap" tone="warn"/>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start', gridTemplateColumns: '1.4fr 1fr' }}>
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
  const { navigate, requests, setRequests, user, showToast, subjects, grades } = useStore();
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
    const newR = {
      id: 'r' + Date.now(), schoolId: user.schoolId,
      ...s, status: 'matched', applicants: 0,
      suggestedIds: matches.slice(0,5).map(m => m.id),
      confirmedId: null, handoverComplete: false,
      createdAt: new Date().toISOString(),
    };
    setRequests([newR, ...requests]);
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

        <div className="grid-2" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'flex-start' }}>
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

            <div className="row" style={{ marginTop: 28, justifyContent: 'space-between' }}>
              <Button variant="ghost" onClick={() => setMatchVisible(!matchVisible)}>{matchVisible ? 'Vorschau ausblenden' : 'Match-Vorschau'}</Button>
              <div className="row">
                <Button variant="outline" onClick={() => showToast('Als Entwurf gespeichert.')}>Als Entwurf speichern</Button>
                <Button variant="primary" iconRight="arrow-right" onClick={submit}>Veröffentlichen & matchen</Button>
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

        <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'flex-start' }}>
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

Object.assign(window, { SchoolHome, SchoolShell, NewRequest, RequestDetail, SchoolRequests, KPI, Stars, MiniCalendar, RequestRow, MatchRow, TLItem });
