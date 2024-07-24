
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import innovmdLogo from "../../../public/assets/images/innovmd_logo.png";
import { FaBars } from "react-icons/fa";

export const NavLinks = [
  { href: '/registration', key: 'Registration', text: 'Registration' },
  { href: '/assessment', key: 'Assessment', text: 'Assessment' },
  { href: '/contact-support', key: 'Contact Support', text: 'Contact Support' },
];

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-[#005477] shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" passHref>
              <Image src={innovmdLogo} alt="Innov-MD Logo" className="h-16 w-auto" />
            </Link>
          </div>
          <div className="hidden lg:flex space-x-4">
            {NavLinks.map((link) => (
              <Link href={link.href} key={link.key} passHref>
                <span className="text-white font-poppins hover:text-gray-300 cursor-pointer">{link.text}</span>
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={toggleProfileMenu} className="focus:outline-none">
                  <Image src={profileImage} width={40} height={40} alt="Profile" className="rounded-full cursor-pointer" />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 font-bold uppercase"
                onClick={handleLogin}
              >
                Sign In
              </button>
            )}
          </div>
          <div className="lg:hidden flex items-center">
            <button onClick={toggleMenu}>
              <FaBars className="text-white w-8 h-8 cursor-pointer" /> {/* Use the menu icon */}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden bg-[#005477]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NavLinks.map((link) => (
              <Link href={link.href} key={link.key} passHref>
                <span className="text-white block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 cursor-pointer">{link.text}</span>
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="px-3 py-2">
                <button
                  className="bg-green-700 text-white w-full px-4 py-2 rounded-full hover:bg-green-800 font-bold uppercase"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
                <div className="mt-2 flex justify-center">
                  <Image src={profileImage} width={40} height={40} alt="Profile" className="rounded-full" />
                </div>
              </div>
            ) : (
              <div className="px-3 py-2">
                <button
                  className="bg-green-700 text-white w-full px-4 py-2 rounded-full hover:bg-green-800 font-bold uppercase"
                  onClick={handleLogin}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
