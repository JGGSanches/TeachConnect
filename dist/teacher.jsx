/* =============== TEACHER DASHBOARD =============== */
function TeacherShell({ children, active }) {
  const { requests, user, teachers } = useStore();
  const me = teachers.find(t => t.id === (user?.teacherId || 't1'));
  const inboxCount = requests.filter(r => r.suggestedIds?.includes(me?.id) && r.status !== 'completed' && r.status !== 'confirmed').length;
  const items = [
    { route: '/teacher', icon: 'home', label: 'Übersicht' },
    { route: '/teacher/inbox', icon: 'inbox', label: 'Posteingang', badge: inboxCount || null },
    { route: '/teacher/browse', icon: 'search', label: 'Stellen suchen' },
    { route: '/teacher/jobs', icon: 'briefcase', label: 'Meine Einsätze' },
    { route: '/teacher/calendar', icon: 'calendar', label: 'Verfügbarkeit' },
    { route: '/teacher/profile', icon: 'user', label: 'Profil' },
    { route: '/teacher/history', icon: 'history', label: 'Vergangene' },
  ];
  return <div className="app-with-sidebar"><Sidebar items={items} active={active}/><div className="main">{children}</div></div>;
}

function TeacherHome() {
  const { teachers, requests, navigate, user, schools, setRequests, showToast } = useStore();
  const me = teachers.find(t => t.id === (user.teacherId || 't1'));
  const inbox = requests.filter(r => r.suggestedIds?.includes(me.id) && r.status !== 'completed' && r.status !== 'confirmed');
  const accepted = requests.filter(r => r.confirmedId === me.id && r.status !== 'completed');
  const past = requests.filter(r => r.confirmedId === me.id && r.status === 'completed');

  const accept = (rid) => {
    setRequests(requests.map(r => r.id === rid ? { ...r, status: 'confirmed', confirmedId: me.id } : r));
    showToast('Einsatz angenommen. Übergabe ist bereit.');
  };
  const decline = (rid) => {
    setRequests(requests.map(r => r.id === rid ? { ...r, suggestedIds: r.suggestedIds.filter(x => x !== me.id) } : r));
    showToast('Anfrage abgelehnt.');
  };

  return (
    <TeacherShell active="/teacher">
      <AppTopbar title={me.name} sub={`${me.region} · ${me.subjects.slice(0,2).join(', ')}…`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Hallo, {me.name.split(' ')[0]}.</div>
            <div className="page-sub">{inbox.length} neue Anfragen passen zu deinem Profil</div>
          </div>
          <Button variant="outline" icon="calendar" onClick={() => navigate('/teacher/calendar')}>Verfügbarkeit pflegen</Button>
        </div>

        <div className="grid-4" style={{ marginBottom: 24 }}>
          <KPI num={inbox.length} label="Neue Anfragen" trend="≥85% Match" icon="inbox" tone="primary"/>
          <KPI num={accepted.length} label="Bestätigte Einsätze" icon="briefcase" tone="success"/>
          <KPI num={past.length + 24} label="Einsätze 2026" icon="check-circle" tone="accent"/>
          <KPI num={`${me.rating} ★`} label={`${me.jobs} Bewertungen`} icon="star" tone="warn"/>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'flex-start', gap: 24 }}>
          <div className="card">
            <div className="spread" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <div className="h-3">Eingehende Anfragen</div>
              <Pill variant="primary"><Icon name="zap" size={11}/>Push aktiv</Pill>
            </div>
            {inbox.length === 0 ? (
              <div style={{ padding: 24 }}><EmptyState icon="inbox" title="Aktuell keine offenen Anfragen." description="Du erhältst eine Push, sobald eine Schule mit ≥80% Match dich findet." /></div>
            ) : inbox.map(r => {
              const sch = schools.find(s => s.id === r.schoolId);
              return (
                <div key={r.id} className="list-row" style={{ padding: 18 }}>
                  <Avatar name={sch.name} size={44} k={sch.logo}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                      <b style={{ fontSize: 14 }}>{r.subject}</b>
                      <span className="t-muted" style={{ fontSize: 13 }}>· {r.grade}</span>
                      <UrgencyPill u={r.urgency}/>
                    </div>
                    <div className="t-tiny">
                      {sch.name} · <Icon name="map-pin" size={11} style={{ verticalAlign: 'middle' }}/> {sch.region} · {formatDate(r.date)} · {r.start}–{r.end} · {r.lessons} Lektionen
                    </div>
                    {r.note && <div className="t-muted" style={{ fontSize: 12, marginTop: 6, fontStyle: 'italic' }}>„{r.note}"</div>}
                  </div>
                  <div className="col" style={{ alignItems: 'flex-end', gap: 8 }}>
                    <span className="match-score">94% Match</span>
                    <div className="row" style={{ gap: 6 }}>
                      <Button variant="ghost" size="sm" onClick={() => decline(r.id)}>Ablehnen</Button>
                      <Button variant="outline" size="sm" icon="eye" onClick={() => navigate('/teacher/job/' + r.id)}>Details</Button>
                      <Button variant="primary" size="sm" iconRight="check" onClick={() => accept(r.id)}>Annehmen</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="spread">
                <div className="h-3" style={{ fontSize: 14 }}>Nächster Einsatz</div>
                <a className="t-tiny" style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/teacher/jobs')}>Alle</a>
              </div>
              {accepted[0] ? (
                <NextJob r={accepted[0]}/>
              ) : (
                <div className="empty" style={{ padding: 24, marginTop: 12 }}>
                  <div className="t-muted" style={{ fontSize: 13 }}>Noch kein bestätigter Einsatz.</div>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Diese Woche verfügbar</div>
              <MiniCalendar requests={[]}/>
              <Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={() => navigate('/teacher/calendar')}>Verfügbarkeit anpassen</Button>
            </div>

            <div className="card" style={{ padding: 18, background: 'linear-gradient(135deg, var(--accent-50), var(--primary-50))', border: '1px solid var(--accent-100)' }}>
              <Icon name="trending-up" size={18} style={{ color: 'var(--accent)' }}/>
              <div className="h-3" style={{ fontSize: 14, marginTop: 8 }}>Du bist im Top 5% deiner Region</div>
              <p className="t-muted" style={{ marginTop: 4, fontSize: 12 }}>Mit ★ {me.rating} und {me.jobs} Einsätzen hast du eine 3.4× höhere Match-Wahrscheinlichkeit.</p>
            </div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}

function NextJob({ r }) {
  const { schools, navigate } = useStore();
  const sch = schools.find(s => s.id === r.schoolId);
  return (
    <div style={{ marginTop: 12 }}>
      <div className="row" style={{ gap: 12 }}>
        <div style={{ width: 60, height: 60, borderRadius: 12, background: 'var(--primary-50)', color: 'var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div className="t-tiny" style={{ color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{new Date(r.date).toLocaleDateString('de-CH', { month: 'short' })}</div>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{new Date(r.date).getDate()}</div>
        </div>
        <div style={{ flex: 1 }}>
          <b>{r.subject}</b>
          <div className="t-tiny">{r.grade} · {r.start}–{r.end}</div>
          <div className="t-muted" style={{ fontSize: 12, marginTop: 4 }}>{sch.name} · {sch.region}</div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 14, gap: 8 }}>
        <Button variant="primary" size="sm" iconRight="arrow-right" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/teacher/job/' + r.id)}>Übergabe ansehen</Button>
        <Button variant="outline" size="sm" icon="map-pin">Route</Button>
      </div>
    </div>
  );
}

/* =============== TEACHER JOB DETAIL (handover view) =============== */
function TeacherJobDetail({ id }) {
  const { requests, schools, navigate, teachers, user } = useStore();
  const r = requests.find(x => x.id === id);
  if (!r) return <TeacherShell active="/teacher/jobs"><AppTopbar title="Nicht gefunden"/><div className="page">Einsatz nicht gefunden.</div></TeacherShell>;
  const sch = schools.find(s => s.id === r.schoolId);
  return (
    <TeacherShell active="/teacher/jobs">
      <AppTopbar title={`${r.subject} · ${r.grade}`} sub={`${formatDate(r.date)} · ${sch.name}`} search={false}/>
      <div className="page fade-in">
        <div className="row" style={{ marginBottom: 16 }}>
          <Button variant="ghost" size="sm" icon="arrow-left" onClick={() => navigate('/teacher/jobs')}>Zurück</Button>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'flex-start' }}>
          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, var(--primary), oklch(38% 0.18 240))', color: 'white', border: 'none' }}>
              <div className="row" style={{ gap: 8 }}>
                <Pill style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'transparent' }}>Bestätigt</Pill>
                <span style={{ fontSize: 12, opacity: 0.85 }}>Einsatz-ID #{r.id.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, marginTop: 12, letterSpacing: '-0.02em' }}>{r.subject} · {r.grade}</div>
              <div style={{ marginTop: 6, fontSize: 15, opacity: 0.9 }}>
                {formatDate(r.date)} · {r.start}–{r.end} · {r.lessons} Lektionen
              </div>
              <div className="grid-3" style={{ marginTop: 24, gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.7 }}>Schule</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{sch.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.7 }}>Adresse</div>
                  <div style={{ fontWeight: 600, marginTop: 4, fontSize: 13 }}>{sch.address}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.7 }}>Raum</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>204 · 2. OG</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div className="h-3" style={{ marginBottom: 14 }}>Lektionsplan</div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 16 }}>
                <div className="row" style={{ marginBottom: 12 }}>
                  <Icon name="file" size={18} style={{ color: 'var(--ink-3)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>lektionsplan-mathe-7a.pdf</div>
                    <div className="t-tiny">3 Seiten · zuletzt aktualisiert vor 2 h</div>
                  </div>
                  <Button variant="outline" size="sm" icon="eye">Öffnen</Button>
                </div>
                <div className="placeholder" style={{ height: 180, marginTop: 8 }}>Lektionsplan-Vorschau (PDF-Inline)</div>
              </div>

              <div className="h-3" style={{ marginTop: 24, marginBottom: 12, fontSize: 14 }}>Stunden-Ablauf</div>
              <div className="tl">
                <TLItem dot="primary" t="08:00 – Begrüssung & Hausaufgaben einsammeln" sub="Klassenliste am Pult"/>
                <TLItem dot="primary" t="08:10 – Repetition Bruchrechnen" sub="Mathbu.ch S. 78–82"/>
                <TLItem dot="primary" t="09:00 – Pause"/>
                <TLItem dot="primary" t="09:20 – Übungen Kapitel 6" sub="Mathbu.ch S. 84, Aufgaben 1–6"/>
                <TLItem dot="muted" t="10:30 – Hausaufgaben definieren" sub="Aufgaben 7–9 für Mo"/>
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div className="h-3" style={{ marginBottom: 14 }}>Klasseninfos</div>
              <div className="grid-2" style={{ gap: 12 }}>
                <InfoBlock label="Klasse" value="7a · 22 Schüler:innen"/>
                <InfoBlock label="Klassenlehrperson" value="Frau Müller"/>
                <InfoBlock label="Stundenplan-Slot" value="Mathematik Lekt. 1–4"/>
                <InfoBlock label="Spezielle Hinweise" value="Tim sitzt vorne (Sehbeeintr.). Lara hat Heuschnupfen-Attest. Mara wird um 11:00 abgeholt." span={2}/>
              </div>
            </div>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Ansprechperson</div>
              <div className="row">
                <Avatar name={sch.contact} size={44} k={1}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{sch.contact}</div>
                  <div className="t-tiny">Schulleitung</div>
                </div>
              </div>
              <div className="col" style={{ gap: 6, marginTop: 14 }}>
                <Button variant="outline" size="sm" icon="message" style={{ justifyContent: 'flex-start' }}>Nachricht schreiben</Button>
                <Button variant="ghost" size="sm" icon="phone" style={{ justifyContent: 'flex-start' }}>+41 81 4xx xx xx</Button>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Anreise</div>
              <div className="placeholder" style={{ height: 140, fontSize: 11 }}>Karte · {sch.address}</div>
              <div className="grid-2" style={{ marginTop: 12, gap: 8 }}>
                <div><div className="t-tiny">Auto</div><div style={{ fontWeight: 600 }}>18 min</div></div>
                <div><div className="t-tiny">ÖV</div><div style={{ fontWeight: 600 }}>32 min</div></div>
              </div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 12 }}>Vergütung</div>
              <div className="spread" style={{ marginTop: 4 }}><span className="t-muted">{r.lessons} Lektionen × CHF 92</span><b className="t-mono">CHF 368.00</b></div>
              <div className="spread" style={{ marginTop: 4 }}><span className="t-muted">Reisepauschale</span><b className="t-mono">CHF 18.00</b></div>
              <div className="divider" style={{ margin: '10px 0' }}/>
              <div className="spread"><b>Total brutto</b><b className="t-mono" style={{ fontSize: 16 }}>CHF 386.00</b></div>
              <div className="t-tiny" style={{ marginTop: 8 }}>Auszahlung 5 Tage nach Einsatz · QR-Rechnung an Schule</div>
            </div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}

