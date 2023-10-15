
"use client"
import React, { useEffect, useState } from 'react';

const TeamRow = ({ team , onUpdate }:any) => {
    const [result, setResult] = useState('');
    const [scored, setScored] = useState('0');
    const [conceded, setConceded] = useState('0');
    const [successButton, setSuccessButton] = useState('Submit')
  
    const handleUpdate = async () => {
      try {
        await onUpdate({
          teamID: team.teamID,
          result,
          scored,
          conceded,
        });
    
        setResult('') 
        setScored('0') 
        setConceded('0')
        setSuccessButton('Submitted')
        setTimeout(() =>{
          setSuccessButton('Submit')
        },3000)
        
      } catch (error) {
        console.error('Error updating team:', error);
      }
    };
    
  
    return (
      <tr key={team.teamID} className='bg-white hover:bg-gray-100'>
        <td className='py-2 pl-16'>{team.teamName}</td>
        <td className='py-2'>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className='w-full p-2 border border-gray-400 rounded'
          >
            <option value=''>Select Result</option>
            <option value='win'>Win</option>
            <option value='draw'>Draw</option>
            <option value='loss'>Loss</option>
          </select>
        </td>
        <td className='py-2'>
          <input
            type='number'
            placeholder='Scored'
            value={scored}
            onChange={(e) => setScored(e.target.value)}
            className='w-full p-2 border border-gray-400 rounded'
          />
        </td>
        <td className='py-2'>
          <input
            type='number'
            placeholder='Conceded'
            value={conceded}
            onChange={(e) => setConceded(e.target.value)}
            className='w-full p-2 border border-gray-400 rounded'
          />
        </td>
        <td className='py-2'>
          <button
            onClick={handleUpdate}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            {successButton}
          </button>
        </td>
      </tr>
    );
};

export default TeamRow