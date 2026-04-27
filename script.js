/* ============ CANVAS AURORA BACKGROUND ============ */
(function () {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Shooting star particles
  const STARS = [];
  const SHOOTING = [];

  for (let i = 0; i < 160; i++) {
    STARS.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function spawnShooting() {
    SHOOTING.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * (window.innerHeight * 0.6),
      vx: 6 + Math.random() * 8,
      vy: 2 + Math.random() * 4,
      life: 1,
      decay: 0.015 + Math.random() * 0.02,
      len: 80 + Math.random() * 120,
    });
  }

  setInterval(spawnShooting, 2800);

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.006;

    // Draw twinkling stars
    STARS.forEach((s) => {
      const a = (Math.sin(t * s.speed * 80 + s.phase) + 1) / 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a * 0.8 + 0.1})`;
      ctx.fill();
    });

    // Draw shooting stars
    for (let i = SHOOTING.length - 1; i >= 0; i--) {
      const s = SHOOTING[i];
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.4);
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y - s.len * 0.4);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      if (s.life <= 0 || s.x > canvas.width + 100) SHOOTING.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============ REFERENCES ============ */
const textContainer = document.getElementById("textContainer");
const subtitleSlot = document.getElementById("subtitleSlot");
const finalMessage = document.getElementById("finalMessage");
const floatLayer = document.getElementById("floatLayer");

let letters = textContainer.querySelectorAll(".letter");

/* ============ COLORS ============ */
const PALETTE = ["#ff1493", "#ff6b9d", "#c084fc", "#60a5fa", "#fbbf24", "#f472b6", "#34d399", "#00d4ff"];

/* ============ CLICK EFFECTS ============ */
document.addEventListener("click", (e) => {
  spawnClickHearts(e.clientX, e.clientY);
  spawnRipple(e.clientX, e.clientY);
});

function spawnRipple(x, y) {
  const r = document.createElement("div");
  r.className = "ripple";
  r.style.left = x + "px";
  r.style.top = y + "px";
  r.style.setProperty("--color", PALETTE[Math.floor(Math.random() * PALETTE.length)]);
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 800);
}

function spawnClickHearts(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = document.createElement("div");
      h.className = "floating-heart";
      h.textContent = ["💕", "💖", "💗", "💓", "💝", "🌸", "✨"][Math.floor(Math.random() * 7)];
      const size = 18 + Math.random() * 22;
      h.style.cssText = `
        left: ${x}px; top: ${y}px;
        font-size: ${size}px;
        position: fixed;
        pointer-events: none;
        z-index: 999;
      `;
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 120;
      const dur = 1.2 + Math.random() * 1.2;
      h.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      h.style.setProperty("--ty", `${Math.sin(angle) * dist - 60}px`);
      h.style.setProperty("--rot", `${(Math.random() - 0.5) * 720}deg`);
      h.style.setProperty("--duration", `${dur}s`);
      document.body.appendChild(h);
      setTimeout(() => h.remove(), dur * 1000);
    }, i * 80);
  }
}

/* ============ STARS ============ */
function spawnStars(count = 0) {
  // Handled by canvas — keeping this for DOM fallback if needed
}

/* ============ AMBIENT FLOATING HEARTS ============ */
function spawnAmbientHearts(count = 30) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h = document.createElement("div");
      h.className = "floating-heart";
      h.textContent = ["💕", "💖", "💗", "💓", "💝"][Math.floor(Math.random() * 5)];
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight + 40;
      const size = 16 + Math.random() * 30;
      const dur = 8 + Math.random() * 10;
      const delay = Math.random() * 4;
      h.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        font-size: ${size}px;
        position: fixed;
        pointer-events: none;
        z-index: 99;
        animation-delay: ${delay}s;
      `;
      h.style.setProperty("--tx", `${(Math.random() - 0.5) * 200}px`);
      h.style.setProperty("--ty", `${-(window.innerHeight + 200)}px`);
      h.style.setProperty("--rot", `${(Math.random() - 0.5) * 720}deg`);
      h.style.setProperty("--duration", `${dur}s`);
      document.body.appendChild(h);
      setTimeout(() => h.remove(), (dur + delay) * 1000);
    }, i * 300);
  }
}

