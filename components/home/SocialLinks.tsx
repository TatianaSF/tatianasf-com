import type { HomeLink } from "@/content/home";

type SocialLinksProps = {
  links: readonly HomeLink[];
};

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <div className="home-social" aria-label="Social links">
      {links.map((link) => (
        <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
          {link.label}
        </a>
      ))}
    </div>
  );
}
