"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function ImageFallback({ src, alt, className, width, height }: { src: string; alt: string; className?: string; width?: number; height?: number }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return <img src={src} alt={alt} className={className} width={width} height={height} />;
  }

  return (
    // @ts-ignore next/image onError supported in client
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