function InfoBlock({ label, value, span }) {
  return (
    <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 10, gridColumn: span ? `span ${span}` : 'auto' }}>
      <div className="t-tiny">{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{value}</div>
    </div>
  );
}

/* =============== TEACHER PROFILE / AVAILABILITY =============== */
function TeacherProfile() {
  const { teachers, user, subjects, grades, showToast } = useStore();
  const me = teachers.find(t => t.id === (user.teacherId || 't1'));
  const [bio, setBio] = useState('Sek-I-Lehrerin mit Schwerpunkt Sprachen. 6 Jahre Erfahrung, hauptsächlich in der Region Chur. Begeisterte Bergläuferin in der Freizeit.');
  return (
    <TeacherShell active="/teacher/profile">
      <AppTopbar title="Profil" sub="So sehen dich die Schulen"/>
      <div className="page fade-in" style={{ maxWidth: 920 }}>
        <div className="card" style={{ padding: 28 }}>
          <div className="row" style={{ gap: 20 }}>
            <Avatar name={me.name} size={88} k={me.avatarKey}/>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                <div className="h-2">{me.name}</div>
                <Pill variant="success"><Icon name="shield-check" size={11}/>Verifiziert</Pill>
              </div>
              <div className="t-muted">{me.qual} · {me.exp} Jahre Erfahrung · {me.region}</div>
              <div className="row" style={{ gap: 16, marginTop: 10 }}>
                <div className="row" style={{ gap: 4 }}><Stars n={Math.round(me.rating)}/><b style={{ fontSize: 13 }}>{me.rating}</b><span className="t-tiny">({me.jobs} Bewertungen)</span></div>
                <span className="t-tiny">·</span>
                <div className="row" style={{ gap: 6 }}><Icon name="briefcase" size={13}/><span className="t-tiny">{me.jobs} Einsätze</span></div>
              </div>
            </div>
            <Button variant="outline" icon="edit">Profil bearbeiten</Button>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 16, gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'flex-start' }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="h-3" style={{ fontSize: 14, marginBottom: 12 }}>Über mich</div>
            <textarea className="textarea" value={bio} onChange={e => setBio(e.target.value)} rows={5}/>
            <Button variant="primary" size="sm" style={{ marginTop: 12 }} onClick={() => showToast('Profil aktualisiert.')}>Speichern</Button>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="h-3" style={{ fontSize: 14, marginBottom: 12 }}>Qualifikationen</div>
            <div className="col" style={{ gap: 10 }}>
              <div className="row" style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 10 }}>
                <Icon name="graduation" size={16} style={{ color: 'var(--primary)' }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Lehrdiplom Sek I</div>
                  <div className="t-tiny">{me.qual} · 2019</div>
                </div>
                <Pill variant="success"><Icon name="check" size={10}/>Verifiziert</Pill>
              </div>
              <div className="row" style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 10 }}>
                <Icon name="shield" size={16} style={{ color: 'var(--success)' }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Strafregisterauszug</div>
                  <div className="t-tiny">Gültig bis 03/2027</div>
                </div>
                <Pill variant="success"><Icon name="check" size={10}/>Aktuell</Pill>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="h-3" style={{ fontSize: 14, marginBottom: 12 }}>Fächer</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {subjects.map(s => (
                <span key={s} className="pill" style={{ background: me.subjects.includes(s) ? 'var(--primary)' : '', color: me.subjects.includes(s) ? 'white' : '', borderColor: me.subjects.includes(s) ? 'var(--primary)' : '', cursor: 'pointer' }}>{s}</span>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="h-3" style={{ fontSize: 14, marginBottom: 12 }}>Schulstufen</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {grades.map(g => (
                <span key={g} className="pill" style={{ background: me.grades.includes(g) ? 'var(--primary)' : '', color: me.grades.includes(g) ? 'white' : '', borderColor: me.grades.includes(g) ? 'var(--primary)' : '', cursor: 'pointer' }}>{g}</span>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24, gridColumn: 'span 2' }}>
            <div className="h-3" style={{ fontSize: 14, marginBottom: 12 }}>Letzte Bewertungen</div>
            <div className="col">
              {[
                { sch: 'Schule Davos Platz', d: '24. Apr 2026', n: 5, c: '„Sehr gut vorbereitet, Klasse hat sie sofort akzeptiert. Würden wieder buchen."' },
                { sch: 'Sek Klosters', d: '12. Apr 2026', n: 5, c: '„Lara hat den Lektionsplan exakt umgesetzt. Hausaufgaben klar definiert."' },
                { sch: 'Primarschule Chur West', d: '04. Apr 2026', n: 5, c: '„Sehr empathisch mit einer schwierigen Klasse umgegangen."' },
              ].map((x, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div className="row" style={{ gap: 10, marginBottom: 6 }}>
                    <Stars n={x.n}/>
                    <b style={{ fontSize: 13 }}>{x.sch}</b>
                    <span className="t-tiny">· {x.d}</span>
                  </div>
                  <p className="t-muted" style={{ fontSize: 13, fontStyle: 'italic' }}>{x.c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}

function TeacherCalendar() {
  const { showToast } = useStore();
  const [days, setDays] = useState(() => {
    const o = {};
    for (let d = 1; d <= 31; d++) o[d] = d % 5 === 0 || d % 7 === 0 ? 'busy' : (d % 3 === 0 ? 'free' : 'open');
    return o;
  });
  const cycle = (d) => setDays(s => ({ ...s, [d]: s[d] === 'free' ? 'busy' : s[d] === 'busy' ? 'open' : 'free' }));

  return (
    <TeacherShell active="/teacher/calendar">
      <AppTopbar title="Verfügbarkeit" sub="Klick auf einen Tag, um den Status zu ändern"/>
      <div className="page fade-in" style={{ maxWidth: 980 }}>
        <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'flex-start' }}>
          <div className="card" style={{ padding: 28 }}>
            <div className="spread" style={{ marginBottom: 18 }}>
              <div>
                <div className="h-2">Mai 2026</div>
                <div className="t-muted" style={{ fontSize: 13, marginTop: 2 }}>16 Tage frei · 8 Tage blockiert</div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <Button variant="outline" size="sm" icon="arrow-left"/>
                <Button variant="outline" size="sm" iconRight="arrow-right"/>
              </div>
            </div>

            <div className="cal" style={{ marginBottom: 8 }}>
              {['Mo','Di','Mi','Do','Fr','Sa','So'].map(d => <div key={d} className="t-tiny" style={{ textAlign: 'center', fontWeight: 600 }}>{d}</div>)}
            </div>
            <div className="cal" style={{ gap: 6 }}>
              {Array.from({ length: 4 }).map((_, i) => <div key={'pad' + i} className="cal-day muted">{27 + i}</div>)}
              {Array.from({ length: 31 }).map((_, i) => {
                const d = i + 1;
                const st = days[d];
                const cls = st === 'free' ? 'has' : st === 'busy' ? 'busy' : '';
                return (
                  <div key={d} className={`cal-day ${cls} ${d === 8 ? 'today' : ''}`} onClick={() => cycle(d)} style={{ aspectRatio: '1', minHeight: 56 }}>
                    <div style={{ fontWeight: 600 }}>{d}</div>
                  </div>
                );
              })}
            </div>

            <div className="row" style={{ marginTop: 20, gap: 16, fontSize: 12, color: 'var(--ink-3)' }}>
              <div className="row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}/>Frei für Einsätze</div>
              <div className="row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: 'var(--warning-50)', border: '1px solid oklch(85% 0.07 75)' }}/>Blockiert</div>
              <div className="row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: 'var(--surface-2)', border: '1px solid var(--border)' }}/>Standard</div>
            </div>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Wiederkehrend</div>
              {[
                { l: 'Montag', v: 'Frei (ganzer Tag)' },
                { l: 'Dienstag', v: 'Frei (Vormittag)' },
                { l: 'Mittwoch', v: 'Blockiert' },
                { l: 'Donnerstag', v: 'Frei (ganzer Tag)' },
                { l: 'Freitag', v: 'Frei (ganzer Tag)' },
              ].map(x => (
                <div key={x.l} className="spread" style={{ padding: '8px 0', fontSize: 13 }}>
                  <span>{x.l}</span><span className="t-muted">{x.v}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" icon="edit" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>Wochenmuster bearbeiten</Button>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div className="h-3" style={{ fontSize: 14, marginBottom: 8 }}>Reichweite</div>
              <div className="t-muted" style={{ fontSize: 13 }}>Maximale Anreise</div>
              <div className="row" style={{ gap: 12, marginTop: 8 }}>
                <input type="range" min="5" max="100" defaultValue="30" style={{ flex: 1 }}/>
                <span className="t-mono" style={{ fontWeight: 600 }}>30 km</span>
              </div>
              <Button variant="ghost" size="sm" style={{ marginTop: 8 }} onClick={() => showToast('Einstellungen gespeichert.')}>Speichern</Button>
            </div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}

/* =============== TEACHER BROWSE =============== */
function TeacherBrowse() {
  const { requests, schools, teachers, user, setRequests, showToast, navigate, subjects, grades } = useStore();
  const me = teachers.find(t => t.id === (user?.teacherId || 't1'));

  const EXTRA = [
    { id: 'br1', schoolId: 's2', subject: 'Englisch', grade: 'Sek I', date: '2026-05-13', start: '10:15', end: '12:00', lessons: 2, status: 'open', urgency: 'medium', note: 'Konversation Unit 9.', applicants: 1, suggestedIds: [], confirmedId: null, handoverComplete: false, createdAt: '2026-05-10T08:00:00' },
    { id: 'br2', schoolId: 's3', subject: 'Mathematik', grade: 'Sek I', date: '2026-05-14', start: '08:00', end: '11:30', lessons: 4, status: 'open', urgency: 'high', note: 'Bruchrechnen, Klasse 8a.', applicants: 2, suggestedIds: [], confirmedId: null, handoverComplete: false, createdAt: '2026-05-10T09:00:00' },
    { id: 'br3', schoolId: 's1', subject: 'Geschichte', grade: 'Sek II', date: '2026-05-15', start: '08:00', end: '09:35', lessons: 2, status: 'open', urgency: 'low', note: 'Weltkrieg 2, Kapitel 8.', applicants: 0, suggestedIds: [], confirmedId: null, handoverComplete: false, createdAt: '2026-05-09T14:00:00' },
    { id: 'br4', schoolId: 's2', subject: 'Deutsch', grade: '5./6. Primar', date: '2026-05-19', start: '10:00', end: '11:30', lessons: 2, status: 'open', urgency: 'low', note: 'Aufsatz-Einheit.', applicants: 0, suggestedIds: [], confirmedId: null, handoverComplete: false, createdAt: '2026-05-09T15:00:00' },
    { id: 'br5', schoolId: 's3', subject: 'Biologie', grade: 'Sek I', date: '2026-05-20', start: '10:00', end: '12:45', lessons: 3, status: 'open', urgency: 'medium', note: 'Zellbiologie, Mikroskope vorbereitet.', applicants: 1, suggestedIds: [], confirmedId: null, handoverComplete: false, createdAt: '2026-05-10T07:30:00' },
    { id: 'br6', schoolId: 's1', subject: 'Sport', grade: 'Sek II', date: '2026-05-21', start: '13:30', end: '15:15', lessons: 2, status: 'open', urgency: 'low', note: 'Volleyball Halle.', applicants: 0, suggestedIds: [], confirmedId: null, handoverComplete: false, createdAt: '2026-05-10T10:00:00' },
  ];

  const [subjectF, setSubjectF] = useState('');
  const [gradeF, setGradeF] = useState('');
  const [regionF, setRegionF] = useState('');
  const [sort, setSort] = useState('match');
  const [declined, setDeclined] = useState([]);

  const allOpen = [...requests, ...EXTRA].filter(r =>
    (r.status === 'open' || r.status === 'matched') &&
    r.confirmedId === null &&
    !declined.includes(r.id)
  );

  const scored = allOpen.map(r => {
    let score = 50;
    if (me?.subjects.includes(r.subject)) score += 30;
    if (me?.grades.includes(r.grade)) score += 15;
    const sch = schools.find(s => s.id === r.schoolId);
    if (sch?.region === me?.region) score += 8;
    if (r.urgency === 'high') score += 4;
    return { ...r, score: Math.min(99, Math.round(score)) };
  });

  const filtered = scored.filter(r => {
    const sch = schools.find(s => s.id === r.schoolId);
    return (!subjectF || r.subject === subjectF) &&
           (!gradeF || r.grade === gradeF) &&
           (!regionF || sch?.region === regionF);
  }).sort((a, b) => sort === 'match' ? b.score - a.score : sort === 'date' ? a.date.localeCompare(b.date) : 0);

  const regions = [...new Set(schools.map(s => s.region))];

  const accept = (r) => {
    setRequests(requests.map(x => x.id === r.id ? { ...x, status: 'confirmed', confirmedId: me.id } : x));
    showToast(`${r.subject} angenommen. Übergabe wird vorbereitet.`);
  };
  const decline = (id) => { setDeclined(d => [...d, id]); showToast('Anfrage übersprungen.'); };

  return (
    <TeacherShell active="/teacher/browse">
      <AppTopbar title="Stellen suchen" sub={`${filtered.length} offene Stellvertretungen in deiner Region`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Stellen suchen</div>
            <div className="page-sub">Alle offenen Stellvertretungen – nach Match-Score sortiert</div>
          </div>
        </div>

        <div className="card" style={{ padding:'12px 16px', marginBottom:20 }}>
          <div className="row" style={{ gap:10, flexWrap:'wrap' }}>
            <select className="select" style={{ height:36, fontSize:13 }} value={subjectF} onChange={e => setSubjectF(e.target.value)}>
              <option value="">Alle Fächer</option>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="select" style={{ height:36, fontSize:13 }} value={gradeF} onChange={e => setGradeF(e.target.value)}>
              <option value="">Alle Stufen</option>
              {grades.map(g => <option key={g}>{g}</option>)}
            </select>
            <select className="select" style={{ height:36, fontSize:13 }} value={regionF} onChange={e => setRegionF(e.target.value)}>
              <option value="">Alle Regionen</option>
              {regions.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="select" style={{ height:36, fontSize:13 }} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="match">Sortierung: Match-Score</option>
              <option value="date">Sortierung: Datum</option>
            </select>
            {(subjectF || gradeF || regionF) && <Button variant="ghost" size="sm" icon="x" onClick={() => { setSubjectF(''); setGradeF(''); setRegionF(''); }}>Zurücksetzen</Button>}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ padding:40 }}>
            <EmptyState icon="search" title="Keine Stellen gefunden." description="Passe die Filter an oder warte auf neue Anfragen."/>
          </div>
        ) : (
          <div className="col" style={{ gap:12 }}>
            {filtered.map(r => {
              const sch = schools.find(s => s.id === r.schoolId);
              const isInbox = r.suggestedIds?.includes(me?.id);
              return (
                <div key={r.id} className="card" style={{ padding:20 }}>
                  <div className="row" style={{ gap:16, alignItems:'flex-start' }}>
                    <Avatar name={sch.name} size={48} k={sch.logo}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="row" style={{ gap:8, marginBottom:4, flexWrap:'wrap' }}>
                        <b style={{ fontSize:15 }}>{r.subject}</b>
                        <span className="t-muted">· {r.grade}</span>
                        <UrgencyPill u={r.urgency}/>
                        {isInbox && <Pill variant="primary"><Icon name="zap" size={11}/>In deiner Inbox</Pill>}
                      </div>
                      <div className="t-tiny" style={{ marginBottom:6 }}>
                        <Icon name="building" size={11} style={{ verticalAlign:'middle', marginRight:4 }}/>{sch.name} · <Icon name="map-pin" size={11} style={{ verticalAlign:'middle', margin:'0 4px 0 6px' }}/>{sch.region} · <Icon name="calendar" size={11} style={{ verticalAlign:'middle', margin:'0 4px 0 6px' }}/>{formatDate(r.date)} · <Icon name="clock" size={11} style={{ verticalAlign:'middle', margin:'0 4px 0 6px' }}/>{r.start}–{r.end} · {r.lessons} Lektionen
                      </div>
                      {r.note && <div className="t-muted" style={{ fontSize:12, fontStyle:'italic' }}>„{r.note.slice(0, 80)}{r.note.length > 80 ? '…' : ''}"</div>}
                      <div className="row" style={{ gap:16, marginTop:10 }}>
                        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                          <div className="match-bar" style={{ width:80 }}><div className="match-bar-fill" style={{ width:`${r.score}%`, background: r.score < 70 ? 'var(--danger)' : r.score < 85 ? 'oklch(72% 0.13 75)' : 'var(--success)' }}/></div>
                          <span className={`match-score ${r.score < 70 ? 'low' : r.score < 85 ? 'med' : ''}`} style={{ fontSize:12 }}>{r.score}% Match</span>
                        </div>
                        {r.applicants > 0 && <span className="t-tiny">{r.applicants} Mitbewerber:in</span>}
                      </div>
                    </div>
                    <div className="row" style={{ gap:6, flexShrink:0 }}>
                      <Button variant="ghost" size="sm" onClick={() => decline(r.id)}>Überspringen</Button>
                      <Button variant="outline" size="sm" icon="eye" onClick={() => navigate('/teacher/job/' + r.id)}>Details</Button>
                      <Button variant="primary" size="sm" iconRight="check" onClick={() => accept(r)}>Annehmen</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </TeacherShell>
  );
}

Object.assign(window, { TeacherShell, TeacherHome, TeacherJobDetail, TeacherProfile, TeacherCalendar, TeacherBrowse, NextJob, InfoBlock });
