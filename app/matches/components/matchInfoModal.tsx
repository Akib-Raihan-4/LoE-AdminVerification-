"use client"
import supabase from '@/config/supabase';
import React, { useState, useEffect } from 'react';

const MatchInfoModal = ({ homeTeamName, awayTeamName, isOpen, onClose }: any) => {
  

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayerData = async (teamName:any, setPlayers:any) => {
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
    <div>
      <h2>{homeTeamName} Players</h2>
      {console.log(homePlayers)}
      <ul>
        {homePlayers.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>

      <h2>{awayTeamName} Players</h2>
      <ul>
        {awayPlayers.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>

      {/* Other content in your modal */}
    </div>
  );
};

export default MatchInfoModal;
