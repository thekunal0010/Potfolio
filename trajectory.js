/**
 * Journey Spaceflight Trajectory System
 * Renders an interactive, responsive SVG timeline trajectory line with a spacecraft element
 * traveling dynamically to the active milestone path node.
 */
class JourneyTrajectory {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.milestones = [
      { id: 'm1', label: 'PLANET 01: MCA IGNITION', title: 'MCA Journey Begins', year: '2025', desc: 'Started Master of Computer Applications (MCA) at Jain University.' },
      { id: 'm2', label: 'PLANET 02: PROJECT EXPLORATION', title: 'Development Trails', year: '2025-2026', desc: 'Built academic and personal projects across web, frontend, backend, databases, Java, mobile, and machine learning. Completed a 6-week Frontend Developer internship at CodeTech.' },
      { id: 'm3', label: 'PLANET 03: RESEARCH', title: 'Explainable AI Study', year: '2026', desc: 'Worked on research project "Decoding Academic Success" using Random Forest, SMOTE, SHAP, feature ablation, and a recommendation engine.' },
      { id: 'm4', label: 'PLANET 04: CURRENT FOCUS', title: 'MCA Trajectory', year: '2025-2027', desc: 'Continuing MCA studies at Jain University while strengthening software development skills and building practical projects.' },
      { id: 'm5', label: 'PLANET 05: GRADUATION', title: 'Next Destination', year: '2027', desc: 'Expected MCA graduation.' }
    ];
    
    this.activeMilestoneIndex = 3; // Current year MCA orbit
    
    this.render();
    this.setupInteractivity();
  }
  
  render() {
    this.container.innerHTML = '';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'journey-trajectory-container';
    
    // Create persistent flight path
    const flightPath = document.createElement('div');
    flightPath.className = 'journey-flight-path';
    
    this.milestones.forEach((m, idx) => {
      const node = document.createElement('div');
      node.className = `trajectory-node ${idx <= this.activeMilestoneIndex ? 'active' : ''}`;
      node.setAttribute('data-index', idx);
      
      const dot = document.createElement('div');
      dot.className = 'trajectory-dot';
      
      const header = document.createElement('div');
      header.className = 'trajectory-header';
      
      const label = document.createElement('span');
      label.className = 'trajectory-title';
      label.textContent = m.label;
      
      const meta = document.createElement('span');
      meta.className = 'trajectory-meta';
      meta.textContent = `${m.title} [${m.year}]`;
      
      const desc = document.createElement('div');
      desc.className = 'trajectory-desc';
      desc.textContent = m.desc;
      
      header.appendChild(label);
      header.appendChild(meta);
      node.appendChild(dot);
      node.appendChild(header);
      node.appendChild(desc);
      
      flightPath.appendChild(node);
    });
    
    // Create HUD Craft indicator
    const craftIndicator = document.createElement('div');
    craftIndicator.className = 'hud-craft-pointer';
    craftIndicator.style.position = 'absolute';
    craftIndicator.style.left = '-12px';
    craftIndicator.style.width = '24px';
    craftIndicator.style.height = '24px';
    craftIndicator.style.pointerEvents = 'none';
    craftIndicator.style.zIndex = '6';
    craftIndicator.style.transition = 'top 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    craftIndicator.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:100%; height:100%; fill:#00f5d4; filter:drop-shadow(var(--glow-highlight)); transform:rotate(90deg);">
        <path d="M12 2L2 22l10-6 10 6L12 2z"/>
      </svg>
    `;
    
    wrapper.appendChild(flightPath);
    flightPath.appendChild(craftIndicator);
    this.container.appendChild(wrapper);
    
    this.flightPathElement = flightPath;
    this.craftIndicator = craftIndicator;
    
    // Position spacecraft at active node
    setTimeout(() => this.updateCraftPosition(), 200);
  }
  
  updateCraftPosition() {
    if (!this.flightPathElement || !this.craftIndicator) return;
    
    const activeNode = this.flightPathElement.querySelectorAll('.trajectory-node')[this.activeMilestoneIndex];
    if (activeNode) {
      // Calculate top position relative to flight path container
      const nodeTop = activeNode.offsetTop;
      const dotTop = nodeTop - 3; // Center alignment with 10px dot and 24px pointer
      this.craftIndicator.style.top = `${dotTop}px`;
    }
  }
  
  setupInteractivity() {
    const nodes = this.flightPathElement.querySelectorAll('.trajectory-node');
    nodes.forEach((node) => {
      node.addEventListener('click', () => {
        const idx = parseInt(node.getAttribute('data-index'), 10);
        this.activeMilestoneIndex = idx;
        
        // Highlight active trail
        nodes.forEach((n, index) => {
          if (index <= idx) {
            n.classList.add('active');
          } else {
            n.classList.remove('active');
          }
        });
        
        this.updateCraftPosition();
        
        // Trigger transmission clicks
        window.dispatchEvent(new CustomEvent('milestoneClick', { detail: this.milestones[idx] }));
      });
      
      // Hover changes sound cues
      node.addEventListener('mouseenter', () => {
        window.dispatchEvent(new CustomEvent('milestoneHover'));
      });
    });
    
    // Watch for window resize to recalibrate coordinate metrics
    window.addEventListener('resize', () => this.updateCraftPosition());
  }
}

// Export initialization hook globally
window.initJourneyTrajectory = (containerId) => new JourneyTrajectory(containerId);
