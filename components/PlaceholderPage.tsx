import Link from "next/link";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  checkpoints: string[];
};

export function PlaceholderPage({
  eyebrow,
  title,
  summary,
  checkpoints
}: PlaceholderPageProps) {
  return (
    <main className="page">
      <section className="placeholder">
        <div className="placeholder__header">
          <p className="section-label">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
        <div className="checklist-grid" aria-label={`${title} migration notes`}>
          {checkpoints.map((checkpoint, index) => (
            <div className="checklist-card" key={checkpoint}>
              <span>Step {index + 1}</span>
              <strong>{checkpoint}</strong>
            </div>
          ))}
        </div>
        <div className="placeholder__actions">
          <Link className="button button--secondary" href="/">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
