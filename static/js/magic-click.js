(() => {
  // ========================================================
  // CONFIGURATION - HIỆU ỨNG VÒNG TRÒN MA THUẬT NHẸ NHÀNG
  // Dễ dàng tùy chỉnh độ lớn, độ mờ và thời gian tại đây
  // ========================================================
  const CONFIG = {
    // Vòng tròn ma thuật chính (Loading icon xoay)
    circle: {
      minSize: 12,              // Bán kính khởi đầu (px)
      maxSize: 42,              // Bán kính tối đa (~84px đường kính - nhỏ gọn, tinh tế)
      duration: 550,            // Thời gian hiệu ứng tồn tại (ms) - nhanh gọn, mượt mà
      maxAlpha: 0.38,           // Độ đậm nhạt tối đa (0.38 là mờ nhẹ, không chói mắt)
      shadowBlur: 10,           // Độ phát sáng mềm mại
      shadowColor: "#8ee8ff",   // Màu dạ quang xanh băng
      rotationSpeed: 0.0025     // Tốc độ xoay nhẹ
    },

    // Vòng sóng lan tỏa (Gợn sóng mỏng nhẹ)
    ring: {
      enable: true,
      minRadius: 6,
      maxRadius: 36,            // Bán kính lan tỏa nhỏ
      duration: 480,            // Thời gian tan biến (ms)
      maxAlpha: 0.28,           // Độ mờ nhạt
      lineWidth: 1,             // Viền mỏng thanh thoát
      color: "#9eefff"
    },

    // Bụi sao lấp lánh (Ngôi sao nhỏ bay nhẹ)
    stars: {
      enable: true,
      countMin: 4,              // Số lượng ít vừa đủ (4-7 hạt)
      countMax: 7,
      sizeMin: 1.2,             // Kích thước hạt nhỏ
      sizeMax: 2.2,
      speedMin: 0.5,            // Tốc độ bay chậm, êm
      speedMax: 1.3,
      durationMin: 400,
      durationMax: 650,
      maxAlpha: 0.5
    },

    // Tia sáng li ti xung quanh
    sparks: {
      enable: true,
      count: 4,
      sizeMin: 0.8,
      sizeMax: 1.6,
      distanceMin: 8,
      distanceMax: 22,
      durationMin: 350,
      durationMax: 550,
      maxAlpha: 0.45
    }
  };

  // Tạo Canvas overlay
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
  let isRunning = false;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  // Tải hình ảnh vòng tròn ma thuật
  const magicCircle = new Image();
  magicCircle.src = "/images/loading.png";

  const effects = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Vẽ ngôi sao ma thuật nhỏ
  function drawStar(x, y, r, rotation, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    ctx.shadowBlur = r * 3;
    ctx.shadowColor = CONFIG.circle.shadowColor;
    ctx.fillStyle = "#e6faff";

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const radius = i % 2 === 0 ? r : r * 0.22;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Vẽ hạt sáng li ti
  function drawSpark(x, y, r, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 6;
    ctx.shadowColor = CONFIG.circle.shadowColor;
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Tạo hiệu ứng vòng tròn ma thuật
  function createMagicCircle(x, y) {
    effects.push({
      type: "circle",
      x,
      y,
      start: performance.now(),
      duration: CONFIG.circle.duration,
      minSize: CONFIG.circle.minSize,
      maxSize: CONFIG.circle.maxSize,
      rotation: random(0, Math.PI * 2),
      rotationSpeed: CONFIG.circle.rotationSpeed
    });
  }

  // Tạo vòng lan tỏa
  function createRing(x, y) {
    if (!CONFIG.ring.enable) return;
    effects.push({
      type: "ring",
      x,
      y,
      start: performance.now(),
      duration: CONFIG.ring.duration,
      minRadius: CONFIG.ring.minRadius,
      maxRadius: CONFIG.ring.maxRadius
    });
  }

  // Tạo hạt bụi sao
  function createStars(x, y) {
    if (!CONFIG.stars.enable) return;
    const amount = Math.floor(random(CONFIG.stars.countMin, CONFIG.stars.countMax + 1));
    for (let i = 0; i < amount; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(CONFIG.stars.speedMin, CONFIG.stars.speedMax);

      effects.push({
        type: "star",
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        start: performance.now(),
        duration: random(CONFIG.stars.durationMin, CONFIG.stars.durationMax),
        size: random(CONFIG.stars.sizeMin, CONFIG.stars.sizeMax),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.06, 0.06)
      });
    }
  }

  // Tạo tia sáng phụ li ti
  function createSparks(x, y) {
    if (!CONFIG.sparks.enable) return;
    for (let i = 0; i < CONFIG.sparks.count; i++) {
      const angle = random(0, Math.PI * 2);
      const dist = random(CONFIG.sparks.distanceMin, CONFIG.sparks.distanceMax);

      effects.push({
        type: "spark",
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        start: performance.now(),
        duration: random(CONFIG.sparks.durationMin, CONFIG.sparks.durationMax),
        size: random(CONFIG.sparks.sizeMin, CONFIG.sparks.sizeMax)
      });
    }
  }

  // Bắt sự kiện Click
  document.addEventListener("click", (event) => {
    const x = event.clientX;
    const y = event.clientY;

    createMagicCircle(x, y);
    createRing(x, y);
    createStars(x, y);
    createSparks(x, y);

    // Kích hoạt animation loop nếu đang nghỉ
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  });

  // Vòng lặp Render (Tự động tạm dừng khi hết hiệu ứng để tiết kiệm pin/CPU)
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

      const p = easeOutCubic(progress);

      // --- VÒNG TRÒN MA THUẬT ---
      if (e.type === "circle") {
        const size = e.minSize + (e.maxSize - e.minSize) * p;

        // Fade in mượt trong 20% đầu, sau đó fade out nhẹ nhàng
        let alpha = progress < 0.2
          ? (progress / 0.2) * CONFIG.circle.maxAlpha
          : (1 - (progress - 0.2) / 0.8) * CONFIG.circle.maxAlpha;

        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rotation + time * e.rotationSpeed);
        ctx.globalAlpha = Math.max(0, alpha);

        ctx.shadowBlur = CONFIG.circle.shadowBlur;
        ctx.shadowColor = CONFIG.circle.shadowColor;
        ctx.globalCompositeOperation = "screen";

        if (magicCircle.complete && magicCircle.naturalWidth > 0) {
          ctx.drawImage(magicCircle, -size, -size, size * 2, size * 2);
        }
        ctx.restore();
      }

      // --- VÒNG SÓNG LAN TỎA ---
      else if (e.type === "ring") {
        const radius = e.minRadius + (e.maxRadius - e.minRadius) * p;
        const alpha = (1 - progress) * CONFIG.ring.maxAlpha;

        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.strokeStyle = CONFIG.ring.color;
        ctx.lineWidth = CONFIG.ring.lineWidth;
        ctx.shadowBlur = 6;
        ctx.shadowColor = CONFIG.circle.shadowColor;

        ctx.beginPath();
        ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // --- SAO MA THUẬT ---
      else if (e.type === "star") {
        e.x += e.vx;
        e.y += e.vy;
        e.vx *= 0.97;
        e.vy *= 0.97;
        e.rotation += e.rotationSpeed;

        const alpha = (1 - Math.pow(progress, 1.3)) * CONFIG.stars.maxAlpha;
        drawStar(e.x, e.y, e.size, e.rotation, Math.max(0, alpha));
      }

      // --- TIA SÁNG LI TI ---
      else if (e.type === "spark") {
        const alpha = (1 - progress) * CONFIG.sparks.maxAlpha;
        drawSpark(e.x, e.y, e.size, Math.max(0, alpha));
      }
    }

    if (effects.length > 0) {
      requestAnimationFrame(render);
    } else {
      isRunning = false;
      ctx.clearRect(0, 0, W, H);
    }
  }
})();
