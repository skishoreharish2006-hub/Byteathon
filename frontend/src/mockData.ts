// ─────────────────────────────────────────────────────────────────────────────
// CodeMind AI — Central Mock Data Store
// Everything the demo needs: scenarios, hints, challenges, graph nodes, class data
// ─────────────────────────────────────────────────────────────────────────────

export type MasteryState = 'mastered' | 'developing' | 'needs-attention' | 'locked';

export interface ConceptNode {
  id: string;
  label: string;
  mastery: MasteryState;
  x?: number;
  y?: number;
  dependencies: string[];
  description: string;
}

export interface HintStep {
  id: number;
  text: string;
  type: 'question' | 'narrow' | 'guidance' | 'resolution';
}

export interface Challenge {
  id: number;
  tier: 'Basic' | 'Application' | 'Transfer';
  title: string;
  description: string;
  code?: string;
  options?: string[];
  correctIndex?: number;
  successMessage: string;
}

export interface ScenarioAttempt {
  code: string;
  output: string;
  isError: boolean;
  errorType?: string;
  errorLine?: number;
}

export interface Scenario {
  id: string;
  title: string;
  task: string;
  misconceptionId: string;
  misconceptionLabel: string;
  misconceptionCategory: string;
  attempts: ScenarioAttempt[];
  successCode: string;
  successOutput: string;
  hints: HintStep[];
  challenges: Challenge[];
  signalSummary: {
    errorFrequency: number;
    errorType: string;
    recurringPattern: string;
    debuggingAttempts: number;
    confidence: 'Low' | 'Medium' | 'High';
  };
}

// ─── Knowledge Graph Nodes ───────────────────────────────────────────────────

export const conceptNodes: ConceptNode[] = [
  {
    id: 'variables',
    label: 'Variables',
    mastery: 'mastered',
    dependencies: [],
    description: 'Storing and retrieving values in named containers',
  },
  {
    id: 'conditions',
    label: 'Conditions',
    mastery: 'mastered',
    dependencies: ['variables'],
    description: 'Branching logic using boolean expressions',
  },
  {
    id: 'loops',
    label: 'Loops',
    mastery: 'mastered',
    dependencies: ['variables', 'conditions'],
    description: 'Repeating code blocks with for/while constructs',
  },
  {
    id: 'functions',
    label: 'Functions',
    mastery: 'developing',
    dependencies: ['variables', 'conditions'],
    description: 'Reusable blocks of named code that accept parameters',
  },
  {
    id: 'arrays',
    label: 'Arrays / Lists',
    mastery: 'developing',
    dependencies: ['variables', 'loops'],
    description: 'Ordered collections of values stored sequentially',
  },
  {
    id: 'indexing',
    label: 'Indexing',
    mastery: 'needs-attention',
    dependencies: ['arrays'],
    description: 'Accessing individual elements of a list by position',
  },
  {
    id: 'index-boundaries',
    label: 'Index Boundaries',
    mastery: 'needs-attention',
    dependencies: ['indexing'],
    description: 'Understanding valid index range: 0 to len-1',
  },
  {
    id: 'comparison-ops',
    label: 'Comparison Ops',
    mastery: 'developing',
    dependencies: ['variables', 'conditions'],
    description: 'Using == vs = — comparison vs assignment operators',
  },
  {
    id: 'string-ops',
    label: 'String Operations',
    mastery: 'locked',
    dependencies: ['variables', 'indexing'],
    description: 'Slicing, joining, and manipulating text values',
  },
];

// ─── Scenario 1: Array Index Boundary (primary demo scenario) ────────────────

