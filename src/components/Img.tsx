import media from "../../content/media.json";

type MediaEntry = { width: number; height: number; small?: string; smallWidth?: number };
const MEDIA = media as Record<string, MediaEntry>;

type Props = { src: string; alt: string; sizes?: string; className?: string; priority?: boolean };

// Pre-optimised WebP image (content/media.json): srcset with the 480 px copy, intrinsic size, lazy by default.
export default function Img({ src, alt, sizes = "(max-width: 768px) 100vw, 600px", className, priority }: Props) {
  const m = MEDIA[src];
  const srcSet = m?.small ? `${m.small} ${m.smallWidth}w, ${src} ${m.width}w` : undefined;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={m?.width}
      height={m?.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
