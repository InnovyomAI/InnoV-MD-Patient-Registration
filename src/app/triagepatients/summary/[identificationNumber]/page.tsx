'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/store/store';
import Modal from '../../../components/Modal';

const calculateAge = (birthdate: string) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
};

const Summary: React.FC = () => {
  const router = useRouter();
  const patient = useSelector((state: RootState) => state.patient.activeTriagePatient);
  const vitals = useSelector((state: RootState) => state.patient.vitals[patient?.identificationNumber!]);
  const acuityLevel = useSelector((state: RootState) => state.patient.acuityLevel);
  const chiefComplaints = useSelector((state: RootState) => state.patient.symptoms[patient?.identificationNumber!]);
  const preliminaryDiagnosis = useSelector((state: RootState) => state.patient.preliminaryDiagnosis);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const chiefComplaintText = chiefComplaints ? chiefComplaints.join(', ') : '';
  const age = calculateAge(patient.dateOfBirth);

  const handleAuthorizeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmModal = () => {
    setIsModalOpen(false);
    router.push('/patientwaitinglist');
  };

  return (
    <div className="bg-white p-8 shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Final Assessment Report</h1>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Patient Profile:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>Name: {patient.firstName} {patient.lastName}</div>
              <div>Age: {age}</div>
              <div>Sex: {patient.biologicalSex}</div>
              <div>Preferred Pronouns: {patient.preferredPronouns}</div>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Vital Stats:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>Temperature: {vitals.temperature}°F</div>
              <div>Heart Rate: {vitals.heartRate} bpm</div>
              <div>Blood Pressure: {vitals.systolicBP}/{vitals.diastolicBP} mmHg</div>
              <div>Respiration Rate: {vitals.respirationRate} breaths/min</div>
              <div>Oxygen Saturation: {vitals.oxygenSat}%</div>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Chief Complaints:</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue={chiefComplaintText}
              readOnly
            ></textarea>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Medications:</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue={patient.drugHistory}
              readOnly
            ></textarea>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Past Medical History:</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue={patient.medicalHistory}
              readOnly
            ></textarea>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Additional Notes:</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue="No known allergies. Patient to undergo further diagnostic tests."
              readOnly
            ></textarea>
          </section>
        </div>

        <div>
          <section className="mb-4">
            <div className="flex items-center justify-center h-48 w-48 mx-auto border-4 border-gray-300 rounded-full">
              <span className="text-5xl font-bold">{acuityLevel}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Acuity Level</h2>
            <p className="text-center">This level indicates the severity of the patient's condition.</p>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Preliminary Diagnosis:</h2>
            <p>{preliminaryDiagnosis}</p>
          </section>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Override</button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleAuthorizeClick}
        >
          Authorize
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />
    </div>
  );
};

export default Summary;
