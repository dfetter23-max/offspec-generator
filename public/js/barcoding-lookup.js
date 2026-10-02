// ─── BARCODING GUIDE DATA ────────────────────────────────────────────────────
// All offspec rules from Receiving/Barcoding Notes, organized by process code.
// This data is publicly editable — no admin password required.

const DATA = {
  "LF / LFP": {
    desc: "LIQUID FUEL / LIQUID FUEL WITH PHENOLICS",
    rules: [
      { condition: "High Halogen (40 to 100)", action: "LI" },
      { condition: "High Water (65 to 100), pH (2 to 14), HAZ", action: "VI" },
      { condition: "High pH (11 to 14)", action: "VC" },
      { condition: "Low pH (1 to 3)", action: "VA" },
    ]
  },
  "LF/SF PRECODE → RT2": {
    desc: "LF/SF PRECODE ONLY — OFF SPEC'D TO RT2",
    rules: [
      { condition: "High Halogen (>0.05)", action: "RT" },
      { condition: "High Halogen (>0.05), High Water (65 to 100)", action: "ND ⚖ weight needed" },
      { condition: "High Water (65 to 100)", action: "ND ⚖ weight needed" },
      { condition: "High pH", action: "ND ⚖ weight needed" },
    ]
  },
  "SF / DF / SFP": {
    desc: "NON-PUMPABLE SLUDGE / DRUM FUEL / SLUDGE W/ PHENOLICS",
    rules: [
      { condition: "High Halogen (40 to 100)", action: "SD ⚖ weight needed" },
      { condition: "High Water (65-100), HAZ", action: "SD ⚖ weight needed" },
      { condition: "High pH (11 to 14)", action: "SD ⚖ weight needed" },
      { condition: "IF solid and halogen (<0.05) — SF/DF", action: "RT2" },
      { condition: "IF solid and halogen (>0.05) — SF/DF", action: "RT" },
      { condition: "IF solid and halogen (<0.05) — SFP", action: "ND ⚖ weight needed" },
      { condition: "IF solid and halogen (>0.05) — SFP", action: "ND ⚖ weight needed" },
      { condition: "Low pH (1 to 3)", action: "SD ⚖ weight needed" },
    ]
  },
  "VA": {
    desc: "LIQUID ORGANIC ACIDS FOR FUELS",
    rules: [
      { condition: "High Water (65 to 100) and pH (2 to 14)", action: "VI" },
      { condition: "pH (5-10) and Low Water (0 to 64)", action: "LF" },
      { condition: "Halogen (40 to 100)", action: "LI" },
      { condition: "pH (11-14) and Low Water (0 to 64)", action: "VC" },
      { condition: "If Solid", action: "ND ⚖ weight needed" },
    ]
  },
  "VI": {
    desc: "LIQUID HIGH WATER FOR BLENDING/COMBUSTION",
    rules: [
      { condition: "Low Water (0 to 64) and pH (4 to 10)", action: "LF" },
      { condition: "Low Water (0 to 64) and pH (11 to 14)", action: "VC" },
      { condition: "Low Water (0 to 64) and Low pH (1 to 3)", action: "VA" },
      { condition: "Low Water (0 to 64), Halogen (40-100)", action: "LI" },
      { condition: "If Solid", action: "ND ⚖ weight needed" },
    ]
  },
  "VC": {
    desc: "LIQUID ORGANIC CAUSTICS FOR FUELS",
    rules: [
      { condition: "Low pH (4 to 10)", action: "LF" },
      { condition: "Low pH (1 to 3)", action: "VA" },
      { condition: "High Water (65 to 100) and pH (2 to 14)", action: "VI" },
      { condition: "Low BTU and High Halogen (40 to 100)", action: "LI" },
      { condition: "IF Solid", action: "ND ⚖ weight needed" },
      { condition: "If Sludge", action: "SF" },
      { condition: "If Halogen (40 to 100)", action: "LI" },
    ]
  },
  "LI": {
    desc: "LIQUIDS FOR COMBUSTION/INCINERATION",
    rules: [
      { condition: "IF Water is (65 to 100)", action: "VI" },
      { condition: "Note: If Solid", action: "ND ⚖ weight needed" },
    ]
  },
  "RT2 / RT3": {
    desc: "SOLIDS FOR RECYCLING (NON-HALOGENATED)",
    rules: [
      { condition: "High Halogen (>0.05)", action: "RT" },
      { condition: "High Water (65 to 100)", action: "RSD ⚖ weight needed" },
      { condition: "If pH (1 to 3)", action: "RSD ⚖ weight needed" },
    ]
  },
  "RT": {
    desc: "ORGANIC SOLIDS FOR RECYCLING (NON AND HALOGENATED)",
    rules: [
      { condition: "High Water (65 to 100)", action: "RSD ⚖ weight needed" },
      { condition: "Low pH (1-3)", action: "RSD ⚖ weight needed" },
    ]
  },
  "RH": {
    desc: "ORGANIC SOLIDS FOR RECYCLING (HALOGENATED)",
    rules: [
      { condition: "High Water (65 to 100)", action: "RSD ⚖ weight needed" },
    ]
  },
  "RS2": {
    desc: "ORGANIC SOLIDS FOR RECYCLING (NON-HALOGENATED)",
    rules: [
      { condition: "High pH", action: "RSB2 ⚖ weight needed" },
      { condition: "High Water (65 to 100)", action: "RSD ⚖ weight needed" },
      { condition: "High Halogen (>0.05)", action: "RH ⚖ weight needed" },
    ]
  },
  "RSD": {
    desc: "LOW BTU SLUDGE (OIL DRY / GAS / OIL / WATER)",
    rules: [
      { condition: "High pH", action: "RSB2 ⚖ weight needed" },
    ]
  },
  "LM1-4 / SM1-4": {
    desc: "LIQUID/SLUDGE FOR STABILIZATION",
    rules: [
      { condition: "IF positive Hex Chrome", action: "STA — Needs compatibility test" },
      { condition: "If powder", action: "Needs Q'd" },
      { condition: "If Acid test (30 to 60%)", action: "LA1" },
      { condition: "If Acid test (60 to 100%)", action: "LA2" },
    ]
  },
  "LA2": {
    desc: "LIQUID INORGANIC ACIDS > 60%",
    rules: [
      { condition: "If Acid test is (0-60)", action: "LA1 — Bill code must be same as precode, Needs PCB test" },
      { condition: "If Acid test is (0-60) and positive Hex Chrome or Vigorous", action: "Must stay LA1" },
    ]
  },
  "NM1-4": {
    desc: "SOLID FOR STABILIZATION",
    rules: [
      { condition: "IF positive Hex Chrome", action: "NTA — Needs comp. test, Needs Wt." },
      { condition: "If powder", action: "Needs Q'd" },
    ]
  },
  "XM1-4 / XMH": {
    desc: "OXIDIZER FOR STABILIZATION/LANDFILL",
    rules: [
      { condition: "Note: If positive oxidation", action: "Manual Pass" },
      { condition: "Positive Hex Chrome", action: "LX1" },
    ]
  },
  "RLF / RLF1": {
    desc: "AROMATIC SOLVENTS",
    rules: [
      { condition: "IF Failed Halogen (> 0.5 to 40)", action: "LF" },
      { condition: "High Halogen (40 to 100)", action: "LI" },
      { condition: "If Water (6.0 to 64)", action: "LF" },
      { condition: "If Water (65 to 100)", action: "VI" },
      { condition: "High pH (11 to 14)", action: "VC" },
      { condition: "Low pH (1 to 3)", action: "VA" },
      { condition: "IF Failed NVR", action: "LF" },
      { condition: "If failed for double layers", action: "LF" },
    ]
  },
  "RLFT": {
    desc: "AROMATIC SOLVENTS (T-CODE)",
    rules: [
      { condition: "⚠ NEVER off spec RLFT", action: "— DO NOT OFFSPEC" },
    ]
  },
  "LX 1-3 / NX 1-3": {
    desc: "LIQUID/SOLID OXIDIZER (CHLORINATED/NON-CHLORINATED)",
    rules: [
      { condition: "With D007 or D009", action: "Must be Q'd to Q Manager" },
    ]
  },
  "BULK LIQUID": {
    desc: "BULK LIQUID / SOLID / SLUDGE ROUTING",
    rules: [
      { condition: "ZV6 bulk liquid, solid, sludge", action: "LS / NS / SS" },
      { condition: "ZV1-5 bulk liquid, solid, sludge", action: "Gets Q'd — To Q Manager" },
    ]
  },
  "INNER CONTAINERS": {
    desc: "INNER CONTAINER ROUTING",
    rules: [
      { condition: "LE 1-5", action: "NE 1-5" },
      { condition: "SE 1-5", action: "NE 1-5" },
      { condition: "LS / SS / NS", action: "ZV6" },
      { condition: "LS / SS / NS (Paint Cans — will see on wt sheet)", action: "PS" },
    ]
  },
  "pH ROUTING": {
    desc: "STABILIZATION pH NUMBER ASSIGNMENT (LM/SM/NM/XM)",
    rules: [
      { condition: "Low pH (0 to 4)", action: "LM1 / SM1 / NM1 / XM1" },
      { condition: "Neutral pH (5 to 9)", action: "LM2 / SM2 / NM2 / XM2" },
      { condition: "High pH (10 to 14)", action: "LM3 / SM3 / NM3 / XM3" },
    ]
  },
  "GENERAL TIPS": {
    desc: "IMPORTANT BARCODING RULES & REMINDERS",
    rules: [
      { condition: "Lab must write pass or fail on the weight sheet", action: "— Required" },
      { condition: "No viable offspec listed + error", action: "Q — Material needs reprofiled" },
      { condition: "⚖ weight needed = get weight before offspec", action: "— Reminder" },
      { condition: "RLFT — Never off spec", action: "— NEVER" },
      { condition: "LX/NX with D007 or D009", action: "Q to Q Manager" },
      { condition: "ZV1-5 bulk", action: "Q to Q Manager" },
    ]
  },
};

