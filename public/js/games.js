// games.js — 6 games + shared Firestore leaderboard + help + admin clear

var GAMES_PLAYER = localStorage.getItem('games_player') || '';
var GAMES_CURRENT = 'whackmole';

function gamesEnsurePlayer(cb) {
  if (GAMES_PLAYER) { cb(); return; }
  showModal('Enter your name for the leaderboard', { placeholder: 'Your name...' }).then(function(name) {
    if (!name || !name.trim()) return;
    GAMES_PLAYER = name.trim();
    localStorage.setItem('games_player', GAMES_PLAYER);
    document.getElementById('gPlayerName').textContent = GAMES_PLAYER;
    cb();
  });
}

function gamesChangeName() {
  showModal('Enter new name', { placeholder: 'Your name...', defaultValue: GAMES_PLAYER }).then(function(name) {
    if (!name || !name.trim()) return;
    GAMES_PLAYER = name.trim();
    localStorage.setItem('games_player', GAMES_PLAYER);
    document.getElementById('gPlayerName').textContent = GAMES_PLAYER;
  });
}

function switchGame(id) {
  GAMES_CURRENT = id;
  document.querySelectorAll('.g-panel').forEach(function(p) { p.style.display = 'none'; });
  document.getElementById('g_' + id).style.display = 'block';
  document.querySelectorAll('.g-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelector('.g-tab[data-g="' + id + '"]').classList.add('active');
  loadLeaderboard(id);
}

// ── Help / Rules Popup ──
var GAME_RULES = {
  whackmole: {
    title: 'Whack-a-Mole',
    rules: [
      'Moles pop up in random holes — click them before they disappear!',
      'You have 30 seconds. Each hit = 1 point.',
      'Moles get faster as your score goes up.',
      'Clicking an empty hole does nothing (but you look silly).',
      'Highest score wins!'
    ]
  },
  memory: {
    title: 'Memory Match',
    rules: [
      'Click cards to flip them over — find matching pairs.',
      'You can only flip 2 cards at a time.',
      'If they match, they stay face up. If not, they flip back.',
      'Try to match all 8 pairs in as few moves as possible.',
      'Fewest moves wins!'
    ]
  },
  tetris: {
    title: 'Tetris',
    rules: [
      '\u2190 \u2192 Arrow keys — move piece left/right',
      '\u2191 Arrow key — rotate piece',
      '\u2193 Arrow key — soft drop (faster)',
      'Spacebar — hard drop (instant)',
      'Complete a full row to clear it and score points.',
      'Clearing multiple rows at once scores bonus points.',
      'Game ends when pieces stack to the top.',
      'Highest score wins!'
    ]
  },
  wordscramble: {
    title: 'Word Scramble',
    rules: [
      'A scrambled word appears — type the correct word and hit Enter or Check.',
      'You have 60 seconds. Words come from random categories.',
      'Click Skip if you\u2019re stuck (no penalty, but it burns time).',
      'Categories include: movies, animals, food, sports, countries, and more.',
      'Most correct words in 60 seconds wins!'
    ]
  },
  '2048': {
    title: '2048',
    rules: [
      'Use arrow keys to slide all tiles in one direction.',
      'When two tiles with the same number collide, they merge into one.',
      'A new tile (2 or 4) appears after each move.',
      'Try to create the highest tile possible.',
      'Game ends when no moves are left.',
      'Highest score wins!'
    ]
  },
  flappy: {
    title: 'Flappy Bird',
    rules: [
      'Press Space or click the canvas to flap.',
      'Navigate through the gaps in the green pipes.',
      'Each pipe you pass = 1 point.',
      'Don\u2019t hit the pipes, ground, or ceiling!',
      'Highest score wins!'
    ]
  },
  brickbreaker: {
    title: 'Brick Breaker',
    rules: [
      'Move your mouse to control the paddle.',
      'Bounce the ball to break all the bricks.',
      'Each brick = 10 points.',
      'You have 3 lives \u2014 don\u2019t let the ball fall!',
      'Clear all bricks or survive as long as you can.',
      'Highest score wins!'
    ]
  },
  typing: {
    title: 'Typing Speed',
    rules: [
      'A sentence appears \u2014 type it as fast as you can.',
      'Green letters = correct. Red = wrong.',
      'Your WPM (words per minute) updates live.',
      'The test ends when you type the full sentence.',
      'Highest WPM wins!'
    ]
  },
  wordguess: {
    title: 'Word Guess',
    rules: [
      'Guess the 5-letter word in 6 tries.',
      'Type a word and press Enter to submit.',
      'Green = correct letter, correct position.',
      'Yellow = correct letter, wrong position.',
      'Gray = letter not in the word.',
      'Use the on-screen keyboard or your real one.',
      'Most total wins on the leaderboard!'
    ]
  },
  gemcrush: {
    title: 'Gem Crush',
    rules: [
      'Click a gem, then click an adjacent gem to swap them.',
      'Match 3 or more of the same color in a row or column.',
      'Matched gems disappear and new ones fall in.',
      'Chain reactions score bonus points!',
      'You have 60 seconds.',
      'Highest score wins!'
    ]
  },
  minesweeper: {
    title: 'Minesweeper',
    rules: [
      'Click a cell to reveal it.',
      'Numbers show how many mines are adjacent.',
      'Right-click (or long-press) to flag a suspected mine.',
      'Reveal all non-mine cells to win.',
      'If you hit a mine, game over!',
      'Fastest completion time wins!'
    ]
  },
  pacman: {
    title: 'Pac-Man',
    rules: [
      'Arrow keys to move through the maze.',
      'Eat all the dots to clear the level.',
      'Avoid the ghosts \u2014 they chase you!',
      'Eat a power pellet (big dot) to turn ghosts blue \u2014 eat them for bonus points!',
      'You have 3 lives.',
      'Highest score wins!'
    ]
  },
  frogger: {
    title: 'Frogger',
    rules: [
      'Arrow keys to move your frog.',
      'Cross the road \u2014 avoid the cars!',
      'Cross the river \u2014 hop on the logs!',
      'Reach the top to score a point.',
      'You have 3 lives.',
      'Highest score wins!'
    ]
  },
  cookie: {
    title: 'Cookie Clicker',
    rules: [
      'Click the cookie to earn cookies.',
      'Buy upgrades to earn cookies automatically.',
      'You have 2 minutes \u2014 get as many cookies as possible.',
      'Upgrades get more expensive each time you buy.',
      'Strategy: balance clicking with buying upgrades.',
      'Most cookies at the end wins!'
    ]
  },
  spelling: {
    title: 'Spelling Bee',
    rules: [
      'Make words using the 7 letters shown.',
      'Every word MUST contain the center (gold) letter.',
      'Words must be at least 4 letters long.',
      'Letters can be reused.',
      'Each word scores: 4 letters = 1pt, 5+ = length pts.',
      'Pangram (uses all 7 letters) = bonus 7 pts!',
      'Highest score wins!'
    ]
  }
};

function showGameHelp(game) {
  var info = GAME_RULES[game];
  if (!info) return;
  var existing = document.getElementById('gameHelpModal');
  if (existing) existing.remove();
  var overlay = document.createElement('div');
  overlay.id = 'gameHelpModal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:2000;display:flex;align-items:center;justify-content:center;';
  var box = document.createElement('div');
  box.style.cssText = 'background:#131320;border:1px solid #3a3a5a;border-radius:12px;padding:24px;width:400px;max-width:90vw;';
  var h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">';
  h += '<span style="font-family:Syne,sans-serif;font-size:19px;font-weight:700;color:#fff;">' + info.title + '</span>';
  h += '<span onclick="document.getElementById(\'gameHelpModal\').remove()" style="cursor:pointer;color:#888;font-size:20px;">\u2715</span></div>';
  h += '<div style="font-size:14px;color:#bbb;line-height:1.8;">';
  info.rules.forEach(function(r) { h += '<div style="padding:2px 0;">\u2022 ' + r + '</div>'; });
  h += '</div>';
  h += '<div style="margin-top:16px;text-align:right;"><button onclick="document.getElementById(\'gameHelpModal\').remove()" style="padding:6px 20px;background:linear-gradient(135deg,#5b8aff,#7c5bff);border:none;border-radius:6px;color:#fff;font-family:Syne,sans-serif;font-size:15px;font-weight:700;cursor:pointer;">Got it</button></div>';
  box.innerHTML = h;
  overlay.appendChild(box);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ── Firestore Leaderboard ──
function postScore(game, score) {
  if (!FIREBASE_DB || !GAMES_PLAYER) return;
  FIREBASE_DB.collection('game_scores').add({
    game: game, name: GAMES_PLAYER, score: score, date: new Date().toISOString()
  }).then(function() { loadLeaderboard(game); }).catch(function(e) { console.warn('Score post failed:', e); });
}

function loadLeaderboard(game) {
  var el = document.getElementById('gLb_' + game);
  if (!el) return;
  if (!FIREBASE_DB) { el.innerHTML = '<div style="color:#666;font-size:13px;">Leaderboard unavailable offline</div>'; return; }
  var isLowerBetter = (game === 'memory' || game === 'minesweeper');
  FIREBASE_DB.collection('game_scores').get().then(function(snap) {
    var best = {};
    snap.forEach(function(doc) {
      var d = doc.data();
      if (d.game !== game) return;
      if (!best[d.name]) { best[d.name] = d.score; }
      else {
        if (isLowerBetter) { if (d.score < best[d.name]) best[d.name] = d.score; }
        else { if (d.score > best[d.name]) best[d.name] = d.score; }
      }
    });
    var sorted = Object.keys(best).map(function(n) { return { name: n, score: best[n] }; });
    sorted.sort(function(a, b) { return isLowerBetter ? a.score - b.score : b.score - a.score; });
    sorted = sorted.slice(0, 8);
    var html = '';
    sorted.forEach(function(row, i) {
      var medal = i === 0 ? ' g-gold' : '';
      html += '<div class="g-lb-row' + medal + '"><span class="g-lb-rank">' + (i + 1) + '.</span><span class="g-lb-name">' + row.name + '</span><span class="g-lb-score">' + row.score + '</span></div>';
    });
    if (!sorted.length) html = '<div style="color:#666;font-size:13px;">No scores yet \u2014 be the first!</div>';
    if (typeof isAdmin === 'function' && isAdmin('games')) {
      html += '<div style="margin-top:8px;text-align:right;"><button onclick="clearLeaderboard(\'' + game + '\')" style="padding:4px 10px;background:transparent;border:1px solid #ff5b5b;border-radius:4px;color:#ff5b5b;font-size:12px;cursor:pointer;font-family:JetBrains Mono,monospace;">Clear board</button></div>';
    }
    el.innerHTML = html;
  }).catch(function(err) { console.error('Leaderboard load failed:', err); el.innerHTML = '<div style="color:#666;font-size:13px;">Could not load scores — check console</div>'; });
}

function clearLeaderboard(game) {
  if (!confirm('Clear ALL scores for ' + game + '? This cannot be undone.')) return;
  if (!FIREBASE_DB) return;
  FIREBASE_DB.collection('game_scores').get().then(function(snap) {
    var batch = FIREBASE_DB.batch();
    snap.forEach(function(doc) {
      if (doc.data().game === game) batch.delete(doc.ref);
    });
    return batch.commit();
  }).then(function() {
    loadLeaderboard(game);
  }).catch(function(e) { showToast('Error clearing: ' + e.message, 'error'); });
}

// ════════════════════════════════════════
// 1. WHACK-A-MOLE
// ════════════════════════════════════════
var wam = { score: 0, timeLeft: 30, active: -1, on: false, moleT: null, clockT: null };

function wamInit() {
  var grid = document.getElementById('wamGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (var i = 0; i < 16; i++) {
    var h = document.createElement('div'); h.className = 'wam-hole'; h.dataset.i = i;
    var m = document.createElement('div'); m.className = 'wam-mole';
    h.appendChild(m);
    h.addEventListener('click', function() { wamWhack(this); });
    grid.appendChild(h);
  }
}
function wamStart() {
  gamesEnsurePlayer(function() {
    wam.score = 0; wam.timeLeft = 30; wam.on = true; wam.active = -1;
    document.getElementById('wamScore').textContent = '0';
    document.getElementById('wamTimer').textContent = '30s';
    document.getElementById('wamTimer').style.color = '';
    document.getElementById('wamBtn').disabled = true;
    document.getElementById('wamMsg').textContent = '';
    document.getElementById('wamGrid').querySelectorAll('.wam-hole').forEach(function(h) { h.classList.remove('hit', 'miss'); });
    wamPop();
    wam.clockT = setInterval(function() {
      wam.timeLeft--;
      document.getElementById('wamTimer').textContent = wam.timeLeft + 's';
      if (wam.timeLeft <= 5) document.getElementById('wamTimer').style.color = '#E24B4A';
      if (wam.timeLeft <= 0) wamEnd();
    }, 1000);
  });
}
function wamPop() {
  if (!wam.on) return;
  var holes = document.getElementById('wamGrid').querySelectorAll('.wam-hole');
  if (wam.active >= 0) holes[wam.active].querySelector('.wam-mole').classList.remove('up');
  var next; do { next = Math.floor(Math.random() * 16); } while (next === wam.active);
  wam.active = next;
  holes[wam.active].querySelector('.wam-mole').classList.add('up');
  var speed = Math.max(450, 1200 - wam.score * 25);
  wam.moleT = setTimeout(function() {
    if (wam.on && wam.active >= 0) { holes[wam.active].querySelector('.wam-mole').classList.remove('up'); wamPop(); }
  }, speed);
}
function wamWhack(hole) {
  if (!wam.on) return;
  var idx = parseInt(hole.dataset.i);
  if (idx === wam.active) {
    wam.score++; document.getElementById('wamScore').textContent = wam.score;
    hole.classList.add('hit'); hole.querySelector('.wam-mole').classList.remove('up');
    setTimeout(function() { hole.classList.remove('hit'); }, 200);
    clearTimeout(wam.moleT); wam.active = -1; setTimeout(wamPop, 150);
  } else { hole.classList.add('miss'); setTimeout(function() { hole.classList.remove('miss'); }, 200); }
}
function wamEnd() {
  wam.on = false; clearTimeout(wam.moleT); clearInterval(wam.clockT);
  var holes = document.getElementById('wamGrid').querySelectorAll('.wam-hole');
  if (wam.active >= 0) holes[wam.active].querySelector('.wam-mole').classList.remove('up');
  wam.active = -1;
  document.getElementById('wamBtn').disabled = false;
  document.getElementById('wamTimer').style.color = '';
  document.getElementById('wamMsg').textContent = 'Final score: ' + wam.score + '!';
  postScore('whackmole', wam.score);
}

// ════════════════════════════════════════
// 2. MEMORY MATCH
// ════════════════════════════════════════
var mem = { cards: [], flipped: [], matched: 0, moves: 0, locked: false, total: 8 };
var MEM_ICONS = ['\u2660', '\u2665', '\u2666', '\u2663', '\u2605', '\u26A1', '\u266A', '\u2600'];

function memStart() {
  gamesEnsurePlayer(function() {
    mem.matched = 0; mem.moves = 0; mem.locked = false; mem.flipped = [];
    document.getElementById('memMoves').textContent = '0';
    document.getElementById('memMsg').textContent = '';
    var icons = MEM_ICONS.slice(0, mem.total);
    var deck = icons.concat(icons);
    for (var i = deck.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = deck[i]; deck[i] = deck[j]; deck[j] = tmp; }
    mem.cards = deck;
    var grid = document.getElementById('memGrid'); grid.innerHTML = '';
    deck.forEach(function(icon, idx) {
      var card = document.createElement('div'); card.className = 'mem-card'; card.dataset.i = idx;
      card.innerHTML = '<div class="mem-inner"><div class="mem-front">?</div><div class="mem-back">' + icon + '</div></div>';
      card.addEventListener('click', function() { memFlip(this); });
      grid.appendChild(card);
    });
  });
}
function memFlip(card) {
  if (mem.locked) return;
  var idx = parseInt(card.dataset.i);
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  if (mem.flipped.length >= 2) return;
  card.classList.add('flipped');
  mem.flipped.push({ idx: idx, el: card });
  if (mem.flipped.length === 2) {
    mem.moves++; document.getElementById('memMoves').textContent = mem.moves;
    var a = mem.flipped[0], b = mem.flipped[1];
    if (mem.cards[a.idx] === mem.cards[b.idx]) {
      a.el.classList.add('matched'); b.el.classList.add('matched');
      mem.matched++; mem.flipped = [];
      if (mem.matched === mem.total) {
        document.getElementById('memMsg').textContent = 'Done in ' + mem.moves + ' moves!';
        postScore('memory', mem.moves);
      }
    } else {
      mem.locked = true;
      setTimeout(function() { a.el.classList.remove('flipped'); b.el.classList.remove('flipped'); mem.flipped = []; mem.locked = false; }, 700);
    }
  }
}

// ════════════════════════════════════════
// 3. TETRIS
// ════════════════════════════════════════
var tet = { board: null, piece: null, px: 0, py: 0, pi: 0, score: 0, on: false, timer: null, speed: 500 };
var TET_W = 10, TET_H = 20;
var TET_SHAPES = [[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]]];
var TET_COLORS = ['#00e5ff','#f0c060','#b06ce0','#ff6b35','#5b8aff','#5bff8a','#ff5b8a'];

function tetDraw() {
  var el = document.getElementById('tetBoard'); if (!el) return;
  // Build display grid with piece overlaid
  var display = [];
  for (var r = 0; r < TET_H; r++) {
    display[r] = [];
    for (var c = 0; c < TET_W; c++) {
      display[r][c] = tet.board[r][c] || '';
    }
  }
  if (tet.piece) {
    var color = TET_COLORS[tet.pi];
    for (var r = 0; r < tet.piece.length; r++) for (var c = 0; c < tet.piece[r].length; c++) {
      if (tet.piece[r][c]) {
        var dr = tet.py + r, dc = tet.px + c;
        if (dr >= 0 && dr < TET_H && dc >= 0 && dc < TET_W) display[dr][dc] = color;
      }
    }
  }
  var html = '';
  for (var r = 0; r < TET_H; r++) for (var c = 0; c < TET_W; c++) {
    var clr = display[r][c];
    if (clr) {
      html += '<div class="tet-cell tet-filled" style="background:' + clr + ';box-shadow:inset 0 0 0 1px rgba(255,255,255,0.15);"></div>';
    } else {
      html += '<div class="tet-cell"></div>';
    }
  }
  el.innerHTML = html;
}
function tetNew() {
  tet.pi = Math.floor(Math.random() * TET_SHAPES.length);
  tet.piece = TET_SHAPES[tet.pi].map(function(r) { return r.slice(); });
  tet.px = Math.floor((TET_W - tet.piece[0].length) / 2); tet.py = 0;
  if (!tetFits(tet.piece, tet.px, tet.py)) { tetEnd(); return false; }
  return true;
}
function tetFits(piece, px, py) {
  for (var r = 0; r < piece.length; r++) for (var c = 0; c < piece[r].length; c++) {
    if (!piece[r][c]) continue; var nx = px + c, ny = py + r;
    if (nx < 0 || nx >= TET_W || ny >= TET_H) return false;
    if (ny >= 0 && tet.board[ny][nx]) return false;
  } return true;
}
function tetLock() {
  var color = TET_COLORS[tet.pi];
  for (var r = 0; r < tet.piece.length; r++) for (var c = 0; c < tet.piece[r].length; c++) {
    if (tet.piece[r][c] && tet.py + r >= 0) tet.board[tet.py + r][tet.px + c] = color;
  }
  var lines = 0;
  for (var r = TET_H - 1; r >= 0; r--) {
    if (tet.board[r].every(function(v) { return !!v; })) { tet.board.splice(r, 1); tet.board.unshift(new Array(TET_W).fill(null)); lines++; r++; }
  }
  if (lines) { var pts = [0, 100, 300, 500, 800]; tet.score += pts[lines] || lines * 200; var oldSpeed = tet.speed; tet.speed = Math.max(100, 500 - Math.floor(tet.score / 500) * 30); document.getElementById('tetScore').textContent = tet.score; if (tet.speed !== oldSpeed) tetResetTimer(); }
}
function tetRotate() {
  var p = tet.piece, rows = p.length, cols = p[0].length, np = [];
  for (var c = 0; c < cols; c++) { np[c] = []; for (var r = rows - 1; r >= 0; r--) np[c].push(p[r][c]); }
  if (tetFits(np, tet.px, tet.py)) tet.piece = np;
}
function tetMove(dx) { if (tetFits(tet.piece, tet.px + dx, tet.py)) tet.px += dx; }
function tetDrop() {
  if (tetFits(tet.piece, tet.px, tet.py + 1)) tet.py++;
  else { tetLock(); tetNew(); }
  tetDraw();
}
function tetHardDrop() { while (tetFits(tet.piece, tet.px, tet.py + 1)) tet.py++; tetLock(); tetNew(); tetDraw(); }
function tetStart() {
  gamesEnsurePlayer(function() {
    tet.board = [];
    for (var r = 0; r < TET_H; r++) tet.board.push(new Array(TET_W).fill(null));
    tet.score = 0; tet.speed = 500; tet.on = true;
    document.getElementById('tetScore').textContent = '0';
    document.getElementById('tetMsg').textContent = '';
    document.getElementById('tetBtn').disabled = true;
    tetNew(); tetDraw();
    tetResetTimer();
  });
}
function tetResetTimer() {
  clearInterval(tet.timer);
  tet.timer = setInterval(function() { if (tet.on) tetDrop(); }, tet.speed);
}
function tetEnd() {
  tet.on = false; clearInterval(tet.timer); tet.piece = null; tetDraw();
  document.getElementById('tetBtn').disabled = false;
  document.getElementById('tetMsg').textContent = 'Game over! Score: ' + tet.score;
  postScore('tetris', tet.score);
}
function tetKey(e) {
  if (!tet.on) return;
  if (e.key === 'ArrowLeft') { tetMove(-1); tetDraw(); e.preventDefault(); }
  else if (e.key === 'ArrowRight') { tetMove(1); tetDraw(); e.preventDefault(); }
  else if (e.key === 'ArrowDown') { tetDrop(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { tetRotate(); tetDraw(); e.preventDefault(); }
  else if (e.key === ' ') { tetHardDrop(); e.preventDefault(); }
}

// ════════════════════════════════════════
// 5. WORD SCRAMBLE
// ════════════════════════════════════════
var WS_CATEGORIES = {
  'Movies': ['inception','gladiator','interstellar','titanic','jaws','avatar','frozen','scarface','aliens','goodfellas','braveheart','departed','godfather','matrix','predator','terminator','beetlejuice','clueless','ghostbusters','shrek'],
  'Animals': ['elephant','giraffe','penguin','dolphin','cheetah','kangaroo','octopus','flamingo','gorilla','butterfly','crocodile','chameleon','hedgehog','platypus','armadillo','porcupine','jellyfish','seahorse','scorpion','tortoise'],
  'Food': ['pepperoni','spaghetti','guacamole','croissant','hamburger','pineapple','cinnamon','chocolate','enchilada','cheesecake','quesadilla','dumpling','pancakes','macaroni','popsicle','meatball','jalapeno','avocado','lasagna','sandwich'],
  'Sports': ['basketball','football','baseball','swimming','volleyball','gymnastics','wrestling','snowboard','badminton','marathon','lacrosse','skateboard','surfing','archery','bowling','fencing','kayaking','cricket','handball','triathlon'],
  'Countries': ['australia','argentina','portugal','thailand','colombia','ethiopia','indonesia','singapore','switzerland','venezuela','cambodia','guatemala','mozambique','nicaragua','pakistan','romania','tanzania','uruguay','zimbabwe','morocco'],
  'Music': ['saxophone','harmonica','accordion','xylophone','tambourine','trombone','mandolin','clarinet','marimba','keyboard','ukulele','triangle','drumstick','amplifier','microphone','headphone','symphony','acoustic','baritone','falsetto'],
  '90s/2000s': ['tamagotchi','blockbuster','discman','playstation','myspace','napster','limewire','motorola','blackberry','geocities','walkman','gameboy','dialup','beeper','floppy','ringtone','chatroom','screensaver','bluetooth','download'],
  'Office Life': ['deadline','meetings','coworker','cubicle','overtime','promotion','schedule','breakroom','paperwork','voicemail','stapler','keyboard','password','printout','calendar','commute','paycheck','training','clipboard','turnover']
};

var ws = { word: '', scrambled: '', found: 0, timeLeft: 60, on: false, timer: null, used: [], cat: '' };

function wsScramble(w) {
  var a = w.split('');
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a.join('') === w ? wsScramble(w) : a.join('');
}
function wsNext() {
  // Pick random category, then random word from it
  var cats = Object.keys(WS_CATEGORIES);
  var attempts = 0;
  var word, cat;
  do {
    cat = cats[Math.floor(Math.random() * cats.length)];
    var pool = WS_CATEGORIES[cat].filter(function(w) { return ws.used.indexOf(w) < 0; });
    if (pool.length) { word = pool[Math.floor(Math.random() * pool.length)]; }
    attempts++;
  } while (!word && attempts < 50);
  if (!word) { ws.used = []; return wsNext(); }
  ws.word = word;
  ws.cat = cat;
  ws.used.push(ws.word);
  ws.scrambled = wsScramble(ws.word);
  document.getElementById('wsScrambled').textContent = ws.scrambled.toUpperCase();
  document.getElementById('wsCat').textContent = cat;
  document.getElementById('wsInput').value = '';
  document.getElementById('wsInput').focus();
  document.getElementById('wsFeedback').textContent = '';
}
function wsCheck() {
  if (!ws.on) return;
  var guess = document.getElementById('wsInput').value.trim().toLowerCase();
  if (guess === ws.word) {
    ws.found++; document.getElementById('wsFound').textContent = ws.found;
    document.getElementById('wsFeedback').textContent = '\u2705 Correct!';
    document.getElementById('wsFeedback').style.color = '#5bff8a';
    setTimeout(wsNext, 500);
  } else {
    document.getElementById('wsFeedback').textContent = '\u274C Try again';
    document.getElementById('wsFeedback').style.color = '#ff5b5b';
  }
}
function wsSkip() {
  if (!ws.on) return;
  document.getElementById('wsFeedback').textContent = 'It was: ' + ws.word.toUpperCase();
  document.getElementById('wsFeedback').style.color = '#f0c060';
  setTimeout(wsNext, 800);
}
function wsStart() {
  gamesEnsurePlayer(function() {
    ws.found = 0; ws.timeLeft = 60; ws.on = true; ws.used = [];
    document.getElementById('wsFound').textContent = '0';
    document.getElementById('wsTimer').textContent = '60s';
    document.getElementById('wsTimer').style.color = '';
    document.getElementById('wsBtn').disabled = true;
    document.getElementById('wsInput').disabled = false;
    document.getElementById('wsMsg').textContent = '';
    wsNext();
    ws.timer = setInterval(function() {
      ws.timeLeft--;
      document.getElementById('wsTimer').textContent = ws.timeLeft + 's';
      if (ws.timeLeft <= 10) document.getElementById('wsTimer').style.color = '#E24B4A';
      if (ws.timeLeft <= 0) wsEnd();
    }, 1000);
  });
}
function wsEnd() {
  ws.on = false; clearInterval(ws.timer);
  document.getElementById('wsBtn').disabled = false;
  document.getElementById('wsInput').disabled = true;
  document.getElementById('wsFeedback').textContent = '';
  document.getElementById('wsMsg').textContent = 'Time up! You got ' + ws.found + ' words!';
  postScore('wordscramble', ws.found);
}

// ════════════════════════════════════════
// 6. 2048
// ════════════════════════════════════════
var g48 = { board: null, score: 0, on: false };

function g48Add() {
  var empty = [];
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { if (!g48.board[r][c]) empty.push({ r: r, c: c }); }
  if (!empty.length) return;
  var cell = empty[Math.floor(Math.random() * empty.length)];
  g48.board[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
}
function g48Draw() {
  var grid = document.getElementById('g48Grid'); if (!grid) return;
  grid.innerHTML = '';
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
    var v = g48.board[r][c];
    var tile = document.createElement('div');
    tile.className = 'g48-tile g48-v' + (v > 2048 ? 'big' : v);
    tile.textContent = v || '';
    grid.appendChild(tile);
  }
  document.getElementById('g48Score').textContent = g48.score;
}
function g48Slide(row) {
  var a = row.filter(function(v) { return v !== 0; }), merged = [];
  for (var i = 0; i < a.length; i++) {
    if (i + 1 < a.length && a[i] === a[i + 1]) { merged.push(a[i] * 2); g48.score += a[i] * 2; i++; }
    else { merged.push(a[i]); }
  }
  while (merged.length < 4) merged.push(0);
  return merged;
}
function g48Move(dir) {
  if (!g48.on) return;
  var b = g48.board, nb = b.map(function(r) { return r.slice(); }), moved = false;
  if (dir === 'left') { for (var r = 0; r < 4; r++) nb[r] = g48Slide(nb[r]); }
  else if (dir === 'right') { for (var r = 0; r < 4; r++) nb[r] = g48Slide(nb[r].reverse()).reverse(); }
  else if (dir === 'up') { for (var c = 0; c < 4; c++) { var col = [nb[0][c],nb[1][c],nb[2][c],nb[3][c]]; col = g48Slide(col); for (var r = 0; r < 4; r++) nb[r][c] = col[r]; } }
  else if (dir === 'down') { for (var c = 0; c < 4; c++) { var col = [nb[3][c],nb[2][c],nb[1][c],nb[0][c]]; col = g48Slide(col); for (var r = 0; r < 4; r++) nb[3-r][c] = col[r]; } }
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { if (nb[r][c] !== b[r][c]) moved = true; }
  if (moved) {
    g48.board = nb; g48Add(); g48Draw();
    if (g48CheckEnd()) { g48.on = false; document.getElementById('g48Msg').textContent = 'Game over! Score: ' + g48.score; postScore('2048', g48.score); }
  }
}
function g48CheckEnd() {
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
    if (!g48.board[r][c]) return false;
    if (c < 3 && g48.board[r][c] === g48.board[r][c + 1]) return false;
    if (r < 3 && g48.board[r][c] === g48.board[r + 1][c]) return false;
  } return true;
}
function g48Start() {
  gamesEnsurePlayer(function() {
    g48.board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    g48.score = 0; g48.on = true;
    g48Add(); g48Add(); g48Draw();
    document.getElementById('g48Msg').textContent = '';
  });
}
function g48Key(e) {
  if (!g48.on) return;
  var map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  if (map[e.key]) { g48Move(map[e.key]); e.preventDefault(); }
}

// ════════════════════════════════════════
// 7. FLAPPY BIRD
// ════════════════════════════════════════
var flp = { on: false, y: 0, vy: 0, pipes: [], score: 0, frame: 0, timer: null };
var FLP_W = 320, FLP_H = 400, FLP_G = 0.35, FLP_FLAP = -6, FLP_GAP = 120, FLP_PIPE_W = 40, FLP_SPEED = 2.5;

function flpDraw() {
  var c = document.getElementById('flpCanvas'); if (!c) return;
  var ctx = c.getContext('2d');
  c.width = FLP_W; c.height = FLP_H;
  ctx.fillStyle = '#0a0a14'; ctx.fillRect(0, 0, FLP_W, FLP_H);
  // Ground
  ctx.fillStyle = '#1a2a1a'; ctx.fillRect(0, FLP_H - 30, FLP_W, 30);
  // Pipes
  ctx.fillStyle = '#2a9a4a';
  flp.pipes.forEach(function(p) {
    ctx.fillRect(p.x, 0, FLP_PIPE_W, p.top);
    ctx.fillRect(p.x, p.top + FLP_GAP, FLP_PIPE_W, FLP_H - p.top - FLP_GAP);
  });
  // Bird
  ctx.fillStyle = '#f0c060';
  ctx.fillRect(60, flp.y, 20, 16);
  ctx.fillStyle = '#ff6b35';
  ctx.fillRect(76, flp.y + 6, 8, 4);
  // Score
  ctx.fillStyle = '#fff'; ctx.font = 'bold 24px JetBrains Mono, monospace';
  ctx.textAlign = 'center'; ctx.fillText(flp.score, FLP_W / 2, 40);
}

function flpStep() {
  if (!flp.on) return;
  flp.vy += FLP_G;
  flp.y += flp.vy;
  flp.frame++;
  if (flp.frame % 90 === 0) {
    var top = 40 + Math.random() * (FLP_H - FLP_GAP - 100);
    flp.pipes.push({ x: FLP_W, top: top, scored: false });
  }
  for (var i = flp.pipes.length - 1; i >= 0; i--) {
    flp.pipes[i].x -= FLP_SPEED;
    if (flp.pipes[i].x + FLP_PIPE_W < 0) { flp.pipes.splice(i, 1); continue; }
    if (!flp.pipes[i].scored && flp.pipes[i].x + FLP_PIPE_W < 60) {
      flp.score++; flp.pipes[i].scored = true;
      document.getElementById('flpScore').textContent = flp.score;
    }
    if (60 + 20 > flp.pipes[i].x && 60 < flp.pipes[i].x + FLP_PIPE_W) {
      if (flp.y < flp.pipes[i].top || flp.y + 16 > flp.pipes[i].top + FLP_GAP) { flpEnd(); return; }
    }
  }
  if (flp.y + 16 > FLP_H - 30 || flp.y < 0) { flpEnd(); return; }
  flpDraw();
}

function flpFlap() { if (flp.on) flp.vy = FLP_FLAP; }

function flpStart() {
  gamesEnsurePlayer(function() {
    flp.y = FLP_H / 2; flp.vy = 0; flp.pipes = []; flp.score = 0; flp.frame = 0; flp.on = true;
    document.getElementById('flpScore').textContent = '0';
    document.getElementById('flpMsg').textContent = '';
    document.getElementById('flpBtn').disabled = true;
    clearInterval(flp.timer);
    flp.timer = setInterval(flpStep, 1000 / 60);
    flpDraw();
  });
}

function flpEnd() {
  flp.on = false; clearInterval(flp.timer);
  document.getElementById('flpBtn').disabled = false;
  document.getElementById('flpMsg').textContent = 'Score: ' + flp.score + '!';
  postScore('flappy', flp.score);
}

// ════════════════════════════════════════
// 8. BRICK BREAKER
// ════════════════════════════════════════
var brk = { on: false, timer: null, px: 0, bx: 0, by: 0, bdx: 0, bdy: 0, bricks: [], score: 0, lives: 3 };
var BRK_W = 400, BRK_H = 500, BRK_PAD_W = 60, BRK_PAD_H = 10, BRK_BALL_R = 6;
var BRK_COLS = 8, BRK_ROWS = 5, BRK_BW = 45, BRK_BH = 16, BRK_GAP = 4;
var BRK_COLORS = ['#ff5b8a', '#ff6b35', '#f0c060', '#5bff8a', '#5b8aff'];

function brkInitBricks() {
  brk.bricks = [];
  var startX = (BRK_W - (BRK_COLS * (BRK_BW + BRK_GAP) - BRK_GAP)) / 2;
  for (var r = 0; r < BRK_ROWS; r++) for (var c = 0; c < BRK_COLS; c++) {
    brk.bricks.push({ x: startX + c * (BRK_BW + BRK_GAP), y: 40 + r * (BRK_BH + BRK_GAP), alive: true, color: BRK_COLORS[r] });
  }
}

function brkDraw() {
  var c = document.getElementById('brkCanvas'); if (!c) return;
  var ctx = c.getContext('2d');
  c.width = BRK_W; c.height = BRK_H;
  ctx.fillStyle = '#0a0a14'; ctx.fillRect(0, 0, BRK_W, BRK_H);
  // Bricks
  brk.bricks.forEach(function(b) {
    if (!b.alive) return;
    ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, BRK_BW, BRK_BH);
  });
  // Paddle
  ctx.fillStyle = '#ccc'; ctx.fillRect(brk.px - BRK_PAD_W / 2, BRK_H - 30, BRK_PAD_W, BRK_PAD_H);
  // Ball
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(brk.bx, brk.by, BRK_BALL_R, 0, Math.PI * 2); ctx.fill();
  // HUD
  ctx.fillStyle = '#888'; ctx.font = '13px JetBrains Mono, monospace'; ctx.textAlign = 'left';
  ctx.fillText('Score: ' + brk.score, 10, BRK_H - 8);
  ctx.textAlign = 'right'; ctx.fillText('Lives: ' + brk.lives, BRK_W - 10, BRK_H - 8);
}

function brkStep() {
  if (!brk.on) return;
  brk.bx += brk.bdx; brk.by += brk.bdy;
  // Wall bounce
  if (brk.bx - BRK_BALL_R <= 0 || brk.bx + BRK_BALL_R >= BRK_W) brk.bdx = -brk.bdx;
  if (brk.by - BRK_BALL_R <= 0) brk.bdy = -brk.bdy;
  // Paddle bounce
  if (brk.bdy > 0 && brk.by + BRK_BALL_R >= BRK_H - 30 && brk.by + BRK_BALL_R <= BRK_H - 20 &&
      brk.bx >= brk.px - BRK_PAD_W / 2 && brk.bx <= brk.px + BRK_PAD_W / 2) {
    brk.bdy = -brk.bdy;
    var offset = (brk.bx - brk.px) / (BRK_PAD_W / 2);
    brk.bdx = offset * 4;
  }
  // Ball lost
  if (brk.by > BRK_H) {
    brk.lives--;
    if (brk.lives <= 0) { brkEnd(); return; }
    brk.bx = BRK_W / 2; brk.by = BRK_H - 50; brk.bdx = 2; brk.bdy = -3;
  }
  // Brick collision
  var allDead = true;
  brk.bricks.forEach(function(b) {
    if (!b.alive) return; allDead = false;
    if (brk.bx + BRK_BALL_R > b.x && brk.bx - BRK_BALL_R < b.x + BRK_BW &&
        brk.by + BRK_BALL_R > b.y && brk.by - BRK_BALL_R < b.y + BRK_BH) {
      b.alive = false; brk.bdy = -brk.bdy; brk.score += 10;
      document.getElementById('brkScore').textContent = brk.score;
    }
  });
  if (allDead) { brkEnd(); return; }
  brkDraw();
}

function brkStart() {
  gamesEnsurePlayer(function() {
    brk.px = BRK_W / 2; brk.bx = BRK_W / 2; brk.by = BRK_H - 50;
    brk.bdx = 2; brk.bdy = -3; brk.score = 0; brk.lives = 3; brk.on = true;
    brkInitBricks();
    document.getElementById('brkScore').textContent = '0';
    document.getElementById('brkMsg').textContent = '';
    document.getElementById('brkBtn').disabled = true;
    clearInterval(brk.timer);
    brk.timer = setInterval(brkStep, 1000 / 60);
    brkDraw();
  });
}

function brkEnd() {
  brk.on = false; clearInterval(brk.timer);
  document.getElementById('brkBtn').disabled = false;
  document.getElementById('brkMsg').textContent = 'Score: ' + brk.score + '!';
  postScore('brickbreaker', brk.score);
}

function brkMouseMove(e) {
  if (!brk.on) return;
  var c = document.getElementById('brkCanvas');
  var rect = c.getBoundingClientRect();
  brk.px = (e.clientX - rect.left) * (BRK_W / rect.width);
}

// ════════════════════════════════════════
// 10. TYPING SPEED
// ════════════════════════════════════════
var TYPE_SENTENCES = [
  'the quick brown fox jumps over the lazy dog',
  'hazardous waste requires careful handling at all times',
  'a journey of a thousand miles begins with a single step',
  'every receiving dock tells a story if you pay attention',
  'the manifest must match the shipping documentation exactly',
  'safety glasses are required in all operational areas',
  'proper labeling prevents costly mistakes down the line',
  'teamwork makes the dream work especially on monday morning',
  'coffee is the fuel that powers the receiving department',
  'if you can read this you type faster than you think',
  'the best time to organize is before the truck arrives',
  'compliance is not optional it is essential to operations',
  'forklift operators must be certified before operating equipment',
  'a clean workspace is a safe workspace remember that always',
  'double check the weight ticket before signing any paperwork'
];
var typ = { on: false, sentence: '', typed: '', startTime: 0, timer: null, wpm: 0 };

function typStart() {
  gamesEnsurePlayer(function() {
    typ.sentence = TYPE_SENTENCES[Math.floor(Math.random() * TYPE_SENTENCES.length)];
    typ.typed = ''; typ.wpm = 0; typ.on = true;
    document.getElementById('typTarget').textContent = typ.sentence;
    document.getElementById('typInput').value = '';
    document.getElementById('typInput').disabled = false;
    document.getElementById('typInput').focus();
    document.getElementById('typWpm').textContent = '0';
    document.getElementById('typMsg').textContent = '';
    document.getElementById('typBtn').disabled = true;
    typ.startTime = performance.now();
    clearInterval(typ.timer);
    typ.timer = setInterval(function() {
      if (!typ.on) return;
      var elapsed = (performance.now() - typ.startTime) / 60000;
      var words = typ.typed.trim().split(/\s+/).filter(function(w) { return w.length > 0; }).length;
      typ.wpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
      document.getElementById('typWpm').textContent = typ.wpm;
    }, 500);
  });
}

function typOnInput() {
  if (!typ.on) return;
  typ.typed = document.getElementById('typInput').value;
  // Highlight correct/incorrect
  var target = typ.sentence;
  var html = '';
  for (var i = 0; i < target.length; i++) {
    if (i < typ.typed.length) {
      if (typ.typed[i] === target[i]) html += '<span style="color:#5bff8a">' + target[i] + '</span>';
      else html += '<span style="color:#ff5b5b;text-decoration:underline">' + target[i] + '</span>';
    } else {
      html += '<span style="color:#666">' + target[i] + '</span>';
    }
  }
  document.getElementById('typTarget').innerHTML = html;
  // Check completion
  if (typ.typed === typ.sentence) typEnd();
}

function typEnd() {
  typ.on = false; clearInterval(typ.timer);
  var elapsed = (performance.now() - typ.startTime) / 60000;
  var words = typ.sentence.trim().split(/\s+/).length;
  typ.wpm = Math.round(words / elapsed);
  document.getElementById('typWpm').textContent = typ.wpm;
  document.getElementById('typInput').disabled = true;
  document.getElementById('typBtn').disabled = false;
  document.getElementById('typMsg').textContent = 'Done! ' + typ.wpm + ' WPM!';
  postScore('typing', typ.wpm);
}

// ════════════════════════════════════════
// WORD GUESS (Wordle-style)
// ════════════════════════════════════════
var WG_WORDS = ['about','above','abuse','actor','acute','admit','adopt','adult','agent','agree','ahead','alarm','album','alert','alien','align','alive','allow','alone','alter','among','anger','angle','apple','apply','arena','argue','arise','armor','array','aside','asset','audio','audit','avoid','basic','beach','begin','being','below','bench','birth','black','blade','blame','blank','blast','blaze','bleed','blend','blind','block','blood','bloom','blown','board','bonus','boost','bound','brain','brand','brave','bread','break','breed','brick','brief','bring','broad','brown','brush','build','burst','buyer','cabin','cable','carry','catch','cause','chain','chair','chaos','charm','chart','chase','cheap','check','chest','chief','child','china','chose','chunk','civil','claim','class','clean','clear','climb','clock','clone','close','cloud','coach','coast','count','court','cover','crack','craft','crash','crazy','cream','crime','cross','crowd','crown','crush','curve','cycle','daily','dance','death','debut','delay','dense','depth','derby','devil','dirty','doubt','dozen','draft','drain','drama','drawn','dream','dress','dried','drift','drill','drink','drive','drove','dying','eager','early','earth','eight','elder','elect','elite','empty','enemy','enjoy','enter','entry','equal','error','essay','event','every','exact','exist','extra','faith','false','fancy','fatal','fault','favor','feast','fence','fever','fiber','field','fifth','fifty','fight','final','first','fixed','flame','flash','flesh','float','flood','floor','fluid','focus','force','forge','forth','forum','found','frame','frank','fraud','fresh','front','fruit','fully','giant','given','glass','globe','going','grace','grade','grain','grand','grant','graph','grasp','grass','grave','great','green','gross','group','grown','guard','guess','guide','guilt','habit','happy','harsh','heart','heavy','hence','herbs','horse','hotel','house','human','humor','hurry','ideal','image','imply','index','inner','input','intro','issue','ivory','joint','judge','juice','knife','knock','known','label','labor','large','laser','later','laugh','layer','learn','lease','legal','level','light','limit','liver','local','logic','loose','lover','lower','lucky','lunch','lyric','magic','major','maker','march','match','mayor','media','mercy','merit','metal','minor','minus','model','money','month','moral','motor','mount','mouse','mouth','movie','music','naked','nerve','never','night','noble','noise','north','novel','nurse','nylon','occur','ocean','offer','often','olive','onset','opera','orbit','order','organ','other','outer','owner','oxide','ozone','paint','panic','paper','patch','pause','peace','pearl','penny','phase','phone','photo','piano','piece','pilot','pitch','pixel','place','plain','plane','plant','plate','plaza','plead','plumb','point','polar','pound','power','press','price','pride','prime','print','prior','prize','probe','proof','proud','prove','pulse','punch','pupil','queen','query','quest','quick','quiet','quota','quote','radar','radio','raise','ranch','range','rapid','ratio','reach','ready','realm','rebel','refer','reign','relax','reply','ridge','rifle','rigid','rival','river','robot','rocky','roger','roman','rough','round','route','royal','rugby','ruler','rural','saint','salad','sauce','scale','scene','scope','score','sense','serve','seven','shall','shape','share','sharp','sheet','shelf','shell','shift','shine','shirt','shock','shore','short','shout','sight','sigma','since','sixth','sixty','skill','slate','sleep','slice','slide','slope','smart','smell','smile','smoke','solar','solid','solve','sorry','south','space','spare','speak','speed','spell','spend','spill','spine','spite','split','spoke','spray','squad','stack','staff','stage','stake','stand','start','state','steam','steel','steep','steer','stern','stick','still','stock','stone','stood','store','storm','story','stove','stuff','style','sugar','suite','super','surge','swamp','swear','sweep','sweet','swept','swift','swing','sword','swore','sworn','syrup','table','taste','teach','teeth','thank','theme','thick','thing','think','third','those','three','throw','thumb','tight','timer','tired','title','today','token','topic','total','touch','tough','tower','toxic','trace','track','trade','trail','train','trait','trash','treat','trend','trial','tribe','trick','tried','troop','truck','truly','trump','trunk','trust','truth','tumor','twice','twist','ultra','under','union','unite','unity','until','upper','upset','urban','usage','usual','utter','valid','value','valve','vapor','venue','verse','video','vigor','viral','virus','visit','vital','vivid','vocal','voice','voter','wages','watch','water','weave','weigh','weird','whale','wheat','wheel','where','which','while','white','whole','whose','wider','woman','woods','world','worry','worse','worst','worth','would','wound','wrist','write','wrote','yield','young','youth'];
var wg = { word: '', guesses: [], current: '', on: false, won: false, wins: 0 };

function wgStart() {
  gamesEnsurePlayer(function() {
    wg.word = WG_WORDS[Math.floor(Math.random() * WG_WORDS.length)];
    wg.guesses = []; wg.current = ''; wg.on = true; wg.won = false;
    document.getElementById('wgRound').textContent = '0';
    document.getElementById('wgMsg').textContent = '';
    document.getElementById('wgBtn').disabled = true;
    wgRender();
  });
}

function wgRender() {
  // Board
  var html = '';
  for (var r = 0; r < 6; r++) {
    html += '<div class="wg-row">';
    var guess = wg.guesses[r] || '';
    var isCurrentRow = (r === wg.guesses.length && wg.on);
    for (var c = 0; c < 5; c++) {
      var letter = '', cls = 'wg-cell';
      if (r < wg.guesses.length) {
        letter = guess[c] || '';
        var wordArr = wg.word.split('');
        var guessArr = guess.split('');
        // Determine color
        if (letter === wg.word[c]) { cls += ' wg-correct'; }
        else if (wg.word.indexOf(letter) >= 0) { cls += ' wg-present'; }
        else { cls += ' wg-absent'; }
      } else if (isCurrentRow) {
        letter = (wg.current[c] || '').toUpperCase();
        if (letter) cls += ' wg-filled';
      }
      html += '<div class="' + cls + '">' + (letter ? letter.toUpperCase() : '') + '</div>';
    }
    html += '</div>';
  }
  document.getElementById('wgBoard').innerHTML = html;
  // Keyboard
  var rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  var kbHtml = '';
  var used = {};
  wg.guesses.forEach(function(g) {
    for (var i = 0; i < g.length; i++) {
      var l = g[i];
      if (l === wg.word[i]) used[l] = 'wg-k-correct';
      else if (wg.word.indexOf(l) >= 0 && used[l] !== 'wg-k-correct') used[l] = 'wg-k-present';
      else if (!used[l]) used[l] = 'wg-k-absent';
    }
  });
  rows.forEach(function(row, ri) {
    kbHtml += '<div class="wg-kb-row">';
    if (ri === 2) kbHtml += '<div class="wg-key wg-key-wide" onclick="wgKeyPress(\'ENTER\')">ENT</div>';
    for (var i = 0; i < row.length; i++) {
      var k = row[i], cls = used[k] || '';
      kbHtml += '<div class="wg-key ' + cls + '" onclick="wgKeyPress(\'' + k + '\')">' + k.toUpperCase() + '</div>';
    }
    if (ri === 2) kbHtml += '<div class="wg-key wg-key-wide" onclick="wgKeyPress(\'BACK\')">DEL</div>';
    kbHtml += '</div>';
  });
  document.getElementById('wgKeyboard').innerHTML = kbHtml;
}

function wgKeyPress(k) {
  if (!wg.on) return;
  if (k === 'BACK') { wg.current = wg.current.slice(0, -1); wgRender(); return; }
  if (k === 'ENTER') { wgSubmit(); return; }
  if (wg.current.length < 5) { wg.current += k.toLowerCase(); wgRender(); }
}

function wgSubmit() {
  if (wg.current.length !== 5) { document.getElementById('wgMsg').textContent = 'Need 5 letters'; return; }
  wg.guesses.push(wg.current);
  document.getElementById('wgRound').textContent = wg.guesses.length;
  if (wg.current === wg.word) {
    wg.on = false; wg.won = true;
    document.getElementById('wgMsg').textContent = 'You got it in ' + wg.guesses.length + '!';
    document.getElementById('wgBtn').disabled = false;
    wg.wins++;
    postScore('wordguess', wg.wins);
  } else if (wg.guesses.length >= 6) {
    wg.on = false;
    document.getElementById('wgMsg').textContent = 'It was: ' + wg.word.toUpperCase();
    document.getElementById('wgBtn').disabled = false;
  }
  wg.current = '';
  wgRender();
}

function wgKey(e) {
  if (!wg.on) return;
  if (e.key === 'Enter') { wgSubmit(); e.preventDefault(); }
  else if (e.key === 'Backspace') { wg.current = wg.current.slice(0, -1); wgRender(); e.preventDefault(); }
  else if (/^[a-zA-Z]$/.test(e.key) && wg.current.length < 5) { wg.current += e.key.toLowerCase(); wgRender(); }
}

// ════════════════════════════════════════
// GEM CRUSH (Candy Crush-style match-3)
// ════════════════════════════════════════
var gc = { board: null, sel: null, score: 0, on: false, timer: null, timeLeft: 60, cols: 7, rows: 7, animating: false };
var GC_GEMS = ['#ff5b5b', '#5b8aff', '#5bff8a', '#f0c060', '#b06ce0', '#ff6b35'];
var GC_SHAPES = ['\u25cf', '\u25a0', '\u25b2', '\u2666', '\u2605', '\u2764'];

function gcRand() { return Math.floor(Math.random() * GC_GEMS.length); }

function gcInit() {
  gc.board = [];
  for (var r = 0; r < gc.rows; r++) {
    gc.board[r] = [];
    for (var c = 0; c < gc.cols; c++) {
      var g;
      do { g = gcRand(); } while (
        (c >= 2 && gc.board[r][c-1] === g && gc.board[r][c-2] === g) ||
        (r >= 2 && gc.board[r-1][c] === g && gc.board[r-2][c] === g)
      );
      gc.board[r][c] = g;
    }
  }
}

function gcDraw() {
  var el = document.getElementById('gcBoard'); if (!el) return;
  var html = '';
  for (var r = 0; r < gc.rows; r++) {
    for (var c = 0; c < gc.cols; c++) {
      var g = gc.board[r][c];
      var selected = gc.sel && gc.sel.r === r && gc.sel.c === c;
      var cls = 'gc-gem' + (selected ? ' gc-sel' : '') + (g < 0 ? ' gc-empty' : '');
      html += '<div class="' + cls + '" data-r="' + r + '" data-c="' + c + '" style="color:' + (g >= 0 ? GC_GEMS[g] : 'transparent') + '">' + (g >= 0 ? GC_SHAPES[g] : '') + '</div>';
    }
  }
  el.innerHTML = html;
  el.querySelectorAll('.gc-gem').forEach(function(gem) {
    gem.addEventListener('click', function() { gcClick(parseInt(this.dataset.r), parseInt(this.dataset.c)); });
  });
}

function gcClick(r, c) {
  if (!gc.on || gc.animating) return;
  if (gc.board[r][c] < 0) return;
  if (!gc.sel) { gc.sel = { r: r, c: c }; gcDraw(); return; }
  var dr = Math.abs(gc.sel.r - r), dc = Math.abs(gc.sel.c - c);
  if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
    gcSwap(gc.sel.r, gc.sel.c, r, c);
    var matches = gcFindMatches();
    if (matches.length) {
      gc.sel = null;
      gcProcessMatches(matches);
    } else {
      gcSwap(gc.sel.r, gc.sel.c, r, c);
      gc.sel = null;
      gcDraw();
    }
  } else {
    gc.sel = { r: r, c: c };
    gcDraw();
  }
}

