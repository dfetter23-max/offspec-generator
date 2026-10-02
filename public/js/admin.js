// admin.js — Centralized admin authentication
var ADMIN_PASSWORD = "dfetter";
var _adminState = {};

function isAdmin(tool) {
  return !!_adminState[tool];
}

function setAdmin(tool, val) {
  _adminState[tool] = !!val;
}

function requireAdmin(tool, cb) {
  if (isAdmin(tool)) { cb(); return; }
  showModal('Admin Password', { placeholder: 'Enter password...', inputType: 'password' }).then(function(pw) {
    if (pw === null) return;
    if (pw === ADMIN_PASSWORD) {
      setAdmin(tool, true);
      cb();
    } else {
      showToast('Incorrect password', 'error');
    }
  });
}
