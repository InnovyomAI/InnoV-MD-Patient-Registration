'use client';

import React, { useEffect, useState } from 'react';
import PatientWaitList from '../../components/PatientWaitList';

const PatientWaitingListPage: React.FC = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('https://s9wm5sg3bd.execute-api.us-east-1.amazonaws.com/fetch_waiting_patients');
        const data = await response.json();
        if (data.statusCode === 200) {
          console.log("data is", data);
          setPatients(data.data);
        } else {
          console.error('Error fetching patients:', data.message);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen flex flex-col mt-10">
      <PatientWaitList patients={patients} />
    </div>
  );
};

export default PatientWaitingListPage;
