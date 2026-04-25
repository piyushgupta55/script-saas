"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight, 
  Database,
  Layers,
  Activity,
  Cpu,
  ChevronRight,
  Code,
  Shield,
  Search,
  Check,
  Menu,
  X,
  Radio,
  FileText,
  BarChart,
  Command,
  ArrowUpRight,
  CpuIcon
} from 'lucide-react';

export default function LandingPage() {
  const [displayText, setDisplayText] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fullText = "DECODING_VIRAL_LOGIC...";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) i = 0;
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid-container">
      {/* --- HEADER --- */}
      <nav className="nav-container">
        <div className="mono logo">
          <div className="logo-square"></div>
          SCRIPTSAAS_SYS_V2.0
        </div>
        
        <div className="nav-links">
          <Link href="/editor" className="btn-brutal nav-cta">INITIALIZE_ENGINE</Link>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-toggle">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link href="/editor" onClick={() => setMobileMenuOpen(false)} className="btn-brutal mobile-nav-cta">INITIALIZE_ENGINE</Link>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <header className="hero-split">
        
        {/* Left: Intelligence Summary */}
        <div className="hero-content">
          <div className="hero-bg-glow"></div>
          
          <div className="mono hero-status">
            <Activity size={14} /> SYS_STABILITY: 100%
          </div>
          
          <h1 className="hero-display">
            Viral Logic <br /> 
            <span className="text-primary engineered-text">Engineered.</span>
          </h1>

          {/* Premium Mobile System Card (Hidden on Desktop) */}
          <div className="mobile-system-card">
             <div className="system-card-glow"></div>
             <div className="system-card-header">
                <div className="mono text-primary text-xxs">SYSTEM_HEALTH: NOMINAL</div>
                <div className="mono text-xxs">LATENCY: 12.4ms</div>
             </div>
             <div className="system-card-body">
                <div className="mono log-line">&gt; ATOMIZING_PDF_CONTEXT...</div>
                <div className="mono log-line">&gt; MAPPING_HOOK_SIGNALS...</div>
                <div className="mono log-line">&gt; HUMANIZING_V4...</div>
             </div>
             <div className="card-accent"></div>
          </div>
          
          <p className="hero-description">
            The professional RAG engine for creators who demand precision. We atomize expertise into high-retention script architectures.
          </p>
          
          <div className="hero-actions">
            <Link href="/editor" className="btn-brutal hero-btn-primary glow-btn">
              INITIALIZE_DEPLOYMENT <ArrowRight size={20} />
            </Link>
            <Link href="/editor" className="btn-secondary hero-btn-secondary">
              CORE_SPECS
            </Link>
          </div>
        </div>

        {/* Right: Modular Workstation (Desktop Only) */}
        <div className="workstation">
           <div className="code-block">
              <div className="code-accent-top"></div>
              
              <div className="code-header">
                 <div className="mono text-primary text-xs">00 // LIVE_RETRIEVAL</div>
                 <div className="mono text-muted text-xs">{displayText}</div>
              </div>

              <div className="code-body">
                 <div className="code-stats">
                    <div className="stat-box">
                       <p className="mono stat-label">RETENTION_P</p>
                       <p className="stat-value text-primary">94%</p>
                    </div>
                    <div className="stat-box">
                       <p className="mono stat-label">LATENCY_MS</p>
                       <p className="stat-value">12.4</p>
                    </div>
                 </div>

                 <div className="code-log">
                    <span className="text-primary">&gt;</span> ATOMIZING_PDF_CONTEXT... <br />
                    <span className="text-primary">&gt;</span> MAPPING_HOOK_SIGNALS... <br />
                    <span className="text-primary">&gt;</span> HUMANIZING_OUTPUT_V4...
                 </div>

                 <div className="code-preview">
                    <p className="preview-text">
                       "Aaj kal har creator yahi galti kar raha hai... [READ_MORE]"
                    </p>
                 </div>
              </div>
              
              {/* Technical Accents */}
              <div className="accent-tl"></div>
              <div className="accent-br"></div>
           </div>
        </div>
      </header>

      {/* --- LIVE DEMO SECTION --- */}
      <section id="demo" className="technical-section demo-section">
        <div className="section-header" style={{ textAlign: 'center', marginInline: 'auto' }}>
          <div className="mono text-primary text-sm mb-12">02 // TEST_FLIGHT</div>
          <h2 className="section-title">Live Logic Preview.</h2>
        </div>
        
        <div className="demo-container">
          <div className="demo-input-box">
            <input type="text" placeholder="Enter your idea (e.g. How to grow on Reels)..." className="demo-input" />
            <button className="btn-brutal demo-btn">
              GENERATE_LOGIC <i className="ri-flashlight-line"></i>
            </button>
          </div>
          
          <div className="demo-output">
            <div className="output-column">
              <div className="mono text-xs text-primary mb-12">// VIRAL_HOOKS</div>
              <ul className="hook-list">
                <li>“Aaj kal har creator yahi galti kar raha hai...”</li>
                <li>“Stop wasting time on low-retention edits.”</li>
                <li>“The secret logic behind 10M view reels.”</li>
              </ul>
            </div>
            <div className="output-column">
              <div className="mono text-xs text-primary mb-12">// SCRIPT_PREVIEW</div>
              <div className="script-box">
                <p><span className="text-primary">Hook:</span> [Choose Hook 1]</p>
                <p><span className="text-primary">Value:</span> Explain the retention paradox...</p>
                <p><span className="text-primary">CTA:</span> Follow for more viral logic.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BEFORE vs AFTER SECTION --- */}
      <section className="technical-section comparison-section">
        <div className="section-header">
          <div className="mono text-primary text-sm mb-12">03 // BENCHMARKS</div>
          <h2 className="section-title">Evolution of Logic.</h2>
        </div>
        
        <div className="comparison-grid">
          <div className="comparison-card raw">
            <div className="mono card-label">RAW_INPUT</div>
            <div className="card-content">
              "Mujhe ek reel banani hai growth pe jisme main bataunga ki consistency imp hai but quality bhi."
            </div>
          </div>
          <div className="comparison-card optimized">
            <div className="mono card-label text-primary">OPTIMIZED_SCRIPT</div>
            <div className="card-content">
              <p><strong>Hook:</strong> "99% creators are failing because of this one 'Growth Trap'..."</p>
              <p style={{ marginTop: '12px' }}><strong>Body:</strong> "Consistency is a lie. Agar content garbage hai, toh daily post karne se growth nahi, reach dead hogi. Logic simple hai..."</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TELEMETRY --- */}
      <section id="telemetry" className="telemetry-grid">
         {[
           { label: 'SCRIPTS_DEPLOYED', value: '2.4M', icon: <FileText size={14} /> },
           { label: 'RETENTION_BOOST', value: '+42%', icon: <BarChart size={14} /> },
           { label: 'KNOWLEDGE_NODES', value: '182K', icon: <Database size={14} /> },
           { label: 'SYSTEM_UPTIME', value: '99.9%', icon: <Radio size={14} /> }
         ].map((stat, i) => (
           <div key={i} className="telemetry-item">
              <div className="mono telemetry-label">
                {stat.icon} {stat.label}
              </div>
              <div className="telemetry-value">{stat.value}</div>
           </div>
         ))}
      </section>

      {/* --- WHO IT'S FOR SECTION --- */}
      <section className="technical-section users-section">
        <div className="section-header">
          <div className="mono text-primary text-sm mb-12">05 // TARGET_OPERATORS</div>
          <h2 className="section-title">Built for the Elite.</h2>
        </div>
        
        <div className="user-grid">
          {[
            { title: 'Reels Creators', desc: 'Short-form hooks designed for the 3-second attention span.', icon: 'ri-video-line' },
            { title: 'YouTubers', desc: 'Storyboarding logic that keeps viewers through the mid-roll.', icon: 'ri-youtube-line' },
            { title: 'Personal Brands', desc: 'Convert authority into community with high-value scripts.', icon: 'ri-user-star-line' },
            { title: 'Content Agencies', desc: 'Scale production without losing the human creative edge.', icon: 'ri-building-4-line' }
          ].map((item, i) => (
            <div key={i} className="user-card">
              <div className="user-icon"><i className={item.icon}></i></div>
              <h3 className="mono">{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="technical-section features-section">
        <div className="section-header">
          <div className="mono text-primary text-sm mb-12">06 // SYSTEM_CAPABILITIES</div>
          <h2 className="section-title">Core Modules.</h2>
        </div>
        
        <div className="features-grid">
          {[
            { title: 'Viral Hook Generator', desc: '100+ high-retention patterns.', icon: 'ri-fire-line' },
            { title: 'Hinglish Mode', desc: 'Natural flow for the Indian audience.', icon: 'ri-chat-voice-line' },
            { title: 'Multi-platform Scripts', desc: 'Reels, YouTube, X, and more.', icon: 'ri-stack-line' },
            { title: 'Human-like Output', desc: 'No AI-sounding robotic filler.', icon: 'ri-user-follow-line' }
          ].map((feat, i) => (
            <div key={i} className="feature-card">
              <i className={feat.icon}></i>
              <h4 className="mono">{feat.title}</h4>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- PIPELINE --- */}
      <section id="pipeline" className="technical-section">
         <div className="section-header">
            <div className="mono text-primary text-sm mb-12">01 // ARCHITECTURE</div>
            <h2 className="section-title">The Knowledge Pipeline.</h2>
         </div>

         <div className="pipeline-track">
            {[
              { title: 'Atomic Extraction', desc: 'Neural decomposition of unstructured data into high-performance beats.' },
              { title: 'Vector Mapping', desc: 'Mapping knowledge into 3D semantic space (Intent, Emotion, Logic).' },
              { title: 'RAG Retrieval', desc: 'Real-time contextual injection from your braintrust.' },
              { title: 'Viral Optimization', desc: 'Final post-process pass using Gen-Z humanization protocols.' }
            ].map((step, i) => (
              <div key={i} className="pipeline-step">
                 <h3 className="mono step-title">{i + 1}. {step.title}</h3>
                 <p className="step-desc">{step.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* --- FREE + API KEY SECTION --- */}
      <section className="technical-section api-section">
        <div className="api-card">
          <div className="mono text-primary text-sm mb-12">08 // ACCESS_CONTROL</div>
          <h2 className="section-title">Unlimited Intelligence.</h2>
          <p className="api-desc">
            Get started for free with limited daily credits. Ready to scale? Add your own OpenAI API key to bypass all restrictions.
          </p>
          
          <div className="api-input-mock">
            <div className="mono text-xs text-muted mb-12">OPENAI_API_KEY</div>
            <div className="mock-input">
              <span>sk-proj-••••••••••••••••••••••••</span>
              <i className="ri-lock-line"></i>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="cta-section">
         <div className="mono cta-status">SYSTEM_READY_FOR_INITIALIZATION</div>
         <h2 className="cta-title">ENGINEER YOUR <br /> VIRAL LEGACY.</h2>
         <Link href="/editor" className="btn-brutal cta-btn">
            DEPLOY_SYSTEM_V2 <ArrowRight size={24} />
         </Link>
      </section>

      <footer className="footer">
         <div className="mono footer-text">
           SCRIPTSAAS_ENGINE // VERSION_2.0.4 // [ END_OF_FILE ]
         </div>
      </footer>

      <style jsx>{`
        .nav-container {
          padding: 24px 40px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: var(--bg-base);
          z-index: 100;
        }
        .logo {
          font-weight: 800;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-square {
          width: 12px;
          height: 12px;
          background: var(--primary);
        }
        .nav-links {
          display: flex;
          gap: 40px;
          align-items: center;
        }
        .nav-link {
          text-decoration: none;
          color: var(--text-dim);
          font-size: 11px;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .nav-cta {
          padding: 8px 24px;
          font-size: 11px;
          border: 1px solid var(--primary);
        }
        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
        }
        
        .mobile-menu {
          position: fixed;
          top: 73px;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-base);
          z-index: 99;
          display: flex;
          flex-direction: column;
          padding: 40px 24px;
          border-top: 1px solid var(--border);
        }
        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .mobile-nav-cta {
          margin-top: 20px;
          padding: 20px;
          justify-content: center;
          font-size: 14px;
        }

        .hero-split {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border-bottom: 1px solid var(--border);
        }
        .hero-content {
          padding: 100px 60px;
          border-right: 1px solid var(--border);
        }
        .hero-status {
          color: var(--primary);
          margin-bottom: 24px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-display {
          font-size: clamp(3rem, 6vw, 4.5rem);
          text-transform: uppercase;
          line-height: 0.95;
          margin-bottom: 32px;
        }
        .text-primary {
          color: var(--primary);
        }
        .hero-description {
          color: var(--text-dim);
          font-size: 1.1rem;
          max-width: 480px;
          margin-bottom: 56px;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
        }
        .hero-btn-primary {
          padding: 18px 40px;
        }
        .hero-btn-secondary {
          padding: 18px 40px;
          border: 1px solid var(--border);
        }

        .workstation {
          padding: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080808;
        }
        .code-block {
          width: 100%;
          max-width: 520px;
          border: 1px solid var(--border);
          background: #000;
          padding: 32px;
          position: relative;
        }
        .code-accent-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--primary);
          opacity: 0.2;
        }
        .code-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
        }
        .text-xs { font-size: 11px; }
        .text-muted { color: #444; }
        .code-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .code-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .stat-box {
          border: 1px solid var(--border);
          padding: 12px;
          background: rgba(255,255,255,0.02);
        }
        .stat-label {
          font-size: 9px;
          color: var(--text-dim);
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 18px;
          font-weight: 800;
        }
        .code-log {
          color: #666;
          font-size: 12px;
          font-family: monospace;
          line-height: 1.6;
        }
        .code-preview {
          border: 1px dashed var(--border);
          padding: 20px;
          background: rgba(197, 255, 0, 0.03);
        }
        .preview-text {
          font-size: 14px;
          color: #fff;
          font-family: monospace;
          line-height: 1.5;
        }
        .accent-tl {
          position: absolute;
          top: -1px;
          left: -1px;
          width: 20px;
          height: 20px;
          border-top: 2px solid var(--primary);
          border-left: 2px solid var(--primary);
        }
        .accent-br {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 20px;
          height: 20px;
          border-bottom: 2px solid var(--primary);
          border-right: 2px solid var(--primary);
        }

        .telemetry-label {
          color: var(--text-dim);
          font-size: 10px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .telemetry-value {
          font-size: 3rem;
          font-weight: 900;
          color: var(--primary);
          letter-spacing: -0.05em;
        }

        .section-title {
          font-size: 3.5rem;
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1;
        }
        .mb-12 { margin-bottom: 12px; }
        .text-sm { font-size: 12px; }
        .step-title {
          font-size: 1.25rem;
          margin-bottom: 12px;
        }
        .step-desc {
          color: var(--text-dim);
          max-width: 480px;
          line-height: 1.6;
        }

        .cta-section {
          padding: 100px 40px;
          text-align: center;
          background: var(--primary);
          color: black;
          border-bottom: 1px solid var(--border);
        }
        .cta-status {
          margin-bottom: 16px;
          font-weight: 800;
        }
        .cta-title {
          font-size: clamp(2.5rem, 8vw, 4rem);
          font-weight: 900;
          margin-bottom: 48px;
          line-height: 1;
        }
        .cta-btn {
          background: black;
          color: white;
          padding: 24px 80px;
          font-size: 16px;
        }

        .footer {
          padding: 60px 40px;
          border-top: 1px solid var(--border);
          text-align: center;
        }
        .footer-text {
          color: #333;
          font-size: 11px;
        }

        /* --- NEW SECTIONS STYLES --- */
        .demo-container {
          max-width: 1000px;
          margin: 0 auto;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          padding: 40px;
          position: relative;
        }
        .demo-input-box {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
        }
        .demo-input {
          flex: 1;
          background: #000;
          border: 1px solid var(--border);
          color: white;
          padding: 16px 24px;
          font-family: inherit;
          outline: none;
        }
        .demo-input:focus { border-color: var(--primary); }
        .demo-output {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          border-top: 1px solid var(--border);
          padding-top: 40px;
        }
        .hook-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
        .hook-list li { 
          font-size: 14px; 
          color: var(--text-main); 
          padding-left: 20px; 
          position: relative; 
        }
        .hook-list li::before { 
          content: ">"; 
          position: absolute; 
          left: 0; 
          color: var(--primary); 
        }
        .script-box { 
          background: #000; 
          border: 1px dashed var(--border); 
          padding: 24px; 
          font-size: 14px; 
          line-height: 1.6; 
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .comparison-card { background: var(--bg-base); padding: 40px; }
        .card-label { font-size: 10px; margin-bottom: 24px; color: var(--text-dim); }
        .card-content { font-size: 1.1rem; line-height: 1.6; }

        .user-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .user-card {
          padding: 40px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          transition: all 0.3s;
        }
        .user-card:hover { border-color: var(--primary); transform: translateY(-4px); }
        .user-icon { font-size: 24px; color: var(--primary); margin-bottom: 20px; }
        .user-card h3 { margin-bottom: 12px; }
        .user-card p { color: var(--text-dim); font-size: 14px; line-height: 1.5; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1px;
          background: var(--border);
        }
        .feature-card {
          background: var(--bg-base);
          padding: 40px;
          text-align: left;
        }
        .feature-card i { font-size: 24px; color: var(--primary); display: block; margin-bottom: 20px; }
        .feature-card h4 { margin-bottom: 8px; }
        .feature-card p { color: var(--text-dim); font-size: 13px; }

        .api-card {
          background: rgba(197, 255, 0, 0.03);
          border: 1px solid var(--primary);
          padding: 60px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .api-desc { color: var(--text-dim); margin-bottom: 40px; line-height: 1.6; }
        .api-input-mock {
          max-width: 400px;
          margin: 0 auto;
          text-align: left;
        }
        .mock-input {
          background: #000;
          border: 1px solid var(--border);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #444;
          font-size: 13px;
        }

        @media (max-width: 1024px) {
          .nav-container { padding: 20px 24px; }
          .hero-split { grid-template-columns: 1fr; }
          .hero-content { 
            border-right: none; 
            border-bottom: 1px solid var(--border); 
            padding: 80px 24px; 
            text-align: center; 
          }
          .hero-description { margin-inline: auto; }
          .hero-actions { justify-content: center; flex-wrap: wrap; }
          .workstation { padding: 40px 24px; }
          .section-title { font-size: 2.5rem; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .mobile-toggle { display: block; }
          
          /* Hero Mobile Redesign */
          .hero-split { border-bottom: none; }
          .hero-content {
            padding: 80px 24px 60px;
            text-align: left;
            align-items: flex-start;
            position: relative;
            overflow: hidden;
          }
          .hero-bg-glow {
            position: absolute;
            top: -100px;
            left: -100px;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(197, 255, 0, 0.1) 0%, transparent 70%);
            z-index: -1;
          }
          .hero-display { 
            font-size: 2.5rem; 
            margin-bottom: 32px;
            padding: 0;
            line-height: 1.1;
          }
          .engineered-text {
            display: block;
            font-size: 3.2rem;
            letter-spacing: -0.02em;
            margin-top: 8px;
          }
          
          .mobile-system-card {
            display: block;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid var(--border);
            padding: 16px;
            width: 85%;
            margin-bottom: 40px;
            position: relative;
            box-shadow: 10px 10px 0px rgba(197, 255, 0, 0.05);
            z-index: 10;
          }
          .system-card-glow {
            position: absolute;
            bottom: -20px;
            right: -20px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(197, 255, 0, 0.05) 0%, transparent 70%);
            z-index: -1;
          }
          .system-card-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 8px;
          }
          .text-xxs { font-size: 8px; color: #666; }
          .system-card-body { display: flex; flex-direction: column; gap: 4px; }
          .log-line { font-size: 9px; color: #444; }
          .card-accent {
            position: absolute;
            top: -1px;
            right: 20px;
            width: 30px;
            height: 2px;
            background: var(--primary);
          }

          .hero-description {
            font-size: 0.95rem;
            margin-bottom: 48px;
            padding: 0;
            max-width: 100%;
            color: #888;
          }
          .hero-actions { 
            flex-direction: column;
            width: 100%;
            padding: 0;
            gap: 16px;
          }
          .hero-btn-primary, .hero-btn-secondary { 
            width: 100%; 
            justify-content: center; 
            min-height: 56px;
            padding: 16px 24px;
            font-size: 13px;
          }
          .glow-btn {
            box-shadow: 0 10px 30px rgba(197, 255, 0, 0.15);
            border: 1px solid var(--primary);
          }
          
          .workstation { display: none; } /* Hide desktop panel on mobile */
          
          .telemetry-value { font-size: 2.5rem; }
          .cta-btn { width: 100%; padding: 20px; }

          /* New sections mobile overrides */
          .demo-container { padding: 24px; }
          .demo-input-box { flex-direction: column; }
          .demo-output { grid-template-columns: 1fr; gap: 24px; }
          .comparison-grid { grid-template-columns: 1fr; }
          .api-card { padding: 40px 20px; }
        }

        @media (max-width: 480px) {
          .hero-display { font-size: 2rem; }
          .section-title { font-size: 2rem; }
          .telemetry-item { padding: 30px 20px; }
          .code-block { padding: 20px; }
          .code-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
