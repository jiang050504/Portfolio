// basePath — Vercel 不需要，本地留空
export const BASE_PATH = "";

const LEGACY_FOLDER_ALIASES: Record<string, string> = {
  "01-飞仙": "feixian",
  "02-冲喜": "chongxi",
  "02-冲喜当天植物人老婆被我扎醒了": "chongxi",
  "03-大师兄": "dashixiong",
  "03-天渊帝尊之这个大师兄不太正经": "dashixiong",
  "04-狂婿": "kuangxu",
  "05-开局天灾": "kaiju-tianzai",
  "05-开局天灾-我囤万亿物资当统帅": "kaiju-tianzai",
  "06-她不爱我我偏要救她": "jiubuaiwodema",
  "06-救不爱我的妈": "jiubuaiwodema",
  "07-一针缝回半生春": "yizhenfenghuibanshengchun",
  "08-洋洋小心愿": "yangyangxiaoxinyuan",
  "09-new-project": "shouzhuyikouguo-chunchengkaihua",
  "10-new-project": "jiaozhenxitong",
};

const LEGACY_ROOT_FILES: Record<string, string> = {
  "飞仙2.mp4": "feixian", "飞仙.mp4": "feixian",
  "6fd11bc1-7fe7-41c1-be8e-736325fbd61b.png": "chongxi", "冲喜.mp4": "chongxi", "冲喜2.mp4": "chongxi", "jimeng-2026-03-02-6471-删除右侧电脑桌.png": "chongxi", "客厅3.png": "chongxi", "苏软软正视图.png": "chongxi",
  "微信图片_20260622102033_258_812.jpg": "dashixiong", "微信图片_20260622102034_259_812.jpg": "dashixiong", "大师兄.mp4": "dashixiong", "7月11日_1.mp4": "dashixiong",
  "16比9.png": "kuangxu", "狂婿.mp4": "kuangxu", "狂婿1.mp4": "kuangxu",
  "710.png": "kaiju-tianzai", "开局天灾2.mp4": "kaiju-tianzai", "开局天灾.mp4": "kaiju-tianzai", "7月31日_2.png": "kaiju-tianzai", "7月31日_21.png": "kaiju-tianzai", "周辰正视图.png": "kaiju-tianzai",
  "16-9.png": "jiubuaiwodema", "7-10.png": "jiubuaiwodema", "救一个不爱我的妈2.mp4": "jiubuaiwodema", "救一个不爱我的妈1.mp4": "jiubuaiwodema",
};

// 拼接静态资源路径（图片、视频、头像、壁纸）
export function asset(relativePath: string): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  if (!relativePath.startsWith("/projects/")) return `${BASE_PATH}${relativePath}`;

  const parts = relativePath.split("/");
  const filename = parts.at(-1) || "";
  if (parts.length === 3) {
    const folder = LEGACY_ROOT_FILES[filename];
    return `${BASE_PATH}${folder ? `/projects/${folder}/${filename}` : relativePath}`;
  }

  const folder = LEGACY_FOLDER_ALIASES[parts[2]];
  if (folder) parts[2] = folder;
  return `${BASE_PATH}${parts.join("/")}`;
}
