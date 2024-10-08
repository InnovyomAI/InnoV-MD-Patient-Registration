import Image from "next/image";
import Link from "next/link";

import  LoginForm  from "../app/components/forms/Loginform";

const Home = ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          {/* <h1>InnovMD</h1> */}

          <LoginForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 InnovMD
            </p>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/registration-nurse.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;