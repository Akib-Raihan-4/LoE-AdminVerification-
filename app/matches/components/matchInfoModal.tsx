"use client"
import supabase from '@/config/supabase';
import React, { useState, useEffect } from 'react';

const MatchInfoModal = ({ homeTeamName, awayTeamName, isOpen, onClose }: any) => {
  const [homePlayerID, setHomePlayerID] = useState<any>([])
  const [awayPlayerID, setAwayPlayerID] = useState<any>([])

  useEffect(() => {
    const fetchPlayerID = async (homeTeamName: any, awayTeamName: any) => {
      const { data: homeID, error: homeError } = await supabase.from('PlayerTable')
        .select('id')
        .eq('teamName', homeTeamName)
      const { data: awayID, error: awayError } = await supabase.from('PlayerTable')
        .select('id')
        .eq('teamName', awayTeamName)

      if (homeError) {
        console.log('Error fetching home player ID', homeError)
        return
      }
      if (awayError) {
        console.log('Error fetching away player ID', homeError)
        return
      }
      setHomePlayerID(homeID)
      setAwayPlayerID(awayID)
    }
    fetchPlayerID(homeTeamName,awayTeamName)
  }, [])
  

  return (
    <div className={`modal ${isOpen ? 'is-open' : ''}`}>
      <div className="modal-content">
        {/* {console.log(homePlayerID)} */}
        <p>Home Team Name: {homeTeamName}</p>
        <p>Away Team Name: {awayTeamName}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MatchInfoModal;
