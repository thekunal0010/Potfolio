/**
 * Portfolio Core Controller & Orchestrator
 * Manages views, system boot simulation, synthesizer audio effects, forms, and overlays.
 */

// Global state variables
let audioCtx = null;
let soundMuted = false;
let activeView = 'home';
let activeStarfield = null;
let activeGalaxy = null;
let activeTrajectory = null;

// Projects Database (Factual and verified content only)
const projectsData = [
  {
    id: 'real-estate',
    num: '01',
    name: 'Real Estate Management System',
    tagline: 'Local Full-Stack Platform',
    desc: 'A full-stack real estate management platform for managing property listings, users, favorites, authentication, and property discovery.',
    category: 'full-stack',
    featured: true,
    status: 'COMPLETED',
    tech: ['Next.js', 'React', 'TypeScript', 'Prisma', 'SQLite', 'JWT', 'bcrypt'],
    stats: { frontend: '65%', backend: '25%', database: '10%', deployment: 'Local Application' },
    objective: 'Create a local full-stack platform for users to list, browse, filter, and favorite real estate listings with secure credentials.',
    features: [
      'User authentication & session validation using secure JWT and bcrypt.',
      'Role-based access system dividing CUSTOMER and LISTER roles.',
      'Customers can browse, search, filter, and favorite listings.',
      'Listers can create, update, delete, upload images, and manage property listings.',
      'Prisma ORM database schema mapping SQLite relations.'
    ],
    architecture: `
+------------------+     JWT REST API      +-----------------------+
|  Next.js Client  | =====================> |  Route Handler API    |
|  (React/TS UI)   | <===================== |  (JWT Auth, Bcrypt)   |
+------------------+     JSON Payload      +-----------------------+
         ||                                            ||
         || Listings Upload                            || Prisma Client
         \/                                            \/
+------------------+                       +-----------------------+
| File System Disk |                       | SQLite Database File  |
| (Property Images)|                       | (Tables & Schemas)    |
+------------------+                       +-----------------------+
    `,
    challenges: 'Structuring middleware layers to check user JWT scopes and enforce role privileges for database mutations.',
    solutions: 'Built routing wrapper hooks checking authorization context headers, rejecting requests failing role token checks.',
    github: 'https://github.com/thekunal0010/Real-estate-management-system',
    live: '#'
  },
  {
    id: 'event-management',
    num: '02',
    name: 'Event Management System',
    tagline: 'Local Event Management Hub',
    desc: 'A full-stack event management platform that allows users to discover and manage events, with authentication, protected routes, event creation and editing, dashboards, event history, and image uploads.',
    category: 'full-stack',
    featured: true,
    status: 'COMPLETED',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'bcrypt', 'Multer'],
    stats: { frontend: '50%', backend: '35%', database: '15%', deployment: 'Local Application' },
    objective: 'Create a full-stack booking and scheduling portal with authentication, dashboards, and image upload handlers.',
    features: [
      'User authentication and password encryption via JWT and bcrypt.',
      'Protected dashboard routes and secure user sessions.',
      'Event discovery stream, details rendering, and registration histories.',
      'Interactive event creation, editing, deletion tools.',
      'Image uploads handled dynamically by Multer middleware.'
    ],
    architecture: `
+------------------+     REST API Calls     +-----------------------+
|   React Client   | =====================> |  Node.js API Server   |
|  (Vite App UI)   | <===================== |  (Express Router)     |
+------------------+     JSON / Uploads     +-----------------------+
         ||                                            ||
         || Image Assets                               || Mongoose Model
         \/                                            \/
+------------------+                       +-----------------------+
|  Multer Storage  |                       |   MongoDB Database    |
|  (Local Uploads) |                       |  (Events, Users Logs) |
+------------------+                       +-----------------------+
    `,
    challenges: 'Managing multi-part form data uploads for event banner images alongside textual specifications.',
    solutions: 'Integrated Multer storage engines to parse files dynamically, storing assets locally while indexing relative path links in MongoDB tables.',
    github: 'https://github.com/thekunal0010/Event-Management',
    live: '#'
  },
  {
    id: 'notetube',
    num: '03',
    name: 'NoteTube',
    tagline: 'Transcript & Summarization Tool',
    desc: 'A web application designed to transform video content into structured learning material through transcript retrieval, summarization, important-topic cards, and MCQ-based assessments.',
    category: 'web',
    featured: true,
    status: 'ACTIVE',
    tech: ['Python', 'Flask', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
    stats: { frontend: '35%', backend: '45%', database: '20%', deployment: 'Vercel / Local' },
    objective: 'Transform standard video content into structured notes, topic summaries, and automated assessments for improved study workflows.',
    features: [
      'Automated transcript retrieval from public video links.',
      'Summarization modules parsing content into structured topic cards.',
      'MCQ-based interactive assessments.',
      'Integrated user authentication and session profiles.',
      'Flask backend REST API with MongoDB logging.'
    ],
    architecture: `
+------------------+     Fetch Requests     +-----------------------+
|   HTML/CSS/JS    | =====================> |  Flask Backend API    |
|  (Client App)    | <===================== |  (Python App Core)    |
+------------------+     JSON Response      +-----------------------+
                                                       ||
                                                       || Database Query
                                                       \/
                                            +-----------------------+
                                            |   MongoDB Database    |
                                            |   (Transcripts, MCQs) |
                                            +-----------------------+
    `,
    challenges: 'Parsing transcripts and aligning topic cards with custom MCQs without API latency lags.',
    solutions: 'Cached processed transcript summaries in MongoDB collections, using bulk read operations to return data quickly.',
    github: 'https://github.com/thekunal0010/notetube',
    live: '#'
  },
  {
    id: 'academic-success',
    num: '04',
    name: 'Decoding Academic Success',
    tagline: 'Explainable AI Sleep Research',
    desc: 'An academic research project investigating the relationship between sleep patterns, lifestyle factors, and student academic performance using machine learning and Explainable AI.',
    category: 'machine-learning',
    featured: true,
    status: 'COMPLETED',
    tech: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Machine Learning', 'SHAP'],
    stats: { frontend: '0%', backend: '80%', database: '0%', deployment: 'Academic Research' },
    objective: 'Investigate correlations between student sleep duration/quality, screen time, study hours, class attendance, and GPA metrics using Explainable AI.',
    features: [
      'Survey collection gathering 95 undergraduate student responses.',
      'Pipeline augmentation using SMOTE algorithms expanding data to 1,004 instances.',
      'Constrained Random Forest modeling (n_estimators=50, max_depth=5, min_samples_split=2).',
      'SHAP summary plots demonstrating feature impact explainability.',
      'Feature ablation showing Sleep Hours as the most critical predictor.',
      'Performance yields: 5-Fold CV of 91.83% ± 2.99% and Test Accuracy of 90.55%.'
    ],
    architecture: `
+------------------+     Raw Survey data    +-----------------------+
| Undergraduate    | =====================> | Augmentation Pipeline |
| (95 survey logs) |                        | (SMOTE: 1,004 records)|
+------------------+                        +-----------------------+
                                                       ||
                                                       || Train & Classify
                                                       \/
                                            +-----------------------+
                                            | Constrained RF Model  |
                                            | (SHAP / Ablation Tool)|
                                            +-----------------------+
    `,
    challenges: 'Resolving statistical bias and overfitting in small undergraduate survey samples.',
    solutions: 'Applied dataset augmentation and SMOTE algorithms to create 1,004 instances. Trained a Constrained Random Forest. Removing Sleep Hours during feature ablation led to a 7.46 percentage-point accuracy loss, marking it the most critical predictor.',
    github: 'https://github.com/thekunal0010/academic-success-research',
    live: '#'
  },
  // Additional projects (featured: false)
  {
    id: 'java-event',
    name: 'Java Event Management System',
    category: 'java',
    featured: false,
    tech: ['Java', 'Servlet', 'JDBC'],
    desc: 'Academic booking system featuring scheduling calendar databases and servlet controllers.',
    github: 'https://github.com/thekunal0010/java-event-management'
  },
  {
    id: 'weather-app',
    name: 'Weather App',
    category: 'mobile',
    featured: false,
    tech: ['Flutter', 'Dart'],
    desc: 'Mobile application displaying localized weather alerts and forecast metrics.',
    github: 'https://github.com/thekunal0010/weather-app'
  },
  {
    id: 'employee-mgmt',
    name: 'Employee Management',
    category: 'web',
    featured: false,
    tech: ['React', 'CSS'],
    desc: 'Management console dashboard tracking employee records, credentials, and roles.',
    github: 'https://github.com/thekunal0010/employee-management'
  },
  {
    id: 'notes-proj',
    name: 'Notes Project',
    category: 'web',
    featured: false,
    tech: ['React', 'Tailwind CSS'],
    desc: 'Lightweight client-side notebook workspace for managing simple text notes.',
    github: 'https://github.com/thekunal0010/react-notes'
  },
  {
    id: 'gallery-proj',
    name: 'Gallery Project',
    category: 'web',
    featured: false,
    tech: ['React', 'CSS'],
    desc: 'Dynamic image grid explorer featuring responsive filters and previews.',
    github: 'https://github.com/thekunal0010/react-gallery'
  }
];

