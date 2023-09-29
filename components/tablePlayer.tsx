"use client"

import React, { useState, useEffect, useMemo } from 'react';
import supabase from '@/config/supabase';
import './table.css';

const TablePlayer = () => {
  const [unverifiedPlayers, setUnverifiedPlayers] = useState<any>([]);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchUnverifiedPlayers = async () => {
      const { data, error } = await supabase
        .from('formPlayer')
        .select('name, id, transaction, paymentVia')
        .eq('verified', false);

      if (error) {
        console.error(error);
      } else {
        setUnverifiedPlayers(data || []);
      }
    };
    fetchUnverifiedPlayers();
  });

  const handleVerifyPlayer = async (playerId:any) => {
    const { data, error } = await supabase
      .from('formPlayer')
      .update({ verified: true })
      .eq('id', playerId);
      
    if (error) {
      console.error(error);
      setVerificationStatus('Failed to verify player');
    } else {
      setVerificationStatus('Player verified successfully');

      setUnverifiedPlayers(unverifiedPlayers.filter((player:any) => player.id !== playerId));

      const timer = setInterval(() => {
        setVerificationStatus('');
        clearInterval(timer);
      }, 3000);
    }
  };

  
  const filteredPlayers = unverifiedPlayers.filter((player:any) =>
    String(player.name).toLowerCase().includes(searchInput.toLowerCase()) ||
    String(player.transaction).toLowerCase().includes(searchInput.toLowerCase()) ||
    String(player.id).toLowerCase().includes(searchInput.toLowerCase())
  );

  const table = useMemo(() => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Player ID</th>
            <th>Transaction ID</th>
            <th>Payment Via</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player:any) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.id}</td>
              <td>{player.transaction}</td>
              <td>{player.paymentVia}</td>
              <td>
                <button onClick={() => handleVerifyPlayer(player.id)}>Verify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [filteredPlayers]);

  return (
    <div className="mt-10 max-h-[2px]">
      <h1 className="text-2xl my-8">Unverified Player Accounts</h1>
      
      <input
        type="text"
        placeholder="Search by Name, ID, or Transaction ID"
        value={searchInput}
        style={{
            border: '1px solid #ccc', 
            height: '40px', 
            padding: '8px', 
            borderRadius: '4px', 
            marginBottom: '40px',
        }}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {table}
      {verificationStatus && <p>{verificationStatus}</p>}
    </div>
  );
};

export default TablePlayer;
