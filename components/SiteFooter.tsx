import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>{siteConfig.name}</span>
        <span>Static Next.js foundation for future migration work.</span>
      </div>
    </footer>
  );
}
