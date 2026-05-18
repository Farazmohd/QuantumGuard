import React from 'react';

const InfoPage = ({ title, description, content, onBack }) => {
    return (
        <div className="container animate-fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '900px' }}>
            <div className="glass-panel" style={{ padding: 'var(--spacing-xl)' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-color)',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: 'var(--spacing-md)'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Scanner
                </button>

                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: 'var(--spacing-sm)' }}>{title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)' }}>
                    {description}
                </p>

                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    {content.map((item, index) => (
                        <div key={index} style={{
                            padding: 'var(--spacing-lg)',
                            background: 'rgba(255,255,255,0.5)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <h3 style={{ fontWeight: '800', marginBottom: '8px', color: 'var(--primary-color)' }}>{item.subtitle}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
