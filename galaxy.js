/**
 * Interactive Technology Galaxy Canvas Visualizer
 * Simulates a tech solar system with tilted 3D orbital paths representing skills.
 * Features hover highlights, custom category color styling, and dynamic HUD database callbacks.
 */
class TechGalaxy {
  constructor(canvasId, callbackOnSelect) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.onSelect = callbackOnSelect;
    
    // Orbit rotation tracker for central HUD ring
    this.hudRotation = 0;
    
    // Core data: Skill list organized in Orbit Tiers (1: Inner, 2: Middle, 3: Outer)
    // Nodes are widely spread out around the orbit path angles to prevent overlap.
    // Competence ratings use neutral labels aligned with student profiles.
    this.skills = [
      // Orbit 1: Languages & Core (Tilt Angle: -0.22 rad, Speed: ~26s/rev)
      { name: 'Java', orbit: 1, angle: 0.0, speed: 0.004, color: '#00d2ff', category: 'Programming', exp: 'FAMILIAR', projects: 1, desc: 'Object-oriented programming concepts and application development.' },
      { name: 'Python', orbit: 1, angle: 1.2, speed: 0.004, color: '#ab47bc', category: 'Programming & AI', exp: 'PROJECT EXPERIENCE', projects: 2, desc: 'Primary scripting language used for sleep pattern analysis and machine learning research.' },
      { name: 'JavaScript', orbit: 1, angle: 2.4, speed: 0.004, color: '#00f5d4', category: 'Programming & Web', exp: 'PROJECT EXPERIENCE', projects: 2, desc: 'Interactive logic script writing for client-side web applications and navigation.' },
      { name: 'HTML & CSS', orbit: 1, angle: 3.6, speed: 0.004, color: '#00f5d4', category: 'Frontend', exp: 'PROJECT EXPERIENCE', projects: 3, desc: 'Responsive document layout structures, CSS styling, and dashboard coordinates.' },
      { name: 'Tailwind CSS', orbit: 1, angle: 4.8, speed: 0.004, color: '#00f5d4', category: 'Frontend', exp: 'WORKING KNOWLEDGE', projects: 2, desc: 'Utility-first CSS styling to format and structure user interfaces.' },
      
      // Orbit 2: Web Frameworks, Backend & DB (Tilt Angle: 0.12 rad, Speed: ~37s/rev)
      { name: 'React', orbit: 2, angle: 0.3, speed: 0.0028, color: '#00f5d4', category: 'Frontend', exp: 'WORKING KNOWLEDGE', projects: 2, desc: 'Component-driven interactive views, state controllers, and dynamic portfolio layouts.' },
      { name: 'Node.js', orbit: 2, angle: 1.3, speed: 0.0028, color: '#00d2ff', category: 'Backend', exp: 'FAMILIAR', projects: 1, desc: 'JavaScript runtime environment exploration for building local backend servers.' },
      { name: 'PHP', orbit: 2, angle: 2.3, speed: 0.0028, color: '#00d2ff', category: 'Backend', exp: 'FAMILIAR', projects: 1, desc: 'Server-side scripting environment for dynamic web applications.' },
      { name: 'MongoDB', orbit: 2, angle: 3.3, speed: 0.0028, color: '#7c4dff', category: 'Database', exp: 'FAMILIAR', projects: 1, desc: 'NoSQL document storage integration for NoteTube data logs.' },
      { name: 'PostgreSQL', orbit: 2, angle: 4.3, speed: 0.0028, color: '#7c4dff', category: 'Database', exp: 'FAMILIAR', projects: 1, desc: 'Relational data queries, table mappings, and SQL index definitions.' },
      { name: 'Oracle', orbit: 2, angle: 5.3, speed: 0.0028, color: '#7c4dff', category: 'Database', exp: 'LEARNING', projects: 1, desc: 'Relational database designs and standard SQL execution structures.' },
      
      // Orbit 3: DevOps, Cloud & AI/Data (Tilt Angle: -0.42 rad, Speed: ~52s/rev)
      { name: 'AWS', orbit: 3, angle: 0.5, speed: 0.002, color: '#00a2ff', category: 'Cloud', exp: 'LEARNING', projects: 1, desc: 'Cloud computing services exploration and resource configurations.' },
      { name: 'Vercel', orbit: 3, angle: 1.5, speed: 0.002, color: '#00a2ff', category: 'Deployment', exp: 'FAMILIAR', projects: 2, desc: 'Serverless deployment and host mapping for React portfolios.' },
      { name: 'Git & GitHub', orbit: 3, angle: 2.5, speed: 0.002, color: '#00a2ff', category: 'Development', exp: 'WORKING KNOWLEDGE', projects: 3, desc: 'Codebase version tracking, branching cycles, and remote repository configurations.' },
      { name: 'Pandas', orbit: 3, angle: 3.5, speed: 0.002, color: '#ab47bc', category: 'Data & AI', exp: 'LEARNING', projects: 1, desc: 'Data structures cleaning and analytical parsing for sleep pattern studies.' },
      { name: 'Scikit-learn', orbit: 3, angle: 4.5, speed: 0.002, color: '#ab47bc', category: 'Data & AI', exp: 'LEARNING', projects: 1, desc: 'Statistical modeling algorithms and ML predictions for academic research.' },
      { name: 'Machine Learning', orbit: 3, angle: 5.5, speed: 0.002, color: '#ab47bc', category: 'Data & AI', exp: 'LEARNING', projects: 1, desc: 'Investigating data correlations and predictive regressions using Python tools.' }
    ];
    
