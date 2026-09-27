import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  BarChart2,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { mockClassData, cohortMisconceptions, StudentRecord } from '../mockData';

// ─── Trend Icon ───────────────────────────────────────────────────────────────
function TrendBadge({ trend }: { trend: StudentRecord['trend'] }) {
  const cfg = {
    improving: { icon: TrendingUp, color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)', label: 'Improving' },
    stagnant: { icon: Minus, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', label: 'Stagnant' },
    declining: { icon: TrendingDown, color: '#fb7185', bg: 'rgba(251,113,133,0.1)', label: 'Declining' },
  }[trend];
  const Icon = cfg.icon;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 20,
        background: cfg.bg,
      }}
    >
      <Icon size={10} color={cfg.color} />
      <span style={{ fontSize: 10, color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
    </div>
  );
}

// ─── Mastery bar ──────────────────────────────────────────────────────────────
function MasteryBar({ score }: { score: number }) {
  const color = score >= 75 ? '#2dd4bf' : score >= 55 ? '#a78bfa' : '#fbbf24';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div
          className="progress-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 28 }}>
        {score}%
      </span>
    </div>
  );
}

// ─── Student Row ──────────────────────────────────────────────────────────────
function StudentRow({ student, rank }: { student: StudentRecord; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rank * 0.06 }}
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
        className="glass-hover"
      >
        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(37,43,110,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1a1f52, #252b6e)',
                border: '1px solid rgba(45,212,191,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 800,
                color: '#2dd4bf',
                flexShrink: 0,
              }}
            >
              {student.avatar}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{student.name}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>{student.attempts} attempts this week</div>
            </div>
          </div>
        </td>
        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(37,43,110,0.5)' }}>
          <div>
            <div style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>
              {student.topMisconception}
            </div>
            <div style={{ fontSize: 10, color: '#475569' }}>{student.misconceptionCategory}</div>
          </div>
        </td>
        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(37,43,110,0.5)' }}>
          <MasteryBar score={student.masteryScore} />
        </td>
        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(37,43,110,0.5)' }}>
          <TrendBadge trend={student.trend} />
        </td>
        <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(37,43,110,0.5)', color: '#475569' }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </motion.tr>

      {/* Expanded row */}
      {expanded && (
        <tr>
          <td
            colSpan={5}
            style={{
              padding: '0 16px 12px',
              borderBottom: '1px solid rgba(37,43,110,0.5)',
              background: 'rgba(10,12,30,0.4)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '8px 0' }}>
              <span style={{ fontSize: 10, color: '#475569', fontWeight: 700 }}>Weak concepts: </span>
              {student.weakNodes.map((n) => (
                <span
                  key={n}
                  style={{
                    fontSize: 10,
                    color: '#fbbf24',
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    fontWeight: 600,
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Cohort Bar Chart ─────────────────────────────────────────────────────────
function CohortChart() {
  const maxCount = Math.max(...cohortMisconceptions.map((m) => m.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {cohortMisconceptions.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{ fontSize: 11, color: '#94a3b8', minWidth: 170, fontWeight: 600 }}>
            {m.label}
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="progress-bar" style={{ flex: 1, height: 8 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(m.count / maxCount) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: i === 0
                    ? 'linear-gradient(90deg, #fbbf24, #fb7185)'
                    : i === 1
                    ? 'linear-gradient(90deg, #a78bfa, #8b5cf6)'
                    : 'linear-gradient(90deg, #38bdf8, #2dd4bf)',
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: '#64748b', minWidth: 40, fontWeight: 700 }}>
              {m.count} students ({m.pct}%)
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Teacher View ────────────────────────────────────────────────────────
export default function TeacherView() {
  const topMisconception = cohortMisconceptions[0];

  return (
    <div
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      {/* Page header */}
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
          className="gradient-text"
        >
          Instructor Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0' }}>
          BYT03 — CS101 · Batch 2026 · {mockClassData.length} students tracked
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Students', value: mockClassData.length, icon: Users, color: '#2dd4bf' },
          { label: 'Misconceptions Detected', value: 23, icon: AlertTriangle, color: '#fbbf24' },
          { label: 'Avg Mastery', value: '65%', icon: BarChart2, color: '#a78bfa' },
          { label: 'Active Sessions', value: 5, icon: BookOpen, color: '#38bdf8' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass"
              style={{
                borderRadius: 14,
                padding: '14px 16px',
                border: `1px solid ${stat.color}22`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} color={stat.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cohort misconception + class table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Cohort chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass"
          style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(251,191,36,0.15)' }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(251,191,36,0.12)',
              background: 'rgba(251,191,36,0.05)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fef3c7', marginBottom: 2 }}>
              🔥 Most Common Misconceptions
            </div>
            <div style={{ fontSize: 10, color: '#64748b' }}>This week · Entire cohort</div>
          </div>

          <div style={{ padding: 16 }}>
            {/* Top misconception callout */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,113,133,0.08))',
                border: '1px solid rgba(251,191,36,0.3)',
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Top Hidden Gap
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fef3c7', marginTop: 2 }}>
                {topMisconception.label}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                Affects {topMisconception.count} of {mockClassData.length} students ({topMisconception.pct}%)
              </div>
            </div>

            <CohortChart />
          </div>
        </motion.div>

        {/* Student table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass"
          style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(45,212,191,0.12)' }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(45,212,191,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Users size={16} color="#2dd4bf" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#e2e8f0' }}>Student Overview</div>
              <div style={{ fontSize: 10, color: '#475569' }}>Click a row to see weak concept details</div>
            </div>
          </div>

          <div style={{ overflowY: 'auto', maxHeight: 400 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Student', 'Top Misconception', 'Mastery', 'Trend', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '8px 16px',
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        textAlign: 'left',
                        background: 'rgba(10,12,30,0.6)',
                        borderBottom: '1px solid rgba(37,43,110,0.8)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockClassData.map((student, i) => (
                  <StudentRow key={student.id} student={student} rank={i} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Footer note */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 12,
          background: 'rgba(45,212,191,0.05)',
          border: '1px solid rgba(45,212,191,0.1)',
          fontSize: 12,
          color: '#475569',
          textAlign: 'center',
        }}
      >
        💡 <span style={{ color: '#2dd4bf', fontWeight: 700 }}>CodeMind AI</span> detects misconceptions silently — students learn naturally, instructors see the real picture.
        <span style={{ fontStyle: 'italic' }}> "Hidden gaps become visible."</span>
      </div>
    </div>
  );
}
