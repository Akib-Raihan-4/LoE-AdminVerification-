"use client"
import React, { useState, useEffect } from 'react';
import supabase from '@/config/supabase';

const SearchPlayer = () => {
  const [searchPlayerId, setSearchPlayerId] = useState('');
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [playerData, setPlayerData] = useState<any>(null);

  useEffect(() => {
    if (searchPlayerId === '') {
      setVerificationStatus('');
      setIsVerified(false);
      setPlayerData(null);
      return;
    }

    const fetchPlayerInfo = async () => {
      const { data: existingData, error: existingError } = await supabase
        .from('formPlayer')
        .select('name, transaction')
        .eq('id', searchPlayerId)
        .single();

      if (existingError) {
        console.error(existingError);
        setIsVerified(false);
        // setVerificationStatus('ID does not match');
        setPlayerData(null);
      } else if (existingData) {
        setIsVerified(false); // Reset verification status
        // setVerificationStatus('ID matches');
        setPlayerData(existingData);
      } else {
        setIsVerified(false);
        // setVerificationStatus('ID does not exist');
        setPlayerData(null);
      }
    };

    fetchPlayerInfo();
  }, [searchPlayerId]);

  useEffect(() => {
    if (searchPlayerId === '' || searchTransactionId === '') {
      setIsVerified(false);
      return;
    }

    const verifyTransaction = async () => {
      const { data: existingData, error: existingError } = await supabase
        .from('formPlayer')
        .select('id, verified')
        .eq('id', searchPlayerId)
        .eq('transaction', searchTransactionId)
        .single();

      if (existingError) {
        console.error(existingError);
        setIsVerified(false);
        setVerificationStatus('ID does not match');
      } else if (existingData) {
        setIsVerified(existingData.verified);
        setVerificationStatus(existingData.verified ? 'Verified' : 'ID and Transaction ID match');
      } else {
        setIsVerified(false);
        setVerificationStatus('ID or Transaction ID does not exist');
      }
    };

    verifyTransaction();
  }, [searchPlayerId, searchTransactionId]);

  const handleVerification = async () => {
    if (isVerified) {
      setVerificationStatus('ID already verified');
    } else if (verificationStatus === 'ID and Transaction ID match') {
      const { error: verError } = await supabase
        .from('formPlayer')
        .update({ verified: true, created: new Date() })
        .eq('id', searchPlayerId)
        .eq('transaction', searchTransactionId);

      if (verError) {
        console.error(verError);
        setVerificationStatus('Verification failed');
      } else {
        setSearchPlayerId('');
        setSearchTransactionId('');
        setIsVerified(true);
        setVerificationStatus('Verified');
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } else {
      setVerificationStatus('Please enter a valid ID and Transaction ID');
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <input
        type="text"
        placeholder="Enter Player ID"
        value={searchPlayerId}
        onChange={(e) => setSearchPlayerId(e.target.value)}
        className="p-2 border border-gray-300 rounded text-black"
      />
      <input
        type="text"
        placeholder="Enter Transaction ID"
        value={searchTransactionId}
        onChange={(e) => setSearchTransactionId(e.target.value)}
        className="p-2 border border-gray-300 rounded text-black"
      />

      

      <button onClick={handleVerification} className="px-4 py-2 bg-blue-500 text-white rounded">
        Verify
      </button>

      {playerData && (
        <div>
          
          <p>Player Name: {playerData.name} </p>
          <p>TransactionID: {playerData.transaction}</p>
        </div>
      )}

      {showSuccessMessage && (
        <p className="text-green-500">Verification successful</p>
      )}

      {verificationStatus && !showSuccessMessage && (
        <p className={verificationStatus === 'Verified' ? 'text-green-500' : 'text-red-500'}>
          {verificationStatus}
        </p>
      )}
    </div>
  );
};

export default SearchPlayer;
