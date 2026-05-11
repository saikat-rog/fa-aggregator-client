import { useState } from 'react'

export function AdvisorHomePage() {
  const [bio, setBio] = useState('Helping families build stable and tax-efficient portfolios.')
  const [location, setLocation] = useState('Austin, TX')
  const [services, setServices] = useState('Retirement, SIP, Risk Management')

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-700">/fa • Advisor Dashboard</p>
        <h1 className="text-2xl font-bold text-slate-900">Manage Your Financial Advisor Profile</h1>
        <p className="mt-1 text-slate-600">Edit your details, highlight services, and keep your profile fresh for users.</p>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Profile Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Location
            <input value={location} onChange={(event) => setLocation(event.target.value)} className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Services
            <input value={services} onChange={(event) => setServices(event.target.value)} className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400" />
          </label>
        </div>
        <label className="mt-4 block space-y-2 text-sm text-slate-700">
          Bio
          <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={5} className="w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-400" />
        </label>
        <button className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">Save Changes</button>
      </section>
    </div>
  )
}
