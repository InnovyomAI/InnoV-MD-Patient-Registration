'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../lib/store/store';
import { fetchPatientDetails, setActiveTriagePatient } from '../../../lib/store/patientSlice';
import { useEffect } from 'react';
import Image from "next/image";
import dummyProfilePic from '../../../public/assets/images/profile-user.png'; 
import { useRouter, useParams } from 'next/navigation';


const PatientProfilePage  = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  //const { identificationNumber } = useParams();
  const identificationNumber = useSelector((state: RootState) => state.patient.selectedPatientId);
  const patient = useSelector((state: RootState) => state.patient.activeTriagePatient);
  const status = useSelector((state: RootState) => state.patient.status);
  const isTriagingActive = useSelector((state: RootState) => state.patient.isTriagingActive);

  useEffect(() => {
    console.log("patient is",patient)
    console.log("patient id",identificationNumber)
    if (!patient) {
      dispatch(fetchPatientDetails({ identificationNumber }));
    }
  }, [identificationNumber, dispatch, patient]);

  if (status === 'loading' || !patient) {
    return <div>Loading...</div>;
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleStartTriage = () => {
    dispatch(setActiveTriagePatient(patient));
    router.push(`/vitalstats/${patient.identificationNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl font-semibold text-center mb-8">Patient Profile</h1>
        <div className="flex items-center mb-8">
          <Image src={dummyProfilePic} alt="Profile Picture" width={120} height={120} className="rounded-full shadow-lg mr-6" />
          <div>
            <h2 className="text-1xl font-semibold">{patient.firstName} {patient.lastName}</h2>
            <p className="text-gray-500 text-1xl">Age: {calculateAge(patient.dateOfBirth)} years old</p>
            <p className="text-gray-500 text-1xl">Biological Gender: {patient.biologicalSex}</p>
            <p className="text-gray-500 text-1xl">Pronouns: {patient.preferredPronouns}</p>
            <p className="text-gray-500 text-1xl">Contact Number: {patient.phoneNumber}</p>
            <p className="text-gray-500 text-1xl">Address: {patient.address}</p>
          </div>
        </div>
        <button
          onClick={handleStartTriage}
          disabled={isTriagingActive}
          className={`bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-200 mt-4 ${isTriagingActive ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Start Triage
        </button>
      </div>
    </div>
  );
};

export default PatientProfilePage;
