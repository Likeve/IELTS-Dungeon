export type Chunk = { text: string; meaning: string; fragments: string[]; };

export type Sentence = { id: string; english: string; chinese: string; chunks: Chunk[]; };

export const IELTS_SENTENCES: Sentence[] = [
  {
    "id": "1",
    "english": "The rapid development of AI technologies has significantly transformed modern education systems.",
    "chinese": "人工智能技术的快速发展显著改变了现代教育系统。",
    "chunks": [
      {
        "text": "The rapid development of AI technologies",
        "meaning": "人工智能技术的快速发展",
        "fragments": [
          "The rapid development",
          "of AI technologies"
        ]
      },
      {
        "text": "has significantly transformed",
        "meaning": "显著改变了",
        "fragments": [
          "has significantly",
          "transformed"
        ]
      },
      {
        "text": "modern education systems.",
        "meaning": "现代教育系统。",
        "fragments": [
          "modern",
          "education systems."
        ]
      }
    ]
  },
  {
    "id": "2",
    "english": "Governments should implement stricter regulations to protect endangered species from extinction.",
    "chinese": "政府应实施更严格的法规，以保护濒危物种免于灭绝。",
    "chunks": [
      {
        "text": "Governments should implement",
        "meaning": "政府应实施",
        "fragments": [
          "Governments",
          "should implement"
        ]
      },
      {
        "text": "stricter regulations",
        "meaning": "更严格的法规",
        "fragments": [
          "stricter",
          "regulations"
        ]
      },
      {
        "text": "to protect endangered species",
        "meaning": "以保护濒危物种",
        "fragments": [
          "to protect",
          "endangered species"
        ]
      },
      {
        "text": "from extinction.",
        "meaning": "免于灭绝。",
        "fragments": [
          "from",
          "extinction."
        ]
      }
    ]
  },
  {
    "id": "3",
    "english": "The increasing reliance on fossil fuels has led to severe environmental degradation.",
    "chinese": "对化石燃料日益增长的依赖导致了严重的环境恶化。",
    "chunks": [
      {
        "text": "The increasing reliance",
        "meaning": "日益增长的依赖",
        "fragments": [
          "The increasing",
          "reliance"
        ]
      },
      {
        "text": "on fossil fuels",
        "meaning": "对化石燃料",
        "fragments": [
          "on",
          "fossil fuels"
        ]
      },
      {
        "text": "has led to",
        "meaning": "导致了",
        "fragments": [
          "has",
          "led to"
        ]
      },
      {
        "text": "severe environmental degradation.",
        "meaning": "严重的环境恶化。",
        "fragments": [
          "severe",
          "environmental degradation."
        ]
      }
    ]
  },
  {
    "id": "4",
    "english": "Participating in extracurricular activities helps students cultivate essential social and leadership skills.",
    "chinese": "参加课外活动有助于学生培养基本的社交和领导技能。",
    "chunks": [
      {
        "text": "Participating in",
        "meaning": "参加",
        "fragments": [
          "Participating",
          "in"
        ]
      },
      {
        "text": "extracurricular activities",
        "meaning": "课外活动",
        "fragments": [
          "extracurricular",
          "activities"
        ]
      },
      {
        "text": "helps students cultivate",
        "meaning": "有助于学生培养",
        "fragments": [
          "helps students",
          "cultivate"
        ]
      },
      {
        "text": "essential social and leadership skills.",
        "meaning": "基本的社交和领导技能。",
        "fragments": [
          "essential social",
          "and leadership skills."
        ]
      }
    ]
  },
  {
    "id": "5",
    "english": "The globalization of trade has brought about both unprecedented opportunities and significant challenges.",
    "chinese": "贸易全球化带来了前所未有的机遇和重大挑战。",
    "chunks": [
      {
        "text": "The globalization of trade",
        "meaning": "贸易全球化",
        "fragments": [
          "The globalization",
          "of trade"
        ]
      },
      {
        "text": "has brought about",
        "meaning": "带来了",
        "fragments": [
          "has",
          "brought about"
        ]
      },
      {
        "text": "both unprecedented opportunities",
        "meaning": "前所未有的机遇",
        "fragments": [
          "both",
          "unprecedented opportunities"
        ]
      },
      {
        "text": "and significant challenges.",
        "meaning": "和重大挑战。",
        "fragments": [
          "and",
          "significant challenges."
        ]
      }
    ]
  },
  {
    "id": "6",
    "english": "Children who are exposed to multiple languages tend to develop better cognitive abilities.",
    "chinese": "接触多种语言的儿童往往能发展出更好的认知能力。",
    "chunks": [
      {
        "text": "Children who are exposed to",
        "meaning": "接触...的儿童",
        "fragments": [
          "Children who",
          "are exposed to"
        ]
      },
      {
        "text": "multiple languages",
        "meaning": "多种语言",
        "fragments": [
          "multiple",
          "languages"
        ]
      },
      {
        "text": "tend to develop",
        "meaning": "往往能发展出",
        "fragments": [
          "tend to",
          "develop"
        ]
      },
      {
        "text": "better cognitive abilities.",
        "meaning": "更好的认知能力。",
        "fragments": [
          "better",
          "cognitive abilities."
        ]
      }
    ]
  },
  {
    "id": "7",
    "english": "A well-rounded education plays a pivotal role in shaping an individual's future career prospects.",
    "chinese": "全面的教育在塑造个人未来职业前景方面发挥着关键作用。",
    "chunks": [
      {
        "text": "A well-rounded education",
        "meaning": "全面的教育",
        "fragments": [
          "A well-rounded",
          "education"
        ]
      },
      {
        "text": "plays a pivotal role in",
        "meaning": "在...方面发挥着关键作用",
        "fragments": [
          "plays a",
          "pivotal role in"
        ]
      },
      {
        "text": "shaping an individual's",
        "meaning": "塑造个人的",
        "fragments": [
          "shaping",
          "an individual's"
        ]
      },
      {
        "text": "future career prospects.",
        "meaning": "未来职业前景。",
        "fragments": [
          "future",
          "career prospects."
        ]
      }
    ]
  },
  {
    "id": "8",
    "english": "The transition to a circular economy requires collaborative efforts from all sectors of society.",
    "chinese": "向循环经济的过渡需要社会各界的共同努力。",
    "chunks": [
      {
        "text": "The transition to",
        "meaning": "向...的过渡",
        "fragments": [
          "The transition",
          "to"
        ]
      },
      {
        "text": "a circular economy",
        "meaning": "循环经济",
        "fragments": [
          "a circular",
          "economy"
        ]
      },
      {
        "text": "requires collaborative efforts",
        "meaning": "需要共同努力",
        "fragments": [
          "requires",
          "collaborative efforts"
        ]
      },
      {
        "text": "from all sectors of society.",
        "meaning": "来自社会各界。",
        "fragments": [
          "from all sectors",
          "of society."
        ]
      }
    ]
  },
  {
    "id": "9",
    "english": "Excessive consumption of fast food is a major contributing factor to the global obesity epidemic.",
    "chinese": "过度食用快餐是导致全球肥胖流行的主要因素。",
    "chunks": [
      {
        "text": "Excessive consumption",
        "meaning": "过度消费/食用",
        "fragments": [
          "Excessive",
          "consumption"
        ]
      },
      {
        "text": "of fast food",
        "meaning": "快餐",
        "fragments": [
          "of",
          "fast food"
        ]
      },
      {
        "text": "is a major contributing factor to",
        "meaning": "是导致...的主要因素",
        "fragments": [
          "is a major",
          "contributing factor to"
        ]
      },
      {
        "text": "the global obesity epidemic.",
        "meaning": "全球肥胖流行。",
        "fragments": [
          "the global",
          "obesity epidemic."
        ]
      }
    ]
  },
  {
    "id": "10",
    "english": "Renewable energy sources are widely considered the most viable solution to the current energy crisis.",
    "chinese": "可再生能源被广泛认为是解决当前能源危机最可行的方案。",
    "chunks": [
      {
        "text": "Renewable energy sources",
        "meaning": "可再生能源",
        "fragments": [
          "Renewable",
          "energy sources"
        ]
      },
      {
        "text": "are widely considered",
        "meaning": "被广泛认为是",
        "fragments": [
          "are widely",
          "considered"
        ]
      },
      {
        "text": "the most viable solution to",
        "meaning": "解决...最可行的方案",
        "fragments": [
          "the most",
          "viable solution to"
        ]
      },
      {
        "text": "the current energy crisis.",
        "meaning": "当前的能源危机。",
        "fragments": [
          "the current",
          "energy crisis."
        ]
      }
    ]
  },
  {
    "id": "11",
    "english": "The widespread availability of digital information has fundamentally democratized the modern learning process.",
    "chinese": "数字信息的广泛普及从根本上使现代学习过程民主化。",
    "chunks": [
      {
        "text": "The widespread availability",
        "meaning": "广泛的普及",
        "fragments": [
          "The widespread",
          "availability"
        ]
      },
      {
        "text": "of digital information",
        "meaning": "数字信息",
        "fragments": [
          "of digital",
          "information"
        ]
      },
      {
        "text": "has fundamentally democratized",
        "meaning": "从根本上民主化了",
        "fragments": [
          "has fundamentally",
          "democratized"
        ]
      },
      {
        "text": "the modern learning process.",
        "meaning": "现代学习过程。",
        "fragments": [
          "the modern",
          "learning process."
        ]
      }
    ]
  },
  {
    "id": "12",
    "english": "Striking a healthy balance between work and personal life is vital for long-term mental well-being.",
    "chinese": "在工作和个人生活之间取得健康的平衡对长期的心理健康至关重要。",
    "chunks": [
      {
        "text": "Striking a healthy balance",
        "meaning": "取得健康的平衡",
        "fragments": [
          "Striking a",
          "healthy balance"
        ]
      },
      {
        "text": "between work and personal life",
        "meaning": "在工作和个人生活之间",
        "fragments": [
          "between work",
          "and personal life"
        ]
      },
      {
        "text": "is vital for",
        "meaning": "对...至关重要",
        "fragments": [
          "is vital",
          "for"
        ]
      },
      {
        "text": "long-term mental well-being.",
        "meaning": "长期的心理健康。",
        "fragments": [
          "long-term",
          "mental well-being."
        ]
      }
    ]
  },
  {
    "id": "13",
    "english": "Rapid urbanization has resulted in the displacement of wildlife and irreversible loss of natural habitats.",
    "chinese": "快速的城市化导致了野生动物的流离失所和自然栖息地不可逆转的丧失。",
    "chunks": [
      {
        "text": "Rapid urbanization",
        "meaning": "快速的城市化",
        "fragments": [
          "Rapid",
          "urbanization"
        ]
      },
      {
        "text": "has resulted in",
        "meaning": "导致了",
        "fragments": [
          "has",
          "resulted in"
        ]
      },
      {
        "text": "the displacement of wildlife",
        "meaning": "野生动物的流离失所",
        "fragments": [
          "the displacement",
          "of wildlife"
        ]
      },
      {
        "text": "and irreversible loss of natural habitats.",
        "meaning": "和自然栖息地不可逆转的丧失。",
        "fragments": [
          "and irreversible loss",
          "of natural habitats."
        ]
      }
    ]
  },
  {
    "id": "14",
    "english": "Fostering a strong sense of community is necessary to combat the growing feeling of social isolation.",
    "chinese": "培养强烈的社区意识对于对抗日益增长的社会孤独感是必要的。",
    "chunks": [
      {
        "text": "Fostering a strong sense",
        "meaning": "培养强烈的意识",
        "fragments": [
          "Fostering a",
          "strong sense"
        ]
      },
      {
        "text": "of community",
        "meaning": "社区的",
        "fragments": [
          "of",
          "community"
        ]
      },
      {
        "text": "is necessary to combat",
        "meaning": "对于对抗...是必要的",
        "fragments": [
          "is necessary",
          "to combat"
        ]
      },
      {
        "text": "the growing feeling of social isolation.",
        "meaning": "日益增长的社会孤独感。",
        "fragments": [
          "the growing feeling",
          "of social isolation."
        ]
      }
    ]
  },
  {
    "id": "15",
    "english": "The mainstream media exerts a profound influence on public perception and established societal norms.",
    "chinese": "主流媒体对公众认知和既定的社会规范产生深远的影响。",
    "chunks": [
      {
        "text": "The mainstream media",
        "meaning": "主流媒体",
        "fragments": [
          "The mainstream",
          "media"
        ]
      },
      {
        "text": "exerts a profound influence on",
        "meaning": "对...产生深远的影响",
        "fragments": [
          "exerts a",
          "profound influence on"
        ]
      },
      {
        "text": "public perception",
        "meaning": "公众认知",
        "fragments": [
          "public",
          "perception"
        ]
      },
      {
        "text": "and established societal norms.",
        "meaning": "和既定的社会规范。",
        "fragments": [
          "and established",
          "societal norms."
        ]
      }
    ]
  },
  {
    "id": "16",
    "english": "Investing heavily in early childhood education yields the highest long-term return on investment for society.",
    "chinese": "大力投资幼儿教育能为社会带来最高的长期投资回报。",
    "chunks": [
      {
        "text": "Investing heavily in",
        "meaning": "大力投资于",
        "fragments": [
          "Investing heavily",
          "in"
        ]
      },
      {
        "text": "early childhood education",
        "meaning": "幼儿教育",
        "fragments": [
          "early childhood",
          "education"
        ]
      },
      {
        "text": "yields the highest long-term",
        "meaning": "产生最高的长期",
        "fragments": [
          "yields the highest",
          "long-term"
        ]
      },
      {
        "text": "return on investment for society.",
        "meaning": "对社会的投资回报。",
        "fragments": [
          "return on investment",
          "for society."
        ]
      }
    ]
  },
  {
    "id": "17",
    "english": "Technological innovations have significantly enhanced the overall efficiency of global agricultural production.",
    "chinese": "技术创新显著提高了全球农业生产的整体效率。",
    "chunks": [
      {
        "text": "Technological innovations",
        "meaning": "技术创新",
        "fragments": [
          "Technological",
          "innovations"
        ]
      },
      {
        "text": "have significantly enhanced",
        "meaning": "显著提高了",
        "fragments": [
          "have significantly",
          "enhanced"
        ]
      },
      {
        "text": "the overall efficiency of",
        "meaning": "的整体效率",
        "fragments": [
          "the overall efficiency",
          "of"
        ]
      },
      {
        "text": "global agricultural production.",
        "meaning": "全球农业生产。",
        "fragments": [
          "global",
          "agricultural production."
        ]
      }
    ]
  },
  {
    "id": "18",
    "english": "Promoting gender equality in the workplace is not only a moral imperative but also an economic necessity.",
    "chinese": "在工作场所促进性别平等不仅是道德上的必然要求，也是经济上的必然需要。",
    "chunks": [
      {
        "text": "Promoting gender equality",
        "meaning": "促进性别平等",
        "fragments": [
          "Promoting",
          "gender equality"
        ]
      },
      {
        "text": "in the workplace",
        "meaning": "在工作场所",
        "fragments": [
          "in the",
          "workplace"
        ]
      },
      {
        "text": "is not only a moral imperative",
        "meaning": "不仅是道德上的必然要求",
        "fragments": [
          "is not only",
          "a moral imperative"
        ]
      },
      {
        "text": "but also an economic necessity.",
        "meaning": "也是经济上的必然需要。",
        "fragments": [
          "but also",
          "an economic necessity."
        ]
      }
    ]
  },
  {
    "id": "19",
    "english": "The continuous deterioration of urban air quality poses a severe and immediate threat to public health.",
    "chinese": "城市空气质量的持续恶化对公众健康构成了严重而直接的威胁。",
    "chunks": [
      {
        "text": "The continuous deterioration",
        "meaning": "持续的恶化",
        "fragments": [
          "The continuous",
          "deterioration"
        ]
      },
      {
        "text": "of urban air quality",
        "meaning": "城市空气质量的",
        "fragments": [
          "of urban",
          "air quality"
        ]
      },
      {
        "text": "poses a severe and immediate threat to",
        "meaning": "对...构成严重而直接的威胁",
        "fragments": [
          "poses a severe",
          "and immediate threat to"
        ]
      },
      {
        "text": "public health.",
        "meaning": "公众健康。",
        "fragments": [
          "public",
          "health."
        ]
      }
    ]
  },
  {
    "id": "20",
    "english": "Cultivating independent critical thinking skills is far more important than merely memorizing factual knowledge.",
    "chinese": "培养独立的批判性思维技能远比仅仅记住事实知识更重要。",
    "chunks": [
      {
        "text": "Cultivating independent",
        "meaning": "培养独立的",
        "fragments": [
          "Cultivating",
          "independent"
        ]
      },
      {
        "text": "critical thinking skills",
        "meaning": "批判性思维技能",
        "fragments": [
          "critical thinking",
          "skills"
        ]
      },
      {
        "text": "is far more important than",
        "meaning": "远比...更重要",
        "fragments": [
          "is far more",
          "important than"
        ]
      },
      {
        "text": "merely memorizing factual knowledge.",
        "meaning": "仅仅记住事实知识。",
        "fragments": [
          "merely memorizing",
          "factual knowledge."
        ]
      }
    ]
  },
  {
    "id": "21",
    "english": "The booming tourism industry contributes substantially to the rapid economic growth of many developing countries.",
    "chinese": "蓬勃发展的旅游业对许多发展中国家的快速经济增长做出了巨大贡献。",
    "chunks": [
      {
        "text": "The booming tourism industry",
        "meaning": "蓬勃发展的旅游业",
        "fragments": [
          "The booming",
          "tourism industry"
        ]
      },
      {
        "text": "contributes substantially to",
        "meaning": "对...做出巨大贡献",
        "fragments": [
          "contributes substantially",
          "to"
        ]
      },
      {
        "text": "the rapid economic growth of",
        "meaning": "的快速经济增长",
        "fragments": [
          "the rapid",
          "economic growth of"
        ]
      },
      {
        "text": "many developing countries.",
        "meaning": "许多发展中国家。",
        "fragments": [
          "many",
          "developing countries."
        ]
      }
    ]
  },
  {
    "id": "22",
    "english": "Implementing a system of progressive taxation can effectively help alleviate the ever-widening wealth gap.",
    "chinese": "实施累进税制可以有效地帮助缓解不断扩大的贫富差距。",
    "chunks": [
      {
        "text": "Implementing a system of",
        "meaning": "实施...的制度",
        "fragments": [
          "Implementing a",
          "system of"
        ]
      },
      {
        "text": "progressive taxation",
        "meaning": "累进税",
        "fragments": [
          "progressive",
          "taxation"
        ]
      },
      {
        "text": "can effectively help alleviate",
        "meaning": "可以有效地帮助缓解",
        "fragments": [
          "can effectively",
          "help alleviate"
        ]
      },
      {
        "text": "the ever-widening wealth gap.",
        "meaning": "不断扩大的贫富差距。",
        "fragments": [
          "the ever-widening",
          "wealth gap."
        ]
      }
    ]
  },
  {
    "id": "23",
    "english": "The strict preservation of global biodiversity is absolutely essential for maintaining a stable ecological balance.",
    "chinese": "严格保护全球生物多样性对于维持稳定的生态平衡绝对至关重要。",
    "chunks": [
      {
        "text": "The strict preservation of",
        "meaning": "严格保护",
        "fragments": [
          "The strict",
          "preservation of"
        ]
      },
      {
        "text": "global biodiversity",
        "meaning": "全球生物多样性",
        "fragments": [
          "global",
          "biodiversity"
        ]
      },
      {
        "text": "is absolutely essential for",
        "meaning": "对于...绝对至关重要",
        "fragments": [
          "is absolutely",
          "essential for"
        ]
      },
      {
        "text": "maintaining a stable ecological balance.",
        "meaning": "维持稳定的生态平衡。",
        "fragments": [
          "maintaining a stable",
          "ecological balance."
        ]
      }
    ]
  },
  {
    "id": "24",
    "english": "Universal access to affordable and quality healthcare should be universally recognized as a fundamental human right.",
    "chinese": "普遍获得负担得起的优质医疗保健应被普遍承认为一项基本人权。",
    "chunks": [
      {
        "text": "Universal access to",
        "meaning": "普遍获得",
        "fragments": [
          "Universal",
          "access to"
        ]
      },
      {
        "text": "affordable and quality healthcare",
        "meaning": "负担得起的优质医疗保健",
        "fragments": [
          "affordable and",
          "quality healthcare"
        ]
      },
      {
        "text": "should be universally recognized as",
        "meaning": "应被普遍承认为",
        "fragments": [
          "should be",
          "universally recognized as"
        ]
      },
      {
        "text": "a fundamental human right.",
        "meaning": "一项基本人权。",
        "fragments": [
          "a fundamental",
          "human right."
        ]
      }
    ]
  },
  {
    "id": "25",
    "english": "The seamless integration of smart technology in modern classrooms has completely revolutionized traditional teaching methods.",
    "chinese": "智能技术在现代课堂中的无缝整合彻底改变了传统的教学方法。",
    "chunks": [
      {
        "text": "The seamless integration of",
        "meaning": "无缝整合",
        "fragments": [
          "The seamless",
          "integration of"
        ]
      },
      {
        "text": "smart technology",
        "meaning": "智能技术",
        "fragments": [
          "smart",
          "technology"
        ]
      },
      {
        "text": "in modern classrooms",
        "meaning": "在现代课堂中",
        "fragments": [
          "in modern",
          "classrooms"
        ]
      },
      {
        "text": "has completely revolutionized",
        "meaning": "彻底改变了",
        "fragments": [
          "has completely",
          "revolutionized"
        ]
      },
      {
        "text": "traditional teaching methods.",
        "meaning": "传统的教学方法。",
        "fragments": [
          "traditional",
          "teaching methods."
        ]
      }
    ]
  },
  {
    "id": "26",
    "english": "Effectively addressing the impacts of climate change demands immediate and highly concerted international action.",
    "chinese": "有效应对气候变化的影响需要立即采取高度一致的国际行动。",
    "chunks": [
      {
        "text": "Effectively addressing the impacts of",
        "meaning": "有效应对...的影响",
        "fragments": [
          "Effectively addressing",
          "the impacts of"
        ]
      },
      {
        "text": "climate change",
        "meaning": "气候变化",
        "fragments": [
          "climate",
          "change"
        ]
      },
      {
        "text": "demands immediate and highly concerted",
        "meaning": "需要立即采取高度一致的",
        "fragments": [
          "demands immediate",
          "and highly concerted"
        ]
      },
      {
        "text": "international action.",
        "meaning": "国际行动。",
        "fragments": [
          "international",
          "action."
        ]
      }
    ]
  },
  {
    "id": "27",
    "english": "Providing comprehensive financial support to small businesses is crucial for stimulating local economic recovery.",
    "chinese": "为小企业提供全面的财政支持对于刺激当地经济复苏至关重要。",
    "chunks": [
      {
        "text": "Providing comprehensive",
        "meaning": "提供全面的",
        "fragments": [
          "Providing",
          "comprehensive"
        ]
      },
      {
        "text": "financial support to small businesses",
        "meaning": "对小企业的财政支持",
        "fragments": [
          "financial support",
          "to small businesses"
        ]
      },
      {
        "text": "is crucial for stimulating",
        "meaning": "对于刺激...至关重要",
        "fragments": [
          "is crucial for",
          "stimulating"
        ]
      },
      {
        "text": "local economic recovery.",
        "meaning": "当地经济复苏。",
        "fragments": [
          "local",
          "economic recovery."
        ]
      }
    ]
  },
  {
    "id": "28",
    "english": "The unprecedented proliferation of social media platforms has fundamentally altered the way modern people communicate.",
    "chinese": "社交媒体平台前所未有的激增从根本上改变了现代人交流的方式。",
    "chunks": [
      {
        "text": "The unprecedented proliferation of",
        "meaning": "前所未有的激增",
        "fragments": [
          "The unprecedented",
          "proliferation of"
        ]
      },
      {
        "text": "social media platforms",
        "meaning": "社交媒体平台",
        "fragments": [
          "social media",
          "platforms"
        ]
      },
      {
        "text": "has fundamentally altered",
        "meaning": "从根本上改变了",
        "fragments": [
          "has fundamentally",
          "altered"
        ]
      },
      {
        "text": "the way modern people communicate.",
        "meaning": "现代人交流的方式。",
        "fragments": [
          "the way",
          "modern people communicate."
        ]
      }
    ]
  },
  {
    "id": "29",
    "english": "Encouraging citizens to adopt environmentally friendly lifestyles is key to achieving long-term sustainable development.",
    "chinese": "鼓励公民采取环保的生活方式是实现长期可持续发展的关键。",
    "chunks": [
      {
        "text": "Encouraging citizens to adopt",
        "meaning": "鼓励公民采取",
        "fragments": [
          "Encouraging citizens",
          "to adopt"
        ]
      },
      {
        "text": "environmentally friendly lifestyles",
        "meaning": "环保的生活方式",
        "fragments": [
          "environmentally friendly",
          "lifestyles"
        ]
      },
      {
        "text": "is key to achieving",
        "meaning": "是实现...的关键",
        "fragments": [
          "is key to",
          "achieving"
        ]
      },
      {
        "text": "long-term sustainable development.",
        "meaning": "长期的可持续发展。",
        "fragments": [
          "long-term",
          "sustainable development."
        ]
      }
    ]
  },
  {
    "id": "30",
    "english": "The preservation of historical monuments allows future generations to better understand their unique cultural heritage.",
    "chinese": "保护历史古迹使子孙后代能够更好地了解他们独特的文化遗产。",
    "chunks": [
      {
        "text": "The preservation of",
        "meaning": "对...的保护",
        "fragments": [
          "The preservation",
          "of"
        ]
      },
      {
        "text": "historical monuments",
        "meaning": "历史古迹",
        "fragments": [
          "historical",
          "monuments"
        ]
      },
      {
        "text": "allows future generations to",
        "meaning": "使子孙后代能够",
        "fragments": [
          "allows future",
          "generations to"
        ]
      },
      {
        "text": "better understand their unique",
        "meaning": "更好地了解他们独特的",
        "fragments": [
          "better understand",
          "their unique"
        ]
      },
      {
        "text": "cultural heritage.",
        "meaning": "文化遗产。",
        "fragments": [
          "cultural",
          "heritage."
        ]
      }
    ]
  }
];
