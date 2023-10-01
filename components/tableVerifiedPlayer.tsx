"use client"
import React, { useState, useEffect, useMemo } from 'react';
import supabase from '@/config/supabase';
import './table.css';

const TableVerifiedPlayer = () => {
 const [verifiedPlayers, setVerifiedPlayers] = useState<any>([]);
 const [searchInput, setSearchInput] = useState('');

 useEffect(() => {
  const fetchVerifiedPlayers = async () => {
   const { data, error } = await supabase
    .from('formPlayer')
    .select('name, id, transaction, paymentVia, email')
    .eq('verified', true);

   if (error) {
    console.error(error);
   } else {
    setVerifiedPlayers(data || []);
   }
  };

  fetchVerifiedPlayers();
 });

 const handleUnverifyPlayer = async (playerId:any) => {
  const { data, error } = await supabase
   .from('formPlayer')
   .update({ verified: false })
   .eq('id', playerId);

  if (error) {
   console.error(error);
  } else {
   setVerifiedPlayers(verifiedPlayers.filter((player:any) => player.id !== playerId));
  }
 };

 const filteredPlayers = verifiedPlayers.filter((player:any) =>
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
      <th>Email</th>
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
       <td>{player.email}</td>
       <td>{player.id}</td>
       <td>{player.transaction}</td>
       <td>{player.paymentVia}</td>
       <td>
        <button onClick={() => handleUnverifyPlayer(player.id)}>Unverify</button>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  );
 }, [filteredPlayers]);

 return (
  <div className="mt-10 max-h-[2px]">
   <h1 className="text-2xl my-8">Verified Player Accounts: {verifiedPlayers.length}</h1>
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
  </div>
 );
};

export default TableVerifiedPlayer