// ─── VIABLE OFFSPEC OPTIONS (quick reference) ────────────────────────────────
const VIABLE_OFFSPEC = {
  "SF / DF / SFP": true,
  "LF / LFP": true,
  "VA": true,
  "VI": true,
  "LF/SF PRECODE → RT2": true,
  "RT2 / RT3": true,
  "RT": true,
  "RH": true,
  "RS2": true,
  "LI": true,
  "VC": true,
};

// Classify action type
function classifyAction(action) {
  if (action.startsWith('—') || action.includes('no offspec') || action.includes('Reminder') || action.includes('Required') || action.includes('NEVER') || action.includes('Manual Pass')) return 'note';
  if (action.toLowerCase().includes('reprofile') || action.toLowerCase().includes('q\'d') || action.toLowerCase().includes('needs q') || action.toLowerCase().includes('q manager') || action.toLowerCase().includes('q —') || action.toLowerCase().includes('must stay')) return 'warning';
  if (action.includes('⚖') || action.toLowerCase().includes('weight needed')) return 'weight';
  if (action.toLowerCase().includes('adjust') || action.toLowerCase().includes('manually pass') || action.toLowerCase().includes('raise') || action.toLowerCase().includes('lower') || action.toLowerCase().includes('change') || action.toLowerCase().includes('note') || action.toLowerCase().includes('needs')) return 'action';
  // Short code-like targets
  if (action.length <= 30 && /^[A-Z0-9\s\/\-—⚖]+/.test(action)) return 'code';
  return 'action';
}

