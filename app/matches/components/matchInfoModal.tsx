"use client"
import supabase from '@/config/supabase';
import React, { useState, useEffect } from 'react';

const MatchInfoModal = ({ homeTeamName, awayTeamName, isOpen, onClose }: any) => {


  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayerData = async (teamName: any, setPlayers: any) => {
      const { data, error } = await supabase
        .from('PlayerTable')
        .select('id, name')
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


  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 bg-gray-900 ${isOpen ? 'block' : 'hidden'
        }`}
    >
      <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-center">Match Info</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold my-10 text-center">{homeTeamName} Players</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className='text-start pb-3' >Player Name</th>
                <th className='text-start pb-3'>Scored</th>
                <th className='text-start pb-3'>Own Goal</th>
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
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-32 border rounded"
                      placeholder="Own Goal"
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
                <th className='text-start pb-3' >Player Name</th>
                <th className='text-start pb-3'>Scored</th>
                <th className='text-start pb-3'>Own Goal</th>
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
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-32 border rounded"
                      placeholder="Own Goal"
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
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

};

export default MatchInfoModal;
