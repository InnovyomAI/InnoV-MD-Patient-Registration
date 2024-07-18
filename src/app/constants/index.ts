export const GenderOptions = ["Male", "Female", "Other"];

export const IdentificationTypes = [
  "healthCardNumber",
  "provincialID",
  "passport",
  "drivingLicense",
];

export const PatientFormDefaultValues = {
  identificationNumber: "",
  identificationType: "healthCardNumber",
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





