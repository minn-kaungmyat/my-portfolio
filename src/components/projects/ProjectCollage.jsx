import React, { useState, useEffect } from "react";

/**
 * Smart collage generator that creates dynamic layouts based on:
 * - Number of images
 * - Aspect ratios (auto-detects desktop/mobile/tablet)
 * - Dark aesthetic with overlapping, shadows, and depth
 */
const ProjectCollage = ({ images, isHovered }) => {
  const [imageTypes, setImageTypes] = useState([]);

  useEffect(() => {
    // Detect device type from aspect ratio
    const detectTypes = async () => {
      const types = await Promise.all(
        images.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const ratio = img.width / img.height;

              // Classify by aspect ratio
              if (ratio > 1.5) resolve("desktop"); // Wide screens
              else if (ratio < 0.7) resolve("mobile"); // Tall screens
              else resolve("tablet"); // Square-ish
            };
            img.onerror = () => resolve("desktop"); // Fallback
            img.src = src;
          });
        })
      );
      setImageTypes(types);
    };

    detectTypes();
  }, [images]);

  // Choose layout based on number of images
  const getLayout = () => {
    const count = images.length;

    if (count === 1) return "single";
    if (count === 2) return "duo";
    if (count === 3) return "trio";
    if (count === 4) return "grid four";
    if (count === 5) return "grid five";
    if (count >= 6) return "grid six";
    return "grid";
  };

  const layout = getLayout();

  return (
    <div
      className={`collage-container ${layout} ${isHovered ? "hovered" : ""}`}
    >
      {/* Glow background effect */}
      <div className="collage-glow" />

      {images.map((src, index) => {
        const type = imageTypes[index] || "desktop";
        const isPrimary = index === 0;

        return (
          <div
            key={index}
            className={`collage-item ${type} ${
              isPrimary ? "primary" : ""
            } item-${index}`}
            style={{
              "--index": index,
              "--total": images.length,
            }}
          >
            <img src={src} alt={`Screenshot ${index + 1}`} loading="lazy" />

            {/* Cyber border effect */}
            <div className="collage-border" />
          </div>
        );
      })}

      {/* Noise overlay for texture */}
      <div className="collage-noise" />
    </div>
  );
};

export default ProjectCollage;
