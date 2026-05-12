import { useEffect, useMemo, useState } from 'react'

interface AdvisorApiItem {
  _id: string
  name?: string
  email?: string
  advisorProfile?: {
    country?: string
    state?: string
    about?: string
    expertiseIndeces?: string[]
    marketFocus?: string[]
    verificationStatus?: string
  }
}

interface AdvisorCard {
  id: string
  name: string
  country: string
  state: string
  specialties: string[]
  about: string
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:5001/api'

export function HomePage() {
  const [query, setQuery] = useState('')
  const [advisors, setAdvisors] = useState<AdvisorCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadAdvisors = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/advisor`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.msg || 'Failed to fetch advisors')
        }

        const mapped = ((payload?.advisors as AdvisorApiItem[]) || []).map((item) => ({
          id: item._id,
          name: item.name || 'Unnamed Advisor',
          country: item.advisorProfile?.country || 'Unknown country',
          state: item.advisorProfile?.state || 'Unknown state',
          specialties: item.advisorProfile?.expertiseIndeces?.length
            ? item.advisorProfile.expertiseIndeces
            : item.advisorProfile?.marketFocus?.length
              ? item.advisorProfile.marketFocus
              : ['General Planning'],
          about: item.advisorProfile?.about || item.email || 'No advisor bio available yet.',
        }))

        setAdvisors(mapped)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        const message = err instanceof Error ? err.message : 'Unable to load advisors'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadAdvisors()

    return () => {
      controller.abort()
    }
  }, [])

  const filteredAdvisors = useMemo(() => {
    const term = query.toLowerCase().trim()

    return advisors.filter((advisor) => {
      if (!term) {
        return true
      }

      const haystack = `${advisor.country} ${advisor.state} ${advisor.specialties.join(' ')} ${advisor.name} ${advisor.about}`.toLowerCase()

      return haystack.includes(term)
    })
  }, [advisors, query])

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg shadow-blue-100">
        <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
          /u • User Home
        </p>
        <h1 className="text-3xl font-bold">Find Trusted Financial Advisors Near You</h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          Search by location, specialty, or advisor name and discover verified experts.
        </p>
        <div className="mt-6 rounded-2xl bg-white p-2">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by country, state, service, or advisor name"
            className="w-full rounded-xl px-4 py-3 text-slate-900 outline-none"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-800">Available Financial Advisors</h2>

        {isLoading ? (
          <p className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">Loading advisors...</p>
        ) : null}

        {error ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}. Make sure backend is running on <code>{API_BASE_URL}</code>.
          </p>
        ) : null}

        {!isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAdvisors.map((advisor) => (
              <article key={advisor.id} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">{advisor.name}</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Verified</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {advisor.state}, {advisor.country}
                </p>
                <p className="mt-2 text-sm text-slate-500">{advisor.about}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {advisor.specialties.map((item) => (
                    <span key={`${advisor.id}-${item}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {!isLoading && !error && filteredAdvisors.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            No advisors matched your search. Try another location or specialty.
          </p>
        ) : null}
      </section>
    </div>
  )
}
