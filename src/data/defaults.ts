import bundledContentSnapshot from "./content-snapshot.json";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
  slug?: string;
  mediaFolder?: string;
  coverImage?: string;
  coverPosition?: string;
  images: string[];
  videos: string[];
  designImages?: string[];
  detail: string;
}

export interface Experience {
  period: string;
  title: string;
  organization: string;
  description: string;
}

export interface Contact {
  label: string;
  value: string;
  href: string;
  icon: string;
}

export interface SiteContent {
  avatarPath: string;
  heroName: string;
  heroGreeting: string;
  heroRoles: string[];
  heroDescription: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutName: string;
  aboutRole: string;
  aboutBio: string[];
  aboutQuickInfo: { label: string; value: string }[];
  skills: { title: string; items: string[] }[];
  projectsTitle: string;
  projectsSubtitle: string;
  projects: Project[];
  experienceTitle: string;
  experienceSubtitle: string;
  experiences: Experience[];
  contactTitle: string;
  contactSubtitle: string;
  contacts: Contact[];
  contactStatusTitle: string;
  contactStatusText: string;
  theme: 'cyber' | 'frostmoon' | 'hengyue' | 'hongyue';
  adminPassword: string;
  wallpaperEnabled: boolean;
  wallpaperPath: string;
  wallpaperOpacity: number;
  wallpaperBlur: number;
  particlesOnWallpaper: boolean;
}

