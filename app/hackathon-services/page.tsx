import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hackathon Services Compatibility Route",
  description:
    "Compatibility route for the preserved TatianaSF hackathon services URL.",
  path: "/hackathon_services",
  noIndex: true
});

export default function HackathonServicesPage() {
  return (
    <main className="page">
      <section className="placeholder">
        <div className="placeholder__header">
          <p className="section-label">Compatibility route</p>
          <h1>Hackathon Services</h1>
          <p>
            The preserved WordPress route is the canonical future URL for this
            page. This compatibility placeholder is intentionally noindexed and
            should not be treated as migrated content.
          </p>
        </div>
        <div className="placeholder__actions">
          <Link className="button button--primary" href="/hackathon_services/">
            Open canonical route
          </Link>
        </div>
      </section>
    </main>
  );
}