let selectedCode = null;

function renderCodeList(filter = '') {
  const list = document.getElementById('codeList');
  list.innerHTML = '';
  const keys = Object.keys(DATA).filter(k => codeMatchesFilter(k, DATA[k].desc, filter));
  if (keys.length === 0) {
    list.innerHTML = '<div class="no-results">NO CODES MATCH</div>';
    return;
  }

  // Separate into categories
  const pcCodes = [];
  const refCodes = [];
  const refKeys = ['BULK LIQUID', 'INNER CONTAINERS', 'pH ROUTING', 'GENERAL TIPS'];

  keys.forEach(code => {
    if (refKeys.includes(code)) refCodes.push(code);
    else pcCodes.push(code);
  });

  function addCodeBtn(code) {
    const btn = document.createElement('button');
    btn.className = 'code-btn' + (code === selectedCode ? ' active' : '');
    btn.innerHTML = `
      <span class="code-label">${code}</span>
      <span class="code-desc">${DATA[code].desc}</span>
      <span class="rule-count">${DATA[code].rules.length}</span>
    `;
    btn.addEventListener('click', () => selectCode(code));
    list.appendChild(btn);
  }

  pcCodes.forEach(addCodeBtn);

  if (refCodes.length > 0) {
    const divider = document.createElement('div');
    divider.className = 'list-divider';
    divider.textContent = 'QUICK REFERENCE';
    list.appendChild(divider);
    refCodes.forEach(addCodeBtn);
  }
}

