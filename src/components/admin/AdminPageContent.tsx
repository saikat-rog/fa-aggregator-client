import { useSearchParams } from "react-router-dom";
import { viewIcons, views, type AdminView, panelClassName } from "./adminPage.shared";
import { UsersPanel } from "./panels/UsersPanel";
import { AdvisorsPanel } from "./panels/AdvisorsPanel";
import { ApplicationsPanel } from "./panels/ApplicationsPanel";
import { IndustriesPanel } from "./panels/IndustriesPanel";
import { BlogsPanel } from "./panels/BlogsPanel";

export function AdminPageContent() {
  const [params, setParams] = useSearchParams();
  const activeView = (params.get("view") as AdminView) || "users";
  const view = views.includes(activeView) ? activeView : "users";

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const setManyParams = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(updates)) {
      if (!value) next.delete(key);
      else next.set(key, value);
    }
    setParams(next, { replace: true });
  };

  return (
    <div className="space-y-4">
      <div className={`${panelClassName} p-3`}>
        <div className="flex flex-wrap gap-2">
          {views.map((item) => {
            const Icon = viewIcons[item];
            return (
              <button key={item} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition ${view === item ? "border-blue-700 bg-blue-700 text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"}`} onClick={() => setParam("view", item)}>
                <Icon className="h-3.5 w-3.5" />
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {view === "users" ? <UsersPanel params={params} setParam={setParam} setManyParams={setManyParams} /> : null}
      {view === "advisors" ? <AdvisorsPanel params={params} setParam={setParam} /> : null}
      {view === "applications" ? <ApplicationsPanel params={params} setParam={setParam} /> : null}
      {view === "industries" ? <IndustriesPanel /> : null}
      {view === "blogs" ? <BlogsPanel params={params} setParam={setParam} setManyParams={setManyParams} /> : null}
    </div>
  );
}
