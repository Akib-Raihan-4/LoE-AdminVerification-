"use client"
import React, { useState, useEffect, useMemo } from 'react';
import supabase from '@/config/supabase';
import './table.css';

const TableVerifiedPlayer = () => {
 const [verifiedPlayers, setVerifiedPlayers] = useState<any>([]);

 useEffect(() => {
  const fetchVerifiedPlayers = async () => {
   const { data, error } = await supabase
    .from('formPlayer')
    .select('name, id, transaction, paymentVia')
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
     {verifiedPlayers.map((player:any) => (
      <tr key={player.id}>
       <td>{player.name}</td>
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
 }, [verifiedPlayers]);

 return (
  <div className="mt-10 max-h-[2px]">
   <h1 className="text-2xl my-8">Verified Player Accounts</h1>
   {table}
  </div>
 );
};

export default TableVerifiedPlayer