function highlightMatch(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<em>$1</em>');
}

function selectCode(code) {
  selectedCode = code;
  renderCodeList(document.getElementById('codeSearch').value);
  buildRightPanel(code);
}

function buildRightPanel(code, ruleFilter = '') {
  const right = document.getElementById('rightContent');
  const entry = DATA[code];

  const weightCount = entry.rules.filter(r => r.action.includes('⚖') || r.action.toLowerCase().includes('weight needed')).length;
  const weightBadge = weightCount > 0 ? `<span class="weight-badge">⚖ ${weightCount} NEED WEIGHT</span>` : '';

  right.innerHTML = `
    <div class="right-top">
      <div class="selected-code-title">${code}</div>
      <div class="selected-code-meta">
        <h2 id="codeDescDisplay">${entry.desc}</h2>
        <p id="ruleCountDisplay">${entry.rules.length} RULE${entry.rules.length !== 1 ? 'S' : ''} ${weightBadge}
          <button class="edit-desc-btn" id="editDescBtn" title="Edit description">✎</button>
        </p>
      </div>
    </div>
    <div class="condition-search" id="condSearchWrap">
      <div class="condition-search-label">Filter Rules</div>
      <input type="text" id="condSearch" dir="ltr" placeholder="Filter conditions or actions for ${code}...">
    </div>
    <div class="rules-area" id="rulesArea"></div>
    <button class="add-rule-btn" id="addRuleBtn">+ ADD RULE</button>
  `;

  const condSearchEl = document.getElementById('condSearch');
  if (ruleFilter) condSearchEl.value = ruleFilter;

  renderRules(code, ruleFilter);

  condSearchEl.addEventListener('input', (e) => {
    renderRules(code, e.target.value);
  });
  document.getElementById('addRuleBtn').addEventListener('click', () => {
    openRuleModal(code, null, null);
  });
  document.getElementById('editDescBtn').addEventListener('click', () => {
    openCodeEditModal(code);
  });
}

function renderRules(code, condFilter) {
  const entry = DATA[code];
  const area = document.getElementById('rulesArea');
  const countEl = document.getElementById('ruleCountDisplay');
  const weightCount = entry.rules.filter(r => r.action.includes('⚖') || r.action.toLowerCase().includes('weight needed')).length;
  const weightBadge = weightCount > 0 ? `<span class="weight-badge">⚖ ${weightCount} NEED WEIGHT</span>` : '';
  if (countEl) {
    countEl.innerHTML = `${entry.rules.length} RULE${entry.rules.length !== 1 ? 'S' : ''} ${weightBadge}
      <button class="edit-desc-btn" id="editDescBtn" title="Edit description">✎</button>`;
    document.getElementById('editDescBtn').addEventListener('click', () => openCodeEditModal(code));
  }

  let filteredRules = entry.rules.map((r, i) => ({ ...r, origIndex: i }));

  if (condFilter && condFilter.trim()) {
    const words = condFilter.trim().split(/\s+/).filter(Boolean);
    filteredRules = filteredRules.filter(r =>
      words.every(w => {
        const wl = w.toLowerCase();
        return r.condition.toLowerCase().includes(wl) || r.action.toLowerCase().includes(wl);
      })
    );
  }

  if (filteredRules.length === 0) {
    area.innerHTML = '<div class="no-results">NO RULES MATCH FILTER</div>';
    return;
  }

  area.innerHTML = filteredRules.map(r => {
    const type = classifyAction(r.action);
    return `
      <div class="rule-card" data-idx="${r.origIndex}">
        <div class="rule-condition">${highlightMatch(r.condition, condFilter)}</div>
        <div class="rule-action">
          <span class="action-tag ${type}">${highlightMatch(r.action, condFilter)}</span>
        </div>
        <div class="rule-actions-bar">
          <button class="edit-btn" data-idx="${r.origIndex}">✎ EDIT</button>
          <button class="delete-btn" data-idx="${r.origIndex}">✕ DELETE</button>
        </div>
      </div>`;
  }).join('');

  area.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      openRuleModal(code, idx, DATA[code].rules[idx]);
    });
  });

  area.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      if (confirm('Delete this rule?')) {
        DATA[code].rules.splice(idx, 1);
        saveToFirebase();
        renderRules(code, document.getElementById('condSearch')?.value || '');
      }
    });
  });
}

