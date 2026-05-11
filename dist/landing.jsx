/* global React */
const { useState: _useStateL } = React;

/* =============== PUBLIC NAV =============== */
function PublicNav() {
  const { navigate, user } = useStore();
  const [menuOpen, setMenuOpen] = _useStateL(false);
  const links = [
    { l: 'Über uns', r: '/about' },
    { l: 'Für Schulen', r: '/for-schools' },
    { l: 'Für Lehrpersonen', r: '/for-teachers' },
    { l: 'Preise', r: '/pricing' },
  ];
  const go = (r) => { navigate(r); setMenuOpen(false); };
  return (
    <>
      <nav className="nav-public">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo size={32}/>
        </div>
        <div className="nav-links">
          {links.map(x => <a key={x.r} onClick={() => navigate(x.r)}>{x.l}</a>)}
        </div>
        <div className="row nav-cta" style={{ gap: 8 }}>
          {user ? (
            <Button variant="primary" size="sm" iconRight="arrow-right" onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'leadership' ? '/leadership' : user.role === 'school' ? '/school' : '/teacher')}>Zum Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Anmelden</Button>
              <Button variant="primary" size="sm" iconRight="arrow-right" onClick={() => navigate('/register')}>Jetzt starten</Button>
            </>
          )}
        </div>
        {/* Hamburger — only visible on mobile */}
        <button className="btn btn-icon btn-ghost nav-hamburger" style={{ display:'none' }} onClick={() => setMenuOpen(true)}>
          <Icon name="menu" size={20}/>
        </button>
      </nav>

      {/* Mobile full-screen nav overlay */}
      {menuOpen && (
        <div className="nav-overlay">
          <div className="nav-overlay-head">
            <Logo size={28}/>
            <button className="btn btn-icon btn-ghost" onClick={() => setMenuOpen(false)}>
              <Icon name="x" size={20}/>
            </button>
          </div>
          <div className="nav-overlay-links">
            {links.map(x => <a key={x.r} onClick={() => go(x.r)}>{x.l}</a>)}
          </div>
          <div className="nav-overlay-btns">
            {user ? (
              <Button variant="primary" iconRight="arrow-right" onClick={() => go(user.role === 'admin' ? '/admin' : user.role === 'leadership' ? '/leadership' : user.role === 'school' ? '/school' : '/teacher')}>Zum Dashboard</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => go('/login')}>Anmelden</Button>
                <Button variant="primary" iconRight="arrow-right" onClick={() => go('/register')}>Jetzt starten</Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* =============== HERO MOCK (small inline preview) =============== */
function HeroMock() {
  return (
    <div className="hero-mock">
      <div className="mock-chrome"><span/><span/><span/></div>
      <div className="hero-mock-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 380 }}>
        <div className="hero-mock-sidebar" style={{ background: 'var(--surface-2)', borderRight: '1px solid var(--border)', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Logo size={20} withWord={false}/>
            <span style={{ fontWeight: 600, fontSize: 13 }}>TeachConnect</span>
          </div>
          {['Übersicht','Anfragen','Buchungen','Team','Statistiken'].map((t,i) => (
            <div key={t} style={{ padding: '7px 10px', borderRadius: 7, background: i === 1 ? 'var(--primary-50)' : 'transparent', color: i === 1 ? 'var(--primary)' : 'var(--ink-2)', fontSize: 12, fontWeight: 500, marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
              <span>{t}</span>{i === 1 && <span style={{ background: 'var(--primary)', color: 'white', fontSize: 10, padding: '1px 6px', borderRadius: 999 }}>3</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: 20 }}>
          <div className="spread" style={{ marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Offene Anfragen</div>
              <div className="t-tiny">Schule Davos Platz · 8. Mai 2026</div>
            </div>
            <span className="pill pill-primary"><Icon name="zap" size={11}/> 3 neue Vorschläge</span>
          </div>
          <div className="col" style={{ gap: 8 }}>
            {[
              { s: 'Mathematik · Sek I', d: 'Heute, 08:00–11:30', m: 96, n: 'David Eberle' },
              { s: 'Sport · 5./6. Primar', d: 'Heute, 13:30–15:15', m: 91, n: 'Reto Janett' },
              { s: 'Französisch · Sek I', d: 'Morgen, 10:15–12:00', m: 88, n: 'Mirjam Cathomen' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={r.n} size={28} k={i+2}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.s}</div>
                  <div className="t-tiny">{r.d} · empfohlen: <b style={{ color: 'var(--ink-2)' }}>{r.n}</b></div>
                </div>
                <span className="match-score">{r.m}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== LANDING =============== */
function Landing() {
  const { navigate } = useStore();
  return (
    <div className="app">
      <PublicNav/>

      <section className="hero">
        <div className="hero-blob"/>
        <div className="hero-inner">
          <div className="eyebrow-pill" style={{ marginBottom: 24 }}>
            <span className="dot dot-pulse" style={{ color: 'var(--success)' }}/>
            Ein Bündner Pilot mit 12 Schulen läuft bereits
          </div>
          <h1 className="h-display" style={{ margin: 0 }}>
            Stellvertretungen finden.<br/>
            <span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 600 }}>Unterricht sichern.</span>
          </h1>
          <p style={{ fontSize: 19, color: 'var(--ink-3)', maxWidth: 640, margin: '24px auto 32px', lineHeight: 1.5 }}>
            Die digitale Plattform für Schweizer Schulen, die kurzfristige Ausfälle in Minuten besetzt – mit smartem Matching und sauberer Unterrichtsübergabe.
          </p>
          <div className="row hero-buttons" style={{ justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => navigate('/register')}>Schule jetzt starten</Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/for-teachers')}>Als Lehrperson registrieren</Button>
          </div>
          <div className="t-tiny" style={{ marginTop: 14 }}>30 Tage kostenlos · Keine Kreditkarte · DSG-konform · Hosting in der Schweiz</div>

          <HeroMock/>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '32px 32px 8px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="t-tiny" style={{ textAlign: 'center', marginBottom: 16 }}>VERTRAUEN VON SCHULEN AUS GRAUBÜNDEN, ST. GALLEN UND GLARUS</div>
          <div className="row" style={{ justifyContent: 'space-around', flexWrap: 'wrap', gap: 24, paddingBottom: 16, opacity: 0.7 }}>
            {['Schule Davos','Primarschule Chur West','Sek Klosters','Schule Ilanz','Schule Arosa','Schule Lenzerheide'].map(n => (
              <div key={n} style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-3)', letterSpacing: '-0.01em' }}>{n}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Das Problem</div>
          <h2 className="section-title">Stellvertretungen sind ein 06:30-Uhr-Problem.</h2>
          <p className="section-lede">
            Bis heute laufen Schulleitungen morgens Telefonketten ab, um Ausfälle zu besetzen. Ein Drittel der Versuche scheitert. Der Unterricht fällt aus oder findet ohne Vorbereitung statt.
          </p>

          <div className="split">
            <div className="problem-card">
              <Pill variant="danger">Vorher</Pill>
              <div className="h-2" style={{ marginTop: 14 }}>Telefon, WhatsApp, Excel-Liste.</div>
              <ul className="checklist" style={{ marginTop: 18, gap: 14 }}>
                <li><Icon name="x" size={16} style={{ color: 'var(--danger)', marginTop: 3 }}/><div><b>Manuelle Suche</b> – Schulleitung ruft 8 Personen an, bevor jemand zusagt.</div></li>
                <li><Icon name="x" size={16} style={{ color: 'var(--danger)', marginTop: 3 }}/><div><b>Keine Übergabe</b> – Stellvertretung kommt ohne Lektionsplan an.</div></li>
                <li><Icon name="x" size={16} style={{ color: 'var(--danger)', marginTop: 3 }}/><div><b>Doppelte Buchungen</b> – Lehrpersonen werden von mehreren Schulen gleichzeitig angefragt.</div></li>
                <li><Icon name="x" size={16} style={{ color: 'var(--danger)', marginTop: 3 }}/><div><b>Verlorene Zeit</b> – Ø 95 Min. pro Ausfall reine Administration.</div></li>
              </ul>
            </div>
            <div className="solution-card">
              <Pill>Mit TeachConnect</Pill>
              <div className="h-2" style={{ marginTop: 14, color: 'white' }}>Ein Klick. Drei Vorschläge. Übergabe inklusive.</div>
              <ul className="checklist" style={{ marginTop: 18, gap: 14 }}>
                <li><Icon name="check" size={16} style={{ color: 'oklch(82% 0.15 155)', marginTop: 3 }}/><div style={{ color: 'rgba(255,255,255,0.9)' }}><b style={{ color: 'white' }}>Smart Matching</b> – passende Lehrpersonen sortiert nach Fach, Stufe, Region und Verfügbarkeit.</div></li>
                <li><Icon name="check" size={16} style={{ color: 'oklch(82% 0.15 155)', marginTop: 3 }}/><div style={{ color: 'rgba(255,255,255,0.9)' }}><b style={{ color: 'white' }}>Vorbereitete Übergabe</b> – Lektionsplan, Klassenliste und Materialien hinterlegt.</div></li>
                <li><Icon name="check" size={16} style={{ color: 'oklch(82% 0.15 155)', marginTop: 3 }}/><div style={{ color: 'rgba(255,255,255,0.9)' }}><b style={{ color: 'white' }}>Live-Verfügbarkeit</b> – Lehrpersonen pflegen ihren Kalender direkt in der App.</div></li>
                <li><Icon name="check" size={16} style={{ color: 'oklch(82% 0.15 155)', marginTop: 3 }}/><div style={{ color: 'rgba(255,255,255,0.9)' }}><b style={{ color: 'white' }}>Audit-Log</b> – jede Buchung dokumentiert, exportierbar für die Schulpflege.</div></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* From hours to minutes */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-inner">
          <div className="section-eyebrow">Von Stunden zu Minuten</div>
          <h2 className="section-title">Was 95 Minuten dauerte, dauert jetzt 4.</h2>
          <p className="section-lede">Aus dem 12-Schulen-Pilot in Graubünden, Januar–April 2026.</p>

          <div className="compare">
            <div>
              <div className="t-eyebrow" style={{ color: 'var(--ink-3)', marginBottom: 12 }}>Klassisch</div>
              <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink-3)', lineHeight: 1 }}>95<small style={{ fontSize: 22, fontWeight: 500 }}>min</small></div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>Telefon, E-Mail, Übergabe – Ø pro Ausfall</div>
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[{l:'Telefonate', v: 38},{l:'Übergabe schreiben', v: 32},{l:'Bestätigungen einholen', v: 18},{l:'Eintragen Schulinfo', v: 7}].map(x => (
                  <div key={x.l}>
                    <div className="spread" style={{ fontSize: 12, marginBottom: 2 }}><span>{x.l}</span><span className="t-mono">{x.v} min</span></div>
                    <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999 }}><div style={{ width: `${x.v}%`, height: '100%', background: 'var(--ink-4)', borderRadius: 999 }}/></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 28 }}>
              <div className="t-eyebrow" style={{ color: 'var(--primary)', marginBottom: 12 }}>Mit TeachConnect</div>
              <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--primary)', lineHeight: 1 }}>4<small style={{ fontSize: 22, fontWeight: 500, color: 'var(--ink-3)' }}>min</small></div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>Anfrage erfasst, Match gewählt, bestätigt</div>
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[{l:'Anfrage erfassen', v: 90},{l:'Match auswählen', v: 50},{l:'Bestätigen', v: 30},{l:'Übergabe (vorbereitet)', v: 10}].map(x => (
                  <div key={x.l}>
                    <div className="spread" style={{ fontSize: 12, marginBottom: 2 }}><span>{x.l}</span><span className="t-mono">{Math.round(x.v/25)} min</span></div>
                    <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999 }}><div style={{ width: `${x.v/4}%`, height: '100%', background: 'var(--primary)', borderRadius: 999 }}/></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-4" style={{ marginTop: 32 }}>
            {[
              { v: '96%', l: 'Besetzungsquote' },
              { v: '4 min', l: 'Ø Bearbeitungszeit' },
              { v: '180+', l: 'Lehrpersonen im Pool' },
              { v: '12', l: 'Pilot-Schulen' },
            ].map(s => (
              <div key={s.l} className="card" style={{ padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--primary)' }}>{s.v}</div>
                <div className="t-tiny" style={{ marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">So funktioniert's</div>
          <h2 className="section-title">Vier Schritte. Kein Excel mehr.</h2>
          <div className="card" style={{ marginTop: 40 }}>
            <div className="stepper">
              {[
                { n: '01', t: 'Bedarf erfassen', d: 'Datum, Fach, Stufe, Lektionen. Optional Lektionsplan anhängen – die Schule kennt den Rest aus dem Profil.', i: 'edit' },
                { n: '02', t: 'Smart Matching', d: 'TeachConnect schlägt 3–5 verfügbare Lehrpersonen vor, sortiert nach Eignung und Distanz.', i: 'sparkles' },
                { n: '03', t: 'Anfragen senden', d: 'Push-Benachrichtigung an Top-Vorschläge. Erste Zusage wird vorgemerkt – Schule entscheidet.', i: 'send' },
                { n: '04', t: 'Übergabe & Einsatz', d: 'Lehrperson sieht Lektionsplan, Klassenliste und Schulinfo direkt in der App. Nach Einsatz: Bewertung.', i: 'check-circle' },
              ].map(s => (
                <div key={s.n} className="step">
                  <div className="step-num">{s.n}</div>
                  <div className="feature-icon" style={{ marginBottom: 12 }}><Icon name={s.i} size={18}/></div>
                  <div className="h-3" style={{ fontSize: 16, marginBottom: 6 }}>{s.t}</div>
                  <div className="t-muted" style={{ fontSize: 13 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two roles */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="section-inner">
          <div className="section-eyebrow">Für beide Seiten</div>
          <h2 className="section-title">Eine Plattform. Zwei Arbeitsalltage erleichtert.</h2>
          <div className="split" style={{ marginTop: 40 }}>
            <div className="card" style={{ padding: 32 }}>
              <Icon name="building" size={26} style={{ color: 'var(--primary)' }}/>
              <div className="h-2" style={{ marginTop: 14 }}>Für Schulen & Schulleitungen</div>
              <p className="t-muted" style={{ marginTop: 6 }}>Weniger Telefon, mehr Pädagogik.</p>
              <ul className="checklist" style={{ marginTop: 16, gap: 12 }}>
                <li><Icon name="check" size={16}/>Bedarf in 60 Sekunden erfassen</li>
                <li><Icon name="check" size={16}/>Vorgeschlagene Lehrpersonen vergleichen</li>
                <li><Icon name="check" size={16}/>Unterrichtsmaterial & Klasseninfo hinterlegen</li>
                <li><Icon name="check" size={16}/>Buchungs- und Absenz-Übersicht</li>
                <li><Icon name="check" size={16}/>Statistiken & Audit-Log für die Schulpflege</li>
              </ul>
              <Button variant="primary" iconRight="arrow-right" style={{ marginTop: 24 }} onClick={() => navigate('/for-schools')}>Mehr für Schulen</Button>
            </div>
            <div className="card" style={{ padding: 32 }}>
              <Icon name="graduation" size={26} style={{ color: 'var(--accent)' }}/>
              <div className="h-2" style={{ marginTop: 14 }}>Für Lehrpersonen</div>
              <p className="t-muted" style={{ marginTop: 6 }}>Einsätze, die zu deinem Kalender passen.</p>
              <ul className="checklist" style={{ marginTop: 16, gap: 12 }}>
                <li><Icon name="check" size={16}/>Profil mit Fächern, Stufen, Region erstellen</li>
                <li><Icon name="check" size={16}/>Verfügbarkeit pflegen – auch tageweise</li>
                <li><Icon name="check" size={16}/>Einsätze annehmen oder ablehnen</li>
                <li><Icon name="check" size={16}/>Lektionsplan & Materialien vorbereitet</li>
                <li><Icon name="check" size={16}/>Bewertungen sammeln, Reputation aufbauen</li>
              </ul>
              <Button variant="outline" iconRight="arrow-right" style={{ marginTop: 24 }} onClick={() => navigate('/for-teachers')}>Mehr für Lehrpersonen</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Preise</div>
          <h2 className="section-title">Fair, transparent, schweizweit.</h2>
          <p className="section-lede">Lehrpersonen nutzen TeachConnect kostenlos. Schulen zahlen pro Standort, ohne Setup-Gebühr.</p>
          <div style={{ textAlign: 'center' }}>
            <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => navigate('/pricing')}>Preise ansehen</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="card" style={{ padding: 56, textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, oklch(38% 0.16 240) 100%)', color: 'white', border: 'none' }}>
            <div className="h-1" style={{ color: 'white', fontSize: 36, lineHeight: 1.1 }}>Der nächste Krankheitsfall kommt bestimmt.</div>
            <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 540, margin: '14px auto 28px', fontSize: 17 }}>Starten Sie heute. 30 Tage kostenlos. In 10 Minuten ist Ihre Schule eingerichtet.</p>
            <div className="row" style={{ justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="outline" size="lg" iconRight="arrow-right" style={{ background: 'white', borderColor: 'white' }} onClick={() => navigate('/register')}>Schule registrieren</Button>
              <Button variant="ghost" size="lg" style={{ color: 'white', background: 'rgba(255,255,255,0.12)' }} onClick={() => navigate('/login')}>Demo-Login</Button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter/>
    </div>
  );
}

function PublicFooter() {
  const { navigate } = useStore();
  return (
    <footer className="footer">
      <div className="footer-grid" style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Logo size={26}/>
          <div className="t-tiny" style={{ marginTop: 8 }}>© 2026 TeachConnect AG · Hosting in der Schweiz · DSG-konform</div>
        </div>
        <div className="row" style={{ gap: 24, flexWrap: 'wrap' }}>
          <a className="t-muted" onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}>Über uns</a>
          <a className="t-muted" onClick={() => navigate('/pricing')} style={{ cursor: 'pointer' }}>Preise</a>
          <a className="t-muted" style={{ cursor: 'pointer' }}>Datenschutz</a>
          <a className="t-muted" style={{ cursor: 'pointer' }}>Impressum</a>
          <a className="t-muted" style={{ cursor: 'pointer' }}>Kontakt</a>
        </div>
      </div>
    </footer>
  );
}

/* =============== ABOUT =============== */
function AboutPage() {
  const { navigate } = useStore();
  return (
    <div className="app">
      <PublicNav/>
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="section-inner" style={{ maxWidth: 880 }}>
          <div className="section-eyebrow" style={{ textAlign: 'left' }}>Über TeachConnect</div>
          <h1 className="h-1" style={{ fontSize: 44, marginTop: 8 }}>Damit kein Schultag wegen Telefonketten verloren geht.</h1>
          <p className="t-body" style={{ fontSize: 18, color: 'var(--ink-2)', marginTop: 18, maxWidth: 720 }}>
            TeachConnect wurde 2026 von Studierenden der Fachhochschule Graubünden in Chur gegründet. Entstanden ist die Plattform aus einem Modulprojekt – in enger Zusammenarbeit mit aktiven Lehrpersonen und Schulleitungen, die uns als Berater:innen zur Seite stehen. Wir bauen Werkzeuge für die kurzfristige Stellvertretung – das ist alles, was wir tun. Ohne Feature-Bloat.
          </p>

          <div className="grid-3" style={{ marginTop: 48 }}>
            <div className="card" style={{ padding: 24 }}>
              <Icon name="compass" size={22} style={{ color: 'var(--primary)' }}/>
              <div className="h-3" style={{ marginTop: 12 }}>Mission</div>
              <p className="t-muted" style={{ marginTop: 6 }}>Jede Lektion findet statt – mit der richtigen Person, vorbereitet.</p>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <Icon name="zap" size={22} style={{ color: 'var(--accent)' }}/>
              <div className="h-3" style={{ marginTop: 12 }}>Fokus</div>
              <p className="t-muted" style={{ marginTop: 6 }}>Kurzfristige Stellvertretungen – &lt;48 h Vorlauf. Da, wo der Druck am grössten ist.</p>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <Icon name="shield-check" size={22} style={{ color: 'var(--success)' }}/>
              <div className="h-3" style={{ marginTop: 12 }}>Verantwortung</div>
              <p className="t-muted" style={{ marginTop: 6 }}>Schweizer Hosting. DSG-konform. Verifizierte Profile. Kein Verkauf von Daten.</p>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <div className="t-eyebrow">Was uns einzigartig macht</div>
            <h2 className="h-1" style={{ marginTop: 12 }}>Unterrichtsübergabe ist kein Add-on – sie ist der Kern.</h2>
            <p className="t-body" style={{ fontSize: 17, marginTop: 14, color: 'var(--ink-2)' }}>
              Andere Tools vermitteln. Wir vermitteln – und stellen sicher, dass die Stellvertretung am Morgen weiss, was zu tun ist. Lektionsplan, Klassenliste, Hausordnung, Notfallnummern, Material­standort: alles in einer strukturierten Übergabe. So kommt nicht nur jemand, sondern die richtige Person, vorbereitet.
            </p>
          </div>

          <div style={{ marginTop: 48, padding: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div className="t-eyebrow">Team</div>
                <div className="h-3" style={{ marginTop: 6 }}>Studierende · Fachhochschule Graubünden</div>
              </div>
              <Pill variant="primary">Gegründet 2026</Pill>
            </div>
            <div className="grid-3" style={{ marginTop: 16, gap: 16 }}>
              {[
                { n: 'Rama', r: 'Operations / Gesamtkoordination', av: 1 },
                { n: 'Joao', r: 'Technologie / Plattform', av: 2 },
                { n: 'Nico', r: 'Finance / Business Development', av: 3 },
                { n: 'Damien', r: 'Marketing / Sales', av: 4 },
                { n: 'Thasana', r: 'Customer Insights', av: 5 },
                { n: 'Pleurat', r: 'Konkurrenz / Positionierung', av: 6 },
              ].map(p => (
                <div key={p.n} className="card" style={{ padding: 18, background: 'var(--surface)' }}>
                  <div className="row" style={{ gap: 12 }}>
                    <Avatar name={p.n} size={48} k={p.av}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{p.n}</div>
                      <div className="t-tiny" style={{ marginTop: 2, color: 'var(--primary)', fontWeight: 600 }}>{p.r}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PublicFooter/>
    </div>
  );
}

/* =============== FOR SCHOOLS / FOR TEACHERS  =============== */
function ForSchools() {
  const { navigate } = useStore();
  return (
    <div className="app">
      <PublicNav/>
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="section-inner" style={{ maxWidth: 1080 }}>
          <Pill variant="primary"><Icon name="building" size={12}/> Für Schulen</Pill>
          <h1 className="h-1" style={{ fontSize: 48, marginTop: 16, maxWidth: 760 }}>Bedarf erfassen. Match wählen. Unterricht läuft.</h1>
          <p className="t-body" style={{ fontSize: 18, marginTop: 12, maxWidth: 720 }}>
            Vier Werkzeuge, die zusammenspielen. Damit Sie morgens nicht mehr telefonieren müssen.
          </p>

          <div className="grid-2" style={{ marginTop: 40 }}>
            {[
              { i: 'edit', t: 'Bedarf erfassen', d: 'Anfrage in 60 Sekunden – wiederkehrende Klassen werden vorgeschlagen, Schulprofil wird automatisch verknüpft.' },
              { i: 'sparkles', t: 'Passende Lehrpersonen finden', d: 'Smart Matching nach Fach, Stufe, Region, Verfügbarkeit, Bewertung. 3–5 Vorschläge mit Match-Score.' },
              { i: 'upload', t: 'Unterrichtsmaterial hinterlegen', d: 'PDF, Lektionsplan, Klassenliste hochladen. Bei wiederkehrenden Klassen einmal hinterlegen, immer bereit.' },
              { i: 'list-check', t: 'Buchungen verwalten', d: 'Status-Übersicht offen / bestätigt / abgeschlossen. Bewertungen abgeben, Audit-Log exportieren.' },
            ].map(f => (
              <div key={f.t} className="card" style={{ padding: 28 }}>
                <div className="feature-icon"><Icon name={f.i} size={20}/></div>
                <div className="h-3" style={{ marginTop: 14 }}>{f.t}</div>
                <p className="t-muted" style={{ marginTop: 6 }}>{f.d}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 40, marginTop: 40, background: 'var(--surface-2)' }}>
            <div className="row" style={{ gap: 28, flexWrap: 'wrap' }}>
              <Avatar name="Anna Brunner" size={64} k={1}/>
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{ fontSize: 19, lineHeight: 1.4, color: 'var(--ink-1)', letterSpacing: '-0.005em' }}>
                  „Im Pilot haben wir 38 Stellvertretungen besetzt. Eine einzige Lektion ist ausgefallen – und das, weil ich vergessen habe, die Anfrage zu schicken. Es funktioniert."
                </p>
                <div className="t-tiny" style={{ marginTop: 10 }}>ANNA BRUNNER · SCHULLEITUNG SCHULE DAVOS PLATZ</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => navigate('/register')}>Schule registrieren</Button>
          </div>
        </div>
      </section>
      <PublicFooter/>
    </div>
  );
}

function ForTeachers() {
  const { navigate } = useStore();
  return (
    <div className="app">
      <PublicNav/>
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="section-inner" style={{ maxWidth: 1080 }}>
          <Pill variant="accent"><Icon name="graduation" size={12}/> Für Lehrpersonen</Pill>
          <h1 className="h-1" style={{ fontSize: 48, marginTop: 16, maxWidth: 760 }}>Einsätze, die zu deinem Kalender passen.</h1>
          <p className="t-body" style={{ fontSize: 18, marginTop: 12, maxWidth: 720 }}>
            Trag deine Verfügbarkeit ein, sag, was du unterrichtest – wir bringen die Anfragen zu dir. Kostenlos. Schweizweit.
          </p>

          <div className="grid-2" style={{ marginTop: 40 }}>
            {[
              { i: 'user', t: 'Profil erstellen', d: 'Fächer, Schulstufen, Region, Qualifikation. Ausweis & Strafregisterauszug verifiziert.' },
              { i: 'calendar', t: 'Verfügbarkeit pflegen', d: 'Tage, Halbtage, Wochen blockieren. Push-Anfragen nur in deinen Slots.' },
              { i: 'inbox', t: 'Passende Einsätze erhalten', d: 'Push, wenn ein Match ≥80% in deiner Region. Du entscheidest in 1 Klick.' },
              { i: 'star', t: 'Reputation aufbauen', d: 'Nach jedem Einsatz: Bewertung. Sichtbar fürs nächste Match.' },
            ].map(f => (
              <div key={f.t} className="card feature-accent" style={{ padding: 28 }}>
                <div className="feature-icon"><Icon name={f.i} size={20}/></div>
                <div className="h-3" style={{ marginTop: 14 }}>{f.t}</div>
                <p className="t-muted" style={{ marginTop: 6 }}>{f.d}</p>
              </div>
            ))}
          </div>

          <div className="grid-3" style={{ marginTop: 40, gap: 16 }}>
            {[
              { v: 'CHF 0', l: 'Für Lehrpersonen kostenlos' },
              { v: '180+', l: 'Lehrpersonen aktiv' },
              { v: '4.8/5', l: 'Ø Bewertung im Pilot' },
            ].map(s => (
              <div key={s.l} className="card" style={{ padding: 22, textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{s.v}</div>
                <div className="t-tiny" style={{ marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Button variant="primary" size="lg" iconRight="arrow-right" onClick={() => navigate('/register')}>Als Lehrperson registrieren</Button>
          </div>
        </div>
      </section>
      <PublicFooter/>
    </div>
  );
}

/* =============== PRICING =============== */
function PricingPage() {
  const { navigate } = useStore();
  return (
    <div className="app">
      <PublicNav/>
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="section-inner">
          <div className="section-eyebrow">Preise</div>
          <h1 className="section-title">Kein Setup. Keine versteckten Kosten.</h1>
          <p className="section-lede">Pro Schulstandort, monatlich kündbar. 30 Tage kostenlos testen.</p>

          <div className="price-grid">
            <div className="price-card featured">
              <div>
                <Pill variant="primary">Für Schulen</Pill>
                <div className="t-eyebrow" style={{ color: 'var(--ink-3)', marginTop: 12 }}>Schul-Abonnement</div>
                <div className="t-muted" style={{ marginTop: 4 }}>Pro Schulstandort</div>
              </div>
              <div>
                <div className="price-amount">CHF 75<small> / Monat</small></div>
                <div className="t-tiny" style={{ marginTop: 4, color: 'var(--ink-3)' }}>oder CHF 900 / Jahr</div>
              </div>
              <ul className="checklist">
                <li><Icon name="check" size={16}/>Stellvertretungsanfragen</li>
                <li><Icon name="check" size={16}/>Smart Matching</li>
                <li><Icon name="check" size={16}/>Unterrichtsübergabe</li>
                <li><Icon name="check" size={16}/>Administrationsfunktionen</li>
                <li><Icon name="check" size={16}/>30 Tage kostenlos testen</li>
              </ul>
              <Button variant="primary" iconRight="arrow-right" onClick={() => navigate('/register')}>Starten</Button>
            </div>

            <div className="price-card">
              <div>
                <Pill variant="accent">Für Lehrpersonen</Pill>
                <div className="t-eyebrow" style={{ color: 'var(--ink-3)', marginTop: 12 }}>Kostenlose Registrierung</div>
                <div className="t-muted" style={{ marginTop: 4 }}>Jetzt & immer gratis</div>
              </div>
              <div className="price-amount">CHF 0<small> / Monat</small></div>
              <ul className="checklist">
                <li><Icon name="check" size={16}/>Profil & Verfügbarkeitskalender</li>
                <li><Icon name="check" size={16}/>Direkte Anfragen erhalten</li>
                <li><Icon name="check" size={16}/>Bewerbungen & Bewertungen</li>
                <li><Icon name="check" size={16}/>Keine versteckten Kosten</li>
              </ul>
              <Button variant="outline" iconRight="arrow-right" onClick={() => navigate('/register')}>Registrieren</Button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 32, maxWidth: 840, margin: '32px auto 0' }}>
            <div className="card" style={{ padding: 28 }}>
              <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                <Pill variant="accent">Vermittlungsgebühr</Pill>
              </div>
              <div className="h-3">12.5 % des Stellvertretungs-Lohnes</div>
              <p className="t-muted" style={{ marginTop: 6 }}>Pro erfolgreich vermitteltem Einsatz fällig. Die Einnahmen wachsen direkt mit der Anzahl erfolgreicher Einsätze.</p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                <Pill variant="accent">Inserate-Bundle</Pill>
              </div>
              <div className="h-3">CHF 30 für 5 Inserate</div>
              <p className="t-muted" style={{ marginTop: 6 }}>Einfache Veröffentlichung mehrerer Stellvertretungsanfragen auf einmal.</p>
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <div className="t-eyebrow" style={{ textAlign: 'center', marginBottom: 16 }}>Häufige Fragen</div>
            {[
              { q: 'Müssen Lehrpersonen bezahlen?', a: 'Nein. Lehrpersonen nutzen TeachConnect komplett kostenlos – inklusive Profil, Verfügbarkeitskalender und Bewertungen.' },
              { q: 'Wie berechnet sich die Vermittlungsgebühr?', a: 'Bei jeder erfolgreichen Vermittlung berechnen wir 12.5 % des Lohnes der Stellvertretungslehrperson. Die Gebühr wird nur bei tatsächlich besetzten Einsätzen fällig.' },
              { q: 'Was beinhalten die Inserate-Bundles?', a: 'Ein Bundle mit 5 Inseraten kostet CHF 30 und ermöglicht Schulen die einfache Veröffentlichung mehrerer Stellvertretungsanfragen.' },
              { q: 'Was, wenn keine passende Person gefunden wird?', a: 'Sie können die Anfrage jederzeit weiter veröffentlichen. Im Pilot lag die Besetzungsquote bei 96 % – im Schnitt unter 4 Stunden.' },
              { q: 'Wie funktioniert die Verifikation?', a: 'Wir prüfen Ausweis, Strafregisterauszug und Lehrdiplom (oder gleichwertige Qualifikation). Verifizierte Profile tragen ein Badge.' },
              { q: 'Wo werden Daten gespeichert?', a: 'Ausschliesslich in der Schweiz, bei einem ISO-27001-zertifizierten Anbieter. Wir sind DSG-konform und arbeiten mit einem Schweizer Datenschutzberater.' },
            ].map((f, i) => (
              <details key={i} style={{ borderBottom: '1px solid var(--border)', padding: '18px 4px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 15, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {f.q}<Icon name="chevron-down" size={16}/>
                </summary>
                <p className="t-muted" style={{ marginTop: 10 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter/>
    </div>
  );
}

Object.assign(window, { Landing, AboutPage, ForSchools, ForTeachers, PricingPage, PublicNav, PublicFooter });
