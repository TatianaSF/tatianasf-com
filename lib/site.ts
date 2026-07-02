export const siteConfig = {
  name: "TatianaSF",
  productionUrl: "https://tatianasf.com",
  description:
    "Static Next.js foundation for the future TatianaSF website migration.",
  navigation: [
    { path: "/hackathon_services/", label: "Hackathon" }
  ],
  routes: [
    {
      path: "/",
      label: "Home",
      title: "TatianaSF foundation",
      description: "Initial static foundation route."
    },
    {
      path: "/hackathon_services/",
      label: "Hackathon",
      title: "Hackathon Services",
      description:
        "Preserved WordPress route for future hackathon services content."
    },
    {
      path: "/photo_portfolio/",
      label: "Photo Portfolio",
      title: "Photo Portfolio",
      description:
        "Preserved WordPress route reserved for future photo portfolio parity migration."
    },
    {
      path: "/openai-codex-design-guide/",
      label: "OpenAI Codex Design Guide",
      title: "OpenAI Codex Design Guide",
      description:
        "Preserved WordPress route reserved for future OpenAI Codex Design Guide parity migration."
    }
  ]
} as const;