// ---- RULE MODAL ----
let modalState = {};

function openRuleModal(code, ruleIndex, rule) {
  modalState = { code, ruleIndex };
  document.getElementById('modalTitle').textContent = ruleIndex === null ? 'ADD RULE' : 'EDIT RULE';
  document.getElementById('modalCondition').value = rule ? rule.condition : '';
  document.getElementById('modalAction').value = rule ? rule.action : '';
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('modalCondition').focus();
}

document.getElementById('modalSave').addEventListener('click', () => {
  const condition = document.getElementById('modalCondition').value.trim();
  const action = document.getElementById('modalAction').value.trim();
  if (!condition || !action) { alert('Both fields are required.'); return; }

  const { code, ruleIndex } = modalState;
  if (ruleIndex === null) {
    DATA[code].rules.push({ condition, action });
  } else {
    DATA[code].rules[ruleIndex] = { condition, action };
  }
  saveToFirebase();
  closeModal();
  renderRules(code, document.getElementById('condSearch')?.value || '');
});

document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ---- CODE EDIT MODAL ----
function openCodeEditModal(code) {
  document.getElementById('editDescModalTitle').textContent = 'EDIT: ' + code;
  document.getElementById('editCodeNameInput').value = code;
  document.getElementById('editDescInput').value = DATA[code].desc;
  modalState = { editingDescCode: code };
  document.getElementById('editDescModalOverlay').classList.add('open');
  setTimeout(() => document.getElementById('editCodeNameInput').focus(), 50);
}

document.getElementById('editDescSave').addEventListener('click', () => {
  const oldCode = modalState.editingDescCode;
  if (!oldCode) return;
  const newCode = document.getElementById('editCodeNameInput').value.trim().toUpperCase();
  const newDesc = document.getElementById('editDescInput').value.trim();
  if (!newCode) { alert('Code name cannot be empty.'); return; }
  if (!newDesc) { alert('Description cannot be empty.'); return; }
  if (newCode !== oldCode && DATA[newCode]) { alert(newCode + ' already exists.'); return; }

  if (newCode !== oldCode) {
    DATA[newCode] = { ...DATA[oldCode], desc: newDesc };
    delete DATA[oldCode];
    selectedCode = newCode;
  } else {
    DATA[oldCode].desc = newDesc;
  }

  saveToFirebase();
  document.getElementById('editDescModalOverlay').classList.remove('open');
  renderCodeList(document.getElementById('codeSearch').value);
  if (selectedCode) selectCode(selectedCode);
});

document.getElementById('editDescCancel').addEventListener('click', () => {
  document.getElementById('editDescModalOverlay').classList.remove('open');
});
document.getElementById('editDescModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('editDescModalOverlay'))
    document.getElementById('editDescModalOverlay').classList.remove('open');
});
document.getElementById('editCodeNameInput').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.getElementById('editDescCancel').click();
});
document.getElementById('editDescInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('editDescSave').click();
  if (e.key === 'Escape') document.getElementById('editDescCancel').click();
});

// ---- ADD RULE TO EXISTING CODE ----
document.getElementById('addCodeBtn').addEventListener('click', () => {
  const select = document.getElementById('codeModalSelect');
  select.innerHTML = Object.keys(DATA).map(c =>
    `<option value="${c}" ${c === selectedCode ? 'selected' : ''}>${c} — ${DATA[c].desc}</option>`
  ).join('');
  document.getElementById('codeModalCondition').value = '';
  document.getElementById('codeModalAction').value = '';
  document.getElementById('codeModalOverlay').classList.add('open');
  document.getElementById('codeModalCondition').focus();
});

