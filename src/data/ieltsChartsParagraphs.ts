export interface ParagraphQuestion {
  id: string;
  question: string;
}

export interface ParagraphWritingData {
  prompt: string;
  instruction: string;
  questions: ParagraphQuestion[];
  keywords: string[];
  tips: string[];
}

export interface ChartParagraphs {
  paragraph1: ParagraphWritingData;
  paragraph2: ParagraphWritingData;
  paragraph3: ParagraphWritingData;
  paragraph4: ParagraphWritingData;
}

export const PARAGRAPHS_DATA: Record<string, ChartParagraphs> = {
  "line-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the chart show in terms of subject matter?" },
        { id: "q3", question: "What time period does the data cover?" },
        { id: "q4", question: "What unit of measurement is used on the y-axis?" },
      ],
      keywords: ["line graph", "energy consumption", "United Kingdom", "between 2000 and 2020", "million tonnes oil equivalent", "sources"],
      tips: ["用同义词改写（如 shows → illustrates）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "What was the overall trend for coal consumption?" },
        { id: "q2", question: "Which source became the dominant one by the end of the period?" },
        { id: "q3", question: "What trend did renewables follow throughout the period?" },
        { id: "q4", question: "Did natural gas increase or decrease overall?" },
      ],
      keywords: ["overall", "while", "declined dramatically", "rose considerably", "dominant", "continuous upward trend"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What was coal consumption at the start of the period (2000)?" },
        { id: "q2", question: "What did coal consumption fall to by 2020?" },
        { id: "q3", question: "How did coal consumption change between 2010 and 2015?" },
        { id: "q4", question: "In which year did natural gas first overtake coal?" },
      ],
      keywords: ["fell dramatically", "from 85", "to just 28", "sharp decline", "plummeted", "overtaken"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "How did natural gas consumption change from 2000 to 2015?" },
        { id: "q2", question: "What happened to natural gas between 2015 and 2020?" },
        { id: "q3", question: "What was the starting and ending value for renewables?" },
        { id: "q4", question: "When did renewables overtake coal?" },
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "rose steadily", "stabilized", "overtook"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "line-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "Which three cities are compared?" },
        { id: "q3", question: "What aspect of climate is being measured?" },
        { id: "q4", question: "What is the unit of measurement?" },
      ],
      keywords: ["line graph", "average monthly temperatures", "Celsius", "London", "Tokyo", "Sydney"],
      tips: ["用同义词改写（如 shows → compares）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which city had the highest temperatures overall?" },
        { id: "q2", question: "How did Sydney's seasonal pattern compare to the other two cities?" },
        { id: "q3", question: "When did London and Tokyo both reach their peak?" },
        { id: "q4", question: "Which city had the lowest temperatures?" },
      ],
      keywords: ["overall", "whereas", "opposite pattern", "Southern Hemisphere", "peaked in July", "inverse"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What was Tokyo's starting temperature in January?" },
        { id: "q2", question: "What was Tokyo's peak temperature and in which month?" },
        { id: "q3", question: "How did London's temperature range compare to Tokyo's?" },
        { id: "q4", question: "When did both London and Tokyo reach their highest points?" },
      ],
      keywords: ["Tokyo recorded", "peaked at 26°C", "highest temperatures", "consistently higher", "rose from 6", "reached 26 in July"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What was Sydney's highest temperature and when did it occur?" },
        { id: "q2", question: "What was Sydney's lowest temperature and in which month?" },
        { id: "q3", question: "How did Sydney's seasonal cycle differ from London and Tokyo?" },
        { id: "q4", question: "What was London's temperature range throughout the year?" },
      ],
      keywords: ["by contrast", "opposite pattern", "peaked in January at 23°C", "fell to 13°C in July", "London ranged from 5 to 19", "whereas"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "line-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What is the subject of the chart?" },
        { id: "q3", question: "What time period does the data cover?" },
        { id: "q4", question: "What unit is used for the y-axis?" },
      ],
      keywords: ["line graph", "internet users", "percentage", "age groups", "between 2010 and 2022", "different"],
      tips: ["用同义词改写（如 shows → depicts）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "What was the overall trend for all age groups?" },
        { id: "q2", question: "Which age group experienced the most dramatic growth?" },
        { id: "q3", question: "What happened to the gap between the youngest and oldest groups?" },
        { id: "q4", question: "Which age group had the highest usage throughout?" },
      ],
      keywords: ["overall", "increased", "most dramatic growth", "narrowed considerably", "across all groups", "gap"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What was the 16-24 age group's percentage in 2010?" },
        { id: "q2", question: "What did it reach by 2018 and 2022?" },
        { id: "q3", question: "What was the starting percentage for the 25-44 group?" },
        { id: "q4", question: "How much did the 25-44 group increase by 2022?" },
      ],
      keywords: ["16-24", "92% in 2010", "rose to 99%", "25-44", "from 85% to 98%", "nearly universal"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What was the 45-64 group's usage in 2010 and 2022?" },
        { id: "q2", question: "What was the 65+ group's starting and ending percentage?" },
        { id: "q3", question: "The 65+ group increased by how many percentage points?" },
        { id: "q4", question: "How did the growth rate of the 65+ group compare to other groups?" },
      ],
      keywords: ["meanwhile", "45-64 rose from 52% to 91%", "whereas", "65+ surged from 18% to 62%", "more than threefold", "by contrast"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "bar-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the chart compare?" },
        { id: "q3", question: "What year does the data refer to?" },
        { id: "q4", question: "What unit of measurement is used?" },
      ],
      keywords: ["bar chart", "renewable energy production", "terawatt-hours", "top six countries", "2022", "compares"],
      tips: ["用同义词改写（如 shows → compares）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which country produced by far the most renewable energy?" },
        { id: "q2", question: "Which country ranked second?" },
        { id: "q3", question: "Which country produced the least?" },
        { id: "q4", question: "Was China's output significantly higher than the others?" },
      ],
      keywords: ["overall", "by far the largest", "distant second", "produced the least", "significantly", "ranking"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "How much renewable energy did China produce?" },
        { id: "q2", question: "How much did the USA produce?" },
        { id: "q3", question: "China's production was more than how many times that of the USA?" },
        { id: "q4", question: "How did Brazil's output compare to China's?" },
      ],
      keywords: ["China produced 2,850 TWh", "the USA at 1,200 TWh", "more than double", "Brazil with 680 TWh", "leading producer", "far exceeded"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "How much did India and Germany produce respectively?" },
        { id: "q2", question: "What was Japan's production figure?" },
        { id: "q3", question: "How did Germany and Japan compare?" },
        { id: "q4", question: "Approximately what was the gap between the highest and lowest?" },
      ],
      keywords: ["meanwhile", "India at 520 TWh", "Germany at 350 TWh", "whereas", "Japan generated only 280 TWh", "approximately tenfold gap", "by contrast"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "bar-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the chart display?" },
        { id: "q3", question: "What year does the data refer to?" },
        { id: "q4", question: "What does the y-axis represent?" },
      ],
      keywords: ["bar chart", "university enrolment", "faculties", "2023", "number of students", "major university"],
      tips: ["用同义词改写（如 shows → displays）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which two faculties attracted the most students?" },
        { id: "q2", question: "Which faculty had the lowest enrolment?" },
        { id: "q3", question: "What was the general range of enrolment figures?" },
        { id: "q4", question: "Did Engineering and Business dominate the figures?" },
      ],
      keywords: ["overall", "most popular", "fewest students", "dominated", "while", "significant variation"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What was Engineering's enrolment figure?" },
        { id: "q2", question: "How many students did Business enrol?" },
        { id: "q3", question: "Engineering was approximately how many times that of Law?" },
        { id: "q4", question: "How did Science's enrolment rank among the six faculties?" },
      ],
      keywords: ["Engineering at 4,200", "followed by", "Business at 3,800", "Science at 2,900", "ranked third", "nearly three times"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "How many students did Arts enrol?" },
        { id: "q2", question: "What were the figures for Medicine and Law?" },
        { id: "q3", question: "How did Arts compare to Medicine?" },
        { id: "q4", question: "Was Law the lowest and by how much compared to Engineering?" },
      ],
      keywords: ["meanwhile", "Arts at 2,100", "Medicine at 1,800", "by contrast", "Law the lowest at 1,500", "whereas", "half as many"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "bar-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the chart compare?" },
        { id: "q3", question: "How many cities are being compared?" },
        { id: "q4", question: "What is the unit of measurement?" },
      ],
      keywords: ["bar chart", "average monthly rainfall", "millimetres", "six cities", "compares", "across"],
      tips: ["用同义词改写（如 shows → compares）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which city had the highest rainfall?" },
        { id: "q2", question: "Which city received almost no rainfall?" },
        { id: "q3", question: "Was there a significant disparity among the cities?" },
        { id: "q4", question: "What was the general distribution pattern?" },
      ],
      keywords: ["overall", "highest rainfall", "negligible figure", "significant disparity", "while", "varied widely"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What was Singapore's monthly rainfall?" },
        { id: "q2", question: "How much did Mumbai receive?" },
        { id: "q3", question: "How did Mumbai and Singapore compare to each other?" },
        { id: "q4", question: "Mumbai's rainfall was more than how many times Sydney's?" },
      ],
      keywords: ["Singapore at 240mm", "Mumbai at 220mm", "closely followed", "more than twice Sydney", "substantially higher", "the two wettest"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "How much rainfall did Sydney and Toronto receive?" },
        { id: "q2", question: "What was London's rainfall figure?" },
        { id: "q3", question: "How did Cairo compare to the other cities?" },
        { id: "q4", question: "What was the gap between the highest and the lowest?" },
      ],
      keywords: ["meanwhile", "Sydney at 85mm", "Toronto at 75mm", "London at 65mm", "by contrast", "Cairo only 5mm", "whereas"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "pie-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the chart show?" },
        { id: "q3", question: "What year does the data refer to?" },
        { id: "q4", question: "How is the data measured?" },
      ],
      keywords: ["pie chart", "global energy consumption", "distribution", "by source", "2021", "percentage"],
      tips: ["用同义词改写（如 shows → illustrates）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which category dominated global energy consumption?" },
        { id: "q2", question: "What was the approximate combined share of fossil fuels?" },
        { id: "q3", question: "Which source had the smallest share?" },
        { id: "q4", question: "How did renewable sources compare to fossil fuels?" },
      ],
      keywords: ["overall", "fossil fuels dominated", "largest share", "smallest share", "whereas", "majority"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What percentage did oil account for?" },
        { id: "q2", question: "What was coal's share?" },
        { id: "q3", question: "What percentage did natural gas represent?" },
        { id: "q4", question: "What was the combined share of the three fossil fuels?" },
      ],
      keywords: ["oil at 31%", "coal at 27%", "natural gas at 24%", "combined 82%", "constituted the majority", "fossil fuels"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What percentage did hydro and other renewables each account for?" },
        { id: "q2", question: "What was nuclear's share?" },
        { id: "q3", question: "How did nuclear compare to hydro?" },
        { id: "q4", question: "What was the total share of all non-fossil sources?" },
      ],
      keywords: ["by contrast", "hydro at 7%", "other renewables at 7%", "meanwhile", "nuclear at just 4%", "whereas", "only 18% combined"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "pie-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the chart illustrate?" },
        { id: "q3", question: "What year is the data from?" },
        { id: "q4", question: "What unit is used to express the data?" },
      ],
      keywords: ["pie chart", "household expenditure", "monthly income", "categories", "2022", "percentage"],
      tips: ["用同义词改写（如 shows → illustrates）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which category accounted for the largest share?" },
        { id: "q2", question: "Which category had the smallest share?" },
        { id: "q3", question: "Which two categories together accounted for over half?" },
        { id: "q4", question: "How did the distribution of expenditure look overall?" },
      ],
      keywords: ["overall", "largest expenditure", "smallest share", "accounted for over half", "while", "significant variation"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What percentage did housing account for?" },
        { id: "q2", question: "What was food's share?" },
        { id: "q3", question: "What was the combined share of housing and food?" },
        { id: "q4", question: "How did housing and food compare to other categories?" },
      ],
      keywords: ["housing at 35%", "food at 22%", "combined 57%", "the dominant category", "followed by", "over half"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What percentage did transport account for?" },
        { id: "q2", question: "Which two categories each accounted for 10%?" },
        { id: "q3", question: "What was the smallest category and its percentage?" },
        { id: "q4", question: "How did healthcare and entertainment compare to education?" },
      ],
      keywords: ["meanwhile", "transport at 15%", "healthcare and entertainment each at 10%", "by contrast", "education at just 8%", "whereas", "smallest"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "pie-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the chart illustrate?" },
        { id: "q3", question: "What country and year does the data cover?" },
        { id: "q4", question: "What unit is used?" },
      ],
      keywords: ["pie chart", "water consumption", "sectors", "Australia", "2020", "percentage"],
      tips: ["用同义词改写（如 shows → illustrates）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which sector dominated water consumption?" },
        { id: "q2", question: "Which sector used the least water?" },
        { id: "q3", question: "How did household and industry consumption compare?" },
        { id: "q4", question: "What was the general distribution pattern?" },
      ],
      keywords: ["overall", "dominated", "by far the largest", "smallest", "while", "relatively similar"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What percentage did agriculture account for?" },
        { id: "q2", question: "Agricultural use was roughly how many times that of industry?" },
        { id: "q3", question: "How did agriculture's share compare to all other sectors combined?" },
        { id: "q4", question: "Was agriculture the dominant consumer?" },
      ],
      keywords: ["agriculture at 62%", "responsible for most", "about five times industry", "dominant", "far exceeded", "majority"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What percentage did households account for?" },
        { id: "q2", question: "What was the industry share?" },
        { id: "q3", question: "What were the figures for mining and other?" },
        { id: "q4", question: "What was the combined share of mining and other?" },
      ],
      keywords: ["meanwhile", "household at 14%", "industry at 12%", "whereas", "mining at 7%", "other at just 5%", "by contrast"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "table-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the table show?" },
        { id: "q3", question: "What year does the data refer to?" },
        { id: "q4", question: "What are the units of measurement?" },
      ],
      keywords: ["table", "most spoken languages", "native and total speakers", "2023", "millions", "six languages"],
      tips: ["用同义词改写（如 shows → provides data on）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which language had the most native speakers?" },
        { id: "q2", question: "Which language had the highest total number of speakers?" },
        { id: "q3", question: "Which language had the fewest native speakers?" },
        { id: "q4", question: "How did native and total speaker rankings differ?" },
      ],
      keywords: ["overall", "most native speakers", "highest total", "fewest native", "while", "ranking differed"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "How many native speakers did Mandarin have?" },
        { id: "q2", question: "How many total speakers did English have?" },
        { id: "q3", question: "How many native speakers did English have?" },
        { id: "q4", question: "What was the difference between Mandarin's native and total speakers?" },
      ],
      keywords: ["Mandarin at 940M native", "English at 1,450M total", "380M native English", "led in total speakers", "most native", "highest overall"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "How many native and total speakers did Spanish have?" },
        { id: "q2", question: "What were Hindi's figures for native and total?" },
        { id: "q3", question: "How did French compare to the other languages?" },
        { id: "q4", question: "What were Arabic's native and total speaker numbers?" },
      ],
      keywords: ["meanwhile", "Spanish at 485M native / 560M total", "Hindi at 345M native / 610M total", "by contrast", "French only 80M native", "whereas", "Arabic at 315M native"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "table-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the table compare?" },
        { id: "q3", question: "What time period does the data refer to?" },
        { id: "q4", question: "What metrics are shown?" },
      ],
      keywords: ["table", "smartphone market share", "units shipped", "year-on-year growth", "Q4 2023", "top five brands"],
      tips: ["用同义词改写（如 shows → compares）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which brand held the largest market share?" },
        { id: "q2", question: "Which brand showed the fastest growth?" },
        { id: "q3", question: "Which brand experienced a decline?" },
        { id: "q4", question: "Did all brands show positive growth?" },
      ],
      keywords: ["overall", "led the market", "fastest growth", "only brand to decline", "while", "negative growth"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What was Apple's market share?" },
        { id: "q2", question: "How many units did Apple ship?" },
        { id: "q3", question: "What was Samsung's market share and units shipped?" },
        { id: "q4", question: "What was Samsung's year-on-year growth rate?" },
      ],
      keywords: ["Apple at 24% share", "80.5M units", "+11% growth", "Samsung at 18%", "60.2M units", "-9% decline"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What was Xiaomi's market share and growth rate?" },
        { id: "q2", question: "What were Oppo's figures?" },
        { id: "q3", question: "What was Vivo's market share and growth?" },
        { id: "q4", question: "How did Xiaomi's growth compare to Samsung's?" },
      ],
      keywords: ["meanwhile", "Xiaomi at 13% with +23% growth", "Oppo at 9% with +8%", "by contrast", "Vivo at 8% with +5%", "whereas", "fastest growing"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "table-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of chart is this?" },
        { id: "q2", question: "What does the table display?" },
        { id: "q3", question: "What event and year does the data cover?" },
        { id: "q4", question: "What categories of medals are shown?" },
      ],
      keywords: ["table", "medal counts", "top five countries", "2024 Olympic Games", "gold, silver, bronze", "total"],
      tips: ["用同义词改写（如 shows → presents）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Which two countries tied for the most gold medals?" },
        { id: "q2", question: "Which country won the most total medals?" },
        { id: "q3", question: "Which country had the fewest total medals?" },
        { id: "q4", question: "How did the total medal ranking differ from gold medals?" },
      ],
      keywords: ["overall", "tied for most gold", "led in total medals", "fewest total", "while", "significant margin"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "How many gold medals did the USA and China each win?" },
        { id: "q2", question: "What was the USA's total medal count?" },
        { id: "q3", question: "What was China's total medal count?" },
        { id: "q4", question: "How did the USA's total compare to China's?" },
      ],
      keywords: ["tied with 40 gold each", "USA at 126 total", "China at 91 total", "significantly higher", "led overall", "by 35 medals"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "How many total medals did France win?" },
        { id: "q2", question: "What were Australia's medal figures?" },
        { id: "q3", question: "What were Japan's gold and total medals?" },
        { id: "q4", question: "How did France's total exceed Australia's despite fewer golds?" },
      ],
      keywords: ["meanwhile", "France at 64 total despite 16 gold", "Australia at 53 total with 18 gold", "by contrast", "Japan at 45 total with 20 gold", "whereas", "fewest overall"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "map-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of diagram is this?" },
        { id: "q2", question: "What does the map show?" },
        { id: "q3", question: "What two time periods are compared?" },
        { id: "q4", question: "What kind of changes are being described?" },
      ],
      keywords: ["maps", "town centre layout", "1990 and 2020", "development", "changes", "facilities"],
      tips: ["用同义词改写（如 shows → compare）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "What is the central feature of the town centre?" },
        { id: "q2", question: "How many main roads extend from the Park?" },
        { id: "q3", question: "What connects the Shops to the Station?" },
        { id: "q4", question: "How is the Shopping Mall connected to the Shops?" },
      ],
      keywords: ["overall", "central hub", "main roads", "bridge", "Shopping Mall", "High Street"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "Where is the Park located in the town centre?" },
        { id: "q2", question: "Which facilities are connected by the Main Road?" },
        { id: "q3", question: "Where are the Library and Hotel situated?" },
        { id: "q4", question: "What role does the Park play in the layout?" },
      ],
      keywords: ["Park at the centre", "Main Road extends", "Library and Hotel", "central connecting point", "from the Park", "situated along"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "Where are the Shops and Station located?" },
        { id: "q2", question: "What connects the Shops to the Station?" },
        { id: "q3", question: "Where is the Shopping Mall situated?" },
        { id: "q4", question: "How is the Shopping Mall connected to the rest of the centre?" },
      ],
      keywords: ["meanwhile", "Shops and Station in the south", "connected by a bridge", "whereas", "Shopping Mall further south", "linked via High Street", "by contrast"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "map-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of diagram is this?" },
        { id: "q2", question: "What does the map illustrate?" },
        { id: "q3", question: "What is being compared?" },
        { id: "q4", question: "What year is the proposed plan for?" },
      ],
      keywords: ["maps", "university campus", "current layout", "proposed expansion", "2030", "facilities"],
      tips: ["用同义词改写（如 shows → compares）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "Where is the Main Building located?" },
        { id: "q2", question: "What is the major planned addition?" },
        { id: "q3", question: "Which facilities connect to the new addition?" },
        { id: "q4", question: "How many paths extend from the Main Building?" },
      ],
      keywords: ["overall", "Main Building at top centre", "planned New Cafeteria", "connects two existing facilities", "two paths", "expansion"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "Where exactly is the Main Building positioned?" },
        { id: "q2", question: "Which facilities does Path A and Path B connect to?" },
        { id: "q3", question: "Where are the Library and Science Lab located?" },
        { id: "q4", question: "What connects the Library to the Sports Centre?" },
      ],
      keywords: ["Main Building at top centre", "Path A to Library", "Path B to Science Lab", "Library on the left", "Science Lab on the right", "path connects"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "Where are the Sports Centre and Student Dorms?" },
        { id: "q2", question: "Where is the planned New Cafeteria?" },
        { id: "q3", question: "Which two facilities connect to the New Cafeteria?" },
        { id: "q4", question: "How does the New Cafeteria fit into the overall layout?" },
      ],
      keywords: ["meanwhile", "Sports Centre on the left", "Student Dorms on the right", "whereas", "New Cafeteria at bottom centre", "connects both", "by contrast"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "map-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of diagram is this?" },
        { id: "q2", question: "What does the map show?" },
        { id: "q3", question: "What kind of renovation is being described?" },
        { id: "q4", question: "What part of the airport is shown?" },
      ],
      keywords: ["maps", "airport terminal", "ground floor layout", "before and after", "renovation", "passenger flow"],
      tips: ["用同义词改写（如 shows → compares）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "What kind of flow does the terminal follow?" },
        { id: "q2", question: "What happens after the security checkpoint?" },
        { id: "q3", question: "Which area leads to the Food Court?" },
        { id: "q4", question: "What is accessible from the Gates area?" },
      ],
      keywords: ["overall", "linear flow", "divides into branches", "check-in through security", "two routes", "accessible from"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "Where do passengers enter first?" },
        { id: "q2", question: "What comes after check-in?" },
        { id: "q3", question: "How many branches emerge from security?" },
        { id: "q4", question: "What are the two routes from security?" },
      ],
      keywords: ["check-in at the entrance", "pass through security", "two branches", "one to Duty Free", "other to Gates 1-10", "forks after security"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "Where does the Duty Free route lead?" },
        { id: "q2", question: "What is accessible from the Gates 1-10 area?" },
        { id: "q3", question: "Where are Gates 11-20 located?" },
        { id: "q4", question: "How does the upper route differ from the lower route?" },
      ],
      keywords: ["meanwhile", "Duty Free leads to Food Court", "by contrast", "Gates 1-10 connects to Lounge", "whereas", "Gates 11-20 further down", "separate routes"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "flow-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of diagram is this?" },
        { id: "q2", question: "What process does the flowchart illustrate?" },
        { id: "q3", question: "How many stages are there?" },
        { id: "q4", question: "What is the starting and ending point?" },
      ],
      keywords: ["flowchart", "paper recycling process", "stages", "waste paper", "new paper", "sequential"],
      tips: ["用同义词改写（如 shows → illustrates）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "How many stages does the process consist of?" },
        { id: "q2", question: "What is the nature of the stages?" },
        { id: "q3", question: "What happens between collection and new paper?" },
        { id: "q4", question: "Is the process linear or does it have parallel stages?" },
      ],
      keywords: ["overall", "seven sequential stages", "linear process", "begins with collection", "ends with new paper", "progressive"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What is the first stage of the process?" },
        { id: "q2", question: "What happens after collection?" },
        { id: "q3", question: "What follows sorting?" },
        { id: "q4", question: "Where does the material go after cleaning?" },
      ],
      keywords: ["begins with collection", "then sorted", "followed by cleaning", "enters the pulping stage", "first half", "four initial stages"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What follows pulping?" },
        { id: "q2", question: "What comes after de-inking?" },
        { id: "q3", question: "What is the final stage?" },
        { id: "q4", question: "What happens to the material after drying?" },
      ],
      keywords: ["after pulping", "then de-inked", "subsequently dried", "finally", "produces new paper", "completing the cycle"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "flow-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of diagram is this?" },
        { id: "q2", question: "What process does the flowchart show?" },
        { id: "q3", question: "Who is the process for?" },
        { id: "q4", question: "What is the final outcome of the process?" },
      ],
      keywords: ["flowchart", "university admission process", "international students", "steps", "application", "enrolment"],
      tips: ["用同义词改写（如 shows → outlines）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "How is the process structured overall?" },
        { id: "q2", question: "Which two stages run in parallel?" },
        { id: "q3", question: "What is the sequence from the parallel stages onward?" },
        { id: "q4", question: "What is the final stage?" },
      ],
      keywords: ["overall", "mostly linear", "parallel section", "Language Test and Interview", "conditional offer before visa", "ends with enrolment"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What is the first step in the process?" },
        { id: "q2", question: "What happens after submitting the application?" },
        { id: "q3", question: "What two stages run simultaneously after document review?" },
        { id: "q4", question: "What follows both the Language Test and Interview?" },
      ],
      keywords: ["first submit application", "then document review", "Language Test and Interview in parallel", "both lead to", "conditional offer", "simultaneous stages"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What comes after receiving the conditional offer?" },
        { id: "q2", question: "What is the visa process followed by?" },
        { id: "q3", question: "How does the second half differ from the first?" },
        { id: "q4", question: "What marks the end of the entire process?" },
      ],
      keywords: ["after conditional offer", "then visa process", "finally enrolment", "whereas the first half", "the second half is linear", "completing the admission"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },

  "flow-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        { id: "q1", question: "What type of diagram is this?" },
        { id: "q2", question: "What process does the diagram illustrate?" },
        { id: "q3", question: "What are the raw materials?" },
        { id: "q4", question: "How is the process structured?" },
      ],
      keywords: ["diagram", "cement-making process", "stages and equipment", "limestone and clay", "cement bags", "production"],
      tips: ["用同义词改写（如 shows → illustrates）", "不要抄原题", "必须包含图表类型、对象、时间/地点"],
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        { id: "q1", question: "How many stages does the process consist of?" },
        { id: "q2", question: "What is the nature of the process?" },
        { id: "q3", question: "What equipment is used in the middle of the process?" },
        { id: "q4", question: "How is the final product packaged?" },
      ],
      keywords: ["overall", "six linear stages", "sequential", "begins with raw materials", "ends with cement bags", "mechanical and thermal"],
      tips: ["禁止写具体数字", "只写1-2句话", "概括全局特征，不展开细节"],
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important/significant data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        { id: "q1", question: "What are the two raw materials?" },
        { id: "q2", question: "Which machine crushes the materials?" },
        { id: "q3", question: "What happens after crushing?" },
        { id: "q4", question: "Which equipment comes after the mixer?" },
      ],
      keywords: ["limestone and clay", "fed into crusher", "then mixed", "passes to rotating heater", "crushed and mixed", "heated"],
      tips: ["包含起点→终点数值", "描述中间变化（peak/dip/fluctuation）", "使用准确数据"],
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        { id: "q1", question: "What happens after the rotating heater?" },
        { id: "q2", question: "What machine is used for grinding?" },
        { id: "q3", question: "What happens after grinding?" },
        { id: "q4", question: "How is the final product packaged?" },
      ],
      keywords: ["after heating", "then ground in grinder", "finally packed into", "cement bags", "whereas earlier stages focus on preparation", "the later stages refine"],
      tips: ["使用对比结构（whereas/by contrast/meanwhile）", "覆盖剩余类别", "建立逻辑关系"],
    },
  },
};
