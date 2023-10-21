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
      const { data, error } = await supabase.from('Fixture')
        .select('*')
        .order('matchID', { ascending: true });
      if (error) {
        console.error('Unsuccessful to fetch data', error);
        return;
      }
      setFixtureData(data || []);
    };
    fetchFixtureData();
  }, []);


  useEffect(() => {
    const fetchTeamName = async (teamID: any) => {
      const { data, error } = await supabase.from('Team').select('teamName').eq('id', teamID);
      if (error) {
        console.error('Fetch error for teamName', error);
        return;
      }
      if (data && data.length > 0) {
        const teamName = data[0].teamName;
        setTeamNames((prevNames: any) => ({
          ...prevNames,
          [teamID]: teamName,
        }));
      }
    };


    fixtureData.forEach((fixture: any) => {
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


  const handleOpenModal = (matchID: any, homeTeamName: any, awayTeamName: any) => {
    setSelectedMatch({ matchID, homeTeamName, awayTeamName });
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="grid sm:grid-cols-3 place-items-center sm:mt-20 my-10 gap-8">
      {fixtureData.length > 0 &&
        fixtureData.map((fixture:any) => (
          <div key={fixture.matchID}>
            <button
              className={`w-[300px] h-[150px] font-bold  ${fixture.played ? 'bg-red-300 text-gray-800' : 'bg-green-300 text-gray-500 hover:bg-green-400'
                } rounded-[20px]`}
              onClick={() => handleOpenModal(fixture.matchID, teamNames[fixture.home], teamNames[fixture.away])}
            >
              Match:
              <span className="text-green-950 text-lg font-bold">{` ${fixture.matchID}`}</span>
              <br />
              {teamNames[fixture.home]} <span className="font-extrabold text-gray-600">VS</span> {teamNames[fixture.away]}
            </button>
          </div>
        ))}

      {isModalOpen && (
        // <>
        //   {console.log(selectedMatch.matchID)}
        // </>
        <MatchInfoModal
          matchID={selectedMatch.matchID}
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
