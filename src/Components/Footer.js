import React from 'react'


const Footer = () => {
  return (
    <div className='flex justify-between h-24 items-center'>
      This is the footer component
      <div>
        <input
        type='text'
        placeholder='search'
        className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-200'    />
      </div>
      
    </div>
  )
};
export default Footer;