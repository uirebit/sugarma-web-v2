/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

// =====================================================================
// Marker for unverified data — flagged "por confirmar" so the client
// knows exactly which figures/dates/claims need real data. Toggle via Tweaks.
// =====================================================================
function M({ children, note = 'por confirmar' }) {
  return (
    <span className="marker" data-note={note}>{children}<i className="marker-flag">{note}</i></span>
  );
}

// =====================================================================
// Information architecture (mirrors the client sitemap)
// =====================================================================
const NAV = [
  {
    label: 'Quiénes somos', href: '#quienes',
    children: [
      { label: 'Misión y valores', href: '#mision' },
      { label: 'Historia y equipo', href: '#historia' },
      { label: 'Alianza Pioneer', href: '#alianza' },
    ],
  },
  {
    label: 'Servicios', href: '#servicios',
    children: [
      { label: 'Almacenamiento', href: '#almacenamiento' },
      { label: 'Logística y transporte', href: '#logistica' },
      { label: 'Gestión de incidencias', href: '#incidencias' },
      { label: 'Fincas especiales', href: '#fincas' },
    ],
  },
  {
    label: 'Casos de éxito', href: '#casos',
    children: [
      { label: 'Optimización de cargas', href: '#caso-cargas' },
      { label: 'Gestión de fincas restringidas', href: '#caso-fincas' },
      { label: 'Reducción de tiempos de entrega', href: '#caso-tiempos' },
    ],
  },
  {
    label: 'Soporte', href: '#soporte',
    children: [
      { label: 'FAQs técnicas', href: '#faqs' },
      { label: 'Formulario de contacto', href: '#contacto' },
      { label: 'Seguimiento de pedidos', href: '#seguimiento' },
      { label: 'Área privada de clientes', href: '#area-privada' },
    ],
  },
];

const VALUES = [
  { n: '01', t: 'Fiabilidad', d: 'Lo que se promete, se entrega: variedad, calibre y plazo. La operativa del cliente depende de ello.' },
  { n: '02', t: 'Trazabilidad', d: 'Cada lote con origen, certificado y número de seguimiento verificable de principio a fin.' },
  { n: '03', t: 'Cercanía', d: 'Equipo estable y pequeño. Tratas siempre con la misma persona, campaña tras campaña.' },
  { n: '04', t: 'Conocimiento técnico', d: 'Asesoramiento real sobre variedad, dosis y manejo, no argumentario comercial.' },
];

const HISTORIA = [
  { year: '1987', title: 'Fundación en Aranjuez', body: 'Nace como almacén de distribución para los agricultores de la vega del Tajo.', confirm: true },
  { year: '199X', title: 'Ampliación de almacén', body: 'Crecimiento de la capacidad de almacenamiento y de la flota de reparto.', confirm: true },
  { year: '20XX', title: 'Alianza con Pioneer', body: 'Acuerdo de distribución con la multinacional de semillas (fecha y alcance por confirmar).', confirm: true },
  { year: '20XX', title: 'Certificación ISO', body: 'Implantación del sistema de gestión de calidad / medioambiental (norma y nº por confirmar).', confirm: true },
  { year: 'Hoy', title: 'Equipo y cobertura', body: 'Servicio a cooperativas, viveros, ayuntamientos y agricultores profesionales en el centro peninsular.' },
];

const SERVICIOS = [
  {
    id: 'almacenamiento', label: 'Almacenamiento',
    desc: 'Almacén acondicionado para semilla y producto agrícola, con control de condiciones y rotación de stock por campaña.',
    points: ['Naves acondicionadas y secas', 'Control de lote y caducidad', 'Stock asegurado fuera de campaña'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M3 21h18"/><path d="M9 21v-6h6v6"/><path d="M9 12h6"/></svg>
    ),
  },
  {
    id: 'logistica', label: 'Logística y transporte',
    desc: 'Flota propia y partners de confianza para entregas paletizadas dentro de la zona de cobertura, con planificación por ruta.',
    points: ['Entregas en 24–72 h en zona', 'Reparto paletizado y a granel', 'Planificación por campaña'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="14" height="11" rx="1"/><path d="M15 9h4l3 4v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
    ),
  },
  {
    id: 'incidencias', label: 'Gestión de incidencias',
    desc: 'Protocolo de resolución ágil ante roturas de stock, desvíos de entrega o no conformidades de lote, con técnico asignado.',
    points: ['Técnico de cuenta asignado', 'Resolución y reposición rápida', 'Registro y trazabilidad del caso'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>
    ),
  },
  {
    id: 'fincas', label: 'Fincas especiales',
    desc: 'Suministro y servicio a fincas con requisitos específicos: producción ecológica, semilla certificada o condiciones de acceso particulares.',
    points: ['Producción ecológica y certificada', 'Variedades a medida del terreno', 'Suministro recurrente programado'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18"/><path d="M5 20V9l4-3 4 3v11"/><path d="M13 20v-6l4-3 2 1.5V20"/><path d="M8 12h.01M8 15h.01"/></svg>
    ),
  },
];

