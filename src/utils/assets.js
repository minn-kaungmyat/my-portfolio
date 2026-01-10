// Centralized helpers for project asset paths
// Usage example:
//  const fullImages = resolveImages(project);
//  const fullThumbs = resolveThumbnails(project);

// Check if a path is already absolute (http/https or starts with /)
const isAbsolutePath = (path) => {
  return (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/")
  );
};

// Resolve image paths: if already absolute, use as-is; otherwise, build from assetsBase
export const resolveImages = (project) => {
  if (!project.images) return [];
  return project.images.map((img) =>
    isAbsolutePath(img) ? img : `${project.assetsBase}/images/${img}`
  );
};

// Resolve thumbnail paths: if already absolute, use as-is; otherwise, build from assetsBase
export const resolveThumbnails = (project) => {
  if (!project.thumbnail) return [];
  return project.thumbnail.map((thumb) =>
    isAbsolutePath(thumb) ? thumb : `${project.assetsBase}/thumbs/${thumb}`
  );
};

// Legacy helpers (kept for backwards compatibility)
export const thumb = (slug, name) => `/projects/${slug}/thumbs/${name}`;
export const image = (slug, name) => `/projects/${slug}/images/${name}`;

export const listSequential = (slug, kind, count, ext = "webp", start = 1) => {
  return Array.from({ length: count }, (_, i) => {
    const index = String(i + start).padStart(2, "0");
    return `/projects/${slug}/${kind}/${index}.${ext}`;
  });
};

export const thumbnailsSequential = (slug, count, ext = "webp", start = 1) =>
  listSequential(slug, "thumbs", count, ext, start);

export const imagesSequential = (slug, count, ext = "webp", start = 1) =>
  listSequential(slug, "images", count, ext, start);
