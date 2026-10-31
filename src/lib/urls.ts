export function localUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export function imageSrcset(images: { path: string; width: number }[]): string {
  return images.map(({ path, width }) => `${localUrl(path)} ${width}w`).join(', ');
}
