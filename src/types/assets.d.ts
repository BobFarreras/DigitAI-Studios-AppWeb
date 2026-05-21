/**
 * @file src/types/assets.d.ts
 * @updated 2026-05-21
 * @summary Declarations for local image assets imported via @/assets/images.
 * @scope Extends Next.js default static image declarations for project assets.
 */
declare module '@/assets/images/*.jpg' {
  const src: string;
  export default src;
  export { src };
}

declare module '@/assets/images/*.png' {
  const src: string;
  export default src;
  export { src };
}

declare module '@/assets/images/*.webp' {
  const src: string;
  export default src;
  export { src };
}

declare module '@/assets/images/*.gif' {
  const src: string;
  export default src;
  export { src };
}

declare module '@/assets/images/*.svg' {
  const src: string;
  export default src;
  export { src };
}