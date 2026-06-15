import type { FlowEdge, FlowNode } from '@/shared/types/flow'

export type CaseStatus = 'available' | 'coming-soon'

export type CaseMeta = {
  slug: string
  title: string
  description: string
  status: CaseStatus
}

export type TestResult = {
  name: string
  passed: boolean
}

export type CaseData = {
  slug: string
  title: string
  businessSituation: string
  nodes: FlowNode[]
  edges: FlowEdge[]
  entryNodeId: string
  criticalNodeId: string
  testResults: TestResult[]
  businessImpact: string[]
  finalLesson: string
}
