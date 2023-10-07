"use client"
import React, { useState, useEffect, useMemo } from 'react';
import supabase from '@/config/supabase';
import './table.css';

const TableVerifiedPlayer = () => {
 const [verifiedPlayers, setVerifiedPlayers] = useState<any>([]);
 const [searchInput, setSearchInput] = useState('');
 const [maleCount, setMaleCount] = useState<number>(0);
 const [femaleCount, setFemaleCount] = useState<number>(0);
 const [maleChecked, setMaleChecked] = useState(false);
 const [femaleChecked, setFemaleChecked] = useState(false);

 useEffect(() => {
  const fetchVerifiedPlayers = async () => {
   const { data, error } = await supabase
    .from('formPlayer')
    .select('name, id, transaction, paymentVia, email, gender')
    .eq('verified', true);

   if (error) {
    console.error(error);
   } else {
    setVerifiedPlayers(data || []);
   }
  };

  fetchVerifiedPlayers();
 });

 const handleUnverifyPlayer = async (playerId: any) => {
  const { data, error } = await supabase
   .from('formPlayer')
   .update({ verified: false })
   .eq('id', playerId);

  if (error) {
   console.error(error);
  } else {
   setVerifiedPlayers(verifiedPlayers.filter((player: any) => player.id !== playerId));
  }
 };

 const filteredPlayers = useMemo(() => {
    let filtered = verifiedPlayers.filter((player: any) =>
      String(player.name).toLowerCase().includes(searchInput.toLowerCase()) ||
      String(player.transaction).toLowerCase().includes(searchInput.toLowerCase()) ||
      String(player.id).toLowerCase().includes(searchInput.toLowerCase())
    );
  
    if (maleChecked) {
      filtered = filtered.filter((player: any) => player.gender === 'Male');
    }
  
    if (femaleChecked) {
      filtered = filtered.filter((player: any) => player.gender === 'Female');
    }
  
    return filtered;
   }, [verifiedPlayers, searchInput, maleChecked, femaleChecked]);


 useEffect(() => {
   const maleCount = filteredPlayers.filter((player: any) => player.gender === 'Male').length;
   const femaleCount = filteredPlayers.filter((player: any) => player.gender === 'Female').length;
   setMaleCount(maleCount);
   setFemaleCount(femaleCount);
 });

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
      <th>Gender</th>
      <th>Action</th>
     </tr>
    </thead>
    <tbody>
     {filteredPlayers.map((player: any) => (
      <tr key={player.id}>
       <td>{player.name}</td>
       <td>{player.email}</td>
       <td>{player.id}</td>
       <td>{player.transaction}</td>
       <td>{player.paymentVia}</td>
       <td>{player.gender}</td>
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
  <div className="mt-10">
   <h1 className="text-2xl my-8">Verified Player Accounts: {verifiedPlayers.length}</h1>
   <div className='flex justify-evenly mb-4'>
    <p> <span className='font-bold'> Male Players:</span> {maleCount}</p>
    <p><span className='font-bold'>Female Players:</span> {femaleCount}</p>
   </div>
   <div className='flex justify-evenly mb-4'>
    <label>
      Male
      <input type="checkbox" checked={maleChecked} onChange={() => setMaleChecked(!maleChecked)} />
    </label>
    <label>
      Female
      <input type="checkbox" checked={femaleChecked} onChange={() => setFemaleChecked(!femaleChecked)} />
    </label>
   </div>
   <div className='flex justify-center'>
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
    </div>
   {table}
  </div>
 );
};

export default TableVerifiedPlayer;
