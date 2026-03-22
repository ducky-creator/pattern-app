import "./page.css";
import { Dashboard } from "@/components/dashboard";
import { LogEntryForm } from "@/components/log-entry-form";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Pattern</p>
          <h1>Capture the moments that repeat before they run your day.</h1>
          <p className="hero-copy">
            Log triggers, emotional intensity, and the action you took. Pattern
            turns daily entries into a clean view of what keeps showing up.
          </p>
        </div>
      </section>

      <section className="content-grid">
        <LogEntryForm />
        <Dashboard
          aiInsight={data.aiInsight}
          frameworkLibrary={data.frameworkLibrary}
          recentEntries={data.recentEntries}
          patterns={data.patterns}
        />
      </section>
    </main>
  );
}
