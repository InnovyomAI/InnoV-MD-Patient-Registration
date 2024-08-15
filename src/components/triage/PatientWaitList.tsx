'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSelectedPatientId, fetchPatientDetails } from '../lib/store/patientSlice';
import { AppDispatch } from '../lib/store/store';

type Patient = {
  registrationId: number;
  firstName: string;
  lastName: string;
  preferredPronouns: string;
  registrationTime: string;
  time_waiting: string;
  chiefComplaints: string;
  identificationNumber: string;
  identificationType: string;
};

type Props = {
  patients: Patient[];
};

const PatientWaitList: React.FC<Props> = ({ patients }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const handleRowClick = (patient: Patient, index: number) => {
    setSelectedRow(index);
    dispatch(setSelectedPatientId(patient.identificationNumber));
    dispatch(fetchPatientDetails({ identificationNumber: patient.identificationNumber }));
    router.push(`/patientprofile/${patient.identificationNumber}`);
  };

  return (
    <div className="flex flex-col">
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700">Waiting</h2>
            <p className="text-3xl text-gray-900">4</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700">Triage Completed</h2>
            <p className="text-3xl text-gray-900">1</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-700">Total Patients</h2>
            <p className="text-3xl text-gray-900">5</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="border rounded-lg divide-y divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="py-4 px-6 text-start text-sm font-medium text-gray-500 uppercase">
                      S.No
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-sm font-medium text-gray-500 uppercase">
                      First Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-sm font-medium text-gray-500 uppercase">
                      Last Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-sm font-medium text-gray-500 uppercase">
                      Pronouns
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-sm font-medium text-gray-500 uppercase">
                      Waiting Since
                    </th>
                    <th scope="col" className="px-6 py-4 text-start text-sm font-medium text-gray-500 uppercase">
                      Chief Complaint
                    </th>
                    <th scope="col" className="px-6 py-4 text-end text-sm font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {patients.map((patient, index) => (
                    <tr
                      key={patient.registrationId}
                      onClick={() => handleRowClick(patient, index)}
                      className={`cursor-pointer ${selectedRow === index ? 'bg-blue-200' : 'hover:bg-blue-100'}`}
                    >
                      <td className="py-4 px-6 whitespace-nowrap text-base font-medium text-gray-800 dark:text-gray-200">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800 dark:text-gray-200">
                        {patient.firstName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800 dark:text-gray-200">
                        {patient.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800 dark:text-gray-200">
                        {patient.preferredPronouns}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800 dark:text-gray-200">
                        {patient.time_waiting}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800 dark:text-gray-200">
                        {patient.chiefComplaints}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-base font-medium">
                        <button
                          type="button"
                          className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        >
                          Assess
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientWaitList;