function gcSwap(r1, c1, r2, c2) {
  var tmp = gc.board[r1][c1];
  gc.board[r1][c1] = gc.board[r2][c2];
  gc.board[r2][c2] = tmp;
}

function gcFindMatches() {
  var matched = [];
  // Horizontal
  for (var r = 0; r < gc.rows; r++) {
    for (var c = 0; c < gc.cols - 2; c++) {
      var g = gc.board[r][c]; if (g < 0) continue;
      if (gc.board[r][c+1] === g && gc.board[r][c+2] === g) {
        var end = c + 2;
        while (end + 1 < gc.cols && gc.board[r][end+1] === g) end++;
        for (var i = c; i <= end; i++) matched.push(r + ',' + i);
        c = end;
      }
    }
  }
  // Vertical
  for (var c = 0; c < gc.cols; c++) {
    for (var r = 0; r < gc.rows - 2; r++) {
      var g = gc.board[r][c]; if (g < 0) continue;
      if (gc.board[r+1][c] === g && gc.board[r+2][c] === g) {
        var end = r + 2;
        while (end + 1 < gc.rows && gc.board[end+1][c] === g) end++;
        for (var i = r; i <= end; i++) matched.push(i + ',' + c);
        r = end;
      }
    }
  }
  // Deduplicate
  return matched.filter(function(v, i, a) { return a.indexOf(v) === i; });
}