/* ============ PARTICLES ============ */
function createParticles(el, count = 35) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const size = 5 + Math.random() * 10;
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 160;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${cx}px;
      top: ${cy}px;
      position: fixed;
    `;
    p.style.setProperty("--color", color);
    p.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--ty", Math.sin(angle) * dist + "px");
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1800);
  }
}

/* ============ FIREWORKS ============ */
function launchFirework() {
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const sx = Math.random() * window.innerWidth;
  const sy = window.innerHeight;
  const ex = sx + (Math.random() - 0.5) * 120;
  const ey = window.innerHeight * 0.1 + Math.random() * window.innerHeight * 0.5;

  const fw = document.createElement("div");
  fw.className = "firework";
  fw.style.cssText = `left:${sx}px; top:${sy}px;`;
  fw.style.setProperty("--color", color);
  fw.style.setProperty("--tx", ex - sx + "px");
  fw.style.setProperty("--ty", ey - sy + "px");
  document.body.appendChild(fw);

  setTimeout(() => {
    fw.remove();
    boom(ex, ey, color);
    playSound("sound/firework.mp3", 0.35);
  }, 900);
}

function boom(x, y, color) {
  const count = 50 + Math.floor(Math.random() * 30);
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "firework-particle";
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 50 + Math.random() * 130;
    p.style.cssText = `left:${x}px; top:${y}px;`;
    p.style.setProperty("--color", color);
    p.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--ty", Math.sin(angle) * dist + "px");
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
  // Heart-shaped burst in center
  spawnClickHearts(x, y, 6);
}

/* ============ LIQUID MELT ============ */
// Melt a letter like liquid before it explodes:
// stretch → squish → disappear with blobs dripping off
function liquidMelt(el, onDone) {
  spawnLiquidDrops(el);
  el.classList.add("melting");
  setTimeout(() => {
    el.style.display = "none";
    if (onDone) onDone();
  }, 860);
}

function spawnLiquidDrops(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height;
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

  // Spawn 5-8 blobs that fall downward
  const count = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const drop = document.createElement("div");
      drop.className = "liquid-drop";
      const w = 6 + Math.random() * 14;
      const dur = 0.6 + Math.random() * 0.5;
      const txVal = (Math.random() - 0.5) * 40;
      const tyVal = 40 + Math.random() * 80;
      drop.style.cssText = `
        width: ${w}px;
        height: ${w * 1.4}px;
        left: ${cx + (Math.random() - 0.5) * rect.width * 0.8}px;
        top: ${cy}px;
      `;
      drop.style.setProperty("--color", color);
      drop.style.setProperty("--tx", txVal + "px");
      drop.style.setProperty("--ty", tyVal + "px");
      drop.style.setProperty("--dur", dur + "s");
      document.body.appendChild(drop);
      setTimeout(() => drop.remove(), dur * 1000 + 100);
    }, i * 60);
  }
}

function startFireworks(duration = 28000) {
  let elapsed = 0;
  (function shoot() {
    const gap = 900 + Math.random() * 600;
    const num = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < num; i++) setTimeout(launchFirework, i * 300);
    elapsed += gap;
    if (elapsed < duration) setTimeout(shoot, gap);
  })();
}

/* ============ ORBIT PARTICLES ============ */
function createOrbitParticles(wrapper) {
  const emojis = ["✨", "💫", "⭐", "🌟", "🔮", "💎"];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("div");
    p.className = "orbit-particle";
    p.textContent = emojis[i % emojis.length];
    p.style.setProperty("--angle", `${(360 / 8) * i}deg`);
    p.style.animationDelay = `${i * 0.12}s`;
    wrapper.appendChild(p);
  }

  // Sparkle trail
  const si = setInterval(() => {
    const h = document.querySelector(".animated-heart");
    if (!h) { clearInterval(si); return; }
    const rect = h.getBoundingClientRect();
    const sp = document.createElement("div");
    sp.className = "heart-sparkle";
    sp.textContent = ["✨", "💫", "🌸"][Math.floor(Math.random() * 3)];
    sp.style.font = "18px serif";
    sp.style.left = rect.left + rect.width / 2 + (Math.random() - 0.5) * 90 + "px";
    sp.style.top = rect.top + rect.height / 2 + (Math.random() - 0.5) * 90 + "px";
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 1400);
  }, 280);
}

/* ============ SUBTITLE ============ */
function setSubtitle(text) {
  subtitleSlot.textContent = text;
  subtitleSlot.classList.add("visible");
}

function clearSubtitle() {
  subtitleSlot.classList.remove("visible");
  setTimeout(() => { subtitleSlot.textContent = ""; }, 1500);
}

/* ============ SOUND ============ */
function playSound(src, vol = 0.4) {
  const a = new Audio(src);
  a.volume = vol;
  a.play().catch(() => { });
}

/* ============ LETTER EXPLOSION SOUND ============ */
function playExplodeSound() {
  playSound("sound/sret.mp3", 0.55);
}

/* ============ SHOW AMELIA SEQUENCE ============ */
function showAmelia() {
  textContainer.innerHTML = "";
  const chars = ["A", "M", "E", "L", "I", "A", "❤️"];
  const els = [];

  chars.forEach((c, i) => {
    const span = document.createElement("span");
    if (c === "❤️") {
      span.className = "animated-heart";
      span.textContent = c;
    } else {
      span.className = "amelia-letter";
      span.textContent = c;
      span.setAttribute("data-amelia-idx", i);
    }
    textContainer.appendChild(span);
    els.push(span);

    setTimeout(() => {
      if (c === "❤️") {
        // Heart entrance — scale + fade
        span.style.opacity = "0";
        span.style.transform = "scale(0) rotate(-180deg)";
        span.style.transition = "all 0.7s cubic-bezier(0.34,1.56,0.64,1)";
        setTimeout(() => {
          span.style.opacity = "1";
          span.style.transform = "scale(1) rotate(0deg)";
        }, 80);
        setTimeout(() => span.classList.add("pulse"), 900);
      } else {
        // Drip-in: letter set visible then drip animation runs
        span.style.opacity = "1";
        span.classList.add("drip-in");
        playSound("sound/water.mp3", 0.3);
      }
    }, i * 300);
  });

  // Enable goo-mode while dripping in
  textContainer.classList.add("goo-mode");
  setTimeout(() => textContainer.classList.remove("goo-mode"), 2200);

  // Particle burst on all letters
  setTimeout(() => {
    els.forEach(el => createParticles(el, 20));
    playSound("sound/fairy.mp3", 0.4);
  }, 2500);

  // Stage 1: hide I A (idx 4,5) → keep AMEL
  setTimeout(() => {
    [4, 5].forEach((idx, j) => {
      setTimeout(() => {
        const el = els[idx];
        if (!el) return;
        el.classList.add("fade-out");
        setTimeout(() => el.style.display = "none", 1200);
      }, j * 350);
    });
  }, 3200);

  // Stage 2: hide A M E (idx 0,1,2) then bring back I A
  setTimeout(() => {
    [0, 1, 2].forEach((idx, j) => {
      setTimeout(() => {
        const el = els[idx];
        if (!el) return;
        el.classList.add("fade-out");
        setTimeout(() => el.style.display = "none", 1000);
      }, j * 300);
    });

    // Bring back I and A (idx 4,5) with DRIP-IN effect
    setTimeout(() => {
      textContainer.classList.add("goo-mode");
      [4, 5].forEach((idx, j) => {
        const el = els[idx];
        if (!el) return;
        el.style.display = "inline-block";
        el.classList.remove("fade-out", "drip-in");
        el.style.opacity = "0";
        el.style.transform = "translateY(-80px) scaleY(2.4) scaleX(0.5)";
        setTimeout(() => {
          el.style.opacity = "1";
          el.classList.add("drip-in");
          playSound("sound/water.mp3", 0.3);
        }, j * 320);
      });
      setTimeout(() => textContainer.classList.remove("goo-mode"), 1200);
    }, 1100);
  }, 5800);

  // Final message
  setTimeout(() => showFinalMessage(), 8800);
}

/* ============ FINAL MESSAGE ============ */
function showFinalMessage() {
  // Pesan akhir dihilangkan sesuai permintaan
  // finalMessage.textContent = "✨ You are the reason for me to smile 💫";
  // finalMessage.classList.add("show");
}

/* ============ MOUSE AMBIENT LIGHT ============ */
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.querySelector(".orb-3").style.transform = `translate(${e.clientX - window.innerWidth / 2}px, ${e.clientY - window.innerHeight / 2}px)`;
});

/* ============ CARD 3D TILT ============ */
const card = document.getElementById("mainCard");
if (card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(1200px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.02)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)";
  });
}

/* ============ MAIN SEQUENCE ============ */
function animate() {
  spawnAmbientHearts(20);
  setInterval(() => spawnAmbientHearts(10), 18000);
  setSubtitle("✦ Sentuh layarnya sayangkuh ✦");

  // Show letters one by one
  letters.forEach((el, i) =>
    setTimeout(() => {
      el.classList.add("show");
    }, 400 + i * 200)
  );

  // MELT + EXPLODE: L O V E — liquid first, then particle burst
  setTimeout(() => {
    const loveKeys = ["L", "O", "V", "E"];
    clearSubtitle();
    // Turn on goo-mode so nearby letters merge into a blob
    textContainer.classList.add("goo-mode");

    loveKeys.forEach((k, i) => {
      const el = document.querySelector(`[data-letter="${k}"]`);
      if (!el) return;
      setTimeout(() => {
        // Phase 1: melt (400ms)
        spawnLiquidDrops(el);
        el.classList.add("melting");
        playExplodeSound();
        // Phase 2: particle burst while melted
        setTimeout(() => {
          createParticles(el, 35);
          el.style.display = "none";
        }, 450);
      }, i * 220);
    });

    // Insert heart after all LOVE melted
    setTimeout(() => {
      textContainer.classList.remove("goo-mode");
      const hw = document.createElement("div");
      hw.className = "heart-wrapper show";
      hw.innerHTML = '<div class="heart animated-heart">❤️</div>';
      setTimeout(() => createOrbitParticles(hw), 500);
      const yRef = document.querySelector('[data-letter="Y"]');
      textContainer.insertBefore(hw, yRef);
    }, 1050);
  }, 2400);

  // MELT + EXPLODE: Y O
  setTimeout(() => {
    textContainer.classList.add("goo-mode");
    ["Y", "O2"].forEach((k, i) => {
      const el = document.querySelector(`[data-letter="${k}"]`);
      if (!el) return;
      setTimeout(() => {
        spawnLiquidDrops(el);
        el.classList.add("melting");
        playExplodeSound();
        setTimeout(() => {
          createParticles(el, 40);
          el.style.display = "none";
        }, 450);
      }, i * 220);
    });
    setTimeout(() => textContainer.classList.remove("goo-mode"), 1000);
  }, 4600);

  // MELT + EXPLODE: I U
  setTimeout(() => {
    textContainer.classList.add("goo-mode");
    ["I", "U"].forEach((k, i) => {
      const el = document.querySelector(`[data-letter="${k}"]`);
      if (!el) return;
      setTimeout(() => {
        spawnLiquidDrops(el);
        el.classList.add("melting");
        playExplodeSound();
        setTimeout(() => {
          createParticles(el, 50);
          el.style.display = "none";
        }, 450);
      }, i * 260);
    });
    setTimeout(() => textContainer.classList.remove("goo-mode"), 1100);

    // Pulse the heart
    setTimeout(() => {
      const h = document.querySelector(".heart");
      if (h) h.classList.add("pulse");
    }, 900);
  }, 6700);

  // Transition to AMELIA
  setTimeout(() => {
    textContainer.innerHTML = "";
    showAmelia();
  }, 9800);

  // Start fireworks
  setTimeout(() => startFireworks(25000), 9000);
}

// Auto reload moved to start after envelope click

/* ============ CURSOR TRAIL ============ */
(function () {
  // Rainbow hue cycles smoothly as you move
  let hue = 0;
  let lastX = -999, lastY = -999;
  let dotCount = 0; // throttle: emit a dot every N pixels

  // Create the custom cursor dot
  const cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";
  document.body.appendChild(cursorDot);

  // Hide the default system cursor on the page
  document.body.style.cursor = "none";

  // Emoji pool for the occasional star burst
  const STARS_EMOJI = ["✨", "💫", "⭐", "🌟", "🌸", "💕", "💖"];

  document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Move cursor dot
    cursorDot.style.left = x + "px";
    cursorDot.style.top = y + "px";

    // Advance hue
    hue = (hue + 2) % 360;

    // Only spawn trail if mouse moved enough (avoid spam on tiny jitter)
    const dx = x - lastX, dy = y - lastY;
    if (dx * dx + dy * dy < 16) return; // < 4px movement
    lastX = x; lastY = y;
    dotCount++;

    // ── Colored dot trail ──
    const dot = document.createElement("div");
    dot.className = "trail-dot";
    const trailColor = `hsl(${hue}, 100%, 65%)`;
    const size = 6 + Math.random() * 7;
    const dur = 0.4 + Math.random() * 0.35;
    dot.style.cssText = `
      left: ${x}px;
      top:  ${y}px;
      width:  ${size}px;
      height: ${size}px;
    `;
    dot.style.setProperty("--trail-color", trailColor);
    dot.style.setProperty("--trail-dur", dur + "s");
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), dur * 1000 + 50);

    // ── Emoji star (every ~6 dots) ──
    if (dotCount % 6 === 0) {
      const star = document.createElement("div");
      star.className = "trail-star";
      star.textContent = STARS_EMOJI[Math.floor(Math.random() * STARS_EMOJI.length)];
      const starDur = 0.7 + Math.random() * 0.5;
      const starSize = 12 + Math.random() * 10;
      star.style.left = x + (Math.random() - 0.5) * 20 + "px";
      star.style.top = y + (Math.random() - 0.5) * 20 + "px";
      star.style.setProperty("--star-dur", starDur + "s");
      star.style.setProperty("--star-size", starSize + "px");
      document.body.appendChild(star);
      setTimeout(() => star.remove(), starDur * 1000 + 50);
    }
  });

  // Cursor grows on hover over interactive elements
  document.addEventListener("mouseover", (e) => {
    if (e.target.matches("span, button, a, .letter, .amelia-letter")) {
      cursorDot.classList.add("big");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.matches("span, button, a, .letter, .amelia-letter")) {
      cursorDot.classList.remove("big");
    }
  });

  // Restore cursor when leaving the window
  document.addEventListener("mouseleave", () => {
    document.body.style.cursor = "";
    cursorDot.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    document.body.style.cursor = "none";
    cursorDot.style.opacity = "1";
  });
})();

/* ============ START ============ */
const introScreen = document.getElementById("introScreen");
const envelope = document.getElementById("envelope");
const bgMusic = document.getElementById("bgMusic");

if (envelope && introScreen) {
  envelope.addEventListener("click", () => {
    // Cegah double click
    if (envelope.classList.contains("open") || envelope.classList.contains("shake")) return;

    // Tambahkan efek suara saat amplop disentuh
    playSound("sound/water.mp3", 0.6);

    // 1. Amplop bergetar dulu
    envelope.classList.add("shake");

    setTimeout(() => {
      // 2. Buka amplopnya
      envelope.classList.add("open");

      // 3. Putar lagu latar (BGM)
      if (bgMusic) bgMusic.play().catch(() => { });

      // 4. Ledakan Hati terbang dari amplop
      const rect = envelope.getBoundingClientRect();
      spawnClickHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);

      // 5. Pudar & mulai animasi utama
      setTimeout(() => {
        introScreen.style.opacity = "0";
        setTimeout(() => {
          introScreen.style.display = "none";
          // Start main sequence
          animate();
        }, 1000);
      }, 3500); // Beri waktu 3.5 detik agar surat dan hati terlihat jelas
    }, 400); // Tunggu getaran selesai (400ms)
  });
} else {
  // Fallback if no envelope found
  animate();
}

/* ============ BIRTHDAY COUNTDOWN ============ */
function updateCountdowns() {
  const now = new Date();

  // Calculate next Tamam's Birthday (25 April)
  let yTamam = now.getFullYear();
  let dTamam = new Date(yTamam, 3, 25); // Month 3 = April
  if (now > dTamam) {
    dTamam.setFullYear(yTamam + 1);
  }

  // Calculate next Amelia's Birthday (13 Mei)
  let yAmelia = now.getFullYear();
  let dAmelia = new Date(yAmelia, 4, 13); // Month 4 = May
  if (now > dAmelia) {
    dAmelia.setFullYear(yAmelia + 1);
  }

  function formatDiff(targetDate) {
    const diff = targetDate - now;
    if (diff <= 0) return "HARI INI! 🎉";

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return `${d} hari ${h.toString().padStart(2, '0')} jam ${m.toString().padStart(2, '0')} menit ${s.toString().padStart(2, '0')} detik`;
  }

  const tTamam = document.getElementById("timerTamam");
  const tAmelia = document.getElementById("timerAmelia");

  if (tTamam) tTamam.textContent = formatDiff(dTamam);
  if (tAmelia) tAmelia.textContent = formatDiff(dAmelia);
}

setInterval(updateCountdowns, 1000);
updateCountdowns();

/* ============ DYNAMIC PHOTO SLIDESHOW ============ */
async function initDynamicSlideshow() {
  const container = document.getElementById("cardSlideshow");
  if (!container) return;

  let photos = [];

  try {
    // Coba ambil daftar file dari folder 'foto/' (Bekerja di Local Server / Server dengan Directory Listing)
    const response = await fetch('foto/');
    if (!response.ok) throw new Error("Directory listing not available");

    const html = await response.text();
    // Cari semua link berakhiran gambar di dalam HTML
    const regex = /href="([^"]+\.(?:jpg|jpeg|png|gif|webp))"/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
      let filename = decodeURIComponent(match[1]);
      // Jika href berisi path lengkap, ambil nama filenya saja
      filename = filename.split('/').pop();
      photos.push(filename);
    }

    // Hapus duplikat jika server mengembalikan nama file dua kali
    photos = [...new Set(photos)];

  } catch (error) {
    console.warn("Auto-fetch gagal, menggunakan daftar cadangan:", error);
    photos = [
      "lia1.jpeg",
      "lia2.jpeg",
      "lia3.jpeg",
      "lia4.jpeg",
      "lia5.png",
      "lia6.jpg",
      "lia7.jpg",
      "lia8.jpeg",
      "lia9.jpeg",
      "lia10.jpeg",
      "lia11.jpeg",
      "lia12.jpeg",
      "lia13.jpeg",
      "lia14.jpg"
    ];
  }

  if (photos.length === 0) return;

  const totalPhotos = photos.length;
  const timePerSlide = 3; // Setiap foto tampil selama 4 detik
  const totalTime = totalPhotos * timePerSlide;

  // Acak urutan foto
  const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);

  // Buat HTML untuk foto-foto
  shuffledPhotos.forEach((photo, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.backgroundImage = `url('foto/${encodeURIComponent(photo)}')`;
    slide.style.animation = `slideFadeDynamic ${totalTime}s infinite`;
    slide.style.animationDelay = `${index * timePerSlide}s`;
    container.appendChild(slide);
  });

  // Hitung persentase keyframes agar animasinya akurat berapapun jumlah fotonya
  // Waktu transisi (fade in) adalah 1 detik
  const fadePercent = (1 / totalTime) * 100;
  const activePercent = (timePerSlide / totalTime) * 100;

  // Buat style CSS Dinamis
  const styleHTML = `
    <style>
      @keyframes slideFadeDynamic {
        0%, 100% {
          opacity: 0;
          transform: scale(1);
        }
        ${fadePercent}%, ${activePercent}% {
          opacity: 1;
          transform: scale(1.05);
        }
        ${activePercent + fadePercent}% {
          opacity: 0;
          transform: scale(1.1);
        }
      }
    </style>
  `;
  document.head.insertAdjacentHTML("beforeend", styleHTML);
}

initDynamicSlideshow();
