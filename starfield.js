/**
 * Starfield Particle & Cinematic Meteor Background
 * Renders subtle static twinkling background stars and occasional premium meteor streaks.
 * Fully responsive density controls and supports prefers-reduced-motion accessibility.
 */
class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');

    // Performance and accessibility state
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Configurations
    this.stars = [];
    this.meteors = [];
    this.maxMeteors = 3;
    this.nextMeteorSpawn = Date.now() + Math.random() * 4000;

    this.init();
    this.bindEvents();

    if (!this.reducedMotion) {
      this.animate();
    } else {
      this.renderStatic();
    }
  }

  init() {
    this.resize();
    this.stars = [];
    this.meteors = [];

    // Setup density rules based on viewport
    const width = this.canvas.width;
    let numStars = 150;

    if (width > 1024) {
      this.maxMeteors = 4; // Desktop: 2-5 active
      numStars = 180;
    } else if (width > 768) {
      this.maxMeteors = 2; // Tablet: max 2 active
      numStars = 100;
    } else {
      this.maxMeteors = 1; // Mobile: max 1 active
      numStars = 60;
    }

    // Create static background stars with twinkling features
    const colors = ['#ffffff', '#00d2ff', '#7c4dff', '#00f5d4'];
    for (let i = 0; i < numStars; i++) {
      const colorIndex = Math.random() > 0.85 ? Math.floor(Math.random() * colors.length) : 0;
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.5 + 0.4,
        color: colors[colorIndex],
        alpha: Math.random() * 0.4 + 0.1,
        baseAlpha: Math.random() * 0.4 + 0.1,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.init();
      if (this.reducedMotion) this.renderStatic();
    });

    // Listen for accessibility changes dynamically
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        this.meteors = [];
        this.renderStatic();
      } else {
        this.animate();
      }
    });
  }

  // Warp-trigger stub for compatibility with click triggers in app.js
  triggerWarp() {
    // Intentionally left blank as user wanted to REMOVE the warp speed hyperdrive effect.
    // Instead of warping, we trigger a subtle meteor streak trigger occasionally on clicks.
    this.spawnMeteor();
  }

  spawnMeteor() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Colors based on portfolio design language
    const colors = [
      '#00f5d4', // Cyan
      '#00d2ff', // Electric Blue
      '#7c4dff'  // Nebular Violet
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Generate diagonal trajectory variables
    // Angle representing top-right to bottom-left (~135 degrees)
    const angle = 2.2 + Math.random() * 0.3; // radians
    const speed = Math.random() * 6 + 8; // fast movement

    this.meteors.push({
      x: Math.random() * width * 1.2 + width * 0.1, // starts top right edge
      y: Math.random() * -100 - 50,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: Math.random() * 120 + 80,
      thickness: Math.random() * 1.8 + 0.8,
      color: color,
      opacity: Math.random() * 0.6 + 0.4
    });
  }

  drawMeteors() {
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];

      // Update meteor position
      m.x += m.vx;
      m.y += m.vy;

      // Remove meteor when it leaves bottom-left viewport boundary
      if (m.x < -m.length || m.y > this.canvas.height + m.length) {
        this.meteors.splice(i, 1);
        continue;
      }

      // Calculate trailing point coordinates
      const dx = m.vx;
      const dy = m.vy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / dist;
      const uy = dy / dist;

      const tailX = m.x - ux * m.length;
      const tailY = m.y - uy * m.length;

      // Draw meteor tail gradient
      const grad = this.ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, m.color);
      grad.addColorStop(0.2, m.color);
      grad.addColorStop(1, 'rgba(3, 5, 10, 0)');

      this.ctx.save();
      this.ctx.globalAlpha = m.opacity;

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = m.thickness;
      this.ctx.lineCap = 'round';

      this.ctx.beginPath();
      this.ctx.moveTo(m.x, m.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();

      // Draw tiny glowing head
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = m.color;
      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.thickness * 1.1, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  drawTwinklingStars() {
    this.stars.forEach(s => {
      if (!this.reducedMotion) {
        // Change twinkle direction at limits
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha >= s.baseAlpha + 0.15 || s.alpha >= 0.8) {
          s.twinkleDir = -1;
        } else if (s.alpha <= s.baseAlpha - 0.15 || s.alpha <= 0.05) {
          s.twinkleDir = 1;
        }
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  renderStatic() {
    this.ctx.fillStyle = '#03050a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawTwinklingStars();
  }

  animate() {
    if (this.reducedMotion) return;

    // Soft clear maintaining static colors
    this.ctx.fillStyle = '#03050a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background layers
    this.drawTwinklingStars();

    // Spawning logic for random meteors
    if (this.meteors.length < this.maxMeteors && Date.now() > this.nextMeteorSpawn) {
      this.spawnMeteor();
      // Schedule next meteor spawn randomly: 2s to 6s
      this.nextMeteorSpawn = Date.now() + Math.random() * 4000 + 2000;
    }

    this.drawMeteors();

    requestAnimationFrame(() => this.animate());
  }
}

// Export initialization hook globally
window.initStarfield = (canvasId) => new Starfield(canvasId);
