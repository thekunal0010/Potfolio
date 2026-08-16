# Kunal Tamuli // Space-Themed Developer Portfolio (v2.6)

An interactive, high-fidelity space-themed developer portfolio designed to showcase missions, academic trajectories, and technical telemetry. Built using vanilla HTML5, CSS3, and JavaScript, the project features smooth micro-animations, custom synthesizer audio notes, and dynamic 3D-like canvas visualizers without relying on heavy frontend libraries.

---

## 🌌 Visual & Interactive Highlights

*   **Cinematic Boot Sequence**: A simulated high-tech command terminal diagnostic screen on page load, outputting system logs and initialization parameters with accompanying tone synthesizers.
*   **Twinkling Starfield & Meteors**: A fully responsive background canvas drawing static twinkling stars and spawning periodic diagonal meteor streaks that animate across the screen.
*   **Interactive 3D Technology Galaxy**: A tilted canvas simulation of rotating planetary nodes representing core technical skills (Java, Python, React, Node.js, databases, DevOps). Hovering freezes the orbital path, and clicking syncs skill metadata dynamically into the HUD database panel.
*   **Spaceflight Trajectory Timeline**: A responsive flight path tracking chronological milestones and academic history (Presidency College, Jain University, CodeTech Internship) with a custom vector spacecraft traveling dynamically to selected coordinate points.
*   **GitHub Constellation Grid**: A simulated coding signal graph representing commit frequencies as glowing stars.
*   **Packet Encrypted Contact Terminal**: A terminal-style communication form that simulates encryption packet formatting and satellite transmission chimes on successful submission.
*   **Synthesizer Audio Effects**: An integrated synthesizer utilizing the Web Audio API to generate custom retro sci-fi sine and triangle wave tone chimes on menu hover, button clicks, and terminal tasks.

---

## 🛠️ Architecture & Tech Stack

*   **Structure**: Semantic HTML5 markup.
*   **Styling**: Pure CSS3. Implements modern typography (Space Grotesk, Inter, Share Tech Mono), glassmorphism variables, responsive flex grids, custom scrollbars, and keyframe animations.
*   **Behavior**: Vanilla JavaScript (ES6 classes). Independent canvas animations operate inside custom frame loops using `requestAnimationFrame`.
*   **Audio Engine**: Web Audio API Oscillator nodes (no static audio files).
*   **Deployment**: Static hosting ready (Vercel, GitHub Pages, or local Python HTTP server).

---

## 🚀 Local Operations (Quick Start)

### 1. Clone the Spacecraft Repository
```bash
git clone https://github.com/thekunal0010/kunal-portfolio.git
cd kunal-portfolio
```

### 2. Deploy Local Server Node
Since the portfolio reads assets and initializes modules, it is recommended to run it through an HTTP server context:

**Using Python:**
```bash
python -m http.server 8080
```

**Using Node.js:**
```bash
npx http-server -p 8080
```

Once running, navigate to **[http://localhost:8080](http://localhost:8080)** in your browser dashboard.
