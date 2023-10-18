import React from 'react'
import Fixtures from './components/Fixtures'
const Matches = () => {
  return (
    <div className='w-screen sm:flex sm:flex-col justify-center gap-2 sm:w-[1440px] sm:mx-auto '>
      <div className='flex justify-center'>
        <a className='mx-auto mt-10 font-extrabold' href='/'>{"<"}= Home </a>
      </div>
      <Fixtures />
    </div>
  )
}

export default Matches