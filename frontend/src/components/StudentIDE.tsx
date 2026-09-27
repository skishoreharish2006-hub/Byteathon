import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Terminal,
  AlertTriangle,
  CheckCircle,
  Clock,
  RotateCcw,
  ChevronRight,
  History,
} from 'lucide-react';
import { useApp } from '../AppContext';

// ─── Attempt History Strip ────────────────────────────────────────────────────

function AttemptStrip() {
  const { attemptIndex, activeScenario, demoPhase } = useApp();
  const totalAttempts = Math.min(attemptIndex + 1, activeScenario.attempts.length);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: 'rgba(10,12,30,0.6)',
        borderBottom: '1px solid rgba(45,212,191,0.1)',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 11 }}>
        <History size={12} />
        <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Attempt History
        </span>
      </div>

      {Array.from({ length: totalAttempts }).map((_, i) => {
        const attempt = activeScenario.attempts[i];
        const isCurrent = i === Math.min(attemptIndex, activeScenario.attempts.length - 1);
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 20,
              border: `1px solid ${
                !attempt.isError
                  ? 'rgba(45,212,191,0.4)'
                  : isCurrent
                  ? 'rgba(251,191,36,0.5)'
                  : 'rgba(251,113,133,0.35)'
              }`,
              background: isCurrent
                ? 'rgba(251,191,36,0.08)'
                : attempt.isError
                ? 'rgba(251,113,133,0.06)'
                : 'rgba(45,212,191,0.08)',
            }}
          >
            {attempt.isError ? (
              <AlertTriangle
                size={10}
                color={isCurrent ? '#fbbf24' : '#fb7185'}
              />
            ) : (
              <CheckCircle size={10} color="#2dd4bf" />
            )}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'JetBrains Mono',
                color: isCurrent
                  ? '#fbbf24'
                  : attempt.isError
                  ? '#fb7185'
                  : '#2dd4bf',
              }}
            >
              #{i + 1} {attempt.errorType || 'OK'}
            </span>
          </div>
        );
      })}

      {attemptIndex >= 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 20,
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.4)',
          }}
        >
          <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 800, letterSpacing: '0.06em' }}>
            ⚡ Pattern Detected
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ─── Output Panel ─────────────────────────────────────────────────────────────

