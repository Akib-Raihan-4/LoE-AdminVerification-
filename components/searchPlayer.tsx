"use client"
import React, { useState, useEffect } from 'react';
import supabase from '@/config/supabase';

const SearchPlayer = () => {
  const [searchPlayerId, setSearchPlayerId] = useState('');
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (searchPlayerId.length <= 6 || searchTransactionId === '') {
      setVerificationStatus('');
      setIsVerified(false);
      return;
    }

    const fetchExistingId = async () => {
      const { data: existingData, error: existingError } = await supabase
        .from('formPlayer')
        .select('id, verified')
        .eq('id', searchPlayerId)
        .eq('transaction', searchTransactionId)
        .single();
      console.log(existingData)
      if (existingError) {
        console.error(existingError);
      } else if (existingData) {
        setIsVerified(existingData.verified);
        setVerificationStatus(existingData.verified ? 'Verified' : 'ID and TransactionID Matched');
      } else {
        setIsVerified(false);
        setVerificationStatus('ID or Transaction ID does not exist');
      }
    };

    fetchExistingId();
  }, [searchPlayerId, searchTransactionId]);

  const handleVerification = async () => {
    if (isVerified) {
      setVerificationStatus('ID already verified');
    } else if (verificationStatus === 'ID exists') {
      const { error: verError } = await supabase
        .from('formPlayer')
        .update({ verified: 'TRUE', created: new Date() })
        .eq('id', searchPlayerId)
        .eq('transaction', searchTransactionId);

      if (verError) {
        console.error(verError);
        setVerificationStatus('Verification failed');
      } else {
        setSearchPlayerId('');
        setSearchTransactionId('');
        setIsVerified(true);
      }
    } else {
      setVerificationStatus('Please enter a valid ID and Transaction ID');
    }
  };

  return (
    <div className='flex flex-col gap-6' >
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

      {verificationStatus && (
        <p className={verificationStatus === 'Verified' ? 'text-green-500' : 'text-red-500'}>
          {verificationStatus}
        </p>
      )}
    </div>
  );
};

export default SearchPlayer;
