(() => {
  const canvas = document.createElement("canvas");
  canvas.id = "magic-click-canvas";

  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "99999"
  });

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W, H;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * DPR;
    canvas.height = H * DPR;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  // =========================
  // MAGIC CIRCLE
  // =========================

  const magicCircle = new Image();
  magicCircle.src = "/images/loading.png";

  // =========================
  // PARTICLES
  // =========================

  const effects = [];

  const COLORS = [
    "#dfffff",
    "#b8f5ff",
    "#8ee8ff",
    "#73d8ff",
    "#ffffff"
  ];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // =========================
  // STAR
  // =========================

  function drawStar(x, y, r, rotation, alpha) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    // Glow
    ctx.shadowBlur = r * 5;
    ctx.shadowColor = "#9eefff";

    ctx.fillStyle = "#dfffff";

    ctx.beginPath();

    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const radius = i % 2 === 0 ? r : r * 0.18;

      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // =========================
  // SMALL SPARK
  // =========================

  function drawSpark(x, y, r, alpha) {
    ctx.save();

    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#8ee8ff";

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // =========================
  // MAGIC RING EFFECT
  // =========================

  function createMagicCircle(x, y) {
    effects.push({
      type: "circle",

      x,
      y,

      start: performance.now(),

      duration: 1150,

      size: 20,

      rotation: random(0, Math.PI * 2),

      rotationSpeed: random(0.0018, 0.003),

      alpha: 1
    });
  }

  // =========================
  // STAR BURST
  // =========================

  function createStars(x, y) {
    const amount = Math.floor(random(12, 20));

    for (let i = 0; i < amount; i++) {
      const angle = random(0, Math.PI * 2);

      const speed = random(0.8, 2.2);

      effects.push({
        type: "star",

        x,
        y,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        start: performance.now(),

        duration: random(650, 1100),

        size: random(2, 5),

        rotation: random(0, Math.PI * 2),

        rotationSpeed: random(-0.08, 0.08),

        alpha: 1
      });
    }
  }

  // =========================
  // EXTRA RING
  // =========================

  function createRing(x, y) {
    effects.push({
      type: "ring",

      x,
      y,

      start: performance.now(),

      duration: 750,

      radius: 5,

      maxRadius: random(65, 95),

      alpha: 0.8
    });
  }

  // =========================
  // CLICK
  // =========================

  document.addEventListener("click", (event) => {
    const x = event.clientX;
    const y = event.clientY;

    createMagicCircle(x, y);
    createRing(x, y);
    createStars(x, y);

    // Extra tiny sparks
    for (let i = 0; i < 10; i++) {
      const angle = random(0, Math.PI * 2);

      const distance = random(10, 35);

      effects.push({
        type: "spark",

        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,

        start: performance.now(),

        duration: random(450, 850),

        size: random(1, 2.5),

        alpha: 1
      });
    }
  });

  // =========================
  // RENDER
  // =========================

  function render(time) {
    ctx.clearRect(0, 0, W, H);

    for (let i = effects.length - 1; i >= 0; i--) {
      const e = effects[i];

      const elapsed = time - e.start;
      const progress = elapsed / e.duration;

      if (progress >= 1) {
        effects.splice(i, 1);
        continue;
      }

      // ---------------------
      // MAGIC CIRCLE
      // ---------------------

      if (e.type === "circle") {
        const p = easeOutCubic(progress);

        const size = 25 + p * 125;

        let alpha;

        if (progress < 0.2) {
          alpha = progress / 0.2;
        } else {
          alpha = 1 - ((progress - 0.2) / 0.8);
        }

        ctx.save();

        ctx.translate(e.x, e.y);

        ctx.rotate(
          e.rotation +
          time * e.rotationSpeed
        );

        ctx.globalAlpha = alpha * 0.9;

        // Glow
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#8ee8ff";

        ctx.globalCompositeOperation = "screen";

        if (magicCircle.complete) {
          ctx.drawImage(
            magicCircle,
            -size,
            -size,
            size * 2,
            size * 2
          );
        }

        ctx.restore();
      }

      // ---------------------
      // EXTRA RING
      // ---------------------

      if (e.type === "ring") {
        const p = easeOutCubic(progress);

        const radius =
          e.radius +
          (e.maxRadius - e.radius) * p;

        const alpha =
          (1 - progress) * 0.7;

        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.strokeStyle = "#9eefff";

        ctx.lineWidth = 1.5;

        ctx.shadowBlur = 12;
        ctx.shadowColor = "#73d8ff";

        ctx.beginPath();

        ctx.arc(
          e.x,
          e.y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();
      }

      // ---------------------
      // STARS
      // ---------------------

      if (e.type === "star") {
        e.x += e.vx;
        e.y += e.vy;

        e.vx *= 0.985;
        e.vy *= 0.985;

        e.rotation += e.rotationSpeed;

        const alpha =
          1 - Math.pow(progress, 1.5);

        drawStar(
          e.x,
          e.y,
          e.size,
          e.rotation,
          alpha
        );
      }

      // ---------------------
      // SPARKS
      // ---------------------

      if (e.type === "spark") {
        const p = progress;

        const alpha = 1 - p;

        drawSpark(
          e.x,
          e.y,
          e.size,
          alpha
        );
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
