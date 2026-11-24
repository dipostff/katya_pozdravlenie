(() => {
  const LETTER = `Солнышко ☀️
Моя хорошая, моя золотая,

с днём рождения тебя! 🎂

В такие дни хочется остановиться и сказать то, что обычно остаётся несказанным за повседневными заботами. Я тебя очень люблю. Это не просто красивые слова: рядом с тобой я чувствую себя спокойнее, увереннее и настоящим.

Я часто думаю о том, как всё сложилось, и очень рад, что судьба нас свела. Встретить такого важного человека, как ты, это большая удача, и я ценю её гораздо глубже, чем умею выразить. Ты стала частью моей жизни, и без тебя она была бы совсем другой.

Мне хочется, чтобы этот год стал для тебя особенным. Я желаю тебе:

Здоровья. Чтобы тело было сильным, а силы никогда не заканчивались. Всё остальное можно наладить, а здоровье нужно беречь, и я хочу, чтобы ты берегла себя.

Весёлого настроения вне зависимости от ситуаций и окружения. Жизнь не всегда бывает лёгкой, и люди вокруг бывают разными. Пусть в трудные дни у тебя остаётся умение улыбаться, а внутри живёт то лёгкое и светлое, что никто не сможет отнять.

Чтобы всё, что ты загадала, сбылось. Каждая мечта, большая или маленькая. Ты заслуживаешь того, к чему стремишься, и я искренне верю в тебя. Что бы ты ни выбрала, я хочу быть рядом и поддерживать тебя на этом пути.

Быть такой же счастливой. Такой же искренней, светлой и настоящей, какая ты есть сейчас. Пусть в твоей жизни будет только больше поводов для счастья.

Спасибо тебе за тепло, за терпение и за то, что ты рядом. Я хочу, чтобы ты знала: ты для меня очень много значишь, и я всегда буду на твоей стороне.

Люблю тебя, дорогая ❤️`;

  const PHRASE = "Я тебя люблю<3";
  const CHAR_MS_MIN = 77; // ~13 chars/sec
  const CHAR_MS_MAX = 100; // ~10 chars/sec
  const AFTER_LETTER_DELAY = 3000;

  const body = document.body;
  const stageIntro = document.getElementById("stage-intro");
  const stageLetter = document.getElementById("stage-letter");
  const stageFinale = document.getElementById("stage-finale");
  const btnRead = document.getElementById("btn-read");
  const btnContinue = document.getElementById("btn-continue");
  const letterText = document.getElementById("letter-text");
  const caret = document.getElementById("caret");
  const afterLetter = document.getElementById("after-letter");
  const heartField = document.getElementById("heart-field");
  const photoWrap = document.querySelector(".photo-wrap");
  const bdayTitle = document.getElementById("bday-title");
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");

  function showStage(next) {
    [stageIntro, stageLetter, stageFinale].forEach((stage) => {
      const active = stage === next;
      stage.classList.toggle("is-active", active);
      stage.hidden = !active;
    });
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function scrollLetterIntoView() {
    const rect = caret.getBoundingClientRect();
    const margin = Math.min(160, window.innerHeight * 0.28);
    if (rect.bottom > window.innerHeight - margin) {
      window.scrollBy({
        top: rect.bottom - (window.innerHeight - margin),
        behavior: "smooth",
      });
    }
  }

  function typeLetter() {
    return new Promise((resolve) => {
      let i = 0;

      const tick = () => {
        if (i >= LETTER.length) {
          caret.classList.add("is-hidden");
          resolve();
          return;
        }

        letterText.textContent += LETTER[i];
        i += 1;
        scrollLetterIntoView();
        window.setTimeout(tick, randomBetween(CHAR_MS_MIN, CHAR_MS_MAX));
      };

      tick();
    });
  }

  /** Parametric heart point in normalized space roughly [-1, 1]. */
  function heartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      -(13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t));
    return { x: x / 17, y: y / 17 };
  }

  function buildHeartPhrases() {
    heartField.innerHTML = "";
    const mobile = window.innerWidth < 480;
    const frag = document.createDocumentFragment();
    // Точки внутри круга фото пропускаем (не раздуваем в кольцо — иначе теряется сердце)
    const photoClearance = mobile ? 26 : 27;
    // Несколько контуров сердца разного размера — объём + узнаваемая форма
    const layers = mobile
      ? [
          { size: 38, count: 26 },
          { size: 46, count: 34 },
          { size: 54, count: 28 },
        ]
      : [
          { size: 40, count: 30 },
          { size: 48, count: 40 },
          { size: 56, count: 32 },
        ];
    // Чуть выше: выемка сверху и остриё снизу читаются лучше вокруг фото
    const yBias = mobile ? -4 : -5;

    for (const layer of layers) {
      for (let i = 0; i < layer.count; i += 1) {
        const t = (i / layer.count) * Math.PI * 2 + randomBetween(-0.025, 0.025);
        const p = heartPoint(t);
        const radial = randomBetween(0.98, 1.03);
        const ox = p.x * radial * layer.size;
        const oy = p.y * radial * layer.size + yBias;

        if (Math.hypot(ox, oy) < photoClearance) continue;

        const el = document.createElement("span");
        el.className = "heart-phrase";
        el.textContent = PHRASE;

        const scale = randomBetween(0.72, 1.08);
        const rot = randomBetween(-22, 22);

        el.style.left = `${50 + ox}%`;
        el.style.top = `${50 + oy}%`;
        el.style.fontSize = `calc(${scale} * clamp(0.52rem, 2vw, 0.82rem))`;
        el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
        el.style.zIndex = String(Math.floor(randomBetween(1, 4)));
        el.style.setProperty(
          "--twinkle-duration",
          `${randomBetween(2.2, 4.6).toFixed(2)}s`
        );
        el.style.setProperty(
          "--twinkle-delay",
          `${randomBetween(0, 3.5).toFixed(2)}s`
        );
        el.dataset.delay = String(Math.floor(randomBetween(0, 900)));
        frag.appendChild(el);
      }
    }

    heartField.appendChild(frag);
  }

  function revealHeartPhrases() {
    const nodes = [...heartField.querySelectorAll(".heart-phrase")];
    nodes.forEach((el) => {
      window.setTimeout(() => {
        el.classList.add("is-visible");
      }, Number(el.dataset.delay) || 0);
    });
  }

  /* —— Fireworks —— */
  let fireworksRunning = false;
  let fireworksRaf = 0;
  const rockets = [];
  const sparks = [];

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnRocket() {
    const x = randomBetween(window.innerWidth * 0.12, window.innerWidth * 0.88);
    rockets.push({
      x,
      y: window.innerHeight + 10,
      vx: randomBetween(-0.6, 0.6),
      vy: randomBetween(-11.5, -8.2),
      hue: randomBetween(0, 360),
      trail: [],
    });
  }

  function explode(x, y, hue) {
    const count = Math.floor(randomBetween(36, 58));
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + randomBetween(-0.08, 0.08);
      const speed = randomBetween(1.4, 5.2);
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: randomBetween(0.012, 0.024),
        hue: hue + randomBetween(-18, 18),
        size: randomBetween(1.4, 2.8),
      });
    }
  }

  function drawFireworks() {
    if (!fireworksRunning) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = "lighter";

    if (Math.random() < 0.045) spawnRocket();

    for (let i = rockets.length - 1; i >= 0; i -= 1) {
      const r = rockets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.085;
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 8) r.trail.shift();

      ctx.beginPath();
      for (let t = 0; t < r.trail.length; t += 1) {
        const p = r.trail[t];
        ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `hsla(${r.hue}, 90%, 72%, 0.85)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (r.vy >= -1.2 || r.y < window.innerHeight * randomBetween(0.18, 0.42)) {
        explode(r.x, r.y, r.hue);
        rockets.splice(i, 1);
      }
    }

    for (let i = sparks.length - 1; i >= 0; i -= 1) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.035;
      s.vx *= 0.986;
      s.vy *= 0.986;
      s.life -= s.decay;

      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 95%, 68%, ${s.life})`;
      ctx.fill();
    }

    fireworksRaf = requestAnimationFrame(drawFireworks);
  }

  function startFireworks() {
    resizeCanvas();
    fireworksRunning = true;
    for (let i = 0; i < 3; i += 1) {
      window.setTimeout(spawnRocket, i * 280);
    }
    drawFireworks();
  }

  async function startFinale() {
    body.classList.remove("theme-warm");
    body.classList.add("theme-night");
    showStage(stageFinale);
    window.scrollTo({ top: 0, behavior: "smooth" });

    buildHeartPhrases();

    window.setTimeout(() => {
      photoWrap.classList.add("is-visible");
    }, 350);

    window.setTimeout(() => {
      revealHeartPhrases();
    }, 700);

    window.setTimeout(() => {
      startFireworks();
    }, 1400);

    window.setTimeout(() => {
      bdayTitle.classList.add("is-visible");
    }, 2100);
  }

  btnRead.addEventListener("click", async () => {
    showStage(stageLetter);
    window.scrollTo(0, 0);
    await typeLetter();
    window.setTimeout(() => {
      afterLetter.hidden = false;
    }, AFTER_LETTER_DELAY);
  });

  btnContinue.addEventListener("click", () => {
    startFinale();
  });

  window.addEventListener("resize", () => {
    if (!fireworksRunning) return;
    resizeCanvas();
  });
})();
