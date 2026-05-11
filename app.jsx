/* global React, ReactDOM, StoreProvider, useStore */
const { useEffect } = React;

/* =============== ROUTER =============== */
function Router() {
  const { route, user, navigate } = useStore();

  // route guard - if no user and route requires auth, send to login
  useEffect(() => {
    const protectedPrefix = ['/school', '/teacher', '/leadership', '/admin', '/settings'];
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
  if (route === '/school/bookings') return <SchoolBookings/>;
  if (route === '/school/handover') return <SchoolHandover/>;
  if (route === '/school/finances') return <SchoolFinances/>;
  if (route === '/school/teachers') return <SchoolPool/>;
  if (route === '/school/profile') return <SchoolProfile/>;

  // teacher
  if (route === '/teacher') return <TeacherHome/>;
  if (route === '/teacher/inbox') return <TeacherHome/>;
  if (route === '/teacher/browse') return <TeacherBrowse/>;
  if (route === '/teacher/jobs') return <TeacherJobs/>;
  if (route.startsWith('/teacher/job/')) return <TeacherJobDetail id={route.split('/')[3]}/>;
  if (route === '/teacher/calendar') return <TeacherCalendar/>;
  if (route === '/teacher/profile') return <TeacherProfile/>;
  if (route === '/teacher/history') return <TeacherJobs history/>;

  // leadership
  if (route === '/leadership') return <LeadershipHome/>;
  if (route === '/leadership/absences') return <LeadershipAbsences/>;
  if (route === '/leadership/bookings') return <LeadershipBookings/>;
  if (route === '/leadership/team') return <LeadershipTeam/>;
  if (route === '/leadership/stats') return <LeadershipStats/>;
  if (route === '/leadership/profile') return <LeadershipProfile/>;

  // admin
  if (route === '/admin') return <AdminHome/>;
  if (route === '/admin/schools') return <AdminSchools/>;
  if (route === '/admin/teachers') return <AdminTeachers/>;
  if (route === '/admin/bookings') return <AdminBookings/>;
  if (route === '/admin/billing') return <AdminBilling/>;
  if (route.startsWith('/admin')) return <AdminHome/>;

  // settings (role-aware)
  if (route === '/settings' || route.startsWith('/settings/')) return <SettingsPage/>;

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

/* =============== SETTINGS PAGE =============== */
function SettingsPage() {
  const { user, showToast, inserateUsed, inserateLimit, setInserateUsed, navigate } = useStore();
  const [tab, setTab] = useState('profil');
  const [notifSettings, setNotifSettings] = useState({ push: true, email: true, sms: false, digest: true });
  const [twofa, setTwofa] = useState(false);

  const isTeacher = user?.role === 'teacher';
  const isSchool = user?.role === 'school';

  const tabs = [
    { v: 'profil', l: 'Profil' },
    { v: 'notif', l: 'Benachrichtigungen' },
    { v: 'abo', l: 'Abo & Zahlung' },
    { v: 'datenschutz', l: 'Datenschutz & Sicherheit' },
    ...(isTeacher ? [{ v: 'availability', l: 'Verfügbarkeit' }] : []),
  ];

  const Shell = isTeacher ? TeacherShell : isSchool ? SchoolShell : LeadershipShell;
  const shellActive = isTeacher ? '/teacher' : isSchool ? '/school' : '/leadership';

  return (
    <Shell active={shellActive}>
      <AppTopbar title="Einstellungen" sub="Konto, Benachrichtigungen, Abo" search={false}/>
      <div className="page fade-in" style={{ maxWidth: 860 }}>
        <div className="page-header">
          <div className="page-title">Einstellungen</div>
        </div>

        <div className="tabs" style={{ marginBottom: 24 }}>
          {tabs.map(t => <div key={t.v} className={`tab ${tab===t.v?'active':''}`} onClick={() => setTab(t.v)}>{t.l}</div>)}
        </div>

        {tab === 'profil' && (
          <div className="grid-2" style={{ gap: 20, alignItems: 'flex-start' }}>
            <div className="card" style={{ padding: 24 }}>
              <div className="h-3" style={{ marginBottom: 16 }}>Persönliche Angaben</div>
              <div className="col" style={{ gap: 12 }}>
                <Field label="Name" value={user?.name || ''}/>
                <Field label="E-Mail" value={user?.email || 'anna@schule-davos.ch'}/>
                <Field label="Telefon" value="+41 79 4xx xx xx"/>
                {isTeacher && <Field label="Region" value="Chur"/>}
                {isSchool && <Field label="Schule" value="Schule Davos Platz"/>}
              </div>
              <Button variant="primary" size="sm" style={{ marginTop: 16 }} onClick={() => showToast('Profil gespeichert.')}>Speichern</Button>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <div className="h-3" style={{ marginBottom: 16 }}>Passwort ändern</div>
              <div className="col" style={{ gap: 12 }}>
                <div className="field"><label className="label">Aktuelles Passwort</label><input className="input" type="password" placeholder="••••••••"/></div>
                <div className="field"><label className="label">Neues Passwort</label><input className="input" type="password" placeholder="••••••••"/></div>
                <div className="field"><label className="label">Bestätigen</label><input className="input" type="password" placeholder="••••••••"/></div>
              </div>
              <Button variant="outline" size="sm" style={{ marginTop: 16 }} onClick={() => showToast('Passwort wurde geändert.')}>Passwort ändern</Button>
            </div>
          </div>
        )}

        {tab === 'notif' && (
          <div className="card" style={{ padding: 28 }}>
            <div className="h-3" style={{ marginBottom: 20 }}>Benachrichtigungskanäle</div>
            <div className="col" style={{ gap: 16 }}>
              {[
                { k: 'push',   l: 'Push-Benachrichtigungen',   d: 'Sofortige Meldungen für neue Anfragen und Bestätigungen' },
                { k: 'email',  l: 'E-Mail-Benachrichtigungen', d: 'Tagesübersicht und wichtige Statusänderungen' },
                { k: 'sms',    l: 'SMS bei Sehr dringend',     d: 'Nur für Anfragen mit Dringlichkeit "Sehr dringend"' },
                { k: 'digest', l: 'Wöchentlicher Digest',      d: 'Zusammenfassung jeden Montag 07:00 Uhr' },
              ].map(n => (
                <div key={n.k} className="spread" style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{n.l}</div>
                    <div className="t-muted" style={{ fontSize: 12, marginTop: 3 }}>{n.d}</div>
                  </div>
                  <button
                    onClick={() => { setNotifSettings(s => ({ ...s, [n.k]: !s[n.k] })); showToast('Einstellung gespeichert.'); }}
                    style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: notifSettings[n.k] ? 'var(--primary)' : 'var(--border-strong)', position: 'relative', transition: 'background 0.2s' }}>
                    <span style={{ position: 'absolute', top: 3, left: notifSettings[n.k] ? 22 : 3, width: 18, height: 18, borderRadius: 9, background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'abo' && (
          <div className="col" style={{ gap: 20 }}>
            <div className="card" style={{ padding: 28 }}>
              <div className="spread" style={{ marginBottom: 16 }}>
                <div>
                  <div className="h-3">Aktuelles Abonnement</div>
                  <div className="t-muted" style={{ marginTop: 4, fontSize: 13 }}>{isSchool ? 'Schul-Abonnement · CHF 75/Monat' : isTeacher ? 'Lehrpersonen-Konto · Kostenlos' : 'Schulleitung-Konto'}</div>
                </div>
                <Pill variant="success">Aktiv</Pill>
              </div>
              {isSchool && (
                <div className="col" style={{ gap: 12 }}>
                  <div className="spread" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div><div style={{ fontWeight: 600 }}>Inserate-Kontingent</div><div className="t-tiny">{inserateUsed}/{inserateLimit} verwendet (Mai 2026)</div></div>
                    <div className="row" style={{ gap: 8 }}>
                      <div className="match-bar" style={{ width: 80 }}>
                        <div className="match-bar-fill" style={{ width:`${Math.round(inserateUsed/inserateLimit*100)}%`, background: inserateUsed >= inserateLimit ? 'var(--danger)' : 'var(--primary)' }}/>
                      </div>
                      <Button variant="outline" size="sm" icon="plus" onClick={() => { setInserateUsed(n => Math.max(0, n-5)); showToast('+5 Inserate hinzugefügt. CHF 30.00 wird verrechnet.'); }}>Paket kaufen</Button>
                    </div>
                  </div>
                  <div className="spread" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div><div style={{ fontWeight: 600 }}>Nächste Rechnung</div><div className="t-tiny">CHF 75.00 am 1. Juni 2026</div></div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/school/finances')}>Finanzen ansehen</Button>
                  </div>
                  <div className="spread" style={{ padding: '12px 0' }}>
                    <div><div style={{ fontWeight: 600 }}>Zahlungsmethode</div><div className="t-tiny">IBAN CH56 0483 5012 3456 7800 9</div></div>
                    <Button variant="outline" size="sm" icon="edit" onClick={() => showToast('Zahlungsmethode aktualisiert.')}>Ändern</Button>
                  </div>
                </div>
              )}
              {isTeacher && (
                <div style={{ padding: '14px 0' }}>
                  <p className="t-muted" style={{ fontSize: 13 }}>Als Lehrperson ist die Registrierung auf TeachConnect kostenlos. Vermittlungsgebühren werden direkt mit der Schule abgerechnet.</p>
                </div>
              )}
            </div>
            <div className="card" style={{ padding: 28 }}>
              <div className="h-3" style={{ marginBottom: 14 }}>Konto kündigen</div>
              <p className="t-muted" style={{ fontSize: 13, marginBottom: 14 }}>Dein Konto und alle zugehörigen Daten werden nach einer Frist von 30 Tagen unwiderruflich gelöscht.</p>
              <Button variant="ghost" size="sm" onClick={() => showToast('Kündigungsanfrage gesendet. Wir melden uns per E-Mail.', 'error')}>Konto kündigen</Button>
            </div>
          </div>
        )}

        {tab === 'datenschutz' && (
          <div className="col" style={{ gap: 20 }}>
            <div className="card" style={{ padding: 28 }}>
              <div className="h-3" style={{ marginBottom: 16 }}>Sicherheit</div>
              <div className="col" style={{ gap: 12 }}>
                <div className="spread" style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Zwei-Faktor-Authentifizierung</div>
                    <div className="t-tiny">{twofa ? 'Aktiv · TOTP-App' : 'Nicht aktiviert – empfohlen'}</div>
                  </div>
                  <Button variant={twofa ? 'ghost' : 'outline'} size="sm" onClick={() => { setTwofa(v => !v); showToast(twofa ? '2FA deaktiviert.' : '2FA aktiviert.'); }}>{twofa ? 'Deaktivieren' : 'Aktivieren'}</Button>
                </div>
                <div className="spread" style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Aktive Sitzungen</div>
                    <div className="t-tiny">3 Geräte · zuletzt Safari / Mac · vor 2 Min.</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => showToast('Alle anderen Sitzungen beendet.')}>Andere abmelden</Button>
                </div>
                <div className="spread" style={{ padding: '14px 0' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Datenschutzerklärung</div>
                    <div className="t-tiny">Zuletzt aktualisiert: Januar 2026</div>
                  </div>
                  <Button variant="ghost" size="sm" icon="eye" onClick={() => showToast('Datenschutzerklärung wird geöffnet.')}>Ansehen</Button>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 28 }}>
              <div className="h-3" style={{ marginBottom: 14 }}>Daten exportieren</div>
              <p className="t-muted" style={{ fontSize: 13, marginBottom: 14 }}>Erhalte eine vollständige Kopie deiner Daten (DSGVO-konform) per E-Mail.</p>
              <Button variant="outline" icon="download" onClick={() => showToast('Datenexport wird vorbereitet. Du erhältst eine E-Mail.')}>Meine Daten exportieren</Button>
            </div>
          </div>
        )}

        {tab === 'availability' && isTeacher && (
          <div className="card" style={{ padding: 28 }}>
            <div className="h-3" style={{ marginBottom: 14 }}>Verfügbarkeitseinstellungen</div>
            <p className="t-muted" style={{ fontSize: 13, marginBottom: 20 }}>Steuere, wie Schulen dich finden und kontaktieren können.</p>
            <div className="col" style={{ gap: 14 }}>
              {[
                { l: 'Im Pool sichtbar', d: 'Schulen können dein Profil im Lehrpersonen-Pool sehen' },
                { l: 'Sofort-Anfragen erlauben', d: 'Sehr dringende Anfragen werden direkt an dich gesendet' },
                { l: 'Wochenend-Einsätze', d: 'Anfragen für Samstag und Sonntag erhalten' },
              ].map((x, i) => (
                <div key={i} className="spread" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{x.l}</div>
                    <div className="t-muted" style={{ fontSize: 12, marginTop: 3 }}>{x.d}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => showToast('Einstellung aktualisiert.')}>Aktiv</Button>
                </div>
              ))}
              <div className="spread" style={{ padding: '12px 0' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Maximale Reisedistanz</div>
                  <div className="t-muted" style={{ fontSize: 12, marginTop: 3 }}>Anfragen ausserhalb dieses Radius werden gefiltert</div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <input type="range" min="5" max="100" defaultValue="30" style={{ width: 100 }}/>
                  <span className="t-mono" style={{ fontWeight: 600 }}>30 km</span>
                </div>
              </div>
            </div>
            <Button variant="primary" size="sm" style={{ marginTop: 20 }} onClick={() => showToast('Verfügbarkeitseinstellungen gespeichert.')}>Speichern</Button>
          </div>
        )}
      </div>
    </Shell>
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
