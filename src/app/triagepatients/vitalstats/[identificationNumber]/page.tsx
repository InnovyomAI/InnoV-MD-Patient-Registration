'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../lib/store/store';
import { setVitals } from '../../../lib/store/patientSlice';
import Input from "@/components/shared/input";

const VitalStats = () => {
  const router = useRouter();
  const patient = useSelector((state: RootState) => state.patient.activeTriagePatient);
  const dispatch = useDispatch<AppDispatch>();
  const formRef = useRef<HTMLFormElement>(null);

  const [vitals, setVitalsState] = useState({
    temperature: '',
    heartRate: '',
    respirationRate: '',
    systolicBP: '',
    diastolicBP: '',
    oxygenSat: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setVitalsState(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("pressessss",patient)
    if(patient){
      const identificationNumber = patient.identificationNumber;
      dispatch(setVitals({ identificationNumber, vitals }));
      router.push(`/chiefcomp/${patient.identificationNumber}`);
    }
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setVitalsState({
      temperature: '',
      heartRate: '',
      respirationRate: '',
      systolicBP: '',
      diastolicBP: '',
      oxygenSat: ''
    });
  };

  const updateBar = (value: number, normalMin: number, normalMax: number, lowMin: number, warnMin: number, warnMax: number, highMax: number) => {
    if (isNaN(value)) return { width: '0%', backgroundColor: 'transparent' };

    let percentage;
    let backgroundColor;
    if (value <= lowMin || value > highMax) {
      backgroundColor = 'red';
      percentage = (value - Math.min(lowMin, 0)) / (highMax - Math.min(lowMin, 0)) * 100;
    } else if ((value >= lowMin && value < warnMin) || (value >= warnMax && value <= highMax)) {
      backgroundColor = 'orange';
      percentage = (value - lowMin) / (highMax - lowMin) * 100;
    } else {
      backgroundColor = 'green';
      percentage = (value - lowMin) / (highMax - lowMin) * 100;
    }

    return { width: `${Math.min(100, Math.max(0, percentage))}%`, backgroundColor };
  };

  const updateO2SatBar = (value: number, normalMin: number, normalMax: number, lowMin: number) => {
    if (isNaN(value) || value > 100) return { width: '0%', backgroundColor: 'transparent' };

    let percentage;
    let backgroundColor;
    if (value <= lowMin) {
      backgroundColor = 'red';
      percentage = value;
    } else if (value > lowMin && value < normalMin) {
      backgroundColor = 'orange';
      percentage = value;
    } else if (value >= normalMin && value <= normalMax) {
      backgroundColor = 'green';
      percentage = value;
    } else {
      backgroundColor = 'transparent';
      percentage = 0;
    }

    return { width: `${Math.min(100, Math.max(0, percentage))}%`, backgroundColor };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center mt-10 pt-5 pb-5">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-lg">
        <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-center">Vital Statistics Entry</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="temperature" className="block text-sm font-poppins text-gray-700">Temperature (°F):</label>
              <Input
                type="number"
                id="temperature"
                name="temperature"
                placeholder="Enter temperature"
                ariaLabel="Temperature"
                inputType="number"
                value={vitals.temperature}
                onChange={handleChange}
              />
              <div className="h-2 bg-gray-200 rounded mt-1">
                <div className="h-full rounded" style={updateBar(Number(vitals.temperature), 97, 98.9, 93, 97, 99, 100)}></div>
              </div>
            </div>
            <div>
              <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 font-poppins">Heart Rate (bpm):</label>
              <Input
                type="number"
                id="heartRate"
                name="heartRate"
                placeholder="Enter heart rate"
                ariaLabel="Heart Rate"
                inputType="number"
                value={vitals.heartRate}
                onChange={handleChange}
              />
              <div className="h-2 bg-gray-200 rounded mt-1">
                <div className="h-full rounded" style={updateBar(Number(vitals.heartRate), 70, 90, 50, 70, 90, 110)}></div>
              </div>
            </div>
            <div>
              <label htmlFor="respirationRate" className="block text-sm font-medium font-poppins text-gray-700">Respiration Rate (breaths/min):</label>
              <Input
                type="number"
                id="respirationRate"
                name="respirationRate"
                placeholder="Enter respiration rate"
                ariaLabel="Respiration Rate"
                inputType="number"
                value={vitals.respirationRate}
                onChange={handleChange}
              />
              <div className="h-2 bg-gray-200 rounded mt-1">
                <div className="h-full rounded" style={updateBar(Number(vitals.respirationRate), 15, 20, 11, 15, 20, 25)}></div>
              </div>
            </div>
            <div>
              <label htmlFor="systolicBP" className="block text-sm font-medium font-poppins text-gray-700">Systolic Blood Pressure (mm Hg):</label>
              <Input
                type="number"
                id="systolicBP"
                name="systolicBP"
                placeholder="Enter systolic blood pressure"
                ariaLabel="Systolic Blood Pressure"
                inputType="number"
                value={vitals.systolicBP}
                onChange={handleChange}
              />
              <div className="h-2 bg-gray-200 rounded mt-1">
                <div className="h-full rounded" style={updateBar(Number(vitals.systolicBP), 90, 120, 80, 90, 120, 130)}></div>
              </div>
            </div>
            <div>
              <label htmlFor="diastolicBP" className="block text-sm font-medium font-poppins text-gray-700">Diastolic Blood Pressure (mm Hg):</label>
              <Input
                type="number"
                id="diastolicBP"
                name="diastolicBP"
                placeholder="Enter diastolic blood pressure"
                ariaLabel="Diastolic Blood Pressure"
                inputType="number"
                value={vitals.diastolicBP}
                onChange={handleChange}
              />
              <div className="h-2 bg-gray-200 rounded mt-1">
                <div className="h-full rounded" style={updateBar(Number(vitals.diastolicBP), 60, 80, 55, 60, 80, 90)}></div>
              </div>
            </div>
            <div>
              <label htmlFor="oxygenSat" className="block text-sm font-medium font-poppins text-gray-700">Oxygen Saturation (%):</label>
              <Input
                type="number"
                id="oxygenSat"
                name="oxygenSat"
                placeholder="Enter oxygen saturation"
                ariaLabel="Oxygen Saturation"
                inputType="number"
                value={vitals.oxygenSat}
                onChange={handleChange}
              />
              <div className="h-2 bg-gray-200 rounded mt-1">
                <div className="h-full rounded" style={updateO2SatBar(Number(vitals.oxygenSat), 95, 100, 89)}></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded">Reset</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VitalStats;
