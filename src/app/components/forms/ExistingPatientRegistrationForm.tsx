import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../form";
import { SelectItem } from "../select";
import { GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "../../constants/index";
import { PatientFormValidation } from "../../lib/validation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

const fetchPatientData = async (identificationType:any, identificationNumber:any) => {
  // Replace this with your actual API call
  return {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phoneNumber: "+1(306) 123-4567",
    dateOfBirth: new Date("1990-01-01"),
    biologicalSex: "Male",
    preferredPronouns: "He/Him",
    address: "14 street, New York, NY - 5101",
    emergencyContactName: "Jane Doe",
    emergencyContactNumber: "913067179259",
    chiefComplaints: "Headache and fever", // Example data
  };
};

const ExisitingPatientRegistrationForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      // const newPatient = await registerPatient(values);
      const newPatient = { id: '12345', message: 'Registration successful!' }; // Example response

      if (newPatient) {
        setSuccessMessage(`Registration successful! Your ID is ${newPatient.id}`);
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
        form.reset(patientData);
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
            <h1 className="header">Existing Patient Registration</h1>
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
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="preferredPronouns"
              label="Preferred Pronouns"
              placeholder="e.g., He/Him, She/Her, They/Them"
            />

            {/* Address */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Home address"
              placeholder="14 street, New York, NY - 5101"
              iconAlt="address"
            />

            {/* Emergency Contact */}
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

            {/* Chief Complaints */}
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="chiefComplaints"
              label="Chief Complaints"
              placeholder="Describe any chief complaints"
            />
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
