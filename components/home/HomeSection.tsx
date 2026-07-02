import type { ReactNode } from "react";

type HomeSectionProps = {
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
};

export function HomeSection({
  title,
  icon,
  children,
  className = ""
}: HomeSectionProps) {
  return (
    <section className={`home-section ${className}`.trim()}>
      <h2>
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {title}
      </h2>
      {children}
    </section>
  );
}
