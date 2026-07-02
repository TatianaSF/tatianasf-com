export const siteConfig = {
  name: "TatianaSF",
  productionUrl: "https://tatianasf.com",
  description:
    "Personal homepage for Tatiana Isa, also known as TatianaSF.",
  navigation: [
    { path: "/", label: "Home" },
    { path: "/hackathon_services/", label: "Hackathon services" }
  ],
  routes: [
    {
      path: "/",
      label: "Home",
      title: "TatianaSF",
      description: "Preserved WordPress homepage parity route."
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
