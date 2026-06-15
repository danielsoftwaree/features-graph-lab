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
    position: { x: 0, y: 280 },
    data: {
      step: '1',
      icon: '🛒',
      title: 'Checkout',
      description: 'User places an order and chooses payment method.',
      owner: OWNER.user,
      category: 'user',
    },
  },
  {
    id: 'intent',
    type: 'flow',
    position: { x: 300, y: 280 },
    data: {
      step: '2',
      icon: '💳',
      title: 'Payment Intent',
      description: 'We create a payment intent with a unique idempotency key.',
      owner: OWNER.system,
      category: 'system',
    },
  },
  {
    id: 'send',
    type: 'flow',
    position: { x: 600, y: 280 },
    data: {
      step: '3',
      icon: '🌐',
      title: 'Send to Provider',
      description: 'Payment request sent to payment provider.',
      owner: OWNER.external,
      category: 'external',
    },
  },
  {
    id: 'process',
    type: 'flow',
    position: { x: 900, y: 280 },
    data: {
      step: '4',
      icon: '🏦',
      title: 'Provider Processes',
      description: 'Provider charges the user and returns success.',
      owner: OWNER.external,
      category: 'external',
    },
  },
  {
    id: 'webhook',
    type: 'flow',
    position: { x: 1200, y: 280 },
    data: {
      step: '5',
      icon: '🪝',
      title: 'Webhook Received',
      description: 'Provider sends webhook event (payment.succeeded).',
      owner: OWNER.external,
      category: 'failure',
    },
  },
  {
    id: 'guard',
    type: 'flow',
    position: { x: 1500, y: 280 },
    data: {
      step: '6',
      icon: '🛡️',
      title: 'Idempotency Guard',
      description: 'We check if this event was already processed.',
      owner: OWNER.system,
      category: 'critical',
    },
  },
  {
    id: 'record',
    type: 'flow',
    position: { x: 1820, y: 140 },
    data: {
      step: '7',
      icon: '🗄️',
      title: 'Record Payment',
      description: 'We record payment in our database exactly once.',
      owner: OWNER.system,
      category: 'system',
    },
  },
  {
    id: 'ignore',
    type: 'flow',
    position: { x: 1820, y: 420 },
    data: {
      step: '7b',
      icon: '🚫',
      title: 'Ignore Duplicate',
      description: 'Duplicate event detected. We ignore it safely.',
      owner: OWNER.system,
      category: 'system',
    },
  },
  {
    id: 'timeout',
    type: 'flow',
    position: { x: 760, y: 40 },
    data: {
      step: '!',
      icon: '⏱️',
      title: 'Timeout / Network Error',
      description: 'Response lost. Provider may retry.',
      owner: OWNER.external,
      category: 'failure',
    },
  },
]

const EDGE_BASE: Partial<FlowEdge> = { type: 'smoothstep' }

const edges: FlowEdge[] = [
  { ...EDGE_BASE, id: 'e1', source: 'checkout', target: 'intent' },
  { ...EDGE_BASE, id: 'e2', source: 'intent', target: 'send' },
  {
    ...EDGE_BASE,
    id: 'e3',
    source: 'send',
    target: 'process',
    data: { branch: 'deliver' },
  },
  {
    ...EDGE_BASE,
    id: 'e-lost',
    source: 'send',
    target: 'timeout',
    data: { branch: 'lost' },
    style: { strokeDasharray: '4 4' },
  },
  { ...EDGE_BASE, id: 'e4', source: 'process', target: 'webhook' },
  { ...EDGE_BASE, id: 'e5', source: 'webhook', target: 'guard' },
  {
    ...EDGE_BASE,
    id: 'e6',
    source: 'guard',
    target: 'record',
    label: 'New Event',
    animated: true,
    data: { branch: 'new' },
  },
  {
    ...EDGE_BASE,
    id: 'e7',
    source: 'guard',
    target: 'ignore',
    label: 'Duplicate',
    data: { branch: 'duplicate' },
  },
  {
    ...EDGE_BASE,
    id: 'e-timeout',
    source: 'timeout',
    target: 'send',
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
