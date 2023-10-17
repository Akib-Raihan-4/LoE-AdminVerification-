"use client"
import supabase from '@/config/supabase';
import React, { useEffect, useState } from 'react';
import MatchInfoModal from './matchInfoModal';

const Fixtures = () => {
  const [fixtureData, setFixtureData] = useState<any>([]);
  const [teamNames, setTeamNames] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [selectedMatch, setSelectedMatch] = useState<any>({});

  useEffect(() => {
    const fetchFixtureData = async () => {
      const { data, error } = await supabase.from('Fixture').select('*');
      if (error) {
        console.error('Unsuccessful to fetch data', error);
        return;
      }
      setFixtureData(data || []);
    };
    fetchFixtureData();
  }, []);

  useEffect(() => {
    const fetchTeamName = async (teamID:any) => {
      const { data, error } = await supabase.from('Team').select('teamName').eq('id', teamID);
      if (error) {
        console.error('Fetch error for teamName', error);
        return;
      }
      if (data && data.length > 0) {
        const teamName = data[0].teamName;
        setTeamNames((prevNames:any) => ({
          ...prevNames,
          [teamID]: teamName,
        }));
      }
    };

    fixtureData.forEach((fixture:any) => {
      const homeTeamID = fixture.home;
      const awayTeamID = fixture.away;

      if (!teamNames[homeTeamID]) {
        fetchTeamName(homeTeamID);
      }

      if (!teamNames[awayTeamID]) {
        fetchTeamName(awayTeamID);
      }
    });
  }, [fixtureData]);

  const handleOpenModal = (matchID:any, homeTeamName:any, awayTeamName:any) => {
    setSelectedMatch({ matchID, homeTeamName, awayTeamName });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-3 place-items-center mt-20">
      {fixtureData.length > 0 &&
        fixtureData.map((fixture:any) => (
          <div key={fixture.matchID}>
            <button
              className="w-[300px] h-[150px] bg-green-300 text-gray-500 rounded-[20px] font-bold hover:bg-green-400"
              onClick={() => handleOpenModal(fixture.matchID, teamNames[fixture.home], teamNames[fixture.away])}
            >
              Match:
              <span className="text-green-950 text-lg font-bold">
                {` ${fixture.matchID}`}
              </span>
              <br />
              {teamNames[fixture.home]} <span className="font-extrabold text-gray-600">VS</span> {teamNames[fixture.away]}
            </button>
          </div>
        ))}
      {isModalOpen && (
        <MatchInfoModal
          homeTeamName={selectedMatch.homeTeamName}
          awayTeamName={selectedMatch.awayTeamName}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Fixtures;