function gcProcessMatches(matches) {
  gc.animating = true;
  gc.score += matches.length * 10;
  document.getElementById('gcScore').textContent = gc.score;
  matches.forEach(function(m) {
    var parts = m.split(',');
    gc.board[parseInt(parts[0])][parseInt(parts[1])] = -1;
  });
  gcDraw();
  setTimeout(function() {
    gcDropGems();
    gcDraw();
    setTimeout(function() {
      var newMatches = gcFindMatches();
      if (newMatches.length) {
        gcProcessMatches(newMatches);
      } else {
        gc.animating = false;
      }
    }, 200);
  }, 250);
}

function gcDropGems() {
  for (var c = 0; c < gc.cols; c++) {
    var empty = 0;
    for (var r = gc.rows - 1; r >= 0; r--) {
      if (gc.board[r][c] < 0) { empty++; }
      else if (empty > 0) { gc.board[r + empty][c] = gc.board[r][c]; gc.board[r][c] = -1; }
    }
    for (var r = 0; r < empty; r++) { gc.board[r][c] = gcRand(); }
  }
}

function gcStart() {
  gamesEnsurePlayer(function() {
    gc.score = 0; gc.timeLeft = 60; gc.on = true; gc.sel = null; gc.animating = false;
    gcInit(); gcDraw();
    document.getElementById('gcScore').textContent = '0';
    document.getElementById('gcTimer').textContent = '60s';
    document.getElementById('gcTimer').style.color = '';
    document.getElementById('gcMsg').textContent = '';
    document.getElementById('gcBtn').disabled = true;
    clearInterval(gc.timer);
    gc.timer = setInterval(function() {
      gc.timeLeft--;
      document.getElementById('gcTimer').textContent = gc.timeLeft + 's';
      if (gc.timeLeft <= 10) document.getElementById('gcTimer').style.color = '#E24B4A';
      if (gc.timeLeft <= 0) gcEnd();
    }, 1000);
  });
}

