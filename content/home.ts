export type HomeLink = {
  label: string;
  href: string;
};

export type HomeImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LinkedText = {
  text?: string;
  link?: HomeLink;
  after?: string;
  secondaryLink?: HomeLink;
  suffix?: string;
};

export const homeContent = {
  title: "TatianaSF",
  metadata: {
    title: "⭐TatianaSF",
    description: "Name: Tatiana Isa",
    ogImagePath: "/og/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png"
  },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/tatianasf/"
    }
  ],
  heroImage: {
    src: "/images/pages/home/tatianasf-photo-main.jpg",
    alt: "Tatiana Isa at an event",
    width: 1074,
    height: 1203
  },
  personalBackground: [
    "Name: Tatiana Isa",
    "Origin: non-American, Ukrainian",
    "Location: San Francisco, California, USA",
    "Entrepreneur, 5x founder, survivor, 20 years of experience",
    "granted O-1A, EB-2 NIW"
  ],
  work: [
    {
      text: "OpenAI Codex Ambassador"
    },
    {
      text: "Founder at HackathonSF ",
      link: {
        label: "(San Francisco, CA)",
        href: "https://kitsf.com/?swcfpc=1"
      },
      after: "- hackathon facilitation for companies"
    },
    {
      text: "Co-Founder & GP at ",
      link: {
        label: "kitSF (San Francisco, CA)",
        href: "https://kitsf.com/?swcfpc=1"
      },
      after: "- Investing in individual talent"
    },
    {
      text: "Co-Founder at ",
      link: {
        label: "Trinity Upgrade Academy (San Francisco, CA)",
        href: "https://trinityua.com/?swcfpc=1"
      },
      after: "- Admission test prep center & ESL courses"
    },
    {
      text: "Founder at ",
      link: {
        label: "Trinity Education Group (Ukraine)",
        href: "https://edu.trinityua.com/?swcfpc=1"
      },
      after: "- Admission test prep center & ESL courses"
    },
    {
      text: "Co-Founder at ",
      link: {
        label: "SATSF (San Francisco, CA)",
        href: "https://satsf.com/?swcfpc=1"
      },
      after: "- Math courses with experts"
    },
    {
      text: "Founder at ",
      link: {
        label: "UATEG 501(c)3",
        href: "https://uateg.com/?swcfpc=1"
      }
    },
    {
      text: "Advisor at ",
      link: {
        label: "openaisf.com",
        href: "https://openaisf.com/?swcfpc=1"
      },
      after: " (San Francisco, CA)"
    }
  ],
  workImage: {
    src: "/images/pages/home/img-1249.jpg",
    alt: "Tatiana Isa near the Golden Gate Bridge",
    width: 600,
    height: 400
  },
  education: [
    "Golden Gate University Extension program, San Francisco, CA",
    "Stanford University Extension, Stanford, CA",
    "Tallinn School of Management, Tallinn",
    "Unit School of Business",
    "National University of Economics and Trade",
    "Medical college"
  ],
  skills: [
    "Entrepreneurship",
    "Mentorship",
    "Startups",
    "Project Management",
    "Strategic Planning",
    "Recruitment",
    "Sales",
    "Marketing"
  ],
  recognition: [
    "Recognition: Individuals with Extraordinary Ability or Achievement in the U.S., granted O-1A (US extraordinary ability status), EB-2 NIW (Employment-Based National Interest Waiver for people who are highly skilled or have advanced degrees)",
    "Conducted more than 10k job interviews with candidates as a founder",
    "96% of my students got admissions to the TOP Universities the US and Europe"
  ],
  certification: {
    title: "Professional Certification",
    text: "Inbound sales (by HubSpot)",
    image: {
      src: "/images/pages/home/hubspot-inbound-sales-1024x790.png",
      alt: "HubSpot Inbound Sales certification",
      width: 1024,
      height: 790
    }
  },
  philosophy: [
    "Philosophy: Helps others, especially those facing challenges in a new country, using her own experience as an immigrant.",
    "Mission: Create bridges between cultures and business communities, making it easier for non-Americans to adapt and succeed in the US."
  ],
  mediaPresence: [
    {
      text: "Judge at ",
      link: {
        label: "The Children's Business Fair",
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7257525019495313409/?swcfpc=1"
      },
      after: " in Menlo Park, California: 21 teams of children participated and presented their projects, October 2024;"
    },
    {
      text: "Judge and organizer of ",
      link: {
        label: "The GPT Hackathon",
        href: "https://www.linkedin.com/posts/tanyasf_the-gpt-hackathon-is-complete-13-teams-activity-7162335104801910784-hFUv?utm_source=share&utm_medium=member_desktop&swcfpc=1"
      },
      after: " in San Francisco: 14 teams participated and presented their projects, February 2024;"
    },
    {
      link: {
        label: "Speaker at SilkRoad Innovation Hub in Palo Alto",
        href: "https://www.linkedin.com/posts/tanyasf_entrepreneurship-fundraising-startups-activity-7165261229396099072-vzAz?swcfpc=1"
      },
      after: ": Topic: Fundraising for Early-Stage startups - My personal Story, February 2024;"
    },
    {
      text: "Guest speaker on the panel discussion at ",
      link: {
        label: "Hacker Dojo HQ",
        href: "https://hackerdojo.org/?swcfpc=1"
      },
      after: " in Mountain View, California: Topic: ",
      secondaryLink: {
        label: "The Great Job Market AI-vasion: Are You Ready?",
        href: "https://www.linkedin.com/posts/tanyasf_hackerdojo-ai-jobmarket-activity-7133218161834819584-R_2q?utm_source=share&utm_medium=member_desktop&swcfpc=1"
      },
      suffix: " Moderator: Eric Hess, Executive Director of Hacker Dojo, November 2023;"
    },
    {
      text: "Podcast speaker on Vsi Svoi with Kateryna Stepurskaya, February 2024;"
    },
    {
      text: "Podcast speaker on ",
      link: {
        label: "Foreign Founders",
        href: "https://www.linkedin.com/company/foreign-founders/?swcfpc=1"
      },
      after: " with Andy Nobutaka Chiang: Tatyana Isa, Co-Founder of kitSF, March 2024;"
    },
    {
      text: "Podcast speaker on ",
      link: {
        label: "Imran's Podcast",
        href: "https://www.youtube.com/@ImransPodcast?swcfpc=1"
      },
      after: " with Imran Sheikh, Topic: Ukraine to Silicon Valley: GP for kitSF, O1 Visas, & Hiring Insights with Tatyana Isa, Feb 2024;"
    },
    {
      text: "Podcast speaker on The First Customer - KitSF's Trailblazer: Tanya Isa on Building a Business from Scratch with Jay Aigner, July 2023;"
    },
    {
      text: "Podcast speaker on Knowledgeable Entrepreneur, June 2023;"
    },
    {
      text: "Co-hosted ",
      link: {
        label: "The Pitch Session Event",
        href: "https://www.linkedin.com/posts/tanyasf_pitchseries-startuplife-innovationhub-activity-7152800510645817344-2drd?utm_source=share&utm_medium=member_desktop&swcfpc=1"
      },
      after: " at HackerHouse in San Francisco, February 2024;"
    },
    {
      text: "Guest speaker at ",
      link: {
        label: "Rubic.us",
        href: "http://rubic.us/?swcfpc=1"
      },
      after: ": Topic: How a Ukrainian Woman helps Indian programmers work in Silicon Valley with Kateryna Panova, Jul 2023;"
    },
    {
      text: "Guest speaker at Women Founders Networking Event, January 2024;"
    },
    {
      text: "About Tatyana Isa: Founder of UATEG, Article in ",
      link: {
        label: "Majordigest.com",
        href: "https://majordigest.com/press-release/uateg-helps-ukrainian-children/?swcfpc=1"
      },
      after: ", Title: UATEG Ukraine's Future is Calling: UATEG Helps Ukrainian Children, August 2023;"
    },
    {
      text: "Guest speaker at ",
      link: {
        label: "The Super Founder Speaker Series",
        href: "https://www.linkedin.com/posts/jeremydbarr_the-mega-founder-investor-event-is-here-activity-7170886977142054913-eTFX?utm_source=share&utm_medium=member_desktop"
      },
      after: ", March 15th, 2024, etc."
    }
  ],
  friends: [
    {
      title: "Harris (9.4 M subscribers) - Code with Harry",
      href: "https://www.youtube.com/@CodeWithHarry"
    },
    {
      title: "Harnoor (1.2 M subscribers) - Singh in USA",
      href: "https://www.youtube.com/@CodeWithHarry"
    }
  ]
} as const;
