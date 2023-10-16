"use client"
import supabase from '@/config/supabase'
import React, { useEffect, useState } from 'react'

const Fixtures = () => {

  const [fixtureData, setFixtureData] = useState<any>([])
  const [teamNames, setTeamNames] = useState<any>({})

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


  const handleSubmit = () => {

  }

  return (
    <div className='grid grid-cols-3 place-items-center mt-20'>
      {fixtureData.length > 0 &&
        fixtureData.map((fixture: any) => (
          <div>
            <button key={fixture.matchID} className='w-[200px] h-[100px] bg-green-300 text-gray-500 rounded-[20px] font-bold'>Match: <span className='text-red-900 font-bold' onSubmit={handleSubmit}>{fixture.matchID}</span> <br /> {teamNames[fixture.home]} vs {teamNames[fixture.away]}</button>
          </div>
        ))
      }
      
    </div>
  )
}

export default Fixtures