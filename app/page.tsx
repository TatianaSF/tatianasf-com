import type { Metadata } from "next";
import Image from "next/image";
import { HomeSection } from "@/components/home/HomeSection";
import { LinkedTextLine } from "@/components/home/LinkCard";
import { ProfileImage } from "@/components/home/ProfileImage";
import { SocialLinks } from "@/components/home/SocialLinks";
import { homeContent } from "@/content/home";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: homeContent.metadata.title,
  description: homeContent.metadata.description,
  path: "/",
  ogImagePath: homeContent.metadata.ogImagePath
});

export default function HomePage() {
  return (
    <main className="home-page">
      <article className="home-content">
        <section className="home-intro" aria-labelledby="home-title">
          <h1 id="home-title">
            <span aria-hidden="true">⭐</span>
            {homeContent.title}
          </h1>
          <ProfileImage
            className="home-image--hero"
            image={homeContent.heroImage}
            priority
          />
          <SocialLinks links={homeContent.socialLinks} />
        </section>

        <HomeSection icon="📝" title="Personal Background:">
          <ul className="home-list home-list--plain">
            {homeContent.personalBackground.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </HomeSection>

        <HomeSection icon="💼" title="Work:">
          <ul className="home-list">
            {homeContent.work.map((item, index) => (
              <li key={`work-${index}`}>
                <LinkedTextLine item={item} />
              </li>
            ))}
          </ul>
          <ProfileImage
            className="home-image--work"
            image={homeContent.workImage}
          />
        </HomeSection>

        <HomeSection icon="🎓" title="Education:">
          <ul className="home-list">
            {homeContent.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </HomeSection>

        <HomeSection icon="🛠️" title="Skills and Competencies:">
          <ul className="home-list">
            {homeContent.skills.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </HomeSection>

        <HomeSection
          className="home-section--spaced"
          icon="🌟"
          title="Recognition and Achievements:"
        >
          <ul className="home-list home-list--recognition">
            {homeContent.recognition.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </HomeSection>

        <HomeSection
          className="home-section--spaced"
          icon="🌟"
          title={homeContent.certification.title}
        >
          <p>{homeContent.certification.text}</p>
          <figure className="home-certification">
            <Image
              src={homeContent.certification.image.src}
              alt={homeContent.certification.image.alt}
              width={homeContent.certification.image.width}
              height={homeContent.certification.image.height}
              sizes="(max-width: 760px) 176px, 214px"
            />
          </figure>
        </HomeSection>

        <HomeSection
          className="home-section--spaced home-section--philosophy"
          icon="💬"
          title="Personal Philosophy & Mission:"
        >
          {homeContent.philosophy.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </HomeSection>

        <HomeSection
          className="home-section--media"
          icon="🌟"
          title="Presence in the media:"
        >
          <ol className="home-media-list">
            {homeContent.mediaPresence.map((item, index) => (
              <li key={`media-${index}`}>
                <LinkedTextLine item={item} />
              </li>
            ))}
          </ol>
        </HomeSection>

        <HomeSection className="home-section--friends" icon="🌟" title="My friends">
          <div className="home-friends">
            {homeContent.friends.map((friend) => (
              <h3 key={friend.title}>
                <a href={friend.href} rel="noreferrer" target="_blank">
                  {friend.title}
                </a>
              </h3>
            ))}
          </div>
        </HomeSection>
      </article>
    </main>
  );
}
