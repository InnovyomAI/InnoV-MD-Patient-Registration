"use client";

import React, { useState } from 'react';

const Input = ({ name, placeholder, ariaLabel, inputType, ...props }) => {
  const [type, setType] = useState(inputType);
  const [value, setValue] = useState('');

  const handleFocus = () => {
    if (inputType === 'date') {
      setType('date');
    }
  };

  const handleBlur = () => {
    if (inputType === 'date' && value) {
      const date = new Date(value);
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
      setValue(formattedDate);
      setType('text');
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <input
      className="font-poppins appearance-none bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-[rgba(0,0,0,0.25)] w-full text-gray-700 placeholder:text-[#41414130] py-1 px-1 mt-6 outline-none text-1xl"
      type={type}
      name={name}
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={value}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      {...props}
    />
  );
};

export default Input;
