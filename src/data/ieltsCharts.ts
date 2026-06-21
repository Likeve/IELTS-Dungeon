export type ChartType = "line" | "bar" | "pie" | "table" | "map" | "flowchart";

export interface LineChartData {
  labels: string[];
  series: { name: string; values: number[]; color: string }[];
}

export interface BarChartData {
  labels: string[];
  values: number[];
  color: string;
}

export interface PieChartData {
  segments: { label: string; value: number; color: string }[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface MapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface MapEdge {
  from: string;
  to: string;
  label?: string;
}

export interface FlowchartData {
  nodes: MapNode[];
  edges: MapEdge[];
}

export type ChartData = LineChartData | BarChartData | PieChartData | TableData | FlowchartData;

export interface Level1Question {
  question: string;
  options: string[];
  answer: string;
}

export interface Level2Question {
  sentence: string;
  options: string[];
  answer: string;
}

export interface Level3Question {
  sentence: string;
  options: string[];
  answer: string;
}

export interface Level4Question {
  sentence: string;
  options: string[];
  answer: string;
}

export interface Level5Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Level6Data {
  words: string[];
  targetSentence: string;
}

export interface ChartLevels {
  level1: { prompt: string; questions: Level1Question[] };
  level2: { prompt: string; questions: Level2Question[] };
  level3: { prompt: string; questions: Level3Question[] };
  level4: { prompt: string; questions: Level4Question[] };
  level5: { prompt: string; options: Level5Option[]; overviewText: string };
  level6: { prompt: string; paragraphs: Level6Data[] };
}

export interface ChartItem {
  id: string;
  type: ChartType;
  title: string;
  question: string;
  data: ChartData;
  xLabel?: string;
  yLabel?: string;
  levels: ChartLevels;
}

export const LEVEL_LABELS: Record<keyof ChartLevels, string> = {
  level1: "Observation",
  level2: "Vocabulary",
  level3: "Phrases",
  level4: "Sentences",
  level5: "Overview",
  level6: "Paragraph",
};

const LINE_COLORS = ["#5BB83F", "#FF6B6B", "#4ECDC4", "#FFE66D"];
const BAR_COLORS = ["#5BB83F", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#F472B6"];
const PIE_COLORS = ["#5BB83F", "#4ECDC4", "#FF6B6B", "#FFE66D", "#A78BFA", "#F472B6"];

export const CHARTS: ChartItem[] = [
  {
    "id": "line-1",
    "type": "line",
    "title": "UK Energy Consumption by Source (2000-2020)",
    "question": "The line graph below shows the energy consumption from different sources in the United Kingdom between 2000 and 2020.",
    "xLabel": "Year",
    "yLabel": "Million tonnes oil equivalent",
    "data": {
      "labels": [
        "2000",
        "2005",
        "2010",
        "2015",
        "2020"
      ],
      "series": [
        {
          "name": "Coal",
          "values": [
            85,
            72,
            58,
            40,
            28
          ],
          "color": "#FF6B6B"
        },
        {
          "name": "Natural Gas",
          "values": [
            60,
            68,
            75,
            80,
            78
          ],
          "color": "#4ECDC4"
        },
        {
          "name": "Renewables",
          "values": [
            5,
            8,
            18,
            35,
            42
          ],
          "color": "#5BB83F"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which energy source had the highest consumption in 2000?",
            "options": [
              "Coal",
              "Natural Gas",
              "Renewables",
              "Cannot determine"
            ],
            "answer": "Coal"
          },
          {
            "question": "Which energy source fell to the lowest consumption by 2020?",
            "options": [
              "Coal",
              "Natural Gas",
              "Renewables",
              "All three equal"
            ],
            "answer": "Coal"
          },
          {
            "question": "In which year did natural gas first overtake coal?",
            "options": [
              "2005",
              "2010",
              "2015",
              "2020"
            ],
            "answer": "2010"
          },
          {
            "question": "Which energy source maintained a continuous upward trend?",
            "options": [
              "Coal",
              "Natural Gas",
              "Renewables",
              "All of the above"
            ],
            "answer": "Renewables"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Coal consumption experienced a sharp _____ over the period.",
            "options": [
              "decline",
              "increase",
              "stability",
              "fluctuation"
            ],
            "answer": "decline"
          },
          {
            "sentence": "The consumption of renewables grew _____ from 5 to 42.",
            "options": [
              "rapidly",
              "slowly",
              "slightly",
              "barely"
            ],
            "answer": "rapidly"
          },
          {
            "sentence": "Natural gas consumption _____ between 2015 and 2020.",
            "options": [
              "stabilized",
              "declined",
              "doubled",
              "disappeared"
            ],
            "answer": "stabilized"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Coal consumption fell from 85 _____ 28 in 2020.",
            "options": [
              "to just",
              "and reached",
              "then became",
              "up to"
            ],
            "answer": "to just"
          },
          {
            "sentence": "Natural gas reached _____ of approximately 80 by 2015.",
            "options": [
              "a peak",
              "a low",
              "an average",
              "a decline"
            ],
            "answer": "a peak"
          },
          {
            "sentence": "Renewables overtook coal _____ between 2015 and 2020.",
            "options": [
              "towards the end",
              "at the beginning",
              "in the middle",
              "throughout"
            ],
            "answer": "towards the end"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Coal consumption _____ from 85 to 28 over the 20-year period.",
            "options": [
              "fell",
              "has fallen",
              "had fallen"
            ],
            "answer": "fell"
          },
          {
            "sentence": "By 2020, natural gas _____ the dominant energy source.",
            "options": [
              "had become",
              "becomes",
              "will become"
            ],
            "answer": "had become"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "Coal consumption declined dramatically throughout the period",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Natural gas increased every year",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Renewables overtook coal around 2018",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Natural gas more than doubled",
            "isCorrect": false
          },
          {
            "id": "e",
            "text": "Coal consumption fell below 30 by 2020",
            "isCorrect": true
          }
        ],
        "overviewText": "Overall, while coal consumption declined dramatically, natural gas and renewables rose considerably, with natural gas becoming the leading source by 2020."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Coal",
              "consumption",
              "fell",
              "dramatically",
              "from",
              "85",
              "to",
              "28",
              "over",
              "the",
              "period"
            ],
            "targetSentence": "Coal consumption fell dramatically from 85 to 28 over the period."
          }
        ]
      }
    }
  },
  {
    "id": "line-2",
    "type": "line",
    "title": "Average Monthly Temperatures in Three Cities",
    "question": "The line graph below shows the average monthly temperatures in Celsius for London, Tokyo, and Sydney.",
    "xLabel": "Month",
    "yLabel": "Temperature (°C)",
    "data": {
      "labels": [
        "Jan",
        "Mar",
        "May",
        "Jul",
        "Sep",
        "Nov"
      ],
      "series": [
        {
          "name": "London",
          "values": [
            5,
            8,
            14,
            19,
            17,
            9
          ],
          "color": "#5BB83F"
        },
        {
          "name": "Tokyo",
          "values": [
            6,
            10,
            19,
            26,
            24,
            14
          ],
          "color": "#FF6B6B"
        },
        {
          "name": "Sydney",
          "values": [
            23,
            22,
            16,
            13,
            16,
            20
          ],
          "color": "#4ECDC4"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which city had the highest temperatures throughout the year?",
            "options": [
              "London",
              "Tokyo",
              "Sydney",
              "All three equal"
            ],
            "answer": "Tokyo"
          },
          {
            "question": "In which month did Sydney reach its highest temperature?",
            "options": [
              "January",
              "July",
              "September",
              "November"
            ],
            "answer": "January"
          },
          {
            "question": "In which month did both London and Tokyo peak?",
            "options": [
              "January",
              "May",
              "July",
              "September"
            ],
            "answer": "July"
          },
          {
            "question": "How did Sydney's temperature pattern differ from the others?",
            "options": [
              "Rose continuously",
              "Fell continuously",
              "Opposite to Northern Hemisphere cities",
              "Showed no change"
            ],
            "answer": "Opposite to Northern Hemisphere cities"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Tokyo experienced the _____ temperatures among the three cities.",
            "options": [
              "highest",
              "lowest",
              "average",
              "moderate"
            ],
            "answer": "highest"
          },
          {
            "sentence": "Sydney's temperature pattern was the _____ of London and Tokyo.",
            "options": [
              "opposite",
              "same",
              "continuation",
              "mirror"
            ],
            "answer": "opposite"
          },
          {
            "sentence": "Temperatures in London _____ at 19°C in July.",
            "options": [
              "peaked",
              "dropped",
              "stabilized",
              "averaged"
            ],
            "answer": "peaked"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Tokyo's temperature was consistently _____ London's throughout the year.",
            "options": [
              "higher than",
              "lower than",
              "equal to",
              "similar to"
            ],
            "answer": "higher than"
          },
          {
            "sentence": "Sydney reached its highest temperature of 23°C _____.",
            "options": [
              "in January",
              "in July",
              "in September",
              "in November"
            ],
            "answer": "in January"
          },
          {
            "sentence": "London and Tokyo both reached their highest temperatures _____.",
            "options": [
              "in July",
              "in January",
              "in May",
              "in November"
            ],
            "answer": "in July"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Tokyo's temperature _____ London's in every month shown.",
            "options": [
              "exceeded",
              "was same as",
              "fell below"
            ],
            "answer": "exceeded"
          },
          {
            "sentence": "While London and Tokyo peaked in July, Sydney _____ its highest point in January.",
            "options": [
              "reached",
              "declined",
              "avoided"
            ],
            "answer": "reached"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "Tokyo's temperatures exceeded London's in every month shown",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "All three cities reached their peak in July",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Sydney's seasonal pattern was opposite to Northern Hemisphere cities",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "London's temperature never exceeded 20°C in any month shown",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "Tokyo's temperature fell below London's in September",
            "isCorrect": false
          }
        ],
        "overviewText": "Overall, Tokyo recorded the highest temperatures, while Sydney exhibited an inverse seasonal pattern due to its Southern Hemisphere location."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Tokyo",
              "recorded",
              "the",
              "highest",
              "temperatures",
              "among",
              "the",
              "three",
              "cities",
              "throughout",
              "the",
              "year"
            ],
            "targetSentence": "Tokyo recorded the highest temperatures among the three cities throughout the year."
          }
        ]
      }
    }
  },
  {
    "id": "line-3",
    "type": "line",
    "title": "Internet Usage by Age Group (2010-2022)",
    "question": "The line graph below shows the percentage of internet users in different age groups between 2010 and 2022.",
    "xLabel": "Year",
    "yLabel": "Percentage (%)",
    "data": {
      "labels": [
        "2010",
        "2014",
        "2018",
        "2022"
      ],
      "series": [
        {
          "name": "16-24",
          "values": [
            92,
            98,
            99,
            99
          ],
          "color": "#5BB83F"
        },
        {
          "name": "25-44",
          "values": [
            85,
            93,
            97,
            98
          ],
          "color": "#4ECDC4"
        },
        {
          "name": "45-64",
          "values": [
            52,
            68,
            82,
            91
          ],
          "color": "#FFE66D"
        },
        {
          "name": "65+",
          "values": [
            18,
            28,
            45,
            62
          ],
          "color": "#FF6B6B"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which age group had the lowest internet usage in 2010?",
            "options": [
              "16-24",
              "25-44",
              "45-64",
              "65+"
            ],
            "answer": "65+"
          },
          {
            "question": "Which age group experienced the fastest growth in internet usage?",
            "options": [
              "16-24",
              "25-44",
              "45-64",
              "65+"
            ],
            "answer": "65+"
          },
          {
            "question": "Which age group had the highest internet usage in 2022?",
            "options": [
              "16-24",
              "25-44",
              "45-64",
              "65+"
            ],
            "answer": "16-24"
          },
          {
            "question": "By how many percentage points did the 65+ group grow from 2010 to 2022?",
            "options": [
              "About 20",
              "About 44",
              "About 62",
              "About 80"
            ],
            "answer": "About 44"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Internet usage for 65+ _____ from 18% to 62%.",
            "options": [
              "surged",
              "declined",
              "remained",
              "dropped"
            ],
            "answer": "surged"
          },
          {
            "sentence": "The gap between youngest and oldest groups _____ significantly.",
            "options": [
              "narrowed",
              "widened",
              "doubled",
              "disappeared"
            ],
            "answer": "narrowed"
          },
          {
            "sentence": "Internet usage among 16-24 was already _____ at 92% in 2010.",
            "options": [
              "high",
              "low",
              "average",
              "declining"
            ],
            "answer": "high"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "The 65+ age group experienced _____ growth in internet usage.",
            "options": [
              "the fastest",
              "the slowest",
              "no significant",
              "a slight"
            ],
            "answer": "the fastest"
          },
          {
            "sentence": "By 2022, usage among 45-64 had risen _____.",
            "options": [
              "to 91%",
              "to 62%",
              "to 98%",
              "to 82%"
            ],
            "answer": "to 91%"
          },
          {
            "sentence": "The youngest group remained _____ 99% between 2018 and 2022.",
            "options": [
              "stable at",
              "declining to",
              "rising to",
              "below"
            ],
            "answer": "stable at"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Usage for the 65+ group _____ more than threefold over the period.",
            "options": [
              "increased",
              "has increased",
              "had increased"
            ],
            "answer": "increased"
          },
          {
            "sentence": "By 2022, the gap between all age groups _____ considerably.",
            "options": [
              "had narrowed",
              "narrowed",
              "was narrowing"
            ],
            "answer": "had narrowed"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "The 65+ group experienced the fastest growth in internet usage",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "The 16-24 group already exceeded 90% usage in 2010",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "All age groups declined between 2014 and 2018",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "By 2022 the gap between age groups had narrowed",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "The 45-64 group overtook 25-44 by 2022",
            "isCorrect": false
          }
        ],
        "overviewText": "Overall, internet usage increased across all groups, with 65+ showing the most dramatic growth, while the gap between youngest and oldest users narrowed considerably."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "The",
              "65+",
              "group",
              "saw",
              "the",
              "fastest",
              "growth",
              "from",
              "18%",
              "to",
              "62%"
            ],
            "targetSentence": "The 65+ group saw the fastest growth from 18% to 62%."
          }
        ]
      }
    }
  },
  {
    "id": "bar-1",
    "type": "bar",
    "title": "Top 6 Countries by Renewable Energy Production (2022)",
    "question": "The bar chart below shows the top six countries in terms of renewable energy production in terawatt-hours (TWh) for 2022.",
    "xLabel": "Country",
    "yLabel": "TWh",
    "data": {
      "labels": [
        "China",
        "USA",
        "Brazil",
        "India",
        "Germany",
        "Japan"
      ],
      "values": [
        2850,
        1200,
        680,
        520,
        350,
        280
      ],
      "color": "#5BB83F"
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which country produced the most renewable energy?",
            "options": [
              "China",
              "USA",
              "Brazil",
              "India"
            ],
            "answer": "China"
          },
          {
            "question": "Approximately how much did the USA produce in TWh?",
            "options": [
              "About 2,850",
              "About 1,200",
              "About 680",
              "About 520"
            ],
            "answer": "About 1,200"
          },
          {
            "question": "China produced roughly how many times as much as Japan?",
            "options": [
              "About 5×",
              "About 10×",
              "About 15×",
              "About 20×"
            ],
            "answer": "About 10×"
          },
          {
            "question": "Which country produced the least?",
            "options": [
              "Germany",
              "Japan",
              "India",
              "Brazil"
            ],
            "answer": "Japan"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "China was the _____ producer of renewable energy.",
            "options": [
              "leading",
              "smallest",
              "average",
              "moderate"
            ],
            "answer": "leading"
          },
          {
            "sentence": "The USA produced the _____ amount after China.",
            "options": [
              "second highest",
              "lowest",
              "same",
              "third highest"
            ],
            "answer": "second highest"
          },
          {
            "sentence": "Japan _____ the least at 280 TWh.",
            "options": [
              "generated",
              "consumed",
              "imported",
              "exported"
            ],
            "answer": "generated"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "China produced _____ renewable energy among the six nations.",
            "options": [
              "by far the most",
              "slightly more",
              "the same as",
              "considerably less"
            ],
            "answer": "by far the most"
          },
          {
            "sentence": "China's production was more than double _____ the USA.",
            "options": [
              "that of",
              "than",
              "compared with",
              "as much as"
            ],
            "answer": "that of"
          },
          {
            "sentence": "Germany and Japan were the two _____ producers.",
            "options": [
              "smallest",
              "largest",
              "fastest-growing",
              "most efficient"
            ],
            "answer": "smallest"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "China _____ the highest amount at 2,850 TWh.",
            "options": [
              "generated",
              "generates",
              "had generated"
            ],
            "answer": "generated"
          },
          {
            "sentence": "The USA, _____ ranked second, produced 1,200 TWh.",
            "options": [
              "which",
              "who",
              "where"
            ],
            "answer": "which"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "China's renewable energy production far exceeded all other countries",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "The USA produced less than half of China's output",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Japan produced the least among the six countries",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Germany produced more than Brazil",
            "isCorrect": false
          },
          {
            "id": "e",
            "text": "The gap between the highest and lowest was approximately tenfold",
            "isCorrect": true
          }
        ],
        "overviewText": "Overall, China was by far the largest producer, while the USA ranked a distant second, and Japan produced the least among the six countries."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "China",
              "produced",
              "by",
              "far",
              "the",
              "most",
              "renewable",
              "energy",
              "at",
              "2,850",
              "TWh"
            ],
            "targetSentence": "China produced by far the most renewable energy at 2,850 TWh."
          }
        ]
      }
    }
  },
  {
    "id": "bar-2",
    "type": "bar",
    "title": "University Enrolment by Faculty (2023)",
    "question": "The bar chart below shows the number of students enrolled in different faculties at a major university in 2023.",
    "xLabel": "Faculty",
    "yLabel": "Number of Students",
    "data": {
      "labels": [
        "Engineering",
        "Business",
        "Arts",
        "Science",
        "Medicine",
        "Law"
      ],
      "values": [
        4200,
        3800,
        2100,
        2900,
        1800,
        1500
      ],
      "color": "#4ECDC4"
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which faculty had the highest enrolment?",
            "options": [
              "Engineering",
              "Business",
              "Science",
              "Medicine"
            ],
            "answer": "Engineering"
          },
          {
            "question": "Approximately how many students enrolled in Law?",
            "options": [
              "About 4,200",
              "About 3,800",
              "About 2,100",
              "About 1,500"
            ],
            "answer": "About 1,500"
          },
          {
            "question": "Engineering enrolled roughly how many times as many as Law?",
            "options": [
              "About 2×",
              "About 2.8×",
              "About 3.5×",
              "About 5×"
            ],
            "answer": "About 2.8×"
          },
          {
            "question": "Which faculty ranked third?",
            "options": [
              "Business",
              "Science",
              "Arts",
              "Medicine"
            ],
            "answer": "Science"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Engineering _____ the highest enrolment at 4,200.",
            "options": [
              "recorded",
              "declined",
              "averaged",
              "estimated"
            ],
            "answer": "recorded"
          },
          {
            "sentence": "Law had the _____ number of students at just 1,500.",
            "options": [
              "smallest",
              "largest",
              "average",
              "growing"
            ],
            "answer": "smallest"
          },
          {
            "sentence": "Engineering and Business _____ the figures.",
            "options": [
              "dominated",
              "trailed",
              "shared",
              "divided"
            ],
            "answer": "dominated"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Engineering had the highest, _____ by Business with 3,800.",
            "options": [
              "followed",
              "led",
              "exceeded",
              "preceded"
            ],
            "answer": "followed"
          },
          {
            "sentence": "Engineering was almost _____ that of Law.",
            "options": [
              "three times",
              "twice",
              "half of",
              "equal to"
            ],
            "answer": "three times"
          },
          {
            "sentence": "Arts and Medicine had _____ numbers than Science.",
            "options": [
              "lower",
              "higher",
              "similar",
              "equal"
            ],
            "answer": "lower"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Engineering _____ the most popular with 4,200 students.",
            "options": [
              "was",
              "is",
              "has been"
            ],
            "answer": "was"
          },
          {
            "sentence": "Law, _____ had the lowest, attracted only 1,500.",
            "options": [
              "which",
              "who",
              "what"
            ],
            "answer": "which"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "Engineering had the highest enrolment",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Law had less than half the enrolment of Engineering",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Business enrolled more than Science",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Medicine enrolled more than Law",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "Arts had the lowest enrolment among all faculties",
            "isCorrect": false
          }
        ],
        "overviewText": "Overall, Engineering and Business were the two most popular disciplines, while Law attracted the fewest students among the six fields of study."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Engineering",
              "had",
              "the",
              "highest",
              "enrolment",
              "at",
              "4,200",
              "followed",
              "by",
              "Business",
              "at",
              "3,800"
            ],
            "targetSentence": "Engineering had the highest enrolment at 4,200 followed by Business at 3,800."
          }
        ]
      }
    }
  },
  {
    "id": "bar-3",
    "type": "bar",
    "title": "Monthly Rainfall in Six Cities (mm)",
    "question": "The bar chart below compares the average monthly rainfall in millimetres across six major cities.",
    "xLabel": "City",
    "yLabel": "Rainfall (mm)",
    "data": {
      "labels": [
        "Mumbai",
        "London",
        "Singapore",
        "Sydney",
        "Cairo",
        "Toronto"
      ],
      "values": [
        220,
        65,
        240,
        85,
        5,
        75
      ],
      "color": "#A78BFA"
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which city had the highest monthly rainfall?",
            "options": [
              "Mumbai",
              "London",
              "Singapore",
              "Sydney"
            ],
            "answer": "Singapore"
          },
          {
            "question": "Approximately how much rainfall did Cairo receive?",
            "options": [
              "About 5mm",
              "About 65mm",
              "About 85mm",
              "About 220mm"
            ],
            "answer": "About 5mm"
          },
          {
            "question": "Which city received almost no rainfall?",
            "options": [
              "London",
              "Toronto",
              "Cairo",
              "Sydney"
            ],
            "answer": "Cairo"
          },
          {
            "question": "What was the approximate difference between Mumbai and Singapore?",
            "options": [
              "About 20mm",
              "About 65mm",
              "About 155mm",
              "About 240mm"
            ],
            "answer": "About 20mm"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Cairo received a _____ amount of rainfall at 5mm.",
            "options": [
              "negligible",
              "significant",
              "moderate",
              "substantial"
            ],
            "answer": "negligible"
          },
          {
            "sentence": "Singapore _____ the highest monthly rainfall.",
            "options": [
              "recorded",
              "avoided",
              "predicted",
              "reduced"
            ],
            "answer": "recorded"
          },
          {
            "sentence": "Mumbai and Singapore received _____ more than other cities.",
            "options": [
              "substantially",
              "slightly",
              "marginally",
              "barely"
            ],
            "answer": "substantially"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Cairo received _____ rainfall among all six cities.",
            "options": [
              "the least",
              "the most",
              "a moderate",
              "an unpredictable"
            ],
            "answer": "the least"
          },
          {
            "sentence": "Singapore had _____ of 240mm, the highest.",
            "options": [
              "a monthly total",
              "a daily average",
              "an annual figure",
              "a weekly reading"
            ],
            "answer": "a monthly total"
          },
          {
            "sentence": "Mumbai's was more than _____ Sydney's.",
            "options": [
              "twice that of",
              "the same as",
              "half of",
              "ten times"
            ],
            "answer": "twice that of"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Singapore _____ 240mm while Cairo _____ only 5mm.",
            "options": [
              "recorded / recorded",
              "recorded / had recorded",
              "records / recorded"
            ],
            "answer": "recorded / recorded"
          },
          {
            "sentence": "Mumbai, _____ 220mm, was second wettest.",
            "options": [
              "with",
              "which",
              "where"
            ],
            "answer": "with"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "Singapore recorded the highest monthly rainfall",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Cairo received almost no rainfall",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "London received more than Toronto",
            "isCorrect": false
          },
          {
            "id": "d",
            "text": "Mumbai received more than twice Sydney's rainfall",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "The gap between highest and lowest was about 235mm",
            "isCorrect": true
          }
        ],
        "overviewText": "Overall, Singapore and Mumbai received the highest rainfall, while Cairo recorded a negligible figure, highlighting a significant disparity among the cities."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Singapore",
              "had",
              "the",
              "highest",
              "rainfall",
              "at",
              "240mm",
              "while",
              "Cairo",
              "had",
              "just",
              "5mm"
            ],
            "targetSentence": "Singapore had the highest rainfall at 240mm while Cairo had just 5mm."
          }
        ]
      }
    }
  },
  {
    "id": "pie-1",
    "type": "pie",
    "title": "Global Energy Consumption by Source (2021)",
    "question": "The pie chart below illustrates the distribution of global energy consumption by different sources in 2021.",
    "data": {
      "segments": [
        {
          "label": "Oil",
          "value": 31,
          "color": "#FF6B6B"
        },
        {
          "label": "Coal",
          "value": 27,
          "color": "#4ECDC4"
        },
        {
          "label": "Natural Gas",
          "value": 24,
          "color": "#FFE66D"
        },
        {
          "label": "Nuclear",
          "value": 4,
          "color": "#A78BFA"
        },
        {
          "label": "Hydro",
          "value": 7,
          "color": "#5BB83F"
        },
        {
          "label": "Other Renewables",
          "value": 7,
          "color": "#F472B6"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which energy source had the largest share?",
            "options": [
              "Oil",
              "Coal",
              "Natural Gas",
              "Nuclear"
            ],
            "answer": "Oil"
          },
          {
            "question": "What was the combined share of fossil fuels?",
            "options": [
              "About 72%",
              "About 77%",
              "About 82%",
              "About 87%"
            ],
            "answer": "About 82%"
          },
          {
            "question": "Which energy source had the smallest share?",
            "options": [
              "Nuclear",
              "Hydro",
              "Other Renewables",
              "Natural Gas"
            ],
            "answer": "Nuclear"
          },
          {
            "question": "What percentage did coal account for?",
            "options": [
              "24%",
              "27%",
              "31%",
              "7%"
            ],
            "answer": "27%"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Oil _____ the largest share at 31%.",
            "options": [
              "accounted for",
              "declined to",
              "exceeded",
              "merged with"
            ],
            "answer": "accounted for"
          },
          {
            "sentence": "Nuclear power had the _____ share at just 4%.",
            "options": [
              "smallest",
              "largest",
              "average",
              "growing"
            ],
            "answer": "smallest"
          },
          {
            "sentence": "Fossil fuels _____ the energy mix with 82%.",
            "options": [
              "dominated",
              "trailed",
              "equalled",
              "divided"
            ],
            "answer": "dominated"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Oil, coal, and natural gas together _____ energy consumption.",
            "options": [
              "constituted the majority of",
              "formed a minority of",
              "were irrelevant to",
              "had no impact on"
            ],
            "answer": "constituted the majority of"
          },
          {
            "sentence": "Nuclear energy was _____ energy source.",
            "options": [
              "the least used",
              "the most popular",
              "a rapidly growing",
              "an average"
            ],
            "answer": "the least used"
          },
          {
            "sentence": "Hydro and other renewables each accounted for _____.",
            "options": [
              "7% of the total",
              "24% of the total",
              "31% of the total",
              "4% of the total"
            ],
            "answer": "7% of the total"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Fossil fuels _____ 82% of global energy consumption.",
            "options": [
              "made up",
              "make up",
              "will make up"
            ],
            "answer": "made up"
          },
          {
            "sentence": "Nuclear, _____ was the smallest source, contributed only 4%.",
            "options": [
              "which",
              "who",
              "where"
            ],
            "answer": "which"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "Oil was the single largest energy source",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Renewable energy combined exceeded fossil fuels",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Nuclear power accounted for only 4%",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Fossil fuels held a dominant position",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "Natural gas had a larger share than coal",
            "isCorrect": false
          }
        ],
        "overviewText": "Overall, fossil fuels dominated global energy consumption, accounting for 82% of the total, while nuclear power represented the smallest share at just 4%."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Fossil",
              "fuels",
              "accounted",
              "for",
              "82%",
              "of",
              "global",
              "energy",
              "consumption",
              "in",
              "2021"
            ],
            "targetSentence": "Fossil fuels accounted for 82% of global energy consumption in 2021."
          }
        ]
      }
    }
  },
  {
    "id": "pie-2",
    "type": "pie",
    "title": "Household Expenditure Breakdown (2022)",
    "question": "The pie chart below shows how an average household spent its monthly income across different categories in 2022.",
    "data": {
      "segments": [
        {
          "label": "Housing",
          "value": 35,
          "color": "#FF6B6B"
        },
        {
          "label": "Food",
          "value": 22,
          "color": "#5BB83F"
        },
        {
          "label": "Transport",
          "value": 15,
          "color": "#4ECDC4"
        },
        {
          "label": "Healthcare",
          "value": 10,
          "color": "#FFE66D"
        },
        {
          "label": "Education",
          "value": 8,
          "color": "#A78BFA"
        },
        {
          "label": "Entertainment",
          "value": 10,
          "color": "#F472B6"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which category had the largest expenditure?",
            "options": [
              "Food",
              "Housing",
              "Transport",
              "Healthcare"
            ],
            "answer": "Housing"
          },
          {
            "question": "What percentage did food account for?",
            "options": [
              "15%",
              "22%",
              "28%",
              "35%"
            ],
            "answer": "22%"
          },
          {
            "question": "Which two categories each accounted for exactly 10%?",
            "options": [
              "Food and Transport",
              "Healthcare and Entertainment",
              "Education and Housing",
              "Transport and Food"
            ],
            "answer": "Healthcare and Entertainment"
          },
          {
            "question": "What was the combined share of education and healthcare?",
            "options": [
              "8%",
              "10%",
              "15%",
              "18%"
            ],
            "answer": "18%"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Housing was the _____ expense at 35%.",
            "options": [
              "largest",
              "smallest",
              "average",
              "moderate"
            ],
            "answer": "largest"
          },
          {
            "sentence": "Education _____ the smallest share at 8%.",
            "options": [
              "constituted",
              "exceeded",
              "doubled",
              "declined"
            ],
            "answer": "constituted"
          },
          {
            "sentence": "Housing and food together _____ over half the budget.",
            "options": [
              "accounted for",
              "fell below",
              "were irrelevant to",
              "declined to"
            ],
            "answer": "accounted for"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Housing was _____ category at 35%.",
            "options": [
              "the dominant",
              "a minor",
              "an average",
              "the smallest"
            ],
            "answer": "the dominant"
          },
          {
            "sentence": "Housing and food combined _____ of total expenditure.",
            "options": [
              "accounted for 57%",
              "made up 15%",
              "represented 8%",
              "fell to 10%"
            ],
            "answer": "accounted for 57%"
          },
          {
            "sentence": "Healthcare and entertainment each _____ 10% of the budget.",
            "options": [
              "represented",
              "exceeded",
              "declined to",
              "doubled"
            ],
            "answer": "represented"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Housing _____ the largest proportion at 35%.",
            "options": [
              "represented",
              "represents",
              "will represent"
            ],
            "answer": "represented"
          },
          {
            "sentence": "Education, _____ was the smallest, accounted for 8%.",
            "options": [
              "which",
              "who",
              "where"
            ],
            "answer": "which"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "Housing was the largest expenditure category",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Education accounted for the smallest share",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Housing and food together accounted for over half",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Transport exceeded food in share",
            "isCorrect": false
          },
          {
            "id": "e",
            "text": "Healthcare and entertainment combined exceeded education",
            "isCorrect": true
          }
        ],
        "overviewText": "Overall, housing was the largest expenditure category at 35%, while housing and food together accounted for over half of the total household budget."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Housing",
              "was",
              "the",
              "largest",
              "expenditure",
              "at",
              "35%",
              "followed",
              "by",
              "food",
              "at",
              "22%"
            ],
            "targetSentence": "Housing was the largest expenditure at 35% followed by food at 22%."
          }
        ]
      }
    }
  },
  {
    "id": "pie-3",
    "type": "pie",
    "title": "Water Usage by Sector in Australia (2020)",
    "question": "The pie chart below illustrates how water was consumed across different sectors in Australia during 2020.",
    "data": {
      "segments": [
        {
          "label": "Agriculture",
          "value": 62,
          "color": "#5BB83F"
        },
        {
          "label": "Household",
          "value": 14,
          "color": "#4ECDC4"
        },
        {
          "label": "Industry",
          "value": 12,
          "color": "#FF6B6B"
        },
        {
          "label": "Mining",
          "value": 7,
          "color": "#FFE66D"
        },
        {
          "label": "Other",
          "value": 5,
          "color": "#A78BFA"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which sector consumed the most water?",
            "options": [
              "Agriculture",
              "Household",
              "Industry",
              "Mining"
            ],
            "answer": "Agriculture"
          },
          {
            "question": "What percentage did household consumption account for?",
            "options": [
              "7%",
              "12%",
              "14%",
              "62%"
            ],
            "answer": "14%"
          },
          {
            "question": "Agriculture used roughly how many times as much as Industry?",
            "options": [
              "About 3×",
              "About 5×",
              "About 8×",
              "About 10×"
            ],
            "answer": "About 5×"
          },
          {
            "question": "What was the combined share of Mining and Other?",
            "options": [
              "7%",
              "12%",
              "17%",
              "19%"
            ],
            "answer": "12%"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Agriculture _____ the water usage at 62%.",
            "options": [
              "dominated",
              "trailed",
              "equalled",
              "declined"
            ],
            "answer": "dominated"
          },
          {
            "sentence": "Mining and Other sectors were the _____ contributors.",
            "options": [
              "smallest",
              "largest",
              "fastest",
              "most stable"
            ],
            "answer": "smallest"
          },
          {
            "sentence": "Household and Industry _____ similar amounts.",
            "options": [
              "consumed",
              "declined",
              "exported",
              "stored"
            ],
            "answer": "consumed"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Agriculture was _____ water consumption in Australia.",
            "options": [
              "responsible for most",
              "a minor part of",
              "not involved in",
              "the smallest part of"
            ],
            "answer": "responsible for most"
          },
          {
            "sentence": "Household and Industry together _____ 26% of water usage.",
            "options": [
              "accounted for",
              "fell below",
              "exceeded",
              "doubled"
            ],
            "answer": "accounted for"
          },
          {
            "sentence": "Mining used _____ water than the Other category.",
            "options": [
              "slightly more",
              "significantly less",
              "twice the",
              "the same"
            ],
            "answer": "slightly more"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Agriculture _____ 62% of total water consumption.",
            "options": [
              "represented",
              "represents",
              "will represent"
            ],
            "answer": "represented"
          },
          {
            "sentence": "Other sectors, _____ was the smallest, accounted for 5%.",
            "options": [
              "which",
              "who",
              "where"
            ],
            "answer": "which"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "Agriculture was the largest consumer of water",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Industry consumed more water than households",
            "isCorrect": false
          },
          {
            "id": "c",
            "text": "Agriculture held the dominant share",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Mining and Other combined accounted for only 12%",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "Household consumption was about five times that of Industry",
            "isCorrect": false
          }
        ],
        "overviewText": "Overall, agriculture dominated water consumption in Australia at 62%, with household and industry contributing substantially less at 14% and 12% respectively."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Agriculture",
              "accounted",
              "for",
              "62%",
              "of",
              "water",
              "consumption",
              "in",
              "Australia"
            ],
            "targetSentence": "Agriculture accounted for 62% of water consumption in Australia."
          }
        ]
      }
    }
  },
  {
    "id": "table-1",
    "type": "table",
    "title": "World's Most Spoken Languages (2023)",
    "question": "The table below shows the number of native and total speakers for the world's six most spoken languages in 2023.",
    "data": {
      "headers": [
        "Language",
        "Native Speakers (M)",
        "Total Speakers (M)",
        "Primary Countries"
      ],
      "rows": [
        [
          "English",
          "380",
          "1450",
          "UK, USA, Australia, Canada"
        ],
        [
          "Mandarin",
          "940",
          "1130",
          "China, Taiwan, Singapore"
        ],
        [
          "Hindi",
          "345",
          "610",
          "India, Fiji"
        ],
        [
          "Spanish",
          "485",
          "560",
          "Spain, Mexico, Argentina"
        ],
        [
          "French",
          "80",
          "310",
          "France, Canada, Belgium"
        ],
        [
          "Arabic",
          "315",
          "420",
          "Egypt, Saudi Arabia, UAE"
        ]
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which language had the most native speakers?",
            "options": [
              "English",
              "Mandarin",
              "Hindi",
              "Spanish"
            ],
            "answer": "Mandarin"
          },
          {
            "question": "Which language had the most total speakers?",
            "options": [
              "English",
              "Mandarin",
              "Hindi",
              "Spanish"
            ],
            "answer": "English"
          },
          {
            "question": "Which language had the fewest native speakers?",
            "options": [
              "French",
              "Arabic",
              "Hindi",
              "Spanish"
            ],
            "answer": "French"
          },
          {
            "question": "How many native speakers did Spanish have?",
            "options": [
              "345M",
              "380M",
              "485M",
              "940M"
            ],
            "answer": "485M"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Mandarin had the _____ number of native speakers.",
            "options": [
              "largest",
              "smallest",
              "average",
              "declining"
            ],
            "answer": "largest"
          },
          {
            "sentence": "English had the highest number of _____ speakers.",
            "options": [
              "total",
              "native",
              "secondary",
              "primary"
            ],
            "answer": "total"
          },
          {
            "sentence": "French had the _____ number of native speakers.",
            "options": [
              "fewest",
              "most",
              "average",
              "growing"
            ],
            "answer": "fewest"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Mandarin had _____ native speakers among the six languages.",
            "options": [
              "the most",
              "the fewest",
              "an average number of",
              "a declining number of"
            ],
            "answer": "the most"
          },
          {
            "sentence": "English was _____ by 1,450 million people.",
            "options": [
              "spoken",
              "written",
              "learned",
              "avoided"
            ],
            "answer": "spoken"
          },
          {
            "sentence": "French had only 80 million native speakers, _____ English.",
            "options": [
              "far fewer than",
              "more than",
              "the same as",
              "slightly less than"
            ],
            "answer": "far fewer than"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "English _____ by 1,450 million people worldwide.",
            "options": [
              "was spoken",
              "is spoken",
              "will be spoken"
            ],
            "answer": "was spoken"
          },
          {
            "sentence": "Mandarin, _____ had 940 million native speakers, led this category.",
            "options": [
              "which",
              "who",
              "where"
            ],
            "answer": "which"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "English had the highest total number of speakers",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Mandarin had the most native speakers",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "French had the fewest native speakers",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Hindi had more total speakers than Spanish",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "Arabic had more native speakers than English",
            "isCorrect": false
          }
        ],
        "overviewText": "Overall, while Mandarin had the most native speakers, English had the highest total number of speakers, and French had the fewest native speakers among the six languages."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Mandarin",
              "had",
              "the",
              "most",
              "native",
              "speakers",
              "while",
              "English",
              "led",
              "in",
              "total",
              "speakers"
            ],
            "targetSentence": "Mandarin had the most native speakers while English led in total speakers."
          }
        ]
      }
    }
  },
  {
    "id": "table-2",
    "type": "table",
    "title": "Smartphone Market Share by Brand (Q4 2023)",
    "question": "The table below compares the global smartphone market share, units shipped, and year-on-year growth of the top five brands in Q4 2023.",
    "data": {
      "headers": [
        "Brand",
        "Market Share (%)",
        "Units Shipped (M)",
        "YoY Growth (%)"
      ],
      "rows": [
        [
          "Apple",
          "24",
          "80.5",
          "+11"
        ],
        [
          "Samsung",
          "18",
          "60.2",
          "-9"
        ],
        [
          "Xiaomi",
          "13",
          "43.8",
          "+23"
        ],
        [
          "Oppo",
          "9",
          "30.1",
          "+8"
        ],
        [
          "Vivo",
          "8",
          "27.5",
          "+5"
        ]
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which brand held the largest market share?",
            "options": [
              "Apple",
              "Samsung",
              "Xiaomi",
              "Oppo"
            ],
            "answer": "Apple"
          },
          {
            "question": "Which brand had the fastest year-on-year growth?",
            "options": [
              "Apple",
              "Samsung",
              "Xiaomi",
              "Vivo"
            ],
            "answer": "Xiaomi"
          },
          {
            "question": "What was Samsung's year-on-year growth?",
            "options": [
              "+11%",
              "-9%",
              "+23%",
              "+8%"
            ],
            "answer": "-9%"
          },
          {
            "question": "What was Vivo's market share?",
            "options": [
              "8%",
              "9%",
              "13%",
              "24%"
            ],
            "answer": "8%"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Apple _____ the market with 24% share.",
            "options": [
              "led",
              "trailed",
              "equalled",
              "declined"
            ],
            "answer": "led"
          },
          {
            "sentence": "Samsung experienced a _____ in growth.",
            "options": [
              "decline",
              "surge",
              "stability",
              "doubling"
            ],
            "answer": "decline"
          },
          {
            "sentence": "Xiaomi showed the _____ growth at +23%.",
            "options": [
              "fastest",
              "slowest",
              "most stable",
              "weakest"
            ],
            "answer": "fastest"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "Apple had the largest share, _____ Samsung at 18%.",
            "options": [
              "followed by",
              "led by",
              "exceeding",
              "competing with"
            ],
            "answer": "followed by"
          },
          {
            "sentence": "Xiaomi experienced _____ growth among the five brands.",
            "options": [
              "the most significant",
              "the least",
              "no",
              "an average"
            ],
            "answer": "the most significant"
          },
          {
            "sentence": "Samsung was the only brand to show _____.",
            "options": [
              "a decline",
              "an increase",
              "stability",
              "growth"
            ],
            "answer": "a decline"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Apple _____ the largest market share at 24%.",
            "options": [
              "held",
              "holds",
              "will hold"
            ],
            "answer": "held"
          },
          {
            "sentence": "Xiaomi, _____ grew 23%, was the fastest growing brand.",
            "options": [
              "which",
              "who",
              "where"
            ],
            "answer": "which"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "Apple held the largest market share",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Samsung was the only brand with negative growth",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Xiaomi recorded the highest growth rate",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Oppo's share exceeded Vivo's",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "All brands showed positive growth",
            "isCorrect": false
          }
        ],
        "overviewText": "Overall, Apple led the market with the highest share, while Xiaomi recorded the fastest growth, and Samsung was the only brand to experience a decline in year-on-year growth."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "Apple",
              "held",
              "the",
              "largest",
              "market",
              "share",
              "at",
              "24%",
              "while",
              "Xiaomi",
              "grew",
              "fastest"
            ],
            "targetSentence": "Apple held the largest market share at 24% while Xiaomi grew fastest."
          }
        ]
      }
    }
  },
  {
    "id": "table-3",
    "type": "table",
    "title": "Olympic Medal Table - Top 5 Countries (2024)",
    "question": "The table below shows the medal counts for the top five performing countries at the 2024 Olympic Games.",
    "data": {
      "headers": [
        "Country",
        "Gold",
        "Silver",
        "Bronze",
        "Total"
      ],
      "rows": [
        [
          "United States",
          "40",
          "44",
          "42",
          "126"
        ],
        [
          "China",
          "40",
          "27",
          "24",
          "91"
        ],
        [
          "Japan",
          "20",
          "12",
          "13",
          "45"
        ],
        [
          "Australia",
          "18",
          "19",
          "16",
          "53"
        ],
        [
          "France",
          "16",
          "26",
          "22",
          "64"
        ]
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which country won the most gold medals?",
            "options": [
              "United States",
              "China",
              "Japan",
              "Australia"
            ],
            "answer": "United States"
          },
          {
            "question": "Which country won the most total medals?",
            "options": [
              "United States",
              "China",
              "France",
              "Australia"
            ],
            "answer": "United States"
          },
          {
            "question": "How many gold medals did China win?",
            "options": [
              "40",
              "27",
              "24",
              "91"
            ],
            "answer": "40"
          },
          {
            "question": "Which country had the fewest total medals?",
            "options": [
              "Japan",
              "Australia",
              "France",
              "China"
            ],
            "answer": "Japan"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "The USA and China were _____ on gold medals.",
            "options": [
              "tied",
              "divided",
              "separated",
              "competing"
            ],
            "answer": "tied"
          },
          {
            "sentence": "The USA won the _____ total number of medals.",
            "options": [
              "highest",
              "lowest",
              "average",
              "declining"
            ],
            "answer": "highest"
          },
          {
            "sentence": "Japan won the _____ number of medals overall.",
            "options": [
              "fewest",
              "most",
              "second highest",
              "growing"
            ],
            "answer": "fewest"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "The USA and China each won 40 gold medals, _____ first place.",
            "options": [
              "tying for",
              "dividing",
              "competing for",
              "falling from"
            ],
            "answer": "tying for"
          },
          {
            "sentence": "The USA's total of 126 was _____ China's 91.",
            "options": [
              "significantly higher than",
              "slightly lower than",
              "the same as",
              "far below"
            ],
            "answer": "significantly higher than"
          },
          {
            "sentence": "France had a higher total _____ Australia.",
            "options": [
              "despite fewer golds than",
              "because of more golds than",
              "equal to",
              "similar to"
            ],
            "answer": "despite fewer golds than"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "The USA _____ the most medals at 126.",
            "options": [
              "won",
              "wins",
              "had won"
            ],
            "answer": "won"
          },
          {
            "sentence": "Japan, _____ total was 45, ranked last among the five.",
            "options": [
              "whose",
              "who",
              "which"
            ],
            "answer": "whose"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "The USA and China tied for the most gold medals",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "The USA won the highest total number of medals",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Japan had the fewest total medals",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "France's total medal count exceeded Australia's",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "China won the most total medals",
            "isCorrect": false
          }
        ],
        "overviewText": "Overall, the USA and China tied for the most gold medals, but the USA led in total medals by a significant margin, while Japan ranked lowest."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "The",
              "USA",
              "and",
              "China",
              "tied",
              "for",
              "most",
              "gold",
              "medals",
              "with",
              "40",
              "each"
            ],
            "targetSentence": "The USA and China tied for most gold medals with 40 each."
          }
        ]
      }
    }
  },
  {
    "id": "map-1",
    "type": "map",
    "title": "Town Centre Development (1990 vs 2020)",
    "question": "The maps below show the layout of a town centre in 1990 and how it had changed by 2020.",
    "data": {
      "nodes": [
        {
          "id": "park",
          "label": "Park",
          "x": 120,
          "y": 60,
          "width": 120,
          "height": 60,
          "color": "#A8E6CF"
        },
        {
          "id": "library",
          "label": "Library",
          "x": 40,
          "y": 140,
          "width": 80,
          "height": 50,
          "color": "#FFE0B2"
        },
        {
          "id": "shops",
          "label": "Shops",
          "x": 40,
          "y": 220,
          "width": 80,
          "height": 50,
          "color": "#FFCCBC"
        },
        {
          "id": "hotel",
          "label": "Hotel",
          "x": 280,
          "y": 140,
          "width": 80,
          "height": 50,
          "color": "#BBDEFB"
        },
        {
          "id": "station",
          "label": "Station",
          "x": 280,
          "y": 220,
          "width": 80,
          "height": 50,
          "color": "#E1BEE7"
        },
        {
          "id": "mall",
          "label": "Shopping Mall",
          "x": 120,
          "y": 300,
          "width": 120,
          "height": 60,
          "color": "#C5CAE9"
        }
      ],
      "edges": [
        {
          "from": "park",
          "to": "library",
          "label": "Main Road"
        },
        {
          "from": "park",
          "to": "hotel",
          "label": "Main Road"
        },
        {
          "from": "shops",
          "to": "station",
          "label": "Bridge"
        },
        {
          "from": "shops",
          "to": "mall",
          "label": "High Street"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "What is the central feature of the town centre?",
            "options": [
              "Park",
              "Library",
              "Shops",
              "Hotel"
            ],
            "answer": "Park"
          },
          {
            "question": "How many main roads extend from the Park?",
            "options": [
              "1",
              "2",
              "3",
              "4"
            ],
            "answer": "2"
          },
          {
            "question": "What connects the Shops and the Station?",
            "options": [
              "Bridge",
              "Tunnel",
              "Main Road",
              "Footpath"
            ],
            "answer": "Bridge"
          },
          {
            "question": "Which road links the Shops and the Shopping Mall?",
            "options": [
              "Main Road",
              "High Street",
              "Bridge Road",
              "Park Lane"
            ],
            "answer": "High Street"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "The Park is _____ in the centre of the town.",
            "options": [
              "located",
              "built",
              "placed",
              "found"
            ],
            "answer": "located"
          },
          {
            "sentence": "The Shops are connected to the Station by a _____.",
            "options": [
              "bridge",
              "road",
              "tunnel",
              "path"
            ],
            "answer": "bridge"
          },
          {
            "sentence": "Two main _____ extend from the Park.",
            "options": [
              "roads",
              "paths",
              "streets",
              "lanes"
            ],
            "answer": "roads"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "The Park serves as the _____ of the town centre.",
            "options": [
              "central connecting point",
              "main shopping area",
              "public transport hub",
              "residential district"
            ],
            "answer": "central connecting point"
          },
          {
            "sentence": "The Shops and Shopping Mall are linked by _____.",
            "options": [
              "High Street",
              "Main Road",
              "a footbridge",
              "the railway"
            ],
            "answer": "High Street"
          },
          {
            "sentence": "The Library and Hotel are situated along the _____.",
            "options": [
              "Main Road",
              "High Street",
              "Bridge Road",
              "Park Avenue"
            ],
            "answer": "Main Road"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "A bridge _____ the Shops to the Station.",
            "options": [
              "connects",
              "separates",
              "divides",
              "transforms"
            ],
            "answer": "connects"
          },
          {
            "sentence": "The Park is _____ at the centre of the town.",
            "options": [
              "located",
              "planned",
              "removed",
              "expanded"
            ],
            "answer": "located"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "The Park is located at the centre of the town",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Two main roads extend from the Park",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "A bridge connects the Shops to the Station",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "High Street links the Shops and the Shopping Mall",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "The Station is directly connected to the Park",
            "isCorrect": false
          }
        ],
        "overviewText": "The town centre is organised around a central Park, from which two Main Roads extend, while the Shops are connected to the Station via a bridge and to the Shopping Mall via High Street."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "The",
              "Park",
              "serves",
              "as",
              "the",
              "central",
              "hub",
              "of",
              "the",
              "town",
              "centre"
            ],
            "targetSentence": "The Park serves as the central hub of the town centre."
          }
        ]
      }
    }
  },
  {
    "id": "map-2",
    "type": "map",
    "title": "University Campus Expansion Plan",
    "question": "The maps below show the current layout of a university campus and the proposed expansion plan for 2030.",
    "data": {
      "nodes": [
        {
          "id": "main",
          "label": "Main Building",
          "x": 100,
          "y": 40,
          "width": 200,
          "height": 60,
          "color": "#FFCCBC"
        },
        {
          "id": "library",
          "label": "Library",
          "x": 50,
          "y": 140,
          "width": 100,
          "height": 60,
          "color": "#BBDEFB"
        },
        {
          "id": "lab",
          "label": "Science Lab",
          "x": 250,
          "y": 140,
          "width": 100,
          "height": 60,
          "color": "#A8E6CF"
        },
        {
          "id": "sports",
          "label": "Sports Centre",
          "x": 50,
          "y": 240,
          "width": 100,
          "height": 50,
          "color": "#FFE0B2"
        },
        {
          "id": "dorms",
          "label": "Student Dorms",
          "x": 250,
          "y": 240,
          "width": 100,
          "height": 50,
          "color": "#E1BEE7"
        },
        {
          "id": "cafe",
          "label": "New Cafeteria",
          "x": 150,
          "y": 330,
          "width": 100,
          "height": 50,
          "color": "#C5CAE9"
        }
      ],
      "edges": [
        {
          "from": "main",
          "to": "library",
          "label": "Path A"
        },
        {
          "from": "main",
          "to": "lab",
          "label": "Path B"
        },
        {
          "from": "library",
          "to": "sports"
        },
        {
          "from": "lab",
          "to": "dorms"
        },
        {
          "from": "sports",
          "to": "cafe"
        },
        {
          "from": "dorms",
          "to": "cafe"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Where is the Main Building located on the campus map?",
            "options": [
              "Top centre",
              "Bottom centre",
              "Left side",
              "Right side"
            ],
            "answer": "Top centre"
          },
          {
            "question": "How many paths extend from the Main Building?",
            "options": [
              "1",
              "2",
              "3",
              "4"
            ],
            "answer": "2"
          },
          {
            "question": "Which facility is newly planned?",
            "options": [
              "New Cafeteria",
              "Sports Centre",
              "Student Dorms",
              "Science Lab"
            ],
            "answer": "New Cafeteria"
          },
          {
            "question": "Which two facilities both connect to the New Cafeteria?",
            "options": [
              "Sports Centre and Student Dorms",
              "Library and Science Lab",
              "Main Building and Library",
              "Sports Centre and Library"
            ],
            "answer": "Sports Centre and Student Dorms"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "The Main Building is at the _____ of the campus.",
            "options": [
              "top",
              "bottom",
              "left",
              "right"
            ],
            "answer": "top"
          },
          {
            "sentence": "The New Cafeteria is a _____ facility.",
            "options": [
              "planned",
              "existing",
              "temporary",
              "removed"
            ],
            "answer": "planned"
          },
          {
            "sentence": "Two _____ lead from the Main Building.",
            "options": [
              "paths",
              "roads",
              "bridges",
              "tunnels"
            ],
            "answer": "paths"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "The Main Building is situated at the _____ of the campus.",
            "options": [
              "top centre",
              "bottom centre",
              "left side",
              "right corner"
            ],
            "answer": "top centre"
          },
          {
            "sentence": "The Sports Centre and Student Dorms both connect to the _____.",
            "options": [
              "New Cafeteria",
              "Main Building",
              "Science Lab",
              "Library"
            ],
            "answer": "New Cafeteria"
          },
          {
            "sentence": "Path A and Path B extend from the _____.",
            "options": [
              "Main Building",
              "Library",
              "Sports Centre",
              "New Cafeteria"
            ],
            "answer": "Main Building"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Paths from the Main Building _____ to the Library and Science Lab.",
            "options": [
              "lead",
              "stop",
              "return",
              "cross"
            ],
            "answer": "lead"
          },
          {
            "sentence": "The New Cafeteria is _____ at the bottom of the campus.",
            "options": [
              "planned",
              "existing",
              "temporary",
              "removed"
            ],
            "answer": "planned"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "The Main Building is at the top centre of the campus",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Two paths extend from the Main Building",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "The New Cafeteria is at the bottom centre",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Both the Sports Centre and Student Dorms connect to the New Cafeteria",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "The Library is directly connected to Student Dorms",
            "isCorrect": false
          }
        ],
        "overviewText": "The university campus features the Main Building at the top centre, with two paths leading to the Library and Science Lab, while the planned New Cafeteria is connected to both the Sports Centre and Student Dorms."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "The",
              "Main",
              "Building",
              "is",
              "located",
              "at",
              "the",
              "top",
              "centre",
              "of",
              "the",
              "campus"
            ],
            "targetSentence": "The Main Building is located at the top centre of the campus."
          }
        ]
      }
    }
  },
  {
    "id": "map-3",
    "type": "map",
    "title": "Airport Terminal Layout Before and After Renovation",
    "question": "The maps below illustrate the ground floor layout of an airport terminal before and after a major renovation.",
    "data": {
      "nodes": [
        {
          "id": "checkin",
          "label": "Check-in",
          "x": 40,
          "y": 40,
          "width": 140,
          "height": 50,
          "color": "#FFCCBC"
        },
        {
          "id": "security",
          "label": "Security",
          "x": 220,
          "y": 40,
          "width": 140,
          "height": 50,
          "color": "#BBDEFB"
        },
        {
          "id": "dutyfree",
          "label": "Duty Free",
          "x": 40,
          "y": 130,
          "width": 90,
          "height": 70,
          "color": "#FFE0B2"
        },
        {
          "id": "gates",
          "label": "Gates 1-10",
          "x": 170,
          "y": 130,
          "width": 100,
          "height": 70,
          "color": "#A8E6CF"
        },
        {
          "id": "lounge",
          "label": "Lounge",
          "x": 310,
          "y": 130,
          "width": 90,
          "height": 70,
          "color": "#E1BEE7"
        },
        {
          "id": "food",
          "label": "Food Court",
          "x": 40,
          "y": 240,
          "width": 140,
          "height": 50,
          "color": "#C5CAE9"
        },
        {
          "id": "gates2",
          "label": "Gates 11-20",
          "x": 220,
          "y": 240,
          "width": 140,
          "height": 50,
          "color": "#DCEDC8"
        }
      ],
      "edges": [
        {
          "from": "checkin",
          "to": "security",
          "label": "→"
        },
        {
          "from": "security",
          "to": "dutyfree",
          "label": "→"
        },
        {
          "from": "security",
          "to": "gates",
          "label": "→"
        },
        {
          "from": "dutyfree",
          "to": "food"
        },
        {
          "from": "gates",
          "to": "lounge"
        },
        {
          "from": "gates",
          "to": "gates2"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "Which area do passengers pass through first after entering the terminal?",
            "options": [
              "Check-in",
              "Security",
              "Duty Free",
              "Gates"
            ],
            "answer": "Check-in"
          },
          {
            "question": "How many branches emerge after Security?",
            "options": [
              "1",
              "2",
              "3",
              "4"
            ],
            "answer": "2"
          },
          {
            "question": "Which area does Duty Free lead to?",
            "options": [
              "Food Court",
              "Gates",
              "Lounge",
              "Check-in"
            ],
            "answer": "Food Court"
          },
          {
            "question": "Which facility is accessible from the Gates area?",
            "options": [
              "Lounge",
              "Food Court",
              "Check-in",
              "Duty Free"
            ],
            "answer": "Lounge"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Passengers must pass through _____ after check-in.",
            "options": [
              "security",
              "duty free",
              "lounge",
              "gates"
            ],
            "answer": "security"
          },
          {
            "sentence": "After security, the layout has two _____.",
            "options": [
              "branches",
              "exits",
              "entrances",
              "levels"
            ],
            "answer": "branches"
          },
          {
            "sentence": "The _____ is located between security and the food court.",
            "options": [
              "duty free",
              "lounge",
              "check-in",
              "gates"
            ],
            "answer": "duty free"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "The terminal layout follows a _____ from check-in to security.",
            "options": [
              "linear flow",
              "circular route",
              "random pattern",
              "grid system"
            ],
            "answer": "linear flow"
          },
          {
            "sentence": "Two distinct _____ emerge after the security checkpoint.",
            "options": [
              "branches",
              "exits",
              "entrances",
              "corridors"
            ],
            "answer": "branches"
          },
          {
            "sentence": "The Lounge is accessible from the _____ area.",
            "options": [
              "gates",
              "check-in",
              "duty free",
              "food court"
            ],
            "answer": "gates"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Passengers first _____ at the check-in area.",
            "options": [
              "arrive",
              "depart",
              "wait",
              "board"
            ],
            "answer": "arrive"
          },
          {
            "sentence": "Two separate routes _____ after the security checkpoint.",
            "options": [
              "begin",
              "end",
              "merge",
              "close"
            ],
            "answer": "begin"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "The terminal follows a linear flow from check-in to security",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "The layout forks into two branches after security",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "Duty Free leads to the Food Court",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "The Lounge is accessible from the Gates area",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "Passengers go directly from check-in to gates",
            "isCorrect": false
          }
        ],
        "overviewText": "The airport terminal follows a linear flow from check-in through security, after which it divides into two branches leading to different areas of the terminal."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "The",
              "terminal",
              "follows",
              "a",
              "linear",
              "flow",
              "from",
              "check-in",
              "through",
              "security"
            ],
            "targetSentence": "The terminal follows a linear flow from check-in through security."
          }
        ]
      }
    }
  },
  {
    "id": "flow-1",
    "type": "flowchart",
    "title": "Paper Recycling Process",
    "question": "The flowchart below illustrates how waste paper is recycled.",
    "data": {
      "nodes": [
        {
          "id": "1",
          "label": "Collection",
          "x": 50,
          "y": 20,
          "width": 120,
          "height": 60,
          "color": "#FFE0B2"
        },
        {
          "id": "2",
          "label": "Sorting",
          "x": 50,
          "y": 130,
          "width": 120,
          "height": 60,
          "color": "#FFCCBC"
        },
        {
          "id": "3",
          "label": "Cleaning",
          "x": 50,
          "y": 240,
          "width": 120,
          "height": 60,
          "color": "#BBDEFB"
        },
        {
          "id": "4",
          "label": "Pulping",
          "x": 250,
          "y": 20,
          "width": 120,
          "height": 60,
          "color": "#A8E6CF"
        },
        {
          "id": "5",
          "label": "De-inking",
          "x": 250,
          "y": 130,
          "width": 120,
          "height": 60,
          "color": "#E1BEE7"
        },
        {
          "id": "6",
          "label": "Drying",
          "x": 250,
          "y": 240,
          "width": 120,
          "height": 60,
          "color": "#C5CAE9"
        },
        {
          "id": "7",
          "label": "New Paper",
          "x": 150,
          "y": 340,
          "width": 120,
          "height": 60,
          "color": "#DCEDC8"
        }
      ],
      "edges": [
        {
          "from": "1",
          "to": "2"
        },
        {
          "from": "2",
          "to": "3"
        },
        {
          "from": "3",
          "to": "4"
        },
        {
          "from": "4",
          "to": "5"
        },
        {
          "from": "5",
          "to": "6"
        },
        {
          "from": "6",
          "to": "7"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "What is the first step in the paper recycling process?",
            "options": [
              "Collection",
              "Sorting",
              "Cleaning",
              "Pulping"
            ],
            "answer": "Collection"
          },
          {
            "question": "How many stages does the process consist of?",
            "options": [
              "5",
              "6",
              "7",
              "8"
            ],
            "answer": "7"
          },
          {
            "question": "Which step comes after de-inking?",
            "options": [
              "Drying",
              "Pulping",
              "Cleaning",
              "Sorting"
            ],
            "answer": "Drying"
          },
          {
            "question": "What is the final output?",
            "options": [
              "New Paper",
              "Drying",
              "De-inking",
              "Pulping"
            ],
            "answer": "New Paper"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Used paper is first sent for _____.",
            "options": [
              "collection",
              "sorting",
              "cleaning",
              "pulping"
            ],
            "answer": "collection"
          },
          {
            "sentence": "Ink is removed during the _____ stage.",
            "options": [
              "de-inking",
              "pulping",
              "drying",
              "sorting"
            ],
            "answer": "de-inking"
          },
          {
            "sentence": "The final stage produces _____ paper.",
            "options": [
              "new",
              "used",
              "waste",
              "mixed"
            ],
            "answer": "new"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "The process begins with the _____ of waste paper.",
            "options": [
              "collection",
              "sorting",
              "cleaning",
              "pulping"
            ],
            "answer": "collection"
          },
          {
            "sentence": "After cleaning, the material enters the _____ stage.",
            "options": [
              "pulping",
              "drying",
              "de-inking",
              "collection"
            ],
            "answer": "pulping"
          },
          {
            "sentence": "The final step produces _____.",
            "options": [
              "new paper",
              "waste material",
              "raw pulp",
              "mixed fibres"
            ],
            "answer": "new paper"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "The recycling process _____ of seven stages.",
            "options": [
              "consists",
              "lacks",
              "avoids",
              "skips"
            ],
            "answer": "consists"
          },
          {
            "sentence": "After de-inking, the material _____ to the drying stage.",
            "options": [
              "moves",
              "returns",
              "stops",
              "reverses"
            ],
            "answer": "moves"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "The process consists of seven sequential stages",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Collection is the first stage",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "De-inking takes place before drying",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "New paper is the final product",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "Sorting occurs after pulping",
            "isCorrect": false
          }
        ],
        "overviewText": "The paper recycling process consists of seven linear stages, beginning with collection and progressing through sorting, cleaning, pulping, de-inking, and drying, before finally producing new paper."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "The",
              "process",
              "consists",
              "of",
              "seven",
              "sequential",
              "stages",
              "ending",
              "with",
              "new",
              "paper"
            ],
            "targetSentence": "The process consists of seven sequential stages ending with new paper."
          }
        ]
      }
    }
  },
  {
    "id": "flow-2",
    "type": "flowchart",
    "title": "University Admission Process",
    "question": "The flowchart below shows the steps involved in the university admission process for international students.",
    "data": {
      "nodes": [
        {
          "id": "a",
          "label": "Submit\nApplication",
          "x": 50,
          "y": 30,
          "width": 100,
          "height": 70,
          "color": "#FFE0B2"
        },
        {
          "id": "b",
          "label": "Document\nReview",
          "x": 200,
          "y": 30,
          "width": 100,
          "height": 70,
          "color": "#FFCCBC"
        },
        {
          "id": "c",
          "label": "Language\nTest",
          "x": 50,
          "y": 160,
          "width": 100,
          "height": 70,
          "color": "#BBDEFB"
        },
        {
          "id": "d",
          "label": "Interview",
          "x": 200,
          "y": 160,
          "width": 100,
          "height": 70,
          "color": "#A8E6CF"
        },
        {
          "id": "e",
          "label": "Conditional\nOffer",
          "x": 50,
          "y": 290,
          "width": 100,
          "height": 70,
          "color": "#E1BEE7"
        },
        {
          "id": "f",
          "label": "Visa\nProcess",
          "x": 200,
          "y": 290,
          "width": 100,
          "height": 70,
          "color": "#C5CAE9"
        },
        {
          "id": "g",
          "label": "Enrolment",
          "x": 125,
          "y": 400,
          "width": 100,
          "height": 60,
          "color": "#DCEDC8"
        }
      ],
      "edges": [
        {
          "from": "a",
          "to": "b"
        },
        {
          "from": "b",
          "to": "c"
        },
        {
          "from": "b",
          "to": "d"
        },
        {
          "from": "c",
          "to": "e"
        },
        {
          "from": "d",
          "to": "e"
        },
        {
          "from": "e",
          "to": "f"
        },
        {
          "from": "f",
          "to": "g"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "What is the first step in the admission process?",
            "options": [
              "Submit Application",
              "Document Review",
              "Language Test",
              "Interview"
            ],
            "answer": "Submit Application"
          },
          {
            "question": "Which two stages run in parallel?",
            "options": [
              "Language Test and Interview",
              "Application and Review",
              "Visa and Enrolment",
              "Offer and Visa"
            ],
            "answer": "Language Test and Interview"
          },
          {
            "question": "What follows the conditional offer?",
            "options": [
              "Visa",
              "Enrolment",
              "Interview",
              "Language Test"
            ],
            "answer": "Visa"
          },
          {
            "question": "What is the final step?",
            "options": [
              "Enrolment",
              "Visa",
              "Conditional Offer",
              "Interview"
            ],
            "answer": "Enrolment"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Applicants must first _____ their application.",
            "options": [
              "submit",
              "review",
              "cancel",
              "ignore"
            ],
            "answer": "submit"
          },
          {
            "sentence": "The Language Test and Interview run in _____.",
            "options": [
              "parallel",
              "sequence",
              "reverse",
              "isolation"
            ],
            "answer": "parallel"
          },
          {
            "sentence": "Students receive a _____ offer before applying for a visa.",
            "options": [
              "conditional",
              "final",
              "permanent",
              "temporary"
            ],
            "answer": "conditional"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "The Language Test and Interview take place _____.",
            "options": [
              "in parallel",
              "in sequence",
              "one by one",
              "separately"
            ],
            "answer": "in parallel"
          },
          {
            "sentence": "A _____ is issued before the visa stage.",
            "options": [
              "conditional offer",
              "final acceptance",
              "payment receipt",
              "course syllabus"
            ],
            "answer": "conditional offer"
          },
          {
            "sentence": "The process ends with _____ at the university.",
            "options": [
              "enrolment",
              "graduation",
              "orientation",
              "examination"
            ],
            "answer": "enrolment"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Two stages _____ simultaneously after document review.",
            "options": [
              "run",
              "stop",
              "cancel",
              "delay"
            ],
            "answer": "run"
          },
          {
            "sentence": "The final stage is _____ at the university.",
            "options": [
              "enrolment",
              "graduation",
              "examination",
              "application"
            ],
            "answer": "enrolment"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "The process is mostly linear with one parallel section",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "The Language Test and Interview are conducted in parallel",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "The conditional offer precedes the visa stage",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "Enrolment is the final stage",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "The interview comes after the conditional offer",
            "isCorrect": false
          }
        ],
        "overviewText": "The admission process follows a mostly linear sequence with the Language Test and Interview conducted in parallel, before a conditional offer is issued, followed by the visa application and finally enrolment."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "The",
              "Language",
              "Test",
              "and",
              "Interview",
              "are",
              "conducted",
              "in",
              "parallel",
              "after",
              "document",
              "review"
            ],
            "targetSentence": "The Language Test and Interview are conducted in parallel after document review."
          }
        ]
      }
    }
  },
  {
    "id": "flow-3",
    "type": "flowchart",
    "title": "Cement Production Process",
    "question": "The diagram below shows the stages and equipment used in the cement-making process.",
    "data": {
      "nodes": [
        {
          "id": "s1",
          "label": "Limestone\n& Clay",
          "x": 30,
          "y": 40,
          "width": 90,
          "height": 70,
          "color": "#FFE0B2"
        },
        {
          "id": "s2",
          "label": "Crusher",
          "x": 170,
          "y": 40,
          "width": 90,
          "height": 70,
          "color": "#FFCCBC"
        },
        {
          "id": "s3",
          "label": "Mixer",
          "x": 100,
          "y": 150,
          "width": 90,
          "height": 70,
          "color": "#BBDEFB"
        },
        {
          "id": "s4",
          "label": "Rotating\nHeater",
          "x": 100,
          "y": 260,
          "width": 90,
          "height": 70,
          "color": "#A8E6CF"
        },
        {
          "id": "s5",
          "label": "Grinder",
          "x": 170,
          "y": 370,
          "width": 90,
          "height": 70,
          "color": "#E1BEE7"
        },
        {
          "id": "s6",
          "label": "Cement\nBags",
          "x": 30,
          "y": 370,
          "width": 90,
          "height": 70,
          "color": "#C5CAE9"
        }
      ],
      "edges": [
        {
          "from": "s1",
          "to": "s2"
        },
        {
          "from": "s2",
          "to": "s3"
        },
        {
          "from": "s3",
          "to": "s4"
        },
        {
          "from": "s4",
          "to": "s5"
        },
        {
          "from": "s5",
          "to": "s6"
        }
      ]
    },
    "levels": {
      "level1": {
        "prompt": "Observe the chart carefully and answer the following questions",
        "questions": [
          {
            "question": "What are the two raw materials for cement production?",
            "options": [
              "Limestone and Clay",
              "Sand and Gravel",
              "Iron and Coal",
              "Water and Lime"
            ],
            "answer": "Limestone and Clay"
          },
          {
            "question": "Which machine crushes the raw materials?",
            "options": [
              "Crusher",
              "Mixer",
              "Grinder",
              "Heater"
            ],
            "answer": "Crusher"
          },
          {
            "question": "What step follows the rotating heater?",
            "options": [
              "Grinding",
              "Crushing",
              "Mixing",
              "Packing"
            ],
            "answer": "Grinding"
          },
          {
            "question": "How is the final product packaged?",
            "options": [
              "Cement Bags",
              "Bottles",
              "Cardboard Boxes",
              "Barrels"
            ],
            "answer": "Cement Bags"
          }
        ]
      },
      "level2": {
        "prompt": "Fill in the blanks with the correct vocabulary words based on the chart data",
        "questions": [
          {
            "sentence": "Limestone and _____ are the raw materials.",
            "options": [
              "clay",
              "sand",
              "water",
              "iron"
            ],
            "answer": "clay"
          },
          {
            "sentence": "The materials are crushed in the _____.",
            "options": [
              "crusher",
              "mixer",
              "grinder",
              "heater"
            ],
            "answer": "crusher"
          },
          {
            "sentence": "Cement is packed into _____ at the final stage.",
            "options": [
              "bags",
              "boxes",
              "bottles",
              "tanks"
            ],
            "answer": "bags"
          }
        ]
      },
      "level3": {
        "prompt": "Fill in the blanks with the correct phrases based on the chart data",
        "questions": [
          {
            "sentence": "The process starts with _____ being fed into the crusher.",
            "options": [
              "limestone and clay",
              "sand and gravel",
              "water and lime",
              "iron and coal"
            ],
            "answer": "limestone and clay"
          },
          {
            "sentence": "The crushed material passes through a _____ before grinding.",
            "options": [
              "rotating heater",
              "cooling chamber",
              "storage tank",
              "mixing drum"
            ],
            "answer": "rotating heater"
          },
          {
            "sentence": "At the final stage, cement is packed into _____.",
            "options": [
              "cement bags",
              "plastic containers",
              "metal drums",
              "wooden crates"
            ],
            "answer": "cement bags"
          }
        ]
      },
      "level4": {
        "prompt": "Choose the correct word to complete each sentence",
        "questions": [
          {
            "sentence": "Cement production _____ with limestone and clay.",
            "options": [
              "begins",
              "ends",
              "stops",
              "finishes"
            ],
            "answer": "begins"
          },
          {
            "sentence": "The final product is packed into _____.",
            "options": [
              "bags",
              "boxes",
              "drums",
              "crates"
            ],
            "answer": "bags"
          }
        ]
      },
      "level5": {
        "prompt": "Check the key observations about this chart",
        "options": [
          {
            "id": "a",
            "text": "The process consists of six linear stages",
            "isCorrect": true
          },
          {
            "id": "b",
            "text": "Limestone and clay are the starting raw materials",
            "isCorrect": true
          },
          {
            "id": "c",
            "text": "The rotating heater comes before the grinder",
            "isCorrect": true
          },
          {
            "id": "d",
            "text": "The final product is packed into cement bags",
            "isCorrect": true
          },
          {
            "id": "e",
            "text": "The mixer comes before the crusher",
            "isCorrect": false
          }
        ],
        "overviewText": "The cement production process consists of six linear stages, starting with limestone and clay being crushed and mixed, then heated, ground into powder, and finally packed into cement bags."
      },
      "level6": {
        "prompt": "Assemble the words to form a complete Task 1 paragraph",
        "paragraphs": [
          {
            "words": [
              "The",
              "process",
              "begins",
              "with",
              "limestone",
              "and",
              "clay",
              "being",
              "crushed",
              "and",
              "mixed"
            ],
            "targetSentence": "The process begins with limestone and clay being crushed and mixed."
          }
        ]
      }
    }
  }
];

export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  line: "Line Chart",
  bar: "Bar Chart",
  pie: "Pie Chart",
  table: "Table",
  map: "Map",
  flowchart: "Flowchart",
};

export const CHART_TYPE_ORDER: ChartType[] = ["line", "bar", "pie", "table", "map", "flowchart"];