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
    const fetchPlayerInfo = async () => {
      let playerInfo = null;

      if (searchPlayerId !== '' && searchPlayerId.length >= 6) {
        const { data: playerData, error: playerError } = await supabase
          .from('formPlayer')
          .select('name, transaction, verified, id')
          .eq('id', searchPlayerId)
          .single();

        if (!playerError && playerData) {
          setIsVerified(playerData.verified);
          playerInfo = playerData;
        }
      }

      if (!playerInfo && searchTransactionId !== '' && searchTransactionId.length >= 4) {
        const { data: transactionData, error: transactionError } = await supabase
          .from('formPlayer')
          .select('name, transaction, verified, id')
          .eq('transaction', searchTransactionId)
          .single();

        if (!transactionError && transactionData) {
          setIsVerified(transactionData.verified);
          playerInfo = transactionData;
        }
      }

      if ((!playerInfo || (searchPlayerId.length < 6 && searchTransactionId.length < 4)) ||
          (searchPlayerId === '' && searchTransactionId === '')) {
        setPlayerData(null);
        setVerificationStatus('');
      } else {
        setPlayerData(playerInfo);
        setVerificationStatus(isVerified ? 'Verified' : '');
      }
    };

    fetchPlayerInfo();
  }, [searchPlayerId, searchTransactionId, isVerified]);

  const handleVerification = async () => {
    if (isVerified) {
      setVerificationStatus('ID already verified');
      setTimeout(() => {
        setVerificationStatus('');
      }, 3000); 
    } else if (verificationStatus === 'Verified') {
      setVerificationStatus('ID already verified');
      setTimeout(() => {
        setVerificationStatus('');
      }, 3000);
    } else {
      const { data: existingData, error: existingError } = await supabase
        .from('formPlayer')
        .select('id, verified')
        .eq('id', searchPlayerId)
        .eq('transaction', searchTransactionId)
        .single();

      if (existingError) {
        console.error(existingError);
        setVerificationStatus('Verification failed');
      } else if (existingData) {
        if (existingData.verified) {
          setVerificationStatus('ID already verified');
          setTimeout(() => {
            setVerificationStatus('');
          }, 3000); 
        } else {
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
            setPlayerData(null);
            setTimeout(() => {
              setShowSuccessMessage(false);
            }, 3000);
          }
        }
      } else {
        setVerificationStatus('ID or Transaction ID does not exist');
      }
    }
  };

  const handleInputBlur = () => {
    if (searchPlayerId === '' && searchTransactionId === '') {
      setIsVerified(false);
      setVerificationStatus('');
      setPlayerData(null);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <input
        type="text"
        placeholder="Enter Player ID"
        value={searchPlayerId}
        onChange={(e) => setSearchPlayerId(e.target.value)}
        onBlur={handleInputBlur}
        className="p-2 border border-gray-300 rounded text-black"
      />
      <input
        type="text"
        placeholder="Enter Transaction ID"
        value={searchTransactionId}
        onChange={(e) => setSearchTransactionId(e.target.value)}
        onBlur={handleInputBlur}
        className="p-2 border border-gray-300 rounded text-black"
      />

      <button onClick={handleVerification} className="px-4 py-2 bg-blue-500 text-white rounded">
        Verify
      </button>

      {playerData && (
        <div>
          <p>Player Name: {playerData.name} </p>
          <p>Player ID: {playerData.id} </p>
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

