import type { Node, Edge } from '@xyflow/react'

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
  nodes: Node[]
  edges: Edge[]
  criticalNodeId: string
  testResults: TestResult[]
  businessImpact: string[]
  finalLesson: string
}
