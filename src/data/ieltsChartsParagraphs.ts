export interface ParagraphQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
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
        {
          id: "l1_p1_q1",
          question: "What is the main topic of this chart?",
          options: [
            "A UK energy consumption from different sources",
            "B Global carbon emissions by country",
            "C Electricity prices in Europe",
            "D Oil production in the Middle East"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p1_q2",
          question: "What does the chart illustrate?",
          options: [
            "A Energy consumption from different sources in the United Kingdom",
            "B Electricity production in European countries",
            "C Oil imports to the UK over two decades",
            "D Carbon emissions by fuel type worldwide"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p1_q3",
          question: "What are the units and time period covered by the chart?",
          options: [
            "A Million tonnes oil equivalent, from 2000 to 2020",
            "B Billion kilowatt-hours, from 1990 to 2010",
            "C Percentage of total energy, from 2005 to 2025",
            "D Thousand barrels per day, from 2000 to 2015"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["line graph", "energy consumption", "United Kingdom", "million tonnes oil equivalent", "sources", "2000 to 2020"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "l1_p2_q1",
          question: "What was the overall trend for coal consumption in the UK between 2000 and 2020?",
          options: [
            "A It declined significantly over the period",
            "B It increased steadily throughout",
            "C It remained unchanged",
            "D It fluctuated wildly with no clear pattern"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p2_q2",
          question: "Which energy source showed the most dramatic change over the two decades?",
          options: [
            "A Renewables, which grew substantially",
            "B Natural Gas, which remained stable",
            "C Coal, which stayed dominant throughout",
            "D Nuclear, which experienced a slight dip"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p2_q3",
          question: "How did Natural Gas consumption change over the period?",
          options: [
            "A It rose initially and then levelled off",
            "B It fell continuously from start to finish",
            "C It overtook Coal in the final year",
            "D Both A and C"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "while", "sharp decline", "dramatic rise", "dominant", "overtook"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "l1_p3_q1",
          question: "What was the starting value of Coal consumption in 2000?",
          options: [
            "A 85 million tonnes",
            "B 72 million tonnes",
            "C 60 million tonnes",
            "D 58 million tonnes"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p3_q2",
          question: "By how much did Coal consumption decrease between 2000 and 2020?",
          options: [
            "A From 85 to 28 million tonnes",
            "B From 72 to 40 million tonnes",
            "C From 60 to 42 million tonnes",
            "D From 58 to 28 million tonnes"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p3_q3",
          question: "In which year did Renewables overtake Coal as an energy source?",
          options: [
            "A Between 2015 and 2020",
            "B Between 2005 and 2010",
            "C Between 2000 and 2005",
            "D Renewables never overtook Coal"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p3_q4",
          question: "What was the peak value reached by Renewables in 2020?",
          options: [
            "A 42 million tonnes",
            "B 35 million tonnes",
            "C 28 million tonnes",
            "D 78 million tonnes"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["fell dramatically", "rose steadily", "peaked at", "starting value", "ending value", "declining trend"],
      tips: ["Include starting and ending figures", "Describe changes over time", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "l1_p4_q1",
          question: "What was the trend for Natural Gas consumption between 2000 and 2010?",
          options: [
            "A It rose from 60 to 75 million tonnes",
            "B It fell from 80 to 60 million tonnes",
            "C It stayed constant at about 70 million tonnes",
            "D It rose from 5 to 42 million tonnes"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p4_q2",
          question: "What happened to Natural Gas after 2010?",
          options: [
            "A It remained relatively stable at around 78-80 million tonnes",
            "B It continued to rise sharply",
            "C It dropped below Coal for the first time",
            "D It declined to its lowest level"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p4_q3",
          question: "By 2020, which source had become the largest in UK energy consumption?",
          options: [
            "A Natural Gas at 78 million tonnes",
            "B Coal at 28 million tonnes",
            "C Renewables at 42 million tonnes",
            "D Oil at 50 million tonnes"
          ],
          correctAnswer: "A"
        },
        {
          id: "l1_p4_q4",
          question: "How does the trajectory of Natural Gas compare with that of Coal?",
          options: [
            "A Natural Gas rose while Coal fell, and Gas overtook Coal around 2010",
            "B Both rose together, but Coal rose faster",
            "C Both declined over the entire period",
            "D Natural Gas fell while Coal rose steadily"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "levelled off", "respectively", "in comparison"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "line-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "l2_p1_q1",
          question: "What is the geographic scope of this chart?",
          options: [
            "A Three cities — London, Tokyo and Sydney",
            "B Six countries in Europe",
            "C All capital cities worldwide",
            "D Cities in South America"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p1_q2",
          question: "Which three cities are compared in the chart?",
          options: [
            "A London, Tokyo, and Sydney",
            "B New York, Paris, and Beijing",
            "C Mumbai, Cairo, and Toronto",
            "D Singapore, Moscow, and Dubai"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p1_q3",
          question: "What does the y-axis measure?",
          options: [
            "A Temperature in degrees Celsius",
            "B Rainfall in millimetres",
            "C Humidity as a percentage",
            "D Wind speed in kilometres per hour"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["line graph", "average monthly temperatures", "Celsius", "London", "Tokyo", "Sydney"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "l2_p2_q1",
          question: "What overall pattern do London and Tokyo share?",
          options: [
            "A Both are warmest in mid-year and coolest at the beginning and end",
            "B Both have their highest temperatures in December",
            "C Both remain at a constant temperature throughout the year",
            "D Both are coldest in July"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p2_q2",
          question: "How does Sydney's temperature pattern differ from the other two cities?",
          options: [
            "A Sydney is warmest at the start of the year and coolest in the middle",
            "B Sydney follows exactly the same pattern as London",
            "C Sydney has no seasonal variation at all",
            "D Sydney is consistently colder than the other two cities"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p2_q3",
          question: "Which city records the highest temperature across all months?",
          options: [
            "A Tokyo at 26°C in July",
            "B London at 19°C in July",
            "C Sydney at 23°C in January",
            "D Tokyo at 24°C in September"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "seasonal pattern", "opposite trend", "peaks", "lowest", "Northern Hemisphere"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "l2_p3_q1",
          question: "What was London's temperature in January?",
          options: [
            "A 5°C",
            "B 6°C",
            "C 8°C",
            "D 9°C"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p3_q2",
          question: "At what value did Tokyo's temperature peak in July?",
          options: [
            "A 26°C",
            "B 24°C",
            "C 19°C",
            "D 22°C"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p3_q3",
          question: "By November, what was the temperature in London?",
          options: [
            "A 9°C",
            "B 14°C",
            "C 17°C",
            "D 5°C"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p3_q4",
          question: "How did Tokyo's temperature change between March and July?",
          options: [
            "A It rose from 10°C to 26°C",
            "B It fell from 19°C to 10°C",
            "C It rose from 6°C to 14°C",
            "D It stayed constant at around 20°C"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["rose to a peak", "gradual increase", "steady decline", "reached its highest", "starting at", "fell to"],
      tips: ["Include starting and ending figures", "Describe changes over time", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "l2_p4_q1",
          question: "What was Sydney's temperature in January?",
          options: [
            "A 23°C",
            "B 22°C",
            "C 20°C",
            "D 16°C"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p4_q2",
          question: "In which month did Sydney reach its lowest temperature, and what was it?",
          options: [
            "A July at 13°C",
            "B September at 16°C",
            "C January at 23°C",
            "D November at 20°C"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p4_q3",
          question: "How does Sydney's July temperature compare with London's July temperature?",
          options: [
            "A Sydney is at 13°C whereas London is at 19°C",
            "B Both are roughly the same at 16-17°C",
            "C Sydney is much warmer at 23°C",
            "D London is colder at 9°C"
          ],
          correctAnswer: "A"
        },
        {
          id: "l2_p4_q4",
          question: "By November, how did the three cities rank from warmest to coolest?",
          options: [
            "A Sydney (20°C), Tokyo (14°C), London (9°C)",
            "B Tokyo (20°C), Sydney (14°C), London (9°C)",
            "C All three cities were approximately the same temperature",
            "D London was the warmest city in November"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "opposite pattern", "Southern Hemisphere", "meanwhile", "in comparison"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "line-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "l3_p1_q1",
          question: "What demographic groups are compared in this chart?",
          options: [
            "A Four age groups: 16-24, 25-44, 45-64, and 65+",
            "B Five income brackets",
            "C Three education levels",
            "D Different occupational sectors"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p1_q2",
          question: "What is measured on the y-axis of this chart?",
          options: [
            "A Percentage of internet users",
            "B Number of internet users in millions",
            "C Hours spent online per week",
            "D Internet speed in Mbps"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p1_q3",
          question: "Which age groups are included in this chart?",
          options: [
            "A 16-24, 25-44, 45-64, and 65+",
            "B 0-15, 16-30, 31-50, and 51+",
            "C 18-25, 26-40, 41-60, and 61+",
            "D 10-20, 21-35, 36-55, and 56+"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["line graph", "internet usage", "age groups", "percentage", "2010 to 2022", "users"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "l3_p2_q1",
          question: "What is the overall trend across all age groups?",
          options: [
            "A Internet usage increased in every age group over the period",
            "B Internet usage declined in all groups",
            "C Usage rose only for younger groups and fell for older ones",
            "D Usage remained unchanged for all groups"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p2_q2",
          question: "Which age group had the highest internet usage throughout the entire period?",
          options: [
            "A 16-24 year-olds",
            "B 25-44 year-olds",
            "C 45-64 year-olds",
            "D 65+ year-olds"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p2_q3",
          question: "Which age group showed the most dramatic increase over the 12-year period?",
          options: [
            "A 65+ year-olds, rising by 44 percentage points",
            "B 16-24 year-olds, rising by 7 percentage points",
            "C 25-44 year-olds, rising by 13 percentage points",
            "D 45-64 year-olds, rising by 39 percentage points"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "upward trend", "gap narrowed", "highest usage", "lowest usage", "most dramatic growth"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "l3_p3_q1",
          question: "What was the internet usage percentage for 16-24 year-olds in 2010?",
          options: [
            "A 92%",
            "B 85%",
            "C 98%",
            "D 99%"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p3_q2",
          question: "By 2022, what percentage did the 16-24 age group reach?",
          options: [
            "A 99%",
            "B 98%",
            "C 91%",
            "D 62%"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p3_q3",
          question: "How did the 25-44 age group's usage change between 2010 and 2022?",
          options: [
            "A It rose from 85% to 98%",
            "B It rose from 52% to 91%",
            "C It rose from 92% to 99%",
            "D It fell from 98% to 85%"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p3_q4",
          question: "At what point did the 25-44 group's usage reach 97%?",
          options: [
            "A In 2018",
            "B In 2014",
            "C In 2022",
            "D In 2010"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["starting at", "reaching nearly", "rose steadily", "saturation point", "from...to...", "climbed to"],
      tips: ["Include starting and ending figures", "Describe changes over time", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "l3_p4_q1",
          question: "What was the internet usage for 45-64 year-olds in 2010?",
          options: [
            "A 52%",
            "B 68%",
            "C 82%",
            "D 45%"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p4_q2",
          question: "By how much did the 65+ age group's usage increase from 2010 to 2022?",
          options: [
            "A From 18% to 62%",
            "B From 28% to 45%",
            "C From 52% to 91%",
            "D From 85% to 98%"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p4_q3",
          question: "In 2022, what was the usage gap between the highest (16-24) and lowest (65+) age groups?",
          options: [
            "A 37 percentage points (99% vs 62%)",
            "B 7 percentage points (99% vs 92%)",
            "C 54 percentage points (92% vs 38%)",
            "D 15 percentage points"
          ],
          correctAnswer: "A"
        },
        {
          id: "l3_p4_q4",
          question: "By 2022, which statement correctly compares the 45-64 and 65+ age groups?",
          options: [
            "A The 45-64 group reached 91% whereas the 65+ group reached 62%",
            "B Both groups reached the same level of usage",
            "C The 65+ group surpassed the 45-64 group",
            "D The 45-64 group was at 62% whereas the 65+ group was at 91%"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "narrowed significantly", "remained the lowest", "meanwhile", "despite the increase"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "bar-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "b1_p1_q1",
          question: "Which countries are compared in this chart, and in what units?",
          options: [
            "A Six countries, measured in terawatt-hours (TWh)",
            "B Five countries, measured in megawatts (MW)",
            "C Eight countries, measured in gigawatts (GW)",
            "D Four countries, measured in kilowatt-hours (kWh)"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p1_q2",
          question: "What do the bars in this chart represent?",
          options: [
            "A Renewable energy production in terawatt-hours",
            "B Carbon emissions in metric tonnes",
            "C Total electricity consumption in gigawatts",
            "D Population size of each country"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p1_q3",
          question: "Which year does the data cover?",
          options: [
            "A 2022",
            "B 2020",
            "C 2023",
            "D 2019"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["bar chart", "renewable energy production", "terawatt-hours", "TWh", "top six countries", "2022"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "b1_p2_q1",
          question: "Which country dominates renewable energy production by a wide margin?",
          options: [
            "A China",
            "B USA",
            "C Brazil",
            "D Germany"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p2_q2",
          question: "What is notable about the distribution of renewable energy production among these six countries?",
          options: [
            "A China produces more than double the output of the second-placed country",
            "B All six countries produce roughly the same amount",
            "C The USA produces the most renewable energy",
            "D Japan outproduces all European countries shown"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p2_q3",
          question: "How do the Asian countries (China, India, Japan) compare collectively?",
          options: [
            "A China and India together produce over 3300 TWh, but Japan produces the least overall",
            "B All three Asian countries produce similar amounts",
            "C Japan is the leading Asian producer",
            "D India produces more than the USA"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "dominant", "by a wide margin", "significantly more", "far ahead", "leading producer"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "b1_p3_q1",
          question: "How much renewable energy did China produce in 2022?",
          options: [
            "A 2850 TWh",
            "B 1200 TWh",
            "C 680 TWh",
            "D 520 TWh"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p3_q2",
          question: "How does China's production compare with the USA's production?",
          options: [
            "A China produces more than double the USA's 1200 TWh",
            "B China produces slightly less than the USA",
            "C Both countries produce exactly the same amount",
            "D The USA produces more than China"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p3_q3",
          question: "What is the combined production of China and the USA?",
          options: [
            "A 4050 TWh",
            "B 3530 TWh",
            "C 2170 TWh",
            "D 1200 TWh"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["produced", "accounting for", "more than double", "highest figure", "followed by", "in comparison"],
      tips: ["Include starting and ending figures", "Describe changes over time", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "b1_p4_q1",
          question: "How much renewable energy did Brazil produce compared with India?",
          options: [
            "A Brazil produced 680 TWh whereas India produced 520 TWh",
            "B Both produced exactly 520 TWh",
            "C India produced 680 TWh whereas Brazil produced 520 TWh",
            "D Brazil produced 1200 TWh whereas India produced 680 TWh"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p4_q2",
          question: "What was Germany's renewable energy production figure?",
          options: [
            "A 350 TWh",
            "B 280 TWh",
            "C 520 TWh",
            "D 680 TWh"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p4_q3",
          question: "Which country had the lowest production, and by how much?",
          options: [
            "A Japan at 280 TWh",
            "B Germany at 350 TWh",
            "C India at 520 TWh",
            "D Brazil at 680 TWh"
          ],
          correctAnswer: "A"
        },
        {
          id: "b1_p4_q4",
          question: "How do Germany and Japan compare in terms of renewable energy output?",
          options: [
            "A Germany produced 350 TWh whereas Japan produced 280 TWh",
            "B Japan produced 350 TWh whereas Germany produced 280 TWh",
            "C Both produced the same amount at 350 TWh",
            "D Germany produced 280 TWh whereas Japan produced 350 TWh"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "respectively", "the remaining countries", "meanwhile", "the lowest figure"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "bar-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "b2_p1_q1",
          question: "What aspect of university life is being measured in this chart?",
          options: [
            "A The number of students enrolled in each faculty",
            "B The number of graduates per year",
            "C University tuition fees by department",
            "D Staff-to-student ratios across faculties"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p1_q2",
          question: "What does the chart display?",
          options: [
            "A Student enrolment numbers across different university faculties",
            "B University graduation rates by faculty",
            "C Staff employment figures at a major university",
            "D Research funding allocated to each faculty"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p1_q3",
          question: "How many faculties are shown and for which year?",
          options: [
            "A Six faculties in 2023",
            "B Five faculties in 2022",
            "C Seven faculties in 2023",
            "D Six faculties in 2021"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["bar chart", "university enrolment", "faculties", "number of students", "2023", "major university"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "b2_p2_q1",
          question: "Which faculty had the highest enrolment?",
          options: [
            "A Engineering",
            "B Business",
            "C Science",
            "D Arts"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p2_q2",
          question: "What general observation can be made about enrolment across the faculties?",
          options: [
            "A STEM-related faculties (Engineering and Science) attracted more students than Law and Medicine",
            "B All faculties had roughly equal numbers of students",
            "C Arts had the highest enrolment overall",
            "D Medicine was the most popular faculty"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p2_q3",
          question: "How large is the gap between the most and least popular faculties?",
          options: [
            "A Engineering (4200) had nearly three times as many students as Law (1500)",
            "B The gap is less than 500 students",
            "C All faculties are within a range of 500 students",
            "D Medicine had the most and Engineering had the least"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "highest enrolment", "least popular", "wide disparity", "attracted more", "considerable gap"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "b2_p3_q1",
          question: "How many students were enrolled in Engineering?",
          options: [
            "A 4200",
            "B 3800",
            "C 2900",
            "D 2100"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p3_q2",
          question: "What was the enrolment figure for Business?",
          options: [
            "A 3800",
            "B 4200",
            "C 2900",
            "D 1800"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p3_q3",
          question: "What is the combined enrolment of Engineering and Business?",
          options: [
            "A 8000",
            "B 7100",
            "C 5000",
            "D 6300"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["enrolment", "accounted for", "the highest figure", "closely followed by", "students", "combined total"],
      tips: ["Include starting and ending figures", "Describe changes over time", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "b2_p4_q1",
          question: "How many students were enrolled in Science?",
          options: [
            "A 2900",
            "B 2100",
            "C 1800",
            "D 1500"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p4_q2",
          question: "How do Arts and Medicine compare in terms of enrolment?",
          options: [
            "A Arts had 2100 students whereas Medicine had 1800",
            "B Medicine had 2100 students whereas Arts had 1800",
            "C Both had exactly 2100 students",
            "D Arts had 1500 students whereas Medicine had 2900"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p4_q3",
          question: "Which faculty had the lowest enrolment and what was the figure?",
          options: [
            "A Law at 1500",
            "B Medicine at 1800",
            "C Arts at 2100",
            "D Science at 2900"
          ],
          correctAnswer: "A"
        },
        {
          id: "b2_p4_q4",
          question: "How do the enrolments of Science, Arts, Medicine, and Law rank from highest to lowest?",
          options: [
            "A Science (2900), Arts (2100), Medicine (1800), Law (1500)",
            "B Arts (2100), Science (2900), Law (1500), Medicine (1800)",
            "C Medicine (1800), Law (1500), Arts (2100), Science (2900)",
            "D Law (1500), Medicine (1800), Arts (2100), Science (2900)"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "respectively", "in comparison", "the smallest", "ranked behind"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "bar-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "b3_p1_q1",
          question: "What meteorological data is being compared across cities?",
          options: [
            "A Average monthly rainfall in millimetres",
            "B Average annual temperature in degrees",
            "C Wind speed in kilometres per hour",
            "D Humidity levels as a percentage"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p1_q2",
          question: "Which six cities are compared in terms of rainfall?",
          options: [
            "A Mumbai, London, Singapore, Sydney, Cairo, and Toronto",
            "B Beijing, Paris, New York, Dubai, Moscow, and Tokyo",
            "C Delhi, Manchester, Bangkok, Melbourne, Nairobi, and Vancouver",
            "D Shanghai, Berlin, Los Angeles, Abu Dhabi, St Petersburg, and Seoul"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p1_q3",
          question: "What are the units of measurement used?",
          options: [
            "A Millimetres of rainfall",
            "B Inches of rainfall",
            "C Number of rainy days",
            "D Percentage of annual precipitation"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["bar chart", "average monthly rainfall", "millimetres", "six major cities", "compares", "across"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "b3_p2_q1",
          question: "Which city receives the highest rainfall?",
          options: [
            "A Singapore at 240 mm",
            "B Mumbai at 220 mm",
            "C London at 65 mm",
            "D Sydney at 85 mm"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p2_q2",
          question: "What is notable about the range of rainfall across the six cities?",
          options: [
            "A There is a huge disparity, from as low as 5 mm to as high as 240 mm",
            "B All cities receive roughly the same amount of rainfall",
            "C The wettest and driest cities differ by only 20 mm",
            "D European cities receive more rain than Asian cities"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p2_q3",
          question: "Which city receives by far the least rainfall?",
          options: [
            "A Cairo at just 5 mm",
            "B Toronto at 75 mm",
            "C London at 65 mm",
            "D Sydney at 85 mm"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "wide variation", "tropical", "arid", "extremely low", "considerably higher"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "b3_p3_q1",
          question: "What is the monthly rainfall figure for Singapore?",
          options: [
            "A 240 mm",
            "B 220 mm",
            "C 85 mm",
            "D 75 mm"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p3_q2",
          question: "How does Mumbai's rainfall compare with Singapore's?",
          options: [
            "A Mumbai receives 220 mm, which is 20 mm less than Singapore's 240 mm",
            "B Mumbai receives 240 mm, which is 20 mm more than Singapore's 220 mm",
            "C Both cities receive exactly 230 mm",
            "D Mumbai receives 85 mm, far less than Singapore"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p3_q3",
          question: "What is the combined rainfall of Singapore and Mumbai?",
          options: [
            "A 460 mm",
            "B 325 mm",
            "C 305 mm",
            "D 160 mm"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["the highest", "closely followed by", "tropical climate", "monsoon", "accounting for", "combined"],
      tips: ["Include starting and ending figures", "Describe changes over time", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "b3_p4_q1",
          question: "How much rainfall does Sydney receive compared with London?",
          options: [
            "A Sydney receives 85 mm whereas London receives 65 mm",
            "B London receives 85 mm whereas Sydney receives 65 mm",
            "C Both receive exactly 75 mm",
            "D Sydney receives 220 mm whereas London receives 65 mm"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p4_q2",
          question: "What is Toronto's rainfall figure?",
          options: [
            "A 75 mm",
            "B 85 mm",
            "C 65 mm",
            "D 5 mm"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p4_q3",
          question: "How does Cairo's rainfall compare with the other five cities?",
          options: [
            "A Cairo receives only 5 mm, which is dramatically lower than every other city",
            "B Cairo receives 75 mm, similar to Toronto",
            "C Cairo receives 65 mm, comparable to London",
            "D Cairo receives 240 mm, the highest of all cities"
          ],
          correctAnswer: "A"
        },
        {
          id: "b3_p4_q4",
          question: "How do the four non-tropical cities rank from highest to lowest rainfall?",
          options: [
            "A Sydney (85), Toronto (75), London (65), Cairo (5)",
            "B London (65), Sydney (85), Toronto (75), Cairo (5)",
            "C Toronto (75), London (65), Sydney (85), Cairo (5)",
            "D Cairo (5), London (65), Toronto (75), Sydney (85)"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "respectively", "the lowest", "significantly less"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "pie-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "pi1_p1_q1",
          question: "What does this chart break down into its component parts?",
          options: [
            "A Global energy consumption by source",
            "B Electricity generation by country",
            "C Oil reserves by region",
            "D Carbon emissions by industry"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p1_q2",
          question: "What does the pie chart illustrate?",
          options: [
            "A The proportion of global energy consumption contributed by different sources",
            "B The total amount of energy produced worldwide in 2021",
            "C The carbon emissions from each energy source",
            "D The number of countries using each energy type"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p1_q3",
          question: "What are the units and the year covered by this chart?",
          options: [
            "A Percentage share of global energy consumption in 2021",
            "B Terawatt-hours of energy generation in 2020",
            "C Million tonnes of oil equivalent in 2022",
            "D Billion kilowatt-hours of electricity in 2021"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["pie chart", "global energy consumption", "sources", "percentage", "2021", "proportion"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "pi1_p2_q1",
          question: "What overall pattern is evident in the global energy mix?",
          options: [
            "A Fossil fuels (Oil, Coal, and Natural Gas) collectively dominate, accounting for the vast majority",
            "B Renewable sources make up the largest share of global energy",
            "C Nuclear energy is the single largest source",
            "D All energy sources contribute roughly equal proportions"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p2_q2",
          question: "Which category represents the smallest share of global energy consumption?",
          options: [
            "A Nuclear at just 4%",
            "B Hydro at 7%",
            "C Other Renewables at 7%",
            "D Coal at 27%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p2_q3",
          question: "How do renewable sources (Hydro and Other Renewables) compare with fossil fuels overall?",
          options: [
            "A Renewables combined (14%) are far smaller than any single fossil fuel category",
            "B Renewables combined surpass Coal",
            "C Renewables combined are roughly equal to Oil",
            "D Renewables combined make up over half of all energy"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "dominated", "fossil fuels", "the largest share", "the smallest proportion", "collectively"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "pi1_p3_q1",
          question: "What percentage of global energy did Oil account for in 2021?",
          options: [
            "A 31%",
            "B 27%",
            "C 24%",
            "D 35%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p3_q2",
          question: "What was the combined share of Oil and Coal?",
          options: [
            "A 58%",
            "B 51%",
            "C 55%",
            "D 62%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p3_q3",
          question: "How does Natural Gas compare with Coal in the energy mix?",
          options: [
            "A Natural Gas at 24% is only 3 percentage points below Coal at 27%",
            "B Natural Gas at 27% is equal to Coal at 24%",
            "C Natural Gas at 31% surpasses Coal at 27%",
            "D Natural Gas at 7% is far below Coal at 27%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p3_q4",
          question: "What was the total share of the three fossil fuels combined?",
          options: [
            "A 82% (Oil 31%, Coal 27%, Natural Gas 24%)",
            "B 75% (Oil 31%, Coal 27%, Natural Gas 17%)",
            "C 62% (Oil 24%, Coal 27%, Natural Gas 11%)",
            "D 58% (Oil 27%, Coal 24%, Natural Gas 7%)"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["accounted for", "the largest proportion", "followed by", "constituted", "combined share", "dominant"],
      tips: ["Include specific percentages", "Describe the relative sizes of segments", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "pi1_p4_q1",
          question: "What percentage did Nuclear energy contribute?",
          options: [
            "A 4%",
            "B 7%",
            "C 10%",
            "D 1%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p4_q2",
          question: "How do Hydro and Other Renewables compare?",
          options: [
            "A Both Hydro and Other Renewables each contributed 7%",
            "B Hydro contributed 14% whereas Other Renewables contributed 7%",
            "C Hydro contributed 4% whereas Other Renewables contributed 7%",
            "D Hydro contributed 7% whereas Other Renewables contributed 4%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p4_q3",
          question: "By contrast with the 82% fossil fuel share, what was the total share of Nuclear, Hydro, and Other Renewables?",
          options: [
            "A 18% (Nuclear 4%, Hydro 7%, Other Renewables 7%)",
            "B 14% (Nuclear 4%, Hydro 7%, Other Renewables 3%)",
            "C 22% (Nuclear 7%, Hydro 8%, Other Renewables 7%)",
            "D 11% (Nuclear 4%, Hydro 4%, Other Renewables 3%)"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi1_p4_q4",
          question: "How does Nuclear compare with each renewable category individually?",
          options: [
            "A Nuclear at 4% is smaller than both Hydro and Other Renewables, each at 7%",
            "B Nuclear at 7% is equal to Hydro and Other Renewables",
            "C Nuclear at 10% is larger than both Hydro and Other Renewables",
            "D Nuclear at 4% is larger than Hydro at 3%"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "the remaining", "collectively", "respectively"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "pie-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "pi2_p1_q1",
          question: "What aspect of household economics is being analysed?",
          options: [
            "A Monthly household expenditure by category",
            "B Average household income by region",
            "C Annual savings rates by age group",
            "D Property prices by city"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p1_q2",
          question: "What aspect of household finances does the chart illustrate?",
          options: [
            "A How household expenditure is distributed across different categories",
            "B Total household income by region",
            "C Changes in household savings over time",
            "D Average household debt levels"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p1_q3",
          question: "What year does the data represent?",
          options: [
            "A 2022",
            "B 2021",
            "C 2023",
            "D 2020"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["pie chart", "household expenditure", "breakdown", "categories", "percentage", "2022"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "pi2_p2_q1",
          question: "Which category accounts for the largest portion of household spending?",
          options: [
            "A Housing at 35%",
            "B Food at 22%",
            "C Transport at 15%",
            "D Entertainment at 10%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p2_q2",
          question: "What general pattern can be observed about essential vs non-essential spending?",
          options: [
            "A Essential spending (Housing, Food, Healthcare) together accounts for the majority of the budget",
            "B Non-essential spending dominates household budgets",
            "C All categories receive roughly equal shares",
            "D Transport is the largest single expense"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p2_q3",
          question: "Which category has the smallest share of household expenditure?",
          options: [
            "A Education at just 8%",
            "B Entertainment at 10%",
            "C Healthcare at 10%",
            "D Transport at 15%"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "the largest proportion", "the smallest share", "essentials", "discretionary", "dominates"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "pi2_p3_q1",
          question: "What percentage of household spending went to Housing?",
          options: [
            "A 35%",
            "B 22%",
            "C 15%",
            "D 10%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p3_q2",
          question: "What was the combined share of Housing and Food?",
          options: [
            "A 57%",
            "B 50%",
            "C 45%",
            "D 37%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p3_q3",
          question: "How does Transport at 15% compare with Food at 22%?",
          options: [
            "A Transport is 7 percentage points lower than Food",
            "B Transport and Food are equal at 15%",
            "C Transport is higher than Food by 7 percentage points",
            "D Transport at 22% equals Food at 22%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p3_q4",
          question: "Housing alone accounts for what proportion of total spending?",
          options: [
            "A Slightly more than one-third",
            "B Exactly one-quarter",
            "C Almost one-half",
            "D Less than one-fifth"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["accounted for", "the largest share", "combined", "followed by", "over one-third", "constituted"],
      tips: ["Include specific percentages", "Describe the relative sizes of segments", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "pi2_p4_q1",
          question: "What percentage did Healthcare receive?",
          options: [
            "A 10%",
            "B 8%",
            "C 15%",
            "D 22%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p4_q2",
          question: "How do Entertainment and Healthcare compare in terms of their shares?",
          options: [
            "A Both Entertainment and Healthcare each accounted for 10%",
            "B Entertainment accounted for 8% whereas Healthcare accounted for 10%",
            "C Entertainment accounted for 15% whereas Healthcare accounted for 10%",
            "D Entertainment accounted for 10% whereas Healthcare accounted for 8%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p4_q3",
          question: "What was the share of Education, and how does it rank among all categories?",
          options: [
            "A Education at 8% was the smallest category",
            "B Education at 10% was equal to Healthcare and Entertainment",
            "C Education at 15% was the third largest category",
            "D Education at 22% was the second largest category"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi2_p4_q4",
          question: "How do the three smallest categories (Entertainment, Healthcare, Education) compare with Housing alone?",
          options: [
            "A Their combined share of 28% is still 7 percentage points less than Housing at 35%",
            "B Their combined share of 35% equals Housing",
            "C Their combined share of 42% exceeds Housing",
            "D Their combined share of 20% is far less than Housing at 35%"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "respectively", "the smallest", "collectively"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "pie-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "pi3_p1_q1",
          question: "Which country's water consumption is being analysed, and in what year?",
          options: [
            "A Australia in 2020",
            "B Canada in 2019",
            "C New Zealand in 2021",
            "D The United States in 2018"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p1_q2",
          question: "What does the chart show?",
          options: [
            "A How water is used across different sectors in Australia",
            "B Total water consumption in Australian households",
            "C Rainfall distribution across Australian states",
            "D Water exports from Australia to other countries"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p1_q3",
          question: "What country and year does this data cover?",
          options: [
            "A Australia in 2020",
            "B New Zealand in 2021",
            "C Canada in 2020",
            "D Australia in 2019"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["pie chart", "water usage", "sectors", "Australia", "percentage", "2020"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "pi3_p2_q1",
          question: "Which sector dominates water usage in Australia?",
          options: [
            "A Agriculture at 62%",
            "B Household at 14%",
            "C Industry at 12%",
            "D Mining at 7%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p2_q2",
          question: "What is notable about the distribution of water usage across sectors?",
          options: [
            "A Agriculture uses far more water than all other sectors combined",
            "B All sectors use roughly equal amounts of water",
            "C Household usage exceeds industrial usage by a wide margin",
            "D Mining is the second largest consumer of water"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p2_q3",
          question: "Which sector accounts for the smallest portion of water usage?",
          options: [
            "A Other at just 5%",
            "B Mining at 7%",
            "C Industry at 12%",
            "D Household at 14%"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "dominated", "the vast majority", "relatively small", "by far the largest", "considerably smaller"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "pi3_p3_q1",
          question: "What percentage of water did Agriculture consume in Australia?",
          options: [
            "A 62%",
            "B 14%",
            "C 12%",
            "D 7%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p3_q2",
          question: "How does Agriculture's share compare with all other sectors combined?",
          options: [
            "A Agriculture at 62% is larger than the remaining 38% combined",
            "B Agriculture at 62% is roughly equal to the other 38% combined",
            "C Agriculture at 62% is smaller than the other sectors at 62%",
            "D Agriculture and the other sectors each account for exactly 50%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p3_q3",
          question: "How much more water does Agriculture use than the second largest sector, Household?",
          options: [
            "A 48 percentage points more (62% vs 14%)",
            "B 50 percentage points more (62% vs 12%)",
            "C 55 percentage points more (62% vs 7%)",
            "D 57 percentage points more (62% vs 5%)"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p3_q4",
          question: "What proportion of Australia's total water does Agriculture represent?",
          options: [
            "A Nearly two-thirds",
            "B Just over one-half",
            "C About one-quarter",
            "D Almost three-quarters"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["accounted for", "nearly two-thirds", "the dominant sector", "dwarfing all others", "by comparison", "substantial"],
      tips: ["Include specific percentages", "Describe the relative sizes of segments", "Use precise data"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "pi3_p4_q1",
          question: "What percentage of water did the Household sector use?",
          options: [
            "A 14%",
            "B 12%",
            "C 7%",
            "D 5%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p4_q2",
          question: "How do Industry and Household usage compare?",
          options: [
            "A Industry used 12% whereas Household used 14%",
            "B Industry used 14% whereas Household used 12%",
            "C Both used exactly 13%",
            "D Industry used 7% whereas Household used 14%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p4_q3",
          question: "What was the mining sector's share of water usage?",
          options: [
            "A 7%",
            "B 5%",
            "C 12%",
            "D 14%"
          ],
          correctAnswer: "A"
        },
        {
          id: "pi3_p4_q4",
          question: "How do Mining and the 'Other' category compare with Industry?",
          options: [
            "A Mining (7%) and Other (5%) together (12%) equal Industry alone (12%)",
            "B Mining (7%) alone exceeds Industry (12%)",
            "C Mining (7%) and Other (5%) together (12%) are far less than Industry (12%)",
            "D Industry (12%) is smaller than Mining (7%) and Other (5%) combined"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "respectively", "the smallest share", "collectively"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "table-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "t1_p1_q1",
          question: "What aspect of language is being measured in this table?",
          options: [
            "A The number of native and total speakers worldwide",
            "B The difficulty level of learning each language",
            "C The number of words in each language",
            "D The age of each language family"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p1_q2",
          question: "What information does the table provide?",
          options: [
            "A The number of native and total speakers for the world's most spoken languages, plus primary countries",
            "B The number of countries where each language is officially recognised",
            "C The percentage of global population speaking each language",
            "D The growth rate of speakers for each language over time"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p1_q3",
          question: "What year does this language data represent?",
          options: [
            "A 2023",
            "B 2022",
            "C 2024",
            "D 2021"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["table", "most spoken languages", "native speakers", "total speakers", "millions", "2023"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "t1_p2_q1",
          question: "Which language has the highest number of total speakers?",
          options: [
            "A English with 1,450 million total speakers",
            "B Mandarin with 1,130 million total speakers",
            "C Hindi with 610 million total speakers",
            "D Spanish with 560 million total speakers"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p2_q2",
          question: "Which language has the largest population of native speakers?",
          options: [
            "A Mandarin with 940 million native speakers",
            "B English with 380 million native speakers",
            "C Spanish with 485 million native speakers",
            "D Hindi with 345 million native speakers"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p2_q3",
          question: "What notable contrast exists between English and Mandarin?",
          options: [
            "A English leads in total speakers due to a vast non-native base, whereas Mandarin leads in native speakers",
            "B Both languages have identical native and total speaker numbers",
            "C Mandarin leads in both native and total speakers",
            "D English has more native speakers but fewer total speakers than Mandarin"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "the highest", "native speakers", "total speakers", "contrast", "non-native"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "t1_p3_q1",
          question: "How many native speakers does English have?",
          options: [
            "A 380 million",
            "B 940 million",
            "C 485 million",
            "D 345 million"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p3_q2",
          question: "What is the total number of English speakers?",
          options: [
            "A 1,450 million",
            "B 1,130 million",
            "C 610 million",
            "D 560 million"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p3_q3",
          question: "How many non-native speakers does English have?",
          options: [
            "A 1,070 million (1,450 total minus 380 native)",
            "B 190 million (1,130 total minus 940 native)",
            "C 265 million (610 total minus 345 native)",
            "D 75 million (560 total minus 485 native)"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p3_q4",
          question: "How does Mandarin's native speaker count compare with English's?",
          options: [
            "A Mandarin has 940 million native speakers, which is 560 million more than English's 380 million",
            "B Mandarin has 380 million native speakers, equal to English",
            "C Mandarin has 485 million native speakers, slightly more than English's 380 million",
            "D Mandarin has 345 million native speakers, less than English's 380 million"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["native speakers", "total speakers", "non-native", "the largest", "accounting for", "compared with"],
      tips: ["Include specific figures", "Describe the data in detail", "Use precise numbers"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "t1_p4_q1",
          question: "How many native speakers does Spanish have?",
          options: [
            "A 485 million",
            "B 380 million",
            "C 345 million",
            "D 80 million"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p4_q2",
          question: "How do Hindi and Spanish compare in terms of total speakers?",
          options: [
            "A Hindi has 610 million total speakers whereas Spanish has 560 million",
            "B Spanish has 610 million total speakers whereas Hindi has 560 million",
            "C Both have exactly 560 million total speakers",
            "D Hindi has 485 million total speakers whereas Spanish has 345 million"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p4_q3",
          question: "What are the figures for French?",
          options: [
            "A 80 million native speakers and 310 million total speakers",
            "B 345 million native speakers and 610 million total speakers",
            "C 315 million native speakers and 420 million total speakers",
            "D 485 million native speakers and 560 million total speakers"
          ],
          correctAnswer: "A"
        },
        {
          id: "t1_p4_q4",
          question: "How does Arabic compare with French in terms of both native and total speakers?",
          options: [
            "A Arabic has 315 million native and 420 million total, both higher than French's 80 million native and 310 million total",
            "B French has more native speakers than Arabic but fewer total speakers",
            "C Both Arabic and French have identical speaker counts",
            "D Arabic has fewer native speakers but more total speakers than French"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "respectively", "the lowest", "in comparison"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "table-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "t2_p1_q1",
          question: "What metrics does this table present about smartphone brands?",
          options: [
            "A Market share percentage, units shipped, and year-on-year growth",
            "B Customer satisfaction ratings and review counts",
            "C Revenue and profit margins by region",
            "D Employee headcount by brand"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p1_q2",
          question: "What does the table show about the smartphone industry?",
          options: [
            "A Global smartphone market share, units shipped, and year-on-year growth for top brands in Q4 2023",
            "B Annual smartphone revenue by brand for 2023",
            "C Number of smartphone stores per country",
            "D Customer satisfaction ratings for smartphone brands"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p1_q3",
          question: "How many brands are listed and for which period?",
          options: [
            "A Five brands in Q4 2023",
            "B Six brands in Q4 2022",
            "C Four brands in 2023",
            "D Five brands in Q1 2024"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["table", "smartphone market share", "brands", "Q4 2023", "units shipped", "YoY growth"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "t2_p2_q1",
          question: "Which brand had the largest market share in Q4 2023?",
          options: [
            "A Apple with 24%",
            "B Samsung with 18%",
            "C Xiaomi with 13%",
            "D Oppo with 9%"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p2_q2",
          question: "What overall trend is visible in the year-on-year growth figures?",
          options: [
            "A Chinese brands (Xiaomi, Oppo, Vivo) all showed positive growth whereas Samsung declined",
            "B All brands experienced negative growth",
            "C Samsung led in both market share and growth rate",
            "D Apple was the only brand with negative growth"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p2_q3",
          question: "How does Apple compare with Samsung in Q4 2023?",
          options: [
            "A Apple leads in market share and units shipped, while Samsung experienced a year-on-year decline",
            "B Samsung leads Apple in all three metrics",
            "C Both brands have exactly equal market share",
            "D Apple had negative growth while Samsung grew"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "market leader", "positive growth", "decline", "Chinese brands", "trailing behind"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "t2_p3_q1",
          question: "What was Apple's market share in Q4 2023?",
          options: [
            "A 24%",
            "B 18%",
            "C 13%",
            "D 9%"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p3_q2",
          question: "How many units did Apple ship, and what was its growth rate?",
          options: [
            "A 80.5 million units with 11% YoY growth",
            "B 60.2 million units with -9% YoY growth",
            "C 43.8 million units with 23% YoY growth",
            "D 30.1 million units with 8% YoY growth"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p3_q3",
          question: "What were Samsung's market share and growth figures?",
          options: [
            "A 18% market share with -9% growth, shipping 60.2 million units",
            "B 24% market share with 11% growth, shipping 80.5 million units",
            "C 13% market share with 23% growth, shipping 43.8 million units",
            "D 9% market share with 8% growth, shipping 30.1 million units"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p3_q4",
          question: "How much larger was Apple's shipment volume compared with Samsung's?",
          options: [
            "A Apple shipped 80.5 million units, which is 20.3 million more than Samsung's 60.2 million",
            "B Apple shipped 60.2 million units, which is 16.4 million more than Samsung's 43.8 million",
            "C Both shipped exactly the same number of units",
            "D Samsung shipped 80.5 million units, more than Apple's 60.2 million"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["market share", "units shipped", "year-on-year growth", "led", "declined by", "compared with"],
      tips: ["Include specific figures", "Describe the data in detail", "Use precise numbers"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "t2_p4_q1",
          question: "What was Xiaomi's market share and growth rate?",
          options: [
            "A 13% market share with 23% YoY growth, the highest growth rate",
            "B 9% market share with 8% growth",
            "C 8% market share with 5% growth",
            "D 18% market share with -9% growth"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p4_q2",
          question: "How do Oppo and Vivo compare in terms of market share and shipments?",
          options: [
            "A Oppo had 9% (30.1 million) whereas Vivo had 8% (27.5 million)",
            "B Vivo had 9% (30.1 million) whereas Oppo had 8% (27.5 million)",
            "C Both had exactly 9% market share",
            "D Oppo had 13% whereas Vivo had 9%"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p4_q3",
          question: "Which brand had the lowest market share and what was it?",
          options: [
            "A Vivo at 8%",
            "B Oppo at 9%",
            "C Xiaomi at 13%",
            "D Samsung at 18%"
          ],
          correctAnswer: "A"
        },
        {
          id: "t2_p4_q4",
          question: "By contrast with Xiaomi's 23% growth, how did Oppo and Vivo perform?",
          options: [
            "A Oppo grew by 8% and Vivo by 5%, both positive but far lower than Xiaomi",
            "B Oppo and Vivo both declined like Samsung",
            "C Oppo grew by 23% and Vivo by 13%",
            "D Both Oppo and Vivo had negative growth"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "respectively", "the highest growth", "the lowest share"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "table-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "t3_p1_q1",
          question: "What kind of athletic achievement data is shown in this table?",
          options: [
            "A Olympic medal counts across five top-performing countries",
            "B World athletics championship standings",
            "C National fitness survey results",
            "D Sports funding allocations by country"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p1_q2",
          question: "What information does the table contain?",
          options: [
            "A The medal counts (Gold, Silver, Bronze, and Total) for the top five countries at the 2024 Olympics",
            "B The number of athletes sent by each country to the Olympics",
            "C Historical Olympic medal totals since 1896",
            "D World rankings of Olympic sports by country"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p1_q3",
          question: "Which year's Olympic Games does this table cover?",
          options: [
            "A 2024",
            "B 2020",
            "C 2022",
            "D 2016"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["table", "Olympic medal table", "gold", "silver", "bronze", "total", "2024", "top five"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "t3_p2_q1",
          question: "Which country topped the overall medal table?",
          options: [
            "A USA with 126 total medals",
            "B China with 91 total medals",
            "C Japan with 45 total medals",
            "D France with 64 total medals"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p2_q2",
          question: "What is notable about the gold medal count?",
          options: [
            "A The USA and China both won 40 gold medals, tied for the most",
            "B China won significantly more gold medals than the USA",
            "C Japan won the most gold medals",
            "D Australia won more gold medals than China"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p2_q3",
          question: "How do the Asian countries (China and Japan) compare with the others in total medals?",
          options: [
            "A China placed second overall with 91 medals, while Japan placed third with 45 medals",
            "B Japan had more total medals than China",
            "C China placed first overall in total medals",
            "D Both China and Japan surpassed the USA in total medals"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "topped the table", "tied", "placed second", "gold medals", "total medals"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "t3_p3_q1",
          question: "How many gold medals did the USA win in 2024?",
          options: [
            "A 40",
            "B 44",
            "C 42",
            "D 126"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p3_q2",
          question: "What was the USA's total medal count and its breakdown?",
          options: [
            "A 126 total (40 Gold, 44 Silver, 42 Bronze)",
            "B 91 total (40 Gold, 27 Silver, 24 Bronze)",
            "C 64 total (16 Gold, 26 Silver, 22 Bronze)",
            "D 53 total (18 Gold, 19 Silver, 16 Bronze)"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p3_q3",
          question: "How did China's medal breakdown compare with the USA's?",
          options: [
            "A China had 40 Gold (equal to USA), 27 Silver, and 24 Bronze for a total of 91",
            "B China had 44 Gold, 42 Silver, and 40 Bronze for a total of 126",
            "C China had 20 Gold, 12 Silver, and 13 Bronze for a total of 45",
            "D China had 16 Gold, 26 Silver, and 22 Bronze for a total of 64"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p3_q4",
          question: "What was the gap in total medals between the USA and China?",
          options: [
            "A 35 medals (126 vs 91)",
            "B 81 medals (126 vs 45)",
            "C 62 medals (126 vs 64)",
            "D 73 medals (126 vs 53)"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["gold", "silver", "bronze", "total of", "breakdown", "compared with"],
      tips: ["Include specific figures", "Describe the data in detail", "Use precise numbers"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "t3_p4_q1",
          question: "How many medals did Japan win and what was its breakdown?",
          options: [
            "A 45 total (20 Gold, 12 Silver, 13 Bronze)",
            "B 53 total (18 Gold, 19 Silver, 16 Bronze)",
            "C 64 total (16 Gold, 26 Silver, 22 Bronze)",
            "D 91 total (40 Gold, 27 Silver, 24 Bronze)"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p4_q2",
          question: "How do Australia and France compare in total medals?",
          options: [
            "A Australia had 53 total whereas France had 64 total",
            "B France had 53 total whereas Australia had 64 total",
            "C Both had exactly 53 total medals",
            "D Australia had 45 total whereas France had 53 total"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p4_q3",
          question: "Which country had the fewest gold medals among the top five?",
          options: [
            "A France with 16 gold medals",
            "B Australia with 18 gold medals",
            "C Japan with 20 gold medals",
            "D China with 40 gold medals"
          ],
          correctAnswer: "A"
        },
        {
          id: "t3_p4_q4",
          question: "How does France's silver medal count (26) compare with the USA's (44) and China's (27)?",
          options: [
            "A France won 26 silver, just behind China's 27 but far behind the USA's 44",
            "B France won 44 silver, the most of any country",
            "C France won 27 silver, equal to China",
            "D France won 12 silver, far behind all other countries"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "respectively", "the fewest", "trailing behind"],
      tips: ["Use comparison structures", "Cover remaining categories", "Do NOT repeat Body 1 data"]
    }
  },

  "map-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "m1_p1_q1",
          question: "What two time periods are being compared in this map?",
          options: [
            "A The years 1990 and 2020",
            "B The years 1980 and 2010",
            "C The years 2000 and 2022",
            "D The years 1970 and 2000"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p1_q2",
          question: "What does the map illustrate?",
          options: [
            "A Changes in a town centre between 1990 and 2020",
            "B Population growth across a city over 30 years",
            "C Traffic flow patterns in a suburban area",
            "D Historical building preservation in a city centre"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p1_q3",
          question: "How many time periods are shown on the map?",
          options: [
            "A Two: 1990 and 2020",
            "B Three: 1990, 2005, and 2020",
            "C One: 2020 only",
            "D Four: 1990, 2000, 2010, and 2020"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["map", "town centre", "development", "1990", "2020", "changes", "comparison"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "m1_p2_q1",
          question: "What overall change took place in the town centre between 1990 and 2020?",
          options: [
            "A The area underwent significant development with new commercial and transport facilities added",
            "B The town centre remained largely unchanged over the 30 years",
            "C Most buildings were demolished without replacement",
            "D The area became primarily residential instead of commercial"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p2_q2",
          question: "What new landmark appeared by 2020?",
          options: [
            "A A Shopping Mall was constructed",
            "B A new Park was added",
            "C The Library was expanded",
            "D A second Hotel was built"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p2_q3",
          question: "How did the transport infrastructure change?",
          options: [
            "A A new Station and additional bridges were added to improve connectivity",
            "B All roads were removed in favour of pedestrian zones",
            "C The existing Station was relocated outside the town centre",
            "D No transport changes occurred between the two periods"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "significant development", "new facilities", "expanded", "connectivity", "modernisation"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "m1_p3_q1",
          question: "What facilities existed in the town centre in 1990?",
          options: [
            "A A Park, Library, Shops, Hotel, and a Station",
            "B Only a Park and a Library",
            "C A Shopping Mall, Hotel, and Shops",
            "D A Park, Library, and Shopping Mall"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p3_q2",
          question: "Where was the Hotel located relative to the other buildings in 1990?",
          options: [
            "A The Hotel was positioned near the Shops and connected by a road",
            "B The Hotel was on the opposite side of the Park from the Library",
            "C The Hotel did not yet exist in 1990",
            "D The Hotel was next to the Station"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p3_q3",
          question: "What connected the various locations in 1990?",
          options: [
            "A Roads and a bridge near the station area",
            "B Only pedestrian footpaths",
            "C A single main road through the centre",
            "D Underground tunnels between buildings"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["originally", "consisted of", "located", "road network", "connected", "1980s layout"],
      tips: ["Describe the initial layout in detail", "Use positional language", "Mention connections between locations"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "m1_p4_q1",
          question: "What was the most significant addition by 2020?",
          options: [
            "A A new Shopping Mall was built, transforming the commercial landscape",
            "B The Park was doubled in size",
            "C A second Library branch was opened",
            "D The Hotel was demolished and replaced"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p4_q2",
          question: "How did the road and bridge network expand by 2020?",
          options: [
            "A New roads and additional bridges were built to connect the new developments",
            "B All existing roads were closed and replaced with cycle paths",
            "C The road network remained exactly as it was in 1990",
            "D Only the bridge was removed with no new roads added"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p4_q3",
          question: "Which original features remained unchanged between 1990 and 2020?",
          options: [
            "A The Park and Library stayed in their original positions throughout",
            "B The Shops were completely removed by 2020",
            "C The Station was relocated to a new site",
            "D The Hotel was converted into a different facility"
          ],
          correctAnswer: "A"
        },
        {
          id: "m1_p4_q4",
          question: "By 2020, how did the town centre compare with its 1990 version?",
          options: [
            "A It had become a more modern commercial hub with a Shopping Mall, enhanced Station, and improved road network",
            "B It had reverted to a mostly green space with few buildings remaining",
            "C It was largely identical to the 1990 layout",
            "D It had been entirely replaced by residential housing"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "the most notable change", "newly constructed", "meanwhile", "remained in place"],
      tips: ["Use comparison structures", "Describe additions and changes", "Do NOT repeat the original layout description"]
    }
  },

  "map-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "m2_p1_q1",
          question: "What two versions of the campus are being compared?",
          options: [
            "A The current layout and a proposed 2030 expansion plan",
            "B The north campus and south campus arrangements",
            "C The undergraduate and graduate areas",
            "D The old 1990s design and a 2025 renovation"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p1_q2",
          question: "What does the map illustrate?",
          options: [
            "A Planned changes to a university campus, including new and existing facilities",
            "B Current student population distribution across campus",
            "C Historical development of the university since its founding",
            "D Traffic and parking arrangements on campus"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p1_q3",
          question: "Which facilities appear on the campus map?",
          options: [
            "A Main Building, Library, Science Lab, Sports Centre, Student Dorms, and a New Cafeteria",
            "B Lecture Halls, Medical Centre, and Administration Block only",
            "C Research Labs, Conference Centre, and Staff Housing only",
            "D Classrooms, Playground, and Swimming Pool only"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["map", "university campus", "expansion plan", "facilities", "existing", "new"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "m2_p2_q1",
          question: "What is the main purpose of this campus plan?",
          options: [
            "A To show the addition of new facilities, most notably a New Cafeteria, to the existing campus",
            "B To document the complete demolition of the current campus",
            "C To illustrate a reduction in campus facilities",
            "D To compare the university with other institutions"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p2_q2",
          question: "Where is the New Cafeteria located relative to existing buildings?",
          options: [
            "A The New Cafeteria is positioned within the central campus area, connected to existing buildings via paths",
            "B It is located off-campus, far from the main university buildings",
            "C It replaces the existing Main Building",
            "D It is on the opposite side of a major road from the campus"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p2_q3",
          question: "How does the campus layout ensure connectivity between facilities?",
          options: [
            "A Multiple connecting paths link the buildings together across the campus",
            "B Each building is completely isolated with no connecting routes",
            "C There is only a single path connecting two buildings",
            "D All facilities are housed within a single large building"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "campus layout", "connected", "paths", "central area", "new addition"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "m2_p3_q1",
          question: "Which pre-existing facilities form the core of the campus?",
          options: [
            "A The Main Building, Library, Science Lab, and Sports Centre",
            "B Only the Main Building and the New Cafeteria",
            "C The Student Dorms and New Cafeteria",
            "D The Library and Science Lab are the only existing structures"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p3_q2",
          question: "Where are the Student Dorms situated on the campus?",
          options: [
            "A The Student Dorms are located to one side of the campus, connected by paths to the academic buildings",
            "B The Student Dorms are in the exact centre of the campus",
            "C The Student Dorms are completely off-campus",
            "D The Student Dorms are housed within the Main Building"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p3_q3",
          question: "How are the Main Building and Library positioned relative to each other?",
          options: [
            "A The Main Building and Library are situated close together in the central campus area, linked by a path",
            "B They are on opposite sides of campus with no direct connection",
            "C The Library is inside the Main Building",
            "D They are separated by a major road with no crossing point"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["core buildings", "existing facilities", "situated", "linked by", "central area", "positioned"],
      tips: ["Describe the existing layout in detail", "Use positional language", "Mention connections between locations"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "m2_p4_q1",
          question: "What is the most notable new addition to the campus?",
          options: [
            "A A New Cafeteria is planned as a new facility to serve the campus community",
            "B A second Library is being constructed",
            "C A new Science Lab wing is being added to the existing building",
            "D The Sports Centre is being expanded to double its size"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p4_q2",
          question: "Where is the New Cafeteria planned to be built?",
          options: [
            "A In a central area near the existing facilities with new connecting paths",
            "B At the very edge of the campus far from all other buildings",
            "C Directly on top of the current Sports Centre",
            "D Outside the campus boundary entirely"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p4_q3",
          question: "How does the New Cafeteria improve the overall campus layout?",
          options: [
            "A It adds a dining facility within convenient walking distance of both academic and residential areas",
            "B It replaces the need for the existing Main Building",
            "C It reduces the overall number of campus facilities",
            "D It only serves students living in the Student Dorms"
          ],
          correctAnswer: "A"
        },
        {
          id: "m2_p4_q4",
          question: "By contrast with the existing facilities, what role does the New Cafeteria serve?",
          options: [
            "A It provides a social and dining space whereas existing buildings are primarily academic or residential",
            "B It duplicates the function of the existing Library",
            "C It is identical in purpose to the Science Lab",
            "D It replaces the Sports Centre's function"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "the new addition", "connected via", "meanwhile", "convenient access"],
      tips: ["Use comparison structures", "Describe additions and changes", "Do NOT repeat the existing layout description"]
    }
  },

  "map-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "m3_p1_q1",
          question: "What facility is the subject of these before-and-after diagrams?",
          options: [
            "A An airport terminal — ground floor layout",
            "B A shopping mall — first floor plan",
            "C A hospital — emergency department",
            "D A train station — platform level"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p1_q2",
          question: "What does the map show?",
          options: [
            "A The layout and sequential flow of an airport terminal before and after renovation",
            "B Flight departure and arrival statistics",
            "C Airline market share at the airport",
            "D Baggage handling efficiency metrics"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p1_q3",
          question: "Which areas are included in the airport terminal layout?",
          options: [
            "A Check-in, Security, Duty Free, Gates 1-10, Lounge, Food Court, and Gates 11-20",
            "B Runways, Control Tower, and Hangars",
            "C Parking Garage, Hotel, and Conference Centre",
            "D Train Station, Bus Terminal, and Taxi Rank"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["map", "airport terminal", "renovation", "layout", "flow", "passenger journey"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and time period", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "m3_p2_q1",
          question: "What is the overall flow pattern through the terminal?",
          options: [
            "A Passengers move sequentially from Check-in through Security, past shops and gates",
            "B Passengers can enter at any point and move freely in any direction",
            "C The terminal has no clear directional flow",
            "D Passengers must visit every area in a random order"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p2_q2",
          question: "What new facilities were added as part of the renovation?",
          options: [
            "A A Lounge and Food Court were introduced to improve the passenger experience",
            "B Additional runways were constructed",
            "C A second Check-in area was built",
            "D The Security area was removed entirely"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p2_q3",
          question: "How are the two sets of gates (1-10 and 11-20) accessed?",
          options: [
            "A Both gate areas are accessed after passing through the main Duty Free shopping zone",
            "B Gates 11-20 are only accessible from outside the terminal",
            "C Gates 1-10 and 11-20 are at opposite ends with no common path",
            "D Only one set of gates is available to passengers"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "sequential flow", "linear", "before and after", "new additions", "passenger experience"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "m3_p3_q1",
          question: "What is the first stage of the passenger journey through the terminal?",
          options: [
            "A Check-in, where passengers register and drop off their luggage",
            "B Security screening",
            "C The Duty Free shopping area",
            "D Boarding at the gates"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p3_q2",
          question: "What comes immediately after passing through Security?",
          options: [
            "A The Duty Free shopping zone, which passengers walk through before reaching gates",
            "B Boarding gates 1-10 directly",
            "C The Food Court and Lounge",
            "D A second security checkpoint"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p3_q3",
          question: "How does the Check-in area connect to Security?",
          options: [
            "A Passengers proceed directly from Check-in to Security through a designated pathway",
            "B Check-in and Security are in completely separate buildings",
            "C Passengers must take a shuttle between Check-in and Security",
            "D There is no fixed route between Check-in and Security"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["first stage", "passenger flow", "proceed to", "next", "followed by", "initial areas"],
      tips: ["Describe the flow in sequence", "Use directional language", "Mention the order of areas"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "m3_p4_q1",
          question: "Where are the Lounge and Food Court located in relation to the gates?",
          options: [
            "A They are positioned after the Duty Free area, providing services near both gate zones",
            "B They are located before the Security checkpoint",
            "C They are outside the terminal, in a separate building",
            "D They are only accessible from Gates 1-10, not Gates 11-20"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p4_q2",
          question: "How do Gates 1-10 and Gates 11-20 compare in terms of access?",
          options: [
            "A Both are accessed from the central Duty Free area, but serve different flight zones",
            "B Gates 1-10 are before Security whereas Gates 11-20 are after",
            "C Gates 11-20 can only be reached via the Lounge",
            "D Only one gate zone is operational after the renovation"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p4_q3",
          question: "What improvement did the renovation bring to the passenger journey?",
          options: [
            "A The addition of a Lounge and Food Court gives passengers more amenities after passing Security",
            "B The renovation removed the Security checkpoint to speed up passenger flow",
            "C The Check-in area was eliminated to reduce queues",
            "D The Duty Free zone was moved to before the Security area"
          ],
          correctAnswer: "A"
        },
        {
          id: "m3_p4_q4",
          question: "By contrast with the earlier stages (Check-in and Security), what do the later areas offer?",
          options: [
            "A The later areas provide retail, dining, and relaxation options whereas the earlier stages are procedural",
            "B The later areas are identical in function to Check-in and Security",
            "C The later areas handle only baggage claims",
            "D The later areas are exclusively for airline staff"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "meanwhile", "after passing through", "the remaining areas", "respectively"],
      tips: ["Use comparison structures", "Describe the later stages of the flow", "Do NOT repeat the initial flow description"]
    }
  },

  "flow-1": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "f1_p1_q1",
          question: "What process is illustrated by this diagram?",
          options: [
            "A How waste paper is recycled into new paper products",
            "B How trees are grown for paper production",
            "C How newspapers are distributed to vendors",
            "D How different paper types are sorted by quality"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p1_q2",
          question: "What process does the flowchart illustrate?",
          options: [
            "A The step-by-step process of recycling paper from collection to new paper production",
            "B The manufacturing of paper from raw wood pulp",
            "C The distribution of recycled paper products",
            "D The environmental impact assessment of paper mills"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p1_q3",
          question: "How many stages make up this recycling process?",
          options: [
            "A Seven stages, from Collection through to New Paper",
            "B Five stages in total",
            "C Six stages ending at De-inking",
            "D Eight stages including packaging and shipping"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["flowchart", "paper recycling", "process", "stages", "step-by-step", "seven steps"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and number of stages", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "f1_p2_q1",
          question: "What type of process is paper recycling?",
          options: [
            "A A linear, sequential process where each stage leads to the next",
            "B A circular process that repeats indefinitely",
            "C A process with multiple parallel branches",
            "D A process where the order of stages is interchangeable"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p2_q2",
          question: "What is the overall purpose of the process?",
          options: [
            "A To transform used paper into new, usable paper through a series of mechanical and chemical stages",
            "B To simply collect and sort waste paper without further processing",
            "C To burn used paper for energy generation",
            "D To export used paper to other countries"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p2_q3",
          question: "How can the seven stages be broadly divided?",
          options: [
            "A Three preparation stages (Collection, Sorting, Cleaning), three processing stages (Pulping, De-inking, Drying), and the final output",
            "B Two stages only: Collection and New Paper",
            "C All seven stages are essentially the same process repeated",
            "D Four input stages and four output stages"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "linear process", "sequential", "transform", "stages", "manual and mechanical"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "f1_p3_q1",
          question: "What is the first stage of the paper recycling process?",
          options: [
            "A Collection of used paper from various sources",
            "B Sorting the paper by type and quality",
            "C Cleaning the paper to remove contaminants",
            "D Pulping the paper into a fibrous mixture"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p3_q2",
          question: "What happens during the Sorting stage?",
          options: [
            "A The collected paper is sorted by type and quality to separate recyclable from non-recyclable material",
            "B The paper is immediately turned into new sheets",
            "C The paper is burned to generate energy",
            "D The paper is packaged and sold to other countries"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p3_q3",
          question: "Which stage follows Cleaning in the process?",
          options: [
            "A Pulping, where the cleaned paper is broken down into a pulp mixture",
            "B De-inking, where ink is chemically removed",
            "C Drying, where the pulp is formed into sheets",
            "D Collection, restarting the cycle"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p3_q4",
          question: "How do the first three stages (Collection, Sorting, Cleaning) differ from Pulping?",
          options: [
            "A The first three are preparatory steps, whereas Pulping begins the actual transformation into new material",
            "B All four stages are exactly the same process",
            "C Pulping happens before Collection in the correct order",
            "D Cleaning and Pulping are the same stage under different names"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["initial stage", "followed by", "subsequently", "preparatory", "transformation", "first half"],
      tips: ["Describe stages in sequence", "Use sequencing language (first, next, then)", "Cover the first half of the process"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "f1_p4_q1",
          question: "What is the purpose of the De-inking stage?",
          options: [
            "A To remove ink and other printing residues from the pulp using chemical processes",
            "B To add new ink to the paper for colouring",
            "C To sort the pulp by fibre length",
            "D To compress the pulp into its final shape"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p4_q2",
          question: "What happens during the Drying stage?",
          options: [
            "A The cleaned and de-inked pulp is dried and formed into sheets of paper",
            "B The paper is soaked in water for further cleaning",
            "C The pulp is mixed with new raw materials",
            "D The paper is shredded back into small pieces"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p4_q3",
          question: "What is the final output of the entire process?",
          options: [
            "A New Paper, ready for use in various products",
            "B De-inked pulp stored for future use",
            "C Sorted waste paper bales for export",
            "D Dried pulp sold as a raw material to other industries"
          ],
          correctAnswer: "A"
        },
        {
          id: "f1_p4_q4",
          question: "By contrast with the earlier mechanical stages, how does De-inking differ?",
          options: [
            "A De-inking is a chemical process whereas earlier stages (Collection, Sorting, Cleaning) are mechanical or manual",
            "B De-inking is identical to the Sorting stage",
            "C De-inking happens before Collection in the correct sequence",
            "D De-inking and Drying are the same process"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "subsequently", "finally", "the resulting", "chemical process"],
      tips: ["Use comparison structures", "Cover the second half of the process", "Describe the final outcome"]
    }
  },

  "flow-2": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "f2_p1_q1",
          question: "What administrative process is depicted in this diagram?",
          options: [
            "A The university admission process for international students",
            "B The course registration procedure for current students",
            "C The graduation clearance workflow",
            "D The scholarship application timeline"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p1_q2",
          question: "What does the flowchart describe?",
          options: [
            "A The stages an applicant goes through from submitting an application to enrolment at a university",
            "B The process of graduating from university",
            "C The steps for applying for a student visa only",
            "D The procedure for transferring between universities"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p1_q3",
          question: "What is notable about one part of this process?",
          options: [
            "A The Language Test and Interview stages run in parallel, meaning they can happen simultaneously",
            "B All stages must be completed in strict sequential order with no overlap",
            "C The process has no conditional stages",
            "D The Enrolment stage occurs at the beginning of the process"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["flowchart", "university admission", "process", "parallel", "stages", "application"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and any unique features", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "f2_p2_q1",
          question: "What is the overall structure of the admission process?",
          options: [
            "A A mostly linear process with one parallel stage where Language Test and Interview run concurrently",
            "B A completely circular process with no clear end point",
            "C A process where every stage runs in parallel with every other stage",
            "D A single-stage process with no intermediate steps"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p2_q2",
          question: "What is the outcome of successfully completing all stages?",
          options: [
            "A The applicant becomes enrolled at the university",
            "B The applicant receives a visa but no university place",
            "C The applicant must start the process over again",
            "D The applicant is automatically granted a scholarship"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p2_q3",
          question: "Which stage can be described as conditional?",
          options: [
            "A The Conditional Offer, which depends on meeting certain requirements",
            "B Submit Application, as it is the first required step",
            "C Enrolment, as it is the final stage",
            "D Visa Process, as it is always required"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "sequential", "parallel stages", "conditional", "outcome", "concurrent"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "f2_p3_q1",
          question: "What is the first step in the university admission process?",
          options: [
            "A Submit Application, where the applicant formally applies to the university",
            "B Document Review, where submitted materials are checked",
            "C Language Test, which assesses English proficiency",
            "D Interview, where the applicant meets with admissions staff"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p3_q2",
          question: "What happens immediately after submitting the application?",
          options: [
            "A Document Review, where the university checks all submitted materials",
            "B A Conditional Offer is issued automatically",
            "C The Visa Process begins right away",
            "D The applicant proceeds directly to Enrolment"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p3_q3",
          question: "After Document Review, what two paths run simultaneously?",
          options: [
            "A Language Test and Interview take place in parallel",
            "B Visa Process and Enrolment run concurrently",
            "C Submit Application and Document Review are repeated",
            "D Conditional Offer is issued and revoked at the same time"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p3_q4",
          question: "Why are Language Test and Interview described as parallel stages?",
          options: [
            "A They can occur at the same time rather than one after the other",
            "B They must be completed in strict sequence, one before the other",
            "C They are optional and can be skipped entirely",
            "D They are the same stage described using two different names"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["initial stage", "subsequently", "parallel paths", "simultaneously", "after completing", "concurrent"],
      tips: ["Describe stages in sequence", "Use sequencing language", "Highlight the parallel feature"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "f2_p4_q1",
          question: "What is issued after the Language Test and Interview are successfully completed?",
          options: [
            "A A Conditional Offer, which is subject to meeting specific requirements",
            "B An unconditional acceptance letter",
            "C A visa rejection notice",
            "D A request to resubmit the application"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p4_q2",
          question: "What must happen after receiving the Conditional Offer before enrolment?",
          options: [
            "A The Visa Process must be completed, securing permission to study in the country",
            "B Another round of interviews must be conducted",
            "C The application must be resubmitted from the beginning",
            "D A medical examination separate from the visa process"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p4_q3",
          question: "What is the final stage of the admission process?",
          options: [
            "A Enrolment, where the student officially registers at the university",
            "B Visa Process, which is the last administrative step",
            "C Conditional Offer, which confirms the place",
            "D Language Test, which must be retaken before starting"
          ],
          correctAnswer: "A"
        },
        {
          id: "f2_p4_q4",
          question: "By contrast with the earlier parallel stages, how do the final stages differ?",
          options: [
            "A The final stages (Conditional Offer, Visa Process, Enrolment) return to a strict sequential order",
            "B The final stages also run in parallel like the Language Test and Interview",
            "C The final stages are optional and can be bypassed",
            "D The final stages precede the parallel stages in the correct sequence"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "subsequently", "finally", "conditional upon", "sequential"],
      tips: ["Use comparison structures", "Cover the final stages", "Do NOT repeat the initial stages"]
    }
  },

  "flow-3": {
    paragraph1: {
      prompt: "Paragraph 1: Introduction",
      instruction: "Rewrite the Task 1 question in your own words. Include: chart type, what it shows, time/place/units.",
      questions: [
        {
          id: "f3_p1_q1",
          question: "What industrial process does this diagram illustrate?",
          options: [
            "A How cement is manufactured from raw materials",
            "B How concrete is mixed on construction sites",
            "C How bricks are fired in a kiln",
            "D How steel beams are forged"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p1_q2",
          question: "What does the flowchart show?",
          options: [
            "A The stages involved in producing cement, starting from raw materials and ending with packaged cement",
            "B The environmental impact of cement factories",
            "C Global cement production statistics by country",
            "D The financial costs of cement manufacturing"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p1_q3",
          question: "How many stages does the cement production process consist of?",
          options: [
            "A Six stages, from Limestone & Clay through to Cement Bags",
            "B Four stages of production",
            "C Seven stages including transportation to customers",
            "D Five stages ending at the Rotating Heater"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["flowchart", "cement production", "process", "stages", "raw materials", "manufacturing"],
      tips: ["Paraphrase the question using synonyms", "Include chart type, subject, and number of stages", "Do NOT copy the question word for word"]
    },
    paragraph2: {
      prompt: "Paragraph 2: Overview",
      instruction: "Write 1-2 sentences summarizing the most important overall patterns. Do NOT include specific numbers.",
      questions: [
        {
          id: "f3_p2_q1",
          question: "What type of process is cement production?",
          options: [
            "A A linear process where raw materials are progressively transformed into the finished product",
            "B A circular process with no clear starting or ending point",
            "C A process where stages can occur in any random order",
            "D A process with only one main stage"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p2_q2",
          question: "What are the two main phases of the process?",
          options: [
            "A Crushing and mixing the raw materials, followed by heating, grinding, and packaging",
            "B Mining the limestone and selling the cement",
            "C Only mixing and packaging",
            "D Heating and cooling only"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p2_q3",
          question: "What is the role of the Rotating Heater in the process?",
          options: [
            "A It is the central stage where the mixed materials undergo thermal transformation",
            "B It is only used for cooling the final product",
            "C It is an optional stage that can be skipped",
            "D It serves the same function as the Grinder"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["overall", "linear process", "transformation", "raw materials", "finished product", "mechanical and thermal"],
      tips: ["Write only 1-2 sentences", "Do NOT include specific numbers", "Focus on the big picture"]
    },
    paragraph3: {
      prompt: "Paragraph 3: Body Paragraph 1",
      instruction: "Describe the most important data group in detail. Include starting value, ending value, and key changes.",
      questions: [
        {
          id: "f3_p3_q1",
          question: "What are the two raw materials used at the start of cement production?",
          options: [
            "A Limestone and Clay",
            "B Sand and Gravel",
            "C Coal and Iron Ore",
            "D Water and Gypsum"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p3_q2",
          question: "What is the function of the Crusher?",
          options: [
            "A It crushes the limestone and clay into smaller pieces for further processing",
            "B It mixes the crushed material with water",
            "C It heats the materials to a high temperature",
            "D It packages the finished cement into bags"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p3_q3",
          question: "What happens to the crushed material in the Mixer?",
          options: [
            "A The crushed limestone and clay are blended together into a uniform mixture",
            "B The material is heated to over 1000 degrees",
            "C The mixture is ground into a fine powder",
            "D The cement is bagged for distribution"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p3_q4",
          question: "How do the first three stages (Limestone & Clay, Crusher, Mixer) prepare the material for heating?",
          options: [
            "A They progressively reduce the raw materials to a fine, uniform mixture ready for thermal processing",
            "B They add water to create a liquid cement paste",
            "C They package the material into small bags for the heater",
            "D They chemically alter the material without any mechanical work"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["raw materials", "initially", "crushed into", "blended together", "prepared for", "first half"],
      tips: ["Describe stages in sequence", "Use sequencing language", "Cover the preparation stages"]
    },
    paragraph4: {
      prompt: "Paragraph 4: Body Paragraph 2",
      instruction: "Describe the remaining data groups. Use comparison structures (whereas/by contrast/meanwhile).",
      questions: [
        {
          id: "f3_p4_q1",
          question: "What happens inside the Rotating Heater?",
          options: [
            "A The mixed material is heated at high temperatures causing chemical and physical changes",
            "B The cement is cooled to room temperature for packaging",
            "C The material is crushed a second time into even smaller pieces",
            "D The final product is tested for quality assurance"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p4_q2",
          question: "What is the function of the Grinder?",
          options: [
            "A It grinds the heated material into a fine cement powder",
            "B It mixes new raw materials into the heated product",
            "C It separates the cement by particle size",
            "D It adds colouring to the cement"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p4_q3",
          question: "What is the final stage of the cement production process?",
          options: [
            "A The finished cement is packed into Cement Bags, ready for distribution",
            "B The cement is reheated for a second time",
            "C The cement is returned to the Mixer for reprocessing",
            "D The cement is tested in a laboratory"
          ],
          correctAnswer: "A"
        },
        {
          id: "f3_p4_q4",
          question: "By contrast with the mechanical crushing and mixing stages, what characterises the Rotating Heater and Grinder?",
          options: [
            "A These later stages involve thermal transformation followed by fine grinding, whereas the earlier stages are purely mechanical",
            "B These stages are also purely mechanical with no heating involved",
            "C These stages reverse the work done by the Crusher and Mixer",
            "D These stages are optional and can be replaced by manual labour"
          ],
          correctAnswer: "A"
        }
      ],
      keywords: ["whereas", "by contrast", "subsequently", "finally", "thermal transformation", "ground into"],
      tips: ["Use comparison structures", "Cover the final stages", "Describe the finished product"]
    }
  }
};