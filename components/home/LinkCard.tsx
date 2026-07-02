import type { LinkedText } from "@/content/home";

type LinkedTextLineProps = {
  item: LinkedText;
};

export function LinkedTextLine({ item }: LinkedTextLineProps) {
  return (
    <>
      {item.text}
      {item.link ? (
        <a href={item.link.href} rel="noreferrer" target="_blank">
          {item.link.label}
        </a>
      ) : null}
      {item.after}
      {item.secondaryLink ? (
        <a href={item.secondaryLink.href} rel="noreferrer" target="_blank">
          {item.secondaryLink.label}
        </a>
      ) : null}
      {item.suffix}
    </>
  );
}