export let defaultContent: SiteContent = {
  avatarPath: '',
  heroName: '蒋运立',
  heroGreeting: '你好，我是',
  heroRoles: ['AIGC 生成师','虚拟现实开发者','Python 技术爱好者','终身学习者'],
  heroDescription: '热爱 AIGC 与虚拟现实技术，专注 AI 内容生成与交互体验设计。精通即梦、Stable Diffusion 等平台，用技术创造视觉与体验的新可能。',
  aboutTitle: '关于我',
  aboutSubtitle: '了解我的技术栈与背景',
  aboutName: '蒋运立',
  aboutRole: 'AIGC 生成师 / 虚拟现实开发者',
  aboutBio: [
    '我是一名 AIGC 生成师兼虚拟现实开发者，毕业于温州职业技术学院虚拟现实技术应用专业。我对 AI 内容生成和交互体验设计充满热情，致力于用前沿技术打造沉浸式的数字体验。',
    '在校期间我系统学习了游戏开发、AIGC 生成、动画制作等相关技术，并担任学生会招生就业服务部部长，组织了多项校园活动。此外我也加入了英语学习工作室，持续提升自己的英语能力。',
    '工作中我参与了多项商业项目的 AIGC 内容制作，积累了丰富的实际项目经验。我性格踏实、善于沟通，总能虚心听取他人意见并不断自我改进。'
  ],
  aboutQuickInfo: [
    { label: '所在地', value: '杭州' }, { label: '籍贯', value: '湖南邵阳' },
    { label: '学历', value: '大专' }, { label: '状态', value: '求职中' }
  ],
  skills: [
    { title: 'AIGC 平台', items: ['即梦','可灵','liblibAI','Stable Diffusion','共漫','ComfyUI'] },
    { title: '开发与引擎', items: ['Python','C#','Unity','Unreal Engine 5'] },
    { title: '设计工具', items: ['Photoshop','Cero','CAD'] },
    { title: '其他技能', items: ['游戏开发','动画制作','AIGC 视频生成','3D 建模','虚拟现实'] }
  ],
  projectsTitle: '项目作品',
  projectsSubtitle: '我参与和制作的商业项目',
  projects: [
    { title: '《被挖灵脉后我飞升上仙》', description: '参与该商业项目的 AIGC 内容生成工作，包括角色场景概念图、宣传物料等 AI 辅助创作，项目已成功上线。', tags: ['AIGC','Stable Diffusion','即梦','概念设计'], github: '', demo: 'https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc', mediaFolder: '01-飞仙', images: [], videos: ['/projects/01-飞仙/飞仙2.mp4','/projects/01-飞仙/飞仙.mp4'], detail: '在杭州云爻文化科技有限公司任职期间，我作为 AIGC 生成师参与了《被挖灵脉后我飞升上仙》的商业项目。' },
    { title: '《冲喜当天，植物人老婆被我扎醒了》', description: '负责该剧集的 AIGC 视觉内容制作，运用多种 AI 工具高效产出符合项目调性的画面素材。', tags: ['AIGC','liblibAI','可灵','视频生成'], github: '', demo: 'https://novelquickapp.com/s/D_2X_iWqgGo/', mediaFolder: '02-冲喜', coverImage: '/projects/02-冲喜/6fd11bc1-7fe7-41c1-be8e-736325fbd61b.png', images: ['/projects/02-冲喜当天植物人老婆被我扎醒了/chongxi_1.png','/projects/02-冲喜当天植物人老婆被我扎醒了/chongxi_2.png'], videos: ['/projects/02-冲喜/冲喜.mp4','/projects/02-冲喜/冲喜2.mp4'], designImages: ['/projects/02-冲喜/jimeng-2026-03-02-6471-删除右侧电脑桌.png','/projects/02-冲喜/客厅3.png','/projects/02-冲喜/苏软软正视图.png','/projects/02-冲喜当天植物人老婆被我扎醒了/22集山顶平台.png','/projects/02-冲喜当天植物人老婆被我扎醒了/地宫主殿.png','/projects/02-冲喜当天植物人老婆被我扎醒了/夏凡-常服.png','/projects/02-冲喜当天植物人老婆被我扎醒了/韩君瑶_幽州行动.png'], detail: '该项目是一部都市奇幻题材的短剧，我负责剧中 AIGC 视觉内容的整体制作。' },
    { title: '《天渊帝尊之这个大师兄不太正经》', description: '太墟宗首席弟子陆小川，身负混沌大道圣体，却因体内「混沌黑洞」吞噬灵力，十年困在炼气境。', tags: ['AIGC','修仙','玄幻','2D漫剧'], github: '', demo: 'https://novelquickapp.com/s/A9BnMk9h74s/', mediaFolder: '03-大师兄', coverImage: '/projects/03-大师兄/微信图片_20260622102033_258_812.jpg', images: ['/projects/03-天渊帝尊之这个大师兄不太正经/7月31日.png','/projects/03-天渊帝尊之这个大师兄不太正经/7月31日1.png'], videos: ['/projects/03-大师兄/大师兄.mp4','/projects/03-大师兄/7月11日_1.mp4'], designImages: ['/projects/03-大师兄/微信图片_20260622102034_259_812.jpg','/projects/03-天渊帝尊之这个大师兄不太正经/李剑心三视图.png','/projects/03-天渊帝尊之这个大师兄不太正经/灵界-森林小路.png','/projects/03-天渊帝尊之这个大师兄不太正经/灵界灵界森林湖边_-_外.png','/projects/03-天渊帝尊之这个大师兄不太正经/璇玑仙子三视图.png','/projects/03-天渊帝尊之这个大师兄不太正经/苍灵儿.png'], detail: '太墟宗首席弟子陆小川，身负混沌大道圣体，却因体内「混沌黑洞」吞噬灵力。' },
    { title: '狂婿', description: '', tags: ['AIGC','架空王朝','朝堂','脑洞'], github: '', demo: '', mediaFolder: '04-狂婿', coverImage: '/projects/04-狂婿/16比9.png', images: ['/projects/04-狂婿/狂婿.png','/projects/04-狂婿/狂婿1.png'], videos: ['/projects/04-狂婿/狂婿.mp4','/projects/04-狂婿/狂婿1.mp4'], designImages: [], detail: '' },
    { title: '《开局天灾:我囤万亿物资当统帅》', description: '2033年，超强台风将至，众人浑然不觉。重生归来的周辰，带着上一世被兄弟背叛惨死的恨意，觉醒空间异能。', tags: ['AIGC','末世','天灾','极寒','废土'], github: '', demo: '', mediaFolder: '05-开局天灾', coverImage: '/projects/05-开局天灾/710.png', images: ['/projects/05-开局天灾/7月31日_2.png','/projects/05-开局天灾/7月31日_21.png'], videos: ['/projects/05-开局天灾/开局天灾2.mp4','/projects/05-开局天灾/开局天灾.mp4'], designImages: ['/projects/05-开局天灾/周辰正视图.png'], detail: '2033年，超强台风将至，众人浑然不觉。重生归来的周辰，觉醒空间异能，倾尽家财疯狂囤积物资。' },
    { title: '《她不爱我，我偏要救她》', description: '会计苏念重生回到母亲被骗前夕。前世母亲轻信干儿子，把积蓄一步步交出去。', tags: ['AIGC','亲情','反诈','真人短剧'], github: '', demo: 'https://novelquickapp.com/s/XC4cWTDi4hY/', mediaFolder: '06-救不爱我的妈', coverImage: '/projects/06-救不爱我的妈/16-9.png', images: ['/projects/06-救不爱我的妈/7-10.png','/projects/06-她不爱我我偏要救她/10.png','/projects/06-她不爱我我偏要救她/20.png','/projects/06-她不爱我我偏要救她/30.png'], videos: ['/projects/06-救不爱我的妈/救一个不爱我的妈2.mp4','/projects/06-救不爱我的妈/救一个不爱我的妈1.mp4','/projects/06-她不爱我我偏要救她/救母3D救一个不爱我的妈03.mp4','/projects/06-她不爱我我偏要救她/救母3D救一个不爱我的妈1.mp4'], designImages: ['/projects/06-她不爱我我偏要救她/周伟.jpg','/projects/06-她不爱我我偏要救她/客厅-反面3d.png','/projects/06-她不爱我我偏要救她/苏念.jpg','/projects/06-她不爱我我偏要救她/苏念出租屋白天母图.jpg'], detail: '会计苏念重生回到母亲被骗前夕。她查批号、流水、登记信息，联手反诈民警追出诈骗团伙资金链。' },
    { title: '《一针缝回半生春》', description: '老巷裁缝好心救助晕倒老人，反被对方儿子诬陷偷窃。获救老人藏于旗袍纽扣的录音道出真相。', tags: ['AIGC','都市','传统手艺','真人短剧'], github: '', demo: 'https://novelquickapp.com/s/cDEepVnCU6M/', mediaFolder: '07-一针缝回半生春', coverImage: '/projects/07-一针缝回半生春/红果7-10.png', images: ['/projects/07-一针缝回半生春/针1.png','/projects/07-一针缝回半生春/针2.png'], videos: ['/projects/07-一针缝回半生春/一针缝回半生春1.mp4','/projects/07-一针缝回半生春/一针缝回半生春2.mp4'], designImages: ['/projects/07-一针缝回半生春/一针缝回半生春课堂内景.png','/projects/07-一针缝回半生春/医院急诊走廊.jpg','/projects/07-一针缝回半生春/急救车_医院入口转场.jpg','/projects/07-一针缝回半生春/沈玉兰_旧旗袍舞者版.jpg'], detail: '老巷裁缝好心救助晕倒老人。坏人依法获惩，裁缝重开店铺，守护住老年人本该拥有的尊严与温暖。' },
    { title: '《洋洋小心愿》', description: '十岁的洋洋因父母无法陪自己过生日满心孤单，傍晚在老街草丛捡到藏着星空的漂流瓶。', tags: ['AIGC','亲情','留守儿童','愿望'], github: '', demo: 'https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc', mediaFolder: '08-洋洋小心愿', coverImage: '/projects/08-洋洋小心愿/洋洋小心愿_1.png', images: ['/projects/08-洋洋小心愿/洋洋小心愿_2.png','/projects/08-洋洋小心愿/7月11日.png','/projects/08-洋洋小心愿/7月11日1.png'], videos: ['/projects/08-洋洋小心愿/7月11日.mp4'], designImages: [], detail: '十岁的洋洋因父母无法陪自己过生日满心孤单。圣龙化为星光应允祝福。' },
    { title: '《守住一口锅，春城开满花》', description: '', tags: ['AIGC','真人短剧','角色设计','场景设计'], github: '', demo: '', mediaFolder: '09-new-project', coverImage: '/projects/09-new-project/9-16.png', coverPosition: 'center', images: ['/projects/09-new-project/01.png','/projects/09-new-project/02.png'], videos: ['/projects/09-new-project/一口锅1-1.mp4','/projects/09-new-project/一口锅2-1.mp4'], designImages: ['/projects/09-new-project/张小玖.png','/projects/09-new-project/张记老店门口日景.png','/projects/09-new-project/赵苏磊.png','/projects/09-new-project/音像通讯店日景.png','/projects/09-new-project/馄饨摊正面镜头1.png'], detail: '' },
    { title: '《觉醒较真系统后，我专治不服》', description: '', tags: ['AIGC','系统流','角色设计','视频生成'], github: '', demo: '', mediaFolder: '10-new-project', coverImage: '/projects/10-new-project/竖屏海报1.jpg', coverPosition: 'center', images: ['/projects/10-new-project/8月2日.png','/projects/10-new-project/8月2日1.png'], videos: ['/projects/10-new-project/02系统.mp4','/projects/10-new-project/系统1.mp4'], designImages: ['/projects/10-new-project/包星常服.jpg','/projects/10-new-project/唐欣然.jpg','/projects/10-new-project/职业篮球馆脑内幻想_内.jpg','/projects/10-new-project/赵世镜赵大状常服.jpg','/projects/10-new-project/高级律所赵世镜办公室_内.jpg'], detail: '' }
  ],
  experienceTitle: '经历',
  experienceSubtitle: '我的工作与学习历程',
  experiences: [
    { period: '2026.01 — 2026.06', title: 'AIGC 生成师', organization: '杭州云爻文化科技有限公司', description: '参与《被挖灵脉后我飞升上仙》、《冲喜当天，植物人老婆被我扎醒了》等多项商业项目的 AIGC 内容生成。' },
    { period: '2023 — 2025（暑假）', title: '助理工程师（散热模组研发）', organization: '昆山莹帆科技有限公司', description: '参与 PC 和服务器散热模组的研发与测试工作。' },
    { period: '2023.09 — 2026.06', title: '虚拟现实技术应用 · 大专', organization: '温州职业技术学院', description: '主修虚拟现实技术应用专业，系统学习游戏开发、AIGC 内容生成、动画制作、3D 建模等核心课程。' }
  ],
  contactTitle: '联系我',
  contactSubtitle: '期待与你的交流与合作',
  contacts: [
    { label: '电话', value: '19918175601', href: 'tel:19918175601', icon: 'mail' },
    { label: '邮箱', value: 'jiang050504@outlook.com', href: 'mailto:jiang050504@outlook.com', icon: 'globe' },
    { label: '微信', value: 'jyl-5601', href: '#', icon: 'message-circle' },
    { label: '作品集', value: '飞书文档', href: 'https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc', icon: 'link2' }
  ],
  contactStatusTitle: '求职意向',
  contactStatusText: '意向岗位：AIGC / 网络 / 计算机 | 期望薪资：7-8K | 意向城市：杭州。',
  theme: 'cyber',
  adminPassword: 'admin123',
  wallpaperEnabled: true,
  wallpaperPath: '',
  wallpaperOpacity: 0.85,
  wallpaperBlur: 0,
  particlesOnWallpaper: true
};

