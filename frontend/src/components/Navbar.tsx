import React from 'react';
import { useApp } from '../AppContext';
import { scenario1, scenario2 } from '../mockData';
import {
  Brain,
  GraduationCap,
  Zap,
  BookOpen,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const {
    activeView,
    setActiveView,
    activeScenario,
    setActiveScenario,
    resetDemo,
    demoPhase,
  } = useApp();

  return (
    <nav
      className="glass"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '60px',
        borderBottom: '1px solid rgba(45,212,191,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #2dd4bf, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(45,212,191,0.4)',
          }}
        >
          <Brain size={20} color="#0a0c1e" strokeWidth={2.5} />
        </div>
        <div>
          <div
            style={{
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: '-0.02em',
            }}
            className="gradient-text"
          >
            CodeMind AI
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#475569',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginTop: -2,
            }}
          >
            ByteForge · BYTEATHON 2026
          </div>
        </div>
      </div>

      {/* Scenario Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(10,12,30,0.6)',
          border: '1px solid rgba(45,212,191,0.15)',
          borderRadius: 12,
          padding: '4px 8px',
        }}
      >
        <Zap size={12} color="#fbbf24" />
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Demo Scenario:
        </span>
        {[scenario1, scenario2].map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScenario(s)}
            style={{
              padding: '4px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'Plus Jakarta Sans',
              transition: 'all 0.2s',
              background:
                activeScenario.id === s.id
                  ? 'rgba(45,212,191,0.2)'
                  : 'transparent',
              color: activeScenario.id === s.id ? '#2dd4bf' : '#64748b',
              borderBottom: activeScenario.id === s.id
                ? '1px solid #2dd4bf'
                : '1px solid transparent',
            }}
          >
            {s.id === 'array-index-boundary' ? '① Index Boundary' : '② == vs ='}
          </button>
        ))}
      </div>

      {/* Nav controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Demo phase indicator */}
        {demoPhase !== 'ide' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: 'rgba(45,212,191,0.08)',
              border: '1px solid rgba(45,212,191,0.2)',
              borderRadius: 20,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#2dd4bf',
                boxShadow: '0 0 6px #2dd4bf',
              }}
            />
            <span style={{ fontSize: 11, color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {demoPhase === 'detecting' ? 'Analyzing...'
                : demoPhase === 'detected' ? 'Misconception Found'
                : demoPhase === 'tutoring' ? 'Tutor Active'
                : demoPhase === 'challenges' ? 'Challenges'
                : 'Mastery Updated'}
            </span>
          </motion.div>
        )}

        {/* View toggle */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(10,12,30,0.7)',
            border: '1px solid rgba(45,212,191,0.15)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {([['student', 'Student IDE', BookOpen], ['teacher', 'Teacher View', GraduationCap]] as const).map(
            ([view, label, Icon]) => (
              <button
                key={view}
                onClick={() => setActiveView(view as 'student' | 'teacher')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.2s',
                  background: activeView === view ? 'rgba(45,212,191,0.18)' : 'transparent',
                  color: activeView === view ? '#2dd4bf' : '#64748b',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            )
          )}
        </div>

        {/* Reset */}
        <button
          onClick={resetDemo}
          title="Reset demo"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid rgba(45,212,191,0.2)',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#2dd4bf')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </nav>
  );
}
