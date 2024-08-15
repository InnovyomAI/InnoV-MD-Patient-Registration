'use client';

import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../lib/store/store';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'; // Import microphone icons
import useSpeechToText from '../../../hooks/useSpeechToText'; // Import the custom hook
import { mergeMedicalData, setAcuityDiagnosis } from '../../../lib/store/patientSlice';

const MedicationsAndHistory: React.FC = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const identificationNumber = useSelector((state: RootState) => state.patient.selectedPatientId);
  const patient = useSelector((state: RootState) => state.patient.activeTriagePatient);
  const vitals = useSelector((state: RootState) => state.patient.vitals[identificationNumber!]);
  const painScale = useSelector((state: RootState) => state.patient.painScales[identificationNumber!]);
  const symptoms = useSelector((state: RootState) => state.patient.symptoms[identificationNumber!]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [response, setResponse] = useState(null); // State to manage listening status
  const [activeField, setActiveField] = useState<string>(''); // State to manage active listening field
  const { text: speechToText, startListening, stopListening } = useSpeechToText(); // Use the custom hook

  // Define the type for fields
  type FieldNames = 'medications' | 'history' | 'remarks';
  const [fields, setFields] = useState<Record<FieldNames, string>>({
    medications: patient?.drugHistory || '',
    history: patient?.medicalHistory || '',
    remarks: '',
  });

  useEffect(() => {
    console.log("patient data", patient);
  }, [patient]);

  useEffect(() => {
    if (isListening && activeField) {
      setFields((prevFields) => {
        const newText = prevFields[activeField as FieldNames] + ' ' + speechToText;
        return {
          ...prevFields,
          [activeField as FieldNames]: newText.trim(),
        };
      });
    }
  }, [speechToText, isListening, activeField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const chiefComplaint = symptoms ? symptoms.join(', ').toLowerCase() : 'dyspnea and pain';

      const payload = {
        chiefcomplaint: chiefComplaint,
        medications: fields.medications.toLowerCase(),
        temperature: vitals.temperature,
        heartrate: vitals.heartRate,
        resprate: vitals.respirationRate,
        o2sat: vitals.oxygenSat,
        sbp: vitals.systolicBP,
        dbp: vitals.diastolicBP,
        pain: painScale,
        gender: patient?.biologicalSex.toLowerCase(),
        arrivaltransport: "unknown"
      };
      console.log("payload is",payload)

      const response = await fetch('http://ec2-52-54-167-35.compute-1.amazonaws.com/evaluateTriage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log("response is", response);
      const result = await response.json();
      console.log("result", result);
      setResponse(result);

      // Dispatch the mergeMedicalData action to store the merged data in the Redux store
      dispatch(
        mergeMedicalData({
          identificationNumber: identificationNumber || '',
          medications: fields.medications,
          history: fields.history,
        })
      );

      // Dispatch the setAcuityDiagnosis action to store the acuity level and preliminary diagnosis
      dispatch(setAcuityDiagnosis({
        acuityLevel: result.triage_level,
        preliminaryDiagnosis: result.preliminary_diagnoses,
      }));

      // Navigate to the summary page
      router.push(`/summary/${identificationNumber}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
      setFields({
        medications: '',
        history: patient?.medicalHistory || '',
        remarks: '',
      });
    }
  };

  const handleToggleListening = (field: FieldNames) => {
    if (isListening && activeField === field) {
      stopListening();
      setIsListening(false);
      setActiveField('');
    } else {
      startListening();
      setIsListening(true);
      setActiveField(field);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name as FieldNames]: value,
    }));
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-5 pt-20">
          <form ref={formRef} className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="medications" className="font-semibold">Medications:</label>
              <div className="relative">
                <textarea
                  id="medications"
                  name="medications"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={fields.medications}
                  onChange={handleInputChange}
                  disabled={isListening && activeField === 'medications'}
                ></textarea>
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => handleToggleListening('medications')}
                >
                  {isListening && activeField === 'medications' ? (
                    <FaMicrophoneSlash className="text-red-600" />
                  ) : (
                    <FaMicrophone className="text-blue-600" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="past-history" className="font-semibold">Past History (Medical History):</label>
              <div className="relative">
                <textarea
                  id="past-history"
                  name="history"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={fields.history}
                  onChange={handleInputChange}
                  disabled={isListening && activeField === 'history'}
                ></textarea>
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => handleToggleListening('history')}
                >
                  {isListening && activeField === 'history' ? (
                    <FaMicrophoneSlash className="text-red-600" />
                  ) : (
                    <FaMicrophone className="text-blue-600" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="additional-remarks" className="font-semibold">Additional Remarks:</label>
              <div className="relative">
                <textarea
                  id="additional-remarks"
                  name="remarks"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={fields.remarks}
                  onChange={handleInputChange}
                  disabled={isListening && activeField === 'remarks'}
                ></textarea>
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => handleToggleListening('remarks')}
                >
                  {isListening && activeField === 'remarks' ? (
                    <FaMicrophoneSlash className="text-red-600" />
                  ) : (
                    <FaMicrophone className="text-blue-600" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Assess Triage
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicationsAndHistory;
