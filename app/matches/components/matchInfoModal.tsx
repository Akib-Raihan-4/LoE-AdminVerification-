"use client"
import supabase from '@/config/supabase';
import React, { useState, useEffect } from 'react';

const MatchInfoModal = ({ matchID, homeTeamName, awayTeamName, isOpen, onClose }: any) => {

  // console.log(matchID)
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);


  const [homeGoals, setHomeGoals] = useState<any>({});
  const [homeOwnGoals, setHomeOwnGoals] = useState<any>({});
  const [awayGoals, setAwayGoals] = useState<any>({});
  const [awayOwnGoals, setAwayOwnGoals] = useState<any>({});

  const [homeTeamScore, setHomeTeamScore] = useState<any>(0);
  const [awayTeamScore, setAwayTeamScore] = useState<any>(0);

  const [homeTeamGoals, setHomeTeamGoals] = useState<number>(0);
  const [awayTeamGoals, setAwayTeamGoals] = useState<number>(0);

  const [accumulatedGoals, setAccumulatedGoals] = useState<any>({ homeTeamGoals: 0, awayTeamGoals: 0 });


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
    const fetchInitialAccumulatedGoals = async () => {
      const { data, error } = await supabase
        .from('Fixture')
        .select('homeGoal, awayGoal')
        .eq('matchID', matchID)

      if (error) {
        console.error(`Error fetching initial accumulated goals:`, error);
        return;
      }

      console.log(data)

      const initialHomeGoals = data[0].homeGoal || 0;
      const initialAwayGoals = data[0].awayGoal || 0;

      setAccumulatedGoals({
        homeTeamGoals: initialHomeGoals,
        awayTeamGoals: initialAwayGoals,
      });
    };

    if (homeTeamName && awayTeamName) {
      fetchInitialAccumulatedGoals();
    }
  }, [homeTeamName, awayTeamName]);


  useEffect(() => {
    const homeTeamGoals: any = Object.values(homeGoals).reduce(
      (total: any, goal: any) => total + parseInt(goal || 0),
      0
    );

    const awayTeamGoals: any = Object.values(awayGoals).reduce(
      (total: any, goal: any) => total + parseInt(goal || 0),
      0
    );

    const homeTeamOwnGoals: any = Object.values(homeOwnGoals).reduce(
      (total: any, ownGoal: any) => total + parseInt(ownGoal || 0),
      0
    );

    const awayTeamOwnGoals: any = Object.values(awayOwnGoals).reduce(
      (total: any, ownGoal: any) => total + parseInt(ownGoal || 0),
      0
    );

    const homeTeamFinalScore = accumulatedGoals.homeTeamGoals + homeTeamGoals + awayTeamOwnGoals;
    const awayTeamFinalScore = accumulatedGoals.awayTeamGoals + awayTeamGoals + homeTeamOwnGoals;

    setHomeTeamScore(homeTeamFinalScore);
    setAwayTeamScore(awayTeamFinalScore);

  });


  const updatePlayerStats = async (goals: any, ownGoals: any) => {
    const playerIds = Object.keys({ ...goals, ...ownGoals });
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
      console.log(data[0])
      const currentOwnGoals = data[0].ownGoal;
      // console.log(currentOwnGoals)

      const updatedGoals = currentGoals + playerGoals;
      const updatedOwnGoals = currentOwnGoals + playerOwnGoals;
      // console.log(updatedGoals)

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



  const updateFinalMatchStats = async (homeTeamScore: any, awayTeamScore: any) => {

    let homeTeamOutcome;
    let awayTeamOutcome;

    if (homeTeamScore > awayTeamScore) {
      homeTeamOutcome = 'win';
      awayTeamOutcome = 'loss';
    } else if (homeTeamScore < awayTeamScore) {
      homeTeamOutcome = 'loss';
      awayTeamOutcome = 'win';
    } else {
      homeTeamOutcome = 'draw';
      awayTeamOutcome = 'draw';
    }

    // console.log(homeTeamOutcome, awayTeamOutcome)

    const winPoints = 3;
    const drawPoints = 1;
    const lossPoints = 0;

    const { data: homeTeamId, error: homeTeamIdError } = await supabase
      .from('Team')
      .select('id')
      .eq('teamName', homeTeamName)

    if (homeTeamIdError) {
      console.error('Error fetching home team id:', homeTeamIdError)
      return
    }

    let homeTeamID = homeTeamId[0].id
    // console.log(homeTeamID)

    // HOME TEAM UPDATES !!!!

    const { data: homeTeamData, error: homeTeamError } = await supabase
      .from('TeamTable')
      .select('played, won, lost, drawn, scored, conceded, difference, points')
      .eq('teamID', homeTeamID);

    if (homeTeamError) {
      console.error(`Error fetching home team data:`, homeTeamError);
      return;
    }

    const homeTeamStats = homeTeamData[0];
    // console.log(homeTeamStats)

    const updatedHomeTeamStats = {
      played: homeTeamStats.played + 1,
      scored: homeTeamStats.scored + homeTeamScore,
      conceded: homeTeamStats.conceded + awayTeamScore,
      difference: homeTeamStats.scored + homeTeamScore - homeTeamStats.conceded - awayTeamScore,
      points:
        homeTeamOutcome === 'win'
          ? homeTeamStats.points + winPoints
          : homeTeamOutcome === 'draw'
            ? homeTeamStats.points + drawPoints
            : homeTeamStats.points + lossPoints,
      won:
        homeTeamOutcome === 'win'
          ? homeTeamStats.won + 1
          : homeTeamStats.won + 0,
      drawn:
        homeTeamOutcome === 'draw'
          ? homeTeamStats.drawn + 1
          : homeTeamStats.drawn + 0,
      lost:
        homeTeamOutcome === 'loss'
          ? homeTeamStats.lost + 1
          : homeTeamStats.lost + 0,
    };

    // console.log(updatedHomeTeamStats)
    const { data: homeUpdateData, error: homeUpdateError } = await supabase
      .from('TeamTable')
      .update(updatedHomeTeamStats)
      .eq('teamID', homeTeamID);

    if (homeUpdateError) {
      console.error(`Error updating home team stats:`, homeUpdateError);
      return;
    }

    // AWAY TEAM UPDATES !!!!

    const { data: awayTeamId, error: awayTeamIdError } = await supabase
      .from('Team')
      .select('id')
      .eq('teamName', awayTeamName)

    if (awayTeamIdError) {
      console.error('Error fetching away team id:', awayTeamIdError)
      return
    }

    let awayTeamID = awayTeamId[0].id

    const { data: awayTeamData, error: awayTeamError } = await supabase
      .from('TeamTable')
      .select('played, won, lost, drawn, scored, conceded, difference, points')
      .eq('teamID', awayTeamID);

    if (awayTeamError) {
      console.error(`Error fetching away team data:`, awayTeamError);
      return;
    }

    const awayTeamStats = awayTeamData[0];

    const updatedAwayTeamStats = {
      played: awayTeamStats.played + 1,
      scored: awayTeamStats.scored + awayTeamScore,
      conceded: awayTeamStats.conceded + homeTeamScore,
      difference: awayTeamStats.scored + awayTeamScore - awayTeamStats.conceded - homeTeamScore,
      points:
        awayTeamOutcome === 'win'
          ? awayTeamStats.points + winPoints
          : awayTeamOutcome === 'draw'
            ? awayTeamStats.points + drawPoints
            : awayTeamStats.points + lossPoints,
      won:
        awayTeamOutcome === 'win'
          ? awayTeamStats.won + 1
          : awayTeamStats.won + 0,
      drawn:
        awayTeamOutcome === 'draw'
          ? awayTeamStats.drawn + 1
          : awayTeamStats.drawn + 0,
      lost:
        awayTeamOutcome === 'loss'
          ? awayTeamStats.lost + 1
          : awayTeamStats.lost + 0,
    };

    const { data: awayUpdateData, error: awayUpdateError } = await supabase
      .from('TeamTable')
      .update(updatedAwayTeamStats)
      .eq('teamID', awayTeamID);

    if (awayUpdateError) {
      console.error(`Error updating away team stats:`, awayUpdateError);
      return;
    }
  };

  const updateFixtureMatch = async (homeTeamScore: any, awayTeamScore: any) => {

    const { data, error } = await supabase
      .from('Fixture')
      .update({
        homeGoal:homeTeamScore,
        awayGoal:awayTeamScore
      })
      .eq('matchID', matchID)
    if(error){
      console.error('Error updating Fixture Match', error)
      return
    }
  }


  const handleMatchSubmit = () => {
    updatePlayerStats(homeGoals, homeOwnGoals);
    updatePlayerStats(awayGoals, awayOwnGoals);

    updateFixtureMatch(homeTeamScore, awayTeamScore)

  }


  const handlePlayerStatsSubmit = () => {
    // console.log(homeGoals)
    // console.log(awayGoals)
    updatePlayerStats(homeGoals, homeOwnGoals);
    updatePlayerStats(awayGoals, awayOwnGoals);

    updateFixtureMatch(homeTeamScore, awayTeamScore)

    updateFinalMatchStats(homeTeamScore, awayTeamScore);

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
        <div className="text-center mt-4 flex justify-evenly">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleMatchSubmit}
          >
            Match Updates
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={onClose}>
            Close
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handlePlayerStatsSubmit}
          >
            Final Submit
          </button>
        </div>
      </div>
    </div>
  );

};

export default MatchInfoModal;