function gcEnd() {
  gc.on = false; clearInterval(gc.timer);
  document.getElementById('gcBtn').disabled = false;
  document.getElementById('gcMsg').textContent = 'Score: ' + gc.score + '!';
  postScore('gemcrush', gc.score);
}

// ════════════════════════════════════════
// MINESWEEPER
// ════════════════════════════════════════
var ms = { board: null, revealed: null, flags: null, rows: 9, cols: 9, mines: 10, on: false, won: false, time: 0, timer: null, firstClick: true, minesLeft: 10 };
var MS_COLORS = ['','#5b8aff','#5bff8a','#ff5b5b','#7c5bff','#f0c060','#40d4f4','#ccc','#888'];

function msCreateBoard(safeR, safeC) {
  ms.board = [];
  ms.revealed = [];
  ms.flags = [];
  for (var r = 0; r < ms.rows; r++) {
    ms.board[r] = []; ms.revealed[r] = []; ms.flags[r] = [];
    for (var c = 0; c < ms.cols; c++) {
      ms.board[r][c] = 0; ms.revealed[r][c] = false; ms.flags[r][c] = false;
    }
  }
  // Place mines avoiding safe zone
  var placed = 0;
  while (placed < ms.mines) {
    var r = Math.floor(Math.random() * ms.rows);
    var c = Math.floor(Math.random() * ms.cols);
    if (ms.board[r][c] === -1) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    ms.board[r][c] = -1;
    placed++;
  }
  // Calculate numbers
  for (var r = 0; r < ms.rows; r++) for (var c = 0; c < ms.cols; c++) {
    if (ms.board[r][c] === -1) continue;
    var count = 0;
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
      var nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ms.rows && nc >= 0 && nc < ms.cols && ms.board[nr][nc] === -1) count++;
    }
    ms.board[r][c] = count;
  }
}

