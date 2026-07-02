import Image from "next/image";
import type { HomeImage } from "@/content/home";

type ProfileImageProps = {
  image: HomeImage;
  priority?: boolean;
  className?: string;
};

export function ProfileImage({
  image,
  priority = false,
  className = ""
}: ProfileImageProps) {
  return (
    <figure className={`home-image ${className}`.trim()}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes="(max-width: 760px) calc(100vw - 48px), 645px"
      />
    </figure>
  );
}
