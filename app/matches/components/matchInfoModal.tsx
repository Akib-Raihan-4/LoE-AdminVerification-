// MatchInfoModal.js
import React from 'react';

const MatchInfoModal = ({ homeTeamID, awayTeamID, isOpen, onClose }:any) => {
  return (
    <div className={`modal ${isOpen ? 'is-open' : ''}`}>
      <div className="modal-content">
        {/* Display match information and team details here */}
        <p>Home Team ID: {homeTeamID}</p>
        <p>Away Team ID: {awayTeamID}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MatchInfoModal;