const DEFAULT_PROJECT_SLUGS = [
  "feixian",
  "chongxi",
  "dashixiong",
  "kuangxu",
  "kaiju-tianzai",
  "jiubuaiwodema",
  "yizhenfenghuibanshengchun",
  "yangyangxiaoxinyuan",
  "shouzhuyikouguo-chunchengkaihua",
  "jiaozhenxitong",
];

defaultContent.projects = defaultContent.projects.map((project, index) => ({
  ...project,
  slug: DEFAULT_PROJECT_SLUGS[index],
}));

defaultContent.projects[3] = {
  ...defaultContent.projects[3],
  designImages: [
    "/projects/04-狂婿/东宫别院内夜.png",
    "/projects/04-狂婿/城南清虚观偏厢内日.png",
    "/projects/04-狂婿/柳式.jpg",
    "/projects/04-狂婿/苏挽.jpg",
  ],
};

const canonicalProjectByTitle = new Map(
  defaultContent.projects.map((project) => [project.title, project])
);

const savedSnapshot = bundledContentSnapshot as Partial<SiteContent>;
if (Array.isArray(savedSnapshot.projects) && savedSnapshot.projects.length > 0) {
  defaultContent = savedSnapshot as SiteContent;
}

function projectMediaPath(path: string | undefined, slug: string) {
  if (!path || !path.startsWith("/projects/")) return path || "";
  const filename = path.split("/").pop();
  return filename ? `/projects/${slug}/${filename}` : "";
}

