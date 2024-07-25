"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../form";
import { SelectItem } from "../select";
import { GenderOptions, IdentificationTypes, PreferredPronouns } from "../../constants/index";
import { PatientFormValidation } from "../../lib/validation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

const registerPatient = async (patientData: any) => {
  const response = await fetch("http://127.0.0.1:5000/app_new_reg", {
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

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
  });
  const handleStartClick = () => {
    setSuccessMessage(null);
    form.reset();
  };
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      const newPatient = await registerPatient(values); // API call for registering patient
      console.log("newpatinet",newPatient)
      if (newPatient) {
        console.log("new patient values",newPatient)
        setSuccessMessage(`Registration successful! Your ID is ${newPatient.registrationId}`);
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };
  

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
          <section className="space-y-4">
            <h1 className="header ">New Patient Registration</h1>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verification</h2>
            </div>

            {/* Identification Type */}
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

            {/* Identification Number */}
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

            {/* First Name & Last Name */}
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

            {/* Email & Phone */}
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

            {/* BirthDate & Gender */}
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

            {/* Preferred Pronouns */}
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

            {/* Address */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14 street, New york, NY - 5101"
            />

            {/* Emergency Contact Name & Number */}
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

            {/* Chief Complaints */}
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="chiefComplaints"
              label="Chief Complaints"
              placeholder="Describe any chief complaints"
            />
          </section>

          <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
        </form>
      </Form>
      {successMessage && (
        <div className="mt-4 text-blue-600">
          <button
            type="button"
            onClick={handleStartClick}
            className="w-full px-4 py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Start
          </button>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PatientRegistrationForm;
