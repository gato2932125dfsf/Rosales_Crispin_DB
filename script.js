/* ═══════════════════════════════════════════════
   PORTAFOLIO SPA — script.js  v4
   Multi-archivo por semana · Modal de archivos
═══════════════════════════════════════════════ */
(function () {
  'use strict';
  
  /* ────────────────────────────── CONSTANTES */
  const ADMIN_EMAIL  = 'admin@gmail.com';
  const ADMIN_PASS   = '123456';
  const STORE_KEY    = 'portafolio_v4';   // { weekKey: [ {name,data,size,type,folder,uploaded}, ... ] }
  
  const WORKS = {
    u1_t01:{unit:'1',work:'01',week:'Semana 1', label:'Arquitectura Relacional',       icon:'fa-database',   desc:'Introduccion a la Arquitectura de Base de Datos'},
    u1_t02:{unit:'1',work:'02',week:'Semana 2', label:'Gestores de Base de Datos',     icon:'fa-server',     desc:'Gestores De Base Datos.'},
    u1_t03:{unit:'1',work:'03',week:'Semana 3', label:'Diseño de Arquitectura BD',     icon:'fa-key',        desc:'Diseño De Arquitectura de Base de Datos.'},
    u1_t04:{unit:'1',work:'04',week:'Semana 4', label:'Consultas con INNER JOIN',      icon:'fa-link',       desc:'Consultas con INNER JOIN múltiples.'},
    u2_t05:{unit:'2',work:'05',week:'Semana 5', label:'Procedimientos Almacenados',    icon:'fa-chart-bar',  desc:'Stored procedures con lógica de negocio.'},
    u2_t06:{unit:'2',work:'06',week:'Semana 6', label:'Triggers y Automatización',     icon:'fa-search',     desc:'Disparadores para automatizar la BD.'},
    u2_t07:{unit:'2',work:'07',week:'Semana 7', label:'Funciones de Usuario',          icon:'fa-bolt',       desc:'UDFs escalares y de tabla.'},
    u2_t08:{unit:'2',work:'08',week:'Semana 8', label:'Exámenes Parciales BD2',        icon:'fa-graduation-cap', desc:'Semana de Exámenes Parciales de BD2.'},
    u3_t09:{unit:'3',work:'09',week:'Semana 9', label:'Control de Concurrencia',       icon:'fa-shield-halved',  desc:'Transacciones concurrentes y deadlocks.'},
    u3_t10:{unit:'3',work:'10',week:'Semana 10',label:'Seguridad y Roles',             icon:'fa-lock',       desc:'Gestión de privilegios y roles en PostgreSQL.'},
    u3_t11:{unit:'3',work:'11',week:'Semana 11',label:'Backup y Recuperación',         icon:'fa-hard-drive', desc:'Estrategias de respaldo y recuperación.'},
    u3_t12:{unit:'3',work:'12',week:'Semana 12',label:'Replicación de Datos',          icon:'fa-copy',       desc:'Replicación maestro-esclavo.'},
    u4_t13:{unit:'4',work:'13',week:'Semana 13',label:'Bases de Datos NoSQL',          icon:'fa-leaf',       desc:'MongoDB, Redis y Cassandra.'},
    u4_t14:{unit:'4',work:'14',week:'Semana 14',label:'Data Warehouse',                icon:'fa-warehouse',  desc:'Esquema estrella y cubos OLAP.'},
    u4_t15:{unit:'4',work:'15',week:'Semana 15',label:'Minería de Datos',              icon:'fa-magnifying-glass-chart', desc:'K-Means y Árbol de Decisión.'},
    u4_t16:{unit:'4',work:'16',week:'Semana 16',label:'Sistema Integral',              icon:'fa-cube',       desc:'Proyecto integrador final.'},
  };
  
  const UNIT_KEYS = {
    '1':['u1_t01','u1_t02','u1_t03','u1_t04'],
    '2':['u2_t05','u2_t06','u2_t07','u2_t08'],
    '3':['u3_t09','u3_t10','u3_t11','u3_t12'],
    '4':['u4_t13','u4_t14','u4_t15','u4_t16'],
  };
  
  /* ────────────────────────────── STORAGE MULTI-ARCHIVO
     Estructura: { weekKey: [ {name, data, size, type, folder, uploaded}, ... ] }
  */
  function getStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
    catch { return {}; }
  }
  function setStore(d) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch(e) {
      console.warn('Storage lleno:', e);
    }
  }
  function getWeekFiles(key)       { const s = getStore(); return s[key] || []; }
  function addFileToWeek(key, file){ const s = getStore(); if (!s[key]) s[key]=[]; s[key].push(file); setStore(s); }
  function delFileFromWeek(key, idx){ const s = getStore(); if (s[key]) { s[key].splice(idx,1); if (!s[key].length) delete s[key]; setStore(s); } }
  function totalFiles()            { const s=getStore(); return Object.values(s).reduce((a,arr)=>a+(arr?arr.length:0),0); }
  
  /* ────────────────────────────── HELPERS */
  function qs(sel,ctx)  { return (ctx||document).querySelector(sel);  }
  function qsa(sel,ctx) { return (ctx||document).querySelectorAll(sel);}
  
  // Año footer
  const footerYr = qs('#footerYear');
  if (footerYr) footerYr.textContent = new Date().getFullYear();
  
  /* ────────────────────────────── TOAST */
  const globalToast = qs('#globalToast');
  let toastTimer = null;
  function showToast(msg, type='success', ms=3200) {
    if (!globalToast) return;
    if (toastTimer) clearTimeout(toastTimer);
    const ico = {success:'fa-circle-check',error:'fa-circle-xmark',info:'fa-circle-info'};
    globalToast.className = `global-toast show ${type}`;
    globalToast.innerHTML = `<i class="fa-solid ${ico[type]||ico.info}"></i> ${msg}`;
    toastTimer = setTimeout(()=>{ globalToast.className='global-toast'; }, ms);
  }
  
  /* ────────────────────────────── RIPPLE */
  document.addEventListener('click', function(e){
    const el = e.target.closest('.ripple');
    if (!el) return;
    const r=el.getBoundingClientRect(), s=Math.max(r.width,r.height)*2;
    const wave=document.createElement('span');
    wave.className='ripple-wave';
    wave.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
    el.appendChild(wave);
    wave.addEventListener('animationend',()=>wave.remove());
  });
  
  /* ────────────────────────────── PARTÍCULAS */
  (function(){
    const canvas=qs('#particles'); if(!canvas)return;
    const ctx=canvas.getContext('2d'); let W,H;
    function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
    resize(); window.addEventListener('resize',resize);
    const COLS=['rgba(99,102,241,','rgba(168,85,247,','rgba(6,182,212,'];
    const pts=Array.from({length:80},()=>({
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      r:Math.random()*1.4+0.3, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      a:Math.random()*.35+.05, c:COLS[Math.floor(Math.random()*COLS.length)]
    }));
    (function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c+p.a+')'; ctx.fill();
      }); requestAnimationFrame(draw);
    })();
  })();
  
  /* ────────────────────────────── ESTADO SPA */
  let currentView='inicio', isLoggedIn=false;
  
  /* ────────────────────────────── ROUTER */
  function goTo(view){
    const target=qs('#view-'+view); if(!target)return;
    qsa('.view').forEach(v=>v.classList.remove('active'));
    target.classList.add('active');
    qsa('.nav-btn[data-view]').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
    const footer=qs('#siteFooter');
    if(footer) footer.style.display=(view==='login'&&isLoggedIn)?'none':'';
    if(view==='login'&&isLoggedIn){ showAdminPanel(); return; }
    if(['u1','u2','u3','u4'].includes(view)){
      setTimeout(()=>{ revealCards(qsa('.wcard',target)); refreshBadges(); },50);
    }
    closeMobileDrawer();
    currentView=view;
    window.scrollTo({top:0,behavior:'smooth'});
  }
  
  /* Delegación [data-view] */
  document.addEventListener('click', function(e){
    const btn=e.target.closest('[data-view]');
    if(!btn||btn.id==='unidadesBtn') return;
    // No navegar si el clic viene de dentro del modal de archivos
    if(btn.closest('#filesModal')) return;
    goTo(btn.dataset.view);
  });
  
  /* ────────────────────────────── NAVBAR SCROLL */
  const navbar=qs('#navbar');
  window.addEventListener('scroll',()=>navbar&&navbar.classList.toggle('scrolled',scrollY>50));
  
  /* ────────────────────────────── DROPDOWN UNIDADES */
  const unidadesBtn=qs('#unidadesBtn'), dropdownPanel=qs('#dropdownPanel'), navDropdown=qs('#navDropdown');
  if(unidadesBtn&&dropdownPanel){
    unidadesBtn.addEventListener('click',function(e){
      e.stopPropagation();
      const open=dropdownPanel.classList.contains('open');
      dropdownPanel.classList.toggle('open',!open);
      navDropdown&&navDropdown.classList.toggle('open',!open);
    });
    document.addEventListener('click',function(e){
      if(!navDropdown||!navDropdown.contains(e.target)){
        dropdownPanel.classList.remove('open');
        navDropdown&&navDropdown.classList.remove('open');
      }
    });
  }
  
  /* ────────────────────────────── HAMBURGER */
  const hamburger=qs('#hamburger'), mobileDrawer=qs('#mobileDrawer'),
        drawerBackdrop=qs('#drawerBackdrop'), mdClose=qs('#mdClose');
  function openMobileDrawer(){ hamburger&&hamburger.classList.add('open'); mobileDrawer&&mobileDrawer.classList.add('open'); drawerBackdrop&&drawerBackdrop.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeMobileDrawer(){ hamburger&&hamburger.classList.remove('open'); mobileDrawer&&mobileDrawer.classList.remove('open'); drawerBackdrop&&drawerBackdrop.classList.remove('open'); document.body.style.overflow=''; }
  if(hamburger) hamburger.addEventListener('click',openMobileDrawer);
  if(mdClose)   mdClose.addEventListener('click',closeMobileDrawer);
  if(drawerBackdrop) drawerBackdrop.addEventListener('click',closeMobileDrawer);
  
  /* ────────────────────────────── CARDS REVEAL */
  function revealCards(cards){ cards.forEach((c,i)=>{ c.classList.remove('vis'); setTimeout(()=>c.classList.add('vis'),60+i*90); }); }
  
  /* ────────────────────────────── BADGES semanas con archivos */
  function refreshBadges(){
    const store=getStore();
    qsa('.wcard[data-key]').forEach(c=>{
      const files=store[c.dataset.key]||[];
      c.classList.toggle('has-pdf', files.length>0);
      // Actualizar conteo en la card
      const cntEl=c.querySelector('.wc-file-count');
      if(cntEl) cntEl.textContent = files.length > 0 ? files.length+' archivo'+(files.length>1?'s':'') : '';
    });
  }
  refreshBadges();
  
  /* ────────────────────────────── CONTADORES HERO */
  function animateCounter(el){
    const target=parseInt(el.dataset.count,10), isYear=target>100;
    const dur=isYear?800:600, from=isYear?2020:0, start=performance.now();
    (function step(now){ const p=Math.min((now-start)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.floor(from+(target-from)*e);
      if(p<1)requestAnimationFrame(step); else el.textContent=target;
    })(start);
  }
  const heroSection=qs('#view-inicio'); let countersRun=false;
  if(heroSection){ const obs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting&&!countersRun){ countersRun=true; qsa('.pcs-num').forEach(animateCounter); }
  },{threshold:0.3}); obs.observe(heroSection); }
  
  /* ────────────────────────────── ACCORDION ACTIVIDADES */
  document.addEventListener('click',function(e){
    const btn=e.target.closest('.acts-btn'); if(!btn)return;
    // Evitar que el accordion abra el modal de archivos
    if(btn.closest('#filesModal')) return;
    const card=btn.closest('.wcard'), drop=btn.nextElementSibling; if(!drop)return;
    const open=drop.classList.contains('open');
    card.querySelectorAll('.acts-drop.open').forEach(d=>d.classList.remove('open'));
    card.querySelectorAll('.acts-btn.open').forEach(b=>b.classList.remove('open'));
    if(!open){ drop.classList.add('open'); btn.classList.add('open'); }
  });
  
  /* ════════════════════════════════════════════
     MODAL DE ARCHIVOS DE SEMANA  (NUEVO)
     Se abre al hacer clic en una wcard
  ════════════════════════════════════════════ */
  // Creamos el modal dinámicamente
  const filesModal = document.createElement('div');
  filesModal.id = 'filesModal';
  filesModal.className = 'fm-overlay';
  filesModal.innerHTML = `
    <div class="fm-box">
      <div class="fm-header">
        <div class="fm-header-left">
          <span class="fm-badge" id="fmBadge"></span>
          <div>
            <h3 id="fmTitle"></h3>
            <p id="fmDesc"></p>
          </div>
        </div>
        <button class="fm-close ripple" id="fmClose"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="fm-body" id="fmBody"></div>
    </div>`;
  document.body.appendChild(filesModal);
  
  const fmClose = qs('#fmClose');
  const fmBody  = qs('#fmBody');
  const fmTitle = qs('#fmTitle');
  const fmDesc  = qs('#fmDesc');
  const fmBadge = qs('#fmBadge');
  
  function openFilesModal(key) {
    const meta  = WORKS[key] || {};
    const files = getAllFilesForWeek(key);   // estáticos + subidos por admin
    const gradMap = {'1':'var(--g1)','2':'var(--g2)','3':'var(--g3)','4':'var(--g4)'};
    const g = gradMap[meta.unit] || 'var(--g1)';
  
    fmBadge.textContent = `Unidad ${meta.unit} · ${meta.week}`;
    fmBadge.style.background = g;
    fmTitle.textContent = meta.week + ' — ' + meta.label;
    fmDesc.textContent  = meta.desc || '';
  
    if (!files.length) {
      fmBody.innerHTML = `
        <div class="fm-empty">
          <div class="fm-empty-icon"><i class="fa-solid fa-folder-open"></i></div>
          <p>Esta semana no tiene archivos subidos aún.</p>
          <small>El administrador puede subirlos desde <strong>Ingresar → Panel Admin</strong></small>
        </div>`;
    } else {
      fmBody.innerHTML = `
        <div class="fm-count"><i class="fa-solid fa-paperclip"></i> ${files.length} archivo${files.length>1?'s':''} disponible${files.length>1?'s':''}</div>
        <div class="fm-list">
          ${files.map((f, idx) => {
            const ext       = (f.name||'').split('.').pop().toLowerCase();
            const isPdf     = ext === 'pdf';
            const isImage   = ['jpg','jpeg','png','gif','webp','bmp'].includes(ext);
            const iconClass = isPdf ? 'fa-file-pdf fm-ico-pdf' : isImage ? 'fa-file-image fm-ico-img' : 'fa-file fm-ico-file';
            const folderLabel = f.folder === 'imagenes'
              ? '<span class="fm-folder-tag ft-img"><i class="fa-solid fa-images"></i> Imágenes</span>'
              : '<span class="fm-folder-tag ft-pdf"><i class="fa-solid fa-folder-closed"></i> Carpeta 1</span>';
            const sizeLabel  = f.size ? `${(f.size/1024/1024).toFixed(1)} MB` : '';
            const dateLabel  = f.uploaded || '';
            const staticTag  = f.isStatic ? '<span class="fm-static-tag">Servidor</span>' : '';
            // Thumbnail solo para imágenes con data real (no estáticas de ruta)
            const thumb = isImage && f.data && f.data.startsWith('data:')
              ? `<div class="fm-thumb"><img src="${f.data}" alt="${f.name}" loading="lazy"/></div>`
              : '';
            return `<div class="fm-item">
              ${thumb || `<div class="fm-item-icon"><i class="fa-solid ${iconClass}"></i></div>`}
              <div class="fm-item-info">
                <p class="fm-item-name" title="${f.name}">${f.name}</p>
                <p class="fm-item-meta">
                  ${sizeLabel}${sizeLabel && dateLabel ? ' · ' : ''}${dateLabel}
                  ${folderLabel} ${staticTag}
                </p>
              </div>
              <div class="fm-item-actions">
                <button class="fm-btn-ver ripple" data-idx="${idx}" data-key="${key}">
                  <i class="fa-solid fa-eye"></i> VER
                </button>
                <button class="fm-btn-dl ripple" data-idx="${idx}" data-key="${key}">
                  <i class="fa-solid fa-download"></i> DESCARGAR
                </button>
              </div>
            </div>`;
          }).join('')}
        </div>`;
  
      // VER archivo
      fmBody.querySelectorAll('.fm-btn-ver').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const f = getAllFilesForWeek(btn.dataset.key)[parseInt(btn.dataset.idx)];
          if (!f) return;
          openFileViewer(f);
        });
      });
  
      // DESCARGAR archivo
      fmBody.querySelectorAll('.fm-btn-dl').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const f = getAllFilesForWeek(btn.dataset.key)[parseInt(btn.dataset.idx)];
          if (!f) return;
          if (f.isStatic) {
            // Archivo del servidor: abrir en nueva pestaña para descargar
            const a = document.createElement('a');
            a.href = f.data; a.download = f.name; a.target = '_blank'; a.click();
          } else if (f.data) {
            const a = document.createElement('a');
            a.href = f.data; a.download = f.name; a.click();
          }
          showToast('Descargando ' + f.name, 'success');
        });
      });
    }
  
    filesModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeFilesModal() {
    filesModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  fmClose.addEventListener('click', closeFilesModal);
  filesModal.addEventListener('click', e => { if (e.target === filesModal) closeFilesModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeFilesModal(); closeFileViewer(); } });
  
  /* Abrir modal SOLO al hacer clic en el botón "Vista Previa" */
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-preview');
    if (!btn) return;
    const card = btn.closest('.wcard');
    if (!card) return;
    openFilesModal(card.dataset.key);
  });
  
  /* ────────────────────────────── VISOR DE ARCHIVO (PDF / Imagen) */
  const fileViewer = document.createElement('div');
  fileViewer.id = 'fileViewer';
  fileViewer.className = 'fv-overlay';
  fileViewer.innerHTML = `
    <div class="fv-box">
      <div class="fv-topbar">
        <span class="fv-fname" id="fvName"></span>
        <div style="display:flex;gap:.5rem">
          <button class="fv-btn-dl ripple" id="fvDl"><i class="fa-solid fa-download"></i> Descargar</button>
          <button class="fv-close ripple" id="fvClose"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      <div class="fv-content" id="fvContent"></div>
    </div>`;
  document.body.appendChild(fileViewer);
  
  let currentViewFile = null;
  function openFileViewer(f) {
    currentViewFile = f;
    qs('#fvName').textContent = f.name;
    const ext = f.name.split('.').pop().toLowerCase();
    const isImage = ['jpg','jpeg','png','gif','webp','bmp'].includes(ext);
    const fvContent = qs('#fvContent');
    if (isImage) {
      fvContent.innerHTML = `<img src="${f.data}" alt="${f.name}" class="fv-img"/>`;
    } else if (ext === 'pdf') {
      fvContent.innerHTML = `<iframe src="${f.data}" class="fv-frame" title="${f.name}"></iframe>`;
    } else {
      fvContent.innerHTML = `<div class="fv-unsupported"><i class="fa-solid fa-file"></i><p>Vista previa no disponible</p><small>Descarga el archivo para abrirlo.</small></div>`;
    }
    fileViewer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeFileViewer() {
    fileViewer.classList.remove('open');
    document.body.style.overflow = '';
    qs('#fvContent').innerHTML = '';
    currentViewFile = null;
  }
  qs('#fvClose').addEventListener('click', closeFileViewer);
  fileViewer.addEventListener('click', e => { if (e.target === fileViewer) closeFileViewer(); });
  qs('#fvDl').addEventListener('click', () => {
    if (!currentViewFile || !currentViewFile.data) return;
    const a = document.createElement('a'); a.href = currentViewFile.data; a.download = currentViewFile.name; a.click();
    showToast('Descargando '+currentViewFile.name, 'success');
  });
  
  /* ────────────────────────────── LOGIN */
  const loginScreen=qs('#loginScreen'), adminScreen=qs('#adminScreen'),
        loginForm=qs('#loginForm'), loginEmail=qs('#loginEmail'), loginPass=qs('#loginPass'),
        errEmail=qs('#errEmail'), errPass=qs('#errPass'),
        loginSubmit=qs('#loginSubmit'), loginBtnTxt=qs('#loginBtnText'), loginBtnIco=qs('#loginBtnIcon'),
        loginFeedback=qs('#loginFeedback'), eyeBtn=qs('#eyeBtn'), eyeIco=qs('#eyeIco'), emailCheck=qs('#emailCheck');
  
  if(eyeBtn) eyeBtn.addEventListener('click',()=>{ const s=loginPass.type==='password'; loginPass.type=s?'text':'password'; eyeIco.className=s?'fa-solid fa-eye-slash':'fa-solid fa-eye'; });
  
  if(loginEmail) loginEmail.addEventListener('input',function(){
    loginEmail.classList.remove('err');
    if(errEmail) errEmail.textContent='';
    const val=loginEmail.value.trim();
    const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    loginEmail.classList.toggle('ok',ok&&!!val);
    if(emailCheck) emailCheck.innerHTML=ok&&val?'<i class="fa-solid fa-check" style="color:#10b981;font-size:.75rem"></i>':'';
  });
  if(loginPass) loginPass.addEventListener('input',()=>{ loginPass.classList.remove('err'); if(errPass) errPass.textContent=''; });
  
  if(loginForm) loginForm.addEventListener('submit',function(e){
    e.preventDefault();
    if(loginFeedback) loginFeedback.className='lf-feedback';
    loginEmail&&loginEmail.classList.remove('err'); loginPass&&loginPass.classList.remove('err');
    if(errEmail) errEmail.textContent=''; if(errPass) errPass.textContent='';
    const ev=loginEmail?loginEmail.value.trim():'', pv=loginPass?loginPass.value:'';
    let ok=true;
    if(!ev){ loginEmail&&loginEmail.classList.add('err'); if(errEmail)errEmail.textContent='El correo es obligatorio.'; ok=false; }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev)){ loginEmail&&loginEmail.classList.add('err'); if(errEmail)errEmail.textContent='Correo inválido.'; ok=false; }
    if(!pv){ loginPass&&loginPass.classList.add('err'); if(errPass)errPass.textContent='La contraseña es obligatoria.'; ok=false; }
    if(!ok) return;
    if(loginSubmit) loginSubmit.disabled=true;
    if(loginBtnTxt) loginBtnTxt.textContent='Verificando...';
    if(loginBtnIco) loginBtnIco.className='fa-solid fa-spinner fa-spin';
    setTimeout(function(){
      if(loginSubmit) loginSubmit.disabled=false;
      if(loginBtnIco) loginBtnIco.className='fa-solid fa-arrow-right-to-bracket';
      if(ev===ADMIN_EMAIL&&pv===ADMIN_PASS){
        if(loginBtnTxt) loginBtnTxt.textContent='¡Acceso concedido!';
        if(loginFeedback){ loginFeedback.className='lf-feedback ok'; loginFeedback.textContent='✓ Bienvenido, administrador. Cargando panel...'; }
        isLoggedIn=true;
        setTimeout(()=>{ if(loginBtnTxt)loginBtnTxt.textContent='Entrar al Panel'; loginForm.reset(); if(emailCheck)emailCheck.innerHTML=''; loginEmail&&loginEmail.classList.remove('ok'); showAdminPanel(); },900);
      } else {
        if(loginBtnTxt) loginBtnTxt.textContent='Entrar al Panel';
        if(loginFeedback){ loginFeedback.className='lf-feedback bad'; loginFeedback.textContent='✗ Credenciales incorrectas. Verifica e intenta de nuevo.'; }
        loginPass&&loginPass.classList.add('err');
        if(loginPass) loginPass.value='';
        showToast('Credenciales incorrectas','error');
      }
    },1400);
  });
  
  /* ────────────────────────────── ADMIN PANEL SHOW/HIDE */
  function showAdminPanel(){
    if(loginScreen) loginScreen.style.display='none';
    if(adminScreen) adminScreen.style.display='flex';
    const footer=qs('#siteFooter'); if(footer) footer.style.display='none';
    qsa('.view').forEach(v=>v.classList.remove('active'));
    const vl=qs('#view-login'); if(vl) vl.classList.add('active');
    switchAdminPanel('upload');
    renderSidebarCount();
    renderUgBars();
  }
  function hideAdminPanel(){
    isLoggedIn=false;
    if(loginScreen) loginScreen.style.display='';
    if(adminScreen) adminScreen.style.display='none';
    if(loginFeedback) loginFeedback.className='lf-feedback';
    loginForm&&loginForm.reset();
    loginEmail&&loginEmail.classList.remove('ok','err');
    if(emailCheck) emailCheck.innerHTML='';
    const footer=qs('#siteFooter'); if(footer) footer.style.display='';
    goTo('inicio');
    showToast('Sesión cerrada correctamente','info');
  }
  const adminLogout=qs('#adminLogout');
  if(adminLogout) adminLogout.addEventListener('click',hideAdminPanel);
  
  /* ────────────────────────────── ADMIN NAV PANELS */
  function switchAdminPanel(id){
    qsa('.adm-panel').forEach(p=>p.classList.remove('active'));
    qsa('.adm-nav-btn').forEach(b=>b.classList.remove('active'));
    const panel=qs('#panel-'+id), navBtn=qs(`.adm-nav-btn[data-panel="${id}"]`);
    if(panel) panel.classList.add('active');
    if(navBtn) navBtn.classList.add('active');
    if(id==='files')    renderFilesPanel();
    if(id==='overview') renderOverviewPanel();
  }
  qsa('.adm-nav-btn[data-panel]').forEach(btn=>btn.addEventListener('click',()=>switchAdminPanel(btn.dataset.panel)));
  
  /* ════════════════════════════════════════════
     UPLOAD FLOW  — Multi-archivo por semana
     Acepta PDF + imágenes, elige carpeta
  ════════════════════════════════════════════ */
  let uState = { unit:null, key:null, files:[], folder:'carpeta1' };
  
  const stepUnit=qs('#step-unit'), stepWeek=qs('#step-week'),
        stepFile=qs('#step-file'), stepConfirm=qs('#step-confirm'),
        weekGrid=qs('#weekGrid'), selectedInfo=qs('#selectedInfo'),
        dropArea=qs('#dropArea'), daContent=qs('#daContent'),
        fileInput=qs('#fileInput'), confirmBox=qs('#confirmBox'),
        uploadToast=qs('#uploadToast'), btnSave=qs('#btnSave'),
        apBreadcrumb=qs('#apBreadcrumb');
  
  function setBreadcrumb(active){
    if(!apBreadcrumb) return;
    qsa('.apb-item',apBreadcrumb).forEach(item=>{
      const s=parseInt(item.dataset.step); item.classList.remove('active','done');
      if(s===active) item.classList.add('active'); else if(s<active) item.classList.add('done');
    });
  }
  function showStep(name){
    [stepUnit,stepWeek,stepFile,stepConfirm].forEach(s=>s&&s.classList.add('hidden'));
    const map={unit:stepUnit,week:stepWeek,file:stepFile,confirm:stepConfirm};
    const nums={unit:1,week:2,file:3,confirm:4};
    if(map[name]) map[name].classList.remove('hidden');
    setBreadcrumb(nums[name]||1);
  }
  
  // STEP 1: UNIT
  qsa('.ug-card[data-unit]').forEach(btn=>btn.addEventListener('click',function(){
    qsa('.ug-card').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected');
    uState.unit=btn.dataset.unit; uState.key=null; uState.files=[];
    buildWeekGrid(uState.unit); showStep('week');
  }));
  
  function buildWeekGrid(uid){
    if(!weekGrid) return;
    const store=getStore(), keys=UNIT_KEYS[uid]||[];
    weekGrid.innerHTML=keys.map(key=>{
      const w=WORKS[key], files=store[key]||[];
      const n=files.length;
      return `<button class="wg-btn${n>0?' has-pdf':''}" data-key="${key}">
        ${n>0?`<span class="wg-pdf-tag">${n} archivo${n>1?'s':''}</span>`:''}
        <div class="wg-work">${w.work}</div>
        <div class="wg-name">${w.label}</div>
        <div class="wg-week">${w.week}</div>
      </button>`;
    }).join('');
    weekGrid.querySelectorAll('.wg-btn').forEach(btn=>btn.addEventListener('click',function(){
      weekGrid.querySelectorAll('.wg-btn').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected');
      uState.key=btn.dataset.key; uState.files=[];
      resetDropZone();
      const w=WORKS[uState.key];
      if(selectedInfo) selectedInfo.innerHTML=`<i class="fa-solid fa-circle-info"></i> Unidad ${w.unit} · ${w.week} · <strong>${w.label}</strong>`;
      showStep('file');
    }));
  }
  
  qs('#backUnit')&&qs('#backUnit').addEventListener('click',()=>showStep('unit'));
  qs('#backWeek')&&qs('#backWeek').addEventListener('click',()=>showStep('week'));
  qs('#backFile')&&qs('#backFile').addEventListener('click',()=>showStep('file'));
  qs('#cancelUpload')&&qs('#cancelUpload').addEventListener('click',()=>{ resetUpload(); showStep('unit'); });
  
  // STEP 3: FILE — múltiples archivos + selección de carpeta
  function resetDropZone(){
    if(!daContent) return;
    daContent.innerHTML=`
      <div class="da-icon"><i class="fa-solid fa-file-arrow-up"></i></div>
      <p class="da-title">Arrastra tus archivos aquí</p>
      <p class="da-sub">o <span class="da-link">haz clic para explorar</span></p>
      <p class="da-hint">PDF · JPG · PNG · GIF — múltiples archivos</p>`;
    dropArea&&dropArea.classList.remove('file-ok','dragging');
    if(fileInput){ fileInput.value=''; fileInput.multiple=true; fileInput.accept='.pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp'; }
    uState.files=[];
    renderSelectedFiles();
  }
  
  // Área para mostrar archivos seleccionados antes de confirmar
  function renderSelectedFiles(){
    let preview=qs('#selectedFilesPreview');
    if(!preview){
      preview=document.createElement('div'); preview.id='selectedFilesPreview';
      dropArea&&dropArea.parentNode&&dropArea.parentNode.insertBefore(preview, dropArea.nextSibling);
    }
    if(!uState.files.length){ preview.innerHTML=''; return; }
    preview.innerHTML=`
      <div class="sfp-header"><i class="fa-solid fa-paperclip"></i> ${uState.files.length} archivo${uState.files.length>1?'s':''} seleccionado${uState.files.length>1?'s':''}</div>
      <div class="sfp-list">
        ${uState.files.map((f,i)=>{
          const ext=f.name.split('.').pop().toLowerCase();
          const isPdf=ext==='pdf'; const isImg=['jpg','jpeg','png','gif','webp','bmp'].includes(ext);
          const ico=isPdf?'fa-file-pdf sfp-pdf':isImg?'fa-file-image sfp-img':'fa-file sfp-file';
          return `<div class="sfp-item">
            <i class="fa-solid ${ico}"></i>
            <span class="sfp-name">${f.name}</span>
            <span class="sfp-size">${(f.size/1024).toFixed(1)} KB</span>
            <button class="sfp-del" data-i="${i}" title="Quitar"><i class="fa-solid fa-xmark"></i></button>
          </div>`;
        }).join('')}
      </div>
      <div class="sfp-folder">
        <span class="sfp-folder-label"><i class="fa-solid fa-folder"></i> Guardar en:</span>
        <button class="sfp-folder-btn ${uState.folder==='carpeta1'?'active':''}" data-folder="carpeta1"><i class="fa-solid fa-folder-closed"></i> Carpeta 1</button>
        <button class="sfp-folder-btn ${uState.folder==='imagenes'?'active':''}" data-folder="imagenes"><i class="fa-solid fa-images"></i> Imágenes</button>
      </div>
      ${uState.files.length>0?'<button class="sfp-confirm ripple" id="btnGoConfirm"><i class="fa-solid fa-arrow-right"></i> Confirmar y guardar</button>':''}`;
  
    // Quitar archivo individual
    preview.querySelectorAll('.sfp-del').forEach(btn=>btn.addEventListener('click',function(e){
      e.stopPropagation(); uState.files.splice(parseInt(btn.dataset.i),1); renderSelectedFiles();
    }));
    // Selección de carpeta
    preview.querySelectorAll('.sfp-folder-btn').forEach(btn=>btn.addEventListener('click',function(e){
      e.stopPropagation(); uState.folder=btn.dataset.folder;
      preview.querySelectorAll('.sfp-folder-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    }));
    // Ir a confirmar
    const goConfirm=qs('#btnGoConfirm');
    if(goConfirm) goConfirm.addEventListener('click',()=>{ buildConfirmBox(); showStep('confirm'); });
  }
  
  function handleFiles(fileList){
    Array.from(fileList).forEach(file=>{
      const ext=file.name.split('.').pop().toLowerCase();
      const allowed=['pdf','jpg','jpeg','png','gif','webp','bmp'];
      if(!allowed.includes(ext)){ showToast(`"${file.name}" no es un tipo permitido.`,'error'); return; }
      if(file.size>30*1024*1024){ showToast(`"${file.name}" supera 30 MB.`,'error'); return; }
      // Leer y almacenar en uState.files
      const reader=new FileReader();
      reader.onload=function(ev){
        uState.files.push({ name:file.name, data:ev.target.result, size:file.size, rawFile:file });
        dropArea&&dropArea.classList.add('file-ok');
        if(daContent) daContent.querySelector('.da-title')&&(daContent.querySelector('.da-title').textContent=`${uState.files.length} archivo${uState.files.length>1?'s':''} listo${uState.files.length>1?'s':''}`);
        renderSelectedFiles();
      };
      reader.readAsDataURL(file);
    });
  }
  
  if(fileInput){ fileInput.multiple=true; fileInput.accept='.pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp'; fileInput.addEventListener('change',()=>{ if(fileInput.files.length) handleFiles(fileInput.files); }); }
  if(dropArea){
    dropArea.addEventListener('dragover',e=>{e.preventDefault();dropArea.classList.add('dragging');});
    dropArea.addEventListener('dragleave',()=>dropArea.classList.remove('dragging'));
    dropArea.addEventListener('drop',e=>{e.preventDefault();dropArea.classList.remove('dragging');if(e.dataTransfer.files.length)handleFiles(e.dataTransfer.files);});
  }
  
  // STEP 4: CONFIRMAR
  function buildConfirmBox(){
    if(!confirmBox||!uState.key||!uState.files.length) return;
    if(uploadToast) uploadToast.className='upload-toast';
    const w=WORKS[uState.key];
    const gradMap={'1':'var(--g1)','2':'var(--g2)','3':'var(--g3)','4':'var(--g4)'};
    const gStyle=gradMap[w.unit]||'var(--g1)';
    const folderIcon=uState.folder==='imagenes'?'fa-images':'fa-folder-closed';
    const folderName=uState.folder==='imagenes'?'Carpeta Imágenes':'Carpeta 1';
    confirmBox.innerHTML=`
      <div class="cb-row"><span class="cb-label">Destino</span><span class="cb-val"><i class="fa-solid ${folderIcon}" style="color:#fcd34d;margin-right:.3rem"></i>${folderName}</span></div>
      <div class="cb-row"><span class="cb-label">Unidad</span><span class="cb-val" style="background:${gStyle};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-family:'Syne',sans-serif;font-weight:800">Unidad ${w.unit}</span></div>
      <div class="cb-row"><span class="cb-label">Semana</span><span class="cb-val">${w.week}</span></div>
      <div class="cb-row"><span class="cb-label">Archivos</span><span class="cb-val">${uState.files.length} archivo${uState.files.length>1?'s':''}</span></div>
      <div class="cb-files-list">
        ${uState.files.map(f=>{
          const ext=f.name.split('.').pop().toLowerCase();
          const isPdf=ext==='pdf';
          return `<div class="cb-file"><i class="fa-solid ${isPdf?'fa-file-pdf':'fa-file-image'}"></i><div><div class="cb-fname">${f.name}</div><div class="cb-fsize">${(f.size/1024).toFixed(1)} KB</div></div></div>`;
        }).join('')}
      </div>`;
  }
  
  // GUARDAR
  if(btnSave) btnSave.addEventListener('click',function(){
    if(!uState.key||!uState.files.length){ if(uploadToast){uploadToast.className='upload-toast bad';uploadToast.textContent='Selecciona al menos un archivo.';} return; }
    btnSave.disabled=true; btnSave.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    setTimeout(function(){
      uState.files.forEach(f=>{
        addFileToWeek(uState.key,{ name:f.name, data:f.data, size:f.size, type:f.name.split('.').pop().toLowerCase(), folder:uState.folder, uploaded:new Date().toLocaleString('es-PE') });
      });
      btnSave.disabled=false; btnSave.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Guardar en Carpeta 1';
      if(uploadToast){ uploadToast.className='upload-toast ok'; uploadToast.textContent=`✓ ${uState.files.length} archivo${uState.files.length>1?'s':''} guardado${uState.files.length>1?'s':''} correctamente.`; }
      showToast(`${uState.files.length} archivo${uState.files.length>1?'s':''} guardado${uState.files.length>1?'s':''}  ✓`,'success');
      renderSidebarCount(); renderUgBars(); refreshBadges();
      // Actualizar tile de semana
      const wg=qs(`.wg-btn[data-key="${uState.key}"]`);
      if(wg){ const n=getWeekFiles(uState.key).length; wg.classList.add('has-pdf'); const tag=wg.querySelector('.wg-pdf-tag'); if(tag)tag.textContent=`${n} archivo${n>1?'s':''}`; else wg.insertAdjacentHTML('afterbegin',`<span class="wg-pdf-tag">${n} archivo${n>1?'s':''}</span>`); }
      setTimeout(()=>{ resetUpload(); showStep('unit'); },2200);
    },900);
  });
  
  function resetUpload(){
    uState={unit:null,key:null,files:[],folder:'carpeta1'};
    resetDropZone();
    qsa('.ug-card').forEach(b=>b.classList.remove('selected'));
    if(weekGrid) weekGrid.innerHTML='';
    if(uploadToast) uploadToast.className='upload-toast';
    if(confirmBox) confirmBox.innerHTML='';
    const sfp=qs('#selectedFilesPreview'); if(sfp) sfp.innerHTML='';
  }
  
  /* ────────────────────────────── SIDEBAR COUNT & UG BARS */
  function renderSidebarCount(){
    const n=totalFiles();
    const badge=qs('#sidebarCount'); if(badge) badge.textContent=n;
    const fc=qs('#filesCount'); if(fc) fc.textContent=n+' archivo'+(n!==1?'s':'');
  }
  function renderUgBars(){
    const store=getStore();
    ['1','2','3','4'].forEach(uid=>{
      const keys=UNIT_KEYS[uid]||[];
      const uploaded=keys.filter(k=>(store[k]||[]).length>0).length;
      const pct=Math.round((uploaded/keys.length)*100);
      const bar=qs('#upb-'+uid);
      if(bar) bar.innerHTML=`<span style="display:block;height:100%;width:${pct}%;background:var(--g${uid});border-radius:2px;transition:width .6s"></span>`;
    });
  }
  
  /* ────────────────────────────── FILES PANEL (admin) */
  function renderFilesPanel(){
    const list=qs('#filesList'); if(!list) return;
    renderSidebarCount();
    const store=getStore();
    const allFiles=[];
    Object.entries(store).forEach(([key,arr])=>{ if(Array.isArray(arr)) arr.forEach((f,idx)=>allFiles.push({...f,key,idx})); });
    if(!allFiles.length){
      list.innerHTML=`<div class="no-files"><i class="fa-solid fa-folder-open"></i><p>Carpeta 1 e Imágenes están vacías</p><small>Sube archivos desde <strong>Subir Archivo</strong></small></div>`;
      return;
    }
    const badgeClass={'1':'fc-b1','2':'fc-b2','3':'fc-b3','4':'fc-b4'};
    list.innerHTML=allFiles.map(f=>{
      const w=WORKS[f.key]||{};
      const bc=badgeClass[w.unit]||'fc-b1';
      const ext=(f.name||'').split('.').pop().toLowerCase();
      const isImg=['jpg','jpeg','png','gif','webp','bmp'].includes(ext);
      const ico=ext==='pdf'?'fa-file-pdf':'fa-file-image';
      const folderIcon=f.folder==='imagenes'?'fa-images':'fa-folder-closed';
      const thumb=isImg?`<img src="${f.data}" class="fc-thumb" alt="${f.name}"/>`:null;
      return `<div class="fc">
        ${thumb?`<div class="fc-img-wrap">${thumb}</div>`:`<i class="fa-solid ${ico} fc-pdf-icon"></i>`}
        <span class="fc-badge ${bc}">U${w.unit||'?'} · ${w.week||f.key}</span>
        <div class="fc-name">${f.name}</div>
        <div class="fc-meta">${w.label||''}<br>${f.uploaded||''} · ${f.size?(f.size/1024).toFixed(1)+' KB':''}</div>
        <div class="fc-meta" style="margin-top:.2rem"><i class="fa-solid ${folderIcon}" style="color:#fcd34d;font-size:.7rem"></i> ${f.folder==='imagenes'?'Imágenes':'Carpeta 1'}</div>
        <div class="fc-actions">
          <button class="fc-view ripple" data-key="${f.key}" data-idx="${f.idx}"><i class="fa-solid fa-eye"></i> Ver</button>
          <button class="fc-del  ripple" data-key="${f.key}" data-idx="${f.idx}" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
    }).join('');
    list.querySelectorAll('.fc-view').forEach(btn=>btn.addEventListener('click',()=>{
      const f=getWeekFiles(btn.dataset.key)[parseInt(btn.dataset.idx)]; if(f) openFileViewer(f);
    }));
    list.querySelectorAll('.fc-del').forEach(btn=>btn.addEventListener('click',function(){
      const f=(getWeekFiles(btn.dataset.key)||[])[parseInt(btn.dataset.idx)];
      if(!confirm(`¿Eliminar "${(f||{}).name||btn.dataset.key}"?`)) return;
      delFileFromWeek(btn.dataset.key, parseInt(btn.dataset.idx));
      showToast('Archivo eliminado','info');
      renderFilesPanel(); renderSidebarCount(); renderUgBars(); refreshBadges();
    }));
  }
  
  /* ────────────────────────────── OVERVIEW PANEL */
  function renderOverviewPanel(){
    const wrap=qs('#overviewWrap'); if(!wrap) return;
    const store=getStore();
    const units=[
      {id:'1',name:'Fundamentos',    badge:'ov-b1',keys:UNIT_KEYS['1']},
      {id:'2',name:'Diseño Avanzado',badge:'ov-b2',keys:UNIT_KEYS['2']},
      {id:'3',name:'Implementación', badge:'ov-b3',keys:UNIT_KEYS['3']},
      {id:'4',name:'Optimización',   badge:'ov-b4',keys:UNIT_KEYS['4']},
    ];
    wrap.innerHTML=units.map(u=>{
      const uploaded=u.keys.filter(k=>(store[k]||[]).length>0).length;
      const pct=Math.round((uploaded/u.keys.length)*100);
      const rows=u.keys.map(k=>{
        const w=WORKS[k], n=(store[k]||[]).length;
        return `<div class="ov-row">
          <span class="ov-row-label">${w.week}</span>
          <div class="ov-bar-wrap"><div class="ov-bar-fill" style="width:${n>0?100:0}%"></div></div>
          <span style="font-size:.72rem;color:var(--muted)">${n>0?n+' arch.':'—'}</span>
          <div class="ov-dot ${n>0?'yes':'no'}"></div>
        </div>`;
      }).join('');
      return `<div class="ov-card"><span class="ov-badge ${u.badge}">Unidad ${u.id}</span><h4>${u.name}</h4><p class="ov-progress-pct">${uploaded}/${u.keys.length} semanas con archivos (${pct}%)</p><div class="ov-rows">${rows}</div></div>`;
    }).join('');
  }
  
  /* ────────────────────────────── ARCHIVOS ESTÁTICOS PRECARGADOS
     Estos archivos existen físicamente en las carpetas carpeta1/ e imagenes/
     Se muestran en el modal de semana como si hubieran sido subidos por el admin.
     Usamos data:'ruta/archivo.pdf' para referenciarlos directamente sin base64.
     type:'static' indica que son archivos del servidor, no base64 del storage.
  */
  const STATIC_FILES = {
   u1_t01:[

      {
        name: 'Semana1 Informe tecnico comparativo de Arquitecturas.pdf',
        data: 'carpeta1/Sem1_Informe tecnico comparativo de Arquitecturas.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }

 ],
u1_t02:[

      {
        name: 'Semana2 Desarrollo de Manual SQLserver BD II.pdf',
        data: 'carpeta1/Semana2_Desarrollo de Manual SQLserver  BD II.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
      {
        name: 'Semana2 Desarrollo Modelado Entidad Relacion BD II.pdf',
        data: 'carpeta1/Sem2_Desarrollo Modelado Entidad Relacion BD II .pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }
],
u1_t03:[

      {
        name: 'Semana3 Arquitectura de Base de Datos Analisis Comparativo.pdf',
        data: 'carpeta1/Semana3_Arquitectura de Base de Datos Analisis Comparativo.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
      {
        name: 'Semana3 Desarrollo Modelo Entidad Relacion.pdf',
        data: 'carpeta1/Semana3_Desarrollo Modelo Entidad Relacion.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
      {
        name: 'Semana3 Tarjeta del Portafolio BD II.pdf',
        data: 'carpeta1/Semana3_Tarjeta del Portafolio BD II.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }

],
    u1_t04:[
      {
        name: 'Semana4 Boleta y Diagrama Entidad Relacion.pdf',
        data: 'carpeta1/Semana4_Boleta y Diagrama Entidad Relacion.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
      {
        name: 'Semana4 Resumen Informe Tecnico.pdf',
        data: 'carpeta1/Semana4_Resumen Informe Tecnico.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }
],
u2_t05:[
      {
        name: '   Semana 5 - Sem5_NormalCoreccion.pdf',
        data: 'carpeta1/Sem5_NormalCoreccion.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
       {
        name: 'Semana 5 - Ficha inventario Tecnologico.pdf',
        data: 'carpeta1/Sem5_fichaInventarioEquipos.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: 'Semana 5 - Desarrollo Resume.pdf',
        data: 'carpeta1/Sem5_Desarrollon Resum.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }   
],
u2_t06: [

      {
        name: '   Semana 6 - Sem6_Desarrollo Resumen.pdf',
        data: 'carpeta1/Sem6_Desarrollon Resum.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 6 - Preguntas Recreativas.pdf',
        data: 'carpeta1/Sem6_Preguntas Recreativas.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }
       
],
u2_t07:[

      {
        name: '   Semana 7 - Sem7_Desarrollo Resumen.pdf',
        data: 'carpeta1/Sem7_Desarrollon Resum.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }
       
],
u2_t08:[
      {
        name: '   Semana 8 - Sem8_ActividadesDesarrollo.pdf',
        data: 'carpeta1/Sem8_ActividadesDesarrollo.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 8 - Sem8_ResumenActividades.pdf',
        data: 'carpeta1/Sem8_ResumenActividades.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 8 - Sem8_SQL SERVER ROSALES.pdf',
        data: 'carpeta1/Sem8_SQL SERVER ROSALES.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 8 - Sem8_ResumenCreativo_compressed.pdf',
        data: 'carpeta1/Sem8_ResumenCreativo_compressed.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 8 - Sem8_Resumen30SQL.pdf',
        data: 'carpeta1/Sem8_Resumen30SQL.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }  
 ],

u3_t09:[
      {
        name: '   Semana 9 - Sem9_Vistas.pdf',
        data: 'carpeta1/Sem9_Vistas.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 9 - Sem9_Funciones.pdf',
        data: 'carpeta1/Sem9_Funciones.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 9 - Sem9_Esquemas.pdf',
        data: 'carpeta1/Sem9_Esquemas.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 9 - Sem9_Indices.pdf',
        data: 'carpeta1/Sem9_Indices.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 9 - Sem9_Store Procedures.pdf',
        data: 'carpeta1/Sem9_Store Procedures.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }
],
u3_t10:[

      {
        name: '   Semana 10 - Sem10_BaseDeDatosReglamento de Grados y titulos.pdf',
        data: 'carpeta1/Sem10_BaseDeDatosReglamento de Grados y titulos.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 10 - Sem10_RACTIVIDADES DE ESTUDIO.pdf',
        data: 'carpeta1/Sem10_RACTIVIDADES DE ESTUDIO.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      },
        {
        name: '   Semana 10 - Sem10_Infografias de Aprendizaje.pdf',
        data: 'carpeta1/Sem10_Infografias de Aprendizaje.pdf',
        size: null, type: 'pdf', folder: 'carpeta1',
        uploaded: 'Precargado', isStatic: true
      }
],
  };
  
  /* Combina archivos estáticos con los del storage para una semana */
  function getAllFilesForWeek(key) {
    const stored  = getWeekFiles(key);                // archivos subidos por admin
    const statics = (STATIC_FILES[key] || []);        // archivos precargados del servidor
    // Evitar duplicados por nombre
    const storedNames = stored.map(f => f.name);
    const uniqueStatics = statics.filter(f => !storedNames.includes(f.name));
    return [...uniqueStatics, ...stored];
  }
  
  /* ────────────────────────────── INIT */
  goTo('inicio');
  setTimeout(()=>revealCards(qsa('.wcard',qs('#view-inicio'))),100);
  // Actualizar badges teniendo en cuenta archivos estáticos
  refreshBadgesAll();
  function refreshBadgesAll(){
    qsa('.wcard[data-key]').forEach(c=>{
      const files = getAllFilesForWeek(c.dataset.key);
      c.classList.toggle('has-pdf', files.length > 0);
    });
  }
  
  })();
