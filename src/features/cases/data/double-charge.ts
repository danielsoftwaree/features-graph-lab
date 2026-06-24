import type { FlowEdge, FlowNode } from '@/shared/types/flow'
import type { CaseData } from '../types/case'

const OWNER = {
  user: 'User Action',
  system: 'Our System',
  external: 'External System',
} as const

const nodes: FlowNode[] = [
  {
    id: 'checkout',
    type: 'flow',
    position: { x: 0, y: 140 },
    data: {
      step: '1',
      icon: '🛒',
      title: 'Checkout',
      description: 'User taps Pay once.',
      owner: OWNER.user,
      category: 'user',
    },
  },
  {
    id: 'api',
    type: 'flow',
    position: { x: 300, y: 140 },
    data: {
      step: '2',
      icon: '🌐',
      title: 'Payment API',
      description: 'Server receives the charge request.',
      owner: OWNER.system,
      category: 'system',
    },
  },
  {
    id: 'intent',
    type: 'flow',
    position: { x: 600, y: 140 },
    data: {
      step: '3',
      icon: '🔑',
      title: 'Create Intent',
      description: 'Mints one idempotency key for this order.',
      owner: OWNER.system,
      category: 'system',
    },
  },
  {
    id: 'guard',
    type: 'flow',
    position: { x: 900, y: 140 },
    data: {
      step: '4',
      icon: '🛡️',
      title: 'Idempotency Guard',
      description: 'Has this key been processed already?',
      owner: OWNER.system,
      category: 'critical',
    },
  },
  {
    id: 'charge',
    type: 'flow',
    position: { x: 1200, y: 140 },
    data: {
      step: '5',
      icon: '💳',
      title: 'Charge Card',
      description: 'Provider moves real money. Irreversible.',
      owner: OWNER.external,
      category: 'critical',
    },
  },
  {
    id: 'record',
    type: 'flow',
    position: { x: 1500, y: 140 },
    data: {
      step: '6',
      icon: '🗄️',
      title: 'Write Ledger',
      description: 'Persist the payment in our database.',
      owner: OWNER.system,
      category: 'system',
    },
  },
  {
    id: 'confirm',
    type: 'flow',
    position: { x: 1800, y: 140 },
    data: {
      step: '7',
      icon: '📨',
      title: 'Confirm',
      description: 'Return success to the client.',
      owner: OWNER.external,
      category: 'external',
    },
  },
  {
    id: 'ignore',
    type: 'flow',
    position: { x: 900, y: 380 },
    data: {
      step: '4b',
      icon: '🚫',
      title: 'Skip Duplicate',
      description: 'Key already processed — safe no-op.',
      owner: OWNER.system,
      category: 'system',
    },
  },
  {
    id: 'network',
    type: 'flow',
    position: { x: 1800, y: 380 },
    data: {
      step: '!',
      icon: '⚡',
      title: 'Network Timeout',
      description: 'Response lost. Client retries with the same key.',
      owner: OWNER.external,
      category: 'failure',
    },
  },
]

const EDGE_BASE: Partial<FlowEdge> = { type: 'smoothstep' }

const edges: FlowEdge[] = [
  {
    ...EDGE_BASE,
    id: 'e1',
    source: 'checkout',
    target: 'api',
    sourceHandle: 'out',
    targetHandle: 'in',
  },
  {
    ...EDGE_BASE,
    id: 'e2',
    source: 'api',
    target: 'intent',
    sourceHandle: 'out',
    targetHandle: 'in',
  },
  {
    ...EDGE_BASE,
    id: 'e3',
    source: 'intent',
    target: 'guard',
    sourceHandle: 'out',
    targetHandle: 'in',
  },
  {
    ...EDGE_BASE,
    id: 'e4',
    source: 'guard',
    target: 'charge',
    sourceHandle: 'out',
    targetHandle: 'in',
    label: 'New key',
    data: { branch: 'new' },
  },
  {
    ...EDGE_BASE,
    id: 'e5',
    source: 'charge',
    target: 'record',
    sourceHandle: 'out',
    targetHandle: 'in',
  },
  {
    ...EDGE_BASE,
    id: 'e6',
    source: 'record',
    target: 'confirm',
    sourceHandle: 'out',
    targetHandle: 'in',
  },
  {
    ...EDGE_BASE,
    id: 'e-dup',
    source: 'guard',
    target: 'ignore',
    sourceHandle: 'out-bottom',
    targetHandle: 'in-top',
    label: 'Duplicate',
    data: { branch: 'duplicate' },
  },
  {
    ...EDGE_BASE,
    id: 'e-lost',
    source: 'confirm',
    target: 'network',
    sourceHandle: 'out-bottom',
    targetHandle: 'in-top',
    label: 'Response lost',
    data: { branch: 'lost' },
    style: { strokeDasharray: '4 4' },
  },
  {
    ...EDGE_BASE,
    id: 'e-retry',
    source: 'network',
    target: 'api',
    sourceHandle: 'out-bottom',
    targetHandle: 'in',
    label: 'Retry · same key',
    animated: true,
    style: { strokeDasharray: '4 4' },
  },
]

export const doubleCharge: CaseData = {
  slug: 'double-charge',
  title: 'Case 001: Double Charge',
  businessSituation:
    'A user submits a payment form. The network hiccups and the browser retries. ' +
    'Two identical requests hit the server. Both succeed. The user is charged twice.',
  nodes,
  edges,
  entryNodeId: 'checkout',
  criticalNodeId: 'guard',
  testResults: [
    { name: 'Single charge on retry', passed: true },
    { name: 'Idempotency key stored', passed: true },
    { name: 'Duplicate request rejected', passed: true },
  ],
  businessImpact: [
    'Customer sees two charges on bank statement',
    'Support ticket volume spikes after each deployment',
    'Chargeback rate increases → Stripe risk score worsens',
    'Engineering spends 2 days per incident on manual refunds',
  ],
  finalLesson:
    'Every payment mutation must carry an idempotency key. ' +
    'The server stores it on first success and returns the cached result for retries. ' +
    'Without this check, any network retry becomes a financial bug.',
}