    this.mouse = { x: 0, y: 0 };
    this.hoveredNode = null;
    this.selectedNode = null; // Start with NULL state as requested for DEFAULT status display
    
    this.init();
    this.bindEvents();
    this.animate();
    
    // Dispatch initial select (NULL state will show select placeholder details)
    if (this.onSelect) this.onSelect(this.selectedNode);
  }
  
  init() {
    this.resize();
  }
  
  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }
  
  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    // Track mouse coordinates over canvas
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    // Select node on click
    this.canvas.addEventListener('click', () => {
      if (this.hoveredNode) {
        this.selectedNode = this.hoveredNode;
      } else {
        this.selectedNode = null; // Deselect on clicking empty canvas space
      }
      
      if (this.onSelect) this.onSelect(this.selectedNode);
      
      // Dispatch click triggers to app.js for high tech synth tones
      if (this.selectedNode) {
        const event = new CustomEvent('galaxyClick', { detail: this.selectedNode });
        window.dispatchEvent(event);
      }
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Center of visual field shifted slightly upward and leftwards centered
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 - 35; // Slightly upward to sit between heading and status instruction
    
    // Responsive scaling check
    const isMobile = this.canvas.width < 768;
    const isTablet = this.canvas.width >= 768 && this.canvas.width <= 1024;
    
    // Set precise orbit dimensions as requested
    let r1, r2, r3;
    if (isMobile) {
      r1 = 70;
      r2 = 115;
      r3 = 160;
    } else if (isTablet) {
      r1 = 100;
      r2 = 170;
      r3 = 230;
    } else {
      // Desktop: diameter 270px, 450px, 590px (radius 135px, 225px, 295px)
      r1 = 135;
      r2 = 225;
      r3 = 295;
    }
    
    // Filter active visible nodes: reduce on mobile to avoid overcrowding
    const visibleSkills = isMobile
      ? this.skills.filter(s => ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Python', 'Java', 'Git & GitHub', 'Machine Learning'].includes(s.name))
      : this.skills;
    
    // Orbit angles configuration to construct a 3D-like look
    const orbitSpecs = [
      { num: 1, rx: r1, ry: r1 * 0.5, tilt: -0.22 },      // Orbit 1: Inner
      { num: 2, rx: r2, ry: r2 * 0.5, tilt: 0.12 },       // Orbit 2: Middle
      { num: 3, rx: r3, ry: r3 * 0.5, tilt: -0.42 }       // Orbit 3: Outer
    ];
    
    // 1. Draw concentric tilted 3D orbit lines
    orbitSpecs.forEach(spec => {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(0, 210, 255, 0.08)';
      this.ctx.lineWidth = 1;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = 'rgba(0, 210, 255, 0.2)';
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy, spec.rx, spec.ry, spec.tilt, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    });
    
    // Increments HUD ring rotation
    this.hudRotation += 0.004;
    
    // 2. Draw Central Core Sun Stack (~70px - 100px visual diameter)
    const sunRadius = isMobile ? 35 : 45;
    this.ctx.save();
    
    // Layer 1: Outer rotating dashed HUD ring (90px diameter)
    this.ctx.strokeStyle = 'rgba(0, 245, 212, 0.22)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 6]);
    this.ctx.beginPath();
    this.ctx.ellipse(cx, cy, sunRadius + 5, sunRadius + 5, this.hudRotation, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    
    // Layer 2: Pulse factor
    const pulseFactor = 1 + 0.04 * Math.sin(Date.now() * 0.002);
    const coreRadius = sunRadius * pulseFactor;
    
    this.ctx.shadowBlur = 25;
    this.ctx.shadowColor = '#00f5d4';
    
    const grad = this.ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, 'rgba(0, 245, 212, 0.45)');
    grad.addColorStop(1, 'rgba(0, 245, 212, 0)');
    
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    // Layer 3: Central core text label
    this.ctx.save();
    this.ctx.fillStyle = '#00f5d4';
    this.ctx.font = 'bold 9px "Share Tech Mono"';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = '#00f5d4';
    this.ctx.fillText('TECH STACK', cx, cy);
    this.ctx.restore();
    
    // Tracking hovered state during this frame loop
    let currentHover = null;
    
    // 3. Draw Orbiting Technology Planets
    visibleSkills.forEach(node => {
      const spec = orbitSpecs.find(s => s.num === node.orbit);
      if (!spec) return;
      
      // Update orbital position (angle increment)
      // Freeze planetary motion if user mouse-hovers over it
      if (this.hoveredNode !== node) {
        node.angle += node.speed;
      }
      
      // Compute 3D elliptical Cartesian coordinates with rotation
      const cosA = Math.cos(node.angle);
      const sinA = Math.sin(node.angle);
      const cosTilt = Math.cos(spec.tilt);
      const sinTilt = Math.sin(spec.tilt);
      
      // Unrotated ellipse coords relative to center
      const ex = spec.rx * cosA;
      const ey = spec.ry * sinA;
      
      // Rotated relative coordinates
      const px = cx + (ex * cosTilt - ey * sinTilt);
      const py = cy + (ex * sinTilt + ey * cosTilt);
      
      // Click zones (clickable area: radius 20px zone)
      const dx = this.mouse.x - px;
      const dy = this.mouse.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const isHovered = dist < 20; 
      const isSelected = this.selectedNode === node;
      
      if (isHovered) {
        currentHover = node;
      }
      
      // Active connector indicator path to center core
      if (isSelected) {
        this.ctx.strokeStyle = 'rgba(0, 245, 212, 0.25)';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(px, py);
        this.ctx.stroke();
      }
      
      // Planet sizes (visual dot radius: 6.5px - 9px)
      const planetRadius = isHovered ? 9 : (isSelected ? 8 : 6.5);
      
      this.ctx.save();
      this.ctx.shadowBlur = (isHovered || isSelected) ? 14 : 4;
      this.ctx.shadowColor = node.color;
      
      this.ctx.fillStyle = node.color;
      this.ctx.beginPath();
      this.ctx.arc(px, py, planetRadius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw tiny local orbital ring indicators around the planet
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.lineWidth = 0.5;
      this.ctx.beginPath();
      this.ctx.arc(px, py, planetRadius + 3.5, 0, Math.PI * 2);
      this.ctx.stroke();
      
      this.ctx.restore();
      
      // Draw planetary labels (brighter & larger: 11px / 12px Space Grotesk)
      this.ctx.save();
      this.ctx.fillStyle = isSelected ? '#00f5d4' : (isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.7)');
      this.ctx.font = isSelected ? 'bold 12px "Space Grotesk"' : '11px "Space Grotesk"';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      if (isHovered || isSelected) {
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = isSelected ? '#00f5d4' : '#ffffff';
      }
      
      const label = `${isSelected ? '● ' : ''}${node.name}`;
      this.ctx.fillText(label, px + planetRadius + 6, py);
      this.ctx.restore();
    });
    
    // Commit hovered node state
    this.hoveredNode = currentHover;
    
    // Pointer overrides
    if (this.hoveredNode) {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Export initialization hook globally
window.initTechGalaxy = (canvasId, callback) => new TechGalaxy(canvasId, callback);
