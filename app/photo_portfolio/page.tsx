import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Photo Portfolio",
  description:
    "Preserved placeholder route reserved for the future TatianaSF WordPress photo portfolio parity migration.",
  path: "/photo_portfolio/"
});

export default function PhotoPortfolioPage() {
  return (
    <PlaceholderPage
      eyebrow="Preserved WordPress route"
      title="Photo Portfolio"
      summary="This placeholder reserves the current WordPress photo portfolio URL for the future WordPress parity migration. Final portfolio content will be added only after route scope, assets, and visual parity work are approved."
      checkpoints={[
        "Preserve this URL as a migration-scope route",
        "Keep out of primary navigation until content parity is built",
        "Use Batch 2 assets only after portfolio page rebuild work is approved"
      ]}
    />
  );
}
