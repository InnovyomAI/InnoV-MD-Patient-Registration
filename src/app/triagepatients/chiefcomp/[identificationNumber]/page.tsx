'use client';

import React, { useRef, useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../lib/store/store';
import { setSymptoms, setPainScale } from '../../../lib/store/patientSlice';
import ModelViewer from '@/components/ModelViewer';
import PainScale from '../../../components/PainScale';
import useSpeechToText from '../../../hooks/useSpeechToText';
import { FaMicrophone, FaMicrophoneSlash, FaTimes } from 'react-icons/fa';

const ChiefComp = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [symptoms, setSymptomsState] = useState<string[]>([]);
  const [addedSymptoms, setAddedSymptoms] = useState<string[]>([]);
  const [painScaleValue, setPainScaleValue] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [voiceInputText, setVoiceInputText] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { text: speechToText, startListening, stopListening } = useSpeechToText();
  const patient = useSelector((state: RootState) => state.patient.activeTriagePatient);
  const vitalstats = useSelector((state: RootState) => state.patient.vitals);
  type Symptom = string;
  const allSymptoms: Symptom[] = [
    "right eye swelling",
    "left hand injury",
    "left leg numbness",
    "withdrawal",
    "left testicular pain",
    "c-spine fracture",
    "eye evaluation",
    "left lower quadrant pain",
    "vomiting and or nausea",
    "left knee swelling",
    "jaw pain",
    "blurred vision",
    "myalgia",
    "rapid atrial fibrillation",
    "lab request",
    "facial fracture",
    "left toe pain",
    "hyponatremia",
    "toe pain",
    "gastroparesis",
    "right knee injury",
    "right leg injury",
    "nausea vomiting",
    "sepsis",
    "right finger pain",
    "facial cellulitis",
    "right eye evaluation",
    "priapism",
    "left side pain",
    "psychiatric evaluation",
    "abnormal echo",
    "depression",
    "feels unwell",
    "visual disturbance",
    "cough fever",
    "left calf pain",
    "alcohol withdrawal",
    "rectal bleeding",
    "melena",
    "transient ischemic attack",
    "dyspnea on exertion",
    "psychiatric hold",
    "mild cognitive impairment",
    "mechanical fall",
    "bilateral hand pain",
    "left arm pain",
    "ethyl alcohol withdrawal",
    "penile pain",
    "hand numbness",
    "chest pain",
    "abdominal pain",
    "left elbow fracture",
    "chin lac",
    "subarachnoid hemorrhage",
    "peripherally inserted central catheter line evaluation",
    "facial numbness",
    "right eye pain",
    "fall",
    "diahrrea",
    "left finger swelling",
    "black stool",
    "productive cough",
    "left groin pain",
    "facial lac",
    "left sided abdominal pain",
    "finger injury",
    "abdominal aortic aneurysm",
    "anxiety",
    "facial droop",
    "upper abdominal pain",
    "difficulty breathing",
    "right sided weakness",
    "right shoulder pain",
    "migraine",
    "bleeding",
    "vomiting blood",
    "wound evaluation",
    "right hip pain",
    "ingestion",
    "shortness of breath chest pain",
    "pelvic fracture",
    "influenza like illness",
    "clotted fistula",
    "weak",
    "atrial fibrillation",
    "incontinence",
    "altered mental status",
    "left lower extremity swelling",
    "discharge",
    "vomitting",
    "self injury",
    "hand injury",
    "tremor",
    "multiple sclerosis changes",
    "dyspnea",
    "neck pain",
    "pain",
    "left eye evaluation",
    "headache",
    "status post seizure",
    "positive blood cultures",
    "substernal chest pain",
    "right calf pain",
    "facial pain",
    "right thumb injury",
    "left rib pain",
    "body pain",
    "self injury",
    "left shoulder pain",
    "alt multiple sclerosis",
    "abdomen pain",
    "elevated blood sugar",
    "tongue swelling",
    "exposure",
    "needs endoscopic retrograde cholangiopancreatography",
    "human bite",
    "head pain",
    "bradycardia",
    "vaginal pain",
    "anorexia",
    "rectal pain",
    "unwitnessed fall",
    "lip laceration",
    "left leg swelling",
    "medical reaction",
    "left foot pain",
    "left arm weakness",
    "acute renal failure",
    "unable to void",
    "vaginal bleeding",
    "vomiting abdomen pain",
    "right sided chest pain",
    "leg swelling",
    "status post fall",
    "abdominal distention",
    "right hip fracture",
    "right shoulder dislocation",
    "transfer",
    "resolved",
    "double vision",
    "testicular swelling",
    "blood in stool",
    "dyspnea",
    "head lac",
    "unsteady gait",
    "appendicitis",
    "right finger injury",
    "deep vein thrombosis",
    "seizure",
    "vaginal itching",
    "self injury",
    "right sided abdominal pain",
    "oliguria",
    "vomiting diarrhea",
    "right elbow pain",
    "leg laceration",
    "left eye pain",
    "left wrist laceration",
    "lethargic",
    "left neck pain",
    "suicide attempt",
    "right abdomen pain",
    "left hand swelling",
    "cat bite",
    "cough",
    "hip pain",
    "left numbness",
    "arm numbness",
    "congestion",
    "right arm injury",
    "right ankle pain",
    "headache nausea",
    "left hand laceration",
    "mandibular fracture",
    "left arm tingling",
    "generalized weakness",
    "dental pain",
    "lower extremity weakness",
    "substance use",
    "bowel obstruction",
    "weight gain",
    "throat pain",
    "right arm redness",
    "status post fall",
    "rule out urinary tract infection",
    "self injury hi",
    "right breast pain",
    "ear pain",
    "midline evaluation",
    "rule out transient ischemic attack",
    "influenza",
    "right hand pain",
    "sickle cell crisis",
    "left upper quadrant abdomen pain",
    "dog bite",
    "nausea diarrhea",
    "urinary incontinence",
    "headache",
    "left elbow pain",
    "heart racing",
    "right side pain",
    "right lower quadrant abdominal pain",
    "right upper quadrant abdominal pain",
    "hypokalemia",
    "right elbow fracture",
    "pulmonary embolism",
    "ankle pain",
    "left wrist pain",
    "bilateral flank pain",
    "right weakness",
    "cerebrovascular accident",
    "right inguinal pain",
    "clotted graft",
    "foot swelling",
    "left thumb pain",
    "combative",
    "irregular heart rate",
    "hearing voices",
    "genitourinary evaluation",
    "orbital fracture",
    "right lower quadrant pain",
    "leg pain",
    "lip lac",
    "left heel pain",
    "word finding difficulty",
    "right hand swelling",
    "renal failure",
    "constipation",
    "finger laceration",
    "thumb laceration",
    "ataxia",
    "left knee injury",
    "malaise",
    "falls",
    "intraparenchymal hemorrhage",
    "diabetic ketoacidosis",
    "bilateral arm numbness",
    "hand pain",
    "gastrointestinal bleed",
    "epigastric pain",
    "right flank pain",
    "nephrostomy tube evaluation",
    "bilateral shoulder pain",
    "back pain",
    "tremors",
    "multiple falls",
    "nausea",
    "intoxicated",
    "left leg cellulitis",
    "bilateral leg swelling",
    "right foot numbness",
    "ah",
    "unable to ambulate",
    "fever",
    "slurred speech",
    "left jaw pain",
    "right arm fracture",
    "upper back pain",
    "right leg deep vein thrombosis",
    "rule out pulmonary embolism",
    "hypertension",
    "left arm injury",
    "elevated troponin",
    "wheezing",
    "insomnia",
    "gyn evaluation",
    "hematemesis",
    "vaginal bleed",
    "right foot redness",
    "fever cough",
    "right neck pain",
    "ethyl alcohol detox",
    "facial trauma",
    "swelling",
    "right eye redness",
    "delusions",
    "staples removal",
    "right facial droop",
    "left facial numbness",
    "left finger pain",
    "hypoglycemia",
    "lower extremity edema",
    "left hand weakness",
    "wrist injury",
    "left upper quadrant pain",
    "syncope",
    "finger infection",
    "sore throat",
    "left eye injury",
    "ekg changes",
    "foot laceration",
    "smoke inhalation",
    "right finger laceration",
    "genitourinary pain",
    "calf pain",
    "hypoxia",
    "psych",
    "foreign body throat",
    "left humerus fracture",
    "right ankle swelling",
    "left back pain",
    "arm laceration",
    "right rib pain",
    "coffee ground emesis",
    "throat foreign body sensation",
    "foot injury",
    "urinary frequency",
    "angioedema",
    "left chest pain",
    "ventricular hypertrophy",
    "prescription refill",
    "thumb injury",
    "right foot swelling",
    "breast pain",
    "fever",
    "neuro evaluation",
    "lower extremity pain",
    "gallstones",
    "status post hypotension",
    "confused",
    "arm swelling",
    "head injury",
    "clogged foley",
    "polyuria",
    "right arm numbness",
    "right foot ulcer",
    "tracheostomy evaluation",
    "pregnant",
    "elevated d-dimer",
    "left foot numbness",
    "left leg redness",
    "congestive heart failure",
    "thrombocytopenia",
    "for evaluation",
    "sinus pain",
    "left finger laceration",
    "fecal incontinence",
    "palpatations",
    "for admission",
    "seizure",
    "palpitations",
    "left hand numbness",
    "arm pain",
    "abnormal ultrasound",
    "psychosis",
    "jaundice",
    "right foot injury",
    "chest pressure",
    "bike accident",
    "percutaneous transluminal angioplasty",
    "gastrointestinal bleeding",
    "multiple c o",
    "left lower quadrant abdominal pain",
    "left arm fracture",
    "left ear pain",
    "right thumb laceration",
    "vision changes",
    "foreign body",
    "right arm laceration",
    "abnormal lab values",
    "bleeding fistula",
    "right ankle injury",
    "fever chills",
    "tick bite",
    "left inguinal pain",
    "finger swelling",
    "abnormal ct",
    "gastrostomy tube evaluation",
    "altered multiple sclerosis",
    "acute pelvic pain",
    "left shoulder injury",
    "lip swelling",
    "needlestick",
    "cough shortness of breath",
    "femur fracture",
    "detox",
    "left ankle injury",
    "gum bleeding",
    "neutropenia",
    "motorcycle accident",
    "left finger injury",
    "right upper back pain",
    "hives",
    "lumps",
    "mania",
    "gunshot wound",
    "right hand injury",
    "panic attack",
    "left buttock pain",
    "neck swelling",
    "urinary urgency",
    "body aches",
    "self inflicted injury",
    "anemia",
    "multiple complaints",
    "scrotal swelling",
    "deep vein thrombosis",
    "failure to thrive",
    "right foot infection",
    "right lower extremity pain",
    "right heel pain",
    "ankle swelling",
    "shortness of breath",
    "right ankle fracture",
    "left hip pain",
    "stab wound",
    "chemo",
    "dehydration",
    "implantable cardioverter defibrillator evaluation",
    "dysphagia",
    "diarrhea",
    "right wrist injury",
    "feeling unwell",
    "weight loss",
    "testicular pain",
    "pulseless foot",
    "tachypnea",
    "left ankle fracture",
    "lower extremity swelling",
    "cellulitis",
    "small bowel obstruction",
    "subdural hematoma",
    "facial injury",
    "coccyx pain",
    "bilateral leg pain",
    "head strike",
    "hi",
    "status post assault",
    "right facial pain",
    "ascites",
    "high blood pressure",
    "gen weakness",
    "mouth pain",
    "mental status changes",
    "right leg numbness",
    "right foot pain",
    "hepatic encephalopathy",
    "non-sinus tachycardia elevation myocardial infarction",
    "chemical exposure",
    "multiple sclerosis flare",
    "bilateral arm pain",
    "knee injury",
    "kidney stone",
    "difficulty swallowing",
    "left lower back pain",
    "ped struck",
    "right leg laceration",
    "abdomen cramps",
    "overdose",
    "groin pain",
    "respiratory distress",
    "left shoulder dislocation",
    "left hip fracture",
    "bilateral hip pain",
    "left ankle pain",
    "redness",
    "left arm redness",
    "finger pain",
    "left femur fracture",
    "left knee pain",
    "tib fib fracture",
    "head pressure",
    "lower abdominal pain",
    "dizzy",
    "left foot redness",
    "urinary tract infection",
    "left thumb injury",
    "toe injury",
    "status post unwitnessed fall",
    "rib pain",
    "hip fracture",
    "rib fracture",
    "facial laceration",
    "depressed",
    "chest pain",
    "foreign body in throat",
    "agitation",
    "rule out ectopic",
    "abnormal labs",
    "right groin pain",
    "hypothermia",
    "left foot injury",
    "left arm swelling",
    "sinus tachycardia",
    "assault",
    "left arm cellulitis",
    "left sided weakness",
    "drain evaluation",
    "red eye",
    "jejunostomy tube evaluation",
    "vaginal discharge",
    "ecchymosis",
    "left ankle swelling",
    "nausea vomiting diarrhea",
    "facial swelling",
    "abscess",
    "abnormal ekg",
    "bodyaches",
    "hemoptysis",
    "dizzy nausea",
    "left weakness",
    "hand laceration",
    "left flank pain",
    "foot infection",
    "laceration",
    "intracranial mass",
    "left arm numbness",
    "left breast pain",
    "asthma",
    "left thigh pain",
    "leg redness",
    "rule out cerebrovascular accident",
    "lower abdomen pain",
    "left headache",
    "bilateral leg weakness",
    "cyst",
    "right knee swelling",
    "labor",
    "requesting detox",
    "leg numbness",
    "foot pain",
    "bilateral ear pain",
    "diverticulitis",
    "loss of consciousness",
    "abdomen cramping",
    "epistaxis",
    "bumps",
    "bizarre behavior",
    "substance abuse",
    "left leg deep vein thrombosis",
    "right hand laceration",
    "hypotension",
    "wound infection",
    "not feeling well",
    "left pulseless foot",
    "heel pain",
    "right hand numbness",
    "vertigo",
    "abnormal sodium level",
    "right jaw pain",
    "left thumb laceration",
    "pleuritic chest pain",
    "right numbness",
    "periumbilical pain",
    "status post head injury",
    "left foot infection",
    "l-spine fracture",
    "right arm weakness",
    "c1 fracture",
    "myalgias",
    "suprapubic pain",
    "chest heaviness",
    "bicycle accident",
    "nasogastric tube evaluation",
    "left facial droop",
    "forehead laceration",
    "right hip injury",
    "right shoulder injury",
    "elbow pain",
    "self injury",
    "red cell indices",
    "right leg cellulitis",
    "left facial swelling",
    "aphasia",
    "chills",
    "post operation",
    "left sided chest pain",
    "hypotensive",
    "change in mental status",
    "nasal injury",
    "left abdomen pain",
    "food bolus",
    "right leg weakness",
    "ich",
    "leg weakness",
    "right facial numbness",
    "right toe pain",
    "rabies vaccine",
    "abdomen pain with nausea",
    "visual changes",
    "right ear pain",
    "dizziness",
    "bilateral lower back pain",
    "t-spine fracture",
    "right back pain",
    "neuro deficit",
    "bilateral knee pain",
    "bite",
    "chin laceration",
    "abnormal ct scan",
    "evaluation",
    "difficulty ambulating",
    "anxious",
    "pneumonia",
    "eye swelling",
    "status post motor vehicle accident",
    "hand swelling",
    "post operation pain",
    "ethyl alcohol",
    "pre-syncope",
    "left upper quadrant abdominal pain",
    "left foot ulcer",
    "paranoid delusion",
    "blurry vision",
    "burn",
    "hematuria",
    "toothache",
    "upper respiratory infection",
    "new atrial fibrillation",
    "back pain",
    "ventricular tachycardia",
    "shortness of breath",
    "abdomen pain",
    "right headache",
    "head laceration",
    "right eye injury",
    "leg injury",
    "hyperglycemia",
    "insect bite",
    "near syncope",
    "right facial swelling",
    "peritonsillar abscess",
    "rule out stroke",
    "left hand pain",
    "change in multiple sclerosis",
    "fevers",
    "right arm pain",
    "left sided numbness",
    "left upper back pain",
    "chest pains",
    "pancreatitis",
    "edema",
    "bilateral leg numbness",
    "hyperkalemia",
    "lightheaded",
    "right lower back pain",
    "hiccups",
    "left leg weakness",
    "joint pain",
    "eye pain",
    "infection",
    "fistula evaluation",
    "urosepsis",
    "multiple sclerosis change",
    "right sided abdomen pain",
    "pneumothorax",
    "urinary retention",
    "abdomen distention",
    "medical clearance",
    "rule out deep vein thrombosis",
    "pedal edema",
    "code cord",
    "right testicular pain",
    "nose pain",
    "c2 fracture",
    "medication error",
    "lower back pain",
    "left facial pain",
    "right upper quadrant pain",
    "right wrist pain",
    "weakness",
    "right hand redness",
    "bilateral eye swelling",
    "agitated",
    "abnormal labs",
    "left wrist injury",
    "throat tightness",
    "hernia",
    "ankle injury",
    "found down",
    "left leg injury",
    "status post motor vehicle collision",
    "psych evaluation",
    "shoulder pain",
    "allergic reaction",
    "chest tightness",
    "port evaluation",
    "pain control",
    "bilateral hand numbness",
    "dysuria",
    "left leg pain",
    "stroke",
    "post operation bleeding",
    "vomiting",
    "vomiting",
    "elevated inr",
    "abdomen pain",
    "abnormal xray",
    "buttock pain",
    "motor vehicle collision",
    "skin evaluation",
    "elevated white blood cell",
    "chest congestion",
    "pleural effusion",
    "right chest pain",
    "inguinal pain",
    "hallucinations",
    "left foot swelling",
    "right arm swelling",
    "flank pain",
    "right arm cellulitis",
    "skin erythema",
    "right leg redness",
    "eye redness",
    "arm weakness",
    "head bleed",
    "chest discomfort",
    "foley insertion",
    "bright red blood per rectum",
    "pericardial effusion",
    "supraventricular tachycardia",
    "right thigh pain",
    "seizures",
    "right knee pain",
    "unresponsive",
    "itching",
    "fatigue",
    "scrotal pain",
    "right leg swelling",
    "medical refill",
    "bicyclist struck",
    "rash",
    "left hip injury",
    "tachycardia",
    "right thumb pain",
    "abdomen pain nausea",
    "presyncope",
    "foley evaluation",
    "sedative withdrawal",
    "left eye swelling",
    "cholecystitis",
    "nose injury",
    "wrist pain",
    "lethargy",
    "bilateral foot pain",
    "lab draw",
    "diplopia",
    "status post unresponsive",
    "bilateral lower extremity edema",
    "pelvic pain",
    "suture removal",
    "abnormal mri",
    "left sided abdomen pain",
    "decreased po intake",
    "peripherally inserted central catheter evaluation",
    "numbness",
    "passed out",
    "left eye redness",
    "hemodialysis",
    "bilateral eye pain",
    "confusion",
    "unable to urinate",
    "knee pain",
    "opioid withdrawal",
    "asthma exacerbation",
    "right femur fracture",
    "left leg laceration",
    "left arm laceration",
    "left lower extremity pain",
    "right leg pain",
    "nasal congestion"
];

  useEffect(() => {
    console.log("the vitalstats data",vitalstats)
  }, []);

  useEffect(() => {
    if (isListening) {
      setVoiceInputText(prevText => prevText + ' ' + speechToText);
    }
  }, [speechToText]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (patient) {
      const identificationNumber = patient.identificationNumber;
      dispatch(setSymptoms({ identificationNumber: identificationNumber, symptoms: addedSymptoms }));
      dispatch(setPainScale({ identificationNumber: identificationNumber, painScale: painScaleValue }));
      router.push(`/medicalhistory/${patient.identificationNumber}`);
    }
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleSymptomSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setInputText(query);
    const filteredSymptoms = allSymptoms.filter((symptom) =>
      symptom.toLowerCase().includes(query)
    );
    setSymptomsState(filteredSymptoms);
    setShowSuggestions(true);
  };

  const handleAddSymptom = (symptom: string) => {
    if (!addedSymptoms.includes(symptom)) {
      setAddedSymptoms([...addedSymptoms, symptom]);
    }
    setShowSuggestions(false); // Close suggestions after adding a symptom
  };

  const handleAddVoiceSymptom = () => {
    if (voiceInputText && !addedSymptoms.includes(voiceInputText.trim())) {
      setAddedSymptoms([...addedSymptoms, voiceInputText.trim()]);
      setVoiceInputText('');
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setAddedSymptoms(addedSymptoms.filter(s => s !== symptom));
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    handleSymptomSearch(e);
  };

  const handleVoiceInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setVoiceInputText(e.target.value);
  };

  const handleClearVoiceSearch = () => {
    setVoiceInputText('');
  };

  const handlePainScaleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 10) {
      setPainScaleValue(value);
    }
  };

  return (
    <div className="flex h-screen mt-10">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-5 flex">
          <div className="flex-1 flex flex-col gap-5">
            <form ref={formRef} className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="voice-input">Voice Search:</label>
                <div className="relative w-full flex items-center">
                  <textarea
                    id="voice-input"
                    className="flex-grow p-2 border border-gray-300 rounded"
                    placeholder="Voice input will appear here"
                    value={voiceInputText}
                    onChange={handleVoiceInputChange}
                  />
                  <span
                    className="absolute inset-y-0 right-12 flex items-center pr-3 cursor-pointer"
                    onClick={handleToggleListening}
                  >
                    {isListening ? (
                      <FaMicrophoneSlash className="text-red-600" />
                    ) : (
                      <FaMicrophone className="text-blue-600" />
                    )}
                  </span>
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={handleClearVoiceSearch}
                  >
                    <FaTimes className="text-gray-600" />
                  </span>
                </div>
                <button
                  type="button"
                  className="px-2 py-1 mt-2 bg-green-600 text-white rounded"
                  onClick={handleAddVoiceSymptom}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="symptoms-search">What are your symptoms?</label>
                <div className="relative w-full flex items-center">
                  <input
                    type="text"
                    id="symptoms-search"
                    ref={inputRef}
                    className="flex-grow p-2 border border-gray-300 rounded"
                    placeholder="Type your main symptom here"
                    onChange={handleInputChange}
                    value={inputText}
                    onFocus={() => setShowSuggestions(true)}
                  />
                </div>
                {showSuggestions && symptoms.length > 0 && (
                  <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2 mt-2">
                    {symptoms.map((symptom, index) => (
                      <li key={index} className="flex justify-between items-center p-1 hover:bg-gray-200 cursor-pointer">
                        <span>{symptom}</span>
                        <button
                          type="button"
                          className="px-2 py-1 bg-green-600 text-white rounded"
                          onClick={() => handleAddSymptom(symptom)}
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">My Symptoms</h2>
              {addedSymptoms.length > 0 && (
                <ul className="border border-gray-300 rounded p-2">
                  {addedSymptoms.map((symptom, index) => (
                    <li key={index} className="flex justify-between items-center p-1">
                      <span>{symptom}</span>
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => handleRemoveSymptom(symptom)}
                      >
                        &#x1F5D1;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2">
                <label htmlFor="pain-scale-input">Pain Scale (0-10):</label>
                <input
                  type="number"
                  id="pain-scale-input"
                  className="border p-2 rounded w-full"
                  value={painScaleValue}
                  onChange={handlePainScaleInputChange}
                  min="0"
                  max="10"
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/^0+/, '')} // Removes leading zeros
                />
                <PainScale value={painScaleValue} onChange={setPainScaleValue} />
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <ModelViewer />
          </div>
        </div>
        <div className="flex justify-between p-5">
          <button className="px-4 py-2 bg-gray-300 text-black rounded" onClick={() => router.back()}>Previous</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSubmit}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default ChiefComp;
