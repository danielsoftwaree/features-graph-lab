import type { CaseData } from '../types/case'

export const doubleCharge: CaseData = {
  slug: 'double-charge',
  title: 'Case 001: Double Charge',
  businessSituation:
    'A user submits a payment form. The network hiccups and the browser retries. ' +
    'Two identical requests hit the server. Both succeed. The user is charged twice.',
  nodes: [
    { id: 'client', position: { x: 0, y: 100 }, data: { label: 'Browser / Client' } },
    { id: 'gateway', position: { x: 200, y: 100 }, data: { label: 'Payment Gateway' } },
    { id: 'idempotency', position: { x: 400, y: 100 }, data: { label: 'Idempotency Check' } },
    { id: 'charge', position: { x: 600, y: 100 }, data: { label: 'Charge Service' } },
    { id: 'db', position: { x: 800, y: 100 }, data: { label: 'Orders DB' } },
  ],
  edges: [
    { id: 'e1', source: 'client', target: 'gateway' },
    { id: 'e2', source: 'gateway', target: 'idempotency' },
    { id: 'e3', source: 'idempotency', target: 'charge' },
    { id: 'e4', source: 'charge', target: 'db' },
  ],
  criticalNodeId: 'idempotency',
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
