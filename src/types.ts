export type Role = 'user' | 'advisor' | 'admin'

export type AdvisorApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface FinancialAdvisor {
  id: number
  name: string
  city: string
  state: string
  specialties: string[]
  experienceYears: number
  rating: number
  applicationStatus: AdvisorApplicationStatus
}

export interface PlatformUser {
  id: number
  name: string
  email: string
  role: Exclude<Role, 'admin'>
}
