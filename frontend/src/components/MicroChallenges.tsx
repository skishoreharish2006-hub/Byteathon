import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Target,
  Code2,
  CheckCircle,
  XCircle,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { useApp } from '../AppContext';
import { Challenge } from '../mockData';

const tierConfig = {
  Basic: {
    color: '#38bdf8',
    icon: Zap,
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.25)',
    label: 'Recall',
  },
  Application: {
    color: '#a78bfa',
    icon: Target,
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
    label: 'Find the Bug',
  },
  Transfer: {
    color: '#2dd4bf',
    icon: Code2,
    bg: 'rgba(45,212,191,0.08)',
    border: 'rgba(45,212,191,0.25)',
    label: 'Write It Yourself',
  },
};

// ─── Single Challenge Card ────────────────────────────────────────────────────
function ChallengeCard({
  challenge,
  onSuccess,
}: {
  challenge: Challenge;
  onSuccess: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const cfg = tierConfig[challenge.tier];
  const Icon = cfg.icon;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === challenge.correctIndex) {
      setTimeout(onSuccess, 1200);
    }
  };

  const isCorrect = submitted && selected === challenge.correctIndex;
  const isWrong = submitted && selected !== challenge.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${cfg.border}`,
        background: cfg.bg,
      }}
    >
      {/* Tier badge */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: `1px solid ${cfg.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={14} color={cfg.color} />
        </div>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: cfg.color,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {challenge.tier}
            </span>
            <span style={{ fontSize: 10, color: '#475569' }}>—</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{cfg.label}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
            {challenge.title}
          </div>
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
          {challenge.description}
        </p>

        {/* Code snippet (if any) */}
        {challenge.code && (
          <pre
            style={{
              margin: 0,
              padding: '10px 14px',
              background: '#0d0f1e',
              border: '1px solid rgba(45,212,191,0.12)',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
              color: '#e2e8f0',
              lineHeight: 1.6,
              overflow: 'auto',
            }}
          >
            {challenge.code}
          </pre>
        )}

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {challenge.options?.map((opt, i) => {
            const isSelected = selected === i;
            const showCorrect = submitted && i === challenge.correctIndex;
            const showWrong = submitted && isSelected && i !== challenge.correctIndex;

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `1px solid ${
                    showCorrect
                      ? 'rgba(34,197,94,0.6)'
                      : showWrong
                      ? 'rgba(251,113,133,0.6)'
                      : isSelected
                      ? `${cfg.color}66`
                      : 'rgba(37,43,110,0.8)'
                  }`,
                  background: showCorrect
                    ? 'rgba(34,197,94,0.1)'
                    : showWrong
                    ? 'rgba(251,113,133,0.1)'
                    : isSelected
                    ? `${cfg.color}14`
                    : 'rgba(10,12,30,0.5)',
                  cursor: submitted ? 'default' : 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `2px solid ${
                      showCorrect ? '#22c55e' : showWrong ? '#fb7185' : isSelected ? cfg.color : '#334155'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {showCorrect ? (
                    <CheckCircle size={10} color="#22c55e" />
                  ) : showWrong ? (
                    <XCircle size={10} color="#fb7185" />
                  ) : isSelected ? (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: cfg.color,
                      }}
                    />
                  ) : null}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: showCorrect ? '#86efac' : showWrong ? '#fca5a5' : '#cbd5e1',
                    fontWeight: isSelected || showCorrect ? 600 : 400,
                  }}
                >
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Submit / Result */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.button
              key="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="btn-primary"
              onClick={handleSubmit}
              disabled={selected === null}
              style={{
                opacity: selected === null ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              Check Answer <ChevronRight size={13} />
            </motion.button>
          ) : isCorrect ? (
            <motion.div
              key="correct"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <CheckCircle size={16} color="#22c55e" />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#86efac' }}>Correct!</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                {challenge.successMessage}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="wrong"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(251,113,133,0.08)',
                border: '1px solid rgba(251,113,133,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 12, color: '#fca5a5' }}>
                Not quite — look at the options again.
              </div>
              <button
                className="btn-secondary"
                style={{ fontSize: 12, padding: '6px 14px' }}
                onClick={() => { setSelected(null); setSubmitted(false); }}
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MicroChallenges() {
  const { demoPhase, activeScenario, currentChallengeIndex, advanceChallenge } = useApp();

  if (demoPhase !== 'challenges' && demoPhase !== 'resolved') return null;

  const challenges = activeScenario.challenges;
  const allDone = demoPhase === 'resolved';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(45,212,191,0.15)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(45,212,191,0.06)',
          borderBottom: '1px solid rgba(45,212,191,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Trophy size={18} color="#2dd4bf" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>
            Micro-Challenge Set
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            {activeScenario.misconceptionLabel} • 3-tier adaptive practice
          </div>
        </div>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {challenges.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background:
                  i < currentChallengeIndex || allDone
                    ? '#2dd4bf'
                    : i === currentChallengeIndex && !allDone
                    ? 'rgba(45,212,191,0.4)'
                    : 'rgba(37,43,110,0.8)',
                border: i === currentChallengeIndex && !allDone ? '1px solid #2dd4bf' : 'none',
                transition: 'all 0.4s',
                boxShadow: i < currentChallengeIndex || allDone ? '0 0 6px #2dd4bf' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Show completed challenges */}
        {challenges.slice(0, currentChallengeIndex).map((c) => (
          <div
            key={c.id}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(34,197,94,0.05)',
              border: '1px solid rgba(34,197,94,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <CheckCircle size={16} color="#22c55e" />
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              {c.tier}: {c.title} — Completed
            </span>
          </div>
        ))}

        {/* Active challenge */}
        {!allDone && currentChallengeIndex < challenges.length && (
          <ChallengeCard
            key={currentChallengeIndex}
            challenge={challenges[currentChallengeIndex]}
            onSuccess={advanceChallenge}
          />
        )}

        {/* All done */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: 20,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(45,212,191,0.12), rgba(167,139,250,0.08))',
              border: '1px solid rgba(45,212,191,0.3)',
              textAlign: 'center',
            }}
          >
            <Trophy size={32} color="#2dd4bf" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>
              All Challenges Completed!
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Knowledge graph is updating… check your mastery dashboard.
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
