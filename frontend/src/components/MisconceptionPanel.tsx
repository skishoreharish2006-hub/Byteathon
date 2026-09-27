import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Activity,
  GitBranch,
  Repeat,
  Cpu,
  Radar,
  ChevronRight,
  Brain,
  Loader2,
} from 'lucide-react';
import { useApp } from '../AppContext';

// ─── Signal Row ───────────────────────────────────────────────────────────────
function SignalRow({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 10,
        background: 'rgba(10,12,30,0.6)',
        border: `1px solid ${color}22`,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: `${color}18`,
          border: `1px solid ${color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>{value}</div>
      </div>
    </motion.div>
  );
}

// ─── Confidence Meter ─────────────────────────────────────────────────────────
function ConfidenceMeter({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const pct = level === 'Low' ? 30 : level === 'Medium' ? 65 : 88;
  const color = level === 'Low' ? '#64748b' : level === 'Medium' ? '#fbbf24' : '#2dd4bf';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Confidence
        </span>
        <span style={{ fontSize: 14, fontWeight: 800, color }}>
          {pct}% — {level}
        </span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${color}aa, ${color})` }}
        />
      </div>
    </div>
  );
}

// ─── Analyzing overlay ────────────────────────────────────────────────────────
function AnalyzingOverlay() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '2px solid rgba(45,212,191,0.2)',
          borderTopColor: '#2dd4bf',
          animation: 'spin 1s linear infinite',
          boxShadow: '0 0 20px rgba(45,212,191,0.2)',
        }}
      />
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
          Analyzing behavioral patterns{'.'.repeat(dots)}
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          Cross-referencing error sequences, AST patterns & concept graph
        </div>
      </div>

      {/* Fake analysis steps */}
      {['Extracting error signatures', 'Matching recurring code patterns', 'Querying concept dependency graph', 'Estimating confidence level'].map(
        (step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: '#2dd4bf',
              fontFamily: 'JetBrains Mono',
            }}
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#2dd4bf' }}
            />
            {step}
          </motion.div>
        )
      )}
    </motion.div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function MisconceptionPanel() {
  const { demoPhase, activeScenario, setDemoPhase, hintIndex } = useApp();

  if (demoPhase === 'ide') return null;

  const { signalSummary, misconceptionLabel, misconceptionCategory } = activeScenario;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass evidence-card"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(251,191,36,0.2)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(251,191,36,0.07)',
          borderBottom: '1px solid rgba(251,191,36,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Radar size={16} color="#fbbf24" />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24', letterSpacing: '0.04em' }}>
            Misconception Detection Engine
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            Behavioral pattern analysis • {signalSummary.errorFrequency} attempts correlated
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <AnimatePresence mode="wait">
          {demoPhase === 'detecting' ? (
            <AnalyzingOverlay key="analyzing" />
          ) : (
            <motion.div
              key="detected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {/* Misconception candidate */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,113,133,0.06))',
                  border: '1px solid rgba(251,191,36,0.3)',
                }}
              >
                <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  Misconception Candidate
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fef3c7', marginBottom: 2 }}>
                  {misconceptionLabel}
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{misconceptionCategory}</div>
              </motion.div>

              {/* Confidence */}
              <ConfidenceMeter level={signalSummary.confidence} />

              {/* Signal evidence */}
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Evidence Signals
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <SignalRow
                  icon={Repeat}
                  label="Error Frequency"
                  value={`${signalSummary.errorFrequency} identical error type across attempts`}
                  color="#fb7185"
                  delay={0.1}
                />
                <SignalRow
                  icon={AlertTriangle}
                  label="Error Type"
                  value={signalSummary.errorType}
                  color="#fbbf24"
                  delay={0.2}
                />
                <SignalRow
                  icon={GitBranch}
                  label="Recurring Pattern"
                  value={signalSummary.recurringPattern}
                  color="#a78bfa"
                  delay={0.3}
                />
                <SignalRow
                  icon={Activity}
                  label="Debugging Attempts"
                  value={`${signalSummary.debuggingAttempts} attempts — escalating pattern`}
                  color="#38bdf8"
                  delay={0.4}
                />
              </div>

              {/* Note */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(45,212,191,0.06)',
                  border: '1px solid rgba(45,212,191,0.15)',
                  fontSize: 11,
                  color: '#64748b',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                }}
              >
                ℹ️ Candidate confirmed after{' '}
                <span style={{ color: '#2dd4bf', fontWeight: 700 }}>
                  {signalSummary.errorFrequency}+ similar errors
                </span>
                {' '}— single errors are never flagged.
              </div>

              {/* CTA */}
              {demoPhase === 'detected' && hintIndex === 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onClick={() => setDemoPhase('tutoring')}
                >
                  <Brain size={14} />
                  Start Socratic Session
                  <ChevronRight size={14} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
