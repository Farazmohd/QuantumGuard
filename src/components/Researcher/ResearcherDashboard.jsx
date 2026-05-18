import React, { useState } from 'react';

const ResearcherDashboard = ({ user, onLogout, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState('explore');
    const [modalContent, setModalContent] = useState(null);

    const articles = [
        {
            title: "Modern Cryptographic Systems Failure",
            category: "Research",
            date: "Jan 2026",
            desc: "A deep dive into why RSA-2048 is no longer sufficient against Shor's Algorithm.",
            content: "Shor's algorithm can factor integers in polynomial time. For a 2048-bit RSA key, a quantum computer with approximately 20 million noisy qubits could potentially break it in less than 24 hours. Current research focuses on the transition to lattice-based alternatives which do not share this algebraic vulnerability."
        },
        {
            title: "Understanding CRYSTALS-Kyber",
            category: "Tutorial",
            date: "Feb 2026",
            desc: "Step-by-step guide to the NIST-standardized Key Encapsulation Mechanism.",
            content: "CRYSTALS-Kyber relies on the hardness of the Learning With Errors (LWE) problem over module lattices. It provides a secure way for two parties to establish a shared secret. Its main advantage is its relatively small key sizes and high performance compared to other post-quantum candidates."
        },
        {
            title: "SNDL: The Hidden Risk",
            category: "Analysis",
            date: "Mar 2026",
            desc: "Why 'Store Now, Decrypt Later' is a critical threat to long-lived corporate data.",
            content: "SNDL (Store Now, Decrypt Later) refers to the practice by adversaries of capturing encrypted traffic today and storing it until quantum computers are powerful enough to decrypt it. This means that data with a long shelf-life (state secrets, medical records, long-term financial data) is already at risk unless protected by PQC today."
        }
    ];

    const samples = [
        { l: 'Cloud Configuration (RSA)', d: 'Vulnerable AWS/GCP TLS setups', code: "TLS_Config: { auth: 'RSA-2048', cipher: 'AES-128-GCM' } // Vulnerable to Q-Supremacy" },
        { l: 'Java Web Token (MD5)', d: 'Insecure JWT signing configurations', code: "JWT_Header: { alg: 'MD5', type: 'JWT' } // Collision & Quantum Weakness" },
        { l: 'C++ Network Socket (ECC)', d: 'Legacy socket programming examples', code: "socket.use_crypto(ECC_P256); // Elliptic Curve Vulnerability detected" },
        { l: 'Database Connection (Legacy Hash)', d: 'Insecure password storage patterns', code: "DB_Config: { hash: 'SHA-1', iterations: 1000 } // Weak Quantum Resistance" }
    ];

    const handleReadArticle = (article) => {
        setModalContent({
            title: article.title,
            type: 'article',
            category: article.category,
            date: article.date,
            content: article.content
        });
    };

    const handleRunDemo = (sample) => {
        setModalContent({
            title: `Executing Demo: ${sample.l}`,
            type: 'demo',
            description: sample.d,
            code: sample.code,
            progress: 0
        });

        let p = 0;
        const interval = setInterval(() => {
            p += 25;
            setModalContent(prev => ({ ...prev, progress: p }));
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setModalContent(prev => ({
                        ...prev,
                        status: "ANALYSIS COMPLETE",
                        complete: true,
                        result: "Sample contains legacy markers susceptible to Quantum Cryptanalysis. Recommendation: Migrate to NIST FIPS 203 standards."
                    }));
                }, 500);
            }
        }, 400);
    };

    return (
        <div className="dashboard-container">
            {/* Modal Overlay */}
            {modalContent && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-fade-in">
                    <div className="glass-card" style={{ maxWidth: '600px', width: '90%', padding: '40px', border: '1px solid var(--primary)' }}>
                        <h3 className="gradient-text" style={{ marginBottom: '20px', textAlign: 'center' }}>{modalContent.title}</h3>

                        {modalContent.type === 'article' ? (
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '900', marginBottom: '20px' }}>{modalContent.category.toUpperCase()} // PUBLISHED {modalContent.date}</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.8', marginBottom: '30px' }}>{modalContent.content}</p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>{modalContent.description}</div>

                                <div style={{ background: '#05070a', padding: '15px', borderRadius: '8px', border: '1px solid #1a1b1e', textAlign: 'left', marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--primary)' }}>
                                    {modalContent.code}
                                </div>

                                {!modalContent.complete ? (
                                    <div style={{ marginBottom: '30px' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '10px' }}>Simulating Cryptographic Audit... {modalContent.progress}%</div>
                                        <div className="scan-progress-bar" style={{ height: '8px' }}>
                                            <div className="scan-progress-fill" style={{ width: `${modalContent.progress}%`, background: 'var(--primary)' }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', marginBottom: '30px', textAlign: 'left' }}>
                                        <div style={{ color: 'var(--danger)', fontWeight: '900', fontSize: '0.8rem', marginBottom: '10px' }}>{modalContent.status}</div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>{modalContent.result}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <button className="cyber-btn cyber-btn-primary" onClick={() => setModalContent(null)} style={{ width: '100%', padding: '12px' }}>
                            {modalContent.complete || modalContent.type === 'article' ? 'CLOSE TERMINAL' : 'TERMINATE PROCESS'}
                        </button>
                    </div>
                </div>
            )}

            <aside className="sidebar">
                <div className="logo" style={{ marginBottom: '60px', paddingLeft: '10px' }}>QUANTUM<span>GUARD</span></div>
                <div style={{ flex: 1 }}>
                    <button onClick={() => setActiveTab('explore')} style={{ width: '100%', padding: '15px 20px', background: activeTab === 'explore' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', border: 'none', textAlign: 'left', color: activeTab === 'explore' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        LEARN PQC
                    </button>
                    <button onClick={() => setActiveTab('samples')} style={{ width: '100%', padding: '15px 20px', background: activeTab === 'samples' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', border: 'none', textAlign: 'left', color: activeTab === 'samples' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
                        SAMPLE SCANS
                    </button>
                    <button onClick={() => setActiveTab('reports')} style={{ width: '100%', padding: '15px 20px', background: activeTab === 'reports' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', border: 'none', textAlign: 'left', color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        EXAMPLE REPORTS
                    </button>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white' }}> {user?.name?.[0]} </div>
                        <div>
                            <div style={{ fontWeight: '800', fontSize: '0.8rem', color: 'white' }}>{user?.name}</div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>RESEARCHER ID: 882-X</div>
                        </div>
                    </div>
                    <button onClick={onLogout} className="cyber-btn cyber-btn-outline" style={{ width: '100%', padding: '10px' }}>Logout Session</button>
                </div>
            </aside>

            <main className="main-content" style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.8rem' }}><span className="gradient-text">RESEARCHER</span> PORTAL // {activeTab.toUpperCase()}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="glass-card" style={{ padding: '8px 15px', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '800' }}>ACCESS LEVEL: ACADEMIC</div>
                        <button className="theme-toggle-btn" onClick={toggleTheme} style={{ width: '35px', height: '35px', fontSize: '0.9rem' }} title="Toggle Theme">
                            🌙
                        </button>
                    </div>
                </header>

                {activeTab === 'explore' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '40px' }}>
                            {articles.map((a, i) => (
                                <div key={i} className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>{a.category} // {a.date}</div>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '15px' }}>{a.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{a.desc}</p>
                                    </div>
                                    <button onClick={() => handleReadArticle(a)} className="cyber-btn cyber-btn-outline" style={{ marginTop: '25px', padding: '10px 15px', fontSize: '0.7rem' }}>READ ARTICLE</button>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card" style={{ padding: '40px' }}>
                            <h3 style={{ marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>Quantum Supremacy Timeline (Estimated)</h3>
                            <div style={{ position: 'relative', paddingLeft: '50px', marginTop: '30px' }}>
                                {[
                                    { y: '2024', e: 'NIST Finalizes PQC Algorithms (Kyber, Dilithium)' },
                                    { y: '2025', e: 'Logical Qubit Error Correction Reaches 99.9%' },
                                    { y: '2027', e: '256-bit ECC Keys Compromised via 1M Qubit Systems' },
                                    { y: '2030', e: 'RSA-2048 Fully Broken (Shor-Supremacy Day)' }
                                ].map((t, i) => (
                                    <div key={i} style={{ marginBottom: '40px', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '-50px', width: '2px', height: '100%', background: 'linear-gradient(to bottom, var(--primary), transparent)', top: '10px' }}></div>
                                        <div style={{ position: 'absolute', left: '-54px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', top: '10px', boxShadow: `0 0 15px var(--primary)` }}></div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'white', marginBottom: '5px', letterSpacing: '1px' }}>{t.y}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.e}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'samples' && (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '40px', color: 'white' }}>Try Sample Vulnerable Payloads</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
                            {samples.map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: '35px', textAlign: 'left', border: '1px solid var(--glass-border)' }}>
                                    <h4 style={{ marginBottom: '10px', color: 'white' }}>{s.l}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '25px' }}>{s.d}</p>
                                    <button onClick={() => handleRunDemo(s)} className="cyber-btn cyber-btn-primary" style={{ padding: '10px 20px', fontSize: '0.8rem', width: '100%' }}>RUN DEMO SAMPLE</button>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '50px', color: 'var(--text-dim)', fontSize: '0.85rem', maxWidth: '600px', margin: '50px auto 0' }}>
                            Note: These simulations use verified legacy cryptographic signatures to demonstrate current quantum-weaknesses in modern cloud and database infrastructures.
                        </p>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>Example Vulnerability Reports</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px' }}>Explore these sample PDF reports to understand how QuantumGuard categorizes and ranks cryptographic liabilities in production codebases.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {[
                                    { 
                                        name: 'Ecommerce_Platform_Source.js', 
                                        threats: 12, 
                                        critical: 4, 
                                        date: '2026-02-15',
                                        findings: "This file contains cryptographic markers susceptible to Quantum Cryptanalysis. The RSA-2048 implementations found are completely insufficient against Shor's algorithm on a topological quantum computer.",
                                        severity: 'CRITICAL',
                                        color: '#ef4444'
                                    },
                                    { 
                                        name: 'Healthcare_Gateway.ts', 
                                        threats: 3, 
                                        critical: 1, 
                                        date: '2026-03-01',
                                        findings: "Legacy TLS configurations (TLS 1.1) and MD5 hashing detected in gateway headers. These primitives are trivially broken by quantum-accelerated Grover's algorithm and collision attacks.",
                                        severity: 'HIGH',
                                        color: '#f59e0b'
                                    },
                                    { 
                                        name: 'Legacy_Banking_App.cpp', 
                                        threats: 45, 
                                        critical: 22, 
                                        date: '2026-03-05',
                                        findings: "Hardcoded Elliptic Curve P-256 keys found in core transaction module. Commercial-scale quantum computers can solve the Discrete Log Problem in polynomial time using Shor's algorithm.",
                                        severity: 'CRITICAL',
                                        color: '#ef4444'
                                    }
                                ].map((rep, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'white', marginBottom: '5px' }}>{rep.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Scan Simulated on: {rep.date} • {rep.threats} Total Threats</div>
                                        </div>
                                        <button
                                            className="cyber-btn cyber-btn-outline"
                                            style={{ padding: '8px 16px', fontSize: '0.75rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                                            onClick={() => {
                                                const reportHTML = `<!DOCTYPE html>
                                                    <html>
                                                    <head>
                                                        <title>QuantumGuard Sample Report — ${rep.name}</title>
                                                        <style>
                                                            * { margin:0; padding:0; box-sizing:border-box; }
                                                            body { background:#0a0b10; color:#e2e8f0; font-family:'Segoe UI',sans-serif; }
                                                            .top-nav { position:sticky; top:0; z-index:100; background:#0a0b10; border-bottom:1px solid #1e2640; padding:15px 40px; display:flex; align-items:center; justify-content:space-between; }
                                                            .back-btn { background:rgba(6,182,212,0.1); border:1px solid #06b6d4; color:#a5f3fc; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; }
                                                            h1 { padding: 40px; color: white; text-align: center; }
                                                        </style>
                                                    </head>
                                                    <body>
                                                        <div class="top-nav">
                                                            <button class="back-btn" onclick="window.close()">← CLOSE REPORT</button>
                                                            <div style="font-weight:bold; color: #94a3b8;">SAMPLE REPORT</div>
                                                        </div>
                                                        <h1>Vulnerability Report for ${rep.name}</h1>
                                                        <p style="text-align:center; color:#94a3b8;">Critical Issues Found: ${rep.critical}</p>
                                                        <div style="max-width:800px; margin:40px auto; background:#111827; padding:30px; border-radius:10px; border:1px solid #1e2640;">
                                                            <h3 style="color:${rep.color}; margin-bottom:15px;">Warning: ${rep.severity} Severity Issues Detected</h3>
                                                            <p style="color:#cbd5e1; line-height:1.6;">${rep.findings}</p>
                                                        </div>
                                                    </body>
                                                    </html>`;
                                                const win = window.open('', '_blank');
                                                if (win) {
                                                    win.document.write(reportHTML);
                                                    win.document.close();
                                                }
                                            }}
                                        >
                                            VIEW REPORT
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResearcherDashboard;
