
export type PatientData = {
    identificationNumber: string;
    identificationType: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    biologicalSex: string;
    preferredPronouns?: string;
    phoneNumber: string;
    email: string;
    address: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    chiefComplaints: string;
  };
  