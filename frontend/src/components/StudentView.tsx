import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';
import StudentIDE from './StudentIDE';
import MisconceptionPanel from './MisconceptionPanel';
import SocraticTutor from './SocraticTutor';
import MicroChallenges from './MicroChallenges';
import MasteryDashboard from './MasteryDashboard';
import { Brain, Sparkles, ArrowRight } from 'lucide-react';

// ─── Pipeline step indicator ──────────────────────────────────────────────────
function PipelineIndicator() {
  const { demoPhase } = useApp();

  const steps = [
    { id: 'ide', label: 'IDE' },
    { id: 'detecting', label: 'Analyze' },
    { id: 'detected', label: 'Detect' },
    { id: 'tutoring', label: 'Tutor' },
    { id: 'challenges', label: 'Practice' },
    { id: 'resolved', label: 'Mastery' },
  ];

  const activeIdx = steps.findIndex((s) => s.id === demoPhase);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 14px',
        background: 'rgba(10,12,30,0.5)',
        border: '1px solid rgba(45,212,191,0.1)',
        borderRadius: 40,
        marginBottom: 16,
        width: 'fit-content',
        alignSelf: 'center',
      }}
    >
      {steps.map((step, i) => {
        const isDone = i < activeIdx;
        const isActive = i === activeIdx;
        return (
          <React.Fragment key={step.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 10px',
                borderRadius: 20,
                background: isActive
                  ? 'rgba(45,212,191,0.18)'
                  : isDone
                  ? 'rgba(45,212,191,0.06)'
                  : 'transparent',
                transition: 'all 0.3s',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isActive ? '#2dd4bf' : isDone ? '#2dd4bf66' : '#1e293b',
                  boxShadow: isActive ? '0 0 6px #2dd4bf' : 'none',
                  transition: 'all 0.3s',
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#2dd4bf' : isDone ? '#2dd4bf66' : '#334155',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  transition: 'all 0.3s',
                }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight size={10} color={i < activeIdx ? '#2dd4bf44' : '#1e293b'} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Hero banner (only on first load) ────────────────────────────────────────
function HeroBanner() {
  const { demoPhase } = useApp();
  if (demoPhase !== 'ide') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        padding: '12px 20px',
        marginBottom: 16,
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(13,15,43,0.95), rgba(26,31,82,0.8))',
        border: '1px solid rgba(45,212,191,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 4px 24px rgba(45,212,191,0.08)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #2dd4bf22, #8b5cf622)',
          border: '1px solid rgba(45,212,191,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Sparkles size={20} color="#2dd4bf" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#e2e8f0', marginBottom: 2 }}>
          Traditional platforms: Error → Correct Code &nbsp;
          <span style={{ color: '#fb7185' }}>✗</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 800 }} className="gradient-text">
          CodeMind AI: Error → Question → Reflection → Understanding ✓
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          fontStyle: 'italic',
          color: '#64748b',
          borderLeft: '1px solid rgba(45,212,191,0.15)',
          paddingLeft: 14,
          maxWidth: 220,
          lineHeight: 1.4,
        }}
      >
        "We don't fix your code.<br />We fix your understanding."
      </div>
    </motion.div>
  );
}

// ─── Main Student View Layout ─────────────────────────────────────────────────
export default function StudentView() {
  const { demoPhase } = useApp();

  const showRightPanel =
    demoPhase === 'detected' ||
    demoPhase === 'detecting' ||
    demoPhase === 'tutoring' ||
    demoPhase === 'challenges' ||
    demoPhase === 'resolved';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px 20px',
        gap: 0,
      }}
    >
      <HeroBanner />
      <PipelineIndicator />

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: showRightPanel ? '1fr 420px' : '1fr',
          gap: 16,
          minHeight: 0,
        }}
      >
        {/* Left: IDE + Mastery Dashboard */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: showRightPanel ? '1fr 280px' : '1fr 320px',
            gap: 16,
            minHeight: 0,
          }}
        >
          <StudentIDE />
          <MasteryDashboard />
        </div>

        {/* Right: Detection → Tutor → Challenges */}
        <AnimatePresence>
          {showRightPanel && (
            <motion.div
              key="right-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                minHeight: 0,
                overflowY: 'auto',
              }}
            >
              <AnimatePresence mode="wait">
                {(demoPhase === 'detecting' || demoPhase === 'detected') && (
                  <MisconceptionPanel key="misconception" />
                )}
                {(demoPhase === 'tutoring') && (
                  <>
                    <MisconceptionPanel key="misconception-sm" />
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <SocraticTutor key="tutor" />
                    </div>
                  </>
                )}
                {(demoPhase === 'challenges' || demoPhase === 'resolved') && (
                  <MicroChallenges key="challenges" />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
