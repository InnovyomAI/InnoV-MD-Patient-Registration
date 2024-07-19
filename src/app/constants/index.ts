export const GenderOptions = ["Male", "Female", "Other"];

export const IdentificationTypes = [
  "Healthcard Number",
  "Provincial ID",
  "Passport",
  "Driving License",
];

export const PreferredPronouns = [
  "He/Him",
  "She/Her",
  "They/Them",
  "Ze/Hir",
  "Xe/Xem",
];

export const PatientFormDefaultValues = {
  identificationNumber: "",
  identificationType: "Healthcard Number",
  firstName: "",
  lastName: "",
  dateOfBirth: new Date(Date.now()),
  biologicalSex: "Male",
  preferredPronouns: "",
  phoneNumber: "",
  email: "",
  address: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  chiefComplaints:""
};





