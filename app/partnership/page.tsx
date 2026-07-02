import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Partnership",
  description:
    "Reserved future TatianaSF site structure route for partnership content.",
  path: "/partnership",
  noIndex: true
});

export default function PartnershipPage() {
  return (
    <PlaceholderPage
      eyebrow="Future structure route"
      title="Partnership"
      summary="This page is reserved for the future TatianaSF site structure. It is not migrated WordPress content and will remain noindexed until final public content is approved."
      checkpoints={[
        "Keep out of sitemap until content is ready",
        "Hide from primary navigation during launch preparation",
        "Add reviewed public content in a later migration step"
      ]}
    />
  );
}
