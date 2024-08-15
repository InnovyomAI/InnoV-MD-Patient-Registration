// components/ProfileForm.js
"use client";

import React from 'react';
import styles from './ProfileForm.module.css';
import { useRouter } from 'next/navigation';

const ProfileForm = () => {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/vitalstats');
  };

  const handleReset = (e) => {
    e.preventDefault();
    document.getElementById('profile-form').reset();
  };

  return (
    <form id="profile-form" className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="health-card">Health Card no./Personal ID no.:</label>
      <input type="text" id="health-card" name="health-card" />

      <label htmlFor="first-name">Name (First):</label>
      <input type="text" id="first-name" name="first-name" />

      <label htmlFor="last-name">Last Name:</label>
      <input type="text" id="last-name" name="last-name" />

      <label htmlFor="dob">Date of Birth:</label>
      <input type="text" id="dob" name="dob" placeholder="DD:MM:YYYY" />

      <label htmlFor="gender">Biological Gender:</label>
      <select id="gender" name="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="phone">Phone number:</label>
      <input type="text" id="phone" name="phone" />

      <label htmlFor="address">Address:</label>
      <input type="text" id="address" name="address" />

      <label htmlFor="kin">Next of Kin:</label>
      <input type="text" id="kin" name="kin" />

      <div className={styles.buttons}>
        <button type="reset" onClick={handleReset}>Reset</button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default ProfileForm;