const seenProjectSlugs = new Set<string>();
defaultContent.projects = defaultContent.projects.flatMap((project, index) => {
  const canonicalProject = canonicalProjectByTitle.get(project.title);
  const savedSlug = project.slug || "";
  const slug = (!savedSlug || /^project-\d+$/.test(savedSlug)) && canonicalProject?.slug
    ? canonicalProject.slug
    : savedSlug || DEFAULT_PROJECT_SLUGS[index] || `project-${index + 1}`;

  if (seenProjectSlugs.has(slug)) return [];
  seenProjectSlugs.add(slug);

  return [{
    ...project,
    slug,
    mediaFolder: slug,
    coverImage: projectMediaPath(project.coverImage, slug),
    images: project.images.map((path) => projectMediaPath(path, slug)).filter(Boolean),
    videos: project.videos.map((path) => projectMediaPath(path, slug)).filter(Boolean),
    designImages: (project.designImages || []).map((path) => projectMediaPath(path, slug)).filter(Boolean),
  }];
});

const chongxi = defaultContent.projects.find((project) => project.slug === "chongxi");
if (chongxi) {
  chongxi.designImages = Array.from(new Set([
    "/projects/chongxi/jimeng-2026-03-02-6471-删除右侧电脑桌.png",
    "/projects/chongxi/客厅3.png",
    "/projects/chongxi/苏软软正视图.png",
    ...(chongxi.designImages || []),
  ]));
}

