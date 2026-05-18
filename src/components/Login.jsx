import React, { useState } from 'react';

const Login = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login delay
        setTimeout(() => {
            setLoading(false);
            alert('Console Access Granted. Redirecting to secure terminal...');
            onBack();
        }, 1500);
    };

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="glass-panel" style={{ padding: 'var(--spacing-xl)', maxWidth: '450px', width: '100%', boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-md)',
                        boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>Security Login</h1>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Enter your credentials to access the QSafe migration console.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '6px' }}>Terminal ID / Email</label>
                        <input
                            type="email"
                            placeholder="admin@qsafe.security"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '6px' }}>Secure Passkey</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ padding: '14px', fontSize: '1rem', marginTop: 'var(--spacing-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        {loading ? (
                            <div className="animate-spin" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div>
                        ) : 'Authenticate Request'}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onBack}
                        style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.875rem' }}
                    >
                        Return to Gateway
                    </button>
                </form>

                <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '500' }}>
                        Protected by <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Post-Quantum Hybrid Encryption</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
