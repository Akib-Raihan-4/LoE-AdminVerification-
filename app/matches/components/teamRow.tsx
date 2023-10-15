
"use client"
import React, { useEffect, useState } from 'react';
import supabase from '@/config/supabase';

const TeamRow = ({ team , onUpdate }:any) => {
    const [result, setResult] = useState('');
    const [scored, setScored] = useState('0');
    const [conceded, setConceded] = useState('0');
  
    const handleUpdate = () => {
      // console.log(team.teamID)
      onUpdate({
        teamID: team.teamID,
        result,
        scored,
        conceded,
      });
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
            Submit
          </button>
        </td>
      </tr>
    );
};

export default TeamRow