import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hackathon Services",
  description:
    "Preserved placeholder route for future TatianaSF hackathon services content.",
  path: "/hackathon_services"
});

export default function HackathonServicesPage() {
  return (
    <PlaceholderPage
      eyebrow="Preserved WordPress route"
      title="Hackathon Services"
      summary="This placeholder preserves the current WordPress canonical route. Final content will be added only after screenshots, assets, and parity work are approved."
      checkpoints={[
        "Preserve this URL as the primary route",
        "Collect screenshots for visual parity later",
        "Add final content in a later migration step"
      ]}
    />
  );
}
