// GitHub Pages base path
export const BASE_PATH = "/Portfolio";

// 拼接静态资源路径（图片、视频、头像、壁纸）
export function asset(relativePath: string): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  return `${BASE_PATH}${relativePath}`;
}
