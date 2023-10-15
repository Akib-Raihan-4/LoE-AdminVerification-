"use client"
import React, { useEffect, useState } from 'react';
import supabase from '@/config/supabase';
import TeamRow from './teamRow';


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
      <h1 className='text-center text-3xl font-bold mb-8'>Matches Updates</h1>
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