export const scenario1: Scenario = {
  id: 'array-index-boundary',
  title: 'List Element Access',
  task: `You have a list of 5 student scores. Write a function that prints 
the last score. The list is: scores = [85, 92, 78, 95, 88]`,
  misconceptionId: 'index-boundaries',
  misconceptionLabel: 'Array Index Boundaries',
  misconceptionCategory: 'Zero-Based Indexing',
  attempts: [
    {
      code: `scores = [85, 92, 78, 95, 88]

def get_last_score(scores):
    # Get the last element (5th item)
    last = scores[5]
    return last

print(get_last_score(scores))`,
      output: `Traceback (most recent call last):
  File "solution.py", line 8, in <module>
    print(get_last_score(scores))
  File "solution.py", line 4, in get_last_score
    last = scores[5]
IndexError: list index out of range`,
      isError: true,
      errorType: 'IndexError',
      errorLine: 4,
    },
    {
      code: `scores = [85, 92, 78, 95, 88]

def get_last_score(scores):
    # The 5th item must be at index 5, right?
    last = scores[5]
    print(f"Score count: {len(scores)}")
    return last

print(get_last_score(scores))`,
      output: `Traceback (most recent call last):
  File "solution.py", line 9, in <module>
    print(get_last_score(scores))
  File "solution.py", line 5, in get_last_score
    last = scores[5]
IndexError: list index out of range`,
      isError: true,
      errorType: 'IndexError',
      errorLine: 5,
    },
    {
      code: `scores = [85, 92, 78, 95, 88]

def get_last_score(scores):
    # Maybe I need to add 1 to get the 5th element?
    last = scores[len(scores)]
    return last

print(get_last_score(scores))`,
      output: `Traceback (most recent call last):
  File "solution.py", line 8, in <module>
    print(get_last_score(scores))
  File "solution.py", line 4, in get_last_score
    last = scores[len(scores)]
IndexError: list index out of range`,
      isError: true,
      errorType: 'IndexError',
      errorLine: 4,
    },
  ],
  successCode: `scores = [85, 92, 78, 95, 88]

def get_last_score(scores):
    # A 5-element list has valid indices 0, 1, 2, 3, 4
    last = scores[4]   # index 4 = the 5th item
    return last

print(get_last_score(scores))`,
  successOutput: `88`,
  hints: [
    {
      id: 1,
      type: 'question',
      text: `🤔 Interesting! Your list has 5 elements. When Python labels each one, where does the numbering start — at 0 or at 1? Think about what index you'd use to reach the *very first* element before we talk about the last.`,
    },
    {
      id: 2,
      type: 'narrow',
      text: `💡 Right, Python starts counting at 0. So a 5-element list has positions 0, 1, 2, 3, and... what's the last one? Notice that number is always one *less* than the total count. Try writing out the positions on paper — what's the valid range?`,
    },
    {
      id: 3,
      type: 'guidance',
      text: `🔍 You're close! If the list has 5 elements and indices go from 0 to 4, then \`scores[5]\` is one step *beyond* the list — like asking for the 6th seat in a 5-seat row. What index would give you the last actual element?`,
    },
    {
      id: 4,
      type: 'resolution',
      text: `✨ Exactly! Index 4 gives you the 5th element. The rule is: for a list of length N, valid indices are 0 through N-1. You've just internalized one of Python's most fundamental access patterns. Run it — you'll see 88.`,
    },
  ],
  challenges: [
    {
      id: 1,
      tier: 'Basic',
      title: "Recall: What's the last valid index?",
      description:
        "A list has 7 elements. What is the index of the last element?",
      options: ['5', '6', '7', '8'],
      correctIndex: 1,
      successMessage:
        "Correct! For a list of length 7, valid indices are 0 through 6.",
    },
    {
      id: 2,
      tier: 'Application',
      title: 'Find the Bug',
      description:
        'This code crashes. Identify the exact line causing the IndexError and explain why.',
      code: `colors = ["red", "green", "blue"]
print(colors[0])   # Line A
print(colors[2])   # Line B
print(colors[3])   # Line C
print(colors[1])   # Line D`,
      options: ['Line A', 'Line B', 'Line C — index 3 is out of range', 'Line D'],
      correctIndex: 2,
      successMessage:
        'Spot on! Line C uses index 3, but a 3-element list only has indices 0, 1, 2.',
    },
    {
      id: 3,
      tier: 'Transfer',
      title: 'Write It Yourself',
      description: `Given any list \`data\`, write a single expression (no hardcoded number) that always retrieves the last element — even if the list length changes.`,
      options: [
        'data[len(data)]',
        'data[len(data) - 1]',
        'data[-0]',
        'data[last]',
      ],
      correctIndex: 1,
      successMessage:
        'Perfect! `data[len(data) - 1]` always works. Python also lets you write `data[-1]` as a shorthand — the same logic in reverse.',
    },
  ],
  signalSummary: {
    errorFrequency: 3,
    errorType: 'IndexError: list index out of range',
    recurringPattern: 'scores[N] where N equals len(scores)',
    debuggingAttempts: 3,
    confidence: 'High',
  },
};

