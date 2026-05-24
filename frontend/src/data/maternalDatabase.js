export const analyzeMaternalSymptoms = (symptoms, lang) => {
  const result = {
    diagnosis: {
      en: "Routine Checkup Advised",
      hi: "नियमित जांच की सलाह (Routine Checkup)",
      ta: "வழக்கமான பரிசோதனை (Routine Checkup)"
    },
    severityLevel: "mild",
    triageScore: 10,
    reasoning: {
      en: "No critical danger signs detected.",
      hi: "कोई गंभीर खतरे के संकेत नहीं।",
      ta: "ஆபத்தான அறிகுறிகள் எதுவும் இல்லை."
    },
    advice: {
      en: "Eat iron-rich foods like spinach and dates. Continue your daily vitamins and rest.",
      hi: "पालक और खजूर जैसे आयरन युक्त खाद्य पदार्थ खाएं। विटामिन लेते रहें और आराम करें।",
      ta: "கீரை, பேரீச்சம்பழம் போன்ற இரும்புச் சத்து உள்ள உணவுகளைச் சாப்பிடவும். ஓய்வெடுக்கவும்."
    }
  };

  const hasSwelling = symptoms.includes('swelling');
  const hasSevereHeadache = symptoms.includes('headache_severe');
  const hasBleeding = symptoms.includes('bleeding');
  const hasDecreasedMovement = symptoms.includes('decreased_movement');
  const hasHighFever = symptoms.includes('fever_maternal');
  const hasBlurredVision = symptoms.includes('blurred_vision');
  const hasSevereStomachPain = symptoms.includes('severe_stomach_pain');
  const hasWaterBreaking = symptoms.includes('water_breaking');
  const hasExtremeVomiting = symptoms.includes('extreme_vomiting');

  // Emergency: Water Breaking / Leaking Fluid / Severe Lower Abdominal Pain
  if (hasWaterBreaking || hasSevereStomachPain) {
    result.diagnosis = {
      en: "Preterm Labor or Membrane Rupture Risk",
      hi: "समय से पहले प्रसव या झिल्ली फटने का जोखिम",
      ta: "முன்கூட்டிய பிரசவம் அல்லது பனிக்குடம் உடைதல்"
    };
    result.severityLevel = "high";
    result.triageScore = 95;
    result.reasoning = {
      en: `Reason: ${hasWaterBreaking ? "Fluid leaking/water breaking" : "Severe abdominal pain"} requires immediate obstetric care.`,
      hi: `कारण: ${hasWaterBreaking ? "पानी का रिसाव" : "पेट के निचले हिस्से में तेज दर्द"} के लिए तुरंत प्रसूति विशेषज्ञ की जांच चाहिए।`,
      ta: `காரணம்: ${hasWaterBreaking ? "நீர் கசிவு" : "கடுமையான அடிவயிற்று வலி"} - உடனடியாக மகப்பேறு சிகிச்சை தேவை.`
    };
    result.advice = {
      en: "Lie down immediately. Do not put anything in the vagina. Get to the nearest health facility or PHC right away.",
      hi: "तुरंत लेट जाएं। योनि में कुछ भी न डालें। तुरंत नजदीकी स्वास्थ्य केंद्र या पीएचसी जाएं।",
      ta: "உடனடியாக படுக்கவும். யோனிப் பகுதியில் எதையும் செலுத்த வேண்டாம். உடனே மருத்துவமனைக்குச் செல்லவும்."
    };
    return result;
  }

  // Emergency: Bleeding / Decreased fetal movement
  if (hasBleeding || hasDecreasedMovement) {
    result.diagnosis = {
      en: "Obstetric Emergency",
      hi: "प्रसूति आपातकाल (Obstetric Emergency)",
      ta: "கர்ப்ப அவசரநிலை (Obstetric Emergency)"
    };
    result.severityLevel = "high";
    result.triageScore = 95;
    result.reasoning = {
      en: `Reason: ${hasBleeding ? "Bleeding" : "Decreased movement"} requires immediate scan.`,
      hi: `कारण: ${hasBleeding ? "रक्तस्राव" : "कम हलचल"} के लिए तुरंत स्कैन की जरूरत है।`,
      ta: `காரணம்: ${hasBleeding ? "இரத்தப்போக்கு" : "அசைவு குறைதல்"} - உடனடியாக மருத்துவமனை செல்லவும்.`
    };
    result.advice = {
      en: "Go to the nearest hospital or PHC immediately. Do not wait.",
      hi: "तुरंत नजदीकी अस्पताल या पीएचसी जाएं। इंतजार न करें।",
      ta: "உடனடியாக அருகில் உள்ள மருத்துவமனைக்குச் செல்லவும். தாமதிக்க வேண்டாம்."
    };
    return result;
  }

  // High Risk: Swelling + Severe Headache or Blurred Vision (Preeclampsia risk)
  if (hasSwelling && (hasSevereHeadache || hasBlurredVision)) {
    result.diagnosis = {
      en: "High Preeclampsia Risk (Pregnancy Hypertension)",
      hi: "उच्च प्रीक्लेम्पसिया जोखिम (गर्भावस्था उच्च रक्तचाप)",
      ta: "தற்காலிக உயர் இரத்த அழுத்தம் (Preeclampsia)"
    };
    result.severityLevel = "high";
    result.triageScore = 90;
    result.reasoning = {
      en: "Reason: Swelling accompanied by headache or vision spots suggests dangerously high blood pressure.",
      hi: "कारण: सिरदर्द या धुंधली दृष्टि के साथ सूजन आना खतरनाक रूप से उच्च रक्तचाप का संकेत है।",
      ta: "காரணம்: வீக்கத்துடன் தலைவலி அல்லது மங்கலான பார்வை இருப்பது தற்காலிக உயர் இரத்த அழுத்தத்தின் அறிகுறி."
    };
    result.advice = {
      en: "Check blood pressure at the clinic today. Rest on your left side. Avoid salt. Alert your ASHA worker.",
      hi: "आज ही क्लिनिक में ब्लड प्रेशर चेक कराएं। बाईं करवट आराम करें। नमक से परहेज करें। आशा वर्कर को बताएं।",
      ta: "இன்றே ரத்த அழுத்தத்தை பரிசோதிக்கவும். இடது பக்கம் படுக்கவும். உப்பை குறைக்கவும். आशा ஊழியரை அழைக்கவும்."
    };
    return result;
  }

  // Moderate Risk: Severe constant vomiting (Hyperemesis)
  if (hasExtremeVomiting) {
    result.diagnosis = {
      en: "Severe Vomiting (Hyperemesis Gravidarum Risk)",
      hi: "गंभीर उल्टी (डीहाइड्रेशन का खतरा)",
      ta: "தொடர் வாந்தி (நீர்ச்சத்து குறைபாடு அபாயம்)"
    };
    result.severityLevel = "mod";
    result.triageScore = 65;
    result.reasoning = {
      en: "Reason: Persistent vomiting leads to rapid dehydration and nutrient depletion for the baby.",
      hi: "कारण: लगातार उल्टी होने से शरीर में पानी की गंभीर कमी हो सकती है जो बच्चे के लिए हानिकारक है।",
      ta: "காரணம்: தொடர் வாந்தியால் உடலில் நீர்ச்சத்து குறைந்து குழந்தைக்கு சத்துக்கள் குறைபாடு ஏற்படும்."
    };
    result.advice = {
      en: "Sip ORS solution or fresh coconut water slowly. Eat small dry crackers. If vomiting persists for 12+ hours, visit PHC for IV fluids.",
      hi: "ओआरएस (ORS) घोल या नारियल पानी घूंट-घूंट कर पिएं। सूखी टोस्ट खाएं। यदि 12 घंटे तक पानी भी न पचे, तो पीएचसी जाएं।",
      ta: "ORS அல்லது இளநீர் குடிக்கவும். உலர்ந்த ரொட்டி சாப்பிடவும். 12 மணி நேரத்திற்கும் மேலாக வாந்தி நீடித்தால் மருத்துவமனை செல்லவும்."
    };
    return result;
  }
  
  // Moderate Risk: Fever
  if (hasHighFever) {
    result.diagnosis = {
      en: "Maternal Infection Risk",
      hi: "संभावित संक्रमण (Infection)",
      ta: "கர்ப்பிணிக்கு நோய்த்தொற்று (Infection)"
    };
    result.severityLevel = "mod";
    result.triageScore = 60;
    result.reasoning = {
      en: "Reason: High fever during pregnancy needs monitoring.",
      hi: "कारण: गर्भावस्था के दौरान तेज बुखार पर नजर रखने की जरूरत है।",
      ta: "காரணம்: கர்ப்ப காலத்தில் கடும் காய்ச்சல் வருவது கண்காணிக்கப்பட வேண்டும்."
    };
    result.advice = {
      en: "Take paracetamol if prescribed. Drink lots of fluids. See ASHA worker tomorrow.",
      hi: "डॉक्टर द्वारा दी गई दवा लें। खूब सारे तरल पदार्थ पिएं। कल आशा वर्कर से मिलें।",
      ta: "மருத்துவர் அளித்த மாத்திரைகளை உட்கொள்ளவும். நிறைய தண்ணீர் குடிக்கவும்."
    };
    return result;
  }

  return result;
};
