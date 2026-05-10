/* =============== AUTH =============== */
function LoginPage() {
  const { navigate, setUser, showToast } = useStore();
  const [email, setEmail] = useState('anna@schule-davos.ch');
  const [pw, setPw] = useState('demo');
  const [err, setErr] = useState('');

  const accounts = [
    { email: 'anna@schule-davos.ch', name: 'Anna Brunner', role: 'school', schoolId: 's1', avatarKey: 1, label: 'Schule Davos – Schulleitung / Schule' },
    { email: 'lara@teach.ch', name: 'Lara Hofer', role: 'teacher', teacherId: 't1', avatarKey: 1, label: 'Lehrperson – Deutsch, Englisch, Geschichte' },
    { email: 'leitung@chur-west.ch', name: 'Markus Caduff', role: 'leadership', schoolId: 's2', avatarKey: 2, label: 'Schulhaus / Schulleitung Chur West' },
    { email: 'admin@teachconnect.ch', name: 'Sabrina Müller', role: 'admin', avatarKey: 5, label: 'TeachConnect Admin' },
  ];

  const submit = (e) => {
    e?.preventDefault?.();
    const a = accounts.find(x => x.email === email);
    if (!a || pw.length < 3) { setErr('E-Mail oder Passwort stimmt nicht.'); return; }
    setUser(a);
    showToast(`Willkommen zurück, ${a.name.split(' ')[0]}!`);
    navigate(a.role === 'admin' ? '/admin' : a.role === 'leadership' ? '/leadership' : a.role === 'school' ? '/school' : '/teacher');
  };

  const quickLogin = (a) => { setUser(a); showToast(`Eingeloggt als ${a.name}`); navigate(a.role === 'admin' ? '/admin' : a.role === 'leadership' ? '/leadership' : a.role === 'school' ? '/school' : '/teacher'); };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo" style={{ color: 'white', fontSize: 16 }}>
            <Logo size={28}/>
          </span>
        </div>
        <div>
          <p className="testimonial-quote">„In 4 Minuten besetzt, was vorher den ganzen Morgen gekostet hat."</p>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.85)' }}>
            <Avatar name="Anna Brunner" k={1}/>
            <div>
              <div style={{ fontWeight: 600 }}>Anna Brunner</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Schulleitung Schule Davos Platz</div>
            </div>
          </div>
        </div>
        <div className="row" style={{ gap: 16, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
          <span>DSG-konform</span><span>·</span><span>Hosting in der Schweiz</span><span>·</span><span>ISO-27001</span>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <div className="t-eyebrow">Anmelden</div>
          <h1 className="h-1" style={{ marginTop: 8, fontSize: 32 }}>Willkommen zurück.</h1>
          <p className="t-muted" style={{ marginTop: 6 }}>Mit Demo-Konten testen oder eigenes Konto verwenden.</p>

          <form onSubmit={submit} style={{ marginTop: 28 }}>
            <div className="field">
              <label className="label">E-Mail</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="field">
              <div className="spread"><label className="label">Passwort</label><a className="t-tiny" style={{ color: 'var(--primary)', cursor: 'pointer' }}>Vergessen?</a></div>
              <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)}/>
            </div>
            {err && <div className="pill pill-danger" style={{ marginBottom: 12 }}>{err}</div>}
            <Button variant="primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Anmelden</Button>
          </form>

          <div style={{ marginTop: 28 }}>
            <div className="t-eyebrow">Demo-Zugänge (1 Klick)</div>
            <div className="col" style={{ marginTop: 10, gap: 8 }}>
              {accounts.map(a => (
                <div key={a.email} className="role-card" onClick={() => quickLogin(a)}>
                  <div className="row">
                    <Avatar name={a.name} k={a.avatarKey}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                      <div className="t-tiny">{a.label}</div>
                    </div>
                    <Icon name="arrow-right" size={16} style={{ color: 'var(--ink-4)' }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-3)' }}>
            Noch kein Konto? <a onClick={() => navigate('/register')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>Jetzt registrieren</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const { navigate, setUser, showToast } = useStore();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('school');
  const [form, setForm] = useState({ name: '', email: '', school: '', region: '', subjects: [], grades: [] });
  const subjects = SUBJECTS;
  const grades = GRADES;
  const toggle = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));

  const finish = () => {
    const u = role === 'school'
      ? { email: form.email || 'demo@schule.ch', name: form.name || 'Demo Schule', role: 'school', schoolId: 's1', avatarKey: 1 }
      : { email: form.email || 'demo@teach.ch', name: form.name || 'Demo Lehrperson', role: 'teacher', teacherId: 't1', avatarKey: 3 };
    setUser(u);
    showToast('Konto erstellt – willkommen!');
    navigate(role === 'school' ? '/school' : '/teacher');
  };

  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><Logo size={28}/></div>
        <div>
          <p className="testimonial-quote">„Endlich ein Werkzeug, das pädagogisch denkt. Lehrmittel-Kontext und Klasseninfo direkt verknüpft – das macht den Unterschied."</p>
          <div style={{ marginTop: 24, color: 'rgba(255,255,255,0.85)' }}>
            <div style={{ fontWeight: 600 }}>Sabina Janett</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Sek Klosters</div>
          </div>
        </div>
        <div className="row" style={{ gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
          <span>Schritt {step} von 3</span>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
            <div style={{ width: `${step/3*100}%`, height: '100%', background: 'oklch(82% 0.15 195)', borderRadius: 999, transition: 'width .3s' }}/>
          </div>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          {step === 1 && (
            <>
              <div className="t-eyebrow">Schritt 1</div>
              <h1 className="h-1" style={{ marginTop: 8, fontSize: 32 }}>Wer bist du?</h1>
              <p className="t-muted" style={{ marginTop: 6 }}>Wir richten dein Konto je nach Rolle ein.</p>
              <div className="col" style={{ marginTop: 24, gap: 10 }}>
                {[
                  { v: 'school', t: 'Schule', d: 'Anfragen erfassen, Stellvertretungen finden, Übergabe vorbereiten.', i: 'building' },
                  { v: 'teacher', t: 'Stellvertretungslehrperson', d: 'Profil pflegen, Anfragen erhalten, Einsätze annehmen.', i: 'graduation' },
                  { v: 'leadership', t: 'Schulhaus / Schulleitung', d: 'Mehrere Klassen koordinieren, Übersicht über Absenzen.', i: 'school' },
                ].map(o => (
                  <div key={o.v} className={`role-card ${role === o.v ? 'selected' : ''}`} onClick={() => setRole(o.v)}>
                    <div className="row">
                      <div className="feature-icon" style={{ width: 36, height: 36 }}><Icon name={o.i} size={18}/></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{o.t}</div>
                        <div className="t-tiny">{o.d}</div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: 999, border: `2px solid ${role === o.v ? 'var(--primary)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {role === o.v && <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--primary)' }}/>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row" style={{ marginTop: 28, justifyContent: 'space-between' }}>
                <Button variant="ghost" onClick={() => navigate('/login')}>Schon Konto? Anmelden</Button>
                <Button variant="primary" iconRight="arrow-right" onClick={() => setStep(2)}>Weiter</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="t-eyebrow">Schritt 2</div>
              <h1 className="h-1" style={{ marginTop: 8, fontSize: 32 }}>{role === 'school' ? 'Deine Schule' : 'Deine Daten'}</h1>
              <p className="t-muted" style={{ marginTop: 6 }}>{role === 'school' ? 'Diese Angaben erscheinen auf deinen Anfragen.' : 'Wir nutzen das, um Einsätze passend vorzuschlagen.'}</p>
              <div style={{ marginTop: 24 }}>
                <div className="field">
                  <label className="label">{role === 'school' ? 'Name der Schule' : 'Vor- & Nachname'}</label>
                  <input className="input" placeholder={role === 'school' ? 'Schule Davos Platz' : 'Lara Hofer'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
                </div>
                <div className="field">
                  <label className="label">E-Mail</label>
                  <input className="input" type="email" placeholder="anna@schule-xy.ch" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label className="label">Region / Kanton</label>
                    <select className="select" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                      <option value="">Wählen…</option>
                      {['Graubünden','St. Gallen','Glarus','Tessin','Uri','Schwyz','Zürich','Bern'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">{role === 'school' ? 'Anzahl Schüler:innen' : 'Berufserfahrung'}</label>
                    <input className="input" placeholder={role === 'school' ? 'z.B. 280' : 'z.B. 5 Jahre'}/>
                  </div>
                </div>
              </div>
              <div className="row" style={{ marginTop: 28, justifyContent: 'space-between' }}>
                <Button variant="ghost" icon="arrow-left" onClick={() => setStep(1)}>Zurück</Button>
                <Button variant="primary" iconRight="arrow-right" onClick={() => setStep(3)}>Weiter</Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="t-eyebrow">Schritt 3</div>
              <h1 className="h-1" style={{ marginTop: 8, fontSize: 32 }}>{role === 'teacher' ? 'Was unterrichtest du?' : 'Fast geschafft.'}</h1>
              <p className="t-muted" style={{ marginTop: 6 }}>{role === 'teacher' ? 'Wähle Fächer und Stufen, für die du bereitstehst.' : 'Klicke „Konto erstellen" und du bist drin.'}</p>
              {role === 'teacher' ? (
                <>
                  <div style={{ marginTop: 24 }}>
                    <div className="t-eyebrow">Fächer</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {subjects.map(s => (
                        <span key={s} onClick={() => toggle('subjects', s)} className="pill" style={{ cursor: 'pointer', background: form.subjects.includes(s) ? 'var(--primary)' : '', color: form.subjects.includes(s) ? 'white' : '', borderColor: form.subjects.includes(s) ? 'var(--primary)' : '' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <div className="t-eyebrow">Schulstufen</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {grades.map(g => (
                        <span key={g} onClick={() => toggle('grades', g)} className="pill" style={{ cursor: 'pointer', background: form.grades.includes(g) ? 'var(--primary)' : '', color: form.grades.includes(g) ? 'white' : '', borderColor: form.grades.includes(g) ? 'var(--primary)' : '' }}>{g}</span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="card" style={{ padding: 20, marginTop: 24, background: 'var(--surface-2)', border: 'none' }}>
                  <div className="t-eyebrow">Zusammenfassung</div>
                  <div style={{ marginTop: 10 }}>
                    <div className="spread"><span className="t-muted">Rolle</span><b>{role === 'school' ? 'Schule' : 'Schulhaus / Schulleitung'}</b></div>
                    <div className="spread" style={{ marginTop: 6 }}><span className="t-muted">Name</span><b>{form.name || '—'}</b></div>
                    <div className="spread" style={{ marginTop: 6 }}><span className="t-muted">E-Mail</span><b>{form.email || '—'}</b></div>
                    <div className="spread" style={{ marginTop: 6 }}><span className="t-muted">Region</span><b>{form.region || '—'}</b></div>
                  </div>
                </div>
              )}

              <div className="row" style={{ marginTop: 28, justifyContent: 'space-between' }}>
                <Button variant="ghost" icon="arrow-left" onClick={() => setStep(2)}>Zurück</Button>
                <Button variant="primary" iconRight="check" onClick={finish}>Konto erstellen</Button>
              </div>
              <p className="t-tiny" style={{ marginTop: 16 }}>Mit der Registrierung akzeptierst du AGB & Datenschutz. DSG-konform, Hosting in der Schweiz.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginPage, RegisterPage });
