// announcements.js — admin-editable sidebar announcement box, synced via Firebase
// FIREBASE_DB / onFirebaseReady provided by firebase-init.js
// requireAdmin / showToast provided by admin.js / nav.js
(function () {
  var COLLECTION = "ui";
  var DOC_ID = "announcement";
  var EMPTY_TEXT = "No announcements";

  var displayEl, editEl, inputEl, lockBtn, saveBtn, cancelBtn, colorInput;
  var currentHtml = "";
  var unsubscribe = null;
  var savedSelection = null;

  function $(id) { return document.getElementById(id); }

  // Sanitize: keep only inline formatting we support (b/strong, span style color, br, &nbsp;)
  function sanitize(html) {
    if (!html) return "";
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var allowed = { B: 1, STRONG: 1, SPAN: 1, BR: 1, FONT: 1, I: 1, EM: 1 };
    function walk(node) {
      var children = Array.prototype.slice.call(node.childNodes);
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c.nodeType === 1) {
          if (!allowed[c.tagName]) {
            // Replace disallowed element with its text content
            var text = document.createTextNode(c.textContent || "");
            node.replaceChild(text, c);
            continue;
          }
          // Strip every attribute except style (and only color from style)
          var attrs = Array.prototype.slice.call(c.attributes || []);
          for (var a = 0; a < attrs.length; a++) {
            var name = attrs[a].name;
            if (name === "style") {
              var color = (c.style && c.style.color) ? c.style.color : "";
              c.removeAttribute("style");
              if (color) c.style.color = color;
            } else if (name === "color" && c.tagName === "FONT") {
              // keep
            } else {
              c.removeAttribute(name);
            }
          }
          walk(c);
        } else if (c.nodeType !== 3) {
          // remove comments etc
          node.removeChild(c);
        }
      }
    }
    walk(tmp);
    return tmp.innerHTML;
  }

  function isEmptyHtml(html) {
    if (!html) return true;
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return !tmp.textContent.trim();
  }

  function renderDisplay(html) {
    if (isEmptyHtml(html)) {
      displayEl.textContent = EMPTY_TEXT;
      displayEl.classList.add("ann-empty");
    } else {
      displayEl.innerHTML = html;
      displayEl.classList.remove("ann-empty");
    }
  }

  function loadFromFirebase() {
    if (!FIREBASE_DB) return;
    if (unsubscribe) { try { unsubscribe(); } catch (e) {} }
    unsubscribe = FIREBASE_DB.collection(COLLECTION).doc(DOC_ID).onSnapshot(function (doc) {
      var d = doc.exists ? doc.data() : {};
      currentHtml = d && d.html ? d.html : "";
      renderDisplay(currentHtml);
    }, function (err) { console.warn("[announcements] listener error:", err); });
  }

  function saveToFirebase(html) {
    if (!FIREBASE_DB) {
      if (typeof showToast === "function") showToast("Firebase not connected", "error");
      return Promise.reject(new Error("no firebase"));
    }
    return FIREBASE_DB.collection(COLLECTION).doc(DOC_ID).set({
      html: html,
      updatedAt: new Date().toISOString()
    });
  }

  function saveSelection() {
    var sel = window.getSelection();
    if (sel && sel.rangeCount && inputEl.contains(sel.anchorNode)) {
      savedSelection = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    inputEl.focus();
    if (savedSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelection);
    } else {
      // place cursor at end
      var range = document.createRange();
      range.selectNodeContents(inputEl);
      range.collapse(false);
      var sel2 = window.getSelection();
      sel2.removeAllRanges();
      sel2.addRange(range);
    }
  }

  function exec(cmd, val) {
    restoreSelection();
    document.execCommand(cmd, false, val == null ? null : val);
    saveSelection();
  }

  function insertEmoji(emoji) {
    restoreSelection();
    document.execCommand("insertText", false, emoji);
    saveSelection();
  }

  function enterEditMode() {
    inputEl.innerHTML = currentHtml;
    editEl.style.display = "";
    displayEl.style.display = "none";
    lockBtn.style.display = "none";
    setTimeout(function () {
      inputEl.focus();
      var range = document.createRange();
      range.selectNodeContents(inputEl);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      saveSelection();
    }, 30);
  }

  function exitEditMode() {
    editEl.style.display = "none";
    displayEl.style.display = "";
    lockBtn.style.display = "";
    savedSelection = null;
  }

  function init() {
    displayEl = $("annDisplay");
    editEl = $("annEdit");
    inputEl = $("annInput");
    lockBtn = $("annLockBtn");
    saveBtn = $("annSaveBtn");
    cancelBtn = $("annCancelBtn");
    colorInput = $("annColor");
    if (!displayEl || !editEl) return;

    inputEl.setAttribute("data-placeholder", "Type announcement…");

    lockBtn.addEventListener("click", function () {
      if (typeof requireAdmin === "function") {
        requireAdmin("announcement", function () { enterEditMode(); });
      } else {
        enterEditMode();
      }
    });

    cancelBtn.addEventListener("click", function () { exitEditMode(); });

    saveBtn.addEventListener("click", function () {
      var html = sanitize(inputEl.innerHTML.trim());
      saveToFirebase(html).then(function () {
        currentHtml = html;
        renderDisplay(currentHtml);
        exitEditMode();
        if (typeof showToast === "function") showToast("Announcement updated", "ok");
      }).catch(function (err) {
        if (err && err.message && typeof showToast === "function") {
          showToast("Save failed: " + err.message, "error");
        }
      });
    });

    // Toolbar buttons (bold + emojis)
    Array.prototype.forEach.call(editEl.querySelectorAll(".ann-tool"), function (btn) {
      // mousedown: prevent stealing focus, but capture current selection first
      btn.addEventListener("mousedown", function (e) {
        saveSelection();
        e.preventDefault();
      });
      btn.addEventListener("click", function () {
        var act = btn.getAttribute("data-act");
        var emoji = btn.getAttribute("data-emoji");
        if (act === "bold") exec("bold");
        else if (emoji) insertEmoji(emoji);
      });
    });

    // Color picker — keep selection while picker opens, apply on input
    colorInput.addEventListener("mousedown", function () { saveSelection(); });
    colorInput.addEventListener("input", function () {
      exec("foreColor", colorInput.value);
    });
    colorInput.addEventListener("change", function () {
      exec("foreColor", colorInput.value);
    });

    // Track selection on the contentEditable so toolbar actions land in the right place
    inputEl.addEventListener("keyup", saveSelection);
    inputEl.addEventListener("mouseup", saveSelection);
    inputEl.addEventListener("focus", saveSelection);

    // Plain-text paste only
    inputEl.addEventListener("paste", function (e) {
      e.preventDefault();
      var text = ((e.clipboardData || window.clipboardData).getData("text") || "");
      document.execCommand("insertText", false, text);
    });

    // Esc to cancel, Ctrl/Cmd+Enter to save
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); exitEditMode(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); saveBtn.click(); }
    });

    if (typeof onFirebaseReady === "function") {
      onFirebaseReady(function () { loadFromFirebase(); });
    } else if (typeof FIREBASE_DB !== "undefined" && FIREBASE_DB) {
      loadFromFirebase();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