const CASOS = [
  {
    id: 'caso-cargas', tag: 'Optimización de cargas',
    metric: '–XX%', metricLabel: 'coste por palet transportado',
    title: 'Optimización de cargas para una cooperativa',
    body: 'Replanificación de rutas y consolidación de pedidos para reducir viajes en vacío durante la campaña de siembra.',
  },
  {
    id: 'caso-fincas', tag: 'Gestión de fincas restringidas',
    metric: 'XX', metricLabel: 'fincas con acceso restringido servidas',
    title: 'Suministro a fincas de acceso restringido',
    body: 'Coordinación de entregas en explotaciones con ventanas y permisos de acceso limitados, cumpliendo plazos de siembra.',
  },
  {
    id: 'caso-tiempos', tag: 'Reducción de tiempos de entrega',
    metric: 'XX h', metricLabel: 'plazo medio de entrega en zona',
    title: 'Reducción de tiempos de entrega',
    body: 'Stock anticipado y rutas dedicadas en plena temporada para garantizar la semilla en campo cuando se necesita.',
  },
];

const FAQS = [
  { q: '¿Vendéis a particulares?', a: 'No. Sugarma es distribuidor mayorista B2B. Trabajamos con cooperativas, viveros, agricultores profesionales, ayuntamientos y estudios de paisajismo, previa acreditación de datos fiscales.' },
  { q: '¿Cuál es el pedido mínimo?', a: 'Desde 250 € en producto hortícola y de flor. Sin mínimo en cereales y forrajes a granel. Las condiciones definitivas se confirman en el alta de cuenta.' },
  { q: '¿Qué plazo de entrega ofrecéis?', a: 'Entre 24 y 72 h dentro de la zona de cobertura habitual (Madrid, Castilla–La Mancha y limítrofes). Fuera de zona, plazo y portes bajo consulta.' },
  { q: '¿La semilla está certificada?', a: 'Sí. Trabajamos con semilla certificada e inscrita, con pasaporte fitosanitario cuando aplica y trazabilidad por lote. Los certificados se entregan con el pedido.' },
  { q: '¿Cómo funciona la alianza con Pioneer?', a: 'Distribuimos variedades de la multinacional dentro de nuestra zona. El alcance concreto del acuerdo está pendiente de confirmar con datos y fechas oficiales.' },
  { q: '¿Cómo doy de alta mi cuenta profesional?', a: 'A través del formulario de contacto, aportando CIF y datos fiscales. Tras la primera operación se puede habilitar línea de crédito y acceso al área privada.' },
];

const TESTIMONIALS = [
  { quote: 'Trabajamos con Sugarma desde hace varias campañas. La fiabilidad del calibre y la respuesta en plena temporada los hace insustituibles.', who: 'Mateo Ruiz', role: 'Responsable de compras · Cooperativa La Vega' },
  { quote: 'Para un vivero, la trazabilidad y los plazos son innegociables. Sugarma entrega lo prometido, lote a lote.', who: 'Carmen Iglesias', role: 'Directora · Vivero El Olivar' },
  { quote: 'Su servicio logístico y el asesoramiento técnico son reales, no comerciales. Resuelven incidencias rápido.', who: 'Javier Soto', role: 'Ingeniero agrónomo · Paisajismo Soto' },
];

