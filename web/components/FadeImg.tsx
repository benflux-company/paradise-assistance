"use client";

import { useEffect, useRef, useState } from "react";

// Plain <img> tags pop in abruptly once loaded, with no transition — jarring
// at real network latency (not an issue on localhost, which is why it was
// easy to miss). This fades each image in on load instead.
export default function FadeImg({
  style,
  onLoad,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A cached image can already be `.complete` by the time this mounts (e.g.
  // navigating back to a page) without ever firing a new `load` event, which
  // would leave `loaded` false — and thus the image invisible — forever.
  // useEffect runs after the DOM has settled, unlike a ref callback (which
  // can fire before the browser finishes marking a freshly-cached image
  // complete, and isn't re-invoked without a re-render).
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      {...props}
      ref={imgRef}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}
