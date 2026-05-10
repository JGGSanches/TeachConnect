/* global React, ReactDOM, StoreProvider, useStore */
const { useEffect } = React;

/* =============== ROUTER =============== */
function Router() {
  const { route, user, navigate } = useStore();

  // route guard - if no user and route requires auth, send to login
  useEffect(() => {
    const protectedPrefix = ['/school', '/teacher', '/leadership', '/admin'];
    const needsAuth = protectedPrefix.some(p => route.startsWith(p));
    if (needsAuth && !user) navigate('/login');
  }, [route, user]);

  // public routes
  if (route === '/' || route === '/landing') return <Landing/>;
  if (route === '/about') return <AboutPage/>;
  if (route === '/for-schools') return <ForSchools/>;
  if (route === '/for-teachers') return <ForTeachers/>;
  if (route === '/pricing') return <PricingPage/>;
  if (route === '/login') return <LoginPage/>;
  if (route === '/signup' || route === '/register') return <RegisterPage/>;

  // school
  if (route === '/school') return <SchoolHome/>;
  if (route === '/school/requests') return <SchoolRequests/>;
  if (route === '/school/new-request') return <NewRequest/>;
  if (route.startsWith('/school/request/')) return <RequestDetail id={route.split('/')[3]}/>;
  if (route === '/school/bookings') return <SchoolRequests/>;
  if (route === '/school/handover') return <SchoolRequests/>;
  if (route === '/school/teachers') return <SchoolPool/>;
  if (route === '/school/profile') return <SchoolProfile/>;

  // teacher
  if (route === '/teacher') return <TeacherHome/>;
  if (route === '/teacher/inbox') return <TeacherHome/>;
  if (route === '/teacher/jobs') return <TeacherJobs/>;
  if (route.startsWith('/teacher/job/')) return <TeacherJobDetail id={route.split('/')[3]}/>;
  if (route === '/teacher/calendar') return <TeacherCalendar/>;
  if (route === '/teacher/profile') return <TeacherProfile/>;
  if (route === '/teacher/history') return <TeacherJobs history/>;

  // leadership
  if (route === '/leadership') return <LeadershipHome/>;
  if (route.startsWith('/leadership')) return <LeadershipHome/>;

  // admin
  if (route === '/admin') return <AdminHome/>;
  if (route.startsWith('/admin')) return <AdminHome/>;

  return <Landing/>;
}

