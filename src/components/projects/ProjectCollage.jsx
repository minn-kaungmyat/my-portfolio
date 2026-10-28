import React, { memo, useEffect, useState } from "react";

// Module-level cache: image src -> "desktop" | "tablet" | "mobile".
// Survives re-renders / remounts so the collage never flickers between layouts.
const typeCache = new Map();

const classify = (src) =>
  new Promise((resolve) => {
    if (typeCache.has(src)) return resolve(typeCache.get(src));
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const type = ratio > 1.5 ? "desktop" : ratio < 0.7 ? "mobile" : "tablet";
      typeCache.set(src, type);
      resolve(type);
    };
    img.onerror = () => resolve("desktop");
    img.src = src;
  });

const layoutFor = (count) => {
  if (count === 1) return "single";
  if (count === 2) return "duo";
  if (count === 3) return "trio";
  if (count === 4) return "grid four";
  if (count === 5) return "grid five";
  if (count >= 6) return "grid six";
  return "grid";
};

/**
 * Smart collage: picks a layout from the image count and detected aspect ratios.
 */
const ProjectCollage = ({ images, isHovered = false }) => {
  const key = images.join("|");
  const [imageTypes, setImageTypes] = useState(() =>
    images.map((src) => typeCache.get(src))
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all(images.map(classify)).then((types) => {
      if (!cancelled) setImageTypes(types);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div
      className={`collage-container ${layoutFor(images.length)} ${
        isHovered ? "hovered" : ""
      }`}
    >
      <div className="collage-glow" />

      {images.map((src, index) => {
        const type = imageTypes[index] || "desktop";
        return (
          <div
            key={src}
            className={`collage-item ${type} ${
              index === 0 ? "primary" : ""
            } item-${index}`}
            style={{ "--index": index, "--total": images.length }}
          >
            <img
              src={src}
              alt={`Screenshot ${index + 1}`}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <div className="collage-border" />
          </div>
        );
      })}

      <div className="collage-noise" />
    </div>
  );
};

export default memo(ProjectCollage);
