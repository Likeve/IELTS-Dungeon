export type DictationTopic = "tech" | "environment" | "education";
export type DictationTask = "task1" | "task2";

export type DictationEssay = {
  id: string;
  topic: DictationTopic;
  task: DictationTask;
  titleZh: string;
  /** Full text for dictation (single paragraph or two, no line breaks inside sentences). */
  text: string;
};

export const DICTATION_TOPIC_LABEL: Record<DictationTopic, string> = {
  tech: "科技",
  environment: "环境",
  education: "教育",
};

export const DICTATION_TASK_LABEL: Record<DictationTask, string> = {
  task1: "Task 1",
  task2: "Task 2",
};

export const IELTS_DICTATION_ESSAYS: DictationEssay[] = [
  {
    id: "t2-tech-1",
    topic: "tech",
    task: "task2",
    titleZh: "人工智能与社会",
    text: `It is often argued that the rapid spread of artificial intelligence will inevitably displace human workers and deepen social inequality. While I accept that certain routine jobs may disappear, I believe that technology can also create new opportunities and improve overall living standards if governments and industries manage the transition responsibly. On the one hand, automation clearly threatens roles that rely on repetitive tasks, such as data entry or basic assembly lines. Workers in these sectors may face unemployment unless they are offered retraining programmes. On the other hand, history suggests that major technological shifts tend to generate entirely new categories of employment, from software engineering to digital ethics consulting. Moreover, AI can enhance productivity in healthcare and education, allowing professionals to focus on complex judgement rather than administrative burden. In conclusion, although challenges are real, a balanced approach that combines regulation, education, and innovation can ensure that AI serves society rather than harming it.`,
  },
  {
    id: "t1-tech-1",
    topic: "tech",
    task: "task1",
    titleZh: "互联网使用变化（描述）",
    text: `The line graph illustrates how daily internet usage among three age groups changed between 2010 and 2020. Overall, all groups experienced an upward trend, but young adults consistently spent the most time online. In 2010, teenagers used the internet for roughly two hours per day, whereas people aged 25 to 44 logged about three hours. The oldest group, those over 45, began at only one hour. Over the following decade, teenage usage rose steadily to reach five hours by 2020. The middle-aged category showed a similar pattern, finishing at approximately six hours, which was the highest figure on the chart. By contrast, growth among older users was more moderate, climbing to just under three hours. These figures suggest that digital habits have become deeply embedded across generations, although a clear gap remains between younger and older users.`,
  },
  {
    id: "t2-env-1",
    topic: "environment",
    task: "task2",
    titleZh: "个人责任与气候行动",
    text: `Some people claim that individual choices, such as recycling or reducing plastic use, have little impact compared with decisions made by large corporations and governments. I partly agree with this view, but I still believe that personal responsibility plays a meaningful role in tackling climate change. It is undeniable that policy instruments like carbon pricing and investment in renewable energy can shift emissions on a massive scale. Multinational companies, which control global supply chains, must be held accountable through strict regulation rather than voluntary pledges alone. However, citizens are not powerless. Collective shifts in consumption can reshape markets, encouraging firms to offer greener products and services. Furthermore, environmentally conscious citizens are more likely to vote for ambitious climate policies and hold politicians to account. In my opinion, the most effective strategy combines top-down regulation with bottom-up cultural change, recognising that each level reinforces the other.`,
  },
  {
    id: "t1-env-1",
    topic: "environment",
    task: "task1",
    titleZh: "可再生能源占比（描述）",
    text: `The bar chart compares the proportion of electricity generated from renewable sources in four countries in 2000 and 2015. Overall, every country increased its reliance on renewables, but the scale of change varied considerably. In 2000, Country A produced only around five per cent of its electricity from renewable sources, whereas Country D already relied on renewables for roughly twenty per cent. By 2015, Country A had more than tripled its share to about eighteen per cent, representing the fastest relative growth. Country B and Country C followed more modest upward paths, reaching twelve and fifteen per cent respectively. Country D remained the leader, although its increase was smaller in percentage terms, climbing to around twenty-eight per cent. These trends indicate a shared policy emphasis on cleaner energy, even though starting points and trajectories differed markedly between nations.`,
  },
  {
    id: "t2-edu-1",
    topic: "education",
    task: "task2",
    titleZh: "在线教育与面对面教学",
    text: `The growth of online learning platforms has prompted debate about whether remote instruction can replace traditional classrooms. In my view, digital tools are a valuable supplement, but they cannot fully substitute for face-to-face teaching, especially for younger learners. One obvious advantage of online courses is flexibility. Students can revisit recorded lectures and study at their own pace, which benefits those who combine work with education. Additionally, well-designed platforms can offer immediate automated feedback on quizzes, helping learners identify weaknesses quickly. Nevertheless, physical schools provide social interaction, structured discipline, and non-verbal cues from teachers that are difficult to replicate on a screen. Young children, in particular, need supervised environments to develop concentration and interpersonal skills. Therefore, the ideal model is likely to be blended learning, which integrates technology without abandoning the strengths of in-person education.`,
  },
  {
    id: "t1-edu-1",
    topic: "education",
    task: "task1",
    titleZh: "大学入学人数（描述）",
    text: `The table shows the number of male and female students enrolled in three universities in a single academic year. Overall, female enrolment exceeded male enrolment in two of the three institutions, and total numbers were highest at the largest university. University X admitted approximately twelve thousand women compared with nine thousand men, making it the only institution where female students were in the majority by a wide margin. At University Y, the figures were more balanced, with eight thousand men and eight and a half thousand women. University Z, the smallest of the three, enrolled five thousand male and four thousand female students, indicating a slight male majority. When the totals are combined, women accounted for just over fifty-two per cent of all students. These statistics may reflect changing career aspirations and outreach programmes aimed at encouraging girls to pursue higher education.`,
  },
];
