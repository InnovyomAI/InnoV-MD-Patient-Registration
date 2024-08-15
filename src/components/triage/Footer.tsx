"use client";
import React from 'react'

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} - InnovMD</p>
    </footer>
  )
}

export default Footer
