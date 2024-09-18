import React from 'react'
// import { HiOutlineSearch } from 'react-icons/hi'


const PublicFooter = () => {
  const today= new Date()
  return (
    <footer className='flex  h-24 place-content-center border-b border-gray-200'>

      <p> Footer:
        submit inquiry with field, provide your contact email, phone, name
      </p>
      <p>
        {today.getFullYear()}
      </p>
      
      
    </footer>
  )
}
export default PublicFooter