// ─── Scenario 2: Assignment vs Comparison (bonus scenario) ───────────────────

export const scenario2: Scenario = {
  id: 'assignment-vs-comparison',
  title: 'Age Verification',
  task: `Write a function that checks if a user's age meets the 
minimum requirement of 18. Return True if they qualify, False otherwise.`,
  misconceptionId: 'comparison-ops',
  misconceptionLabel: 'Assignment vs Comparison',
  misconceptionCategory: '= vs == Operator Confusion',
  attempts: [
    {
      code: `def can_vote(age):
    if (age = 18):
        return True
    return False

print(can_vote(20))`,
      output: `  File "solution.py", line 2
    if (age = 18):
           ^
SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?`,
      isError: true,
      errorType: 'SyntaxError',
      errorLine: 2,
    },
    {
      code: `def can_vote(age):
    age = 18   # checking if age equals 18
    if age:
        return True
    return False

print(can_vote(20))`,
      output: `True`,
      isError: false,
    },
    {
      code: `def can_vote(age):
    if (age = 18):
        return True
    elif age = 17:
        return False

print(can_vote(17))`,
      output: `  File "solution.py", line 4
    elif age = 17:
             ^
SyntaxError: invalid syntax`,
      isError: true,
      errorType: 'SyntaxError',
      errorLine: 4,
    },
  ],
  successCode: `def can_vote(age):
    if age >= 18:
        return True
    return False

print(can_vote(20))
print(can_vote(15))`,
  successOutput: `True
False`,
  hints: [
    {
      id: 1,
      type: 'question',
      text: `🤔 You wrote \`age = 18\` inside the \`if\` condition. Are you trying to *store a value* in \`age\`, or are you trying to *ask a question* about what \`age\` already is? Those are two very different operations in Python.`,
    },
    {
      id: 2,
      type: 'narrow',
      text: `💡 Think of it this way: \`=\` is like writing into a box — you're putting something there. But a condition needs to *read* and *compare*. What symbol do you think Python uses when you want to check if two things are equal (not set them equal)?`,
    },
    {
      id: 3,
      type: 'guidance',
      text: `🔍 You're looking for the comparison operator — it's written with two equals signs. Also, since the task says "18 or older," do you need an exact match, or a range? What operator handles "greater than or equal to"?`,
    },
    {
      id: 4,
      type: 'resolution',
      text: `✨ Exactly! \`==\` compares without changing anything. \`>=\` checks if age is 18 or more — which is what "minimum requirement" means. The distinction between *assignment* (\`=\`) and *comparison* (\`==\`) is one every Python programmer internalizes early. You've got it.`,
    },
  ],
  challenges: [
    {
      id: 1,
      tier: 'Basic',
      title: 'Recall: Which operator compares?',
      description:
        'Which operator checks if two values are equal WITHOUT changing either one?',
      options: ['=', '==', ':=', '!='],
      correctIndex: 1,
      successMessage: 'Right! `==` compares. `=` assigns. They look similar but do completely different things.',
    },
    {
      id: 2,
      tier: 'Application',
      title: 'Find the Bug',
      description: 'Which line has the logic error that makes this function always return True?',
      code: `def is_admin(role):
    if role = "admin":   # Line A
        return True
    return False`,
      options: ['No bug — it looks correct', 'Line A — should use ==', 'The return statements are wrong', 'The function name is wrong'],
      correctIndex: 1,
      successMessage: 'Exactly! `role = "admin"` assigns the string to role (always truthy), so the function always returns True. Use `role == "admin"` to compare.',
    },
    {
      id: 3,
      tier: 'Transfer',
      title: 'Write It Yourself',
      description: 'Write the correct condition for: "Is the score strictly greater than 90 AND not equal to 100?"',
      options: [
        'score > 90 = not 100',
        'score > 90 and score != 100',
        'score > 90 & score == 100',
        'score = 90 and score = 100',
      ],
      correctIndex: 1,
      successMessage: 'Perfect! `score > 90 and score != 100` uses proper comparison operators for both conditions.',
    },
  ],
  signalSummary: {
    errorFrequency: 3,
    errorType: 'SyntaxError / Logic Error',
    recurringPattern: 'assignment operator used in conditional context',
    debuggingAttempts: 3,
    confidence: 'High',
  },
};

