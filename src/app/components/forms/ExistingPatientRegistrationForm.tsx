"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Form } from "../components/Form";
import { SelectItem } from "../components/SelectItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "../constants/index";
import { PatientFormValidation } from "../lib/validation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../components/CustomFormField";
import SubmitButton from "../components/SubmitButton";
import useSpeechToText from '../hooks/useSpeechToText';

const fetchPatientData = async (identificationType: any, identificationNumber: any) => {
  const response = await fetch(`/api/fetchExisting`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identificationType, identificationNumber }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch patient data");
  }
  return await response.json();
};

const registerPatient = async (patientData: any) => {
  const response = await fetch("/api/insertExisting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });
  if (!response.ok) {
    throw new Error("Failed to register patient");
  }
  return await response.json();
};

const ExisitingPatientRegistrationForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { text: speechToText, isListening, startListening, stopListening } = useSpeechToText();
  const [inputText, setInputText] = useState('');

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
  });

  useEffect(() => {
    if (isListening) {
      setInputText(prevText => prevText + ' ' + speechToText);
    }
  }, [speechToText]);

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      const newPatient = await registerPatient(values);

      if (newPatient) {
        setSuccessMessage(`Registration successful! Your ID is ${newPatient.registrationId}`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const onSearch = async () => {
    const identificationType = form.getValues("identificationType");
    const identificationNumber = form.getValues("identificationNumber");

    if (!identificationType || !identificationNumber) {
      alert("Please provide both identification type and number.");
      return;
    }

    setIsLoading(true);

    try {
      const patientData = await fetchPatientData(identificationType, identificationNumber);

      if (patientData) {
        form.reset(patientData.data);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
          <section className="space-y-4">
            <h1 className="header">Existing Patient Registration</h1>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verification</h2>
            </div>

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="identificationType"
              label="Identification Type"
              placeholder="Select identification type"
            >
              {IdentificationTypes.map((type, i) => (
                <SelectItem key={type + i} value={type}>
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="identificationNumber"
              label="Identification Number"
              placeholder="123456789"
            />
            <button
              type="button"
              onClick={onSearch}
              className="w-full px-4 py-2 bg-green-550 text-white rounded-md hover:bg-blue-600"
            >
              Search
            </button>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="John"
                iconAlt="user"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                iconAlt="user"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email address"
                placeholder="johndoe@gmail.com"
                iconAlt="email"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="dateOfBirth"
                label="Date of birth"
                placeholder="MM/DD/YYYY"
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="biologicalSex"
                label="Biological Sex"
                placeholder="Select biological sex"
              >
                {GenderOptions.map((option, i) => (
                  <SelectItem key={option + i} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="preferredPronouns"
              label="Preferred Pronouns"
              placeholder="e.g., He/Him, She/Her, They/Them"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Home address"
              placeholder="14 street, New York, NY - 5101"
              iconAlt="address"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency Contact Name"
                placeholder="Jane Doe"
                iconAlt="user"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency Contact Number"
                placeholder="(555) 987-6543"
              />
            </div>

            <div className="relative w-full">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="chiefComplaints"
                label="Chief Complaints"
                placeholder="Describe any chief complaints"
                value={inputText} // Bind the input text to the state
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)} // Handle manual changes
                disabled={isListening} // Disable input when listening
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={handleToggleListening}
              >
                {isListening ? (
                  <FontAwesomeIcon icon={faMicrophoneSlash} className="text-red-600" />
                ) : (
                  <FontAwesomeIcon icon={faMicrophone} className="text-blue-600" />
                )}
              </span>
            </div>
          </section>

          <section className="flex justify-between gap-6">
            <SubmitButton isLoading={isLoading}>Register</SubmitButton>
          </section>
        </form>
      </Form>

      {successMessage && (
        <div className="mt-4 text-green-600">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ExisitingPatientRegistrationForm;
