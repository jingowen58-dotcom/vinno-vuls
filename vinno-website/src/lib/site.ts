export const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const siteUrl = `${siteOrigin}${basePath}`;
