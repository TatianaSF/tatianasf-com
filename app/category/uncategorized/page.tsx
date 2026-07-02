import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Legacy WordPress Category",
  description:
    "Legacy WordPress category archive retained only for launch cleanup review.",
  path: "/category/uncategorized",
  noIndex: true
});

export default function UncategorizedLegacyPage() {
  return (
    <PlaceholderPage
      eyebrow="Legacy WordPress URL"
      title="Legacy WordPress Category"
      summary="This archive URL came from the old WordPress sitemap. It is not public site content for the future TatianaSF website and remains noindexed until a Cloudflare redirect or removal decision is approved."
      checkpoints={[
        "Do not add to sitemap",
        "Do not promote as public content",
        "Consider a Cloudflare redirect to the homepage or an intentional 404 at launch"
      ]}
    />
  );
}
