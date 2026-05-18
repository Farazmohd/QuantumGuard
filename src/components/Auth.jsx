import React, { useState } from 'react';

const Auth = ({ onBack, onLogin, toggleTheme }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [role, setRole] = useState('org');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { id: 'admin', label: 'Admin Portal', desc: 'Platform management and monitoring.', color: '#6366f1' },
        { id: 'org', label: 'Organization', desc: 'Secure quantum scanning for business.', color: '#a855f7' },
        { id: 'researcher', label: 'Researcher', desc: 'Educational tools and PQC research.', color: '#06b6d4' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isRegister ? '/api/register' : '/api/login';
        const payload = isRegister
            ? { fullName, email, password, role }
            : { email, password, role };

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            if (isRegister) {
                // After registration, switch to login
                setIsRegister(false);
                alert('Registration successful! Please login to authorized your terminal.');
            } else {
                // Successful Login
                onLogin(data.user.role, data.user);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} className="animate-fade-in">
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '50px', position: 'relative' }}>
                <button onClick={onBack} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '800' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    BACK
                </button>
                <button className="theme-toggle-btn" onClick={toggleTheme} style={{ position: 'absolute', top: '20px', right: '20px', width: '35px', height: '35px', fontSize: '0.9rem' }} title="Toggle Theme">
                    🌙
                </button>

                <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
                    <div className="logo" style={{ fontSize: '1.2rem', justifyContent: 'center', marginBottom: '10px' }}>QUANTUM<span>GUARD</span></div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{isRegister ? 'Create Secure Network Identity' : 'Secure Multi-Role Access Gateway'}</p>
                </div>

                {/* Role Selector */}
                {!isRegister && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                        {roles.map(r => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                style={{
                                    flex: 1,
                                    padding: '14px 5px',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    borderRadius: '8px',
                                    border: role === r.id ? `1px solid ${r.color}` : '1px solid rgba(148, 163, 184, 0.2)',
                                    background: role === r.id ? r.color : 'rgba(255, 255, 255, 0.08)',
                                    color: role === r.id ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    boxShadow: role === r.id ? `0 0 20px ${r.color}50` : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (role !== r.id) {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                                        e.target.style.color = 'white';
                                        e.target.style.borderColor = 'rgba(148, 163, 184, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (role !== r.id) {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                                        e.target.style.color = 'var(--text-muted)';
                                        e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                                    }
                                }}
                            >
                                {r.id === 'org' ? 'ORG' : r.id.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}

                {error && (
                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', fontSize: '0.8rem', borderRadius: '8px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
                        {error.toUpperCase()}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {isRegister && (
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name / Organization</label>
                            <input
                                type="text"
                                placeholder="Enter your identity"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                style={{ width: '100%', padding: '14px 16px', background: 'rgba(15, 20, 28, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s ease' }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(15, 20, 28, 0.95)'; e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.2)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(15, 20, 28, 0.8)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    )}

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Terminal Identifier (Email)</label>
                        <input
                            type="email"
                            placeholder="user@quantumguard.sh"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '14px 16px', background: 'rgba(15, 20, 28, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s ease' }}
                            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(15, 20, 28, 0.95)'; e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.2)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(15, 20, 28, 0.8)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Security Key (Password)</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '14px 16px', background: 'rgba(15, 20, 28, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s ease' }}
                            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(15, 20, 28, 0.95)'; e.target.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.2)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.background = 'rgba(15, 20, 28, 0.8)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    {isRegister && (
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Authorization Role</label>
                            <select
                                className="cyber-input"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ width: '100%', background: '#0a0b10', color: 'white' }}
                            >
                                <option value="org">Organization (Business Auditor)</option>
                                <option value="researcher">Researcher (Academic Portal)</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="cyber-btn cyber-btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '15px', justifyContent: 'center', marginTop: '10px' }}
                    >
                        {loading ? (
                            <div style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', width: '20px', height: '20px', borderRadius: '50%' }} className="animate-spin"></div>
                        ) : (isRegister ? 'CREATE ACCOUNT' : `AUTHORIZE ${role.toUpperCase()}`)}
                    </button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {isRegister ? 'Already have an identity?' : 'New organization?'}
                        <span
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError('');
                            }}
                            style={{ color: 'var(--accent)', cursor: 'pointer', marginLeft: '8px', fontWeight: '700' }}
                        >
                            {isRegister ? 'Login to Terminal' : 'Register Secure Instance'}
                        </span>
                    </p>
                </div>

                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '10px', height: '10px', background: roles.find(r => r.id === role).color, borderRadius: '50%' }}></div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        ACTIVE PORTAL: {roles.find(r => r.id === role).label}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
