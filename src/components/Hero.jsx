import React from 'react';

const Hero = ({ onStartScan, onViewDetails }) => {
    return (
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '85vh',
            textAlign: 'center'
        }}>
            <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '0.5rem 1rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--primary-color)',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    marginBottom: 'var(--spacing-md)',
                    border: '1px solid rgba(16, 185, 129, 0.14)'
                }}>
                    NEW: NIST Post-Quantum Standards Integration
                </div>

                <h1 style={{
                    fontSize: '4.5rem',
                    fontWeight: '900',
                    marginBottom: 'var(--spacing-md)',
                    letterSpacing: '-0.04em',
                    lineHeight: '1.05',
                    color: 'var(--text-primary)'
                }}>
                    Prove Your <span className="text-gradient">Quantum Readiness</span>
                </h1>

                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.5rem',
                    marginBottom: 'var(--spacing-xl)',
                    lineHeight: '1.5',
                    maxWidth: '800px',
                    margin: '0 auto var(--spacing-xl)'
                }}>
                    The only platform that analyzes your cryptographic systems and prepares them for the post-quantum era.
                </p>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={onStartScan} style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', borderRadius: 'var(--radius-md)' }}>
                        Start Free Scan
                    </button>
                    <button className="btn btn-secondary" onClick={onViewDetails} style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        View Details
                    </button>
                </div>

                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'var(--spacing-lg)',
                    color: 'var(--text-light)',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Quantum-Safe Analysis
                    </span>
                    <span style={{ height: '20px', width: '1px', background: 'var(--bg-accent)' }}></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Automated Migration Guidance
                    </span>
                    <span style={{ height: '20px', width: '1px', background: 'var(--bg-accent)' }}></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Future-Proof Security
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Hero;
