import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  conceptNodes,
  ConceptNode,
  MasteryState,
  scenario1,
  scenario2,
  Scenario,
} from './mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DemoPhase =
  | 'ide'          // Student is coding
  | 'detecting'    // Misconception being analyzed
  | 'detected'     // Panel shown
  | 'tutoring'     // Socratic chat active
  | 'challenges'   // Micro-challenges
  | 'resolved';    // Graph updated

export type ActiveView = 'student' | 'teacher';

interface AppState {
  activeView: ActiveView;
  setActiveView: (v: ActiveView) => void;

  activeScenario: Scenario;
  setActiveScenario: (s: Scenario) => void;

  demoPhase: DemoPhase;
  setDemoPhase: (p: DemoPhase) => void;

  attemptIndex: number;          // 0 = first attempt shown
  advanceAttempt: () => void;

  hintIndex: number;             // which hint has been shown
  advanceHint: () => void;

  currentChallengeIndex: number;
  advanceChallenge: () => void;

  nodes: ConceptNode[];
  updateNodeMastery: (id: string, state: MasteryState) => void;
  flippingNodeId: string | null;

  runningCode: boolean;
  setRunningCode: (v: boolean) => void;

  codeContent: string;
  setCodeContent: (c: string) => void;

  resetDemo: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveView>('student');
  const [activeScenario, setActiveScenarioInner] = useState<Scenario>(scenario1);
  const [demoPhase, setDemoPhase] = useState<DemoPhase>('ide');
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [nodes, setNodes] = useState<ConceptNode[]>(conceptNodes);
  const [flippingNodeId, setFlippingNodeId] = useState<string | null>(null);
  const [runningCode, setRunningCode] = useState(false);
  const [codeContent, setCodeContent] = useState(scenario1.attempts[0].code);

  const advanceAttempt = useCallback(() => {
    setAttemptIndex((prev) => {
      const next = prev + 1;
      const scenario = activeScenario;
      if (next < scenario.attempts.length) {
        setCodeContent(scenario.attempts[next].code);
      }
      // After 3rd attempt (index 2), trigger detection
      if (next >= 2) {
        setTimeout(() => setDemoPhase('detecting'), 1200);
        setTimeout(() => setDemoPhase('detected'), 3200);
      }
      return next;
    });
  }, [activeScenario]);

  const advanceHint = useCallback(() => {
    setHintIndex((prev) => {
      const next = prev + 1;
      if (next >= activeScenario.hints.length - 1) {
        // Final hint — move to resolution then challenges
        setTimeout(() => {
          setDemoPhase('challenges');
          setCurrentChallengeIndex(0);
        }, 800);
      }
      return next;
    });
  }, [activeScenario]);

  const advanceChallenge = useCallback(() => {
    setCurrentChallengeIndex((prev) => {
      const next = prev + 1;
      if (next >= activeScenario.challenges.length) {
        // All challenges done — update knowledge graph
        setDemoPhase('resolved');
        // Animate the target node
        const targetId = activeScenario.misconceptionId;
        setFlippingNodeId(targetId);
        setNodes((prev) =>
          prev.map((n) =>
            n.id === targetId ? { ...n, mastery: 'developing' } : n
          )
        );
        setTimeout(() => setFlippingNodeId(null), 2000);
      }
      return next;
    });
  }, [activeScenario]);

  const updateNodeMastery = useCallback(
    (id: string, state: MasteryState) => {
      setFlippingNodeId(id);
      setNodes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, mastery: state } : n))
      );
      setTimeout(() => setFlippingNodeId(null), 2000);
    },
    []
  );

  const setActiveScenario = useCallback((s: Scenario) => {
    setActiveScenarioInner(s);
    setDemoPhase('ide');
    setAttemptIndex(0);
    setHintIndex(0);
    setCurrentChallengeIndex(0);
    setCodeContent(s.attempts[0].code);
    setNodes(conceptNodes);
    setFlippingNodeId(null);
  }, []);

  const resetDemo = useCallback(() => {
    setDemoPhase('ide');
    setAttemptIndex(0);
    setHintIndex(0);
    setCurrentChallengeIndex(0);
    setCodeContent(activeScenario.attempts[0].code);
    setNodes(conceptNodes);
    setFlippingNodeId(null);
  }, [activeScenario]);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        activeScenario,
        setActiveScenario,
        demoPhase,
        setDemoPhase,
        attemptIndex,
        advanceAttempt,
        hintIndex,
        advanceHint,
        currentChallengeIndex,
        advanceChallenge,
        nodes,
        updateNodeMastery,
        flippingNodeId,
        runningCode,
        setRunningCode,
        codeContent,
        setCodeContent,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
