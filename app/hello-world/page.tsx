import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Legacy WordPress Post",
  description:
    "Legacy WordPress default post route retained only for launch cleanup review.",
  path: "/hello-world",
  noIndex: true
});

export default function HelloWorldLegacyPage() {
  return (
    <PlaceholderPage
      eyebrow="Legacy WordPress URL"
      title="Legacy WordPress Post"
      summary="This URL came from the old WordPress sitemap. It is not public site content for the future TatianaSF website and remains noindexed until a Cloudflare redirect or removal decision is approved."
      checkpoints={[
        "Do not add to sitemap",
        "Do not promote as public content",
        "Consider a Cloudflare redirect to the homepage at launch"
      ]}
    />
  );
}
