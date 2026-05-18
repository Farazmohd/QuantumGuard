import React, { useState, useEffect, useRef } from 'react';

const OrgDashboard = ({ user, onLogout, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [scannedData, setScannedData] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanContent, setScanContent] = useState('');
    const [modalContent, setModalContent] = useState(null);
    const [scanHistory, setScanHistory] = useState([
        { id: 'QS-A001', date: '2026-03-09 08:45', file: 'main_encryption_v2.js', risk: '92%', status: 'CRITICAL' },
        { id: 'QS-A002', date: '2026-03-08 14:22', file: 'auth_service.config', risk: '85%', status: 'CRITICAL' },
        { id: 'QS-B002', date: '2026-03-07 09:30', file: 'kyber_implementation.js', risk: '14%', status: 'SECURE' },
    ]);
    const [currentFileName, setCurrentFileName] = useState('pasted_snippet.txt');
    const [notifications, setNotifications] = useState([]);
    const [fetchingNotifs, setFetchingNotifs] = useState(true);
    const fileInputRef = useRef(null);

    // Fetch Scan History from Database on mount
    useEffect(() => {
        fetchHistory();
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setFetchingNotifs(false);
        }
    };


    const fetchHistory = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/scans');
            if (response.ok) {
                const data = await response.json();
                setScanHistory(data);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    // Reusable Sidebar Link Component
    const SidebarLink = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px',
                width: '100%', background: activeTab === id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                color: activeTab === id ? 'var(--primary)' : 'var(--text-muted)',
                transition: 'all 0.2s', marginBottom: '8px'
            }}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon}></path></svg>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
        </button>
    );

    const handleFileLoad = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setScanContent(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    const handleScan = (code) => {
        if (!code.trim()) return;
        setIsScanning(true);
        setScanProgress(0);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                setScanProgress(100);
                setTimeout(async () => {
                    const results = analyzeQuantumVulnerability(code);
                    setScannedData(results);
                    setIsScanning(false);

                    // PERSIST TO DATABASE
                    try {
                        const payload = {
                            sourceType: 'upload',
                            sourceName: currentFileName,
                            codeContent: code,
                            riskScore: results.riskScore,
                            readinessScore: results.readiness,
                            vulnerabilities: results.vulnerabilities || []
                        };

                        console.log('🔷 Sending to DB:', payload.sourceName, '| Vulns:', payload.vulnerabilities.length);

                        const response = await fetch('http://localhost:5000/api/scans', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        const data = await response.json();
                        if (response.ok) {
                            console.log('✅ DB Save Success - Scan ID:', data.id);
                        } else {
                            console.error('❌ DB Error:', data.error);
                        }

                        // Refresh history list
                        fetchHistory();
                    } catch (err) {
                        console.error("Persistence Error:", err);
                    }

                    setActiveTab('results');
                }, 500);
            } else {
                setScanProgress(progress);
            }
        }, 200);
    };

    const analyzeQuantumVulnerability = (code) => {
        const vulnerable = [];
        const lines = code.split('\n');

        // Refined regex with word boundaries to avoid false positives
        const cryptoRegex = /\b(rsa|sha1|md5|sha256|aes-128|des|3des|rc4)\b/i;

        lines.forEach((line, idx) => {
            const cleanedLine = line.toLowerCase();
            if (cryptoRegex.test(cleanedLine)) {
                let name = 'Legacy Algorithm';
                let pqcAlt = 'AES-256-GCM';
                let suggestedCode = '';

                if (cleanedLine.includes('rsa')) {
                    name = 'RSA (Classic Asymmetric)';
                    pqcAlt = 'CRYSTALS-Kyber';
                    suggestedCode = "// PQC Migration: Replace RSA with Kyber-768\nimport { Kyber } from '@quantum-guard/pqc';\nconst keyPair = await Kyber.generateKeyPair();";
                }
                else if (cleanedLine.includes('sha1') || cleanedLine.includes('md5')) {
                    name = 'Weak Hash (MD5/SHA1)';
                    pqcAlt = 'SHA-3-512';
                    suggestedCode = "// PQC Migration: Replace Weak Hash with SHA-3\nimport { SHA3 } from 'crypto';\nconst hash = SHA3('512').update(data).digest();";
                }
                else if (cleanedLine.includes('sha256')) {
                    name = 'SHA-256 (Quantum Weakened)';
                    pqcAlt = 'SHA-3 / LMS';
                    suggestedCode = "// Upgrade to Quantum Resistant Hash\nconst secureHash = await LMS.sign(message, privateKey);";
                }
                else if (cleanedLine.includes('des')) {
                    name = 'DES Encryption';
                    pqcAlt = 'AES-256';
                    suggestedCode = "// Replace DES with AES-256-GCM\nconst cipher = crypto.createCipheriv('aes-256-gcm', key, iv);";
                }

                vulnerable.push({
                    line: idx + 1,
                    name: name,
                    snippet: line.trim(),
                    risk: cleanedLine.includes('rsa') ? 95 : 65,
                    pqcAlt: pqcAlt,
                    suggestedCode: suggestedCode
                });
            }
        });

        // Special check: If user uses the PQC suggested keywords, lower the risk to 0
        const isSecurePQC = /\b(kyber|dilithium|sphincs|sha3|aes-256)\b/i.test(code.toLowerCase());

        return {
            riskScore: vulnerable.length > 0 ? (vulnerable.some(v => v.risk > 90) ? 92 : 68) : (isSecurePQC ? 0 : 0),
            readiness: vulnerable.length > 0 ? 34 : 100,
            threats: vulnerable.length,
            vulnerabilities: vulnerable
        };
    };

    const simulateDownload = (fileName) => {
        // Build a real HTML report and open it in a new tab
        const reportDate = new Date().toLocaleString();
        const historyRows = scanHistory.length > 0
            ? scanHistory.map((s, i) => `
                <tr style="border-bottom:1px solid #1e2640;">
                    <td style="padding:12px 16px; color:#94a3b8; font-size:13px;">${i + 1}</td>
                    <td style="padding:12px 16px; font-weight:700; color:#fff;">${s.file || 'N/A'}</td>
                    <td style="padding:12px 16px;">
                        <span style="padding:3px 10px; border-radius:20px; font-size:11px; font-weight:800;
                            background:${s.status === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'};
                            color:${s.status === 'CRITICAL' ? '#ef4444' : '#10b981'}">
                            ${s.status || 'SECURE'}
                        </span>
                    </td>
                    <td style="padding:12px 16px; font-weight:900; color:${parseInt(s.risk) > 50 ? '#ef4444' : '#10b981'};">${s.risk}</td>
                    <td style="padding:12px 16px; color:#64748b; font-size:12px;">${s.date || 'N/A'}</td>
                </tr>`).join('')
            : `<tr><td colspan="5" style="padding:30px; text-align:center; color:#64748b;">No scan data available.</td></tr>`;

        const reportHTML = `<!DOCTYPE html>
<html>
<head>
    <title>QuantumGuard — Audit Report: ${fileName}</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0b10; color:#e2e8f0; font-family:'Segoe UI',sans-serif; padding:0; }
        .top-nav { position:sticky; top:0; z-index:100; background:#0a0b10; border-bottom:1px solid #1e2640; padding:14px 40px; display:flex; align-items:center; justify-content:space-between; }
        .back-btn { display:flex; align-items:center; gap:10px; background:rgba(99,102,241,0.1); border:1px solid #6366f1; color:#a5b4fc; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:800; cursor:pointer; letter-spacing:1px; transition:all 0.2s; }
        .back-btn:hover { background:rgba(99,102,241,0.25); color:#fff; }
        .print-btn { background:#6366f1; color:#fff; border:none; padding:9px 22px; border-radius:8px; font-size:13px; font-weight:800; cursor:pointer; letter-spacing:1px; }
        .print-btn:hover { background:#818cf8; }
        .content { padding:40px; }
        .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; padding-bottom:20px; border-bottom:1px solid #1e2640; }
        .logo { font-size:1.4rem; font-weight:900; letter-spacing:3px; }
        .logo span { color:#a855f7; }
        .badge { padding:6px 16px; border-radius:20px; background:rgba(239,68,68,0.1); color:#ef4444; font-size:11px; font-weight:800; border:1px solid rgba(239,68,68,0.3); }
        h1 { font-size:1.8rem; color:#fff; margin-bottom:6px; }
        .meta { color:#64748b; font-size:13px; margin-bottom:40px; }
        .section { background:#111827; border:1px solid #1e2640; border-radius:12px; overflow:hidden; margin-bottom:30px; }
        .section-header { padding:18px 24px; background:#0f1623; border-bottom:1px solid #1e2640; }
        .section-header h2 { font-size:1rem; color:#a855f7; font-weight:800; letter-spacing:1px; }
        table { width:100%; border-collapse:collapse; }
        th { padding:13px 16px; text-align:left; color:#64748b; font-size:11px; font-weight:900; text-transform:uppercase; background:#0f1623; }
        .summary-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding:24px; }
        .stat { background:#0f1623; border-radius:10px; padding:20px; text-align:center; border:1px solid #1e2640; }
        .stat-val { font-size:2rem; font-weight:900; color:#6366f1; }
        .stat-label { font-size:11px; color:#64748b; margin-top:6px; font-weight:700; text-transform:uppercase; }
        .footer { margin-top:40px; text-align:center; color:#334155; font-size:11px; padding-top:20px; border-top:1px solid #1e2640; }
        @media print { .top-nav { display:none; } body { background:#fff; color:#000; } }
    </style>
</head>
<body>
    <!-- Sticky Navigation Bar with Back Button -->
    <div class="top-nav">
        <button class="back-btn" onclick="window.close()">
            ← BACK TO DASHBOARD
        </button>
        <div style="font-size:12px; color:#475569; font-weight:700; letter-spacing:1px;">QUANTUMGUARD — AUDIT REPORT</div>
        <button class="print-btn" onclick="window.print()">🖨️ SAVE AS PDF</button>
    </div>

    <div class="content">
        <div class="header">
            <div class="logo">QUANTUM<span>GUARD</span></div>
            <span class="badge">CONFIDENTIAL AUDIT REPORT</span>
        </div>

        <h1>Quantum Security Audit Report</h1>
        <p class="meta">Document: ${fileName} &nbsp;|&nbsp; Generated: ${reportDate} &nbsp;|&nbsp; Standard: NIST FIPS 203 / FIPS 204</p>

        <div class="section">
            <div class="section-header"><h2>📊 Platform Summary</h2></div>
            <div class="summary-grid">
                <div class="stat"><div class="stat-val">${scanHistory.length}</div><div class="stat-label">Total Scans</div></div>
                <div class="stat"><div class="stat-val" style="color:#ef4444">${scanHistory.filter(s => s.status === 'CRITICAL').length}</div><div class="stat-label">Critical Risks</div></div>
                <div class="stat"><div class="stat-val" style="color:#10b981">${scanHistory.filter(s => s.status === 'SECURE').length}</div><div class="stat-label">Secure Files</div></div>
            </div>
        </div>

        <div class="section">
            <div class="section-header"><h2>📋 Scan History Log</h2></div>
            <table>
                <thead>
                    <tr>
                        <th>#</th><th>File / Source</th><th>Status</th><th>Risk Score</th><th>Scan Date</th>
                    </tr>
                </thead>
                <tbody>${historyRows}</tbody>
            </table>
        </div>

        <div class="footer">
            QuantumGuard by Post-Quantum Cryptography Lab &nbsp;|&nbsp; Confidential — Not for Distribution &nbsp;|&nbsp; ${reportDate}
        </div>
    </div>
</body>
</html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(reportHTML);
            win.document.close();
        }
    };

    const showThreatDetails = (item) => {
        setModalContent({
            title: `Risk Analysis: ${item.file || item.name}`,
            details: true,
            risk: item.risk,
            status: item.status || 'CRITICAL',
            summary: "This file contains cryptographic markers that are susceptible to Shor's algorithm. Quantum supremacy estimated within 3-5 years will allow for real-time decryption of these payloads."
        });
    };

    const showSolutionModal = (v) => {
        setModalContent({
            title: `PQC Mitigation: ${v.name}`,
            details: true,
            isSolution: true,
            status: "RECOMMENDED FIX",
            risk: v.pqcAlt,
            summary: "Transitioning to lattice-based cryptography is the only verified way to secure this specific code block against Q-Day threats.",
            suggestedCode: v.suggestedCode
        });
    };

    const applyFix = (code) => {
        setScanContent(code);
        setModalContent(null);
        setActiveTab('scan');
        // Small feedback
        setModalContent({
            title: "Code Injected",
            status: "PQC implementation has been pasted into the terminal. Run scan to verify.",
            progress: 100,
            complete: true
        });
    };

    const showPQCInfo = (algo) => {
        setModalContent({
            title: `Protocol Details: ${algo.title}`,
            details: true,
            risk: "NIST FIPS 203",
            status: "PQC Standard",
            summary: algo.longDesc || algo.desc
        });
    };

    const showSystemStatus = (type) => {
        if (type === 'encryption') {
            setModalContent({
                title: "Active Encryption Detail",
                details: true,
                risk: "FIPS 140-3",
                status: "SECURE (Classic)",
                summary: "Your session is currently protected by AES-256-GCM. While secure against today's supercomputers, QuantumGuard is monitoring this tunnel for potential Q-Day intercept vectors."
            });
        } else {
            setModalContent({
                title: "Global Infrastructure Status",
                details: true,
                risk: "99.99% Uptime",
                status: "OPERATIONAL",
                summary: "All quantum scanning clusters are currently online. Distributed lattice nodes in Zurich, Tokyo, and Virginia are reporting nominal processing latency."
            });
        }
    };

    return (
        <div className="dashboard-container">
            {/* Modal Overlay */}
            {modalContent && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-fade-in">
                    <div className="glass-card" style={{ maxWidth: '600px', width: '90%', padding: '40px', textAlign: 'center', border: '1px solid var(--primary)' }}>
                        <h3 className="gradient-text" style={{ marginBottom: '20px' }}>{modalContent.title}</h3>

                        {modalContent.details ? (
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <span style={{ color: 'var(--text-dim)' }}>{modalContent.isSolution ? 'Resolution Path' : 'System Status'}:</span>
                                    <span style={{ color: modalContent.status === 'CRITICAL' ? 'var(--danger)' : 'var(--success)', fontWeight: '900' }}>{modalContent.status}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <span style={{ color: 'var(--text-dim)' }}>{modalContent.isSolution ? 'Migration Target' : 'Identifier / Score'}:</span>
                                    <span style={{ color: 'white', fontWeight: '900' }}>{modalContent.risk}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px' }}>{modalContent.summary}</p>

                                {modalContent.isSolution && (
                                    <div style={{ background: '#05070a', padding: '20px', borderRadius: '8px', border: '1px solid var(--success)', marginBottom: '30px' }}>
                                        <div style={{ color: 'var(--success)', fontSize: '0.7rem', fontWeight: '800', marginBottom: '10px', textTransform: 'uppercase' }}>Recommended Quantum-Safe Implementation:</div>
                                        <pre style={{ color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', margin: 0, whiteSpace: 'pre-wrap' }}>{modalContent.suggestedCode}</pre>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ marginBottom: '30px' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>{modalContent.status}</div>
                                <div className="scan-progress-bar" style={{ height: '8px' }}>
                                    <div className="scan-progress-fill" style={{ width: `${modalContent.progress}%`, background: 'var(--primary)' }}></div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '15px' }}>
                            {modalContent.isSolution && (
                                <button className="cyber-btn cyber-btn-primary" onClick={() => applyFix(modalContent.suggestedCode)} style={{ flex: 1, padding: '12px' }}>
                                    APPLY PQC FIX
                                </button>
                            )}
                            <button className="cyber-btn cyber-btn-outline" onClick={() => setModalContent(null)} style={{ flex: 1, padding: '12px' }}>
                                {modalContent.complete ? 'CLOSE TERMINAL' : 'DISMISS'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo" style={{ marginBottom: '60px', paddingLeft: '10px' }}>QUANTUM<span>GUARD</span></div>

                <div style={{ flex: 1 }}>
                    <SidebarLink id="dashboard" label="Overview" icon="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <SidebarLink id="scan" label="Quantum Scan" icon="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7m9-7l-3.5 3.5m0 0l-3.5-3.5m3.5 3.5V21" />
                    <SidebarLink id="history" label="Scan History" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <SidebarLink id="advisor" label="Migration Advisor" icon="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    <SidebarLink id="reports" label="Audit Reports" icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2l6 6m-8 5h4m-4 4h4" />
                    <SidebarLink id="notifications" label="Notifications" icon="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--secondary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white' }}> {user?.name?.[0]} </div>
                        <div>
                            <div style={{ fontWeight: '800', fontSize: '0.8rem', color: 'white' }}>{user?.name}</div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>{user?.role?.toUpperCase()} LEVEL 4</div>
                        </div>
                    </div>
                    <button onClick={onLogout} className="cyber-btn cyber-btn-outline" style={{ width: '100%', padding: '10px' }}>Logout Session</button>
                </div>
            </aside>

            {/* Main Panel */}
            <main className="main-content" style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.8rem' }}>ORG <span className="gradient-text">PORTAL</span> // {activeTab.toUpperCase()}</h2>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div
                            className="glass-card hover-pulse"
                            onClick={() => showSystemStatus('status')}
                            style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                            SYSTEMS NOMINAL
                        </div>
                        <div
                            className="glass-card hover-pulse"
                            onClick={() => showSystemStatus('encryption')}
                            style={{ padding: '8px 15px', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                            ENCRYPTION STRENGTH: AES-256
                        </div>
                        <button className="theme-toggle-btn" onClick={toggleTheme} style={{ width: '35px', height: '35px', fontSize: '0.9rem', marginLeft: '10px' }} title="Toggle Theme">
                            🌙
                        </button>
                        <button onClick={() => setActiveTab('scan')} className="cyber-btn cyber-btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>NEW AUDIT</button>
                    </div>
                </header>

                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in">
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            {[
                                { label: 'Total Audits', val: '154', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', color: 'var(--primary)' },
                                { label: 'Vulnerability Score', val: '82%', icon: 'M12 2L2 7l10 5 10-5-10-5z', color: 'var(--danger)' },
                                { label: 'Cloud Resources', val: '4,289', icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.5 1', color: 'var(--accent)' },
                                { label: 'PQC Readiness', val: '14.2%', icon: 'M9 11l3 3L22 4', color: 'var(--success)' }
                            ].map((s, i) => (
                                <div key={i} className="glass-card" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>{s.label}</span>
                                        <h2 style={{ fontSize: '2rem', marginTop: '5px', color: s.color }}>{s.val}</h2>
                                    </div>
                                    <div style={{ color: s.color, opacity: 0.3 }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}></path></svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Recent Scan Activity</h3>
                                {scanHistory.slice(0, 4).map((item, i) => (
                                    <div key={i} style={{ padding: '15px 10px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.status === 'SECURE' ? 'var(--success)' : 'var(--danger)' }}></div>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'white' }}>{item.file}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Scan ID: {item.id} // {item.date}</div>
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: '900', fontSize: '0.8rem', color: item.status === 'SECURE' ? 'var(--success)' : 'var(--danger)' }}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Threat Landscape</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {[{ l: 'RSA-2048', p: 85, c: 'var(--danger)' }, { l: 'ECC-P256', p: 92, c: 'var(--danger)' }, { l: 'SHA-1', p: 45, c: 'var(--warning)' }].map((t, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '800', marginBottom: '5px' }}>
                                                <span style={{ color: 'white' }}>{t.l}</span>
                                                <span style={{ color: t.c }}>{t.p}% BREAKABLE</span>
                                            </div>
                                            <div className="scan-progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div className="scan-progress-fill" style={{ height: '100%', width: `${t.p}%`, background: t.c }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ marginTop: '30px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                    Algorithms highlighted in red are breakable via Shor's Algorithm running on current quantum prototypes within &lt; 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'scan' && (
                    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div className="glass-card" style={{ padding: '50px', textAlign: 'center' }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileLoad}
                                accept=".js,.jsx,.ts,.tsx,.c,.cpp,.h,.py,.go,.config,.env,.cert,.pem"
                            />
                            <div
                                onClick={() => fileInputRef.current.click()}
                                style={{
                                    width: '80px', height: '80px', background: 'rgba(99, 102, 241, 0.1)',
                                    borderRadius: '20px', border: '1px solid var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 30px', cursor: 'pointer', transition: 'all 0.3s ease'
                                }}
                                className="hover-pulse"
                            >
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path></svg>
                            </div>
                            <h2 style={{ color: 'white', marginBottom: '10px' }}>Quantum Ingestion Terminal</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Drop your source code, configuration files, or TLS certificates to check for quantum vulnerabilities.</p>

                            <textarea
                                className="cyber-input"
                                placeholder="Paste your cryptographic configuration or code here... (e.g., const key = rsa.generate())"
                                style={{
                                    height: '300px',
                                    marginBottom: '30px',
                                    fontFamily: 'var(--font-mono)',
                                    width: '100%',
                                    display: 'block',
                                    resize: 'none'
                                }}
                                value={scanContent}
                                onChange={(e) => {
                                    setScanContent(e.target.value);
                                    if (e.target.value) setCurrentFileName('pasted_snippet.txt');
                                }}
                            ></textarea>

                            <button onClick={() => handleScan(scanContent)} className="cyber-btn cyber-btn-primary" style={{ width: '100%', padding: '18px' }} disabled={isScanning || !scanContent.trim()}>
                                {isScanning ? `ANALYZING BYTES... ${scanProgress}%` : 'EXECUTE QUANTUM SCAN'}
                            </button>

                            {isScanning && (
                                <div className="scan-progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginTop: '20px' }}>
                                    <div className="scan-progress-fill" style={{ height: '100%', width: `${scanProgress}%`, background: 'var(--primary)' }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ padding: '30px' }}>
                            <h3 style={{ color: 'white', marginBottom: '30px' }}>Quantum Scan History</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {scanHistory.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '20px', background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '12px', border: '1px solid var(--glass-border)'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '0.85rem' }}>#{item.id}</span>
                                                <span style={{ color: 'white', fontWeight: '700' }}>{item.file}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '5px' }}>SCAN PERFORMED: {item.date}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Risk Level</div>
                                                <div style={{ fontWeight: '900', color: item.status === 'SECURE' ? 'var(--success)' : 'var(--danger)' }}>{item.risk}</div>
                                            </div>
                                            <div
                                                onClick={() => showThreatDetails(item)}
                                                style={{
                                                    fontSize: '0.65rem', padding: '4px 10px', borderRadius: '4px',
                                                    background: item.status === 'SECURE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: item.status === 'SECURE' ? 'var(--success)' : 'var(--danger)',
                                                    fontWeight: '900', border: `1px solid ${item.status === 'SECURE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                                    cursor: 'pointer'
                                                }}>
                                                {item.status}
                                            </div>
                                            <button className="cyber-btn cyber-btn-outline" onClick={() => simulateDownload(item.file)} style={{ padding: '8px 15px', fontSize: '0.7rem' }}>DOWNLOAD REPORT</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'advisor' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ padding: '40px' }}>
                            <h3 style={{ color: 'white', marginBottom: '30px' }}>PQC Migration Advisor</h3>
                            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                                {[
                                    { title: 'CRYSTALS-Kyber', role: 'Key Encapsulation', desc: 'Replacement for RSA/ECC key exchange.', color: 'var(--accent)', longDesc: 'ML-KEM (formerly Kyber) is the primary lattice-based mechanism for key encapsulation. It is the NIST standard for securing future key exchanges against Shor\'s algorithm.' },
                                    { title: 'CRYSTALS-Dilithium', role: 'Digital Signatures', desc: 'Secure alternative for X.509 certs.', color: 'var(--primary)', longDesc: 'ML-DSA (formerly Dilithium) provides quantum-resistant digital signatures. It is critical for upgrading identity management and TLS certificate authorities.' },
                                    { title: 'SPHINCS+', role: 'Stateless Hash-Sign', desc: 'Backup signature strategy.', color: 'var(--secondary)', longDesc: 'A stateless hash-based signature scheme that offers robust security with larger signature sizes, serving as a reliable alternative if lattice-based schemes face future cryptanalysis.' }
                                ].map((algo, i) => (
                                    <div
                                        key={i}
                                        className="glass-card hover-pulse"
                                        onClick={() => showPQCInfo(algo)}
                                        style={{ padding: '25px', borderTop: `4px solid ${algo.color}`, cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    >
                                        <h4 style={{ color: 'white', marginBottom: '5px' }}>{algo.title}</h4>
                                        <div style={{ fontSize: '0.7rem', color: algo.color, fontWeight: '900', marginBottom: '15px' }}>{algo.role}</div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{algo.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                <h4 style={{ color: 'white', marginBottom: '20px' }}>Recommended Migration Steps</h4>
                                {[
                                    "Phase 1: Inventory all cryptographic endpoints and certificates.",
                                    "Phase 2: Priority assessment of high-sensitivity data assets.",
                                    "Phase 3: Implementation of 'Hybrid' cryptography (RSA + Kyber).",
                                    "Phase 4: Full decommissioning of legacy NIST SP 800-56A algorithms."
                                ].map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900', flexShrink: 0 }}>{i + 1}</div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h3 style={{ color: 'white' }}>Audit Compliance Reports</h3>
                                <button className="cyber-btn cyber-btn-primary" onClick={() => simulateDownload('GENERIC_AUDIT.pdf')} style={{ padding: '10px 20px', fontSize: '0.8rem' }}>Generate New Audit</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div className="glass-card" style={{ padding: '30px', background: 'rgba(16, 185, 129, 0.02)' }}>
                                    <h4 style={{ color: 'var(--success)', marginBottom: '15px' }}>FIPS 203 Readiness</h4>
                                    <div className="scan-progress-bar"><div className="scan-progress-fill" style={{ width: '45%', background: 'var(--success)' }}></div></div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '10px' }}>Your infrastructure is currently 45% compliant with the new NIST ML-KEM standards.</p>
                                </div>
                                <div className="glass-card" style={{ padding: '30px', background: 'rgba(239, 68, 68, 0.02)' }}>
                                    <h4 style={{ color: 'var(--danger)', marginBottom: '15px' }}>Crypto-Agility Gap</h4>
                                    <div className="scan-progress-bar"><div className="scan-progress-fill" style={{ width: '78%', background: 'var(--danger)' }}></div></div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '10px' }}>78% of your cryptographic codebase is hard-coded and lacks agility for fast migration.</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <h4 style={{ color: 'white', marginBottom: '20px' }}>Recent Audit Logs</h4>
                                {[
                                    { name: 'SEC_AUDIT_2026_Q1.pdf', size: '2.4 MB', date: 'Mar 05, 2026', type: 'System Audit' },
                                    { name: 'PQC_TRANSITION_v1.2.pdf', size: '5.1 MB', date: 'Feb 28, 2026', type: 'Migration Log' },
                                    { name: 'TLS_CERT_INVENTORY.pdf', size: '1.8 MB', date: 'Feb 15, 2026', type: 'Inventory' },
                                ].map((log, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '15px 20px', borderBottom: '1px solid var(--glass-border)'
                                    }}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                            <div>
                                                <div style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>{log.name}</div>
                                                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{log.type} // {log.date}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{log.size}</span>
                                            <button className="cyber-btn cyber-btn-outline" onClick={() => simulateDownload(log.name)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>VIEW PDF</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'results' && scannedData && (
                    <div className="animate-fade-in">
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div className="glass-card" style={{ padding: '25px', borderLeft: '4px solid var(--danger)' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>QUANTUM RISK</span>
                                <h2 style={{ fontSize: '2.5rem', color: 'var(--danger)' }}>{scannedData.riskScore}%</h2>
                            </div>
                            <div className="glass-card" style={{ padding: '25px', borderLeft: '4px solid var(--accent)' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>PQC READINESS</span>
                                <h2 style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>{scannedData.readiness}%</h2>
                            </div>
                            <div className="glass-card" style={{ padding: '25px', borderLeft: '4px solid var(--secondary)' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>THREAT VECTORS</span>
                                <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>{scannedData.threats}</h2>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '40px' }}>
                            <h3 style={{ marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px', color: 'white' }}>Detected Cryptographic Signature Markers</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {scannedData.vulnerabilities.length > 0 ? scannedData.vulnerabilities.map((v, i) => (
                                    <div key={i} style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '25px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h4 style={{ color: 'var(--danger)', fontSize: '1.2rem' }}>{v.name}</h4>
                                            <button
                                                onClick={() => showSolutionModal(v)}
                                                style={{ fontWeight: '900', fontSize: '0.75rem', color: 'white', background: 'var(--success)', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                                className="hover-pulse"
                                            >
                                                GET QUANTUM FIX
                                            </button>
                                        </div>
                                        <div style={{ background: '#05070a', padding: '15px', borderRadius: '8px', color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '20px', borderLeft: '4px solid var(--danger)' }}>
                                            <span style={{ color: 'var(--text-dim)', marginRight: '10px' }}>L{v.line} |</span> {v.snippet}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--success)' }}>MIGRATION RECOMMENDATION:</span>
                                                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: '700' }}>{v.pqcAlt}</span>
                                            </div>
                                            <button className="cyber-btn cyber-btn-outline" onClick={() => setActiveTab('advisor')} style={{ fontSize: '0.7rem' }}>VIEW ROADMAP</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                        </div>
                                        <h3 style={{ color: 'var(--success)', marginBottom: '10px' }}>VULNERABILITY RESOLVED</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>This code is now protected by Post-Quantum lattice-based encryption standards.</p>
                                        <button className="cyber-btn cyber-btn-primary" onClick={() => setActiveTab('scan')} style={{ marginTop: '30px', padding: '12px 30px' }}>BACK TO TERMINAL</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── NOTIFICATIONS ─── */}
                {activeTab === 'notifications' && (
                    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="glass-card" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                    System Broadcasts
                                </h3>
                                <button onClick={fetchNotifications} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    ↻ REFRESH
                                </button>
                            </div>

                            {fetchingNotifs ? (
                                <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '40px' }}>Loading messages...</div>
                            ) : notifications.length === 0 ? (
                                <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '40px' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📭</div>
                                    <p>No system broadcasts currently available.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {notifications.map((n) => (
                                        <div key={n.NID} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: '22px', left: '-5px', width: '10px', height: '10px', background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent)' }}></div>
                                            <div style={{ paddingLeft: '15px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <span style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{n.SentBy}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(n.SentAt).toLocaleString()}</span>
                                                </div>
                                                <p style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>{n.Message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrgDashboard;
