import React, { useState, useEffect } from 'react';

const scanSteps = [
    "Loading system for analysis...",
    "Scanning source code & configurations...",
    "Detecting cryptographic algorithms...",
    "Identifying quantum-vulnerable components...",
    "Fetching analysis data...",
    "Generating risk level...",
    "Mapping to Post-Quantum algorithms...",
    "Simulating migration performance...",
    "Creating visual reports...",
    "Preparing dashboard..."
];

const Scanner = ({ onScanComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (currentStep < scanSteps.length) {
            const timer = setTimeout(() => {
                setCompletedSteps(prev => [...prev, currentStep]);
                setCurrentStep(prev => prev + 1);
                setProgress(((currentStep + 1) / scanSteps.length) * 100);
            }, 800 + Math.random() * 1000);

            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                onScanComplete();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, onScanComplete]);

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '800px' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: 'var(--spacing-xl)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                    Security Audit in Progress
                </h2>

                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>System Integrity Scan</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary-color)' }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'var(--bg-accent)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, var(--primary-color), var(--accent-purple))',
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {scanSteps.map((step, index) => {
                        const isCompleted = completedSteps.includes(index);
                        const isCurrent = currentStep === index;

                        return (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: isCurrent ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                transition: 'all 0.3s ease',
                                opacity: isCompleted || isCurrent ? 1 : 0.3
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isCompleted ? 'var(--accent-success)' : (isCurrent ? 'var(--primary-color)' : 'var(--bg-accent)'),
                                    color: 'white',
                                    fontSize: '0.75rem'
                                }}>
                                    {isCompleted ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    ) : (
                                        isCurrent ? <div className="animate-spin" style={{ width: '12px', height: '12px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div> : index + 1
                                    )}
                                </div>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: isCurrent ? '700' : '500',
                                    color: isCurrent ? 'var(--primary-color)' : 'var(--text-primary)'
                                }}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Scanner;
