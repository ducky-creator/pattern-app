import type { FrameworkDomain } from "@/lib/frameworks";
import type { AiInsight, DetectedPattern, PatternEntry } from "@/lib/types";

type DashboardProps = {
  recentEntries: PatternEntry[];
  patterns: DetectedPattern[];
  aiInsight: AiInsight | null;
  frameworkLibrary: FrameworkDomain[];
};

export function Dashboard({
  recentEntries,
  patterns,
  aiInsight,
  frameworkLibrary
}: DashboardProps) {
  return (
    <section className="dashboard-column">
      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Recent Entries</p>
            <h2>Latest check-ins</h2>
          </div>
        </div>

        <div className="entry-list">
          {recentEntries.length === 0 ? (
            <EmptyState copy="No entries yet. Your first log will appear here." />
          ) : (
            recentEntries.map((entry) => (
              <article className="entry-card" key={entry.id}>
                <div className="entry-card-top">
                  <span>{entry.emotion}</span>
                  <span>{entry.intensity}/10</span>
                </div>
                <p>{entry.trigger}</p>
                <small>{entry.action}</small>
                <time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
              </article>
            ))
          )}
        </div>
      </article>

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Detected Patterns</p>
            <h2>Signals worth noticing</h2>
          </div>
        </div>

        <div className="pattern-list">
          {patterns.length === 0 ? (
            <EmptyState copy="Not enough data yet. Add a few entries to surface patterns." />
          ) : (
            patterns.map((pattern) => (
              <article className="pattern-card" key={pattern.id}>
                <strong>{pattern.title}</strong>
                <div className="analysis-block">
                  <span>Frameworks Applied:</span>
                  <p>{pattern.frameworksApplied.join(" • ")}</p>
                </div>
                <div className="analysis-block">
                  <span>Detected Pattern:</span>
                  <p>{pattern.detectedPattern}</p>
                </div>
                <div className="analysis-block">
                  <span>Neuroscience Explanation:</span>
                  <p>{pattern.neuroscienceExplanation}</p>
                </div>
                <div className="analysis-block">
                  <span>Why this is happening:</span>
                  <p>{pattern.whyThisIsHappening}</p>
                </div>
                <div className="analysis-block">
                  <span>Risk:</span>
                  <p>{pattern.risk}</p>
                </div>
                <div className="analysis-block">
                  <span>Recommended Action:</span>
                  <p>{pattern.recommendedAction}</p>
                </div>
                {pattern.recommendations?.length ? (
                  <div className="pattern-recommendations">
                    <span>Recommendation</span>
                    <ul>
                      {pattern.recommendations.map((recommendation) => (
                        <li key={recommendation}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </article>

      {aiInsight ? (
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">AI Insight</p>
              <h2>Neuroscience analysis</h2>
            </div>
          </div>

          <article className="pattern-card">
            <div className="analysis-block">
              <span>Frameworks Applied:</span>
              <p>{aiInsight.frameworksApplied.join(" • ")}</p>
            </div>
            <div className="analysis-block">
              <span>Detected Pattern:</span>
              <p>{aiInsight.detectedPattern}</p>
            </div>
            <div className="analysis-block">
              <span>Neuroscience Explanation:</span>
              <p>{aiInsight.neuroscienceExplanation}</p>
            </div>
            <div className="analysis-block">
              <span>Why this is happening:</span>
              <p>{aiInsight.whyThisIsHappening}</p>
            </div>
            <div className="analysis-block">
              <span>Risk:</span>
              <p>{aiInsight.risk}</p>
            </div>
            <div className="analysis-block">
              <span>Recommended Action:</span>
              <p>{aiInsight.recommendedAction}</p>
            </div>
          </article>
        </article>
      ) : null}

      <article className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Embedded Library</p>
            <h2>Frameworks in use</h2>
          </div>
        </div>

        <div className="framework-grid">
          {frameworkLibrary.map((domain) => (
            <article className="pattern-card" key={domain.name}>
              <strong>{domain.name}</strong>
              <p>{domain.theories.join(" • ")}</p>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function EmptyState({ copy }: { copy: string }) {
  return <p className="empty-state">{copy}</p>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}
