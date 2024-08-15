"use client";

import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import { AiOutlineHistory } from "react-icons/ai";
import { AiOutlineProfile } from "react-icons/ai";
import { TbHeartRateMonitor } from "react-icons/tb";
import { RiProfileLine } from "react-icons/ri";
import { MdOutlineReportProblem, MdOutlineMedication, MdOutlineSummarize } from "react-icons/md";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SideNavbar() {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col bg-white shadow-lg w-50 mt-10">
      <Disclosure as="nav">
        <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white lg:hidden">
          <GiHamburgerMenu className="block h-6 w-6" aria-hidden="true" />
        </Disclosure.Button>
        <div className="p-6 w-full">
          <div className="flex flex-col justify-start items-center">
            <div className="my-4 border-b border-gray-200 pb-4 w-full">
              <Link href="/patientwaitinglist">
                <div className={`flex mb-4 justify-start items-center gap-4 p-2 rounded-md cursor-pointer transition-colors duration-200 ${pathname === '/patientwaitinglist' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-300'}`}>
                  <AiOutlineProfile className="text-2xl" />
                  <span className="text-base font-semibold">
                    Patient Waitinglist
                  </span>
                </div>
              </Link>
              <Link href="/patientprofile">
                <div className={`flex mb-4 justify-start items-center gap-4 p-2 rounded-md cursor-pointer transition-colors duration-200 ${pathname === '/patientprofile' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-300'}`}>
                  <RiProfileLine className="text-2xl" />
                  <span className="text-base font-semibold">
                    Patient Profile
                  </span>
                </div>
              </Link>
              <Link href="/vitalstats">
                <div className={`flex mb-4 justify-start items-center gap-4 p-2 rounded-md cursor-pointer transition-colors duration-200 ${pathname === '/vitalstats' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-300'}`}>
                  <TbHeartRateMonitor className="text-2xl" />
                  <span className="text-base font-semibold">
                    Vital Statistics
                  </span>
                </div>
              </Link>
              <Link href="/chiefcomp">
                <div className={`flex mb-4 justify-start items-center gap-4 p-2 rounded-md cursor-pointer transition-colors duration-200 ${pathname === '/chiefcomp' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-300'}`}>
                  <MdOutlineReportProblem className="text-2xl" />
                  <span className="text-base font-semibold">
                    Chief Complaints
                  </span>
                </div>
              </Link>
              <Link href="/medicalhistory">
                <div className={`flex mb-4 justify-start items-center gap-4 p-2 rounded-md cursor-pointer transition-colors duration-200 ${pathname === '/medicalhistory' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-300'}`}>
                  <MdOutlineMedication className="text-2xl" />
                  <span className="text-base font-semibold">
                    Medical & Past History
                  </span>
                </div>
              </Link>
              <Link href="/summary">
                <div className={`flex mb-4 justify-start items-center gap-4 p-2 rounded-md cursor-pointer transition-colors duration-200 ${pathname === '/summary' ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-300'}`}>
                  <MdOutlineSummarize className="text-2xl" />
                  <span className="text-base font-semibold">
                    Summary
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default SideNavbar;
