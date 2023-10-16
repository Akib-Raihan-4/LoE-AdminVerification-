"use client"
import supabase from '@/config/supabase'
import React, { useEffect, useState } from 'react'
import MatchInfoModal from './matchInfoModal'

const Fixtures = () => {

  const [fixtureData, setFixtureData] = useState<any>([])
  const [teamNames, setTeamNames] = useState<any>({})
  const [isModalOpen, setIsModalOpen] = useState<any>(false)
  const [selectedMatch, setSelectedMatch] = useState<any>([])

  useEffect(() => {
    const fetchFixtureData = async () => {

      const { data, error } = await supabase.from('Fixture')
        .select("*")

      if (error) {
        console.error('Unsuccessfull to fetch data', error)
        return
      }
      setFixtureData(data || [])
      // console.log(fixtureData.length)
    };
    fetchFixtureData();
  }, [])

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


  const handleOpenModal = (matchID: any, homeTeamID: any, awayTeamID: any) => {
    setSelectedMatch({ matchID, homeTeamID, awayTeamID });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className='grid grid-cols-3 place-items-center mt-20'>
      {fixtureData.length > 0 &&
        fixtureData.map((fixture: any) => (
          <div key={fixture.matchID}>
            <button className='w-[200px] h-[100px] bg-green-300 text-gray-500 rounded-[20px] font-bold' onClick={() => handleOpenModal(fixture.matchID, fixture.home, fixture.away)}>Match:
              <span className='text-red-900 font-bold'>
                {fixture.matchID}
              </span>
              <br />
              {teamNames[fixture.home]} vs {teamNames[fixture.away]}
            </button>
          </div>
        ))
      }
      {isModalOpen &&
        <MatchInfoModal
          homeTeamID={selectedMatch?.homeTeamID}
          awayTeamID={selectedMatch?.awayTeamID}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      }

    </div>
  )
}

export default Fixtures