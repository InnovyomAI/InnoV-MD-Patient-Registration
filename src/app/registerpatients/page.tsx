"use client";
import { useState } from "react";
import PatientRegistrationForm from "../";
import ExistingPatientRegistrationForm from "../components/shared/forms/ExistingPatientRegistrationForm"; // Assuming you have this component

const RegisterNewPatient = () => {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="flex h-screen max-h-screen">
      <style jsx global>{`
        .container {
          overflow-y: auto;
        }
        .container::-webkit-scrollbar {
          display: none;
        }
        .container {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .main-content {
          padding-top: 64px; /* Adjust this value according to the height of your navbar */
        }
      `}</style>

      <section className="container main-content">
        <div className="max-w-[860px] flex-1 flex-col py-10">
          <div className="tabs flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 ${activeTab === "existing" ? "bg-[#005477] text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab("existing")}
            >
              Existing Patient Registration
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "new" ? "bg-[#005477] text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab("new")}
            >
              New Patient Registration
            </button>
          </div>

          {activeTab === "new" && <PatientRegistrationForm />}
          {activeTab === "existing" && <ExistingPatientRegistrationForm />}
        </div>
      </section>

      {/* Optional: You can add an image or additional content here */}
      {/* <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      /> */}
    </div>
  );
};

export default RegisterNewPatient;
