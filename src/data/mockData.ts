import type { FinancialAdvisor, PlatformUser } from '../types'

export const initialAdvisors: FinancialAdvisor[] = [
  {
    id: 1,
    name: 'Aarav Mehta',
    city: 'New York',
    state: 'NY',
    specialties: ['Retirement', 'Tax Planning'],
    experienceYears: 9,
    rating: 4.8,
    applicationStatus: 'approved',
  },
  {
    id: 2,
    name: 'Sophia Bennett',
    city: 'San Francisco',
    state: 'CA',
    specialties: ['Wealth Management', 'Mutual Funds'],
    experienceYears: 7,
    rating: 4.7,
    applicationStatus: 'approved',
  },
  {
    id: 3,
    name: 'Liam Walker',
    city: 'Austin',
    state: 'TX',
    specialties: ['Insurance', 'Estate Planning'],
    experienceYears: 5,
    rating: 4.5,
    applicationStatus: 'pending',
  },
  {
    id: 4,
    name: 'Isabella Ross',
    city: 'Miami',
    state: 'FL',
    specialties: ['SIP', 'Portfolio Rebalancing'],
    experienceYears: 6,
    rating: 4.6,
    applicationStatus: 'approved',
  },
]

export const initialUsers: PlatformUser[] = [
  { id: 1, name: 'Noah Carter', email: 'noah@example.com', role: 'user' },
  { id: 2, name: 'Mia Clarke', email: 'mia@example.com', role: 'advisor' },
  { id: 3, name: 'Ethan Price', email: 'ethan@example.com', role: 'user' },
]