document.getElementById('codeModalSave').addEventListener('click', () => {
  const code = document.getElementById('codeModalSelect').value;
  const condition = document.getElementById('codeModalCondition').value.trim();
  const action = document.getElementById('codeModalAction').value.trim();
  if (!condition || !action) { alert('Both condition and action are required.'); return; }

  DATA[code].rules.push({ condition, action });
  saveToFirebase();
  closeCodeModal();
  selectCode(code);
});

document.getElementById('codeModalCancel').addEventListener('click', closeCodeModal);
document.getElementById('codeModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('codeModalOverlay')) closeCodeModal();
});

function closeCodeModal() {
  document.getElementById('codeModalOverlay').classList.remove('open');
}

// ---- CREATE NEW PROCESS CODE ----
document.getElementById('newCodeBtn').addEventListener('click', () => {
  document.getElementById('newCodeName').value = '';
  document.getElementById('newCodeDesc').value = '';
  document.getElementById('newCodeModalOverlay').classList.add('open');
  document.getElementById('newCodeName').focus();
});

document.getElementById('newCodeSave').addEventListener('click', () => {
  const code = document.getElementById('newCodeName').value.trim().toUpperCase();
  const desc = document.getElementById('newCodeDesc').value.trim() || '—';
  if (!code) { alert('Process code name is required.'); return; }
  if (DATA[code]) { alert(code + ' already exists.'); return; }
  DATA[code] = { desc, rules: [] };
  saveToFirebase();
  document.getElementById('newCodeModalOverlay').classList.remove('open');
  renderCodeList(document.getElementById('codeSearch').value);
  selectCode(code);
});

document.getElementById('newCodeCancel').addEventListener('click', () => {
  document.getElementById('newCodeModalOverlay').classList.remove('open');
});
document.getElementById('newCodeModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('newCodeModalOverlay'))
    document.getElementById('newCodeModalOverlay').classList.remove('open');
});

// ---- DELETE ENTIRE CODE ----
document.getElementById('deleteCodeBtn').addEventListener('click', () => {
  const code = modalState.editingDescCode;
  if (!code) return;
  if (confirm('Delete the entire "' + code + '" and all its rules?')) {
    delete DATA[code];
    saveToFirebase();
    document.getElementById('editDescModalOverlay').classList.remove('open');
    selectedCode = null;
    document.getElementById('rightContent').innerHTML = `
      <div class="empty-state" style="height:calc(100vh - 80px)">
        <div class="big-arrow">←</div>
        <p>SELECT A PROCESS CODE</p>
        <p style="opacity:0.5">TO VIEW BARCODING RULES</p>
      </div>`;
    renderCodeList(document.getElementById('codeSearch').value);
  }
});

// NO SAMPLE LIST button
document.getElementById('noSampleBtn').addEventListener('click', () => {
  document.getElementById('noSampleModalOverlay').classList.add('open');
});
document.getElementById('noSampleClose').addEventListener('click', () => {
  document.getElementById('noSampleModalOverlay').classList.remove('open');
});
document.getElementById('noSampleModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('noSampleModalOverlay'))
    document.getElementById('noSampleModalOverlay').classList.remove('open');
});

// FLASH POINT ERROR button
document.getElementById('flashBtn').addEventListener('click', () => {
  document.getElementById('flashModalOverlay').classList.add('open');
});
document.getElementById('flashClose').addEventListener('click', () => {
  document.getElementById('flashModalOverlay').classList.remove('open');
});
document.getElementById('flashModalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('flashModalOverlay'))
    document.getElementById('flashModalOverlay').classList.remove('open');
});

// ── Search helpers ──
function expandTokens(str) {
  const tokens = [];
  str.toUpperCase().split(/[\s\/]+/).forEach(part => {
    const m = part.match(/^([A-Z]+)(\d+)-(\d+)$/);
    if (m) { for (let i = parseInt(m[2]); i <= parseInt(m[3]); i++) tokens.push(m[1] + i); }
    else if (part) tokens.push(part);
  });
  return tokens;
}

