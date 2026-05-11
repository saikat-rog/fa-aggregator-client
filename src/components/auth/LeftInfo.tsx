import { Link } from 'react-router-dom';

const LeftInfo = () => {
    return (
        <section className="rounded-3xl bg-linear-to-br from-blue-700 to-cyan-500 p-8 text-white shadow-xl shadow-blue-100">
        <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">/auth</p>
        <h1 className="text-3xl font-bold">Welcome to FinBlue</h1>
        <p className="mt-2 text-blue-100">A sleek place where users and financial advisors connect with trust.</p>
        <ul className="mt-8 space-y-3 text-sm text-blue-50">
          <li>Fast advisor discovery by location</li>
          <li>Role based login and onboarding</li>
          <li>Simple admin verification workflow</li>
        </ul>
        <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm">
          Admin? Use <Link to="/lol" className="font-semibold underline">`/lol`</Link> for admin login.
        </div>
      </section>
    );
};

export default LeftInfo;