function msDraw() {
  var el = document.getElementById('msBoard'); if (!el) return;
  var html = '';
  for (var r = 0; r < ms.rows; r++) {
    for (var c = 0; c < ms.cols; c++) {
      var cls = 'ms-cell';
      var content = '';
      if (ms.revealed[r][c]) {
        cls += ' ms-revealed';
        if (ms.board[r][c] === -1) {
          content = '💣';
          cls += ' ms-mine';
        } else if (ms.board[r][c] > 0) {
          content = '<span style="color:' + MS_COLORS[ms.board[r][c]] + '">' + ms.board[r][c] + '</span>';
        }
      } else if (ms.flags[r][c]) {
        content = '🚩';
      }
      html += '<div class="' + cls + '" data-r="' + r + '" data-c="' + c + '">' + content + '</div>';
    }
  }
  el.innerHTML = html;
  el.style.gridTemplateColumns = 'repeat(' + ms.cols + ', 1fr)';
  // Bind events
  el.querySelectorAll('.ms-cell').forEach(function(cell) {
    cell.addEventListener('click', function() {
      msClick(parseInt(this.dataset.r), parseInt(this.dataset.c));
    });
    cell.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      msFlag(parseInt(this.dataset.r), parseInt(this.dataset.c));
    });
  });
}

