"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface CategoryCardImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
}

export function CategoryCardImage({
  src,
  fallbackSrc,
  alt,
}: CategoryCardImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      onError={() => {
        // Fallback to static category asset if the remote service image fails to load
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
