/* ═══════════════════════════════════════════════
   PORTAFOLIO SPA — script.js
   Corregido y completo
═══════════════════════════════════════════════ */
(function () {
  'use strict';
  
  /* ──────────────────────────────
     CONSTANTES
  ────────────────────────────── */
  const ADMIN_EMAIL = 'admin@gmail.com';
  const ADMIN_PASS  = '123456';
  const STORE_KEY   = 'carpeta1_v3';
  
  const WORKS = {
    u1_t01:{unit:'1',work:'01',week:'Semana 1', label:'Arquitectura Relacional'},
    u1_t02:{unit:'1',work:'02',week:'Semana 2', label:'Modelo EER'},
    u1_t03:{unit:'1',work:'03',week:'Semana 3', label:'Álgebra Relacional'},
    u1_t04:{unit:'1',work:'04',week:'Semana 4', label:'SQL Avanzado'},
    u2_t05:{unit:'2',work:'05',week:'Semana 5', label:'Procedimientos Almacenados'},
    u2_t06:{unit:'2',work:'06',week:'Semana 6', label:'Triggers'},
    u2_t07:{unit:'2',work:'07',week:'Semana 7', label:'Funciones de Usuario'},
    u2_t08:{unit:'2',work:'08',week:'Semana 8', label:'Vistas e Índices'},
    u3_t09:{unit:'3',work:'09',week:'Semana 9', label:'Control de Concurrencia'},
    u3_t10:{unit:'3',work:'10',week:'Semana 10',label:'Seguridad y Roles'},
    u3_t11:{unit:'3',work:'11',week:'Semana 11',label:'Backup y Recuperación'},
    u3_t12:{unit:'3',work:'12',week:'Semana 12',label:'Replicación de Datos'},
    u4_t13:{unit:'4',work:'13',week:'Semana 13',label:'Bases de Datos NoSQL'},
    u4_t14:{unit:'4',work:'14',week:'Semana 14',label:'Data Warehouse'},
    u4_t15:{unit:'4',work:'15',week:'Semana 15',label:'Minería de Datos'},
    u4_t16:{unit:'4',work:'16',week:'Semana 16',label:'Sistema Integral'},
  };
  
  const UNIT_KEYS = {
    '1':['u1_t01','u1_t02','u1_t03','u1_t04'],
    '2':['u2_t05','u2_t06','u2_t07','u2_t08'],
    '3':['u3_t09','u3_t10','u3_t11','u3_t12'],
    '4':['u4_t13','u4_t14','u4_t15','u4_t16'],
  };
  
  /* ──────────────────────────────
     STORAGE
  ────────────────────────────── */
  function getStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
    catch { return {}; }
  }
  function setStore(d) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {}
  }
  
  /* ──────────────────────────────
     HELPERS
  ────────────────────────────── */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }
  
  // AÑO FOOTER
  const footerYr = qs('#footerYear');
  if (footerYr) footerYr.textContent = new Date().getFullYear();
  
  /* ──────────────────────────────
     TOAST GLOBAL
  ────────────────────────────── */
  const globalToast = qs('#globalToast');
  let toastTimer = null;
  function showToast(msg, type = 'success', duration = 3000) {
    if (!globalToast) return;
    if (toastTimer) clearTimeout(toastTimer);
    const icons = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info' };
    globalToast.className = `global-toast show ${type}`;
    globalToast.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}"></i> ${msg}`;
    toastTimer = setTimeout(() => { globalToast.className = 'global-toast'; }, duration);
  }
  
  /* ──────────────────────────────
     RIPPLE EFFECT
  ────────────────────────────── */
  document.addEventListener('click', function(e) {
    const el = e.target.closest('.ripple');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    el.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  });
  
  /* ──────────────────────────────
     PARTÍCULAS CANVAS
  ────────────────────────────── */
  (function initParticles() {
    const canvas = qs('#particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
  
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
  
    const COLORS = ['rgba(99,102,241,', 'rgba(168,85,247,', 'rgba(6,182,212,'];
  
    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.05,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }
  
    for (let i = 0; i < 80; i++) particles.push(createParticle());
  
    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();
  
  /* ──────────────────────────────
     ESTADO
  ────────────────────────────── */
  let currentView = 'inicio';
  let isLoggedIn  = false;
  
  /* ──────────────────────────────
     SPA ROUTER
  ────────────────────────────── */
  function goTo(view) {
    const target = qs('#view-' + view);
    if (!target) return;
  
    // Ocultar todas las vistas
    qsa('.view').forEach(v => v.classList.remove('active'));
    target.classList.add('active');
  
    // Navbar activo
    qsa('.nav-btn[data-view]').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });
  
    // Footer: ocultar en admin panel
    const footer = qs('#siteFooter');
    if (footer) footer.style.display = (view === 'login' && isLoggedIn) ? 'none' : '';
  
    // Si es login y ya está logueado → mostrar admin directamente
    if (view === 'login' && isLoggedIn) {
      showAdminPanel();
    }
  
    // Revelar cards animadas en vistas de unidad
    if (['u1','u2','u3','u4'].includes(view)) {
      setTimeout(() => {
        revealCards(qsa('.wcard', target));
        refreshBadges();
      }, 50);
    }
  
    // Cerrar drawer mobile
    closeMobileDrawer();
  
    currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /* ──────────────────────────────
     DELEGACIÓN: [data-view]
  ────────────────────────────── */
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-view]');
    if (!btn) return;
    // Ignorar si está dentro del dropdown deshabilitado
    if (btn.id === 'unidadesBtn') return;
    goTo(btn.dataset.view);
  });
  
  /* ──────────────────────────────
     NAVBAR SCROLL
  ────────────────────────────── */
  const navbar = qs('#navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  
  /* ──────────────────────────────
     DROPDOWN UNIDADES
  ────────────────────────────── */
  const unidadesBtn   = qs('#unidadesBtn');
  const dropdownPanel = qs('#dropdownPanel');
  const navDropdown   = qs('#navDropdown');
  
  if (unidadesBtn && dropdownPanel) {
    unidadesBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = dropdownPanel.classList.contains('open');
      dropdownPanel.classList.toggle('open', !isOpen);
      navDropdown && navDropdown.classList.toggle('open', !isOpen);
    });
    document.addEventListener('click', function(e) {
      if (!navDropdown || !navDropdown.contains(e.target)) {
        dropdownPanel.classList.remove('open');
        navDropdown && navDropdown.classList.remove('open');
      }
    });
  }
  
  /* ──────────────────────────────
     HAMBURGER / MOBILE DRAWER
  ────────────────────────────── */
  const hamburger      = qs('#hamburger');
  const mobileDrawer   = qs('#mobileDrawer');
  const drawerBackdrop = qs('#drawerBackdrop');
  const mdClose        = qs('#mdClose');
  
  function openMobileDrawer() {
    hamburger && hamburger.classList.add('open');
    mobileDrawer && mobileDrawer.classList.add('open');
    drawerBackdrop && drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileDrawer() {
    hamburger && hamburger.classList.remove('open');
    mobileDrawer && mobileDrawer.classList.remove('open');
    drawerBackdrop && drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (hamburger) hamburger.addEventListener('click', openMobileDrawer);
  if (mdClose)   mdClose.addEventListener('click', closeMobileDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);
  
  /* ──────────────────────────────
     CARDS REVEAL
  ────────────────────────────── */
  function revealCards(cards) {
    cards.forEach((c, i) => {
      c.classList.remove('vis');
      setTimeout(() => c.classList.add('vis'), 60 + i * 90);
    });
  }
  
  /* ──────────────────────────────
     BADGES (tarjetas con PDF)
  ────────────────────────────── */
  function refreshBadges() {
    const store = getStore();
    qsa('.wcard[data-key]').forEach(c => {
      c.classList.toggle('has-pdf', !!store[c.dataset.key]);
    });
  }
  refreshBadges();
  
  /* ──────────────────────────────
     CONTADOR ANIMADO (hero card)
  ────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const isYear = target > 100;
    const duration = isYear ? 800 : 600;
    const start = performance.now();
    const from  = isYear ? 2020 : 0;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(from + (target - from) * ease);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  
  /* ──────────────────────────────
     ACCORDION ACTIVIDADES
  ────────────────────────────── */
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.acts-btn');
    if (!btn) return;
    const card = btn.closest('.wcard');
    const drop = btn.nextElementSibling;
    if (!drop) return;
    const isOpen = drop.classList.contains('open');
  
    // Cerrar otros en la misma card
    card.querySelectorAll('.acts-drop.open').forEach(d => d.classList.remove('open'));
    card.querySelectorAll('.acts-btn.open').forEach(b => b.classList.remove('open'));
  
    if (!isOpen) {
      drop.classList.add('open');
      btn.classList.add('open');
      // Insertar wrapper interior si no existe
      if (!drop.querySelector('.acts-drop-inner')) {
        const inner = document.createElement('div');
        inner.className = 'acts-drop-inner';
        while (drop.firstChild) inner.appendChild(drop.firstChild);
        drop.appendChild(inner);
      }
    }
  });
  
  /* ──────────────────────────────
     PDF MODAL
  ────────────────────────────── */
  const pdfModal = qs('#pdfModal');
  const pmClose  = qs('#pmClose');
  const pmInner  = qs('#pmInner');
  
  function openPdfModal(key) {
    const card  = qs(`.wcard[data-key="${key}"]`);
    const title = card ? card.dataset.title : key;
    const desc  = card ? card.dataset.desc  : '';
    const meta  = WORKS[key] || {};
    const store = getStore();
    const entry = store[key];
  
    const gradMap = { '1':'var(--g1)', '2':'var(--g2)', '3':'var(--g3)', '4':'var(--g4)' };
    const g = gradMap[meta.unit] || 'var(--g1)';
  
    let body;
    if (entry && entry.data) {
      body = `<iframe class="pm-frame" src="${entry.data}" title="${title}"></iframe>`;
    } else {
      body = `<div class="pm-empty">
        <i class="fa-solid fa-file-circle-question"></i>
        <p>Sin PDF cargado aún</p>
        <small>El administrador puede subirlo desde <strong>Ingresar → Subir PDF</strong></small>
      </div>`;
    }
  
    pmInner.innerHTML = `
      <div class="pm-head">
        <span class="pm-badge" style="background:${g}">Unidad ${meta.unit||'?'} · ${meta.week||''}</span>
        <h3>${title}</h3>
        <p>${desc}</p>
      </div>
      ${body}`;
  
    pdfModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closePdfModal() {
    pdfModal.classList.remove('open');
    document.body.style.overflow = '';
    if (pmInner) pmInner.innerHTML = '';
  }
  
  if (pmClose) pmClose.addEventListener('click', closePdfModal);
  if (pdfModal) pdfModal.addEventListener('click', e => { if (e.target === pdfModal) closePdfModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePdfModal(); });
  
  // Vista Previa buttons
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-preview');
    if (!btn) return;
    openPdfModal(btn.dataset.key);
  });
  
  // Descargar buttons
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-download');
    if (!btn) return;
    const key   = btn.dataset.key;
    const store = getStore();
    const entry = store[key];
    if (entry && entry.data) {
      const a = document.createElement('a');
      a.href = entry.data;
      a.download = entry.name || key + '.pdf';
      a.click();
      showToast('Descargando ' + (entry.name || key + '.pdf'), 'success');
    } else {
      showToast('Este trabajo aún no tiene PDF cargado.', 'error');
    }
  });
  
  /* ──────────────────────────────
     LOGIN
  ────────────────────────────── */
  const loginScreen = qs('#loginScreen');
  const adminScreen = qs('#adminScreen');
  const loginForm   = qs('#loginForm');
  const loginEmail  = qs('#loginEmail');
  const loginPass   = qs('#loginPass');
  const errEmail    = qs('#errEmail');
  const errPass     = qs('#errPass');
  const loginSubmit = qs('#loginSubmit');
  const loginBtnTxt = qs('#loginBtnText');
  const loginBtnIco = qs('#loginBtnIcon');
  const loginFeedback = qs('#loginFeedback');
  const eyeBtn      = qs('#eyeBtn');
  const eyeIco      = qs('#eyeIco');
  const emailCheck  = qs('#emailCheck');
  
  // Toggle password visibility
  if (eyeBtn) {
    eyeBtn.addEventListener('click', function() {
      const show = loginPass.type === 'password';
      loginPass.type = show ? 'text' : 'password';
      eyeIco.className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    });
  }
  
  // Real-time email validation
  if (loginEmail) {
    loginEmail.addEventListener('input', function() {
      loginEmail.classList.remove('err');
      if (errEmail) errEmail.textContent = '';
      const val = loginEmail.value.trim();
      if (val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        loginEmail.classList.add('ok');
        if (emailCheck) emailCheck.innerHTML = '<i class="fa-solid fa-check" style="color:#10b981;font-size:.75rem"></i>';
      } else {
        loginEmail.classList.remove('ok');
        if (emailCheck) emailCheck.innerHTML = '';
      }
    });
  }
  if (loginPass) {
    loginPass.addEventListener('input', function() {
      loginPass.classList.remove('err');
      if (errPass) errPass.textContent = '';
    });
  }
  
  // Submit
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      // Reset errors
      if (loginFeedback) { loginFeedback.className = 'lf-feedback'; }
      loginEmail && loginEmail.classList.remove('err');
      loginPass  && loginPass.classList.remove('err');
      if (errEmail) errEmail.textContent = '';
      if (errPass)  errPass.textContent  = '';
  
      const emailVal = loginEmail ? loginEmail.value.trim() : '';
      const passVal  = loginPass  ? loginPass.value : '';
      let valid = true;
  
      if (!emailVal) {
        loginEmail && loginEmail.classList.add('err');
        if (errEmail) errEmail.textContent = 'El correo es obligatorio.';
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        loginEmail && loginEmail.classList.add('err');
        if (errEmail) errEmail.textContent = 'Ingresa un correo válido.';
        valid = false;
      }
  
      if (!passVal) {
        loginPass && loginPass.classList.add('err');
        if (errPass) errPass.textContent = 'La contraseña es obligatoria.';
        valid = false;
      }
  
      if (!valid) return;
  
      // Mostrar estado de carga
      if (loginSubmit) loginSubmit.disabled = true;
      if (loginBtnTxt) loginBtnTxt.textContent = 'Verificando...';
      if (loginBtnIco) loginBtnIco.className = 'fa-solid fa-spinner fa-spin';
  
      setTimeout(function() {
        if (loginSubmit) loginSubmit.disabled = false;
        if (loginBtnIco) loginBtnIco.className = 'fa-solid fa-arrow-right-to-bracket';
  
        if (emailVal === ADMIN_EMAIL && passVal === ADMIN_PASS) {
          // LOGIN EXITOSO
          if (loginBtnTxt) loginBtnTxt.textContent = '¡Acceso concedido!';
          if (loginFeedback) {
            loginFeedback.className = 'lf-feedback ok';
            loginFeedback.textContent = '✓ Bienvenido, administrador. Cargando panel...';
          }
          isLoggedIn = true;
          setTimeout(function() {
            if (loginBtnTxt) loginBtnTxt.textContent = 'Entrar al Panel';
            loginForm.reset();
            if (emailCheck) emailCheck.innerHTML = '';
            loginEmail && loginEmail.classList.remove('ok');
            showAdminPanel();
          }, 900);
        } else {
          // CREDENCIALES INCORRECTAS
          if (loginBtnTxt) loginBtnTxt.textContent = 'Entrar al Panel';
          if (loginFeedback) {
            loginFeedback.className = 'lf-feedback bad';
            loginFeedback.textContent = '✗ Credenciales incorrectas. Verifica e intenta de nuevo.';
          }
          loginPass && loginPass.classList.add('err');
          if (loginPass) loginPass.value = '';
          showToast('Credenciales incorrectas', 'error');
        }
      }, 1400);
    });
  }
  
  /* ──────────────────────────────
     PANEL ADMIN: mostrar / ocultar
  ────────────────────────────── */
  function showAdminPanel() {
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminScreen) adminScreen.style.display = 'flex';
    const footer = qs('#siteFooter');
    if (footer) footer.style.display = 'none';
    // Asegurar que la view-login esté activa
    qsa('.view').forEach(v => v.classList.remove('active'));
    const vl = qs('#view-login');
    if (vl) vl.classList.add('active');
    switchAdminPanel('upload');
    renderSidebarCount();
    renderUgBars();
  }
  
  function hideAdminPanel() {
    isLoggedIn = false;
    if (loginScreen) loginScreen.style.display = '';
    if (adminScreen) { adminScreen.style.display = 'none'; }
    if (loginFeedback) { loginFeedback.className = 'lf-feedback'; }
    loginForm && loginForm.reset();
    loginEmail && loginEmail.classList.remove('ok', 'err');
    if (emailCheck) emailCheck.innerHTML = '';
    const footer = qs('#siteFooter');
    if (footer) footer.style.display = '';
    goTo('inicio');
    showToast('Sesión cerrada correctamente', 'info');
  }
  
  const adminLogout = qs('#adminLogout');
  if (adminLogout) adminLogout.addEventListener('click', hideAdminPanel);
  
  /* ──────────────────────────────
     ADMIN: NAVEGACIÓN PANELS
  ────────────────────────────── */
  function switchAdminPanel(id) {
    qsa('.adm-panel').forEach(p => p.classList.remove('active'));
    qsa('.adm-nav-btn').forEach(b => b.classList.remove('active'));
    const panel = qs('#panel-' + id);
    const navBtn = qs(`.adm-nav-btn[data-panel="${id}"]`);
    if (panel) panel.classList.add('active');
    if (navBtn) navBtn.classList.add('active');
    if (id === 'files')    renderFilesPanel();
    if (id === 'overview') renderOverviewPanel();
  }
  
  qsa('.adm-nav-btn[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => switchAdminPanel(btn.dataset.panel));
  });
  
  /* ──────────────────────────────
     UPLOAD — ESTADO DEL FLUJO
  ────────────────────────────── */
  let uploadState = { unit: null, key: null, file: null, fileData: null };
  
  const stepUnit    = qs('#step-unit');
  const stepWeek    = qs('#step-week');
  const stepFile    = qs('#step-file');
  const stepConfirm = qs('#step-confirm');
  const weekGrid    = qs('#weekGrid');
  const selectedInfo = qs('#selectedInfo');
  const dropArea    = qs('#dropArea');
  const daContent   = qs('#daContent');
  const fileInput   = qs('#fileInput');
  const confirmBox  = qs('#confirmBox');
  const uploadToast = qs('#uploadToast');
  const btnSave     = qs('#btnSave');
  const apBreadcrumb = qs('#apBreadcrumb');
  
  function setBreadcrumb(active) {
    if (!apBreadcrumb) return;
    qsa('.apb-item', apBreadcrumb).forEach(item => {
      const s = parseInt(item.dataset.step);
      item.classList.remove('active', 'done');
      if (s === active) item.classList.add('active');
      else if (s < active) item.classList.add('done');
    });
  }
  
  function showStep(name) {
    [stepUnit, stepWeek, stepFile, stepConfirm].forEach(s => s && s.classList.add('hidden'));
    const steps = { unit: stepUnit, week: stepWeek, file: stepFile, confirm: stepConfirm };
    const stepNums = { unit: 1, week: 2, file: 3, confirm: 4 };
    if (steps[name]) steps[name].classList.remove('hidden');
    setBreadcrumb(stepNums[name] || 1);
  }
  
  // STEP 1: elegir unidad
  qsa('.ug-card[data-unit]').forEach(btn => {
    btn.addEventListener('click', function() {
      qsa('.ug-card').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      uploadState.unit = btn.dataset.unit;
      uploadState.key  = null;
      uploadState.file = null;
      uploadState.fileData = null;
      buildWeekGrid(uploadState.unit);
      showStep('week');
    });
  });
  
  // Construir grid de semanas
  function buildWeekGrid(unitId) {
    if (!weekGrid) return;
    const store = getStore();
    const keys  = UNIT_KEYS[unitId] || [];
    weekGrid.innerHTML = keys.map(key => {
      const w = WORKS[key];
      const hasPdf = !!store[key];
      return `<button class="wg-btn${hasPdf ? ' has-pdf' : ''}" data-key="${key}">
        ${hasPdf ? '<span class="wg-pdf-tag">PDF ✓</span>' : ''}
        <div class="wg-work">${w.work}</div>
        <div class="wg-name">${w.label}</div>
        <div class="wg-week">${w.week}</div>
      </button>`;
    }).join('');
  
    weekGrid.querySelectorAll('.wg-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        weekGrid.querySelectorAll('.wg-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        uploadState.key  = btn.dataset.key;
        uploadState.file = null;
        uploadState.fileData = null;
        resetDropZone();
        // Mostrar info
        const w = WORKS[uploadState.key];
        if (selectedInfo) {
          selectedInfo.innerHTML = `<i class="fa-solid fa-circle-info"></i>
            Unidad ${w.unit} · ${w.week} · <strong>${w.label}</strong>`;
        }
        showStep('file');
      });
    });
  }
  
  // Back buttons
  qs('#backUnit') && qs('#backUnit').addEventListener('click', () => showStep('unit'));
  qs('#backWeek') && qs('#backWeek').addEventListener('click', () => showStep('week'));
  qs('#backFile') && qs('#backFile').addEventListener('click', () => showStep('file'));
  qs('#cancelUpload') && qs('#cancelUpload').addEventListener('click', () => {
    resetUpload();
    showStep('unit');
  });
  
  // STEP 3: DROP ZONE
  function resetDropZone() {
    if (!daContent) return;
    daContent.innerHTML = `
      <div class="da-icon"><i class="fa-solid fa-file-arrow-up"></i></div>
      <p class="da-title">Arrastra tu PDF aquí</p>
      <p class="da-sub">o <span class="da-link">haz clic para explorar</span></p>
      <p class="da-hint">Solo archivos .pdf</p>`;
    dropArea && dropArea.classList.remove('file-ok', 'dragging');
    if (fileInput) fileInput.value = '';
  }
  
  function handleFile(file) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Solo se permiten archivos PDF.', 'error');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('El archivo supera los 20 MB recomendados.', 'error');
      return;
    }
    uploadState.file = file;
    const reader = new FileReader();
    reader.onload = function(ev) {
      uploadState.fileData = ev.target.result;
      // Actualizar drop zone
      if (daContent) {
        daContent.innerHTML = `
          <div class="da-icon"><i class="fa-solid fa-file-pdf"></i></div>
          <p class="da-title">${file.name}</p>
          <p class="da-sub" style="color:#6ee7b7"><i class="fa-solid fa-circle-check"></i> ${(file.size/1024).toFixed(1)} KB · PDF listo</p>`;
      }
      dropArea && dropArea.classList.add('file-ok');
      // Avanzar automáticamente
      setTimeout(() => {
        buildConfirmBox();
        showStep('confirm');
      }, 550);
    };
    reader.readAsDataURL(file);
  }
  
  if (fileInput) fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });
  
  if (dropArea) {
    dropArea.addEventListener('dragover',  e => { e.preventDefault(); dropArea.classList.add('dragging'); });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragging'));
    dropArea.addEventListener('drop', e => {
      e.preventDefault();
      dropArea.classList.remove('dragging');
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
  }
  
  // STEP 4: CONFIRMAR
  function buildConfirmBox() {
    if (!confirmBox || !uploadState.key || !uploadState.file) return;
    if (uploadToast) { uploadToast.className = 'upload-toast'; }
    const w = WORKS[uploadState.key];
    const gradMap = { '1':'var(--g1)', '2':'var(--g2)', '3':'var(--g3)', '4':'var(--g4)' };
    const gStyle  = gradMap[w.unit] || 'var(--g1)';
    confirmBox.innerHTML = `
      <div class="cb-row">
        <span class="cb-label">Destino</span>
        <span class="cb-val"><i class="fa-solid fa-folder" style="color:#fcd34d;margin-right:.3rem"></i> Carpeta 1</span>
      </div>
      <div class="cb-row">
        <span class="cb-label">Unidad</span>
        <span class="cb-val" style="background:${gStyle};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-family:'Syne',sans-serif;font-weight:800">Unidad ${w.unit}</span>
      </div>
      <div class="cb-row">
        <span class="cb-label">Semana</span>
        <span class="cb-val">${w.week}</span>
      </div>
      <div class="cb-row">
        <span class="cb-label">Trabajo</span>
        <span class="cb-val">${w.label}</span>
      </div>
      <div class="cb-file">
        <i class="fa-solid fa-file-pdf"></i>
        <div>
          <div class="cb-fname">${uploadState.file.name}</div>
          <div class="cb-fsize">${(uploadState.file.size / 1024).toFixed(1)} KB · PDF</div>
        </div>
      </div>`;
  }
  
  // GUARDAR
  if (btnSave) {
    btnSave.addEventListener('click', function() {
      if (!uploadState.key || !uploadState.fileData) {
        if (uploadToast) { uploadToast.className = 'upload-toast bad'; uploadToast.textContent = 'Faltan datos. Reinicia el proceso.'; }
        return;
      }
      btnSave.disabled = true;
      btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
  
      setTimeout(function() {
        const store = getStore();
        store[uploadState.key] = {
          name:     uploadState.file.name,
          data:     uploadState.fileData,
          size:     uploadState.file.size,
          uploaded: new Date().toLocaleString('es-PE'),
        };
        setStore(store);
  
        btnSave.disabled = false;
        btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar en Carpeta 1';
  
        if (uploadToast) {
          uploadToast.className = 'upload-toast ok';
          uploadToast.textContent = `✓ "${uploadState.file.name}" guardado en Carpeta 1`;
        }
        showToast('PDF guardado correctamente', 'success');
        renderSidebarCount();
        renderUgBars();
        refreshBadges();
  
        // Marcar tile de semana como subido
        const wg = qs(`.wg-btn[data-key="${uploadState.key}"]`);
        if (wg) { wg.classList.add('has-pdf'); if (!wg.querySelector('.wg-pdf-tag')) wg.insertAdjacentHTML('afterbegin', '<span class="wg-pdf-tag">PDF ✓</span>'); }
  
        // Reset después de 2 segundos
        setTimeout(function() {
          resetUpload();
          showStep('unit');
        }, 2000);
      }, 900);
    });
  }
  
  function resetUpload() {
    uploadState = { unit: null, key: null, file: null, fileData: null };
    resetDropZone();
    qsa('.ug-card').forEach(b => b.classList.remove('selected'));
    if (weekGrid) weekGrid.innerHTML = '';
    if (uploadToast) { uploadToast.className = 'upload-toast'; }
    if (confirmBox) confirmBox.innerHTML = '';
  }
  
  /* ──────────────────────────────
     SIDEBAR COUNT & UG BARS
  ────────────────────────────── */
  function renderSidebarCount() {
    const n = Object.keys(getStore()).length;
    const badge = qs('#sidebarCount');
    if (badge) badge.textContent = n;
    const fc = qs('#filesCount');
    if (fc) fc.textContent = n + ' archivo' + (n !== 1 ? 's' : '');
  }
  
  function renderUgBars() {
    const store = getStore();
    ['1','2','3','4'].forEach(uid => {
      const keys     = UNIT_KEYS[uid] || [];
      const uploaded = keys.filter(k => !!store[k]).length;
      const pct      = Math.round((uploaded / keys.length) * 100);
      const bar = qs('#upb-' + uid);
      if (bar) bar.style.setProperty('--pct', pct + '%');
      // Aplicar ancho via pseudo
      if (bar) bar.innerHTML = `<span style="display:block;height:100%;width:${pct}%;background:var(--g${uid});border-radius:2px;transition:width .6s"></span>`;
    });
  }
  
  /* ──────────────────────────────
     FILES PANEL
  ────────────────────────────── */
  function renderFilesPanel() {
    const list  = qs('#filesList');
    if (!list) return;
    renderSidebarCount();
    const store = getStore();
    const keys  = Object.keys(store);
    if (!keys.length) {
      list.innerHTML = `<div class="no-files">
        <i class="fa-solid fa-folder-open"></i>
        <p>Carpeta 1 está vacía</p>
        <small>Sube PDFs desde <strong>Subir PDF</strong></small>
      </div>`;
      return;
    }
    const badgeClass = { '1':'fc-b1', '2':'fc-b2', '3':'fc-b3', '4':'fc-b4' };
    list.innerHTML = keys.map(key => {
      const e = store[key];
      const w = WORKS[key] || {};
      const bc = badgeClass[w.unit] || 'fc-b1';
      return `<div class="fc">
        <i class="fa-solid fa-file-pdf fc-pdf-icon"></i>
        <span class="fc-badge ${bc}">U${w.unit||'?'} · ${w.week||key}</span>
        <div class="fc-name">${e.name}</div>
        <div class="fc-meta">${w.label||''}<br>${e.uploaded||''} · ${e.size ? (e.size/1024).toFixed(1)+' KB' : ''}</div>
        <div class="fc-actions">
          <button class="fc-view ripple" data-key="${key}"><i class="fa-solid fa-eye"></i> Ver PDF</button>
          <button class="fc-del  ripple" data-key="${key}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
    }).join('');
  
    list.querySelectorAll('.fc-view').forEach(btn => btn.addEventListener('click', () => openPdfModal(btn.dataset.key)));
    list.querySelectorAll('.fc-del').forEach(btn => btn.addEventListener('click', function() {
      const name = (store[btn.dataset.key] || {}).name || btn.dataset.key;
      if (!confirm(`¿Eliminar "${name}" de Carpeta 1?`)) return;
      const s2 = getStore();
      delete s2[btn.dataset.key];
      setStore(s2);
      showToast('Archivo eliminado', 'info');
      renderFilesPanel();
      renderSidebarCount();
      renderUgBars();
      refreshBadges();
    }));
  }
  
  /* ──────────────────────────────
     OVERVIEW PANEL
  ────────────────────────────── */
  function renderOverviewPanel() {
    const wrap = qs('#overviewWrap');
    if (!wrap) return;
    const store = getStore();
    const units = [
      { id:'1', name:'Fundamentos',    badge:'ov-b1', keys: UNIT_KEYS['1'] },
      { id:'2', name:'Diseño Avanzado',badge:'ov-b2', keys: UNIT_KEYS['2'] },
      { id:'3', name:'Implementación', badge:'ov-b3', keys: UNIT_KEYS['3'] },
      { id:'4', name:'Optimización',   badge:'ov-b4', keys: UNIT_KEYS['4'] },
    ];
  
    wrap.innerHTML = units.map(u => {
      const uploaded = u.keys.filter(k => !!store[k]).length;
      const pct      = Math.round((uploaded / u.keys.length) * 100);
      const rows = u.keys.map(k => {
        const w   = WORKS[k];
        const has = !!store[k];
        return `<div class="ov-row">
          <span class="ov-row-label">${w.week}</span>
          <div class="ov-bar-wrap"><div class="ov-bar-fill" style="width:${has?100:0}%"></div></div>
          <div class="ov-dot ${has?'yes':'no'}"></div>
        </div>`;
      }).join('');
      return `<div class="ov-card">
        <span class="ov-badge ${u.badge}">Unidad ${u.id}</span>
        <h4>${u.name}</h4>
        <p class="ov-progress-pct">${uploaded} / ${u.keys.length} PDFs subidos (${pct}%)</p>
        <div class="ov-rows">${rows}</div>
      </div>`;
    }).join('');
  }
  
  /* ──────────────────────────────
     ANIMACIÓN CONTADORES (hero)
  ────────────────────────────── */
  const heroSection = qs('#view-inicio');
  let countersRun = false;
  if (heroSection) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !countersRun) {
        countersRun = true;
        qsa('.pcs-num').forEach(el => animateCounter(el));
      }
    }, { threshold: 0.3 });
    obs.observe(heroSection);
  }
  
  /* ──────────────────────────────
     INIT
  ────────────────────────────── */
  goTo('inicio');
  // Revelar cards del inicio si hay alguna en vista
  setTimeout(() => revealCards(qsa('.wcard', qs('#view-inicio'))), 100);
  
  })();