function msClick(r, c) {
  if (!ms.on || ms.flags[r][c] || ms.revealed[r][c]) return;
  if (ms.firstClick) {
    msCreateBoard(r, c);
    ms.firstClick = false;
    ms.timer = setInterval(function() {
      ms.time++;
      document.getElementById('msTime').textContent = ms.time;
    }, 1000);
  }
  if (ms.board[r][c] === -1) {
    // Hit a mine — reveal all
    for (var i = 0; i < ms.rows; i++) for (var j = 0; j < ms.cols; j++) ms.revealed[i][j] = true;
    msDraw();
    msEnd(false);
    return;
  }
  msReveal(r, c);
  msDraw();
  msCheckWin();
}

function msReveal(r, c) {
  if (r < 0 || r >= ms.rows || c < 0 || c >= ms.cols) return;
  if (ms.revealed[r][c] || ms.flags[r][c]) return;
  ms.revealed[r][c] = true;
  if (ms.board[r][c] === 0) {
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
      msReveal(r + dr, c + dc);
    }
  }
}

function msFlag(r, c) {
  if (!ms.on || ms.revealed[r][c]) return;
  ms.flags[r][c] = !ms.flags[r][c];
  ms.minesLeft += ms.flags[r][c] ? -1 : 1;
  document.getElementById('msCount').textContent = ms.minesLeft;
  msDraw();
}

function msCheckWin() {
  var unrevealed = 0;
  for (var r = 0; r < ms.rows; r++) for (var c = 0; c < ms.cols; c++) {
    if (!ms.revealed[r][c]) unrevealed++;
  }
  if (unrevealed === ms.mines) msEnd(true);
}

function msStart() {
  gamesEnsurePlayer(function() {
    ms.on = true; ms.won = false; ms.time = 0; ms.firstClick = true; ms.minesLeft = ms.mines;
    clearInterval(ms.timer);
    ms.board = []; ms.revealed = []; ms.flags = [];
    for (var r = 0; r < ms.rows; r++) {
      ms.board[r] = []; ms.revealed[r] = []; ms.flags[r] = [];
      for (var c = 0; c < ms.cols; c++) {
        ms.board[r][c] = 0; ms.revealed[r][c] = false; ms.flags[r][c] = false;
      }
    }
    document.getElementById('msTime').textContent = '0';
    document.getElementById('msCount').textContent = ms.mines;
    document.getElementById('msMsg').textContent = '';
    document.getElementById('msBtn').disabled = true;
    msDraw();
  });
}

function msEnd(won) {
  ms.on = false; ms.won = won;
  clearInterval(ms.timer);
  document.getElementById('msBtn').disabled = false;
  if (won) {
    document.getElementById('msMsg').textContent = 'Cleared in ' + ms.time + 's!';
    postScore('minesweeper', ms.time);
  } else {
    document.getElementById('msMsg').textContent = 'BOOM! ' + ms.time + 's';
  }
}

// ════════════════════════════════════════
// PAC-MAN
// ════════════════════════════════════════
var pac={on:false,timer:null,x:0,y:0,dir:'right',nextDir:'right',score:0,lives:3,dots:0,power:0,ghosts:[],map:null,tick:0};
var PAC_W=15,PAC_H=15;
var PAC_MAP=[
'###############',
'#.....#...#...#',
'#.###.#.#.#.#.#',
'#O#...#.#...#O#',
'#.#.###.###.#.#',
'#.............#',
'###.#.###.#.###',
'#...#.# #.#...#',
'#.###.###.###.#',
'#.............#',
'#.#.###.###.#.#',
'#O#...#.#...#O#',
'#.###.#.#.#.#.#',
'#.....#...#...#',
'###############'
];
var PAC_GHOST_COLORS=['#ff5b5b','#5b8aff','#ff6b35','#b06ce0'];

function pacInit(){
  pac.map=[];pac.dots=0;
  for(var r=0;r<PAC_H;r++){
    pac.map[r]=[];
    for(var c=0;c<PAC_W;c++){
      var ch=PAC_MAP[r][c];
      if(ch==='#'){pac.map[r][c]='W';}
      else if(ch==='O'){pac.map[r][c]='P';pac.dots++;}
      else if(ch===' '){pac.map[r][c]=' ';}
      else{pac.map[r][c]='D';pac.dots++;}
    }
  }
  pac.x=7;pac.y=9;pac.dir='right';pac.nextDir='right';pac.power=0;
  pac.ghosts=[
    {x:6,y:7,color:PAC_GHOST_COLORS[0],dir:'left'},
    {x:7,y:7,color:PAC_GHOST_COLORS[1],dir:'right'},
    {x:8,y:7,color:PAC_GHOST_COLORS[2],dir:'up'},
    {x:7,y:6,color:PAC_GHOST_COLORS[3],dir:'down'}
  ];
}

function pacDraw(){
  var el=document.getElementById('pacBoard');if(!el)return;
  var html='';
  for(var r=0;r<PAC_H;r++)for(var c=0;c<PAC_W;c++){
    var cell=pac.map[r][c],cls='pac-cell',content='';
    if(cell==='W'){cls+=' pac-wall';}
    else if(cell==='D'){content='<span class="pac-dot"></span>';}
    else if(cell==='P'){content='<span class="pac-power"></span>';}
    // Pac-Man
    if(pac.x===c&&pac.y===r){content='<span class="pac-man">😮</span>';}
    // Ghosts
    pac.ghosts.forEach(function(g){
      if(g.x===c&&g.y===r){content='<span class="pac-ghost" style="color:'+(pac.power>0?'#5b8aff':g.color)+';">'+(pac.power>0?'👻':'👾')+'</span>';}
    });
    html+='<div class="'+cls+'">'+content+'</div>';
  }
  el.innerHTML=html;
}

function pacCanMove(x,y){return x>=0&&x<PAC_W&&y>=0&&y<PAC_H&&pac.map[y][x]!=='W';}

function pacMoveGhost(g){
  var dirs=[{dx:0,dy:-1,n:'up'},{dx:0,dy:1,n:'down'},{dx:-1,dy:0,n:'left'},{dx:1,dy:0,n:'right'}];
  var opp={up:'down',down:'up',left:'right',right:'left'};
  // Try to move toward pac-man, but not reverse
  var options=dirs.filter(function(d){return d.n!==opp[g.dir]&&pacCanMove(g.x+d.dx,g.y+d.dy);});
  if(!options.length)options=dirs.filter(function(d){return pacCanMove(g.x+d.dx,g.y+d.dy);});
  if(!options.length)return;
  // Sort by distance to pac-man (chase mode) or away (scared mode)
  options.sort(function(a,b){
    var da=Math.abs(g.x+a.dx-pac.x)+Math.abs(g.y+a.dy-pac.y);
    var db=Math.abs(g.x+b.dx-pac.x)+Math.abs(g.y+b.dy-pac.y);
    return pac.power>0?(db-da):(da-db);
  });
  // Add some randomness
  var pick=Math.random()<0.3&&options.length>1?options[1]:options[0];
  g.x+=pick.dx;g.y+=pick.dy;g.dir=pick.n;
}

function pacStep(){
  if(!pac.on)return;
  pac.tick++;
  // Try next direction first
  var dmap={up:{dx:0,dy:-1},down:{dx:0,dy:1},left:{dx:-1,dy:0},right:{dx:1,dy:0}};
  var nd=dmap[pac.nextDir];
  if(pacCanMove(pac.x+nd.dx,pac.y+nd.dy)){pac.dir=pac.nextDir;}
  var d=dmap[pac.dir];
  if(pacCanMove(pac.x+d.dx,pac.y+d.dy)){pac.x+=d.dx;pac.y+=d.dy;}
  // Eat dot
  if(pac.map[pac.y][pac.x]==='D'){pac.map[pac.y][pac.x]=' ';pac.score+=10;pac.dots--;document.getElementById('pacScore').textContent=pac.score;}
  if(pac.map[pac.y][pac.x]==='P'){pac.map[pac.y][pac.x]=' ';pac.score+=50;pac.dots--;pac.power=20;document.getElementById('pacScore').textContent=pac.score;}
  if(pac.power>0)pac.power--;
  // Move ghosts every other tick
  if(pac.tick%2===0)pac.ghosts.forEach(function(g){pacMoveGhost(g);});
  // Check ghost collision
  pac.ghosts.forEach(function(g){
    if(g.x===pac.x&&g.y===pac.y){
      if(pac.power>0){g.x=7;g.y=7;pac.score+=200;document.getElementById('pacScore').textContent=pac.score;}
      else{pac.lives--;document.getElementById('pacLives').textContent=pac.lives;pac.x=7;pac.y=9;if(pac.lives<=0)pacEnd();}
    }
  });
  if(pac.dots<=0){pac.score+=500;document.getElementById('pacScore').textContent=pac.score;pacInit();pac.dots=pac.dots;}
  pacDraw();
}

function pacStart(){
  gamesEnsurePlayer(function(){
    pac.score=0;pac.lives=3;pac.on=true;pac.tick=0;
    pacInit();
    document.getElementById('pacScore').textContent='0';
    document.getElementById('pacLives').textContent='3';
    document.getElementById('pacMsg').textContent='';
    document.getElementById('pacBtn').disabled=true;
    clearInterval(pac.timer);
    pac.timer=setInterval(pacStep,180);
    pacDraw();
  });
}

