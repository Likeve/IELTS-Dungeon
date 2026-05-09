import re
import json

with open('src/data/ieltsPhrases.ts', 'r') as f:
    content = f.read()

phrases = []
matches = re.finditer(r'\{\s*id:\s*"(\d+)",\s*phrase1:\s*"(.*?)",\s*phrase2:\s*"(.*?)"\s*\}', content)
for m in matches:
    phrases.append({
        "id": m.group(1),
        "phrase1": m.group(2),
        "phrase2": m.group(3)
    })

hq_data = {
    "1": {
        "meaningEn": "a large quantity of something",
        "meaningZh": "大量的",
        "examples": [
            "A great deal of research has been conducted on climate change.",
            "The new policy will save a lot of time and resources.",
            "She spent a great deal of money on her IELTS preparation."
        ]
    },
    "2": {
        "meaningEn": "to form the total of something; to explain the reason for something",
        "meaningZh": "占据（比例）；解释...的原因",
        "examples": [
            "Renewable energy sources account for 30% of the country's electricity.",
            "The government needs to explain the recent increase in taxes.",
            "He was unable to account for his absence during the meeting."
        ]
    },
    "3": {
        "meaningEn": "many different types of things or people",
        "meaningZh": "广泛的；多种多样的",
        "examples": [
            "The library offers a wide range of academic journals.",
            "A large variety of species can be found in this ecosystem.",
            "Students can choose from a wide range of extracurricular activities."
        ]
    },
    "4": {
        "meaningEn": "to change your behavior in order to deal more successfully with a new situation",
        "meaningZh": "适应",
        "examples": [
            "International students often take time to adapt to a new culture.",
            "It is crucial to get used to the fast-paced working environment.",
            "Animals must adapt to their changing habitats to survive."
        ]
    },
    "5": {
        "meaningEn": "to continue to obey a rule or have a belief",
        "meaningZh": "坚持；遵守",
        "examples": [
            "All candidates must adhere to the examination rules.",
            "It is important to stick to your original study plan.",
            "The company adheres to strict environmental standards."
        ]
    },
    "6": {
        "meaningEn": "to have the same opinion as someone else",
        "meaningZh": "同意；赞同",
        "examples": [
            "I completely agree with the author's perspective on education.",
            "The committee consented to the proposed changes.",
            "Not everyone will agree with this controversial policy."
        ]
    },
    "7": {
        "meaningEn": "except for or not considering",
        "meaningZh": "除了...之外",
        "examples": [
            "Apart from the high cost, the project is highly feasible.",
            "Except for a few minor errors, the essay is well-written.",
            "Apart from English, she is also fluent in French and Spanish."
        ]
    },
    "8": {
        "meaningEn": "to make a formal request, usually in writing",
        "meaningZh": "申请；请求",
        "examples": [
            "Many graduates apply for jobs in multinational corporations.",
            "You need to request permission before using the laboratory.",
            "He decided to apply for a scholarship to study abroad."
        ]
    },
    "9": {
        "meaningEn": "because of something",
        "meaningZh": "由于；作为...的结果",
        "examples": [
            "As a result of the heavy rain, the flight was delayed.",
            "The business failed due to poor management.",
            "Many species are endangered as a result of habitat loss."
        ]
    },
    "10": {
        "meaningEn": "in addition; and also",
        "meaningZh": "也；以及",
        "examples": [
            "The course covers literature as well as history.",
            "In addition to his salary, he receives a performance bonus.",
            "She is a talented musician as well as a brilliant scientist."
        ]
    }
}

with open('src/data/ieltsPhrases.ts', 'w') as f:
    f.write('export type PhrasePair = {\n')
    f.write('  id: string;\n')
    f.write('  phrase1: string;\n')
    f.write('  phrase2: string;\n')
    f.write('  meaningEn: string;\n')
    f.write('  meaningZh: string;\n')
    f.write('  examples: string[];\n')
    f.write('};\n\n')
    f.write('export const IELTS_PHRASES: PhrasePair[] = [\n')
    for p in phrases:
        pid = p["id"]
        p1 = p["phrase1"]
        p2 = p["phrase2"]
        if pid in hq_data:
            data = hq_data[pid]
            meaningEn = data["meaningEn"]
            meaningZh = data["meaningZh"]
            examples = data["examples"]
        else:
            meaningEn = f"Synonymous expression for '{p1}' and '{p2}'"
            meaningZh = f"'{p1}' 和 '{p2}' 的同义替换"
            examples = [
                f"In the IELTS reading test, you might see '{p1}' in the text.",
                f"The question might use the synonym '{p2}' to test your vocabulary.",
                f"Understanding that '{p1}' means '{p2}' is essential for a high score."
            ]

        f.write(f'  {{\n')
        f.write(f'    id: "{pid}",\n')
        f.write(f'    phrase1: "{p1}",\n')
        f.write(f'    phrase2: "{p2}",\n')
        f.write(f'    meaningEn: "{meaningEn}",\n')
        f.write(f'    meaningZh: "{meaningZh}",\n')
        f.write(f'    examples: {json.dumps(examples, ensure_ascii=False)}\n')
        f.write(f'  }},\n')
    f.write('];\n')

