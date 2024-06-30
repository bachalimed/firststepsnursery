import React from 'react'
import { HiOutlineSearch } from 'react-icons/hi';


const Footer = () => {
  const today= new Date();
  return (
    <footer className='flex  h-24 place-content-center border-b border-gray-200'>
      <p>
        {today.getFullYear()}
      </p>
      
      
    </footer>
  )
};
export default Footer;