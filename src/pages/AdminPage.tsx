import { useMemo, useState } from 'react'
import type { AdvisorApplicationStatus } from '../types'
import { initialAdvisors, initialUsers } from '../data/mockData'

export function AdminPage() {
  const [advisors, setAdvisors] = useState(initialAdvisors)
  const isAuthenticated = typeof window !== 'undefined' && Boolean(localStorage.getItem('token'))
  const authRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null

  const updateStatus = (id: number, status: AdvisorApplicationStatus) => {
    setAdvisors((prev) => prev.map((item) => (item.id === id ? { ...item, applicationStatus: status } : item)))
  }

  const pendingCount = useMemo(
    () => advisors.filter((advisor) => advisor.applicationStatus === 'pending').length,
    [advisors],
  )

  const handleAdminLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // const formData = new FormData(event.currentTarget)
    // const email = String(formData.get('email') || 'admin@finblue.com')
  }

  if (!isAuthenticated || authRole !== 'admin') {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-700">/lol • Admin Login</p>
        <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
        <p className="mt-1 text-sm text-slate-600">Login as admin to review users and advisor applications.</p>

        <form onSubmit={handleAdminLogin} className="mt-5 space-y-3">
          <input name="email" type="email" required placeholder="Admin email" className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400" />
          <input name="password" type="password" required placeholder="Password" className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400" />
          <button className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">Login as Admin</button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-linear-to-r from-slate-900 to-blue-900 p-6 text-white">
        <p className="text-sm font-semibold text-blue-200">/lol • Admin Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold">Admin Control Panel</h1>
        <p className="mt-1 text-sm text-blue-100">Monitor users, advisors, and approve/reject advisor applications.</p>
        <p className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm">Pending approvals: {pendingCount}</p>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Advisor Applications</h2>
        <div className="space-y-3">
          {advisors.map((advisor) => (
            <article key={advisor.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{advisor.name}</h3>
                  <p className="text-sm text-slate-600">{advisor.city}, {advisor.state}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    advisor.applicationStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : advisor.applicationStatus === 'rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {advisor.applicationStatus}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateStatus(advisor.id, 'approved')}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(advisor.id, 'rejected')}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">All Users</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {initialUsers.map((user) => (
            <article key={user.id} className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-600">{user.email}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-blue-700">Role: {user.role}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
