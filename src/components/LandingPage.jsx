import React, { useState } from 'react';

const LandingPage = ({ onEnter, toggleTheme }) => {
    const [activeModal, setActiveModal] = useState(null);

    const workflowDetails = {
        'Ingestion': {
            title: 'Automated Data Ingestion',
            summary: 'Securely upload your entire cryptographic footprint using our high-speed ingestion pipeline.',
            details: [
                'Support for .js, .jsx, .ts, .c, .cpp, .py and .go source files.',
                'Direct analysis of TLS certificates (PEM/CRT) and PEM keys.',
                'Environment configuration and .env file scanning for hardcoded secrets.',
                'End-to-end encrypted upload tunnel using AES-256-GCM.'
            ],
            icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'
        },
        'Detection': {
            title: 'AI-Powered Cryptographic Detection',
            summary: 'Our proprietary scanning engine uses pattern matching and semantic analysis to find lurking threats.',
            details: [
                'Zero-false-positive regex engine with strict word boundary enforcement.',
                'Detection of legacy algorithms (RSA, MD5, SHA-1, DES, 3DES).',
                'Identification of quantum-weakened symmetric keys (AES-128).',
                'Code-line mapping for precise vulnerability location.'
            ],
            icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
        },
        'Roadmap': {
            title: 'NIST-Compliant Migration Roadmap',
            summary: 'Go from vulnerable to quantum-safe with a clinical, step-by-step transition plan.',
            details: [
                'Automatic generation of CRYSTALS-Kyber (ML-KEM) implementation code.',
                'Transition guides for Moving from RSA to ML-DSA signatures.',
                'Phased hybrid-cryptography implementation strategies.',
                'Compliance tracking against FIPS 203/204 and CNSA 2.0 standards.'
            ],
            icon: 'M9 19V5l12 7-12 7z'
        }
    };

    const handleViewPaper = () => {
        const reportHTML = `<!DOCTYPE html>
            <html>
            <head>
                <title>NIST FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism</title>
                <style>
                    * { margin:0; padding:0; box-sizing:border-box; }
                    body { background:#0a0b10; color:#e2e8f0; font-family:'Segoe UI',sans-serif; }
                    .top-nav { position:sticky; top:0; z-index:100; background:#0a0b10; border-bottom:1px solid #1e2640; padding:15px 40px; display:flex; align-items:center; justify-content:space-between; }
                    .back-btn { background:rgba(99,102,241,0.1); border:1px solid #6366f1; color:#a5b4fc; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; }
                    h1 { padding: 40px; color: white; text-align: center; }
                </style>
            </head>
            <body>
                <div class="top-nav">
                    <button class="back-btn" onclick="window.close()">← CLOSE PAPER</button>
                    <div style="font-weight:bold; color: #94a3b8;">RESEARCH PUBLICATION</div>
                </div>
                <h1>FIPS 203: Post-Quantum Cryptography</h1>
                <div style="max-width:800px; margin:40px auto; background:#111827; padding:40px; border-radius:10px; border:1px solid #1e2640; line-height:1.8;">
                    <h2 style="color:#a855f7; margin-bottom:20px;">Abstract</h2>
                    <p style="color:#cbd5e1; margin-bottom: 20px;">This publication specifies a cryptographic scheme, the Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM), which is derived from the CRYSTALS-Kyber submission to the NIST Post-Quantum Cryptography Standardization Project.</p>
                    <h3 style="color:#6366f1; margin-bottom:15px;">Threat Model: Shor's Algorithm</h3>
                    <p style="color:#cbd5e1; margin-bottom: 20px;">Quantum computers can leverage Shor's algorithm to compute discrete logarithms and factor integers in polynomial time. Once large enough quantum computers are constructed, they will threaten the security of public-key cryptosystems such as RSA and Elliptic Curve Cryptography.</p>
                    <p style="color:#cbd5e1; font-weight:bold; color:#ef4444;">Conclusion: All organizations must adopt ML-KEM for key establishment to secure against "Store Now, Decrypt Later" capabilities.</p>
                </div>
            </body>
            </html>`;
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(reportHTML);
            win.document.close();
        }
    };

    return (
        <div className="landing-page">
            {/* Modal Overlay */}
            {activeModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-fade-in">
                    <div className="glass-card" style={{ maxWidth: '600px', width: '90%', padding: '40px', border: '1px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ width: '50px', height: '50px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--primary)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={workflowDetails[activeModal].icon}></path>
                                </svg>
                            </div>
                            <h3 className="gradient-text" style={{ fontSize: '1.5rem' }}>{workflowDetails[activeModal].title}</h3>
                        </div>

                        <p style={{ color: 'white', fontWeight: '600', marginBottom: '25px', lineHeight: '1.6' }}>{workflowDetails[activeModal].summary}</p>

                        <div style={{ marginBottom: '40px' }}>
                            {workflowDetails[activeModal].details.map((point, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                                    <div style={{ color: 'var(--primary)', fontWeight: '900' }}>▶</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{point}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button className="cyber-btn cyber-btn-primary" onClick={onEnter} style={{ flex: 1, padding: '12px' }}>TRY THIS FEATURE</button>
                            <button className="cyber-btn cyber-btn-outline" onClick={() => setActiveModal(null)} style={{ flex: 1, padding: '12px' }}>CLOSE</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dynamic Navigation */}
            <nav className="navbar">
                <div className="nav-container">
                    <a href="#" className="logo">
                        QUANTUM<span>GUARD</span>
                    </a>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <a href="#threat" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>The Threat</a>
                        <a href="#how" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Workflow</a>
                        <a href="#migration" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>Migration</a>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode" style={{ width: '40px', height: '40px' }}>
                                🌙
                            </button>
                            <button onClick={onEnter} className="cyber-btn cyber-btn-primary">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                Access Terminal
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section container" style={{ paddingTop: '180px', paddingBottom: '120px', minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                    padding: '10px 24px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--accent)',
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    letterSpacing: '2px',
                    marginBottom: '30px'
                }} className="pulse">
                    NIST FIPS 203/204 COMPLIANT
                </div>

                <h1 style={{ fontSize: '4.5rem', fontWeight: '900', maxWidth: '1000px', lineHeight: '1.1', marginBottom: '30px' }}>
                    Prepare Your Systems for the <span className="gradient-text">Quantum Era</span>
                </h1>

                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', marginBottom: '50px', lineHeight: '1.6' }}>
                    Analyze cryptographic vulnerabilities and transition to Post-Quantum Security before quantum computers break today's encryption protocols.
                </p>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <button onClick={onEnter} className="cyber-btn cyber-btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>
                        Start Quantum Scan
                    </button>
                    <button onClick={handleViewPaper} className="cyber-btn cyber-btn-outline" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>
                        View Research Paper
                    </button>
                </div>

                {/* Floating Data Visualization */}
                <div style={{ marginTop: '100px', width: '100%', maxWidth: '1000px', opacity: 0.8 }} className="float">
                    <div className="glass-card" style={{ padding: '30px', borderBottom: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>NETWORK SECURITY HEARTBEAT</span>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>ENCRYPTED DECRYPTION RISK</h3>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--danger)' }}>CRITICAL</span>
                            </div>
                        </div>
                        {/* Simulated Chart Bars */}
                        <div style={{ display: 'flex', height: '120px', gap: '4px', alignItems: 'flex-end', marginTop: '20px' }}>
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    height: `${Math.random() * 100}%`,
                                    background: i > 25 ? 'var(--danger)' : 'var(--primary)',
                                    opacity: 0.6
                                }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quantum Threat Section */}
            <section id="threat" className="section-padding container">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>What is the <span className="gradient-text">Quantum Threat</span>?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.7' }}>
                            Standard encryption like RSA-2048 and ECC rely on the mathematical difficulty of factoring large numbers. <strong>Shor's Algorithm</strong>, running on a powerful quantum computer, can solve these problems in seconds.
                        </p>
                        <div className="glass-card" style={{ padding: '30px', borderLeft: '4px solid var(--danger)', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '1.1rem' }}>Store Now, Decrypt Later (SNDL)</h4>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Adversaries are capturing encrypted data today, waiting for quantum computers to decrypt it tomorrow. Your historical data is already at risk.
                            </p>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '50px', background: 'rgba(255, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--danger)', marginBottom: '35px' }}>Vulnerability Assessment</div>
                        {[
                            { label: 'RSA-2048', risk: '98%', status: 'Critical' },
                            { label: 'ECC-P256', risk: '99%', status: 'Critical' },
                            { label: 'AES-128', risk: '45%', status: 'Weakened' },
                            { label: 'SHA-256', risk: '15%', status: 'Resistant' }
                        ].map((alg, i) => (
                            <div key={i} style={{ marginBottom: '35px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '700' }}>{alg.label}</span>
                                    <span style={{ color: alg.risk === '99%' ? 'var(--danger)' : 'var(--warning)' }}>{alg.status} ({alg.risk})</span>
                                </div>
                                <div className="scan-progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div className="scan-progress-fill" style={{ height: '100%', width: alg.risk, background: alg.risk.slice(0, 2) > 80 ? 'var(--danger)' : 'var(--warning)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how" className="section-padding container text-center">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '60px' }}>How <span className="gradient-text">QuantumGuard</span> Works</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                    {[
                        {
                            step: '01',
                            title: 'Ingestion',
                            desc: 'Upload source code, certificates, or configuration files for analysis.',
                            icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'
                        },
                        {
                            step: '02',
                            title: 'Detection',
                            desc: 'Our AI engine identifies every classic cryptographic primitive in your stack.',
                            icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                        },
                        {
                            step: '03',
                            title: 'Roadmap',
                            desc: 'Get step-by-step guidance on migrating to NIST-approved PQC algorithms.',
                            icon: 'M9 19V5l12 7-12 7z'
                        }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="glass-card hover-glow"
                            onClick={() => setActiveModal(item.title)}
                            style={{ padding: '50px 30px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease' }}
                        >
                            <div style={{ position: 'absolute', top: '-10px', right: '10px', fontSize: '8rem', fontWeight: '900', opacity: 0.03 }}>{item.step}</div>
                            <div style={{
                                width: '64px', height: '64px', background: 'rgba(99, 102, 241, 0.1)',
                                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 30px', border: '1px solid var(--primary)'
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={item.icon}></path>
                                </svg>
                            </div>
                            <h3 style={{ marginBottom: '15px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                            <div style={{ marginTop: '20px', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '900' }}>LEARN MORE ▶</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Migration Roadmap Section */}
            <section id="migration" className="section-padding container">
                <div className="glass-card" style={{ padding: '60px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Enterprise PQC Migration Roadmap</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '50px' }}>Transitioning to Post-Quantum security is a phased journey. Start defending your infrastructure before Decryption-Day (Q-Day).</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {[
                                { phase: 'Discovery', action: 'Identify all cryptographic assets and data lifecycles.' },
                                { phase: 'Priority', action: 'Rank assets by data longevity and sensitivity.' },
                                { phase: 'Hybrid Implementation', action: 'Combine RSA with Kyber for dual-layer protection.' },
                                { phase: 'Transition', action: 'Full upgrade to NIST-standardized PQC libraries.' }
                            ].map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: '30px', alignItems: 'center', textAlign: 'left' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', fontWeight: '900', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                                    <div>
                                        <h4 style={{ color: 'var(--text-main)' }}>{step.phase}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{step.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="container section-padding" style={{ borderTop: '1px solid var(--glass-border)', marginTop: '50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="logo" style={{ fontSize: '1.2rem' }}>QUANTUM<span>GUARD</span></div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        © 2026 QuantumGuard Intelligence Platform. Developed for Cyber Sovereignty.
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy</a>
                        <a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Terms</a>
                        <a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>FIPS 203</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
