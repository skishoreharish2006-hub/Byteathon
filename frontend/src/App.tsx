import React from 'react';
import { AppProvider, useApp } from './AppContext';
import Navbar from './components/Navbar';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';
import './index.css';

// CSS keyframe for spin
const spinStyle = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

function AppContent() {
  const { activeView } = useApp();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0c1e',
        overflow: 'hidden',
      }}
      className="bg-grid"
    >
      {/* Ambient glow blobs */}
      <div
        style={{
          position: 'fixed',
          top: '-10%',
          left: '-5%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-10%',
          right: '-5%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Navbar />
        <div style={{ flex: 1, overflow: activeView === 'teacher' ? 'auto' : 'hidden' }}>
          {activeView === 'student' ? <StudentView /> : <TeacherView />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <style>{spinStyle}</style>
      <AppContent />
    </AppProvider>
  );
}
