import React, { useState, useEffect } from 'react';

const History = ({ onBack }) => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/scans')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch history');
                return res.json();
            })
            .then(data => {
                setScans(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container animate-fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '1000px' }}>
            <div className="glass-panel" style={{ padding: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>Scan History</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Review all past cryptographic audit results from the MSSQL database.</p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={onBack}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to Home
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                        <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Querying Database...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <h3 style={{ color: 'var(--accent-danger)', fontWeight: '800' }}>Backend Unreachable</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Please ensure your Node.js server is running on port 5000.</p>
                    </div>
                ) : scans.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--bg-accent)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontWeight: '600', color: 'var(--text-light)' }}>No scan records found in the database.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--bg-accent)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Type</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Source Name</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Risk</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Readiness</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-light)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scans.map((scan) => (
                                    <tr key={scan.ID} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: '800',
                                                padding: '4px 10px',
                                                borderRadius: 'var(--radius-full)',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                color: 'var(--primary-color)',
                                                textTransform: 'uppercase'
                                            }}>
                                                {scan.SourceType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{scan.SourceName}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ fontWeight: '800', color: 'var(--accent-danger)' }}>{scan.RiskScore > 70 ? 'HIGH' : 'MEDIUM'}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '40px', height: '4px', background: 'var(--bg-accent)', borderRadius: '2px' }}>
                                                    <div style={{ width: `${scan.ReadinessScore}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '2px' }}></div>
                                                </div>
                                                <span style={{ fontWeight: '700' }}>{scan.ReadinessScore}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                            {new Date(scan.ScanDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