// =====================================================================
// Header with sitemap dropdowns
// =====================================================================
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);

  return (
    <header className="site">
      <div className="container nav">
        <a href="#inicio" className="brand" aria-label="Sugarma · Inicio" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Sugarma</span>
        </a>

        <nav className="nav-links" aria-label="Navegación principal">
          {NAV.map(item => (
            <div className="nav-item has-dd" key={item.label}>
              <a href={item.href}>
                {item.label}
                <svg className="caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </a>
              <div className="dropdown">
                {item.children.map(c => (
                  <a key={c.href} href={c.href}>{c.label}</a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="nav-cta">
          <a href="#area-privada" className="btn btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Área privada
          </a>
          <a href="#contacto" className="btn btn-primary">Solicitar presupuesto <span className="arr">→</span></a>
          <button className="menu-toggle" aria-label="Menú" onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {NAV.map(item => (
          <div className="m-group" key={item.label}>
            <button className="m-head" onClick={() => setOpenSub(openSub === item.label ? null : item.label)}>
              {item.label}
              <span className={`m-caret ${openSub === item.label ? 'on' : ''}`}>+</span>
            </button>
            <div className={`m-sub ${openSub === item.label ? 'open' : ''}`}>
              {item.children.map(c => (
                <a key={c.href} href={c.href} onClick={() => setMobileOpen(false)}>{c.label}</a>
              ))}
            </div>
          </div>
        ))}
        <div className="m-actions">
          <a href="#area-privada" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Área privada</a>
          <a href="#contacto" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Solicitar presupuesto</a>
        </div>
      </div>
    </header>
  );
}

function Notice() {
  return (
    <div className="notice">
      <div className="container">
        <div className="left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <span><strong>Distribuidor mayorista B2B</strong> · Almacenamiento, logística y distribución agrícola.</span>
        </div>
        <a href="#contacto" className="hide-sm">¿Eres profesional? Solicita alta de cuenta →</a>
      </div>
    </div>
  );
}

// =====================================================================
// Hero
// =====================================================================
function Hero({ variant }) {
  const meta = (
    <div className="hero-meta">
      <div>
        <div className="num"><M note="fundación por confirmar">+38 años</M></div>
        <div className="lbl">Distribuyendo desde 1987</div>
      </div>
      <div>
        <div className="num"><M note="m² por confirmar">3.200 m²</M></div>
        <div className="lbl">Almacén en Aranjuez</div>
      </div>
      <div>
        <div className="num"><M note="dato por confirmar">+850</M></div>
        <div className="lbl">Clientes profesionales activos</div>
      </div>
    </div>
  );

  const inner = (
    <div>
      <span className="eyebrow">Aranjuez · Madrid · Desde 1987</span>
      <h1>Almacenamiento, logística y <em>distribución agrícola</em></h1>
      <p className="hero-sub">
        Distribuidor mayorista de semilla y producto agrícola en Aranjuez. Servicio integral para profesionales: almacenamiento, transporte, gestión de incidencias y suministro a fincas especiales. Distribuidor aliado de <strong>Pioneer</strong>.
      </p>
      <div className="hero-ctas">
        <a href="#contacto" className={variant === 'fullbleed' ? 'btn btn-amber' : 'btn btn-primary'}>Solicitar presupuesto <span className="arr">→</span></a>
        <a href="#servicios" className="btn btn-secondary" style={variant === 'fullbleed' ? { background: 'rgba(255,255,255,.1)', color: 'var(--bg)', borderColor: 'rgba(255,255,255,.3)' } : {}}>Ver servicios</a>
      </div>
      {meta}
    </div>
  );

  return (
    <section className="hero" data-variant={variant} id="inicio">
      {variant === 'fullbleed' ? (
        <div className="hero-bleed">
          <img src="assets/almacen-exterior.webp" alt="Almacén Sugarma en Aranjuez" />
          <div className="container">
            <div className="hero-grid reveal">{inner}</div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="hero-grid">
            <div className="reveal">{inner}</div>
            {variant !== 'editorial' && (
              <div className="hero-image reveal">
                <img src="assets/almacen-interior.webp" alt="Interior del almacén Sugarma con palets de semilla y camión de carga" />
                <div className="hero-stamp">Almacén · Aranjuez (Madrid)</div>
                <div className="hero-badge">Mayorista<span className="yr">B2B</span>desde 1987</div>
              </div>
            )}
          </div>
          {variant === 'editorial' && (
            <div className="hero-image reveal" style={{ marginTop: 56 }}>
              <img src="assets/almacen-interior.webp" alt="Interior del almacén Sugarma" />
              <div className="hero-badge">Mayorista<span className="yr">B2B</span>desde 1987</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// =====================================================================
// Quiénes somos — intro + Misión y valores + Historia y equipo
// =====================================================================
function Quienes() {
  return (
    <section className="quienes" id="quienes">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow amber">Quiénes somos</span>
            <h2 style={{ marginTop: 16 }}>Surtiendo de semilla y servicio a la huerta de Aranjuez desde 1987.</h2>
          </div>
          <p>Nacimos como almacén de distribución para los agricultores de la vega del Tajo. Hoy somos un operador integral de semilla y logística agrícola para el cliente profesional del centro peninsular.</p>
        </div>

        {/* Misión y valores */}
        <div id="mision" className="anchor"></div>
        <div className="mision-band reveal">
          <div className="mision-statement">
            <span className="eyebrow">Misión y valores</span>
            <p className="mision-quote">
              "Distribuimos semilla y servicio, pero lo que vendemos es certeza: que lo que pides sea exactamente lo que llega a tu campo, a tiempo."
            </p>
          </div>
          <div className="values">
            {VALUES.map(v => (
              <div className="value" key={v.n}>
                <h4><span className="num">{v.n}</span> {v.t}</h4>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Historia y equipo */}
        <div id="historia" className="anchor"></div>
        <div className="historia reveal">
          <div className="historia-head">
            <span className="eyebrow">Historia y equipo</span>
            <h3>Una trayectoria de cuatro décadas</h3>
            <p>Equipo pequeño y estable, con conocimiento técnico de cada variedad y de cada finca de la zona. <M note="fechas y datos por confirmar">Las fechas y los hitos están pendientes de confirmar con datos oficiales.</M></p>
          </div>
          <ol className="timeline">
            {HISTORIA.map((h, i) => (
              <li key={i} className={h.confirm ? 'tl-item confirm' : 'tl-item'}>
                <div className="tl-year">{h.year}</div>
                <div className="tl-body">
                  <h4>{h.title}{h.confirm && <i className="tl-flag">por confirmar</i>}</h4>
                  <p>{h.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Alianza Pioneer + certificación ISO band
// =====================================================================
function Alianza() {
  return (
    <section className="alianza" id="alianza">
      <div className="container">
        <div className="alianza-grid reveal">
          <div className="alianza-main">
            <span className="eyebrow">Alianza estratégica</span>
            <h2>Distribuidor aliado de <span className="pioneer-word">Pioneer</span></h2>
            <p>
              Colaboramos con la multinacional de semillas para acercar su catálogo de variedades al agricultor profesional de nuestra zona, sumando su I+D a nuestra capacidad de almacenamiento y reparto.
            </p>
            <div className="alianza-facts">
              <div className="fact">
                <div className="fact-num"><M note="año por confirmar">20XX</M></div>
                <div className="fact-lbl">Inicio de la colaboración</div>
              </div>
              <div className="fact">
                <div className="fact-num"><M note="alcance por confirmar">Centro peninsular</M></div>
                <div className="fact-lbl">Zona de distribución acordada</div>
              </div>
              <div className="fact">
                <div className="fact-num"><M note="nº variedades por confirmar">+XX</M></div>
                <div className="fact-lbl">Variedades Pioneer en catálogo</div>
              </div>
            </div>
            <p className="alianza-note">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              Datos, fechas y alcance del acuerdo pendientes de confirmar con documentación oficial.
            </p>
          </div>

          <div className="alianza-badges">
            <div className="badge-card pioneer-card">
              <div className="logo-slot">
                <span className="logo-text">PIONEER</span>
                <span className="logo-tag">[logo oficial · por confirmar]</span>
              </div>
              <p>Multinacional de semillas · partner de distribución</p>
            </div>
            <div className="badge-card iso-card">
              <div className="iso-seal">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div>
                <strong>Certificación ISO <M note="norma y nº por confirmar">9001 / 14001</M></strong>
                <p>Sistema de gestión de calidad y medioambiente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Servicios
// =====================================================================
function Servicios() {
  return (
    <section className="servicios" id="servicios">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">Servicios</span>
            <h2 style={{ marginTop: 16 }}>Un operador integral, no solo un proveedor de semilla</h2>
          </div>
          <p>Cubrimos toda la cadena: del almacén acondicionado a la entrega en campo, con protocolo de incidencias y atención a fincas con requisitos especiales.</p>
        </div>

        <div className="serv-grid">
          {SERVICIOS.map((s, i) => (
            <article id={s.id} key={s.id} className="serv-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="serv-icon">{s.icon}</div>
              <h3>{s.label}</h3>
              <p className="serv-desc">{s.desc}</p>
              <ul className="serv-points">
                {s.points.map(p => (
                  <li key={p}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                    {p}
                  </li>
                ))}
              </ul>
              <a href="#contacto" className="serv-link">Consultar este servicio <span className="arr">→</span></a>
            </article>
          ))}
        </div>

        {/* Cobertura */}
        <div className="cobertura reveal">
          <div className="map-wrap">
            <SpainMap />
            <div className="map-legend">
              <span><span className="dot" style={{ background: 'var(--amber)' }}></span>Sede · Aranjuez</span>
              <span><span className="dot" style={{ background: 'var(--green)' }}></span>Provincias servidas regularmente</span>
              <span><span className="dot" style={{ background: 'var(--line-2)' }}></span>Resto península · bajo consulta</span>
            </div>
          </div>
          <div className="cobertura-text">
            <span className="eyebrow amber">Zona de cobertura</span>
            <h3>Centro peninsular y Levante</h3>
            <p>Servicio regular en Madrid, Castilla–La Mancha, Extremadura y Comunidad Valenciana. Entregas paletizadas en 24–72 h dentro de zona; para envíos puntuales fuera de cobertura, consultar plazo y portes.</p>
            <a href="#contacto" className="btn btn-primary">¿Servís mi provincia? <span className="arr">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpainMap() {
  const pins = [
    { x: 240, y: 160, label: 'Madrid', main: true },
    { x: 195, y: 175, label: 'Toledo' },
    { x: 290, y: 185, label: 'Cuenca' },
    { x: 220, y: 215, label: 'Ciudad Real' },
    { x: 270, y: 130, label: 'Guadalajara' },
    { x: 165, y: 130, label: 'Ávila' },
    { x: 195, y: 105, label: 'Segovia' },
    { x: 320, y: 145, label: 'Teruel' },
    { x: 155, y: 175, label: 'Cáceres' },
    { x: 165, y: 220, label: 'Badajoz' },
    { x: 320, y: 220, label: 'Albacete' },
    { x: 360, y: 175, label: 'Valencia' },
  ];
  return (
    <svg viewBox="0 0 480 360" role="img" aria-label="Mapa de zona de cobertura en España">
      <defs>
        <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".7" fill="var(--line-2)" />
        </pattern>
      </defs>
      <path d="M50,140 C60,110 90,90 130,80 L170,60 C220,55 260,55 300,60 L340,75 C380,80 410,100 425,130 L430,170 C425,200 410,225 395,245 L375,265 C355,275 330,280 305,278 L275,275 C245,278 215,278 185,275 L155,272 C125,275 100,265 80,245 L65,215 C55,190 48,165 50,140 Z" fill="url(#dots)" stroke="var(--line-2)" strokeWidth="1" />
      <circle cx="240" cy="160" r="140" fill="var(--green)" opacity="0.06" />
      <circle cx="240" cy="160" r="100" fill="var(--green)" opacity="0.10" />
      <circle cx="240" cy="160" r="60" fill="var(--green)" opacity="0.16" />
      {pins.map(p => (
        <g key={p.label} transform={`translate(${p.x}, ${p.y})`}>
          <circle r={p.main ? 10 : 5} fill={p.main ? 'var(--amber)' : 'var(--green)'} stroke="var(--bg)" strokeWidth="2" />
          {p.main && <circle r="20" fill="none" stroke="var(--amber)" strokeWidth="1" opacity=".5" />}
          <text x="10" y="4" fontSize="10" fill="var(--ink-2)" fontWeight="500">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// =====================================================================
// Casos de éxito
// =====================================================================
function Casos() {
  return (
    <section className="casos" id="casos">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">Casos de éxito</span>
            <h2 style={{ marginTop: 16 }}>Resultados medibles en operativa real</h2>
          </div>
          <p>Casos representativos del tipo de problema que resolvemos. <M note="métricas reales por aportar">Las cifras son ejemplos a sustituir por datos reales y verificables.</M></p>
        </div>
        <div className="casos-grid">
          {CASOS.map((c, i) => (
            <article id={c.id} key={c.id} className="caso-card reveal" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="caso-tag">{c.tag}</span>
              <div className="caso-metric"><M note="dato real por aportar">{c.metric}</M></div>
              <div className="caso-metric-lbl">{c.metricLabel}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <a href="#contacto" className="caso-link">Ver cómo lo hacemos <span className="arr">→</span></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Testimonios
// =====================================================================
function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">Quienes confían</span>
            <h2 style={{ marginTop: 16 }}>Profesionales que repiten campaña tras campaña.</h2>
          </div>
          <p>Cooperativas, viveros, ayuntamientos y estudios de paisajismo cuya operativa depende de que todo llegue a tiempo y como se pidió. <M note="testimonios reales por recopilar">Testimonios de ejemplo.</M></p>
        </div>
        <div className="test-grid">
          {TESTIMONIALS.map((t, i) => (
            <figure className="test reveal" key={t.who} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="mark">"</div>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <div className="avatar">{t.who.split(' ').map(s => s[0]).slice(0, 2).join('')}</div>
                <div>
                  <div className="who">{t.who}</div>
                  <div className="role">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Soporte — FAQs + Seguimiento de pedidos + Área privada
// =====================================================================
function Soporte() {
  const [open, setOpen] = useState(0);
  const [tracking, setTracking] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  const doTrack = (e) => {
    e.preventDefault();
    if (tracking.trim()) setTrackResult(tracking.trim().toUpperCase());
  };

  return (
    <section className="soporte" id="soporte">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow amber">Soporte</span>
            <h2 style={{ marginTop: 16 }}>Resolvemos antes, durante y después del pedido</h2>
          </div>
          <p>Preguntas técnicas frecuentes, seguimiento de tu pedido y acceso a tu área privada de cliente.</p>
        </div>

        <div className="soporte-grid">
          {/* FAQs */}
          <div id="faqs" className="faq reveal">
            <h3 className="block-title">FAQs técnicas</h3>
            <div className="faq-list">
              {FAQS.map((f, i) => (
                <div className={`faq-item ${open === i ? 'open' : ''}`} key={i}>
                  <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                    <span>{f.q}</span>
                    <span className="faq-icon" aria-hidden="true"></span>
                  </button>
                  <div className="faq-a"><div className="faq-a-inner"><p>{f.a}</p></div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="soporte-side">
            {/* Seguimiento de pedidos */}
            <div id="seguimiento" className="side-card reveal">
              <div className="side-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="14" height="11" rx="1"/><path d="M15 9h4l3 4v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
              </div>
              <h4>Seguimiento de pedidos</h4>
              <p>Introduce tu número de albarán o pedido para consultar el estado de la entrega.</p>
              <form className="track-form" onSubmit={doTrack}>
                <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Ej. SUG-2026-0148" aria-label="Número de pedido" />
                <button type="submit" className="btn btn-primary">Consultar</button>
              </form>
              {trackResult && (
                <div className="track-result">
                  <div className="track-row"><span className="track-dot done"></span> Pedido <strong>{trackResult}</strong> recibido</div>
                  <div className="track-row"><span className="track-dot done"></span> En preparación en almacén</div>
                  <div className="track-row"><span className="track-dot now"></span> En reparto · entrega estimada <M note="demo">24–48 h</M></div>
                  <p className="track-note">Vista de demostración. Conectar con el sistema real de pedidos.</p>
                </div>
              )}
            </div>

            {/* Área privada */}
            <div id="area-privada" className="side-card area-card reveal">
              <div className="side-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h4>Área privada de clientes</h4>
              <p>Consulta histórico de pedidos, descarga facturas y certificados de lote, y repite compras habituales.</p>
              <div className="area-actions">
                <a href="#" className="btn btn-primary">Acceder</a>
                <a href="#contacto" className="btn btn-secondary">Solicitar acceso</a>
              </div>
              <p className="area-note">Funcionalidad de cliente · pendiente de implementar.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Contacto (Formulario de contacto)
// =====================================================================
function Contact() {
  const [form, setForm] = useState({ empresa: '', cif: '', persona: '', email: '', telefono: '', tipo: '', mensaje: '', acepta: false });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.empresa.trim()) e.empresa = 'Indica el nombre de la empresa';
    if (!form.cif.trim()) e.cif = 'CIF requerido';
    if (!form.persona.trim()) e.persona = 'Persona de contacto requerida';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email no válido';
    if (!form.tipo) e.tipo = 'Selecciona el tipo de cliente';
    if (!form.acepta) e.acepta = 'Debes aceptar la política de privacidad';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = (ev) => { ev.preventDefault(); if (validate()) setSent(true); };

  return (
    <section className="contact" id="contacto">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">Formulario de contacto</span>
            <h2 style={{ marginTop: 16 }}>Solicita presupuesto o alta de cuenta profesional.</h2>
          </div>
          <p>Respondemos en menos de 24 h laborables. Si es urgente, llámanos o escríbenos por WhatsApp Business.</p>
        </div>

        <div className="contact-grid">
          <div className="reveal">
            <div className="info-card">
              <h3>Almacén · Aranjuez (Madrid)</h3>
              <div className="info-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="3"/></svg>
                <div>
                  <div className="lbl">Dirección</div>
                  <div className="val"><M note="dirección exacta por confirmar">Polígono Industrial · 28300 Aranjuez, Madrid</M></div>
                </div>
              </div>
              <div className="info-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
                <div>
                  <div className="lbl">Teléfono</div>
                  <div className="val"><M note="teléfono real por confirmar"><a href="tel:+34918000000">918 000 000</a></M></div>
                </div>
              </div>
              <div className="info-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
                <div>
                  <div className="lbl">Email</div>
                  <div className="val"><M note="email real por confirmar"><a href="mailto:pedidos@sugarma.es">pedidos@sugarma.es</a></M></div>
                </div>
              </div>
              <div className="info-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/></svg>
                <div>
                  <div className="lbl">Horario</div>
                  <div className="val">L–V · 8:00–14:00 / 16:00–19:00</div>
                </div>
              </div>
              <a className="whatsapp-btn" href="https://wa.me/34600000000" target="_blank" rel="noopener">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.9-2.1-.2-.5-.5-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 .6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3ZM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Z"/></svg>
                Escribir por WhatsApp Business
              </a>
            </div>
            <div className="map-embed" aria-label="Mapa: Aranjuez, Madrid">
              <div className="pin">
                <div className="pin-mark">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z"/><circle cx="12" cy="9" r="3"/></svg>
                </div>
                <div className="pin-label">[mapa: Google Maps · Aranjuez, Madrid]</div>
              </div>
            </div>
          </div>

          <form className="form reveal" onSubmit={submit} noValidate>
            {sent ? (
              <div className="form-success">
                <h4>Solicitud enviada</h4>
                <p>Hemos recibido tu mensaje. Un técnico se pondrá en contacto en menos de 24 h laborables.</p>
              </div>
            ) : (
              <React.Fragment>
                <h3>Solicitud de presupuesto</h3>
                <p className="hint">Solo profesionales (B2B). Para alta de cuenta acreditaremos los datos fiscales.</p>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="f-empresa">Empresa <span className="req">*</span></label>
                    <input id="f-empresa" type="text" value={form.empresa} onChange={e => set('empresa', e.target.value)} className={errors.empresa ? 'error' : ''} placeholder="Cooperativa, vivero, ayuntamiento..." />
                    {errors.empresa && <div className="err-msg">{errors.empresa}</div>}
                  </div>
                  <div className="field">
                    <label htmlFor="f-cif">CIF <span className="req">*</span></label>
                    <input id="f-cif" type="text" value={form.cif} onChange={e => set('cif', e.target.value)} className={errors.cif ? 'error' : ''} placeholder="B12345678" />
                    {errors.cif && <div className="err-msg">{errors.cif}</div>}
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="f-persona">Persona de contacto <span className="req">*</span></label>
                    <input id="f-persona" type="text" value={form.persona} onChange={e => set('persona', e.target.value)} className={errors.persona ? 'error' : ''} />
                    {errors.persona && <div className="err-msg">{errors.persona}</div>}
                  </div>
                  <div className="field">
                    <label htmlFor="f-tel">Teléfono</label>
                    <input id="f-tel" type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+34 ..." />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="f-email">Email <span className="req">*</span></label>
                    <input id="f-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} className={errors.email ? 'error' : ''} />
                    {errors.email && <div className="err-msg">{errors.email}</div>}
                  </div>
                  <div className="field">
                    <label htmlFor="f-tipo">Tipo de cliente <span className="req">*</span></label>
                    <select id="f-tipo" value={form.tipo} onChange={e => set('tipo', e.target.value)} className={errors.tipo ? 'error' : ''}>
                      <option value="">Selecciona…</option>
                      <option value="cooperativa">Cooperativa agrícola</option>
                      <option value="vivero">Vivero / Garden center</option>
                      <option value="agricultor">Agricultor profesional</option>
                      <option value="ayuntamiento">Ayuntamiento / Administración</option>
                      <option value="paisajismo">Paisajismo / Jardinería</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.tipo && <div className="err-msg">{errors.tipo}</div>}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="f-msg">Mensaje</label>
                  <textarea id="f-msg" value={form.mensaje} onChange={e => set('mensaje', e.target.value)} placeholder="Servicio o producto de interés, cantidad estimada, fecha de necesidad..." />
                </div>
                <div className="field" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 0 }}>
                  <input id="f-acepta" type="checkbox" style={{ width: 18, height: 18, marginTop: 3 }} checked={form.acepta} onChange={e => set('acepta', e.target.checked)} />
                  <label htmlFor="f-acepta" style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>
                    He leído y acepto la <a href="#" style={{ color: 'var(--green)', textDecoration: 'underline' }}>política de privacidad</a>. Mis datos se usarán únicamente para responder a esta solicitud.
                  </label>
                </div>
                {errors.acepta && <div className="err-msg" style={{ marginTop: 6 }}>{errors.acepta}</div>}
                <div className="submit-row">
                  <p className="legal">Solo profesionales (B2B). No atendemos pedidos a particulares.</p>
                  <button type="submit" className="btn btn-primary">Enviar solicitud <span className="arr">→</span></button>
                </div>
              </React.Fragment>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site">
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="brand">
              <span className="brand-mark">S</span>
              <span>Sugarma</span>
            </div>
            <p>Almacenamiento, logística y distribución agrícola en Aranjuez. Distribuidor mayorista B2B y aliado de Pioneer, sirviendo a profesionales del centro peninsular desde 1987.</p>
            <div className="socials" style={{ marginTop: 18 }}>
              <a href="#" aria-label="LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.3 18.3H5.7V9.7h2.6v8.6Zm-1.3-9.8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm11.3 9.8h-2.6v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H10V9.7h2.5v1.2c.4-.7 1.3-1.4 2.6-1.4 2.8 0 3.3 1.8 3.3 4.2v4.6Z"/></svg></a>
              <a href="#" aria-label="Instagram"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
            </div>
          </div>
          <div>
            <h4>Quiénes somos</h4>
            <ul>
              <li><a href="#mision">Misión y valores</a></li>
              <li><a href="#historia">Historia y equipo</a></li>
              <li><a href="#alianza">Alianza Pioneer</a></li>
            </ul>
          </div>
          <div>
            <h4>Servicios</h4>
            <ul>
              <li><a href="#almacenamiento">Almacenamiento</a></li>
              <li><a href="#logistica">Logística y transporte</a></li>
              <li><a href="#incidencias">Gestión de incidencias</a></li>
              <li><a href="#fincas">Fincas especiales</a></li>
            </ul>
          </div>
          <div>
            <h4>Soporte</h4>
            <ul>
              <li><a href="#faqs">FAQs técnicas</a></li>
              <li><a href="#contacto">Formulario de contacto</a></li>
              <li><a href="#seguimiento">Seguimiento de pedidos</a></li>
              <li><a href="#area-privada">Área privada de clientes</a></li>
            </ul>
          </div>
        </div>
        <div className="legal-row">
          <div>
            <a href="#">Aviso legal</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Política de cookies</a>
          </div>
          <div>© 2026 Sugarma · Datos fiscales y razón social por confirmar.</div>
        </div>
      </div>
    </footer>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('sugarma_cookies')) setTimeout(() => setShow(true), 800);
  }, []);
  const close = (mode) => { localStorage.setItem('sugarma_cookies', mode); setShow(false); };
  return (
    <div className={`cookies ${show ? 'show' : ''}`} role="dialog" aria-label="Aviso de cookies">
      <h4>Usamos cookies</h4>
      <p>Utilizamos cookies propias y de terceros para mejorar la navegación y analizar el tráfico. Más en nuestra <a href="#" style={{ color: 'var(--green)', textDecoration: 'underline' }}>Política de cookies</a>.</p>
      <div className="actions">
        <button className="btn btn-primary" onClick={() => close('all')}>Aceptar todas</button>
        <button className="btn btn-secondary" onClick={() => close('essential')}>Solo esenciales</button>
        <button className="btn btn-secondary" onClick={() => close('config')}>Configurar</button>
      </div>
    </div>
  );
}

// =====================================================================
// Tweaks
// =====================================================================
function TweaksPanelLocal({ tweaks, setTweak }) {
  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;
  if (!TweaksPanel) return null;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Paleta">
        <TweakRadio value={tweaks.palette} onChange={(v) => setTweak('palette', v)}
          options={[{ value: 'tierra', label: 'Tierra' }, { value: 'oliva', label: 'Oliva' }, { value: 'profundo', label: 'Profundo' }]} />
      </TweakSection>
      <TweakSection label="Tipografía display">
        <TweakRadio value={tweaks.display} onChange={(v) => setTweak('display', v)}
          options={[{ value: 'sans', label: 'Sans (Inter)' }, { value: 'serif', label: 'Serif (Fraunces)' }]} />
      </TweakSection>
      <TweakSection label="Variante de Hero">
        <TweakRadio value={tweaks.heroVariant} onChange={(v) => setTweak('heroVariant', v)}
          options={[{ value: 'split', label: 'Split' }, { value: 'fullbleed', label: 'Full-bleed' }, { value: 'editorial', label: 'Editorial' }]} />
      </TweakSection>
      <TweakSection label="Datos por confirmar">
        <TweakToggle value={tweaks.markers} onChange={(v) => setTweak('markers', v)} label="Resaltar lo pendiente" />
      </TweakSection>
    </TweaksPanel>
  );
}

// =====================================================================
// Reveal on scroll
// =====================================================================
function useReveal() {
  useEffect(() => {
    // Reveal anything in (or above) the viewport. Notes:
    //  - We avoid requestAnimationFrame: preview iframes pause rAF (and CSS
    //    transitions) when not the visible tab, which would freeze entrances.
    //  - React re-renders (tweaks settling) reset className="reveal" and strip
    //    our .in class, so we re-run on DOM mutations and over several passes.
    //  - A final hard pass reveals EVERYTHING so content is never stuck hidden.
    const revealInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll('.reveal:not(.in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -40) el.classList.add('in');
      });
    };
    const revealAll = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
    };

    revealInView();
    const timers = [60, 200, 450, 800].map(t => setTimeout(revealInView, t));
    // Hard failsafe — never leave content hidden, even if transitions are paused.
    timers.push(setTimeout(revealAll, 1600));

    const mo = new MutationObserver(revealInView);
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', revealInView, { passive: true });
    window.addEventListener('resize', revealInView);
    window.addEventListener('load', revealInView);
    document.addEventListener('visibilitychange', revealInView);

    return () => {
      window.removeEventListener('scroll', revealInView);
      window.removeEventListener('resize', revealInView);
      window.removeEventListener('load', revealInView);
      document.removeEventListener('visibilitychange', revealInView);
      mo.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);
}

// =====================================================================
// App root
// =====================================================================
function App() {
  const useTweaks = window.useTweaks;
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS__);

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', tweaks.palette);
    document.documentElement.setAttribute('data-display', tweaks.display);
    document.documentElement.setAttribute('data-markers', tweaks.markers ? 'on' : 'off');
  }, [tweaks.palette, tweaks.display, tweaks.markers]);

  useReveal();

  return (
    <React.Fragment>
      <Notice />
      <Header />
      <main>
        <Hero variant={tweaks.heroVariant} />
        <Quienes />
        <Alianza />
        <Servicios />
        <Casos />
        <Testimonials />
        <Soporte />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
      <TweaksPanelLocal tweaks={tweaks} setTweak={setTweak} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
