import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description:
    "A static Next.js foundation for the future TatianaSF website migration.",
  path: "/"
});

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero__content">
          <p className="section-label">Static foundation</p>
          <h1>TatianaSF website foundation</h1>
          <p className="hero__lead">
            This placeholder site prepares a clean Next.js architecture for a
            future WordPress parity migration. Content migration has not started
            yet.
          </p>
          <div className="hero__actions" aria-label="Primary routes">
            <Link className="button button--primary" href="/hackathon_services/">
              Hackathon Services
            </Link>
          </div>
        </div>
        <div className="foundation-panel" aria-label="Foundation status">
          <div>
            <span className="status-dot" aria-hidden="true" />
            <span>Static export ready</span>
          </div>
          <div>
            <span className="status-dot" aria-hidden="true" />
            <span>No runtime backend</span>
          </div>
          <div>
            <span className="status-dot" aria-hidden="true" />
            <span>GitHub Pages staging</span>
          </div>
        </div>
      </section>

      <section className="section" id="routes">
        <div className="section__header">
          <p className="section-label">Launch-safe routes</p>
          <h2>Canonical routes</h2>
          <p>
            Only launch-safe canonical routes are listed here. Future structure
            pages remain hidden until reviewed public content is ready.
          </p>
        </div>
        <div className="route-grid">
          {siteConfig.routes.map((route) => (
            <Link className="route-card" href={route.path} key={route.path}>
              <span>{route.label}</span>
              <strong>{route.title}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
