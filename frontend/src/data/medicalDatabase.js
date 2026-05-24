export const analyzeSymptoms = (symptoms, lang) => {
  const result = {
    diagnosis: {
      en: "Mild Condition",
      hi: "हल्की स्थिति (Mild Condition)",
      ta: "சிறிய பிரச்சனை (Mild Condition)"
    },
    severityLevel: "mild",
    triageScore: 15,
    reasoning: {
      en: "Reason: Few non-critical symptoms detected.",
      hi: "कारण: कुछ गैर-गंभीर लक्षण पाए गए हैं।",
      ta: "காரணம்: ஆபத்தான அறிகுறிகள் இல்லை."
    },
    advice: {
      en: "Rest and drink fluids. See a doctor if symptoms persist.",
      hi: "आराम करें और तरल पदार्थ पिएं। लक्षण बने रहने पर डॉक्टर को दिखाएं।",
      ta: "ஓய்வெடுக்கவும், நீர் அருந்தவும். அறிகுறிகள் தொடர்ந்தால் மருத்துவரை அணுகவும்."
    }
  };

  const hasFever = symptoms.includes('fever');
  const hasCough = symptoms.includes('cough');
  const hasVomiting = symptoms.includes('vomiting');
  const hasDizziness = symptoms.includes('dizziness');
  const hasChestPain = symptoms.includes('chest_pain');
  const hasTiredness = symptoms.includes('tiredness');

  if (hasChestPain) {
    result.diagnosis = {
      en: "Critical Condition Detected",
      hi: "गंभीर स्थिति का पता चला (Critical Condition)",
      ta: "அபாயகரமான நிலை (Critical Condition)"
    };
    result.severityLevel = "high";
    result.triageScore = 98;
    result.reasoning = {
      en: "Reason: Chest pain indicates possible cardiac or pulmonary emergency.",
      hi: "कारण: सीने में दर्द हृदय या फेफड़ों की आपात स्थिति का संकेत देता है।",
      ta: "காரணம்: நெஞ்சு வலி இதய நோயின் அறிகுறியாக இருக்கலாம்."
    };
    result.advice = {
      en: "Seek IMMEDIATE emergency medical attention. Call for an ambulance.",
      hi: "तत्काल आपातकालीन चिकित्सा सहायता लें। एम्बुलेंस को कॉल करें।",
      ta: "உடனடியாக அவசர மருத்துவ உதவியை நாடுங்கள். ஆம்புலன்ஸை அழைக்கவும்."
    };
    return result;
  }

  if (hasFever && hasCough && hasTiredness) {
    result.diagnosis = {
      en: "Possible Viral Infection",
      hi: "संभावित वायरल संक्रमण (Viral Infection)",
      ta: "வைரஸ் தொற்று (Viral Infection)"
    };
    result.severityLevel = "mod";
    result.triageScore = 55;
    result.reasoning = {
      en: "Reason: Fever + Cough + Tiredness aligns with viral spread patterns.",
      hi: "कारण: बुखार + खांसी + थकान वायरल संक्रमण से मेल खाता है।",
      ta: "காரணம்: காய்ச்சல், இருமல், சோர்வு ஆகியவை வைரஸ் தொற்றுக்கான அறிகுறிகள்."
    };
    result.advice = {
      en: "Rest, stay hydrated, and monitor temperature. Consult a doctor if fever lasts over 3 days.",
      hi: "आराम करें, पानी पिएं और तापमान की निगरानी करें। बुखार 3 दिन से अधिक रहने पर डॉक्टर से सलाह लें।",
      ta: "ஓய்வெடுக்கவும், நீர் அருந்தவும். காய்ச்சல் 3 நாட்களுக்கு மேல் நீடித்தால் மருத்துவரை அணுகவும்."
    };
    return result;
  }

  if (hasVomiting && hasDizziness) {
    result.diagnosis = {
      en: "Possible Dehydration / Gastroenteritis",
      hi: "संभावित निर्जलीकरण (Dehydration)",
      ta: "நீர்ச்சத்து குறைபாடு (Dehydration)"
    };
    result.severityLevel = "mod";
    result.triageScore = 65;
    result.reasoning = {
      en: "Reason: Vomiting causes fluid loss leading to dizziness.",
      hi: "कारण: उल्टी से शरीर में पानी की कमी होती है जिससे चक्कर आते हैं।",
      ta: "காரணம்: வாந்தியினால் நீர்ச்சத்து குறைந்து மயக்கம் ஏற்படுகிறது."
    };
    result.advice = {
      en: "Drink ORS/water immediately. Visit nearby clinic if symptoms continue.",
      hi: "तुरंत ओआरएस/पानी पिएं। लक्षण बने रहने पर पास के क्लिनिक में जाएं।",
      ta: "உடனடியாக ORS/தண்ணீர் குடிக்கவும். அறிகுறிகள் தொடர்ந்தால் மருத்துவரை பார்க்கவும்."
    };
    return result;
  }

  return result;
};
