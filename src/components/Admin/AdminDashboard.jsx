import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, onLogout, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [analyticsRes, usersRes, logsRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/analytics'),
                fetch('http://localhost:5000/api/admin/users'),
                fetch('http://localhost:5000/api/admin/logs')
            ]);
            if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
            if (logsRes.ok) setLogs(await logsRes.json());
        } catch (err) {
            console.error('Admin fetch error:', err);
        }
        setLoading(false);
    };

    const [broadcastStatus, setBroadcastStatus] = useState(null); // 'success' | 'error' | null
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const sendNotification = async () => {
        if (!notification.trim()) return;
        setIsBroadcasting(true);
        setBroadcastStatus(null);
        try {
            const res = await fetch('http://localhost:5000/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: notification, sentBy: user?.name || 'System Admin' })
            });
            if (res.ok) {
                setBroadcastStatus('success');
                setNotification('');
            } else {
                setBroadcastStatus('error');
            }
        } catch (err) {
            console.error('Broadcast error:', err);
            setBroadcastStatus('error');
        }
        setIsBroadcasting(false);
        setTimeout(() => setBroadcastStatus(null), 4000);
    };

    const navItems = [
        { id: 'overview', label: 'System Overview', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
        { id: 'users', label: 'Manage Users', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
        { id: 'scans', label: 'Global Scans', icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' },
        { id: 'algorithms', label: 'Threat Intelligence', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
        { id: 'logs', label: 'Activity Logs', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
        { id: 'notifications', label: 'Notifications', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
    ];

    // Sub-component: fetches & shows recent broadcasts
    const RecentBroadcasts = () => {
        const [recentNotifs, setRecentNotifs] = React.useState([]);
        const [fetching, setFetching] = React.useState(true);

        React.useEffect(() => {
            fetch('http://localhost:5000/api/notifications')
                .then(r => r.json())
                .then(data => { setRecentNotifs(data); setFetching(false); })
                .catch(() => setFetching(false));
        }, []);

        return (
            <div className="glass-card" style={{ padding: '30px', marginTop: '25px', maxWidth: '700px' }}>
                <h4 style={{ color: 'white', marginBottom: '20px' }}>📋 Recent Broadcasts</h4>
                {fetching ? (
                    <div style={{ color: 'var(--text-dim)', padding: '20px', textAlign: 'center' }}>Loading...</div>
                ) : recentNotifs.length === 0 ? (
                    <div style={{ color: 'var(--text-dim)', padding: '20px', textAlign: 'center' }}>No broadcasts sent yet.</div>
                ) : recentNotifs.map((n, i) => (
                    <div key={n.NID || i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '15px 0', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginTop: '6px', flexShrink: 0 }}></div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem', margin: '0 0 4px 0' }}>{n.Message}</p>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
                                Sent by {n.SentBy} &bull; {new Date(n.SentAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const StatCard = ({ label, value, color, icon, sub }) => (
        <div className="glass-card" style={{ padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div>
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color, marginTop: '8px', lineHeight: 1 }}>{value}</div>
                {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '8px' }}>{sub}</div>}
            </div>
            <div style={{ color, opacity: 0.25 }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                </svg>
            </div>
        </div>
    );

    const getRoleColor = (role) => {
        if (role === 'admin') return '#6366f1';
        if (role === 'researcher') return '#06b6d4';
        return '#a855f7';
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
                <div className="logo" style={{ marginBottom: '50px', fontSize: '1rem' }}>QUANTUM<span>GUARD</span></div>

                <div style={{ marginBottom: '10px', fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: '800', letterSpacing: '2px', paddingLeft: '10px' }}>
                    ADMIN CONTROL
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                width: '100%', padding: '13px 15px',
                                background: activeTab === item.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                border: 'none',
                                borderLeft: activeTab === item.id ? '3px solid var(--primary)' : '3px solid transparent',
                                textAlign: 'left',
                                color: activeTab === item.id ? 'white' : 'var(--text-muted)',
                                fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer',
                                borderRadius: '0 8px 8px 0',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d={item.icon} />
                            </svg>
                            {item.label.toUpperCase()}
                        </button>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '15px', textAlign: 'center' }}>
                        ⚡ {user?.name || 'System Admin'}
                    </div>
                    <button onClick={onLogout} className="cyber-btn cyber-btn-outline" style={{ width: '100%', fontSize: '0.75rem', padding: '12px' }}>
                        EXIT TERMINAL
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content" style={{ padding: '40px', overflowY: 'auto', flex: 1 }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>
                            <span className="gradient-text">ADMIN</span> COMMAND CENTER
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '5px' }}>
                            QuantumGuard Platform Control — Full Clearance
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 8px var(--success)' }}></div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '800' }}>ALL SYSTEMS NOMINAL</span>

                        <button className="theme-toggle-btn" onClick={toggleTheme} style={{ width: '35px', height: '35px', fontSize: '0.9rem', marginLeft: '10px' }} title="Toggle Theme">
                            🌙
                        </button>

                        <button onClick={fetchAll} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800' }}>
                            ↻ REFRESH
                        </button>
                    </div>
                </header>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                        Loading Platform Data...
                    </div>
                )}

                {/* ─── SYSTEM OVERVIEW ─── */}
                {!loading && activeTab === 'overview' && (
                    <div className="animate-fade-in">
                        {/* Stat Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                            <StatCard label="Total Scans" value={analytics?.totalScans ?? '—'} color="var(--primary)" icon="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" sub="Platform-wide" />
                            <StatCard label="Critical Risks" value={analytics?.criticalScans ?? '—'} color="var(--danger)" icon="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" sub="Require immediate action" />
                            <StatCard label="Registered Users" value={analytics?.totalUsers ?? '—'} color="var(--success)" icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" sub="Orgs & Researchers" />
                            <StatCard label="Secure Scans" value={analytics ? (analytics.totalScans - analytics.criticalScans) : '—'} color="var(--accent)" icon="M22 11.08V12a10 10 0 1 1-5.93-9.14" sub="PQC compliant" />
                        </div>

                        {/* Vulnerability Algorithm Breakdown */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' }}>
                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ color: 'white', marginBottom: '25px', fontSize: '1rem' }}>🔴 Most Detected Vulnerable Algorithms</h3>
                                {analytics?.topAlgorithms?.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        {analytics.topAlgorithms.map((algo, i) => {
                                            const maxCount = analytics.topAlgorithms[0].occurrences;
                                            const pct = Math.round((algo.occurrences / maxCount) * 100);
                                            return (
                                                <div key={i}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'white' }}>{algo.AlgorithmName}</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '700' }}>{algo.occurrences} detections</span>
                                                    </div>
                                                    <div style={{ height: '7px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #ef4444, #f97316)', borderRadius: '10px', transition: 'width 0.8s ease' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No vulnerability data yet. Scan some code to populate this chart.</p>
                                )}
                            </div>

                            <div className="glass-card" style={{ padding: '30px' }}>
                                <h3 style={{ color: 'white', marginBottom: '25px', fontSize: '1rem' }}>📊 Platform Health</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {[
                                        { label: 'FIPS 203 Compliance', val: analytics ? Math.round(((analytics.totalScans - analytics.criticalScans) / Math.max(analytics.totalScans, 1)) * 100) : 0, color: 'var(--success)' },
                                        { label: 'Critical Risk Rate', val: analytics ? Math.round((analytics.criticalScans / Math.max(analytics.totalScans, 1)) * 100) : 0, color: 'var(--danger)' },
                                        { label: 'System Uptime', val: 99, color: 'var(--accent)' },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>{item.label}</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: item.color }}>{item.val}%</span>
                                            </div>
                                            <div style={{ height: '7px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${item.val}%`, background: item.color, borderRadius: '10px' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── MANAGE USERS ─── */}
                {!loading && activeTab === 'users' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: 'white', margin: 0 }}>Registered Users & Organizations</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>{users.length} total accounts</span>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        {['#', 'Full Name / Org', 'Email', 'Role', 'User ID', 'Action'].map(h => (
                                            <th key={h} style={{ padding: '15px 20px', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No registered users yet. Ask users to register from the login page.</td></tr>
                                    ) : users.map((u, i) => (
                                        <tr key={u.UID} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '18px 20px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>{i + 1}</td>
                                            <td style={{ padding: '18px 20px', fontWeight: '700', color: 'white', fontSize: '0.9rem' }}>{u.FullName}</td>
                                            <td style={{ padding: '18px 20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.Email}</td>
                                            <td style={{ padding: '18px 20px' }}>
                                                <span style={{ fontSize: '0.65rem', padding: '4px 12px', borderRadius: '20px', background: `${getRoleColor(u.UserRole)}20`, color: getRoleColor(u.UserRole), fontWeight: '800', textTransform: 'uppercase' }}>
                                                    {u.UserRole}
                                                </span>
                                            </td>
                                            <td style={{ padding: '18px 20px', color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                                                #{u.UID}
                                            </td>
                                            <td style={{ padding: '18px 20px' }}>
                                                <button
                                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '800' }}
                                                    onClick={() => alert(`User ${u.FullName} flagged for review.`)}
                                                >
                                                    FLAG
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ─── GLOBAL SCANS ─── */}
                {!loading && activeTab === 'scans' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--glass-border)' }}>
                                <h3 style={{ color: 'white', margin: 0 }}>📡 Global Scan Monitor</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '5px' }}>All scans across all organizations and users</p>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        {['ID', 'File/Source', 'Status', 'Risk Score', 'Date'].map(h => (
                                            <th key={h} style={{ padding: '15px 20px', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No scans performed yet.</td></tr>
                                    ) : logs.map((log, i) => (
                                        <tr key={i} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '18px 20px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>#{log.ID}</td>
                                            <td style={{ padding: '18px 20px', fontWeight: '700', color: 'white', fontSize: '0.85rem' }}>{log.SourceName}</td>
                                            <td style={{ padding: '18px 20px' }}>
                                                <span style={{ fontSize: '0.65rem', padding: '4px 12px', borderRadius: '20px', background: log.Status === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: log.Status === 'CRITICAL' ? 'var(--danger)' : 'var(--success)', fontWeight: '900' }}>
                                                    {log.Status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '18px 20px', color: log.RiskScore > 50 ? 'var(--danger)' : 'var(--success)', fontWeight: '900', fontSize: '0.9rem' }}>
                                                {log.RiskScore}%
                                            </td>
                                            <td style={{ padding: '18px 20px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                                                {new Date(log.ScanDate).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ─── THREAT INTELLIGENCE ─── */}
                {!loading && activeTab === 'algorithms' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ padding: '30px', marginBottom: '25px' }}>
                            <h3 style={{ color: 'white', marginBottom: '25px' }}>🛡️ Most Frequently Detected Insecure Algorithms</h3>
                            {analytics?.topAlgorithms?.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    {analytics.topAlgorithms.map((algo, i) => (
                                        <div key={i} style={{ padding: '25px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--danger)', marginBottom: '8px' }}>{algo.occurrences}</div>
                                            <div style={{ fontWeight: '800', color: 'white', fontSize: '0.9rem', marginBottom: '5px' }}>{algo.AlgorithmName}</div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>OCCURRENCES DETECTED</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔬</div>
                                    <p>No vulnerability data yet. Scan code with vulnerable algorithms to populate intelligence.</p>
                                </div>
                            )}
                        </div>

                        <div className="glass-card" style={{ padding: '30px' }}>
                            <h3 style={{ color: 'white', marginBottom: '20px' }}>📋 PQC Migration Readiness Summary</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
                                {[
                                    { from: 'RSA-2048', to: 'CRYSTALS-Kyber-768', status: 'CRITICAL', nist: 'FIPS 203' },
                                    { from: 'MD5 / SHA-1', to: 'SHA-3-512', status: 'HIGH', nist: 'FIPS 202' },
                                    { from: 'ECDSA-P256', to: 'CRYSTALS-Dilithium', status: 'HIGH', nist: 'FIPS 204' },
                                    { from: 'DES / 3DES', to: 'AES-256-GCM', status: 'MEDIUM', nist: 'NIST SP 800-38D' },
                                    { from: 'SHA-256', to: 'SHA-3 / LMS', status: 'MEDIUM', nist: 'FIPS 202' },
                                    { from: 'RC4', to: 'ChaCha20-Poly1305', status: 'CRITICAL', nist: 'RFC 8439' },
                                ].map((m, i) => (
                                    <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.65rem', color: m.status === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)', fontWeight: '900', marginBottom: '10px' }}>{m.status} PRIORITY</div>
                                        <div style={{ fontWeight: '800', color: 'var(--danger)', fontSize: '0.85rem', textDecoration: 'line-through', marginBottom: '4px' }}>{m.from}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px' }}>↓ migrate to</div>
                                        <div style={{ fontWeight: '800', color: 'var(--success)', fontSize: '0.85rem' }}>{m.to}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>{m.nist}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── ACTIVITY LOGS ─── */}
                {!loading && activeTab === 'logs' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '25px 30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ color: 'white', margin: 0 }}>📄 Real-Time Activity Log</h3>
                                <button onClick={fetchAll} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800' }}>
                                    ↻ REFRESH
                                </button>
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                {logs.length === 0 ? (
                                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>No activity recorded yet.</div>
                                ) : logs.map((log, i) => (
                                    <div key={i} style={{ padding: '16px 30px', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: log.Status === 'CRITICAL' ? 'var(--danger)' : 'var(--success)', flexShrink: 0, boxShadow: `0 0 6px ${log.Status === 'CRITICAL' ? 'var(--danger)' : 'var(--success)'}` }}></div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', width: '80px', flexShrink: 0 }}>#{log.ID}</div>
                                        <div style={{ flex: 1, fontWeight: '700', color: 'white', fontSize: '0.85rem' }}>{log.SourceName}</div>
                                        <span style={{ fontSize: '0.65rem', padding: '3px 10px', borderRadius: '20px', background: log.Status === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: log.Status === 'CRITICAL' ? 'var(--danger)' : 'var(--success)', fontWeight: '900', flexShrink: 0 }}>
                                            {log.Status}
                                        </span>
                                        <div style={{ color: log.RiskScore > 50 ? 'var(--danger)' : 'var(--success)', fontWeight: '900', fontSize: '0.85rem', width: '60px', textAlign: 'right', flexShrink: 0 }}>
                                            {log.RiskScore}%
                                        </div>
                                        <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', width: '130px', textAlign: 'right', flexShrink: 0 }}>
                                            {new Date(log.ScanDate).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── NOTIFICATIONS ─── */}
                {!loading && activeTab === 'notifications' && (
                    <div className="animate-fade-in">
                        <div className="glass-card" style={{ padding: '40px', maxWidth: '700px' }}>
                            <h3 style={{ color: 'white', marginBottom: '10px' }}>📡 Broadcast System Notification</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '30px' }}>
                                Send a security alert or announcement to all Organization users on the platform.
                            </p>
                            <textarea
                                className="cyber-input"
                                placeholder="Type your notification message here... e.g. 'Critical RSA vulnerability detected in multiple organization scans. Immediate PQC migration recommended.'"
                                value={notification}
                                onChange={(e) => setNotification(e.target.value)}
                                style={{ width: '100%', height: '160px', resize: 'none', marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                            />
                            {broadcastStatus === 'success' && (
                                <div style={{ marginBottom: '15px', padding: '12px 20px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', borderRadius: '8px', color: 'var(--success)', fontWeight: '800', fontSize: '0.85rem' }}>
                                    ✅ Notification broadcast successfully to all Organization users!
                                </div>
                            )}
                            {broadcastStatus === 'error' && (
                                <div style={{ marginBottom: '15px', padding: '12px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', fontWeight: '800', fontSize: '0.85rem' }}>
                                    ❌ Failed to send notification. Check server connection.
                                </div>
                            )}
                            <button
                                className="cyber-btn cyber-btn-primary"
                                onClick={sendNotification}
                                disabled={isBroadcasting || !notification.trim()}
                                style={{ width: '100%', padding: '15px', justifyContent: 'center', fontSize: '0.9rem', opacity: isBroadcasting || !notification.trim() ? 0.6 : 1 }}
                            >
                                {isBroadcasting ? '⏳ BROADCASTING...' : '📡 BROADCAST TO ALL USERS'}
                            </button>
                        </div>

                        <RecentBroadcasts />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