function OutputPanel({
  output,
  isError,
  errorType,
  errorLine,
  visible,
}: {
  output: string;
  isError: boolean;
  errorType?: string;
  errorLine?: number;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            borderTop: `1px solid ${isError ? 'rgba(251,113,133,0.25)' : 'rgba(45,212,191,0.25)'}`,
            background: isError
              ? 'rgba(251,113,133,0.05)'
              : 'rgba(45,212,191,0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderBottom: `1px solid ${
                isError ? 'rgba(251,113,133,0.15)' : 'rgba(45,212,191,0.15)'
              }`,
            }}
          >
            <Terminal size={13} color={isError ? '#fb7185' : '#2dd4bf'} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: isError ? '#fb7185' : '#2dd4bf',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {isError ? `Runtime Error — ${errorType}` : 'Output'}
            </span>
            {isError && errorLine && (
              <span
                style={{
                  fontSize: 10,
                  color: '#64748b',
                  fontFamily: 'JetBrains Mono',
                }}
              >
                Line {errorLine}
              </span>
            )}
          </div>
          <pre
            style={{
              margin: 0,
              padding: '12px 16px',
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
              color: isError ? '#fca5a5' : '#86efac',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {output}
          </pre>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main IDE Component ───────────────────────────────────────────────────────

export default function StudentIDE() {
  const {
    attemptIndex,
    advanceAttempt,
    activeScenario,
    demoPhase,
    runningCode,
    setRunningCode,
    codeContent,
    setCodeContent,
    setDemoPhase,
    hintIndex,
  } = useApp();

  const [outputVisible, setOutputVisible] = useState(false);

  const currentAttemptData =
    activeScenario.attempts[
      Math.min(attemptIndex, activeScenario.attempts.length - 1)
    ];

  const isResolved = demoPhase === 'resolved';

  const handleRun = useCallback(() => {
    if (runningCode) return;
    setRunningCode(true);
    setOutputVisible(false);

    setTimeout(() => {
      setRunningCode(false);
      setOutputVisible(true);

      // If not yet at max buggy attempts, advance
      if (attemptIndex < activeScenario.attempts.length - 1) {
        advanceAttempt();
      } else if (attemptIndex === activeScenario.attempts.length - 1) {
        // This triggers detection
        advanceAttempt();
      }
    }, 1400);
  }, [runningCode, attemptIndex, activeScenario, advanceAttempt, setRunningCode]);

  const handleSuccessRun = useCallback(() => {
    setRunningCode(true);
    setOutputVisible(false);
    setTimeout(() => {
      setRunningCode(false);
      setOutputVisible(true);
    }, 900);
  }, [setRunningCode]);

  const showSuccessRun =
    demoPhase === 'tutoring' && hintIndex >= activeScenario.hints.length - 1;
  const showOutput =
    outputVisible &&
    (demoPhase === 'ide' || demoPhase === 'detecting' || demoPhase === 'detected' || showSuccessRun);

  const displayCode = showSuccessRun
    ? activeScenario.successCode
    : codeContent;

  const displayOutput = showSuccessRun
    ? activeScenario.successOutput
    : currentAttemptData.output;

  const displayIsError = showSuccessRun ? false : currentAttemptData.isError;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0d0f1e',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(45,212,191,0.12)',
      }}
    >
      {/* IDE Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(10,12,30,0.8)',
          borderBottom: '1px solid rgba(45,212,191,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Traffic lights */}
          {['#ff5f57', '#ffbd2e', '#28ca41'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: '#475569',
              fontFamily: 'JetBrains Mono',
              fontWeight: 600,
            }}
          >
            solution.py
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(45,212,191,0.1)',
              border: '1px solid rgba(45,212,191,0.2)',
              fontSize: 10,
              color: '#2dd4bf',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            Python 3.11
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Task description */}
          <div
            style={{
              fontSize: 11,
              color: '#64748b',
              maxWidth: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            📋 {activeScenario.title}
          </div>

          {/* Run button */}
          <button
            className="btn-primary"
            onClick={showSuccessRun ? handleSuccessRun : handleRun}
            disabled={
              runningCode ||
              (demoPhase === 'detecting') ||
              (demoPhase === 'detected') ||
              (demoPhase === 'tutoring' && !showSuccessRun) ||
              demoPhase === 'challenges' ||
              demoPhase === 'resolved'
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              opacity:
                (demoPhase === 'detecting' ||
                  demoPhase === 'detected' ||
                  (demoPhase === 'tutoring' && !showSuccessRun) ||
                  demoPhase === 'challenges')
                  ? 0.4
                  : 1,
            }}
          >
            {runningCode ? (
              <>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    border: '2px solid rgba(10,12,30,0.4)',
                    borderTopColor: '#0a0c1e',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />
                Running...
              </>
            ) : (
              <>
                <Play size={12} fill="currentColor" />
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* Task banner */}
      <div
        style={{
          padding: '8px 16px',
          background: 'rgba(45,212,191,0.04)',
          borderBottom: '1px solid rgba(45,212,191,0.08)',
          fontSize: 12,
          color: '#64748b',
          lineHeight: 1.5,
        }}
      >
        <span style={{ color: '#2dd4bf', fontWeight: 700 }}>Task: </span>
        {activeScenario.task}
      </div>

      {/* Attempt strip */}
      <AttemptStrip />

      {/* Monaco Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={displayCode}
          onChange={(v) => {
            if (v !== undefined && demoPhase === 'ide') setCodeContent(v);
          }}
          options={{
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'on',
            readOnly: demoPhase !== 'ide' && !showSuccessRun,
            wordWrap: 'on',
          }}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('codemind', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'keyword', foreground: '#a78bfa' },
                { token: 'string', foreground: '#86efac' },
                { token: 'comment', foreground: '#475569', fontStyle: 'italic' },
                { token: 'number', foreground: '#fbbf24' },
                { token: 'delimiter', foreground: '#94a3b8' },
              ],
              colors: {
                'editor.background': '#0d0f1e',
                'editor.foreground': '#e2e8f0',
                'editorLineNumber.foreground': '#334155',
                'editorLineNumber.activeForeground': '#2dd4bf',
                'editor.lineHighlightBackground': '#1a1f3266',
                'editorCursor.foreground': '#2dd4bf',
                'editor.selectionBackground': '#2dd4bf22',
              },
            });
            monaco.editor.setTheme('codemind');
          }}
          onMount={(editor, monaco) => {
            monaco.editor.setTheme('codemind');
          }}
        />
      </div>

      {/* Output panel */}
      <OutputPanel
        output={displayOutput}
        isError={displayIsError}
        errorType={currentAttemptData.errorType}
        errorLine={currentAttemptData.errorLine}
        visible={showOutput}
      />
    </div>
  );
}
