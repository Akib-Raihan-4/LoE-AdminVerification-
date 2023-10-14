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

const TeamTable = () => {
  const [teams, setTeams] = useState<any>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from('TeamTable')
        .select('*')
        .order('teamID', { ascending: true });

      if (error) {
        console.error('Error fetching teams data', error);
        return;
      }

      setTeams(data || []);
 
    };

    fetchTeams();
  });

  const handleRowUpdate = async (updatedData:any) => {
    const { teamID, result, scored, conceded } = updatedData;
    // console.log(teamID)
  
    try {
      const { data: currentTeamData, error: fetchError } = await supabase
        .from('TeamTable')
        .select('*')
        .eq('teamID', teamID)
        .single();
  
      if (fetchError) {
        console.error('Error fetching team data:', fetchError);
        return;
      }

      console.log(teamID)
      
      let updatedPlayed = currentTeamData.played;
      let updatedWon = currentTeamData.won;
      let updatedDrawn = currentTeamData.drawn;
      let updatedLost = currentTeamData.lost;
      let updatedScored = currentTeamData.scored + parseInt(scored, 10);
      let updatedConceded = currentTeamData.conceded + parseInt(conceded, 10);
  
      if (result === 'win') {
        updatedWon += 1;
        updatedPlayed += 1;
      } else if (result === 'draw') {
        updatedDrawn += 1;
        updatedPlayed += 1;
      } else if (result === 'loss') {
        updatedLost += 1;
        updatedPlayed += 1;
      }
  
      const updatedDifference = updatedScored - updatedConceded;
      const updatedPoints = updatedWon * 3 + updatedDrawn;
  
      
      const { data: updateData, error: updateError } = await supabase
        .from('TeamTable')
        .update({
          played: updatedPlayed,
          won: updatedWon,
          drawn: updatedDrawn,
          lost: updatedLost,
          scored: updatedScored,
          conceded: updatedConceded,
          difference: updatedDifference,
          points: updatedPoints,
        })
        .eq('teamID', teamID);
  
      if (updateError) {
        console.error('Error updating team:', updateError);
      } else {
        console.log('Team updated successfully:', updateData);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  return (
    <div className='bg-gray-100 p-8'>
      <h1 className='text-center text-3xl font-bold mb-8'>Admin Dashboard</h1>
      <table className='w-full'>
        <thead className='bg-blue-500 text-white'>
          <tr>
            <th className='py-2'>Team Name</th>
            <th className='py-2'>Result</th>
            <th className='py-2'>Scored</th>
            <th className='py-2'>Conceded</th>
            <th className='py-2'>Update</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team:any) => (
            <TeamRow key={team.teamID} team={team} onUpdate={handleRowUpdate} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