// Web Audio API Synthesizer Sounds
function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
}

function playBeep(freq = 1000, duration = 0.08, type = 'sine', volume = 0.08) {
  if (soundMuted) return;
  initAudio();
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playSweep(startFreq = 200, endFreq = 1200, duration = 0.3, volume = 0.08) {
  if (soundMuted) return;
  initAudio();
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// SIMULATE BOOT SEQUENCE LOGS
const bootLogs = [
  'INITIALIZING SYSTEM BOOT SEQUENCE...',
  'CONNECTING TO SATELLITE NETWORK... OK',
  'CALIBRATING ASTROMETRICS SCANNER... OK',
  'LOADING ASTRO-PROFILE METADATA...',
  'MCA CORE CONSOLE: MOUNTED',
  'QUERYING DATA CORES FOR KUNAL TAMULI...',
  'RETRIEVING TECH EXPLORATION CORES...',
  'CONNECTING GITHUB CONSTELLATION API...',
  'LOADING MISSION ARCHIVE DATABASE... 4 PROJECTS READ',
  'ALIGNING HUD NAVIGATION CONTROLS...',
  'SYSTEM DIAGNOSTIC: STABLE',
  'ALL SYSTEMS NOMINAL.'
];

function simulateBootSequence() {
  const logContainer = document.getElementById('boot-diagnostics-log');
  const progressBar = document.getElementById('boot-progress');
  const percentageTxt = document.getElementById('boot-percent');
  const bootScreen = document.getElementById('boot-screen');

  if (!logContainer || !progressBar || !percentageTxt) return;

  let currentLogIdx = 0;
  let progress = 0;

  const logInterval = setInterval(() => {
    if (currentLogIdx < bootLogs.length) {
      const line = document.createElement('div');
      line.className = 'boot-diagnostic-line';
      line.textContent = `> ${bootLogs[currentLogIdx]}`;
      logContainer.appendChild(line);
      logContainer.scrollTop = logContainer.scrollHeight;

      playBeep(800 + currentLogIdx * 100, 0.04, 'sine', 0.03);
      currentLogIdx++;
    } else {
      clearInterval(logInterval);
    }
  }, 180);

  const progressInterval = setInterval(() => {
    if (progress < 100) {
      progress += Math.floor(Math.random() * 3) + 1;
      if (progress > 100) progress = 100;
      progressBar.style.width = `${progress}%`;
      percentageTxt.textContent = `${progress}%`;
    } else {
      clearInterval(progressInterval);

      // Boot Sequence Done! Fade screen out
      setTimeout(() => {
        playSweep(440, 880, 0.4, 0.1); // Success chime
        bootScreen.classList.add('fade-out');

        // Initialize interactive animations once boot wraps up
        if (window.initStarfield) {
          activeStarfield = window.initStarfield('starfield');
        }
        if (window.initTechGalaxy && !activeGalaxy) {
          activeGalaxy = window.initTechGalaxy('galaxy-canvas', updateSkillHUDPanel);
        }
        if (window.initJourneyTrajectory && !activeTrajectory) {
          activeTrajectory = window.initJourneyTrajectory('journey-flight-container');
        }
      }, 500);
    }
  }, 40);
}

// SYSTEM NAVIGATION ROUTING
function navigateToView(viewId) {
  if (activeStarfield) {
    activeStarfield.triggerWarp();
  }

  playBeep(1200, 0.05, 'sine', 0.05);
  setTimeout(() => {
    playBeep(1800, 0.08, 'sine', 0.04);
  }, 50);

  if (viewId === 'lost') {
    document.body.classList.add('lost-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  document.body.classList.remove('lost-active');

  const targetViewEl = document.getElementById(`view-${viewId}`);
  if (targetViewEl) {
    // Scroll window smoothly to target element top taking header height into account
    const headerHeight = window.innerWidth <= 768 ? 60 : 70;
    const targetOffset = targetViewEl.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(0, targetOffset), behavior: 'smooth' });
  }
}

// SKILL HUD DATABASE PANEL HANDLER
function updateSkillHUDPanel(skillNode) {
  const titleEl = document.getElementById('skill-hud-title');
  const levelEl = document.getElementById('skill-hud-level');
  const catEl = document.getElementById('skill-hud-cat');
  const projEl = document.getElementById('skill-hud-projects');
  const descEl = document.getElementById('skill-hud-desc');

  if (!skillNode) {
    if (titleEl) titleEl.textContent = 'SELECT NODE';
    if (levelEl) levelEl.textContent = '-';
    if (catEl) catEl.textContent = '-';
    if (projEl) projEl.textContent = '-';
    if (descEl) descEl.textContent = 'Select a rotating orbital node in the system visualization dashboard to inspect experience scopes and architectural usages.';
    return;
  }

  if (titleEl) titleEl.textContent = skillNode.name.toUpperCase();
  if (levelEl) levelEl.textContent = skillNode.exp || 'EXPLORING';
  if (catEl) catEl.textContent = skillNode.category.toUpperCase();
  if (projEl) projEl.textContent = skillNode.projects ? `${skillNode.projects} MISSION(S)` : 'ARCHIVED';
  if (descEl) descEl.textContent = skillNode.desc || 'Active orbital technology component deployed in spacecraft software matrix.';

  playBeep(1500, 0.05, 'triangle', 0.04);
}

// RENDER PROJECTS DYNAMICALLY WITH SPLIT GRID VIEWS
function renderProjectsGrid(filter = 'all') {
  const container = document.getElementById('projects-grid-container');
  if (!container) return;

  container.innerHTML = '';
  const normFilter = filter.toLowerCase();

  // Filter datasets based on exact category matches
  const featured = projectsData.filter(p => p.featured && (normFilter === 'all' || p.category === normFilter));
  const additional = projectsData.filter(p => !p.featured && (normFilter === 'all' || p.category === normFilter));

  // 1. Render Featured Missions
  if (featured.length > 0) {
    const featHeader = document.createElement('div');
    featHeader.className = 'grid-section-header';
    featHeader.innerHTML = `<h3 class="profile-title" style="margin-bottom: var(--spacing-md); font-size: 13px;">FEATURED MISSIONS</h3>`;
    container.appendChild(featHeader);

    const featGrid = document.createElement('div');
    featGrid.className = 'projects-grid';

    featured.forEach(p => {
      const card = document.createElement('div');
      card.className = 'glass-panel project-card';
      card.setAttribute('data-tech-tag', p.tech[0].toUpperCase());
      const planetHue = (p.name.length * 35) % 360;

      card.innerHTML = `
        <div class="project-thumbnail" style="background: radial-gradient(circle at center, hsl(${planetHue}, 70%, 15%), #03050a 90%);">
          <div style="position: absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:50px; height:50px; border-radius:50%; background:radial-gradient(circle, hsl(${planetHue}, 80%, 40%), transparent); filter:blur(4px); animation: pulse-glow 3s infinite alternate;"></div>
          <div class="project-meta-top">
            <span class="project-mission-num">MISSION ${p.num}</span>
            <span class="project-status-tag">${p.status}</span>
          </div>
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.name}</h3>
          <p class="project-description">${p.desc}</p>
          <div class="project-tech-stack">
            ${p.tech.slice(0, 5).map(t => `<span class="project-tech-badge">${t}</span>`).join('')}
          </div>
          <div class="project-footer">
            <button class="btn-cosmic" onclick="openProjectModal('${p.id}')">VIEW DETAILS</button>
            <a class="btn-cosmic secondary" href="${p.github}" target="_blank">VIEW SOURCE →</a>
          </div>
        </div>
      `;
      featGrid.appendChild(card);
    });
    container.appendChild(featGrid);
  }

  // 2. Render Additional Missions (smaller layout footprint cards)
  if (additional.length > 0) {
    const addHeader = document.createElement('div');
    addHeader.className = 'grid-section-header';
    addHeader.innerHTML = `
      <h3 class="profile-title" style="margin-top: var(--spacing-xl); margin-bottom: 4px; font-size: 13px;">ADDITIONAL MISSIONS</h3>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: var(--spacing-md);">Earlier experiments, academic systems, and development projects.</p>
    `;
    container.appendChild(addHeader);

    const addGrid = document.createElement('div');
    addGrid.className = 'additional-projects-grid';
    addGrid.style.display = 'flex';
    addGrid.style.flexDirection = 'column';
    addGrid.style.gap = '28px';

    additional.forEach(p => {
      const card = document.createElement('div');
      card.className = 'glass-panel additional-project-card';
      card.setAttribute('data-tech-tag', 'ARCHIVE');
      card.style.padding = '16px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';

      card.innerHTML = `
        <div>
          <div style="font-family: var(--font-mono); font-size: 10px; color: var(--color-primary); margin-bottom: 4px; text-transform: uppercase;">${p.category} System</div>
          <h4 style="font-family: var(--font-hud); font-size: 15px; margin-bottom: 8px; font-weight: 600; color: var(--text-primary);">${p.name}</h4>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.4;">${p.desc}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-dim); padding-top:10px; margin-top:8px;">
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">Tech: ${p.tech.join(' / ')}</span>
          <a class="btn-cosmic secondary" href="${p.github}" target="_blank" style="padding: 4px 8px; font-size: 10px;">CODE →</a>
        </div>
      `;
      addGrid.appendChild(card);
    });
    container.appendChild(addGrid);
  }
}

// EXPAND MODAL VIEW
function openProjectModal(projectId) {
  const p = projectsData.find(project => project.id === projectId);
  if (!p) return;

  playSweep(300, 700, 0.25, 0.05);

  const modal = document.getElementById('project-detail-modal');
  const details = document.getElementById('project-modal-details-box');
  if (!modal || !details) return;

  const planetHue = (p.name.length * 35) % 360;

  details.innerHTML = `
    <div class="project-modal-hero" style="background: radial-gradient(circle at center, hsl(${planetHue}, 75%, 15%), #050816 95%);">
      <div style="position: absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:120px; height:120px; border-radius:50%; background:radial-gradient(circle, hsl(${planetHue}, 80%, 40%), transparent); filter:blur(10px); animation: pulse-glow 3s infinite alternate;"></div>
      <div class="project-modal-header">
        <div class="project-modal-meta">MISSION ARCHIVE // CODE: ${p.num}</div>
        <h2 class="project-modal-title">${p.name}</h2>
      </div>
    </div>
    <div class="project-modal-body">
      <div class="project-details-main">
        <div>
          <h4 class="project-section-title">Mission Objective</h4>
          <div class="project-section-content">${p.objective}</div>
        </div>
        <div>
          <h4 class="project-section-title">System Features</h4>
          <div class="project-section-content">
            <ul>
              ${p.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div>
          <h4 class="project-section-title">Futuristic Architecture</h4>
          <div class="project-section-content">
            <pre class="project-architecture-diagram">${p.architecture.trim()}</pre>
          </div>
        </div>
        <div>
          <h4 class="project-section-title">Diagnostic Challenges</h4>
          <div class="project-section-content">${p.challenges}</div>
        </div>
        <div>
          <h4 class="project-section-title">Terminal Solutions</h4>
          <div class="project-section-content">${p.solutions}</div>
        </div>
      </div>
      <div class="project-details-sidebar">
        <div class="glass-panel project-stats-panel" data-tech-tag="SPECS">
          <h4 class="project-section-title" style="font-size:11px; margin-bottom:12px;">Diagnostic Specifications</h4>
          <div class="hud-detail-stats">
            <div class="hud-detail-row"><span>Frontend Ratio</span><span class="val">${p.stats.frontend}</span></div>
            <div class="hud-detail-row"><span>Backend Ratio</span><span class="val">${p.stats.backend}</span></div>
            <div class="hud-detail-row"><span>Data Engine</span><span class="val">${p.stats.database}</span></div>
            <div class="hud-detail-row"><span>Deployment</span><span class="val" style="font-size:10px;">${p.stats.deployment}</span></div>
          </div>
        </div>
        <div class="project-details-links">
          <a class="btn-cosmic" href="${p.github}" target="_blank">ACCESS SOURCE DATA</a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeProjectModal() {
  const modal = document.getElementById('project-detail-modal');
  if (modal) {
    playBeep(400, 0.1, 'sine', 0.05);
    modal.classList.remove('active');
  }
}

// INITIALIZE SYSTEM EVENT BINDINGS
document.addEventListener('DOMContentLoaded', () => {

  // Desktop Navigation Menu Routing Hooks
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = a.getAttribute('href').substring(1);
      navigateToView(viewId);
    });
  });

  // Mobile Navigation Drawer Toggle & Links Handler
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (mobileNavOverlay && mobileNavToggle) {
      mobileNavOverlay.classList.add('active');
      mobileNavOverlay.setAttribute('aria-hidden', 'false');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      playBeep(1100, 0.04, 'sine', 0.03);
    }
  };

  const closeMobileMenu = () => {
    if (mobileNavOverlay && mobileNavToggle) {
      mobileNavOverlay.classList.remove('active');
      mobileNavOverlay.setAttribute('aria-hidden', 'true');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      playBeep(900, 0.04, 'sine', 0.03);
    }
  };

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) {
        closeMobileMenu();
      }
    });
  }

  // Handle Escape key to close mobile menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavOverlay && mobileNavOverlay.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Mobile nav links navigation
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      closeMobileMenu();
      if (target && typeof navigateToView === 'function') {
        setTimeout(() => {
          navigateToView(target);
        }, 150);
      }
    });
  });

  // Home CTA Bindings
  const exploreBtn = document.getElementById('home-cta-explore');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToView('projects');
    });
  }

  // Scroll Indicator Click Action
  const scrollIndicator = document.querySelector('#view-home .scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToView('about');
    });
  }

  // ScrollSpy to highlight active link in top menu and lazy-load scripts
  let scrollTimeout = null;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(() => {
      const sections = document.querySelectorAll('.console-view');
      const navHeight = 90;
      let currentSectionId = 'home';
      let minDiff = Infinity;

      sections.forEach(sec => {
        if (sec.id === 'view-lost') return;
        const rect = sec.getBoundingClientRect();
        const diff = Math.abs(rect.top - navHeight);

        if (diff < minDiff && rect.top <= window.innerHeight * 0.45 && rect.bottom >= navHeight) {
          minDiff = diff;
          const suffix = sec.id.substring(5);
          if (['home', 'about', 'skills', 'projects', 'journey', 'github', 'resume', 'contact'].includes(suffix)) {
            currentSectionId = suffix;
          }
        }
      });

      if (currentSectionId !== activeView) {
        activeView = currentSectionId;

        document.querySelectorAll('.nav-links a').forEach(a => {
          if (a.getAttribute('href') === `#${activeView}`) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });

        if (activeView === 'skills' && !activeGalaxy) {
          activeGalaxy = window.initTechGalaxy('galaxy-canvas', updateSkillHUDPanel);
        }
        if (activeView === 'journey' && !activeTrajectory) {
          activeTrajectory = window.initJourneyTrajectory('journey-flight-container');
        }
      }
    });
  });

  // Reusable Email Composer helper
  function openEmailComposer({ to = 'thekunal0010@gmail.com', subject = '', body = '' } = {}) {
    let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`;
    if (subject) {
      gmailUrl += `&su=${encodeURIComponent(subject)}`;
    }
    if (body) {
      gmailUrl += `&body=${encodeURIComponent(body)}`;
    }

    const newWin = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      let mailtoUrl = `mailto:${encodeURIComponent(to)}`;
      const params = [];
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      if (params.length > 0) mailtoUrl += `?${params.join('&')}`;
      window.location.href = mailtoUrl;
    }
  }

  // Copy Email Address Action
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    let copyTimeout = null;
    const handleCopy = (e) => {
      e.preventDefault();
      const emailToCopy = 'thekunal0010@gmail.com';
      const onCopied = () => {
        playBeep(1400, 0.06, 'triangle', 0.05);
        copyBtn.textContent = 'ADDRESS COPIED ✓';
        if (copyTimeout) clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          copyBtn.textContent = 'COPY EMAIL';
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailToCopy)
          .then(onCopied)
          .catch(() => {
            fallbackCopy(emailToCopy);
            onCopied();
          });
      } else {
        fallbackCopy(emailToCopy);
        onCopied();
      }
    };

    function fallbackCopy(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }

    copyBtn.addEventListener('click', handleCopy);
  }

  // Direct Email Buttons
  const primaryEmailBtn = document.getElementById('contact-primary-email-btn');
  if (primaryEmailBtn) {
    primaryEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playBeep(1200, 0.05, 'sine', 0.04);
      openEmailComposer({ to: 'thekunal0010@gmail.com' });
    });
  }

  const secondaryEmailBtn = document.getElementById('contact-secondary-email-btn');
  if (secondaryEmailBtn) {
    secondaryEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playBeep(1200, 0.05, 'sine', 0.04);
      openEmailComposer({ to: 'thekunal0010@gmail.com' });
    });
  }

  const startConvBtn = document.getElementById('start-conversation-btn');
  if (startConvBtn) {
    startConvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playBeep(1200, 0.05, 'sine', 0.04);
      openEmailComposer({ to: 'thekunal0010@gmail.com' });
    });
  }

  // Dynamic Route Handling (redirects to lost view)
  const handleRouting = () => {
    const hash = window.location.hash.substring(1);
    const validViews = ['home', 'about', 'skills', 'projects', 'journey', 'github', 'resume', 'contact'];
    if (hash) {
      if (validViews.includes(hash)) {
        navigateToView(hash);
      } else {
        navigateToView('lost');
      }
    }
  };
  window.addEventListener('hashchange', handleRouting);
  setTimeout(handleRouting, 4500);

  // Audio Toggle Switch
  const audioBtn = document.getElementById('audio-toggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      soundMuted = !soundMuted;
      audioBtn.textContent = soundMuted ? 'SOUND: OFF' : 'SOUND: ON';
      playBeep(1000, 0.05, 'sine', 0.05);
    });
  }

  // Projects Filter Tabs Setup
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      playBeep(900, 0.04, 'sine', 0.03);
      renderProjectsGrid(filter);
    });
  });

  // Close Project Modal
  const modalClose = document.getElementById('modal-close-btn');
  if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
  }

  const modalBackdrop = document.getElementById('project-detail-modal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  // Custom Galaxy/Milestone sound connections
  window.addEventListener('galaxyClick', () => {
    playBeep(1600, 0.08, 'triangle', 0.05);
  });
  window.addEventListener('milestoneClick', (e) => {
    playSweep(500, 1000, 0.2, 0.04);
  });
  window.addEventListener('milestoneHover', () => {
    playBeep(600, 0.02, 'sine', 0.02);
  });

  // Live clock updates on HUD Frame
  const clockEl = document.getElementById('hud-live-clock');
  if (clockEl) {
    setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const dateStr = now.toISOString().split('T')[0];
      clockEl.textContent = `SYS TIME: ${dateStr} // ${timeStr}`;
    }, 1000);
  }

  // Contact Form Submission Action
  const contactForm = document.getElementById('communication-form');
  const transmissionLog = document.getElementById('transmission-diagnostics');
  if (contactForm && transmissionLog) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const msgInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const msg = msgInput ? msgInput.value.trim() : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        playBeep(300, 0.25, 'sawtooth', 0.06);
        transmissionLog.innerHTML = '<span class="diagnostic-text" style="color:var(--color-danger)">> ERROR: NAME REQUIRED</span>';
        if (nameInput) nameInput.focus();
        return;
      }

      if (!email) {
        playBeep(300, 0.25, 'sawtooth', 0.06);
        transmissionLog.innerHTML = '<span class="diagnostic-text" style="color:var(--color-danger)">> ERROR: EMAIL REQUIRED</span>';
        if (emailInput) emailInput.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        playBeep(300, 0.25, 'sawtooth', 0.06);
        transmissionLog.innerHTML = '<span class="diagnostic-text" style="color:var(--color-danger)">> ERROR: VALID EMAIL REQUIRED</span>';
        if (emailInput) emailInput.focus();
        return;
      }

      if (!subject) {
        playBeep(300, 0.25, 'sawtooth', 0.06);
        transmissionLog.innerHTML = '<span class="diagnostic-text" style="color:var(--color-danger)">> ERROR: SUBJECT REQUIRED</span>';
        if (subjectInput) subjectInput.focus();
        return;
      }

      if (!msg) {
        playBeep(300, 0.25, 'sawtooth', 0.06);
        transmissionLog.innerHTML = '<span class="diagnostic-text" style="color:var(--color-danger)">> ERROR: MESSAGE REQUIRED</span>';
        if (msgInput) msgInput.focus();
        return;
      }

      const bodyText = `Hello Kunal,\n\nName: ${name}\nEmail: ${email}\n\n${msg}\n\nBest regards,\n${name}`;

      playBeep(1200, 0.1, 'sine', 0.05);
      transmissionLog.innerHTML = '<span class="diagnostic-text" style="color:var(--color-highlight)">> TRANSMISSION CHANNEL OPENED →</span>';

      openEmailComposer({
        to: 'thekunal0010@gmail.com',
        subject: subject,
        body: bodyText
      });
    });
  }

  // Global mousemove listener for mouse glow effect
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });

  // Init core layouts
  simulateBootSequence();
  renderProjectsGrid();
});
