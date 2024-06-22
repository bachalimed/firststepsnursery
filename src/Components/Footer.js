import React from 'react'
import { HiOutlineSearch } from 'react-icons/hi';


const Footer = () => {
  return (
    <div className='flex justify-between h-24 items-center border-b border-gray-200'>
      This is the footer component
      <div className='relative'>
      <HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3'/>
        <input
        type='text'
        placeholder='search'
        className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'   />
      </div>
      
    </div>
  )
};
export default Footer;