function pacEnd(){
  pac.on=false;clearInterval(pac.timer);
  document.getElementById('pacBtn').disabled=false;
  document.getElementById('pacMsg').textContent='Game Over! Score: '+pac.score;
  postScore('pacman',pac.score);
}

function pacKey(e){
  if(!pac.on)return;
  var map={'ArrowUp':'up','ArrowDown':'down','ArrowLeft':'left','ArrowRight':'right'};
  if(map[e.key]){pac.nextDir=map[e.key];e.preventDefault();}
}

// ════════════════════════════════════════
// FROGGER
// ════════════════════════════════════════
var frg={on:false,timer:null,x:7,y:12,score:0,lives:3,lanes:[],tick:0};
var FRG_W=15,FRG_H=13;
// Lane types: S=safe, R=road(cars), W=water(logs)
var FRG_LANES=[
  {type:'G',label:'HOME'},    // 0 - goal
  {type:'W',spd:-1,items:[{x:1,w:3},{x:7,w:3},{x:12,w:3}]},
  {type:'W',spd:1.5,items:[{x:0,w:4},{x:8,w:4}]},
  {type:'W',spd:-0.8,items:[{x:2,w:3},{x:8,w:3},{x:13,w:2}]},
  {type:'W',spd:1.2,items:[{x:0,w:5},{x:9,w:4}]},
  {type:'W',spd:-1.5,items:[{x:3,w:3},{x:10,w:3}]},
  {type:'S',label:'BANK'},    // 6 - safe zone
  {type:'R',spd:1,items:[{x:2,w:2},{x:8,w:2},{x:13,w:2}]},
  {type:'R',spd:-1.3,items:[{x:0,w:2},{x:6,w:2},{x:11,w:2}]},
  {type:'R',spd:0.8,items:[{x:3,w:3},{x:10,w:3}]},
  {type:'R',spd:-1,items:[{x:1,w:2},{x:7,w:2},{x:12,w:2}]},
  {type:'R',spd:1.5,items:[{x:0,w:2},{x:5,w:2},{x:10,w:2}]},
  {type:'S',label:'START'}    // 12 - start
];

function frgDraw(){
  var el=document.getElementById('frgBoard');if(!el)return;
  var html='';
  for(var r=0;r<FRG_H;r++){
    var lane=FRG_LANES[r];
    for(var c=0;c<FRG_W;c++){
      var cls='frg-cell',content='';
      if(lane.type==='G'){cls+=' frg-goal';}
      else if(lane.type==='S'){cls+=' frg-safe';}
      else if(lane.type==='W'){cls+=' frg-water';}
      else if(lane.type==='R'){cls+=' frg-road';}
      // Draw items (cars or logs)
      if(lane.items){
        lane.items.forEach(function(item){
          var ix=((item.x%FRG_W)+FRG_W)%FRG_W;
          for(var w=0;w<item.w;w++){
            var pos=((ix+w)%FRG_W+FRG_W)%FRG_W;
            if(pos===c){
              if(lane.type==='R'){cls+=' frg-car';content='🚗';}
              else if(lane.type==='W'){cls+=' frg-log';}
            }
          }
        });
      }
      if(frg.x===c&&frg.y===r){content='<span class="frg-frog">🐸</span>';}
      html+='<div class="'+cls+'">'+content+'</div>';
    }
  }
  el.innerHTML=html;
}

function frgStep(){
  if(!frg.on)return;
  frg.tick++;
  // Move items
  FRG_LANES.forEach(function(lane){
    if(!lane.items)return;
    lane.items.forEach(function(item){item.x+=lane.spd*0.1;});
  });
  // Check if frog is on water lane
  var lane=FRG_LANES[frg.y];
  if(lane.type==='W'){
    var onLog=false;
    lane.items.forEach(function(item){
      var ix=((item.x%FRG_W)+FRG_W)%FRG_W;
      for(var w=0;w<item.w;w++){
        var pos=Math.round(((ix+w)%FRG_W+FRG_W)%FRG_W);
        if(pos===frg.x){onLog=true;frg.x+=lane.spd*0.1;}
      }
    });
    frg.x=Math.round(((frg.x%FRG_W)+FRG_W)%FRG_W);
    if(!onLog){frg.lives--;document.getElementById('frgLives').textContent=frg.lives;frgReset();if(frg.lives<=0)frgEnd();frgDraw();return;}
  }
  // Check car collision
  if(lane.type==='R'){
    lane.items.forEach(function(item){
      var ix=((item.x%FRG_W)+FRG_W)%FRG_W;
      for(var w=0;w<item.w;w++){
        var pos=Math.round(((ix+w)%FRG_W+FRG_W)%FRG_W);
        if(pos===frg.x){frg.lives--;document.getElementById('frgLives').textContent=frg.lives;frgReset();if(frg.lives<=0)frgEnd();}
      }
    });
  }
  frgDraw();
}

function frgReset(){frg.x=7;frg.y=12;}

function frgMove(dx,dy){
  if(!frg.on)return;
  var nx=frg.x+dx,ny=frg.y+dy;
  if(nx<0||nx>=FRG_W||ny<0||ny>=FRG_H)return;
  frg.x=nx;frg.y=ny;
  if(frg.y===0){frg.score+=100;document.getElementById('frgScore').textContent=frg.score;frgReset();}
  frgDraw();
}

function frgStart(){
  gamesEnsurePlayer(function(){
    frg.score=0;frg.lives=3;frg.on=true;frg.tick=0;
    frgReset();
    // Reset lane positions
    FRG_LANES.forEach(function(lane,i){
      var ref=[
        null,
        [{x:1,w:3},{x:7,w:3},{x:12,w:3}],
        [{x:0,w:4},{x:8,w:4}],
        [{x:2,w:3},{x:8,w:3},{x:13,w:2}],
        [{x:0,w:5},{x:9,w:4}],
        [{x:3,w:3},{x:10,w:3}],
        null,
        [{x:2,w:2},{x:8,w:2},{x:13,w:2}],
        [{x:0,w:2},{x:6,w:2},{x:11,w:2}],
        [{x:3,w:3},{x:10,w:3}],
        [{x:1,w:2},{x:7,w:2},{x:12,w:2}],
        [{x:0,w:2},{x:5,w:2},{x:10,w:2}],
        null
      ];
      if(ref[i])lane.items=ref[i].map(function(it){return{x:it.x,w:it.w};});
    });
    document.getElementById('frgScore').textContent='0';
    document.getElementById('frgLives').textContent='3';
    document.getElementById('frgMsg').textContent='';
    document.getElementById('frgBtn').disabled=true;
    clearInterval(frg.timer);
    frg.timer=setInterval(frgStep,60);
    frgDraw();
  });
}

function frgEnd(){
  frg.on=false;clearInterval(frg.timer);
  document.getElementById('frgBtn').disabled=false;
  document.getElementById('frgMsg').textContent='Score: '+frg.score+'!';
  postScore('frogger',frg.score);
}

function frgKey(e){
  if(!frg.on)return;
  if(e.key==='ArrowUp'){frgMove(0,-1);e.preventDefault();}
  else if(e.key==='ArrowDown'){frgMove(0,1);e.preventDefault();}
  else if(e.key==='ArrowLeft'){frgMove(-1,0);e.preventDefault();}
  else if(e.key==='ArrowRight'){frgMove(1,0);e.preventDefault();}
}

// ════════════════════════════════════════
// COOKIE CLICKER
// ════════════════════════════════════════
var ck={on:false,timer:null,tickTimer:null,count:0,cps:0,timeLeft:120,upgrades:[]};
var CK_UPGRADES=[
  {name:'Auto Clicker',baseCost:10,cps:1,owned:0,icon:'👆'},
  {name:'Grandma',baseCost:50,cps:3,owned:0,icon:'👵'},
  {name:'Bakery',baseCost:200,cps:10,owned:0,icon:'🏪'},
  {name:'Factory',baseCost:1000,cps:40,owned:0,icon:'🏭'},
  {name:'Portal',baseCost:5000,cps:200,owned:0,icon:'🌀'}
];

function ckClick(){
  if(!ck.on)return;
  ck.count++;
  document.getElementById('ckCount').textContent=Math.floor(ck.count);
  var cookie=document.getElementById('ckCookie');
  cookie.style.transform='scale(1.15)';
  setTimeout(function(){cookie.style.transform='';},80);
}

function ckRenderShop(){
  var html='';
  ck.upgrades.forEach(function(u,i){
    var cost=Math.floor(u.baseCost*Math.pow(1.15,u.owned));
    var canBuy=ck.count>=cost;
    html+='<div class="ck-item'+(canBuy?' ck-buyable':'')+'" onclick="ckBuy('+i+')"><span class="ck-item-icon">'+u.icon+'</span><div class="ck-item-info"><span class="ck-item-name">'+u.name+' ('+u.owned+')</span><span class="ck-item-cost">'+cost+' 🍪 → +'+u.cps+'/s</span></div></div>';
  });
  document.getElementById('ckShop').innerHTML=html;
}

function ckBuy(i){
  if(!ck.on)return;
  var u=ck.upgrades[i];
  var cost=Math.floor(u.baseCost*Math.pow(1.15,u.owned));
  if(ck.count<cost)return;
  ck.count-=cost;u.owned++;
  ck.cps=0;ck.upgrades.forEach(function(u){ck.cps+=u.cps*u.owned;});
  document.getElementById('ckCps').textContent=ck.cps;
  document.getElementById('ckCount').textContent=Math.floor(ck.count);
  ckRenderShop();
}

function ckStart(){
  gamesEnsurePlayer(function(){
    ck.count=0;ck.cps=0;ck.timeLeft=120;ck.on=true;
    ck.upgrades=CK_UPGRADES.map(function(u){return{name:u.name,baseCost:u.baseCost,cps:u.cps,owned:0,icon:u.icon};});
    document.getElementById('ckCount').textContent='0';
    document.getElementById('ckCps').textContent='0';
    document.getElementById('ckMsg').textContent='2:00 remaining';
    document.getElementById('ckBtn').disabled=true;
    ckRenderShop();
    clearInterval(ck.timer);clearInterval(ck.tickTimer);
    ck.tickTimer=setInterval(function(){
      if(!ck.on)return;
      ck.count+=ck.cps/10;
      document.getElementById('ckCount').textContent=Math.floor(ck.count);
      ckRenderShop();
    },100);
    ck.timer=setInterval(function(){
      ck.timeLeft--;
      var m=Math.floor(ck.timeLeft/60),s=ck.timeLeft%60;
      document.getElementById('ckMsg').textContent=m+':'+(s<10?'0':'')+s+' remaining';
      if(ck.timeLeft<=0)ckEnd();
    },1000);
  });
}

function ckEnd(){
  ck.on=false;clearInterval(ck.timer);clearInterval(ck.tickTimer);
  document.getElementById('ckBtn').disabled=false;
  var final=Math.floor(ck.count);
  document.getElementById('ckMsg').textContent='Time! '+final+' cookies!';
  postScore('cookie',final);
}

