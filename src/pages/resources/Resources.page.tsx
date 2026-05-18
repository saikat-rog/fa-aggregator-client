import { useEffect, useMemo, useState } from "react";
import { FiBookOpen, FiExternalLink, FiGlobe, FiShield } from "react-icons/fi";

type ResourceItem = {
  title: string;
  description: string;
  url: string;
};

type ResourceCategory = {
  id: string;
  title: string;
  items: ResourceItem[];
};

type ResourcesPayload = {
  title: string;
  subtitle: string;
  categories: ResourceCategory[];
};

const categoryIcon = (categoryId: string) => {
  if (categoryId.includes("regulatory")) return <FiShield className="h-5 w-5" />;
  if (categoryId.includes("global")) return <FiGlobe className="h-5 w-5" />;
  return <FiBookOpen className="h-5 w-5" />;
};

export function ResourcesPage() {
  const [data, setData] = useState<ResourcesPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch("/resources.json", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load resources");
        }
        const payload = (await response.json()) as ResourcesPayload;
        setData(payload);
      } catch {
        setError("Could not load resources right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadResources();
  }, []);

  const categories = useMemo(() => data?.categories ?? [], [data]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-blue-700 to-blue-800 px-6 py-16 text-center text-white lg:px-10">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%)]" />
        <h1 className="relative text-4xl font-bold lg:text-6xl">{data?.title ?? "Important Links"}</h1>
        <p className="relative mx-auto mt-4 max-w-2xl text-lg text-white">
          {data?.subtitle ?? "Curated resources to support your financial awareness journey."}
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading resources...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <section key={category.id} className="space-y-4">
              <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900">
                <span className="text-blue-600">{categoryIcon(category.id)}</span>
                {category.title}
              </h2>

              <div className="space-y-4">
                {category.items.map((item) => (
                  <article
                    key={`${category.id}-${item.title}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-3xl/8 font-semibold text-slate-900 lg:text-2xl/8">{item.title}</h3>
                    <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Visit Resource
                      <FiExternalLink className="h-4 w-4" />
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