function codeMatchesFilter(code, desc, filter) {
  if (!filter) return true;
  const words = filter.trim().split(/\s+/);
  const codeTokens = expandTokens(code);
  const rules = (DATA[code] && DATA[code].rules) || [];
  return words.every(word => {
    const wLo = word.toLowerCase();
    const fTokens = expandTokens(word);
    if (fTokens.some(ft => codeTokens.some(ct => ct === ft || ct.startsWith(ft) || ft.startsWith(ct)))) return true;
    if (desc.toLowerCase().includes(wLo)) return true;
    if (rules.some(r => r.condition.toLowerCase().includes(wLo) || r.action.toLowerCase().includes(wLo))) return true;
    return false;
  });
}

function handleGlobalSearch(filter) {
  if (!filter.trim()) { renderCodeList(''); return; }
  const words = filter.trim().split(/\s+/);
  const allCodes = Object.keys(DATA);
  const ruleWords = words.filter(w => {
    const fTokens = expandTokens(w);
    return !allCodes.some(c => { const ct = expandTokens(c); return fTokens.some(ft => ct.some(t => t === ft || t.startsWith(ft) || ft.startsWith(t))); });
  });
  const matchingCodes = allCodes.filter(k => codeMatchesFilter(k, DATA[k].desc, filter));
  if (matchingCodes.length === 1) {
    selectedCode = matchingCodes[0];
    renderCodeList(filter);
    buildRightPanel(matchingCodes[0], ruleWords.join(' '));
    return;
  }
  renderCodeList(filter);
}

// ── Init ──
renderCodeList();

document.getElementById('codeSearch').addEventListener('input', (e) => {
  const val = e.target.value;
  document.getElementById('clearSearch').style.display = val ? 'block' : 'none';
  handleGlobalSearch(val);
});

document.getElementById('clearSearch').addEventListener('click', () => {
  document.getElementById('codeSearch').value = '';
  document.getElementById('clearSearch').style.display = 'none';
  handleGlobalSearch('');
});

// ── Firebase ──
const FB_DOC = 'barcoding_data';
const LS_KEY = 'barcoding_lookup_cache';

function setFbStatus(msg, color) {
  const el = document.getElementById('fbLoadStatus');
  if (el) { el.textContent = msg; el.style.color = color || '#555'; }
}

function saveToCache(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ DATA: data })); } catch(e) {}
}

function loadFromCache() {
  try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; }
}

function applyRemoteData(d) {
  if (d.DATA && typeof d.DATA === 'object') {
    Object.keys(DATA).forEach(k => { if (!d.DATA[k]) delete DATA[k]; });
    Object.keys(d.DATA).forEach(k => { DATA[k] = d.DATA[k]; });
  }
}

function saveToFirebase() {
  if (!FIREBASE_DB) return;
  FIREBASE_DB.collection('offspec').doc(FB_DOC).set({ DATA: DATA }).then(() => {
    saveToCache(DATA);
    setFbStatus('⬤ Saved', '#3ddc84');
    setTimeout(() => setFbStatus('⬤ Connected', '#3ddc84'), 2000);
  }).catch(e => {
    setFbStatus('⬤ Save failed', '#ff4d4d');
    console.warn('Firebase save error:', e);
  });
}

// ── Firebase init (uses shared firebase-init.js) ──
onFirebaseReady(function() {
  setFbStatus('⬤ Loading...', '#f5a623');
  FIREBASE_DB.collection('offspec').doc(FB_DOC).get().then(doc => {
    if (doc.exists) {
      applyRemoteData(doc.data());
      saveToCache(DATA);
      setFbStatus('⬤ Connected', '#3ddc84');
    } else {
      FIREBASE_DB.collection('offspec').doc(FB_DOC).set({ DATA: DATA }).then(() => {
        saveToCache(DATA);
        setFbStatus('⬤ Connected (seeded)', '#3ddc84');
      });
    }
    renderCodeList(document.getElementById('codeSearch').value);
    if (selectedCode && DATA[selectedCode]) selectCode(selectedCode);
  }).catch(e => {
    console.warn('Firebase load error:', e);
    const cached = loadFromCache();
    if (cached) { applyRemoteData(cached); setFbStatus('⬤ Offline (cached)', '#f5a623'); }
    else setFbStatus('⬤ Offline', '#ff4d4d');
    renderCodeList();
  });
});