/* =============== TEACHER JOBS LIST =============== */
function TeacherJobs({ history }) {
  const { requests, teachers, schools, navigate, user } = useStore();
  const me = teachers.find(t => t.id === (user?.teacherId || 't1'));
  const list = requests.filter(r => r.confirmedId === me.id && (history ? r.status === 'completed' : r.status !== 'completed'));
  return (
    <TeacherShell active={history ? '/teacher/history' : '/teacher/jobs'}>
      <AppTopbar title={history ? 'Vergangene Einsätze' : 'Meine Einsätze'} sub={`${list.length} Einsätze`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">{history ? 'Vergangene Einsätze' : 'Meine Einsätze'}</div>
            <div className="page-sub">{history ? 'Abgeschlossene Einsätze und Bewertungen' : 'Bestätigte und kommende Stellvertretungen'}</div>
          </div>
        </div>
        <div className="card">
          {list.length === 0 ? (
            <div style={{ padding: 32 }}><EmptyState icon="briefcase" title="Keine Einsätze in dieser Ansicht." description={history ? 'Sobald du einen Einsatz abgeschlossen hast, erscheint er hier.' : 'Nimm eine Anfrage in deiner Inbox an.'}/></div>
          ) : (
            <table className="tbl">
              <thead><tr><th>Datum</th><th>Fach / Stufe</th><th>Schule</th><th>Lektionen</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {list.map(r => {
                  const sch = schools.find(s => s.id === r.schoolId);
                  return (
                    <tr key={r.id} onClick={() => navigate('/teacher/job/' + r.id)}>
                      <td>{formatDate(r.date)} · <span className="t-muted">{r.start}</span></td>
                      <td><b>{r.subject}</b> · <span className="t-muted">{r.grade}</span></td>
                      <td><div className="row" style={{ gap: 8 }}><Avatar name={sch.name} size={24} k={sch.logo}/>{sch.name}</div></td>
                      <td className="t-mono">{r.lessons}</td>
                      <td><StatusPill status={r.status}/></td>
                      <td><Icon name="chevron-right" size={16} style={{ color: 'var(--ink-4)' }}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </TeacherShell>
  );
}

/* =============== SCHOOL POOL & PROFILE (compact) =============== */
function SchoolPool() {
  const { teachers, navigate } = useStore();
  return (
    <SchoolShell active="/school/teachers">
      <AppTopbar title="Lehrpersonen-Pool" sub={`${teachers.length} verifizierte Lehrpersonen`}/>
      <div className="page fade-in">
        <div className="page-header">
          <div>
            <div className="page-title">Lehrpersonen-Pool</div>
            <div className="page-sub">Verfügbare Stellvertretungen in deiner Region</div>
          </div>
          <div className="row">
            <Button variant="outline" icon="filter">Filter</Button>
            <Button variant="primary" icon="plus" onClick={() => navigate('/school/new-request')}>Neue Anfrage</Button>
          </div>
        </div>

        <div className="grid-3">
          {teachers.map(t => (
            <div key={t.id} className="card" style={{ padding: 20 }}>
              <div className="row" style={{ marginBottom: 14 }}>
                <Avatar name={t.name} size={48} k={t.avatarKey}/>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 6 }}>
                    <b style={{ fontSize: 14 }}>{t.name}</b>
                    <Pill variant="success"><Icon name="shield-check" size={11}/>Verifiziert</Pill>
                  </div>
                  <div className="t-tiny">{t.qual} · {t.exp} J. Erfahrung</div>
                </div>
              </div>
              <div className="row" style={{ gap: 14, marginBottom: 12 }}>
                <div><Stars n={Math.round(t.rating)}/></div>
                <span className="t-tiny">{t.rating} · {t.jobs} Einsätze</span>
              </div>
              <div className="t-eyebrow" style={{ marginBottom: 6 }}>Fächer</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                {t.subjects.slice(0,4).map(s => <span key={s} className="pill" style={{ fontSize: 11 }}>{s}</span>)}
              </div>
              <div className="spread">
                <span className="t-tiny"><Icon name="map-pin" size={11} style={{ verticalAlign: 'middle' }}/> {t.region} · {t.km} km</span>
                <span className="t-tiny" style={{ color: t.av === 'today' ? 'var(--success)' : 'var(--ink-3)' }}>
                  {t.av === 'today' ? '● Heute frei' : t.av === 'tomorrow' ? '○ Morgen frei' : 'Diese Woche'}
                </span>
              </div>
              <div className="row" style={{ marginTop: 14, gap: 6 }}>
                <Button variant="outline" size="sm" style={{ flex: 1, justifyContent: 'center' }} icon="eye">Profil</Button>
                <Button variant="primary" size="sm" style={{ flex: 1, justifyContent: 'center' }} icon="send">Einladen</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SchoolShell>
  );
}

function SchoolProfile() {
  const { schools, user, showToast } = useStore();
  const sch = schools.find(s => s.id === user.schoolId);
  return (
    <SchoolShell active="/school/profile">
      <AppTopbar title="Schulprofil" sub="Wie deine Schule auf TeachConnect erscheint"/>
      <div className="page fade-in" style={{ maxWidth: 920 }}>
        <div className="card" style={{ padding: 28 }}>
          <div className="row" style={{ gap: 20 }}>
            <Avatar name={sch.name} size={88} k={sch.logo}/>
            <div style={{ flex: 1 }}>
              <div className="h-2">{sch.name}</div>
              <div className="t-muted" style={{ marginTop: 4 }}>{sch.address} · {sch.size} Schüler:innen</div>
              <div className="row" style={{ marginTop: 12, gap: 8 }}>
                <Pill variant="success"><Icon name="shield-check" size={11}/>Verifiziert</Pill>
                <Pill variant="primary">Schul-Abonnement · CHF 75/Mt</Pill>
              </div>
            </div>
            <Button variant="outline" icon="edit">Bearbeiten</Button>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 16, gap: 16, alignItems: 'flex-start' }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Stammdaten</div>
            <div className="col" style={{ gap: 12 }}>
              <Field label="Name" value={sch.name}/>
              <Field label="Adresse" value={sch.address}/>
              <Field label="Ansprechperson" value={sch.contact}/>
              <Field label="Region" value={sch.region}/>
              <Field label="Schüler:innen" value={String(sch.size)}/>
            </div>
            <Button variant="primary" size="sm" style={{ marginTop: 14 }} onClick={() => showToast('Stammdaten gespeichert.')}>Speichern</Button>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="h-3" style={{ fontSize: 14, marginBottom: 14 }}>Standard-Übergabe</div>
            <p className="t-muted" style={{ fontSize: 13, marginBottom: 14 }}>Diese Materialien werden bei jeder Anfrage automatisch hinterlegt.</p>
            <div className="col" style={{ gap: 8 }}>
              {[
                { i: 'shield', l: 'Hausordnung', d: 'PDF · 2 Seiten' },
                { i: 'users', l: 'Notfallkontakte', d: 'Liste · 4 Einträge' },
                { i: 'map-pin', l: 'Schulhaus-Plan', d: 'PDF · 3 Seiten' },
              ].map(x => (
                <div key={x.l} className="row" style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 10 }}>
                  <Icon name={x.i} size={16} style={{ color: 'var(--ink-3)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{x.l}</div>
                    <div className="t-tiny">{x.d}</div>
                  </div>
                  <Pill variant="success"><Icon name="check" size={10}/>Aktiv</Pill>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" icon="upload" style={{ marginTop: 12 }}>Material hinzufügen</Button>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="t-tiny" style={{ marginBottom: 4 }}>{label}</div>
      <input className="input" defaultValue={value}/>
    </div>
  );
}

/* =============== MOUNT =============== */
function App() {
  return (
    <StoreProvider>
      <Router/>
    </StoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