// ─── Mock Class / Teacher Data ────────────────────────────────────────────────

export interface StudentRecord {
  id: string;
  name: string;
  avatar: string;
  topMisconception: string;
  misconceptionCategory: string;
  attempts: number;
  masteryScore: number;
  trend: 'improving' | 'stagnant' | 'declining';
  weakNodes: string[];
}

export const mockClassData: StudentRecord[] = [
  {
    id: 's1',
    name: 'Arjun Mehta',
    avatar: 'AM',
    topMisconception: 'Array Index Boundaries',
    misconceptionCategory: 'Zero-Based Indexing',
    attempts: 8,
    masteryScore: 62,
    trend: 'improving',
    weakNodes: ['Index Boundaries', 'Indexing'],
  },
  {
    id: 's2',
    name: 'Priya Sharma',
    avatar: 'PS',
    topMisconception: 'Assignment vs Comparison',
    misconceptionCategory: '= vs == Operator',
    attempts: 5,
    masteryScore: 71,
    trend: 'improving',
    weakNodes: ['Comparison Ops', 'Conditions'],
  },
  {
    id: 's3',
    name: 'Rohan Verma',
    avatar: 'RV',
    topMisconception: 'Loop Termination',
    misconceptionCategory: 'Off-by-one in Ranges',
    attempts: 12,
    masteryScore: 48,
    trend: 'stagnant',
    weakNodes: ['Loops', 'Index Boundaries'],
  },
  {
    id: 's4',
    name: 'Anjali Nair',
    avatar: 'AN',
    topMisconception: 'Mutable Default Arguments',
    misconceptionCategory: 'Function Parameters',
    attempts: 3,
    masteryScore: 83,
    trend: 'improving',
    weakNodes: ['Functions'],
  },
  {
    id: 's5',
    name: 'Kiran Patel',
    avatar: 'KP',
    topMisconception: 'Array Index Boundaries',
    misconceptionCategory: 'Zero-Based Indexing',
    attempts: 9,
    masteryScore: 55,
    trend: 'improving',
    weakNodes: ['Index Boundaries', 'Arrays'],
  },
  {
    id: 's6',
    name: 'Divya Krishnan',
    avatar: 'DK',
    topMisconception: 'Variable Scope',
    misconceptionCategory: 'Local vs Global',
    attempts: 6,
    masteryScore: 67,
    trend: 'stagnant',
    weakNodes: ['Functions', 'Variables'],
  },
  {
    id: 's7',
    name: 'Siddharth Rao',
    avatar: 'SR',
    topMisconception: 'Assignment vs Comparison',
    misconceptionCategory: '= vs == Operator',
    attempts: 7,
    masteryScore: 59,
    trend: 'declining',
    weakNodes: ['Comparison Ops', 'Conditions', 'Functions'],
  },
  {
    id: 's8',
    name: 'Meera Iyer',
    avatar: 'MI',
    topMisconception: 'String Immutability',
    misconceptionCategory: 'String Operations',
    attempts: 4,
    masteryScore: 78,
    trend: 'improving',
    weakNodes: ['String Ops'],
  },
];

export const cohortMisconceptions = [
  { label: 'Array Index Boundaries', count: 12, pct: 38 },
  { label: 'Assignment vs Comparison', count: 8, pct: 25 },
  { label: 'Loop Off-by-one', count: 6, pct: 19 },
  { label: 'Variable Scope', count: 4, pct: 13 },
  { label: 'Other', count: 2, pct: 6 },
];
