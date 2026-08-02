// basePath — Vercel 不需要，本地留空
export const BASE_PATH = "";

const LEGACY_PROJECT_FOLDERS: Record<string, string> = {
  "飞仙2.mp4": "01-飞仙", "飞仙.mp4": "01-飞仙",
  "6fd11bc1-7fe7-41c1-be8e-736325fbd61b.png": "02-冲喜", "冲喜.mp4": "02-冲喜", "冲喜2.mp4": "02-冲喜", "jimeng-2026-03-02-6471-删除右侧电脑桌.png": "02-冲喜", "客厅3.png": "02-冲喜", "苏软软正视图.png": "02-冲喜",
  "微信图片_20260622102033_258_812.jpg": "03-大师兄", "微信图片_20260622102034_259_812.jpg": "03-大师兄", "大师兄.mp4": "03-大师兄", "7月11日_1.mp4": "03-大师兄",
  "16比9.png": "04-狂婿", "狂婿.mp4": "04-狂婿", "狂婿1.mp4": "04-狂婿",
  "710.png": "05-开局天灾", "开局天灾2.mp4": "05-开局天灾", "开局天灾.mp4": "05-开局天灾", "7月31日_2.png": "05-开局天灾", "7月31日_21.png": "05-开局天灾", "周辰正视图.png": "05-开局天灾",
  "16-9.png": "06-救不爱我的妈", "7-10.png": "06-救不爱我的妈", "救一个不爱我的妈2.mp4": "06-救不爱我的妈", "救一个不爱我的妈1.mp4": "06-救不爱我的妈",
  "红果7-10.png": "07-一针缝回半生春", "一针缝回半生春1.mp4": "07-一针缝回半生春", "一针缝回半生春2.mp4": "07-一针缝回半生春",
  "洋洋小心愿_1.png": "08-洋洋小心愿", "洋洋小心愿_2.png": "08-洋洋小心愿", "7月11日.mp4": "08-洋洋小心愿", "7月11日.png": "08-洋洋小心愿", "7月11日1.png": "08-洋洋小心愿",
};

// 拼接静态资源路径（图片、视频、头像、壁纸）
export function asset(relativePath: string): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  const filename = relativePath.startsWith("/projects/") ? relativePath.split("/").pop() : undefined;
  const folder = filename ? LEGACY_PROJECT_FOLDERS[filename] : undefined;
  return `${BASE_PATH}${folder ? `/projects/${folder}/${filename}` : relativePath}`;
}
