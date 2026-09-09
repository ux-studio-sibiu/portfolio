import "./band-tools.scss";

// Tools. Cards carry no logo yet — the copy stands on its own, and a mark can
// drop in above the title later (the card reserves the height for one).
export function BandTools() {
  return (
    <section className="band nsc-band-tools">
      {/* <div className="band-label">
        <h2 className="band-title">Tools</h2>
        <span className="band-count">08</span>
      </div> */}

      <div className="band-content">
        <ul className="tool-grid">
          <li className="tool-card">
            <h3 className="tool-name">HTML CSS JS</h3>
            <p className="tool-note">Proficient at core web technologies: ts, jsx, utility css, tailwind, design systems</p>
          </li>
          <li className="tool-card">
            <h3 className="tool-name">React, Next.js</h3>
            <p className="tool-note">Working knowledge and hands-on experience in small-scale projects. Next.js, Zustand</p>
          </li>
          <li className="tool-card">
            <h3 className="tool-name">dev Tools</h3>
            <p className="tool-note">Core Web Vitals optimization, performance profiling, debugging</p>
          </li>
          <li className="tool-card">
            <h3 className="tool-name">VS code</h3>
            <p className="tool-note">debugging, task runners, extensions ecosystem, copilot</p>
          </li>
          <li className="tool-card">
            <h3 className="tool-name">Photoshop</h3>
            <p className="tool-note">or similar, for asset preparation, optimization, visual design</p>
          </li>
          <li className="tool-card">
            <h3 className="tool-name">AI tools</h3>
            <p className="tool-note">responsible use of AI tools, balance strengths/limitations: claude, github copilot, chatGPT</p>
          </li>
          <li className="tool-card">
            <h3 className="tool-name">Figma</h3>
            <p className="tool-note">design systems, prototyping, design collaboration</p>
          </li>
          <li className="tool-card">
            <h3 className="tool-name">github</h3>
            <p className="tool-note">github, vercel, sanity, headless cms</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
