// nav.js — Tool switching, global toast, global modal

// ── Global Toast ──
var _glToastTimer = null;
function showToast(msg, type) {
  // type: 'ok', 'error', 'warn', or '' (default)
  var el = document.getElementById('globalToast');
  var icon = document.getElementById('glToastIcon');
  var msgEl = document.getElementById('glToastMsg');
  el.className = 'gl-toast' + (type ? ' gl-' + type : '');
  var icons = { ok: '✓', error: '✕', warn: '⚠' };
  icon.textContent = icons[type] || 'ℹ';
  msgEl.textContent = msg;
  el.classList.add('show');
  clearTimeout(_glToastTimer);
  _glToastTimer = setTimeout(function() { el.classList.remove('show'); }, 2800);
}

// ── Global Modal (replaces prompt/confirm) ──
var _glModalResolve = null;
var _glModalMode = 'prompt'; // 'prompt' or 'confirm'

function showModal(title, opts) {
  // opts: { placeholder, defaultValue, type, okLabel }
  // Returns a Promise that resolves with the input value, or null if cancelled
  opts = opts || {};
  var overlay = document.getElementById('globalModal');
  var titleEl = document.getElementById('glModalTitle');
  var inputEl = document.getElementById('glModalInput');
  var msgEl = document.getElementById('glModalMsg');
  var okBtn = document.getElementById('glModalOk');

  titleEl.textContent = title;
  msgEl.textContent = '';
  okBtn.textContent = opts.okLabel || 'OK';

  if (opts.type === 'confirm') {
    _glModalMode = 'confirm';
    inputEl.style.display = 'none';
  } else {
    _glModalMode = 'prompt';
    inputEl.style.display = '';
    inputEl.type = opts.inputType || 'text';
    inputEl.placeholder = opts.placeholder || '';
    inputEl.value = opts.defaultValue || '';
  }

  overlay.style.display = 'flex';
  if (_glModalMode === 'prompt') {
    setTimeout(function() { inputEl.focus(); inputEl.select(); }, 50);
  }

  // Handle Enter key
  inputEl.onkeydown = function(e) {
    if (e.key === 'Enter') { glModalOk(); e.preventDefault(); }
    if (e.key === 'Escape') { glModalCancel(); e.preventDefault(); }
  };

  return new Promise(function(resolve) { _glModalResolve = resolve; });
}

function glModalOk() {
  var overlay = document.getElementById('globalModal');
  var inputEl = document.getElementById('glModalInput');
  overlay.style.display = 'none';
  if (_glModalResolve) {
    _glModalResolve(_glModalMode === 'confirm' ? true : inputEl.value);
    _glModalResolve = null;
  }
}

function glModalCancel() {
  var overlay = document.getElementById('globalModal');
  overlay.style.display = 'none';
  if (_glModalResolve) {
    _glModalResolve(null);
    _glModalResolve = null;
  }
}

// ── Smart Tab Navigation ──
// Tab cycles through visible inputs/selects/textareas in the active panel
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Tab') return;
  // Find the active tool panel
  var activePanel = document.querySelector('.app.active, #emaildash.active, #barcoding.active');
  if (!activePanel) return;
  // Get all focusable fields in the active panel
  var fields = Array.from(activePanel.querySelectorAll(
    'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([disabled]):not([readonly]), ' +
    'select:not([disabled]), ' +
    'textarea:not([disabled]), ' +
    '[contenteditable="true"]'
  )).filter(function(el) {
    // Only visible fields
    return el.offsetParent !== null && el.offsetWidth > 0;
  });
  if (fields.length < 2) return;
  var current = document.activeElement;
  var idx = fields.indexOf(current);
  if (idx < 0) return; // Focus isn't on a tracked field
  e.preventDefault();
  var next;
  if (e.shiftKey) {
    next = idx > 0 ? fields[idx - 1] : fields[fields.length - 1];
  } else {
    next = idx < fields.length - 1 ? fields[idx + 1] : fields[0];
  }
  next.focus();
  if (next.select) next.select();
});

// ── Tool Switching with fade transition ──
function switchTool(toolId, evt) {
  // Update nav
  document.querySelectorAll(".nav-item").forEach(function(el) { el.classList.remove("active"); });
  if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");

  // Hide all tool panels
  document.querySelectorAll(".app, #emaildash, #barcoding, #notifications, #directory, #contact_dir, #wastestreams, #hazmat_recert").forEach(function(el) {
    el.classList.remove("active");
  });

  var mainWrap = document.querySelector(".main-wrap");
  mainWrap.classList.remove("lookup-active", "email-active");

  var targetEl = null;
  if (toolId === "barcoding") {
    targetEl = document.getElementById("barcoding");
    mainWrap.classList.add("lookup-active");
  } else if (toolId === "notifications") {
    targetEl = document.getElementById("notifications");
    mainWrap.classList.add("lookup-active");
  } else if (toolId === "emaildash") {
    targetEl = document.getElementById("emaildash");
    mainWrap.classList.add("email-active");
  } else if (toolId === "directory") {
    targetEl = document.getElementById("directory");
    mainWrap.classList.add("lookup-active");
    // sync the Directory nav item as active even when re-entering from a child
    var dirNav = document.querySelector('.nav-item[onclick*="\'directory\'"]');
    if (dirNav) {
      document.querySelectorAll(".nav-item").forEach(function(el) { el.classList.remove("active"); });
      dirNav.classList.add("active");
    }
  } else if (toolId === "contact_dir" || toolId === "wastestreams" || toolId === "hazmat_recert") {
    targetEl = document.getElementById(toolId);
    mainWrap.classList.add("lookup-active");
    // Lazy-load the iframe on first open
    var frame = targetEl.querySelector("iframe");
    if (frame && frame.dataset.src && !frame.src) {
      frame.src = frame.dataset.src;
    }
    // Keep "Directory" highlighted in the sidebar — these are children of it
    var dirNav2 = document.querySelector('.nav-item[onclick*="\'directory\'"]');
    if (dirNav2) {
      document.querySelectorAll(".nav-item").forEach(function(el) { el.classList.remove("active"); });
      dirNav2.classList.add("active");
    }
  } else if (toolId === "tool3") {
    // DOT Lookup is now a child of Directory — keep Directory highlighted
    targetEl = document.getElementById("tool3");
    var dirNav3 = document.querySelector('.nav-item[onclick*="\'directory\'"]');
    if (dirNav3) {
      document.querySelectorAll(".nav-item").forEach(function(el) { el.classList.remove("active"); });
      dirNav3.classList.add("active");
    }
  } else {
    targetEl = document.getElementById(toolId);
  }

  if (targetEl) {
    targetEl.classList.add("app-entering");
    targetEl.classList.add("active");
    // Trigger reflow then remove entering class for animation
    void targetEl.offsetWidth;
    targetEl.classList.remove("app-entering");
  }

  // Refresh offspec phrases when switching to that tool
  if (toolId === "offspec" && typeof loadPhrasesFromFirebase === "function") {
    loadPhrasesFromFirebase();
  }
  // Load leaderboard when switching to games
  if (toolId === "games" && typeof loadLeaderboard === "function") {
    loadLeaderboard(typeof GAMES_CURRENT !== 'undefined' ? GAMES_CURRENT : 'whackmole');
  }
}
