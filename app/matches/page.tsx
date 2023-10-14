import React from 'react'
import TeamTable from './components/teamTable'
const Matches = () => {
  return (
    <div className='w-screen sm:flex sm:flex-col justify-center gap-2 sm:w-[1440px] sm:mx-auto '>
      <TeamTable/>
    </div>
  )
}

export default Matches