const kaijuTianzai = defaultContent.projects.find((project) => project.slug === "kaiju-tianzai");
if (kaijuTianzai) {
  kaijuTianzai.designImages = ["/projects/kaiju-tianzai/周辰正视图.png"];
}

const jiubuaiwodema = defaultContent.projects.find((project) => project.slug === "jiubuaiwodema");
if (jiubuaiwodema) {
  jiubuaiwodema.images = [
    "/projects/jiubuaiwodema/7-10.png",
    "/projects/jiubuaiwodema/10.png",
    "/projects/jiubuaiwodema/20.png",
    "/projects/jiubuaiwodema/30.png",
  ];
  jiubuaiwodema.videos = [
    "/projects/jiubuaiwodema/救一个不爱我的妈2.mp4",
    "/projects/jiubuaiwodema/救一个不爱我的妈1.mp4",
    "/projects/jiubuaiwodema/救母3D救一个不爱我的妈03.mp4",
    "/projects/jiubuaiwodema/救母3D救一个不爱我的妈1.mp4",
  ];
  jiubuaiwodema.designImages = [
    "/projects/jiubuaiwodema/周伟.jpg",
    "/projects/jiubuaiwodema/客厅-反面3d.png",
    "/projects/jiubuaiwodema/苏念.jpg",
    "/projects/jiubuaiwodema/苏念出租屋白天母图.jpg",
  ];
}
