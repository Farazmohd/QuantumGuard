# Implementation Plan - Post-Quantum Cryptography Migration Tool

## Phase 1: Project Setup & Foundation
- [x] Initialize React project with Vite.
- [ ] Clean up default boilerplate (remove `App.css`, specific assets).
- [ ] Create core directory structure: `components`, `hooks`, `data`.
- [ ] Define global styles in `index.css`:
    - **Variables**: `--bg-gradient-start`, `--bg-gradient-end`, `--card-bg`, `--text-primary`, `--accent-blue`, `--accent-purple`, `--glass-bg`, `--glass-border`.
    - **Fonts**: Import 'Inter' for modern typography.
    - **Utilities**: Flexbox, Grid, Animations (scanlines, loader).

## Phase 2: Core Components Development
### 1. Hero Section (Page 1)
- **Component**: `Hero.jsx`
- **Features**:
    - Animated gradient background.
    - Glassmorphism card effect for the main content.
    - "Start Free Scan" button triggers state transition to scanning mode.
    - "View Details" button (scrolldown or modal).

### 2. Scanning Simulation (Page 2)
- **Component**: `Scanner.jsx`
- **Logic**:
    - `useState` to track current step (0-10).
    - `useEffect` with `setTimeout` to progress through steps.
    - Simulated delay for "complex" steps (e.g., "Analysing cryptographic primitives...").
- **UI**:
    - Progress bar/stepper.
    - Terminal-like log output for each step.
    - Animated loader (e.g., spinning grid or radar).

### 3. Results Dashboard (Page 3)
- **Component**: `Dashboard.jsx`
- **Features**:
    - **Risk Card**: Displays "HIGH" risk with red/orange indicator.
    - **Vulnerable Algorithms**: List of detected weak algorithms (RSA, ECC).
    - **Migration Recommendations**: List of PQC alternatives (Kyber, Dilithium).
    - **Readiness Score**: Progress bar calculation based on mock data.
    - **Charts**: Placeholder visual components using CSS-only bars/circles or simple SVG.
    - **Actions**: "Download Report" (simulated download), "Run Another Scan" (reset state).

## Phase 3: State Management & Integration
- **Main App (`App.jsx`)**:
    - `view` state: `'hero'` | `'scanning'` | `'dashboard'`.
    - Transition functions: `startScan()`, `finishScan()`, `resetScan()`.
    - Conditional rendering of pages based on `view`.

## Phase 4: Polish & Refinement
- Add hover effects to cards and buttons.
- Ensure responsive layout for mobile/tablet.
- Fine-tune animations for a "premium" feel.
