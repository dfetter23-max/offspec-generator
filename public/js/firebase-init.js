// firebase-init.js — Single Firebase initialization shared by all tools
// This replaces the 3 separate Firebase inits from the original codebase.

var FIREBASE_DB = null;
var FIREBASE_READY = false;
var _firebaseReadyCallbacks = [];

function onFirebaseReady(cb) {
  if (FIREBASE_READY) { cb(FIREBASE_DB); }
  else { _firebaseReadyCallbacks.push(cb); }
}

function _notifyFirebaseReady() {
  FIREBASE_READY = true;
  _firebaseReadyCallbacks.forEach(function(cb) { cb(FIREBASE_DB); });
  _firebaseReadyCallbacks = [];
}

(function initFirebase() {
  var cfg = {
    apiKey: "AIzaSyDIGaQ4pCQh87axYflOMcj6-B5p_AwF_kg",
    authDomain: "ec-receiving.firebaseapp.com",
    projectId: "ec-receiving",
    storageBucket: "ec-receiving.firebasestorage.app",
    messagingSenderId: "1014911293414",
    appId: "1:1014911293414:web:7fe5896b07fc800d2aa827"
  };

  var statusEl = document.getElementById("fbStatus");
  function setStatus(msg, color) {
    if (statusEl) { statusEl.innerHTML = msg; statusEl.style.color = color || "#555"; }
  }

  function loadScript(src, cb) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) { cb(); return; }
    var s = document.createElement("script");
    s.src = src;
    s.onload = cb;
    s.onerror = function() {
      setStatus("&#9679; Firebase failed to load", "#f44336");
    };
    document.head.appendChild(s);
  }

  loadScript("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js", function() {
    loadScript("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js", function() {
      if (!firebase.apps.length) {
        firebase.initializeApp(cfg);
      }
      FIREBASE_DB = firebase.firestore();
      setStatus("&#9679; Firebase connected", "#4caf50");
      _notifyFirebaseReady();
    });
  });
})();
