import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="TatianaSF home">
          {siteConfig.name}
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <Link href={item.path} key={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
