import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/" prefetch={false}>{siteConfig.name}</Link>
          <span>Think differently and cut it in half. With love from San Francisco</span>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/hackathon_services/" prefetch={false}>Hackathon services</Link>
          <Link href="/hackathon_services/" prefetch={false}>Hackathon services</Link>
          <a href="https://www.linkedin.com/in/tatianasf/" rel="noreferrer" target="_blank">
            contact me
          </a>
        </nav>
      </div>
    </footer>
  );
}
