import Image from "next/image";
import { redirect } from "next/navigation";
import PatientRegistrationForm from "../components/forms/PatientRegistrationForm";



const RegisterNewPatient = async () => {


  return (
    <div className="flex h-screen max-h-screen">
      <section className="container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
       

          <PatientRegistrationForm  />

        </div>
      </section>

    </div>
  );
};

export default RegisterNewPatient;
