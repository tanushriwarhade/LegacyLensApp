/* =====================================================
   LegacyLens Quantum — app.js
   All interactivity: navigation, upload analysis,
   report tabs, waitlist form
   ===================================================== */

// ─── PAGE NAVIGATION ────────────────────────────────
const PAGE_ORDER = ['landing', 'dashboard', 'upload', 'report', 'enterprise'];

function showPage(name) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.remove('active');
  });

  // Deactivate all nav tabs
  document.querySelectorAll('.nav-tab').forEach(function (t) {
    t.classList.remove('active');
  });

  // Show the chosen page
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');

  // Activate the matching nav tab
  const idx = PAGE_ORDER.indexOf(name);
  const tabs = document.querySelectorAll('.nav-tab');
  if (tabs[idx]) tabs[idx].classList.add('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── REPORT TABS ────────────────────────────────────
function switchReportTab(clickedTab, sectionId) {
  // Deactivate all report tabs
  document.querySelectorAll('.report-tab').forEach(function (t) {
    t.classList.remove('active');
  });

  // Hide all report sections
  document.querySelectorAll('.report-section').forEach(function (s) {
    s.classList.remove('active');
  });

  // Activate clicked tab and matching section
  clickedTab.classList.add('active');
  const section = document.getElementById(sectionId);
  if (section) section.classList.add('active');
}

// ─── WAITLIST FORM ───────────────────────────────────
function joinWaitlist() {
  const emailInput = document.getElementById('waitlist-email');
  const msgEl = document.getElementById('waitlist-msg');
  const email = emailInput.value.trim();

  if (email && email.includes('@') && email.includes('.')) {
    msgEl.innerHTML = '🎉 You\'re #128 on the waitlist! Check your inbox for early access details.';
    msgEl.style.color = 'var(--accent2)';
    emailInput.value = '';
  } else {
    msgEl.innerHTML = '⚠ Please enter a valid work email address.';
    msgEl.style.color = 'var(--warn)';
    emailInput.focus();
  }
}

// ─── UPLOAD & ANALYSIS ENGINE ────────────────────────
let analysisRunning = false;

// Click the hero upload zone → run analysis with default sample
function startAnalysis() {
  loadSample('BankCore_EJB');
}

// Click a specific sample card
function loadSample(sampleName) {
  if (analysisRunning) return;
  analysisRunning = true;

  // Update the filename shown in the panel header
  const fileLabel = document.getElementById('analysis-file');
  if (fileLabel) fileLabel.textContent = sampleName;

  // Reset all step icons to their initial states
  resetStepIcons();

  // Show the panel and scroll it into view
  const panel = document.getElementById('analysis-panel');
  panel.style.display = 'block';
  setTimeout(function () {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);

  // Hide the report button until analysis finishes
  const reportBtn = document.getElementById('view-report-btn');
  reportBtn.style.display = 'none';

  // Animate the progress bar
  runProgressBar();
}

function resetStepIcons() {
  const parseIcon = document.getElementById('icon-parse');
  const parseBar  = document.getElementById('parse-bar');
  const parseDet  = document.getElementById('parse-detail');

  if (parseIcon) {
    parseIcon.className = 'step-icon step-active';
    parseIcon.textContent = '⚡';
  }
  if (parseBar)  parseBar.style.width = '10%';
  if (parseDet)  parseDet.textContent = 'Tree-sitter cluster · 1,000 / 10,000 files complete';

  setIconState('icon-pattern', 'pending', '🔍');
  setIconState('icon-twin',    'pending', '🌐');
  setIconState('icon-roadmap', 'pending', '🗺');
}

function setIconState(id, state, emoji) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'step-icon step-' + state;
  el.textContent = emoji;
}

function runProgressBar() {
  let pct = 10;
  const parseBar  = document.getElementById('parse-bar');
  const parseDet  = document.getElementById('parse-detail');
  const parseIcon = document.getElementById('icon-parse');

  const interval = setInterval(function () {
    pct = Math.min(100, pct + Math.random() * 7 + 4);
    const filesComplete = Math.floor(pct * 100);

    if (parseBar) parseBar.style.width = pct + '%';
    if (parseDet) parseDet.textContent =
      'Tree-sitter cluster · ' + filesComplete.toLocaleString() + ' / 10,000 files complete';

    if (pct >= 100) {
      clearInterval(interval);
      // Mark AST parsing done
      if (parseIcon) {
        parseIcon.className = 'step-icon step-done';
        parseIcon.textContent = '✅';
      }
      // Cascade remaining steps with delays
      setTimeout(function () { setIconState('icon-pattern', 'done', '✅'); },  700);
      setTimeout(function () { setIconState('icon-twin',    'done', '✅'); }, 1600);
      setTimeout(function () {
        setIconState('icon-roadmap', 'done', '✅');
        // Show the report button
        const reportBtn = document.getElementById('view-report-btn');
        if (reportBtn) reportBtn.style.display = 'inline-block';
        analysisRunning = false;
      }, 2600);
    }
  }, 110);
}

// ─── DRAG-OVER VISUAL FOR UPLOAD ZONE ────────────────
(function setupUploadZone() {
  const zone = document.getElementById('upload-zone');
  if (!zone) return;

  zone.addEventListener('dragover', function (e) {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', function () {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', function (e) {
    e.preventDefault();
    zone.classList.remove('drag-over');
    // Treat any dropped file as a trigger for the demo analysis
    loadSample('Dropped Archive');
  });
})();

// ─── KEYBOARD SHORTCUTS ──────────────────────────────
document.addEventListener('keydown', function (e) {
  // Number keys 1-5 switch pages
  const key = parseInt(e.key, 10);
  if (key >= 1 && key <= 5 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const target = document.activeElement;
    const isInput = target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA'
    );
    if (!isInput) {
      showPage(PAGE_ORDER[key - 1]);
    }
  }
});

// ─── INIT ─────────────────────────────────────────────
(function init() {
  // Make sure the landing page is active on load
  showPage('landing');
})();
