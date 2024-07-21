"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../components/Form";
import { SelectItem } from "../components/SelectItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { GenderOptions, IdentificationTypes, PreferredPronouns } from "../constants/index";
import { PatientFormValidation } from "../lib/validation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../components/CustomFormField";
import SubmitButton from "../components/SubmitButton";
import useSpeechToText from '../hooks/useSpeechToText';

const registerPatient = async (patientData: any) => {
  const response = await fetch("/api/newPatient", {
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

const PatientRegistrationForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { text: speechToText, isListening, startListening, stopListening } = useSpeechToText();
  const [inputText, setInputText] = useState('');

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation)
  });

  useEffect(() => {
    if (isListening) {
      setInputText(prevText => prevText + ' ' + speechToText);
    }
  }, [speechToText]);

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      const newPatient = await registerPatient(values); // API call for registering patient

      if (newPatient) {
        setSuccessMessage(`Registration successful! Your ID is ${newPatient.registrationId}`);
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
            <h1 className="header">New Patient Registration</h1>
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
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="preferredPronouns"
              label="Preferred Pronouns"
              placeholder="Select preferred pronouns"
            >
              {PreferredPronouns.map((option, i) => (
                <SelectItem key={option + i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14 street, New york, NY - 5101"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's name"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="(555) 123-4567"
            />

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

          <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
        </form>
      </Form>
      {successMessage && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-green-600 text-white text-center">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default PatientRegistrationForm;
