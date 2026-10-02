// theme.js — Theme switching + puke glitter effect

function changeTheme(theme) {
  document.body.className = "";
  if (theme !== "dark") {
    document.body.classList.add("theme-" + theme);
  }
  try { localStorage.setItem("offspec_theme", theme); } catch(e) {}

  // Glitter canvas for PUKE theme
  var existing = document.getElementById("pukeCanvas");
  if (theme === "puke") {
    if (!existing) {
      var canvas = document.createElement("canvas");
      canvas.id = "pukeCanvas";
      document.body.insertBefore(canvas, document.body.firstChild);
      startGlitter(canvas);
    }
  } else {
    if (existing) { existing.remove(); stopGlitter(); }
  }
}

var _glitterRAF = null;

function stopGlitter() {
  if (_glitterRAF) { cancelAnimationFrame(_glitterRAF); _glitterRAF = null; }
}

function startGlitter(canvas) {
  var ctx = canvas.getContext("2d");
  var particles = [];
  var colors = ["#ff1493","#ff69b4","#ff4dbb","#fff200","#a855f7","#00d4ff","#ff80c8","#ffffff","#ffb6e8","#c0ff80"];
  var shapes = ["circle","star","diamond","heart"];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  for (var i = 0; i < 120; i++) { particles.push(newParticle(true)); }

  function newParticle(random) {
    var y = random ? Math.random() * canvas.height : -10;
    return {
      x: Math.random() * canvas.width, y: y,
      size: Math.random() * 6 + 2,
      speedY: Math.random() * 1.5 + 0.4,
      speedX: (Math.random() - 0.5) * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      alpha: Math.random() * 0.6 + 0.4,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.08 + 0.02
    };
  }

  function drawStar(ctx, x, y, r, rot) {
    ctx.beginPath();
    for (var i = 0; i < 5; i++) {
      var angle = rot + i * Math.PI * 2 / 5 - Math.PI / 2;
      var innerAngle = rot + (i + 0.5) * Math.PI * 2 / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
      else ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
      ctx.lineTo(x + Math.cos(innerAngle) * r * 0.4, y + Math.sin(innerAngle) * r * 0.4);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.twinkle += p.twinkleSpeed;
      var alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      if (p.shape === "circle") {
        ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath(); ctx.arc(0, 0, p.size * 1.8, 0, Math.PI * 2); ctx.stroke();
      } else if (p.shape === "star") {
        drawStar(ctx, 0, 0, p.size, 0); ctx.fill();
      } else if (p.shape === "diamond") {
        ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.lineTo(p.size, 0); ctx.lineTo(0, p.size); ctx.lineTo(-p.size, 0); ctx.closePath(); ctx.fill();
      } else if (p.shape === "heart") {
        var s = p.size * 0.6;
        ctx.beginPath(); ctx.moveTo(0, s);
        ctx.bezierCurveTo(-s * 2, -s, -s * 2, -s * 3, 0, -s * 2);
        ctx.bezierCurveTo(s * 2, -s * 3, s * 2, -s, 0, s);
        ctx.fill();
      }
      ctx.restore();
      p.x += p.speedX; p.y += p.speedY; p.rotation += p.rotSpeed;
      if (p.y > canvas.height + 20) particles[i] = newParticle(false);
    }
    _glitterRAF = requestAnimationFrame(draw);
  }
  draw();
}

function loadTheme() {
  try {
    var saved = localStorage.getItem("offspec_theme");
    if (saved) {
      document.getElementById("themeSelect").value = saved;
      changeTheme(saved);
    }
  } catch(e) {}
}
