(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);

  const story = $('.story');
  const scene = $('.scene');
  const hero = $('.hero');
  const grid = $('.incl-grid');
  const ana = $('.ana');
  const car = $('.car');
  const home = $('.car-home');
  const dock = $('.car-dock');
  const six = $('.six');
  const sil = $('.six-sil');
  const glyph = $('.six-glyph');
  const gooBlur = $('#goo feGaussianBlur');
  const leads = $('.leads');
  const label = $('.readout-label');
  const pct = $('.readout-pct');
  const count = $('.count b');
  const cards = [...document.querySelectorAll('.card')];
  const stats = [...document.querySelectorAll('.stat')];
  const rev = $('.rev');
  const revCount = $('.rev-count b');
  const quotes = [...document.querySelectorAll('.quote')];
  const cov = $('.cov');
  const feats = [...document.querySelectorAll('.feat')];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 1000px)');
  const SVG = 'http://www.w3.org/2000/svg';

  const clamp = (v) => Math.min(1, Math.max(0, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (t) => t * t * (3 - 2 * t);

  // Guion de la historia. Los números son "pantallas de scroll": 1 = una altura de ventana.
  //  1) hero → 2) qué incluye: el texto sube, el auto se escanea y viaja, salen las tarjetas
  //  3) análisis: la segunda pantalla se va, el auto se funde de vuelta en la silueta (back),
  //     la silueta se transforma en el 6
  //     y las tarjetas de números entran una al lado de la otra
  //  4) reseñas: la tercera pantalla se va (leave3) y las reseñas se apilan de a una
  //  5) cobertura: las reseñas se van (leave4), el mapa se escanea de norte a sur (map)
  //     y las ubicaciones caen a medida que pasa la línea
  const WIDE = {
    scan: [0.09, 2.2], out: [0.05, 0.55], move: [0.18, 1.5], head: [0.62, 1.32], hood: [2.2, 2.73],
    cards: 1.32, slot: 0.374, dur: 0.53,
    leave: [4.5, 5], back: [4.5, 5], move2: [4.7, 5.3], morph: [5.3, 5.65], ana: [5.6, 6.2],
    stats: 6.2, sslot: 0.4, sdur: 0.5,
    leave3: [8.2, 8.7], rev: [8.35, 8.85], revs: 8.7, rslot: 0.6, rdur: 0.5, cta: [12.1, 12.5],
    leave4: [13, 13.5], cov: [13.2, 13.7], map: [13.6, 15.6], feats: 14.1, fslot: 0.5, fdur: 0.45, badge: [15.6, 16], end: 16.6,
  };
  const NARROW = {
    scan: [0.2, 4], out: [0.05, 0.6], move: [0.3, 1.8], head: [0.5, 1.5], hood: [4, 4.8],
    cards: 2.2, slot: 1.05, dur: 0.45,
    leave: [9.6, 10], back: [9.6, 10], move2: [9.8, 10.4], morph: [10.4, 10.75], ana: [10.7, 11.3],
    stats: 11.3, sslot: 0.45, sdur: 0.5,
    leave3: [13.4, 13.9], rev: [13.55, 14.05], revs: 13.9, rslot: 0.6, rdur: 0.5, cta: [17.3, 17.7],
    leave4: [18.2, 18.7], cov: [18.4, 18.9], map: [18.8, 20.6], feats: 19.2, fslot: 0.9, fdur: 0.4, badge: [20.6, 21], end: 22,
  };
  const script = () => (wide.matches ? WIDE : NARROW);

  let mode = '';
  let geo = { dx: 0, dy: 0, s: 1, dx2: 0, dy2: 0, s2: 1, r: 0.3, k: 1 };
  let intro = false;
  let queued = false;

  root.classList.add('js');

  // Al recargar, la página siempre vuelve al inicio (el navegador no restaura el scroll)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo({ top: 0, behavior: 'instant' });
  addEventListener('pageshow', (e) => {
    if (e.persisted) scrollTo({ top: 0, behavior: 'instant' });
  });

  // Cada tarjeta tiene su línea guía y su punto de anclaje sobre el auto
  const links = cards.map((card) => {
    const path = document.createElementNS(SVG, 'path');
    const dot = document.createElementNS(SVG, 'circle');
    dot.setAttribute('r', 4);
    leads.append(path, dot);
    const [ax, ay] = card.dataset.anchor.split(',').map(Number);
    return { card, path, dot, ax, ay, top: card.dataset.side === 'top', len: 0 };
  });

  function setMode() {
    const next = reduce.matches ? 'static' : 'story';
    if (next !== mode) {
      mode = next;
      root.dataset.mode = mode;
      if (mode === 'static') {
        story.style.height = '';
        [car, hero, grid, ana, rev, cov, sil, glyph].forEach((el) => { el.style.transform = ''; el.style.opacity = ''; });
        six.style.filter = '';
        scene.classList.remove('is-incl');
        ['--scan', '--hood', '--beam', '--out', '--head', '--leave', '--m2', '--ana', '--back', '--sil-clip', '--sil-o', '--leave3', '--rev', '--cta', '--leave4', '--cov', '--ms', '--mbeam', '--badge'].forEach((v) => scene.style.removeProperty(v));
        cards.forEach((c) => ['--t', '--o', '--exit'].forEach((v) => c.style.removeProperty(v)));
        stats.forEach((c) => c.style.removeProperty('--s'));
        quotes.forEach((c) => ['--q', '--d'].forEach((v) => c.style.removeProperty(v)));
        scene.classList.remove('is-rev');
        feats.forEach((c) => ['--f', '--fo'].forEach((v) => c.style.removeProperty(v)));
      }
    }
    measure();
  }

  // Achica un bloque lo justo para que entre en la escena cuando la pantalla es baja
  function fit(el) {
    el.style.transform = '';
    const k = Math.min(1, el.clientHeight / el.scrollHeight);
    if (k < 1) el.style.transform = `scale(${k})`;
    return k;
  }

  function measure() {
    if (mode !== 'story' || intro) return;

    story.style.height = `${(script().end + 1) * 100}vh`;
    root.classList.add('measuring');
    car.style.transform = '';
    const kHero = fit(hero);
    const kGrid = fit(grid);
    fit(ana);
    fit(rev);
    fit(cov);

    const sr = scene.getBoundingClientRect();
    const h = home.getBoundingClientRect();
    const d = dock.getBoundingClientRect();
    const c2 = sil.getBoundingClientRect();
    geo = {
      dx: (d.left - h.left) / kHero, dy: (d.top - h.top) / kHero, s: d.width / h.width,
      dx2: (c2.left - h.left) / kHero, dy2: (c2.top - h.top) / kHero, s2: c2.width / h.width,
      r: glyph.getBoundingClientRect().width / c2.width,
      k: kHero,
    };
    leads.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);

    links.forEach((l) => {
      const c = l.card.getBoundingClientRect();
      const ex = d.left - sr.left + l.ax * d.width;
      const ey = d.top - sr.top + l.ay * d.height;
      const cx = c.left - sr.left + c.width / 2;
      const cy = c.top - sr.top + c.height / 2;
      let from;
      if (l.top || !wide.matches) {
        from = `M${cx} ${c.top - sr.top}`;
      } else {
        const right = cx < ex;
        const sx = right ? c.right - sr.left : c.left - sr.left;
        from = `M${sx} ${cy}H${sx + (right ? 16 : -16)}`;
      }
      l.path.setAttribute('d', `${from}L${ex} ${ey}`);
      l.len = l.path.getTotalLength();
      l.path.style.strokeDasharray = l.len;
      l.dot.setAttribute('cx', ex);
      l.dot.setAttribute('cy', ey);
      l.card.style.setProperty('--fx', `${((ex - cx) * 0.55) / kGrid}px`);
      l.card.style.setProperty('--fy', `${((ey - cy) * 0.55) / kGrid}px`);
    });

    root.classList.remove('measuring');
    update();
  }

  function update() {
    queued = false;
    if (mode !== 'story') return;

    const T = script();
    const narrow = !wide.matches;
    const v = clamp(-story.getBoundingClientRect().top / (story.offsetHeight - scene.offsetHeight)) * T.end;

    const scan = ease(seg(v, ...T.scan));
    const hood = seg(v, ...T.hood);
    const back = seg(v, ...T.back);
    const move = ease(seg(v, ...T.move));
    const move2 = ease(seg(v, ...T.move2));
    const head = ease(seg(v, ...T.head));
    const leave = seg(v, ...T.leave);
    const morph = seg(v, ...T.morph);

    markNav(v, T);
    scene.style.setProperty('--scan', scan.toFixed(4));
    scene.style.setProperty('--hood', hood.toFixed(4));
    // al volver, el auto se desvanece sobre la silueta completa (sin re-escanear)
    scene.style.setProperty('--back', back.toFixed(4));
    scene.style.setProperty('--sil-clip', back > 0 ? 0 : scan.toFixed(4));
    scene.style.setProperty('--sil-o', back > 0 ? back.toFixed(4) : 1);
    scene.style.setProperty('--beam', scan > 0 && scan < 1 ? Math.min(1, Math.sin(scan * Math.PI) * 4).toFixed(3) : 0);
    scene.style.setProperty('--out', seg(v, ...T.out).toFixed(4));
    scene.style.setProperty('--head', head.toFixed(4));
    scene.style.setProperty('--leave', leave.toFixed(4));
    scene.style.setProperty('--m2', move2.toFixed(4));
    scene.style.setProperty('--ana', seg(v, ...T.ana).toFixed(4));
    scene.classList.toggle('is-incl', head > 0.5 && leave < 0.5);
    label.textContent = scan <= 0.005 ? 'Deslizá para iniciar el escaneo' : scan < 1 ? 'Escaneando vehículo' : 'Escaneo completo';
    pct.textContent = `${Math.round(scan * 100)} %`;

    // El auto va de su lugar en el hero al centro de la segunda pantalla y después al lugar del 6
    const x = geo.dx * move * (1 - move2) + geo.dx2 * move2;
    const y = geo.dy * move * (1 - move2) + geo.dy2 * move2;
    const s = (1 + (geo.s - 1) * move) * (1 - move2) + geo.s2 * move2;
    car.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;

    // Silueta → 6: la silueta se comprime mientras el número se forma, fundidos con el filtro "goo"
    const m = ease(morph);
    const g0 = 0.7 / geo.r;
    car.style.opacity = morph > 0 ? 0 : 1;
    sil.style.opacity = morph > 0 ? 1 - m : 0;
    sil.style.transform = `translateY(-50%) scaleX(${1 + (geo.r - 1) * m})`;
    glyph.style.opacity = m;
    glyph.style.transform = `scaleX(${g0 + (1 - g0) * m})`;
    six.style.filter = morph > 0 && morph < 1 ? 'url(#goo)' : '';
    gooBlur.setAttribute('stdDeviation', (Math.sin(Math.PI * morph) * 9).toFixed(2));

    // Primero se dibuja la línea desde el auto, después llega la tarjeta.
    // En pantallas angostas cada tarjeta le deja el lugar a la siguiente.
    let shown = 0;
    links.forEach((l, i) => {
      const a = T.cards + i * T.slot;
      const raw = seg(v, a, a + T.dur);
      const exit = narrow && i < links.length - 1 ? seg(v, a + T.slot, a + T.slot * 1.35) : 0;
      const line = seg(raw, 0, 0.6);
      const t = ease(seg(raw, 0.3, 1));
      if (raw > 0) shown = i + 1;
      l.path.style.strokeDashoffset = l.len * (1 - line);
      l.path.style.opacity = line > 0 ? 1 - exit : 0;
      l.dot.style.opacity = seg(raw, 0, 0.15) * (1 - exit);
      l.card.style.setProperty('--t', t.toFixed(4));
      l.card.style.setProperty('--o', (t * (1 - exit)).toFixed(4));
      l.card.style.setProperty('--exit', `${(exit * 40).toFixed(1)}px`);
    });
    count.textContent = String(Math.max(1, shown)).padStart(2, '0');

    stats.forEach((el, i) => {
      const a = T.stats + i * T.sslot;
      el.style.setProperty('--s', ease(seg(v, a, a + T.sdur)).toFixed(4));
    });

    // Reseñas: cada tarjeta cae sobre la pila y empuja hacia atrás a las anteriores
    const revIn = ease(seg(v, ...T.rev));
    scene.style.setProperty('--leave3', seg(v, ...T.leave3).toFixed(4));
    scene.style.setProperty('--rev', revIn.toFixed(4));
    scene.style.setProperty('--cta', ease(seg(v, ...T.cta)).toFixed(4));
    const leave4 = seg(v, ...T.leave4);
    scene.classList.toggle('is-rev', revIn > 0.5 && leave4 < 0.5);
    let current = 1;
    const enters = quotes.map((el, i) => {
      const a = T.revs + i * T.rslot;
      return ease(seg(v, a, a + T.rdur));
    });
    let above = 0;
    for (let i = quotes.length - 1; i >= 0; i--) {
      if (enters[i] > 0.5 && current === 1) current = i + 1;
      quotes[i].style.setProperty('--q', enters[i].toFixed(4));
      quotes[i].style.setProperty('--d', above.toFixed(4));
      above += enters[i];
    }
    revCount.textContent = String(current).padStart(2, '0');

    // Cobertura: la línea baja por el mapa; los pines se calculan en CSS a partir de --ms
    const ms = seg(v, ...T.map);
    scene.style.setProperty('--leave4', leave4.toFixed(4));
    scene.style.setProperty('--cov', ease(seg(v, ...T.cov)).toFixed(4));
    scene.style.setProperty('--ms', ms.toFixed(4));
    scene.style.setProperty('--mbeam', ms > 0 && ms < 1 ? Math.min(1, Math.sin(ms * Math.PI) * 5).toFixed(3) : 0);
    scene.style.setProperty('--badge', ease(seg(v, ...T.badge)).toFixed(4));
    feats.forEach((el, i) => {
      const a = T.feats + i * T.fslot;
      const exit = narrow && i < feats.length - 1 ? seg(v, a + T.fslot - 0.12, a + T.fslot + 0.12) : 0;
      el.style.setProperty('--f', ease(seg(v, a, a + T.fdur)).toFixed(4));
      el.style.setProperty('--fo', (1 - exit).toFixed(4));
    });
  }

  function onScroll() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }

  // Las secciones viven dentro de la escena: cada link del menú lleva al punto del
  // recorrido donde esa pantalla ya está completa
  const stops = {
    inicio: () => 0,
    incluye: (T) => (wide.matches ? T.cards + (links.length - 1) * T.slot + T.dur : T.cards + T.dur),
    analisis: (T) => T.stats + (stats.length - 1) * T.sslot + T.sdur,
    resenas: (T) => T.revs + T.rdur,
    cobertura: (T) => T.badge[1],
  };
  const menu = $('.nav-links');
  const toggle = $('.nav-toggle');
  const navLinks = [...menu.querySelectorAll('a')];

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(menu.classList.toggle('open')));
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) {
      if (!e.target.closest('.nav')) closeMenu();
      return;
    }
    closeMenu();
    const stop = stops[a.hash.slice(1)];
    if (!stop || mode !== 'story') return;
    e.preventDefault();
    const T = script();
    scrollTo({ top: story.offsetTop + (story.offsetHeight - scene.offsetHeight) * (stop(T) / T.end) });
  });

  // marca en el menú la pantalla que se está viendo
  function markNav(v, T) {
    const starts = [0, T.head[0], T.leave[0], T.leave3[0], T.leave4[0]];
    let at = 0;
    starts.forEach((s, i) => { if (v >= s) at = i; });
    navLinks.forEach((a, i) => (i === at ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  }

  // Entrada: primero aparece sola la silueta en el centro, después se corre
  // a su lugar y entra el resto de la primera pantalla
  function playIntro() {
    if (mode !== 'story' || scrollY > 10 || location.hash) return;
    intro = true;
    const stage = $('.hero-car');
    const sr = scene.getBoundingClientRect();
    const h = home.getBoundingClientRect();
    const dx = sr.left + sr.width / 2 - (h.left + h.width / 2);
    const dy = sr.top + sr.height / 2 - (h.top + h.height / 2);
    const k = Math.max(1, Math.min(1.3, (sr.width * 0.84) / h.width));
    stage.style.transform = `translate(${dx / geo.k}px, ${dy / geo.k}px) scale(${k})`;
    root.classList.add('intro');

    const img = $('.car-silueta');
    const ready = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    Promise.race([ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      requestAnimationFrame(() => root.classList.add('intro-draw'));
      setTimeout(() => {
        root.classList.add('intro-out');
        root.classList.remove('intro');
        stage.style.transform = '';
      }, 750);
      setTimeout(() => {
        root.classList.remove('intro-out', 'intro-draw');
        intro = false;
        measure();
      }, 1900);
    });
  }

  addEventListener('scroll', onScroll, { passive: true });
  // En el celular la barra del navegador dispara "resize" al scrollear: sólo se vuelve
  // a medir si de verdad cambió el ancho o el alto de la escena
  let lastW = 0;
  let lastH = 0;
  addEventListener('resize', () => {
    const w = innerWidth;
    const h = scene.offsetHeight;
    if (w === lastW && h === lastH) return;
    lastW = w;
    lastH = h;
    setMode();
  });
  addEventListener('load', measure);
  reduce.addEventListener('change', setMode);
  if (document.fonts) document.fonts.ready.then(measure);

  setMode();
  playIntro();
})();
