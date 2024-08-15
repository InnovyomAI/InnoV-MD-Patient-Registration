"use client";
import React, { useState } from 'react';

interface PatientInfo {
  name: string;
  age: number;
  sex: string;
  preferredPronouns: string;
  vitalStats: string;
  chiefComplaints: string;
  pastHistory: string;
  additionalRemarks: string;
  triageLevel: string;
  preliminaryDiagnosis: string;
}

const initialPatientInfo: PatientInfo = {
  name: "John Doe",
  age: 35,
  sex: "Male",
  preferredPronouns: "He/Him",
  vitalStats: "BP: 120/80, HR: 75",
  chiefComplaints: "Headache, Fever",
  pastHistory: "None",
  additionalRemarks: "N/A",
  triageLevel: "3",
  preliminaryDiagnosis: "Migraine"
};

const Summary = () => {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(initialPatientInfo);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleOverrideClick = () => {
    setIsEditable(true);
  };

  const handleReTriageClick = () => {
    // Logic to re-run the model with the current inputs
    console.log('Re-running the model with:', patientInfo);
  };

  const handleAuthorizeSubmitClick = () => {
    // Logic to submit the data to the database
    console.log('Submitting:', patientInfo);
    // Go to the patient info of the next patient in line (dummy logic)
    setPatientInfo(initialPatientInfo);
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Patient Summary</h1>
      <div className="space-y-4">
        {[
          { label: 'Name', name: 'name', value: patientInfo.name, type: 'text' },
          { label: 'Age', name: 'age', value: patientInfo.age, type: 'number' },
          { label: 'Sex', name: 'sex', value: patientInfo.sex, type: 'text' },
          { label: 'Preferred Pronouns', name: 'preferredPronouns', value: patientInfo.preferredPronouns, type: 'text' },
          { label: 'Vital Stats', name: 'vitalStats', value: patientInfo.vitalStats, type: 'text' },
          { label: 'Chief Complaints', name: 'chiefComplaints', value: patientInfo.chiefComplaints, type: 'text' },
          { label: 'Past History', name: 'pastHistory', value: patientInfo.pastHistory, type: 'text' },
          { label: 'Additional Remarks', name: 'additionalRemarks', value: patientInfo.additionalRemarks, type: 'text' },
          { label: 'Triage Level', name: 'triageLevel', value: patientInfo.triageLevel, type: 'text' },
          { label: 'Preliminary Diagnosis', name: 'preliminaryDiagnosis', value: patientInfo.preliminaryDiagnosis, type: 'text' },
        ].map(({ label, name, value, type }) => (
          <div key={name}>
            <h2 className="font-semibold">{label}:</h2>
            {isEditable ? (
              <input
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
              />
            ) : (
              <p>{value}</p>
            )}
          </div>
        ))}
        <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <button onClick={handleOverrideClick} className="bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto">
            Override
          </button>
          <button onClick={handleReTriageClick} className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">
            Re-Triage
          </button>
          <button onClick={handleAuthorizeSubmitClick} className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto">
            Authorize/Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
