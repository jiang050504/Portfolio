export interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
  images: string[];
  videos: string[];
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
  theme: 'cyber' | 'frostmoon';
  adminPassword: string;
  wallpaperEnabled: boolean;
  wallpaperPath: string;
  wallpaperOpacity: number;
  wallpaperBlur: number;
  particlesOnWallpaper: boolean;
}

export const defaultContent: SiteContent = {
  "avatarPath": "",
  "heroName": "蒋运立",
  "heroGreeting": "你好，我是",
  "heroRoles": [
    "AIGC 生成师",
    "虚拟现实开发者",
    "Python 技术爱好者",
    "终身学习者"
  ],
  "heroDescription": "热爱 AIGC 与虚拟现实技术，专注 AI 内容生成与交互体验设计。精通即梦、Stable Diffusion 等平台，用技术创造视觉与体验的新可能。",
  "aboutTitle": "关于我",
  "aboutSubtitle": "了解我的技术栈与背景",
  "aboutName": "蒋运立",
  "aboutRole": "AIGC 生成师 / 虚拟现实开发者",
  "aboutBio": [
    "我是一名 AIGC 生成师兼虚拟现实开发者，毕业于温州职业技术学院虚拟现实技术应用专业。我对 AI 内容生成和交互体验设计充满热情，致力于用前沿技术打造沉浸式的数字体验。",
    "在校期间我系统学习了游戏开发、AIGC 生成、动画制作等相关技术，并担任学生会招生就业服务部部长，组织了多项校园活动。此外我也加入了英语学习工作室，持续提升自己的英语能力。",
    "工作中我参与了多项商业项目的 AIGC 内容制作，积累了丰富的实际项目经验。我性格踏实、善于沟通，总能虚心听取他人意见并不断自我改进。"
  ],
  "aboutQuickInfo": [
    {
      "label": "所在地",
      "value": "杭州"
    },
    {
      "label": "籍贯",
      "value": "湖南邵阳"
    },
    {
      "label": "学历",
      "value": "大专"
    },
    {
      "label": "状态",
      "value": "求职中"
    }
  ],
  "skills": [
    {
      "title": "AIGC 平台",
      "items": [
        "即梦",
        "可灵",
        "liblibAI",
        "Stable Diffusion",
        "共漫",
        "ComfyUI"
      ]
    },
    {
      "title": "开发与引擎",
      "items": [
        "Python",
        "C#",
        "Unity",
        "Unreal Engine 5"
      ]
    },
    {
      "title": "设计工具",
      "items": [
        "Photoshop",
        "Cero",
        "CAD"
      ]
    },
    {
      "title": "其他技能",
      "items": [
        "游戏开发",
        "动画制作",
        "AIGC 视频生成",
        "3D 建模",
        "虚拟现实"
      ]
    }
  ],
  "projectsTitle": "项目作品",
  "projectsSubtitle": "我参与和制作的商业项目",
  "projects": [
    {
      "title": "《被挖灵脉后我飞升上仙》",
      "description": "参与该商业项目的 AIGC 内容生成工作，包括角色场景概念图、宣传物料等 AI 辅助创作，项目已成功上线。",
      "tags": [
        "AIGC",
        "Stable Diffusion",
        "即梦",
        "概念设计"
      ],
      "github": "",
      "demo": "https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc",
      "images": [],
      "videos": [
        "/projects/飞仙2.mp4",
        "/projects/飞仙.mp4"
      ],
      "detail": "在杭州云爻文化科技有限公司任职期间，我作为 AIGC 生成师参与了《被挖灵脉后我飞升上仙》的商业项目。该项目中我主要负责角色概念图、场景氛围图的 AI 辅助生成，使用即梦、Stable Diffusion 等平台，根据编剧的需求快速迭代视觉效果。通过精准的 prompt 工程和后期 Photoshop 精修，产出的人物角色图与场景图获得了制作方的高度认可，项目成功上线。"
    },
    {
      "title": "《冲喜当天，植物人老婆被我扎醒了》",
      "description": "负责该剧集的 AIGC 视觉内容制作，运用多种 AI 工具高效产出符合项目调性的画面素材。",
      "tags": [
        "AIGC",
        "liblibAI",
        "可灵",
        "视频生成"
      ],
      "github": "",
      "demo": "https://novelquickapp.com/s/D_2X_iWqgGo/",
      "images": [
        "/projects/6fd11bc1-7fe7-41c1-be8e-736325fbd61b.png"
      ],
      "videos": [
        "/projects/冲喜.mp4",
        "/projects/冲喜2.mp4"
      ],
      "detail": "该项目是一部都市奇幻题材的短剧，我负责剧中 AIGC 视觉内容的整体制作。运用 liblibAI 和可灵等平台进行角色风格化处理与场景生成，结合 Stable Diffusion 进行精细化控制。项目周期内高效完成了多批次画面素材的生产，积累了丰富的 AIGC 视频生成实战经验。"
    },
    {
      "title": "《天渊帝尊之这个大师兄不太正经》",
      "description": "太墟宗首席弟子陆小川，身负混沌大道圣体，却因体内「混沌黑洞」吞噬灵力，十年困在炼气境，只能靠「知识付费」、收挑战金、接各种活来搞钱喂养黑洞，低调自保。外人眼里他懒惰贪财，新入门的公主苍灵儿更把他当骗子。但在一次次危机中，她发现这位看似不正经的「大师兄」其实深藏不露",
      "tags": [
        "AIGC",
        "修仙",
        "玄幻",
        "2D漫剧"
      ],
      "github": "",
      "demo": "https://novelquickapp.com/s/A9BnMk9h74s/",
      "images": [
        "/projects/微信图片_20260622102033_258_812.jpg"
      ],
      "videos": [
        "/projects/大师兄.mp4",
        "/projects/7月11日_1.mp4"
      ],
      "detail": "太墟宗首席弟子陆小川，身负混沌大道圣体，却因体内「混沌黑洞」吞噬灵力，十年困在炼气境，只能靠「知识付费」、收挑战金、接各种活来搞钱喂养黑洞，低调自保。外人眼里他懒惰贪财，新入门的公主苍灵儿更把他当骗子。但在一次次危机中，她发现这位看似不正经的「大师兄」其实深藏不露"
    },
    {
      "title": "狂婿",
      "description": "",
      "tags": [
        "AIGC",
        "架空王朝",
        "朝堂",
        "脑洞"
      ],
      "github": "",
      "demo": "",
      "images": [
        "/projects/16比9.png"
      ],
      "videos": [
        "/projects/狂婿.mp4",
        "/projects/狂婿1.mp4"
      ],
      "detail": ""
    },
    {
      "title": "《开局天灾:我囤万亿物资当统帅》",
      "description": "2033年，超强台风将至，众人浑然不觉。重生归来的周辰，带着上一世被兄弟张力、女友苏软软背叛惨死的恨意，觉醒空间异能，倾尽家财疯狂囤积物资，将仇人尽数诱困在樱花小区。台风肆虐、极寒降临，周辰在安全屋中安稳度日，冷眼旁观仇敌在绝境中挣扎互残。极热时代，他剿匪救兵、杀伐果断，遭光明帮偷袭后暴怒复仇，血洗仇敌立威末世。预知大地震将至，周辰携伙伴与物资驾机离去，以铁血狠辣，开启横扫末日的传奇之路。",
      "tags": [
        "AIGC",
        "末世",
        "天灾",
        "极寒",
        "废土"
      ],
      "github": "",
      "demo": "",
      "images": [
        "/projects/710.png"
      ],
      "videos": [
        "/projects/开局天灾2.mp4",
        "/projects/开局天灾.mp4"
      ],
      "detail": "2033年，超强台风将至，众人浑然不觉。重生归来的周辰，带着上一世被兄弟张力、女友苏软软背叛惨死的恨意，觉醒空间异能，倾尽家财疯狂囤积物资，将仇人尽数诱困在樱花小区。台风肆虐、极寒降临，周辰在安全屋中安稳度日，冷眼旁观仇敌在绝境中挣扎互残。极热时代，他剿匪救兵、杀伐果断，遭光明帮偷袭后暴怒复仇，血洗仇敌立威末世。预知大地震将至，周辰携伙伴与物资驾机离去，以铁血狠辣，开启横扫末日的传奇之路。"
    },
    {
      "title": "《她不爱我，我偏要救她》",
      "description": "会计苏念重生回到母亲被骗前夕。前世，母亲王秀珍偏心儿子，轻信「干儿子」周伟，把积蓄、抚恤金和老房子一步步交出去，最后落魄离世，临终仍怨苏念。重来一次，苏念明知母亲不信她、弟弟也被人利用，仍选择用合法证据阻止骗局。她查批号、流水、登记信息，联手反诈民警追出诈骗团伙资金链。最终周伟落网，部分案款追回，母亲也终于看清真相。结局没有强行和解，只剩母女在笨拙修补中继续生活。",
      "tags": [
        "AIGC",
        "亲情",
        "反诈",
        "真人短剧"
      ],
      "github": "",
      "demo": "https://novelquickapp.com/s/XC4cWTDi4hY/",
      "images": [
        "/projects/16-9.png",
        "/projects/7-10.png"
      ],
      "videos": [
        "/projects/救一个不爱我的妈2.mp4",
        "/projects/救一个不爱我的妈1.mp4"
      ],
      "detail": "会计苏念重生回到母亲被骗前夕。前世，母亲王秀珍偏心儿子，轻信「干儿子」周伟，把积蓄、抚恤金和老房子一步步交出去，最后落魄离世，临终仍怨苏念。重来一次，苏念明知母亲不信她、弟弟也被人利用，仍选择用合法证据阻止骗局。她查批号、流水、登记信息，联手反诈民警追出诈骗团伙资金链。最终周伟落网，部分案款追回，母亲也终于看清真相。结局没有强行和解，只剩母女在笨拙修补中继续生活。"
    },
    {
      "title": "《一针缝回半生春》",
      "description": "老巷裁缝好心救助晕倒老人，反被对方儿子诬陷偷窃，还遭伙同商人伪造证据、散播网暴，二人意图侵占老人房产。获救老人藏于旗袍纽扣的录音道出真相，她被儿子强行软禁。裁缝联合邻里与律师收集各类物证，查实二人借养老项目侵吞多位老人财物。坏人依法获惩，裁缝重开店铺，开设老年手工课堂，用针线修补衣物，也守护住老年人本该拥有的尊严与温暖。",
      "tags": [
        "AIGC",
        "都市",
        "传统手艺",
        "真人短剧"
      ],
      "github": "",
      "demo": "https://novelquickapp.com/s/cDEepVnCU6M/",
      "images": [
        "/projects/红果7-10.png"
      ],
      "videos": [
        "/projects/一针缝回半生春1.mp4",
        "/projects/一针缝回半生春2.mp4"
      ],
      "detail": "老巷裁缝好心救助晕倒老人，反被对方儿子诬陷偷窃，还遭伙同商人伪造证据、散播网暴，二人意图侵占老人房产。获救老人藏于旗袍纽扣的录音道出真相，她被儿子强行软禁。裁缝联合邻里与律师收集各类物证，查实二人借养老项目侵吞多位老人财物。坏人依法获惩，裁缝重开店铺，开设老年手工课堂，用针线修补衣物，也守护住老年人本该拥有的尊严与温暖。"
    },
    {
      "title": "《洋洋小心愿》",
      "description": "十岁的洋洋因父母无法陪自己过生日满心孤单，傍晚在老街草丛捡到藏着星空的漂流瓶。夜里瓶子发光带他来到天台，星河圣龙现身，他许下希望父母陪伴过生日的心愿。圣龙化为星光应允祝福。次日一早，奔波归来的父母如约出现，洋洋相拥家人，懂得家人相伴才是最珍贵的美好。",
      "tags": [
        "AIGC",
        "亲情",
        "留守儿童",
        "愿望"
      ],
      "github": "",
      "demo": "https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc",
      "images": [
        "/projects/洋洋小心愿_1.png",
        "/projects/洋洋小心愿_2.png"
      ],
      "videos": [
        "/projects/7月11日.mp4"
      ],
      "detail": "十岁的洋洋因父母无法陪自己过生日满心孤单，傍晚在老街草丛捡到藏着星空的漂流瓶。夜里瓶子发光带他来到天台，星河圣龙现身，他许下希望父母陪伴过生日的心愿。圣龙化为星光应允祝福。次日一早，奔波归来的父母如约出现，洋洋相拥家人，懂得家人相伴才是最珍贵的美好。"
    }
  ],
  "experienceTitle": "经历",
  "experienceSubtitle": "我的工作与学习历程",
  "experiences": [
    {
      "period": "2026.01 — 2026.06",
      "title": "AIGC 生成师",
      "organization": "杭州云爻文化科技有限公司",
      "description": "参与《被挖灵脉后我飞升上仙》、《冲喜当天，植物人老婆被我扎醒了》等多项商业项目的 AIGC 内容生成。熟练运用即梦、可灵、liblibAI、Stable Diffusion 等平台，高效产出角色概念图、场景图和宣传物料，积累了丰富的商业 AIGC 实战经验。"
    },
    {
      "period": "2023 — 2025（暑假）",
      "title": "助理工程师（散热模组研发）",
      "organization": "昆山莹帆科技有限公司",
      "description": "参与 PC 和服务器散热模组的研发与测试工作，协助工程师完成产品性能测试、数据记录和报告撰写，熟悉了硬件产品的开发流程和质量控制标准。"
    },
    {
      "period": "2023.09 — 2026.06",
      "title": "虚拟现实技术应用 · 大专",
      "organization": "温州职业技术学院",
      "description": "主修虚拟现实技术应用专业，系统学习游戏开发、AIGC 内容生成、动画制作、3D 建模等核心课程。在校期间担任学生会招生就业服务部部长，加入英语学习工作室，积极组织和参与各项校园活动。"
    }
  ],
  "contactTitle": "联系我",
  "contactSubtitle": "期待与你的交流与合作",
  "contacts": [
    {
      "label": "电话",
      "value": "19918175601",
      "href": "tel:19918175601",
      "icon": "mail"
    },
    {
      "label": "邮箱",
      "value": "jiang050504@outlook.com",
      "href": "mailto:jiang050504@outlook.com",
      "icon": "globe"
    },
    {
      "label": "微信",
      "value": "jyl-5601",
      "href": "#",
      "icon": "message-circle"
    },
    {
      "label": "作品集",
      "value": "飞书文档",
      "href": "https://ecnb5b0oiq06.feishu.cn/wiki/TqIwwhLwKiz40lkUo2ncDfBKnhc",
      "icon": "link2"
    }
  ],
  "contactStatusTitle": "求职意向",
  "contactStatusText": "意向岗位：AIGC / 网络 / 计算机 | 期望薪资：7-8K | 意向城市：杭州。如果你有合适的项目或职位，欢迎随时联系我！",
  "theme": "frostmoon",
  "adminPassword": "admin123",
  "wallpaperEnabled": true,
  "wallpaperPath": "",
  "wallpaperOpacity": 0.85,
  "wallpaperBlur": 0,
  "particlesOnWallpaper": true
};
