import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../AppContext';
import { HintStep } from '../mockData';

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '12px 16px' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ─── Chat Bubble (Tutor) ──────────────────────────────────────────────────────
function TutorBubble({ hint, isNew }: { hint: HintStep; isNew: boolean }) {
  const hintColors = {
    question: { border: '#a78bfa', icon: '🤔', accent: '#a78bfa' },
    narrow: { border: '#38bdf8', icon: '💡', accent: '#38bdf8' },
    guidance: { border: '#2dd4bf', icon: '🔍', accent: '#2dd4bf' },
    resolution: { border: '#22c55e', icon: '✨', accent: '#22c55e' },
  };
  const cfg = hintColors[hint.type];

  // strip emoji from start (already embedded in text)
  const rawText = hint.text.replace(/^[^\w\s]*\s*/, '');

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 16, scale: 0.97 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: `linear-gradient(135deg, #1a1f52, #252b6e)`,
          border: `2px solid ${cfg.border}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 10px ${cfg.border}22`,
        }}
      >
        <Bot size={16} color={cfg.accent} />
      </div>

      {/* Bubble */}
      <div
        style={{
          flex: 1,
          padding: '12px 14px',
          borderRadius: '4px 16px 16px 16px',
          background: `linear-gradient(135deg, rgba(26,31,82,0.9), rgba(37,43,110,0.7))`,
          border: `1px solid ${cfg.border}33`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 12 }}>{cfg.icon}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: cfg.accent,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            CodeMind Tutor •{' '}
            {hint.type === 'question'
              ? 'Guiding Question'
              : hint.type === 'narrow'
              ? 'Narrowing Focus'
              : hint.type === 'guidance'
              ? 'Direct Guidance'
              : 'Understanding Confirmed'}
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>
          {hint.text.replace(/^[🤔💡🔍✨]\s*/, '')}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: '#334155',
            fontFamily: 'JetBrains Mono',
          }}
        >
          Hint {hint.id} of {hint.type === 'resolution' ? hint.id : '3+'} — no corrected code shared
        </div>
      </div>
    </motion.div>
  );
}

// ─── Student Response Bubble ──────────────────────────────────────────────────
function StudentBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: 'row-reverse' }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: 'rgba(45,212,191,0.15)',
          border: '1px solid rgba(45,212,191,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <User size={14} color="#2dd4bf" />
      </div>
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '16px 4px 16px 16px',
          background: 'rgba(45,212,191,0.1)',
          border: '1px solid rgba(45,212,191,0.2)',
          fontSize: 12,
          color: '#94a3b8',
          maxWidth: '75%',
          fontStyle: 'italic',
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}

// ─── Main Tutor Panel ─────────────────────────────────────────────────────────
export default function SocraticTutor() {
  const { demoPhase, activeScenario, hintIndex, advanceHint, setDemoPhase } = useApp();
  const [isTyping, setIsTyping] = useState(false);
  const [shownHints, setShownHints] = useState<number[]>([]);
  const [studentReplies, setStudentReplies] = useState<{ afterHint: number; text: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const studentResponses = [
    "I ran it again but still getting the same error...",
    "I think I see what you mean — starting from 0? Let me try...",
    "Oh! Index 4 gives me the last one. That makes sense now.",
  ];

  // Show first hint when tutoring starts
  useEffect(() => {
    if (demoPhase === 'tutoring' && shownHints.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setShownHints([0]);
      }, 1500);
    }
  }, [demoPhase]);

  // Auto-scroll
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [shownHints, studentReplies, isTyping]);

  const handleTryAgain = () => {
    const currentStudentReplyIdx = shownHints.length - 1;
    // Add student reply
    setStudentReplies((prev) => [
      ...prev,
      { afterHint: shownHints[shownHints.length - 1], text: studentResponses[currentStudentReplyIdx] },
    ]);

    // Advance hint
    const nextHintIdx = shownHints.length;
    if (nextHintIdx < activeScenario.hints.length) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setShownHints((prev) => [...prev, nextHintIdx]);
        advanceHint();
      }, 1400);
    }
  };

  if (demoPhase === 'ide' || demoPhase === 'detecting' || demoPhase === 'detected') return null;

  const isResolved =
    shownHints.includes(activeScenario.hints.length - 1) &&
    studentReplies.length >= activeScenario.hints.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(167,139,250,0.2)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(167,139,250,0.07)',
          borderBottom: '1px solid rgba(167,139,250,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1f52, #252b6e)',
            border: '2px solid rgba(167,139,250,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(167,139,250,0.25)',
          }}
        >
          <Bot size={18} color="#a78bfa" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>
            CodeMind Tutor
          </div>
          <div style={{ fontSize: 10, color: '#64748b' }}>
            Socratic guidance • No code corrections shared
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 20,
            background: 'rgba(167,139,250,0.12)',
            border: '1px solid rgba(167,139,250,0.25)',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#a78bfa',
              boxShadow: '0 0 6px #a78bfa',
            }}
          />
          <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700 }}>Live</span>
        </div>
      </div>

      {/* Misconception context */}
      <div
        style={{
          padding: '8px 16px',
          background: 'rgba(251,191,36,0.05)',
          borderBottom: '1px solid rgba(251,191,36,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Lightbulb size={12} color="#fbbf24" />
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          Addressing:{' '}
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>
            {activeScenario.misconceptionLabel}
          </span>
        </span>
      </div>

      {/* Chat messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Render interleaved hints and student replies */}
        {shownHints.map((hintIdx, i) => (
          <React.Fragment key={`hint-${hintIdx}`}>
            <TutorBubble
              hint={activeScenario.hints[hintIdx]}
              isNew={i === shownHints.length - 1 && !isTyping}
            />
            {/* Student reply after this hint (if exists) */}
            {studentReplies.find((r) => r.afterHint === hintIdx) && (
              <StudentBubble
                text={studentReplies.find((r) => r.afterHint === hintIdx)!.text}
              />
            )}
          </React.Fragment>
        ))}

        {isTyping && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Action footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(167,139,250,0.12)',
          background: 'rgba(10,12,30,0.5)',
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode="wait">
          {isResolved ? (
            <motion.div
              key="resolved"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              <CheckCircle size={16} color="#22c55e" />
              <span style={{ fontSize: 12, color: '#86efac', fontWeight: 600, flex: 1 }}>
                Understanding confirmed! Micro-challenges ready.
              </span>
            </motion.div>
          ) : !isTyping && shownHints.length > 0 && shownHints.length < activeScenario.hints.length ? (
            <motion.button
              key="try-again"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="btn-secondary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={handleTryAgain}
            >
              <RotateCcw size={13} />
              I tried again — still unsure
              <ChevronRight size={13} />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