// ════════════════════════════════════════
// SPELLING BEE
// ════════════════════════════════════════
var SB_WORDLIST=['able','about','above','accept','account','across','action','actual','added','after','again','against','agree','ahead','allow','almost','along','already','also','always','among','amount','angle','animal','another','answer','apart','appear','apply','area','around','arrive','aside','asked','attention','available','away','back','balance','base','basic','bear','beat','become','been','before','began','begin','behind','below','beside','best','better','between','beyond','black','blood','blue','board','body','bone','book','bore','born','both','bottom','bound','break','bridge','brief','bring','broad','broke','brother','brown','build','built','burn','busy','call','came','camp','capital','captain','care','carry','case','catch','cause','center','central','certain','chair','chance','change','charge','check','chief','child','choice','choose','church','circle','city','claim','class','clean','clear','climb','close','cold','collect','college','color','come','command','common','company','complete','concern','condition','consider','contain','continue','control','corner','cost','could','count','country','course','court','cover','cross','current','dark','daughter','dead','deal','dear','death','decide','deep','degree','demand','department','depend','describe','design','detail','develop','device','died','difference','difficult','dinner','direct','discover','distance','district','doctor','does','done','door','double','doubt','down','draw','dream','dress','drink','drive','drop','during','duty','each','early','earth','east','easy','edge','education','effect','effort','eight','either','electric','element','else','employ','encourage','enemy','energy','enjoy','enough','enter','entire','equal','escape','even','evening','event','ever','every','evidence','example','except','exchange','exercise','exist','expect','experience','explain','express','extend','extra','face','fact','fail','fair','fall','family','famous','farm','father','favor','fear','feel','feet','fell','fellow','felt','field','fight','figure','fill','final','find','fine','finger','finish','fire','firm','first','fish','five','flat','floor','flow','flower','follow','food','foot','force','foreign','forest','forget','form','former','forward','found','four','free','fresh','friend','from','front','full','further','future','game','garden','gave','general','gentle','girl','give','glad','glass','goes','gold','gone','good','govern','grain','grand','grant','grass','gray','great','green','grew','ground','group','grow','growth','guard','guess','guide','hair','half','hall','hand','hang','happen','happy','hard','have','head','hear','heart','heat','heavy','help','here','high','hill','history','hold','hole','home','honor','hope','horse','hospital','hotel','hour','house','human','hundred','idea','imagine','important','include','increase','indeed','indicate','individual','industry','influence','instead','interest','iron','island','issue','item','itself','join','judge','just','justice','keen','keep','kept','kill','kind','king','kitchen','knee','knew','know','knowledge','labor','lack','lady','laid','lake','land','large','last','late','latter','laugh','lead','learn','least','leave','left','length','less','letter','level','library','life','light','like','likely','limit','line','list','listen','little','live','long','look','lord','lose','loss','lost','love','lower','machine','main','major','make','male','manner','many','mark','market','mass','master','matter','mean','measure','meet','member','memory','mention','method','middle','might','mile','military','mind','mine','minute','miss','modern','moment','money','month','moral','more','morning','most','mother','motion','mountain','mouth','move','much','music','must','name','narrow','nation','native','natural','nature','near','necessary','need','never','next','nice','night','nine','noble','none','normal','north','note','nothing','notice','number','object','observe','occasion','offer','office','officer','often','once','only','open','operate','opinion','opportunity','opposite','order','origin','other','otherwise','ought','outside','over','page','paid','pain','pair','paper','parent','part','particular','party','pass','past','path','pattern','pause','peace','people','perhaps','period','permit','person','picture','piece','place','plain','plan','plant','play','please','plus','pocket','poem','point','pool','poor','popular','position','possible','post','pound','power','present','president','press','pressure','pretty','prevent','price','prince','principle','private','probably','problem','produce','product','program','promise','proper','protect','prove','provide','public','pull','purpose','push','quality','quarter','question','quick','quiet','quite','raise','range','rapid','rate','rather','reach','read','ready','real','realize','reason','receive','record','reduce','region','relate','remain','remember','remove','repeat','replace','report','require','result','return','rich','ride','right','ring','rise','risk','river','road','rock','role','room','round','rule','safe','said','same','save','scene','school','science','season','seat','second','section','seem','self','sell','send','sense','separate','serious','serve','service','settle','seven','several','shake','shall','shape','share','sharp','ship','shoe','short','shot','should','shoulder','show','shut','side','sight','sign','silence','silver','similar','simple','since','single','sister','size','skill','sleep','slip','slow','small','smile','smoke','snow','social','soft','soldier','some','sometimes','song','soon','sorry','sort','soul','sound','south','space','speak','special','speed','spend','spirit','spoke','spread','spring','square','staff','stage','stand','standard','start','state','station','stay','step','stick','still','stock','stone','stood','stop','store','story','strange','street','strength','strike','strong','student','study','stuff','subject','succeed','such','sudden','suffer','suggest','summer','supply','support','sure','surface','surprise','sweet','system','table','take','talk','taste','teach','tell','temperature','tend','term','test','than','thank','that','them','then','there','thick','thin','thing','think','third','those','though','thought','three','through','throw','thus','time','title','today','together','told','tone','took','total','touch','toward','town','trade','train','travel','tree','trial','trouble','true','trust','turn','twenty','twice','type','uncle','under','understand','union','unit','unite','until','upon','usual','valley','value','various','very','view','village','visit','voice','vote','wait','walk','wall','want','warm','watch','water','wave','wear','weather','week','weight','welcome','well','west','western','what','wheel','when','where','whether','which','while','white','whole','whose','wide','wife','will','wind','window','wish','with','within','without','woman','wonder','wood','word','work','world','worse','worst','worth','would','write','wrong','year','young','youth'];
var sb={on:false,center:'',outer:[],found:[],score:0};

function sbGenPuzzle(){
  // Pick 7 unique letters that form many words
  var vowels='aeiou',cons='bcdfghjklmnpqrstvwxyz';
  var best=null,bestCount=0;
  for(var attempt=0;attempt<200;attempt++){
    var letters=[];
    // Ensure at least 2 vowels
    while(letters.length<2){var v=vowels[Math.floor(Math.random()*vowels.length)];if(letters.indexOf(v)<0)letters.push(v);}
    while(letters.length<7){var c2=cons[Math.floor(Math.random()*cons.length)];if(letters.indexOf(c2)<0)letters.push(c2);}
    // Shuffle and pick center
    for(var i=letters.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=letters[i];letters[i]=letters[j];letters[j]=t;}
    var center=letters[0];
    var set=new Set(letters);
    var count=0;
    SB_WORDLIST.forEach(function(w){
      if(w.length<4)return;
      if(w.indexOf(center)<0)return;
      for(var i=0;i<w.length;i++){if(!set.has(w[i]))return;}
      count++;
    });
    if(count>bestCount){bestCount=count;best={center:center,outer:letters.slice(1),count:count};}
  }
  return best;
}

function sbRenderHex(){
  var el=document.getElementById('sbHex');
  var html='<div class="sb-hex-row">';
  html+='<div class="sb-hex-cell" onclick="sbType(\''+sb.outer[0]+'\')">'+sb.outer[0].toUpperCase()+'</div>';
  html+='<div class="sb-hex-cell" onclick="sbType(\''+sb.outer[1]+'\')">'+sb.outer[1].toUpperCase()+'</div>';
  html+='</div><div class="sb-hex-row">';
  html+='<div class="sb-hex-cell" onclick="sbType(\''+sb.outer[2]+'\')">'+sb.outer[2].toUpperCase()+'</div>';
  html+='<div class="sb-hex-cell sb-hex-center" onclick="sbType(\''+sb.center+'\')">'+sb.center.toUpperCase()+'</div>';
  html+='<div class="sb-hex-cell" onclick="sbType(\''+sb.outer[3]+'\')">'+sb.outer[3].toUpperCase()+'</div>';
  html+='</div><div class="sb-hex-row">';
  html+='<div class="sb-hex-cell" onclick="sbType(\''+sb.outer[4]+'\')">'+sb.outer[4].toUpperCase()+'</div>';
  html+='<div class="sb-hex-cell" onclick="sbType(\''+sb.outer[5]+'\')">'+sb.outer[5].toUpperCase()+'</div>';
  html+='</div>';
  el.innerHTML=html;
}

function sbType(letter){
  var inp=document.getElementById('sbInput');
  inp.value+=letter;
  inp.focus();
}

function sbShuffle(){
  for(var i=sb.outer.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=sb.outer[i];sb.outer[i]=sb.outer[j];sb.outer[j]=t;}
  sbRenderHex();
}

function sbSubmit(){
  var inp=document.getElementById('sbInput');
  var word=inp.value.trim().toLowerCase();
  inp.value='';
  var msg=document.getElementById('sbMsg');
  if(!word){msg.textContent='';return;}
  if(word.length<4){msg.textContent='Too short (min 4 letters)';msg.style.color='#ff5b5b';return;}
  if(word.indexOf(sb.center)<0){msg.textContent='Must contain '+sb.center.toUpperCase();msg.style.color='#ff5b5b';return;}
  var set=new Set([sb.center].concat(sb.outer));
  for(var i=0;i<word.length;i++){if(!set.has(word[i])){msg.textContent=word[i].toUpperCase()+' is not in the puzzle';msg.style.color='#ff5b5b';return;}}
  if(sb.found.indexOf(word)>=0){msg.textContent='Already found!';msg.style.color='#f0c060';return;}
  if(SB_WORDLIST.indexOf(word)<0){msg.textContent='Not in word list';msg.style.color='#ff5b5b';return;}
  // Score it
  sb.found.push(word);
  var pts=word.length===4?1:word.length;
  var allLetters=new Set([sb.center].concat(sb.outer));
  var usedAll=true;allLetters.forEach(function(l){if(word.indexOf(l)<0)usedAll=false;});
  if(usedAll){pts+=7;msg.textContent='PANGRAM! +'+pts+'pts';msg.style.color='#f0c060';}
  else{msg.textContent='+'+pts+'pts';msg.style.color='#5bff8a';}
  sb.score+=pts;
  document.getElementById('sbScore').textContent=sb.score;
  document.getElementById('sbWords').textContent=sb.found.length;
  // Render found words
  document.getElementById('sbFound').innerHTML=sb.found.map(function(w){return'<span class="sb-found-word">'+w+'</span>';}).join('');
  postScore('spelling',sb.score);
}

function sbStart(){
  gamesEnsurePlayer(function(){
    var puzzle=sbGenPuzzle();
    sb.center=puzzle.center;sb.outer=puzzle.outer;sb.found=[];sb.score=0;sb.on=true;
    document.getElementById('sbScore').textContent='0';
    document.getElementById('sbWords').textContent='0';
    document.getElementById('sbMsg').textContent='';
    document.getElementById('sbFound').innerHTML='';
    document.getElementById('sbInput').value='';
    document.getElementById('sbBtn').disabled=false;
    sbRenderHex();
    document.getElementById('sbInput').focus();
  });
}

// ── Games Admin Toggle ──
function gamesToggleAdmin() {
  if (isAdmin('games')) {
    setAdmin('games', false);
    document.getElementById('gAdminBtn').textContent = '🔒';
    document.getElementById('gAdminBtn').title = 'Unlock admin';
  } else {
    requireAdmin('games', function() {
      document.getElementById('gAdminBtn').textContent = '🔓';
      document.getElementById('gAdminBtn').title = 'Lock admin';
      loadLeaderboard(GAMES_CURRENT);
    });
  }
  loadLeaderboard(GAMES_CURRENT);
}

// ── Global Key Handler ──
document.addEventListener('keydown', function(e) {
  if (GAMES_CURRENT === 'tetris') tetKey(e);
  else if (GAMES_CURRENT === '2048') g48Key(e);
  else if (GAMES_CURRENT === 'flappy') { if (e.key === ' ') { flpFlap(); e.preventDefault(); } }
  else if (GAMES_CURRENT === 'wordguess') wgKey(e);
  else if (GAMES_CURRENT === 'pacman') pacKey(e);
  else if (GAMES_CURRENT === 'frogger') frgKey(e);
});

// ── Init ──
window.addEventListener('DOMContentLoaded', function() {
  if (GAMES_PLAYER) document.getElementById('gPlayerName').textContent = GAMES_PLAYER;
  wamInit();
  onFirebaseReady(function() { loadLeaderboard('whackmole'); });
});
