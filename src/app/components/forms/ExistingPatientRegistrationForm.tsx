import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '../form';
import { SelectItem } from "../select";
import CustomFormField, { FormFieldType } from '../CustomFormField';
import { GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "../../constants/index";
import SubmitButton from '../SubmitButton';
import { PatientData } from '../../types/PatientData'; // Import the patient data type

const fetchPatientData = async (identificationNumber: string): Promise<PatientData> => {
  const response = await fetch('http://127.0.0.1:5000/Fetch-Patient-Data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identificationNumber }),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch patient data');
  }
  return await response.json();
};

const registerPatient = async (patientData: {
  firstName: string;
  lastName: string;
  identificationNumber: string;
  preferredPronouns?: string;
  chiefComplaints: string;
}) => {
  const response = await fetch('http://127.0.0.1:5000/Insert-Registration-Data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });
  if (!response.ok) {
    throw new Error('Failed to register patient');
  }
  return await response.json();
};

const ExistingPatientRegistrationForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      identificationNumber: '',
      firstName: '',
      lastName: '',
      preferredPronouns: '',
      chiefComplaints: '',
      dateOfBirth: '',
      biologicalSex: '',
      phoneNumber: '',
      email: '',
      address: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);

    const existingPatientValues = {
      firstName: values.firstName,
      lastName: values.lastName,
      identificationNumber: values.identificationNumber,
      preferredPronouns: values.preferredPronouns,
      chiefComplaints: values.chiefComplaints,
    };

    try {
      const newPatient = await registerPatient(existingPatientValues);
      console.log('new patient', newPatient);
      if (newPatient) {
        setSuccessMessage(`Registration successful! Your ID is ${newPatient.registrationId}`);
        form.reset({
          identificationNumber: '',
          firstName: '',
          lastName: '',
          preferredPronouns: '',
          chiefComplaints: '',
          dateOfBirth: '',
          biologicalSex: '',
          phoneNumber: '',
          email: '',
          address: '',
          emergencyContactName: '',
          emergencyContactNumber: '',
        });
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const onSearch = async () => {
    const identificationNumber = form.getValues('identificationNumber');

    if (!identificationNumber) {
      alert('Please provide the identification number.');
      return;
    }

    setIsLoading(true);

    try {
      const patientData:any = await fetchPatientData(identificationNumber);
      console.log('patient data', patientData["data"].address);
      if (patientData) {
        const dateOfBirth = new Date(patientData["data"].dateOfBirth);
        const formattedDateOfBirth = `${(dateOfBirth.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${dateOfBirth.getDate().toString().padStart(2, '0')}/${dateOfBirth.getFullYear()}`;

        form.reset({
          identificationNumber: patientData["data"].identificationNumber,
          firstName: patientData["data"].firstName,
          lastName: patientData["data"].lastName,
          preferredPronouns: patientData["data"].preferredPronouns || '',
          dateOfBirth: formattedDateOfBirth,
          biologicalSex: patientData["data"].biologicalSex,
          phoneNumber: patientData["data"].phoneNumber,
          email: patientData["data"].email,
          address: patientData["data"].address,
          emergencyContactName: patientData["data"].emergencyContactName,
          emergencyContactNumber: patientData["data"].emergencyContactNumber,
        });
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const handleStartClick = () => {
    setSuccessMessage(null);
    form.reset({
      identificationNumber: '',
      firstName: '',
      lastName: '',
      preferredPronouns: '',
      chiefComplaints: '',
      dateOfBirth: '',
      biologicalSex: '',
      phoneNumber: '',
      email: '',
      address: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
    });
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
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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

            {/* Preferred Pronouns */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="preferredPronouns"
              label="Preferred Pronouns"
              placeholder="e.g., He/Him, She/Her, They/Them"
            />

            {/* Date of Birth & Biological Sex */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="dateOfBirth"
                label="Date of Birth"
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

            {/* Phone Number & Email */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="(555) 123-4567"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="johndoe@gmail.com"
                iconAlt="email"
              />
            </div>

            {/* Address */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Home Address"
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

export default ExistingPatientRegistrationForm;
