// hazmat-lookup.js — DOT HazMat searchable lookup + copy/insert

var hmAction = 'copy';

function hmSearch() {
  var q = (document.getElementById('hmQuery').value || '').trim().toLowerCase();
  var results = document.getElementById('hmResults');
  if (q.length < 2) { results.innerHTML = '<div style="color:#666;padding:12px;text-align:center;">Type at least 2 characters to search</div>'; return; }
  var matches = HAZMAT_TABLE.filter(function(row) {
    return row[0].toLowerCase().indexOf(q) >= 0 || row[1].toLowerCase().indexOf(q) >= 0 || row[4].toLowerCase().indexOf(q) >= 0;
  });
  if (!matches.length) { results.innerHTML = '<div style="color:#888;padding:12px;text-align:center;">No matches for "' + q + '"</div>'; return; }
  var html = '<table class="hm-table"><thead><tr><th>UN/NA</th><th>Proper Shipping Name</th><th>Class</th><th>PG</th><th></th></tr></thead><tbody>';
  matches.slice(0, 50).forEach(function(row) {
    var unna = row[0], psn = row[1], cls = row[2], pg = row[3];
    var safeArgs = "'" + unna + "','" + psn.replace(/'/g, "\\'") + "','" + cls + "','" + (pg || '') + "'";
    html += '<tr>';
    html += '<td class="hm-code">' + unna + '</td>';
    html += '<td>' + psn + '</td>';
    html += '<td style="text-align:center">' + cls + '</td>';
    html += '<td style="text-align:center">' + (pg || '') + '</td>';
    html += '<td><button class="hm-use-btn" onclick="hmUse(' + safeArgs + ')">Use</button></td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  if (matches.length > 50) html += '<div style="color:#888;font-size:13px;text-align:center;padding:8px;">Showing 50 of ' + matches.length + ' results — refine your search</div>';
  results.innerHTML = html;
}

function hmUse(unna, psn, cls, pg) {
  var parts = [psn, cls];
  if (pg) parts.push(pg);
  var fullLine = unna + ' ' + parts.join(', ');

  var action = document.querySelector('input[name="hmAction"]:checked');
  var mode = action ? action.value : 'copy';

  if (mode === 'copy') {
    navigator.clipboard.writeText(fullLine).then(function() {
      hmFlash('Copied: ' + fullLine);
    }).catch(function() {
      hmFlash('Copy failed — use manual select');
    });
  } else if (mode === 'manifest_dot') {
    var field = document.querySelector('#emaildash [data-dot-field="manifest_dot"]');
    if (field) {
      field.value = fullLine;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      hmFlash('Inserted into Manifest DOT field');
    } else {
      navigator.clipboard.writeText(fullLine).then(function() {
        hmFlash('Manifest DOT field not visible — copied to clipboard. Open an email template with {manifest_dot} first.');
      });
    }
  } else if (mode === 'sap_dot') {
    var field = document.querySelector('#emaildash [data-dot-field="sap_dot"]');
    if (field) {
      field.value = fullLine;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      hmFlash('Inserted into SAP DOT field');
    } else {
      navigator.clipboard.writeText(fullLine).then(function() {
        hmFlash('SAP DOT field not visible — copied to clipboard. Open an email template with {sap_dot} first.');
      });
    }
  }
}

function hmFlash(msg) {
  var el = document.getElementById('hmFlash');
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.style.opacity = '0'; }, 2500);
}
