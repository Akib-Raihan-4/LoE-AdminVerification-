"use client"
import supabase from '@/config/supabase';
import React, { useState, useEffect } from 'react';

const MatchInfoModal = ({ homeTeamName, awayTeamName, isOpen, onClose }: any) => {


  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);


  const [homeGoals, setHomeGoals] = useState<any>({});
  const [homeOwnGoals, setHomeOwnGoals] = useState<any>({});
  const [awayGoals, setAwayGoals] = useState<any>({});
  const [awayOwnGoals, setAwayOwnGoals] = useState<any>({});

  const [homeTeamScore, setHomeTeamScore] = useState<any>(0);
  const [awayTeamScore, setAwayTeamScore] = useState<any>(0);


  useEffect(() => {
    const fetchPlayerData = async (teamName: any, setPlayers: any) => {
      const { data, error } = await supabase
        .from('PlayerTable')
        .select('id, name, goal, ownGoal')
        .eq('teamName', teamName);

      if (error) {
        console.log(`Error fetching player data for ${teamName}`, error);
        return;
      }

      setPlayers(data || []);
    };

    if (homeTeamName) {
      fetchPlayerData(homeTeamName, setHomePlayers);
    }

    if (awayTeamName) {
      fetchPlayerData(awayTeamName, setAwayPlayers);
    }
  }, [homeTeamName, awayTeamName]);


  useEffect(() => {
    // Calculate the home team score by summing up the goals from home team players
    const homeTeamGoals:any = Object.values(homeGoals).reduce(
      (total:any, goal:any) => total + parseInt(goal || 0),
      0
    );
  
    // Calculate the home team own goals from home team players
    const homeTeamOwnGoals:any = Object.values(homeOwnGoals).reduce(
      (total:any, ownGoal:any) => total + parseInt(ownGoal || 0),
      0
    );
  
    // Calculate the away team score by summing up the goals from away team players
    const awayTeamGoals:any = Object.values(awayGoals).reduce(
      (total:any, goal:any) => total + parseInt(goal || 0),
      0
    );
  
    // Calculate the away team own goals from away team players
    const awayTeamOwnGoals:any = Object.values(awayOwnGoals).reduce(
      (total:any, ownGoal:any) => total + parseInt(ownGoal || 0),
      0
    );
  
    // Calculate the final scores for both teams
    const homeTeamFinalScore = homeTeamGoals + awayTeamOwnGoals;
    const awayTeamFinalScore = awayTeamGoals + homeTeamOwnGoals;
  
    // Update the state variables with the final scores
    setHomeTeamScore(homeTeamFinalScore);
    setAwayTeamScore(awayTeamFinalScore);
  }, [homeGoals, homeOwnGoals, awayGoals, awayOwnGoals]);
  

  const updatePlayerStats = async (goals: any, ownGoals: any) => {
    const playerIds = Object.keys(goals);
    // console.log(playerIds)

    const updates = playerIds.map(async (playerId) => {
      const playerGoals = parseInt(goals[playerId] || 0);
      const playerOwnGoals = parseInt(ownGoals[playerId] || 0);
      const playerIdInt = parseInt(playerId);

      // console.log(playerGoals, playerId)

      const { data, error } = await supabase
        .from('PlayerTable')
        .select('goal, ownGoal')
        .eq('id', playerIdInt);

      if (error) {
        console.error(`Error fetching player data for id ${playerIdInt}:`, error);
        return;
      }

      const currentGoals = data[0].goal;
      // console.log(currentGoals)
      const currentOwnGoals = data[0].ownGoal;

      const updatedGoals = currentGoals + playerGoals;
      const updatedOwnGoals = currentOwnGoals + playerOwnGoals;
      console.log(updatedGoals)

      const { data: updateData, error: updateError } = await supabase
        .from('PlayerTable')
        .update({
          goal: updatedGoals,
          ownGoal: updatedOwnGoals,
        })
        .eq('id', playerIdInt);

      if (updateError) {
        console.error(`Error updating player stats for id ${playerIdInt}:`, updateError);
        return;
      }
    });
  };


  const handlePlayerStatsSubmit = () => {
    // console.log(homeGoals)
    // console.log(awayGoals)
    updatePlayerStats(homeGoals, homeOwnGoals);

    updatePlayerStats(awayGoals, awayOwnGoals);
    onClose();
  };


  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 bg-gray-900 ${isOpen ? 'block' : 'hidden'
        }`}
    >
      <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-center">Match Info</h2>
        <p className="text-xl font-bold text-center" >{homeTeamName} <span className='text-yellow-500'>{homeTeamScore}</span>  : <span className='text-yellow-500'>{awayTeamScore}</span> {awayTeamName}</p>
        <div className="mb-4">
          <h3 className="text-lg font-semibold my-10 text-center">{homeTeamName} Players</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-start pb-3">Player Name</th>
                <th className="text-start pb-3">Goal</th>
                <th className="text-start pb-3">Own Goal</th>
              </tr>
            </thead>
            <tbody>
              {homePlayers.map((player: any) => (
                <tr key={player.id}>
                  <td style={{ width: '300px' }}>{player.name}</td>
                  <td>
                    <input
                      type="number"
                      className="w-32 border rounded"
                      placeholder="Scored"
                      value={homeGoals[player.id]}
                      onChange={(e) => {
                        const updatedGoals = { ...homeGoals, [player.id]: e.target.value };
                        setHomeGoals(updatedGoals);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-32 border rounded"
                      placeholder="Own Goal"
                      value={homeOwnGoals[player.id]}
                      onChange={(e) => {
                        const updatedOwnGoals = { ...homeOwnGoals, [player.id]: e.target.value };
                        setHomeOwnGoals(updatedOwnGoals);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-lg font-semibold my-10 text-center">{awayTeamName} Players</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-start pb-3">Player Name</th>
                <th className="text-start pb-3">Goal</th>
                <th className="text-start pb-3">Own Goal</th>
              </tr>
            </thead>
            <tbody>
              {awayPlayers.map((player: any) => (
                <tr key={player.id}>
                  <td style={{ width: '300px' }}>{player.name}</td>
                  <td>
                    <input
                      type="number"
                      className="w-32 border rounded"
                      placeholder="Scored"
                      value={awayGoals[player.id]}
                      onChange={(e) => {
                        const updatedGoals = { ...awayGoals, [player.id]: e.target.value };
                        setAwayGoals(updatedGoals);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-32 border rounded"
                      placeholder="Own Goal"
                      value={awayOwnGoals[player.id]}
                      onChange={(e) => {
                        const updatedOwnGoals = { ...awayOwnGoals, [player.id]: e.target.value };
                        setAwayOwnGoals(updatedOwnGoals);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handlePlayerStatsSubmit}
          >
            Submit
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

};

export default MatchInfoModal;
