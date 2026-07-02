import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "OpenAI Codex Design Guide",
  description:
    "Preserved placeholder route reserved for the future TatianaSF WordPress OpenAI Codex Design Guide parity migration.",
  path: "/openai-codex-design-guide/"
});

export default function OpenAiCodexDesignGuidePage() {
  return (
    <PlaceholderPage
      eyebrow="Preserved WordPress route"
      title="OpenAI Codex Design Guide"
      summary="This placeholder reserves the current WordPress OpenAI Codex Design Guide URL for the future WordPress parity migration. Final page content and external access checks will be added only after migration scope is approved."
      checkpoints={[
        "Preserve this URL as a migration-scope route",
        "Keep out of primary navigation until content parity is built",
        "Plan the remaining page asset work before rebuilding this page"
      ]}
    />
  );
}
