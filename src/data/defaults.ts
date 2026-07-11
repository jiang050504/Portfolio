export interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
  images: string[];  // 多张项目截图
  videos: string[];  // 多个演示视频
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
  theme: "cyber" | "frostmoon";
  adminPassword: string;
  wallpaperEnabled: boolean;
  wallpaperPath: string;
  wallpaperOpacity: number;
  wallpaperBlur: number;
  particlesOnWallpaper: boolean;
}

export const defaultContent: SiteContent = {
  avatarPath: "",

  heroName: "蒋运立",
  heroGreeting: "你好，我是",
  heroRoles: [
    "AIGC 生成师",
    "虚拟现实开发者",
    "Python 技术爱好者",
    "终身学习者",
  ],
  heroDescription:
    "热爱 AIGC 与虚拟现实技术，专注 AI 内容生成与交互体验设计。精通即梦、Stable Diffusion 等平台，用技术创造视觉与体验的新可能。",

  aboutTitle: "关于我",
  aboutSubtitle: "了解我的技术栈与背景",
  aboutName: "蒋运立",
  aboutRole: "AIGC 生成师 / 虚拟现实开发者",
  aboutBio: [
    "我是一名 AIGC 生成师兼虚拟现实开发者，毕业于温州职业技术学院虚拟现实技术应用专业。我对 AI 内容生成和交互体验设计充满热情，致力于用前沿技术打造沉浸式的数字体验。",
    "在校期间我系统学习了游戏开发、AIGC 生成、动画制作等相关技术，并担任学生会招生就业服务部部长，组织了多项校园活动。此外我也加入了英语学习工作室，持续提升自己的英语能力。",
    "工作中我参与了多项商业项目的 AIGC 内容制作，积累了丰富的实际项目经验。我性格踏实、善于沟通，总能虚心听取他人意见并不断自我改进。",
  ],
  aboutQuickInfo: [
    { label: "所在地", value: "杭州" },
    { label: "籍贯", value: "湖南邵阳" },
    { label: "学历", value: "大专" },
    { label: "状态", value: "求职中" },
  ],

  skills: [
    {
      title: "AIGC 平台",
      items: ["即梦", "可灵", "liblibAI", "Stable Diffusion", "共漫", "ComfyUI"],
    },
    {
      title: "开发与引擎",
      items: ["Python", "C#", "Unity", "Unreal Engine 5"],
    },
    {
      title: "设计工具",
      items: ["Photoshop", "Cero", "CAD"],
    },
    {
      title: "其他技能",
      items: ["游戏开发", "动画制作", "AIGC 视频生成", "3D 建模", "虚拟现实"],
    },
  ],

  projectsTitle: "项目作品",
  projectsSubtitle: "我参与和制作的商业项目",
  projects: [
    {
      title: "《被挖灵脉后我飞升上仙》",
      description: "参与该商业项目的 AIGC 内容生成工作，包括角色场景概念图、宣传物料等 AI 辅助创作，项目已成功上线。",
      tags: ["AIGC", "Stable Diffusion", "即梦", "概念设计"],
      github: "",
      demo: "https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc",
      images: ["/projects/微信图片_20260622102034_259_812.jpg"],
      videos: ["/projects/飞仙.mp4", "/projects/飞仙2.mp4"],
      detail: "在杭州云爻文化科技有限公司任职期间，我作为 AIGC 生成师参与了《被挖灵脉后我飞升上仙》的商业项目。该项目中我主要负责角色概念图、场景氛围图的 AI 辅助生成，使用即梦、Stable Diffusion 等平台，根据编剧的需求快速迭代视觉效果。通过精准的 prompt 工程和后期 Photoshop 精修，产出的人物角色图与场景图获得了制作方的高度认可，项目成功上线。",
    },
    {
      title: "《冲喜当天，植物人老婆被我扎醒了》",
      description: "负责该剧集的 AIGC 视觉内容制作，运用多种 AI 工具高效产出符合项目调性的画面素材。",
      tags: ["AIGC", "liblibAI", "可灵", "视频生成"],
      github: "",
      demo: "https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc",
      images: [],
      videos: ["/projects/冲喜.mp4", "/projects/冲喜2.mp4"],
      detail: "该项目是一部都市奇幻题材的短剧，我负责剧中 AIGC 视觉内容的整体制作。运用 liblibAI 和可灵等平台进行角色风格化处理与场景生成，结合 Stable Diffusion 进行精细化控制。项目周期内高效完成了多批次画面素材的生产，积累了丰富的 AIGC 视频生成实战经验。",
    },
    {
      title: "PC 散热模组研发测试",
      description: "2023-2025 年暑期参与 PC 和服务器散热模组的研发与测试，担任助理工程师，积累了硬件测试与工程实践经验。",
      tags: ["硬件测试", "散热模组", "CAD", "工程研发"],
      github: "",
      demo: "",
      images: [],
      videos: [],
      detail: "2023 至 2025 年暑假期间，我在昆山莹帆科技有限公司担任助理工程师，参与 PC 和服务器散热模组的研发与测试工作。具体包括：协助工程师进行散热模组的性能测试与数据采集，使用 CAD 软件进行产品图纸的修改与标注，撰写测试报告和技术文档。这段经历让我深入了解了硬件产品从设计到量产的完整开发流程。",
    },
    {
      title: "虚拟现实交互体验",
      description: "在校期间使用 Unity 和 UE5 开发的 VR 交互体验项目，探索虚拟现实技术在教育和展示场景中的应用。",
      tags: ["Unity", "UE5", "VR", "C#", "交互设计"],
      github: "",
      demo: "",
      images: [],
      videos: [],
      detail: "在温州职业技术学院就读期间，我利用 Unity 和 Unreal Engine 5 开发了多款虚拟现实交互体验项目。项目涵盖了教育场景的虚拟实验室、文化展示的虚拟展厅等方向。我负责从场景搭建、交互逻辑编写到性能优化的全流程开发，使用 C# 编写核心交互脚本，并对 VR 设备的适配进行了深入探索。",
    },
  ],

  experienceTitle: "经历",
  experienceSubtitle: "我的工作与学习历程",
  experiences: [
    {
      period: "2026.01 — 2026.06",
      title: "AIGC 生成师",
      organization: "杭州云爻文化科技有限公司",
      description: "参与《被挖灵脉后我飞升上仙》、《冲喜当天，植物人老婆被我扎醒了》等多项商业项目的 AIGC 内容生成。熟练运用即梦、可灵、liblibAI、Stable Diffusion 等平台，高效产出角色概念图、场景图和宣传物料，积累了丰富的商业 AIGC 实战经验。",
    },
    {
      period: "2023 — 2025（暑假）",
      title: "助理工程师（散热模组研发）",
      organization: "昆山莹帆科技有限公司",
      description: "参与 PC 和服务器散热模组的研发与测试工作，协助工程师完成产品性能测试、数据记录和报告撰写，熟悉了硬件产品的开发流程和质量控制标准。",
    },
    {
      period: "2023.09 — 2026.06",
      title: "虚拟现实技术应用 · 大专",
      organization: "温州职业技术学院",
      description: "主修虚拟现实技术应用专业，系统学习游戏开发、AIGC 内容生成、动画制作、3D 建模等核心课程。在校期间担任学生会招生就业服务部部长，加入英语学习工作室，积极组织和参与各项校园活动。",
    },
  ],

  contactTitle: "联系我",
  contactSubtitle: "期待与你的交流与合作",
  contacts: [
    { label: "电话", value: "19918175601", href: "tel:19918175601", icon: "mail" },
    { label: "邮箱", value: "jiang050504@outlook.com", href: "mailto:jiang050504@outlook.com", icon: "globe" },
    { label: "微信", value: "jyl-5601", href: "#", icon: "message-circle" },
    { label: "作品集", value: "飞书文档", href: "https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc", icon: "link2" },
  ],
  contactStatusTitle: "求职意向",
  contactStatusText: "意向岗位：AIGC / 网络 / 计算机 | 期望薪资：7-8K | 意向城市：杭州。如果你有合适的项目或职位，欢迎随时联系我！",

  theme: "cyber",
  adminPassword: "admin123",
  wallpaperEnabled: false,
  wallpaperPath: "",
  wallpaperOpacity: 0.85,
  wallpaperBlur: 0,
  particlesOnWallpaper: true,
};
