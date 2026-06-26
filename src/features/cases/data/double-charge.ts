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

// Per-node inspector content: what it does, the editable TypeScript that runs,
// and — for the nodes in the bug — why this is where it breaks. The `code` is the
// real handler the runtime compiles and executes (a bare arrow function, types
// trimmed for the editor). `guard` ships BROKEN on purpose: pressing Pay charges
// twice until you add the idempotency check yourself.
const INSPECTOR: Record<
  string,
  { explanation: string; code: string; failureReason?: string }
> = {
  checkout: {
    explanation:
      'The user taps Pay once. It emits a single payment request carrying one freshly minted idempotency key.',
    code: `() => ({
  emit: [{
    output: { amount: 600, key: 'idem_4242', attempt: 1 },
  }],
})`,
  },
  api: {
    explanation:
      'The server receives the charge request and forwards it inward. This is also where a retried request re-enters the pipeline.',
    code: `(input) => ({
  emit: [{ output: input }],
})`,
  },
  intent: {
    explanation:
      'Creates a payment intent keyed by the idempotency key for this order.',
    code: `(input) => ({
  emit: [{ output: input }],
})`,
  },
  guard: {
    explanation:
      'The idempotency guard decides whether this key was already processed. A new key is let through to Charge; a duplicate should be routed to a safe no-op ("duplicate" handle).',
    code: `(req, { world }) => {
  // 🐛 BROKEN: no idempotency check — every request is charged.
  // Fix me: when world.processedKeys already has req.key, emit on the
  // "duplicate" handle instead; otherwise add the key and emit "new".
  return { emit: [{ handle: 'new', output: req }] }
}`,
    failureReason:
      'As written, this node has no check — it emits every request on the "new" handle straight to Charge. So when the retry arrives with the same key, nothing stops it and the card is charged a second time. Add the processedKeys check to fix it.',
  },
  charge: {
    explanation:
      'Moves real money. Appends a charge to the world. This step is irreversible.',
    code: `(req, { world }) => {
  world.charges.push({ amount: req.amount, key: req.key })
  return { emit: [{ output: req }] }
}`,
    failureReason:
      'Nothing here is idempotent on its own — every pass that reaches this node creates another charge. The guarding has to happen before this point, never here.',
  },
  record: {
    explanation: 'Persists the successful payment to the ledger.',
    code: `(input) => ({
  emit: [{ output: input }],
})`,
  },
  confirm: {
    explanation:
      'Returns success to the client. On the first attempt the response is lost in transit and routes to the failure path.',
    code: `(req) => {
  if (req.attempt === 1) {
    // first response is lost in transit
    return { emit: [{ handle: 'lost', output: req }] }
  }
  return { emit: [] } // confirmed
}`,
    failureReason:
      'The lost first response is the trigger: the client never hears back, so it retries — with the very same idempotency key.',
  },
  ignore: {
    explanation:
      'A safe no-op. A correct guard routes duplicate keys here instead of charging again, so the retry ends quietly.',
    code: `() => ({ emit: [] })`,
  },
  network: {
    explanation:
      'The retry. Because the first response was lost, the browser resends the same request — now attempt 2, same key.',
    code: `(req) => ({
  // same key, just retried
  emit: [{ output: { ...req, attempt: 2 } }],
})`,
    failureReason:
      'This retry is harmless if the guard catches the duplicate. Without the guard it sails back through the pipeline and charges the card again.',
  },
}

const enrichedNodes: FlowNode[] = nodes.map((node) => ({
  ...node,
  data: { ...node.data, ...INSPECTOR[node.id] },
}))

export const doubleCharge: CaseData = {
  slug: 'double-charge',
  title: 'Case 001: Double Charge',
  businessSituation:
    'A user submits a payment form. The network hiccups and the browser retries. ' +
    'Two identical requests hit the server. Both succeed. The user is charged twice.',
  nodes: enrichedNodes,
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
